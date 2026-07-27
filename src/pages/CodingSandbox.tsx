/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { CODING_CHALLENGES, CodingChallenge } from '../data/challenges';
import { 
  Play, CheckCircle2, RotateCcw, HelpCircle, AlertCircle, Sparkles, 
  Terminal, Lightbulb, ChevronLeft, ChevronRight, Code, Trophy, 
  Cloud, CloudLightning, Database, Save, Check, Key, Eye, EyeOff
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { isFirebaseConfigured, getFirebaseConfig, syncProgressToCloud, loginWithGoogle } from '../lib/firebase';
import { PrismEditor } from '../components/PrismEditor';

export const CodingSandbox: React.FC = () => {
  const { lang, isRtl, theme, progress, unlockAchievement, saveProgressState } = useApp();
  
  // Selection state
  const [challenges, setChallenges] = useState<CodingChallenge[]>(CODING_CHALLENGES);
  const [activeIdx, setActiveIdx] = useState(0);
  const activeChallenge = challenges[activeIdx];

  const getChallengeTitle = (item: CodingChallenge) => {
    if (lang === 'ar') return item.titleAr;
    if (lang === 'es' && item.titleEs) return item.titleEs;
    return item.titleEn;
  };

  const getChallengeDesc = (item: CodingChallenge) => {
    if (lang === 'ar') return item.descAr;
    if (lang === 'es' && item.descEs) return item.descEs;
    return item.descEn;
  };

  const getChallengeHint = (item: CodingChallenge) => {
    if (lang === 'ar') return item.hintAr;
    if (lang === 'es' && item.hintEs) return item.hintEs;
    return item.hintEn;
  };

  // Editor code state
  const [code, setCode] = useState(activeChallenge.boilerplateCode);
  const [showHint, setShowHint] = useState(false);
  
  // Console / Testing outputs
  const [consoleLogs, setConsoleLogs] = useState<string[]>([]);
  const [testResult, setTestResult] = useState<{ status: 'idle' | 'success' | 'error'; message: string }>({ status: 'idle', message: '' });
  const [isRunning, setIsRunning] = useState(false);
  
  // Scoring / Accomplishment state
  const [completedChallenges, setCompletedChallenges] = useState<string[]>(() => {
    const saved = localStorage.getItem('assess-completed-challenges-v1');
    return saved ? JSON.parse(saved) : [];
  });

  // Firebase Setup Modal / Panel inside Sandbox
  const [showCloudSettings, setShowCloudSettings] = useState(false);
  const [customFirebaseConfig, setCustomFirebaseConfig] = useState(() => {
    return localStorage.getItem('firebase-custom-config') || '';
  });
  const [isFirebaseSynced, setIsFirebaseSynced] = useState(false);
  const [firebaseStatusMessage, setFirebaseStatusMessage] = useState('');
  const [isFbConfigured, setIsFbConfigured] = useState(isFirebaseConfigured());
  const [currentUser, setCurrentUser] = useState<any>(null);

  // Sync code whenever active challenge changes
  useEffect(() => {
    setCode(activeChallenge.boilerplateCode);
    setConsoleLogs([]);
    setTestResult({ status: 'idle', message: '' });
    setShowHint(false);
  }, [activeIdx, activeChallenge]);

  // Handle saving completed challenge progress locally & syncing to Firebase
  const handleMarkChallengeCompleted = async (challengeId: string, earnedPoints: number) => {
    if (completedChallenges.includes(challengeId)) return;
    
    const updated = [...completedChallenges, challengeId];
    setCompletedChallenges(updated);
    localStorage.setItem('assess-completed-challenges-v1', JSON.stringify(updated));

    // Award bonus achievements
    unlockAchievement('ach-speedster'); // sandbox bonus trigger
    if (updated.length >= 3) {
      unlockAchievement('ach-streak-3');
    }

    // Attempt Firebase sync if configured and user is signed in
    if (isFbConfigured && currentUser) {
      try {
        setFirebaseStatusMessage('Syncing coding achievements to Firestore...');
        await syncProgressToCloud(currentUser.uid, {
          ...progress,
          achievements: [...progress.achievements, `challenge-${challengeId}`]
        });
        setFirebaseStatusMessage('Successfully synced with Firestore cloud!');
        setIsFirebaseSynced(true);
      } catch (e) {
        setFirebaseStatusMessage('Could not sync with cloud: ' + (e instanceof Error ? e.message : String(e)));
      }
    }
  };

  // Run user code for preview (HTML/CSS) or standard eval
  const runPreview = () => {
    setIsRunning(true);
    setConsoleLogs([`[System]: Initializing runtime environment...`]);
    setTestResult({ status: 'idle', message: '' });

    setTimeout(() => {
      if (activeChallenge.category === 'css' || activeChallenge.category === 'html') {
        setConsoleLogs((prev) => [...prev, `[Renderer]: Rendered HTML and styles into isolated sandbox viewport.`]);
      } else {
        // Javascript Code Evaluation with custom console mock
        const capturedLogs: string[] = [];
        const customConsole = {
          log: (...args: any[]) => {
            capturedLogs.push(args.map(arg => typeof arg === 'object' ? JSON.stringify(arg) : String(arg)).join(' '));
          },
          error: (...args: any[]) => {
            capturedLogs.push(`[Error]: ${args.join(' ')}`);
          },
          warn: (...args: any[]) => {
            capturedLogs.push(`[Warn]: ${args.join(' ')}`);
          }
        };

        try {
          // Construct sandbox function with captured console
          const runner = new Function('console', 'React', `${code}\n// Run sample cases if defined\nif (typeof fizzBuzz === "function") {\n  console.log("fizzBuzz(15) output preview: " + JSON.stringify(fizzBuzz(15).slice(0, 5)) + "...");\n}`);
          runner(customConsole, React);
          setConsoleLogs((prev) => [
            ...prev,
            ...capturedLogs,
            `[System]: Execution finished successfully.`
          ]);
        } catch (error: any) {
          setConsoleLogs((prev) => [
            ...prev,
            ...capturedLogs,
            `[Runtime Exception]: ${error.message}`
          ]);
        }
      }
      setIsRunning(false);
    }, 400);
  };

  // Run interactive assert test assertions
  const runAssertions = async () => {
    setIsRunning(true);
    setTestResult({ status: 'idle', message: '' });
    setConsoleLogs([`[System]: Starting Automated Developer Assertions...`]);

    setTimeout(async () => {
      try {
        if (activeChallenge.category === 'css' || activeChallenge.category === 'html') {
          // Verify CSS/HTML via hidden iframe assessment
          const iframe = document.createElement('iframe');
          iframe.style.display = 'none';
          document.body.appendChild(iframe);
          
          iframe.contentWindow!.document.open();
          iframe.contentWindow!.document.write(code);
          iframe.contentWindow!.document.close();

          // Wait brief delay for styles to load in iframe DOM
          await new Promise(resolve => setTimeout(resolve, 100));

          // Run tests in the context of the iframe
          const testFunc = new Function('document', 'window', activeChallenge.testCode);
          testFunc(iframe.contentWindow!.document, iframe.contentWindow);
          
          document.body.removeChild(iframe);
        } else {
          // Verify JavaScript algorithms
          const testFunc = new Function('React', `${code}\n${activeChallenge.testCode}`);
          const res = testFunc(React);
          
          // Handle promise resolution (like debounce challenge)
          if (res instanceof Promise) {
            await res;
          }
        }

        // Successfully Passed!
        setTestResult({
          status: 'success',
          message: lang === 'en' 
            ? `Fantastic! Code passed all requirements. (+${activeChallenge.points} XP)`
            : `رائع ومبهر! كودك اجتاز كافة شروط الاختبار بنجاح. (+${activeChallenge.points} نقطة خبرة)`
        });
        setConsoleLogs((prev) => [...prev, `[Assertions]: PASSED. All strict requirements satisfied.`]);
        
        // Save progress
        handleMarkChallengeCompleted(activeChallenge.id, activeChallenge.points);

      } catch (error: any) {
        setTestResult({
          status: 'error',
          message: error.message || 'Assertion check failed. Please review your code.'
        });
        setConsoleLogs((prev) => [...prev, `[Assertions]: FAILED. Reason: ${error.message}`]);
      } finally {
        setIsRunning(false);
      }
    }, 600);
  };

  // Save custom Firebase keys pasted in control panel
  const handleSaveFirebaseConfig = () => {
    if (!customFirebaseConfig.trim()) {
      localStorage.removeItem('firebase-custom-config');
      setIsFbConfigured(false);
      setFirebaseStatusMessage('Firebase custom configuration cleared.');
      return;
    }

    try {
      // Validate JSON structure
      const parsed = JSON.parse(customFirebaseConfig);
      if (!parsed.apiKey || !parsed.projectId) {
        throw new Error('Config is missing key items like apiKey or projectId.');
      }
      localStorage.setItem('firebase-custom-config', JSON.stringify(parsed));
      setIsFbConfigured(true);
      setFirebaseStatusMessage('Success! Custom Firebase config saved successfully.');
    } catch (e: any) {
      setFirebaseStatusMessage('Invalid configuration! Make sure it is a valid JSON object. Error: ' + e.message);
    }
  };

  // Authenticate user via popup Google login
  const handleGoogleLogin = async () => {
    try {
      setFirebaseStatusMessage('Connecting to Google accounts service...');
      const creds = await loginWithGoogle();
      if (creds && creds.user) {
        setCurrentUser(creds.user);
        setFirebaseStatusMessage(`Signed in as ${creds.user.displayName || creds.user.email}!`);
        setIsFirebaseSynced(true);
      }
    } catch (e: any) {
      setFirebaseStatusMessage('Google Login failed: ' + e.message);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8" id="coding-sandbox-view">
      
      {/* Header Info Block */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4 border-b border-slate-800/80 pb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 bg-amber-500/10 text-amber-500 border border-amber-500/20 text-xs font-bold rounded-full uppercase tracking-wider">
              {lang === 'en' ? 'Interactive Coding Sandbox' : 'ملعب الأكواد التفاعلي'}
            </span>
            <div className="flex items-center gap-1.5 text-xs text-slate-400">
              <Trophy className="w-4 h-4 text-amber-400" />
              <span>{completedChallenges.length} / {challenges.length} Solved</span>
            </div>
          </div>
          <h1 className="text-3xl font-extrabold text-white mt-2 tracking-tight">
            {lang === 'en' ? 'Prove You Are A Real Programmer' : 'أثبت أنك مبرمج حقيقي'}
          </h1>
          <p className="text-slate-400 text-sm mt-1 max-w-2xl">
            {lang === 'en' 
              ? 'Complete live coding tasks to test your problem-solving, clean structures, specific CSS, and advanced logical pipelines in real-time.'
              : 'أكمل مهامًا برمجية مباشرة لاختبار قدرتك على حل المشكلات، وصياغة هياكل CSS دقيقة، وبناء دالات جافا سكريبت متقدمة بالوقت الفعلي.'}
          </p>
        </div>

        {/* Firebase Synchronization Shortcut Controls */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowCloudSettings(!showCloudSettings)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-xs font-bold cursor-pointer transition-all ${
              isFbConfigured 
                ? 'bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border-emerald-500/20'
                : 'bg-slate-900 hover:bg-slate-800 text-amber-500 border-slate-800'
            }`}
          >
            {isFbConfigured ? <Cloud className="w-4 h-4 text-emerald-400" /> : <Database className="w-4 h-4 text-amber-500" />}
            <span>
              {isFbConfigured 
                ? (lang === 'en' ? 'Cloud Connected' : 'سحابة فايربيز متصلة')
                : (lang === 'en' ? 'Connect Firebase' : 'ربط قاعدة فايربيز')
              }
            </span>
          </button>
        </div>
      </div>

      {/* Firebase Config Drawer */}
      <AnimatePresence>
        {showCloudSettings && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden bg-slate-900/80 border border-slate-800 rounded-2xl p-6 mb-6 backdrop-blur-md"
            id="firebase-config-panel"
          >
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
              <div className="space-y-2 flex-1">
                <div className="flex items-center gap-2 text-white font-bold">
                  <Database className="w-5 h-5 text-amber-500" />
                  <span>{lang === 'en' ? 'Firebase Cloud Sync Control Panel' : 'لوحة تحكم مزامنة فايربيز السحابية'}</span>
                </div>
                <p className="text-xs text-slate-400 max-w-xl">
                  {lang === 'en'
                    ? 'Connect your real Firebase project to save certificates and programming scores. Paste your Web App Configuration JSON below to establish an authentic connection.'
                    : 'اربط مشروع Firebase الحقيقي الخاص بك لحفظ شهاداتك ونقاط تقدمك البرمجي. ألصق كود تهيئة تطبيق الويب (Config JSON) أدناه لتأسيس اتصال حقيقي.'}
                </p>

                <textarea
                  value={customFirebaseConfig}
                  onChange={(e) => setCustomFirebaseConfig(e.target.value)}
                  placeholder={`{\n  "apiKey": "AIzaSy...",\n  "authDomain": "my-app.firebaseapp.com",\n  "projectId": "my-app",\n  "appId": "..."\n}`}
                  dir="ltr"
                  className="w-full h-28 bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs font-mono text-amber-400 focus:outline-none focus:border-amber-500 mt-2"
                />

                <div className="flex flex-wrap gap-2 pt-2">
                  <button
                    onClick={handleSaveFirebaseConfig}
                    className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs rounded-lg transition-colors cursor-pointer"
                  >
                    {lang === 'en' ? 'Save Configuration' : 'حفظ وإعداد التهيئة'}
                  </button>

                  {isFbConfigured && (
                    <button
                      onClick={handleGoogleLogin}
                      className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs rounded-lg transition-colors cursor-pointer flex items-center gap-1.5"
                    >
                      <Key className="w-3.5 h-3.5 text-amber-400" />
                      <span>{lang === 'en' ? 'Login with Google Accounts' : 'تسجيل دخول بحساب Google'}</span>
                    </button>
                  )}
                </div>

                {firebaseStatusMessage && (
                  <p className="text-xs text-slate-300 bg-slate-950/50 p-2 rounded-lg border border-slate-800/60 mt-3 font-mono">
                    💡 Status: {firebaseStatusMessage}
                  </p>
                )}
              </div>

              <div className="bg-slate-950/60 p-4 border border-slate-800 rounded-xl w-full md:w-80 text-xs space-y-2">
                <div className="font-bold text-white uppercase tracking-wider text-[10px] text-slate-400 mb-1">
                  {lang === 'en' ? 'Firestore Collections Blueprint' : 'مخطط مجموعات قاعدة البيانات'}
                </div>
                <div className="space-y-2 font-mono text-[11px]">
                  <div className="flex items-center justify-between text-slate-300">
                    <span>📂 /users/&#123;userId&#125;</span>
                    <span className="text-emerald-500">Read/Write</span>
                  </div>
                  <div className="text-[10px] text-slate-500 border-l border-slate-800 pl-2 leading-relaxed">
                    Saves full assessment histories, achievements, bookmarks and username tied to Firebase UID.
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8" id="sandbox-main-layout">
        
        {/* Left Side: Challenge selection lists and descriptive tasks */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Challenge Selector */}
          <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 px-2">
              {lang === 'en' ? 'Select Coding Task' : 'اختر المهمة البرمجية'}
            </h3>
            <div className="space-y-1.5">
              {challenges.map((item, idx) => {
                const isCompleted = completedChallenges.includes(item.id);
                const isActive = idx === activeIdx;

                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveIdx(idx)}
                    className={`w-full text-left p-3 rounded-xl transition-all border flex items-center justify-between cursor-pointer ${
                      isActive 
                        ? 'bg-amber-500/10 border-amber-500/30 text-white shadow-sm'
                        : 'bg-transparent border-transparent text-slate-400 hover:bg-slate-800/40 hover:text-white'
                    }`}
                  >
                    <div className="min-w-0 pr-2">
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-wide flex items-center gap-1.5">
                        <span className={`w-1.5 h-1.5 rounded-full ${
                          item.difficulty === 'easy' ? 'bg-emerald-500' :
                          item.difficulty === 'medium' ? 'bg-amber-500' :
                          item.difficulty === 'hard' ? 'bg-rose-500' : 'bg-fuchsia-600'
                        }`} />
                        {item.difficulty}
                      </p>
                      <p className="text-sm font-semibold truncate mt-0.5">
                        {getChallengeTitle(item)}
                      </p>
                    </div>

                    <div className="flex items-center gap-1.5 flex-shrink-0">
                      {isCompleted ? (
                        <CheckCircle2 className="w-5 h-5 text-emerald-400 fill-emerald-500/10" />
                      ) : (
                        <span className="text-xs font-mono text-amber-500 bg-amber-500/10 px-2 py-0.5 rounded-md border border-amber-500/20">
                          +{item.points}
                        </span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Detailed Challenge Instructions */}
          <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-5 space-y-4">
            <div>
              <div className="flex items-center justify-between">
                <span className="px-2 py-0.5 bg-slate-950 text-slate-400 border border-slate-800/80 text-[10px] font-mono rounded uppercase">
                  {activeChallenge.category}
                </span>
                <span className="text-xs font-semibold text-slate-400">
                  {lang === 'ar' ? 'قواعد التحدي' : (lang === 'es' ? 'Reglas del Desafío' : 'Challenge Rules')}
                </span>
              </div>
              <h2 className="text-xl font-extrabold text-white mt-2">
                {getChallengeTitle(activeChallenge)}
              </h2>
            </div>

            <p className="text-sm text-slate-300 leading-relaxed bg-slate-950/40 p-3 rounded-xl border border-slate-800/50">
              {getChallengeDesc(activeChallenge)}
            </p>

            {/* Hint Box toggler */}
            <div>
              <button
                onClick={() => setShowHint(!showHint)}
                className="flex items-center gap-1.5 text-xs text-amber-500 hover:text-amber-400 font-bold transition-colors cursor-pointer"
              >
                <HelpCircle className="w-4 h-4" />
                <span>
                  {showHint 
                    ? (lang === 'ar' ? 'إخفاء التلميح المساعد' : (lang === 'es' ? 'Ocultar Pista' : 'Hide Hint')) 
                    : (lang === 'ar' ? 'هل تحتاج مساعدة؟' : (lang === 'es' ? '¿Necesitas una pista?' : 'Need a hint?'))}
                </span>
              </button>

              <AnimatePresence>
                {showHint && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="overflow-hidden mt-2 bg-amber-500/5 border border-amber-500/10 p-3 rounded-lg text-xs text-amber-400 leading-relaxed flex items-start gap-2"
                  >
                    <Lightbulb className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" />
                    <p>{getChallengeHint(activeChallenge)}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

        </div>

        {/* Right Side: Interactive terminal sandbox and live textarea code editor */}
        <div className="lg:col-span-8 flex flex-col space-y-6">
          
          {/* Main IDE-Terminal look Code Editor wrapper */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl flex flex-col flex-1 min-h-[450px]">
            
            {/* Editor Top Control Bar */}
            <div className="bg-slate-950 px-4 py-3 border-b border-slate-800/60 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="flex gap-1.5">
                  <span className="w-3 h-3 rounded-full bg-rose-500/80" />
                  <span className="w-3 h-3 rounded-full bg-amber-500/80" />
                  <span className="w-3 h-3 rounded-full bg-emerald-500/80" />
                </div>
                <span className="text-xs font-mono text-slate-400 ml-3 flex items-center gap-1">
                  <Code className="w-3.5 h-3.5 text-amber-500" />
                  main.{activeChallenge.category === 'css' || activeChallenge.category === 'html' ? 'html' : 'js'}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCode(activeChallenge.boilerplateCode)}
                  className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-all cursor-pointer"
                  title="Reset Boilerplate Code"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Editor Text Area with Lightweight Prism Syntax Highlighting */}
            <PrismEditor
              value={code}
              onChange={setCode}
              language={activeChallenge.category}
            />

            {/* Bottom Controls Bar */}
            <div className="bg-slate-950 px-4 py-3.5 border-t border-slate-800/60 flex flex-wrap items-center justify-between gap-3">
              <div className="text-xs text-slate-400">
                {lang === 'en' ? 'Click "Run Code" first to test outputs manually.' : 'اضغط "تشغيل الكود" أولاً لمعاينة المخرجات.'}
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={runPreview}
                  disabled={isRunning}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs rounded-xl transition-all cursor-pointer flex items-center gap-1.5 border border-slate-700 disabled:opacity-50"
                >
                  <Play className="w-3.5 h-3.5" />
                  <span>{lang === 'en' ? 'Run Code' : 'تشغيل الكود'}</span>
                </button>

                <button
                  onClick={runAssertions}
                  disabled={isRunning}
                  className="px-5 py-2.5 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-slate-950 font-extrabold text-xs rounded-xl transition-all shadow-md shadow-amber-500/10 cursor-pointer flex items-center gap-1.5 disabled:opacity-50"
                >
                  <CheckCircle2 className="w-4 h-4 text-slate-950" />
                  <span>{lang === 'en' ? 'Run Assert Tests' : 'تشغيل الاختبارات التلقائية'}</span>
                </button>
              </div>
            </div>

          </div>

          {/* Lower Panel: Live CSS Viewport or JS Console Output terminal */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Live Terminal Console Logs */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col min-h-[200px]">
              <div className="flex items-center gap-1.5 text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                <Terminal className="w-4 h-4 text-slate-500" />
                <span>{lang === 'en' ? 'Console Logs' : 'سجل مخرجات الكونسول'}</span>
              </div>
              
              <div className="flex-grow bg-slate-950 border border-slate-800 rounded-lg p-3 font-mono text-xs leading-relaxed overflow-y-auto space-y-1.5 text-slate-300">
                {consoleLogs.length === 0 ? (
                  <p className="text-slate-600 italic">No output logs yet. Write code and hit "Run".</p>
                ) : (
                  consoleLogs.map((log, i) => (
                    <div 
                      key={i} 
                      className={`whitespace-pre-wrap ${
                        log.startsWith('[Error]') || log.startsWith('[Runtime Exception]') ? 'text-red-400' :
                        log.startsWith('[System]') ? 'text-blue-400' :
                        log.startsWith('[Assertions]') ? 'text-emerald-400' : 'text-slate-300'
                      }`}
                    >
                      {log}
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Test Result card / Live Output sandbox element */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col min-h-[200px]">
              
              <div className="flex items-center gap-1.5 text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                <Sparkles className="w-4 h-4 text-amber-500" />
                <span>{lang === 'en' ? 'Test Result / Sandbox' : 'نتيجة الفحص والمعاينة المباشرة'}</span>
              </div>

              {/* Render dynamic iframe box for HTML/CSS tasks, else show clear status */}
              {(activeChallenge.category === 'css' || activeChallenge.category === 'html') ? (
                <div className="flex-grow bg-white rounded-lg overflow-hidden border border-slate-800 min-h-[120px] relative">
                  <iframe
                    title="live-editor-sandbox"
                    srcDoc={code}
                    className="w-full h-full bg-white border-none"
                    sandbox="allow-scripts"
                  />
                  <div className="absolute bottom-1 right-1 px-1.5 py-0.5 bg-slate-900/80 text-[8px] font-mono text-slate-400 rounded">
                    iframe sandbox
                  </div>
                </div>
              ) : (
                <div className="flex-grow bg-slate-950 border border-slate-800 rounded-lg p-4 flex flex-col justify-center items-center text-center">
                  {testResult.status === 'idle' && (
                    <div className="space-y-1">
                      <Trophy className="w-8 h-8 text-slate-600 mx-auto" />
                      <p className="text-xs text-slate-500">Assertion tests have not been executed yet.</p>
                    </div>
                  )}

                  {testResult.status === 'success' && (
                    <motion.div 
                      initial={{ scale: 0.9, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="space-y-2"
                    >
                      <CheckCircle2 className="w-10 h-10 text-emerald-400 fill-emerald-500/10 mx-auto" />
                      <p className="text-sm font-bold text-emerald-400">{testResult.message}</p>
                    </motion.div>
                  )}

                  {testResult.status === 'error' && (
                    <motion.div 
                      initial={{ scale: 0.9, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="space-y-2 max-w-xs"
                    >
                      <AlertCircle className="w-10 h-10 text-rose-500 mx-auto" />
                      <p className="text-xs font-bold text-rose-400 leading-normal">{testResult.message}</p>
                    </motion.div>
                  )}
                </div>
              )}

            </div>

          </div>

        </div>

      </div>

    </div>
  );
};
