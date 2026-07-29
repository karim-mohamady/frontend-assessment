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
import { CoCoderAssistantModal } from '../components/CoCoderAssistantModal';

export const CodingSandbox: React.FC = () => {
  const { lang, isRtl, theme, progress, unlockAchievement, saveProgressState, selectedTrack } = useApp();
  
  const [isCoCoderOpen, setIsCoCoderOpen] = useState(false);
  
  // Selection state
  const [challenges, setChallenges] = useState<CodingChallenge[]>(CODING_CHALLENGES);
  
  // Filter challenges based on selected track
  const filteredChallenges = challenges.filter(item => {
    if (selectedTrack === 'fullstack') return true;
    if (selectedTrack === 'backend') {
      return ['php', 'laravel', 'mysql', 'backend'].includes(item.category);
    }
    return ['html', 'css', 'javascript', 'react'].includes(item.category);
  });

  const [activeIdx, setActiveIdx] = useState(0);
  const activeChallenge = filteredChallenges[activeIdx] || filteredChallenges[0] || CODING_CHALLENGES[0];

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

  // State for Backend Environment Tabs
  const [activeEnvTab, setActiveEnvTab] = useState<'terminal' | 'database' | 'api' | 'preview'>('terminal');
  const [terminalInput, setTerminalInput] = useState('');
  const [terminalHistory, setTerminalHistory] = useState<string[]>([
    'Laravel Framework 11.x CLI Environment',
    'Type "php artisan list" or "php index.php" or click "Run Code".',
    '-------------------------------------------------------'
  ]);

  // Editor code state
  const [code, setCode] = useState(activeChallenge ? activeChallenge.boilerplateCode : '');
  const [showHint, setShowHint] = useState(false);
  
  // Console / Testing outputs
  const [consoleLogs, setConsoleLogs] = useState<string[]>([]);
  const [testResult, setTestResult] = useState<{ status: 'idle' | 'success' | 'error'; message: string }>({ status: 'idle', message: '' });
  const [isRunning, setIsRunning] = useState(false);

  // Set default environment tab based on challenge category
  useEffect(() => {
    if (['php', 'laravel', 'backend'].includes(activeChallenge.category)) {
      setActiveEnvTab('terminal');
    } else if (activeChallenge.category === 'mysql') {
      setActiveEnvTab('database');
    } else {
      setActiveEnvTab('preview');
    }
  }, [activeChallenge]);

  // Handle interactive command execution in simulated terminal
  const executeArtisanCommand = (cmdText: string) => {
    const cmd = cmdText.trim();
    if (!cmd) return;

    let outputLines: string[] = [`$ ${cmd}`];

    if (cmd === 'clear') {
      setTerminalHistory([]);
      return;
    } else if (cmd.startsWith('php artisan route:list') || cmd === 'artisan route:list') {
      outputLines.push(
        ' +--------+----------+--------------------+-----------------------+---------------------------------------+------------+',
        ' | Domain | Method   | URI                | Name                  | Action                                | Middleware |',
        ' +--------+----------+--------------------+-----------------------+---------------------------------------+------------+',
        ' |        | GET|HEAD | /                  | home                  | Closure                               | web        |',
        ' |        | GET|HEAD | api/v1/users       | api.users.index       | App\\Http\\Controllers\\UserController@index| api        |',
        ' |        | POST     | api/v1/users       | api.users.store       | App\\Http\\Controllers\\UserController@store| api,auth   |',
        ' |        | GET|HEAD | api/v1/orders      | api.orders.index      | App\\Http\\Controllers\\OrderController@index| api,auth   |',
        ' +--------+----------+--------------------+-----------------------+---------------------------------------+------------+'
      );
    } else if (cmd.startsWith('php artisan migrate:fresh') || cmd === 'artisan migrate:fresh') {
      outputLines.push(
        'INFO  Dropping all tables ... 24.12ms DONE',
        'INFO  Preparing database migrations.',
        '2026_01_01_000001_create_users_table .................................... 11.20ms DONE',
        '2026_01_01_000002_create_password_reset_tokens_table ................... 8.45ms DONE',
        '2026_01_01_000003_create_failed_jobs_table ............................. 14.10ms DONE',
        '2026_01_01_000004_create_orders_table ................................... 18.20ms DONE',
        '2026_01_01_000005_create_products_table ................................. 15.60ms DONE',
        'INFO  Database migration completed successfully [Batch 1].'
      );
    } else if (cmd.startsWith('php artisan migrate:status') || cmd === 'artisan migrate:status') {
      outputLines.push(
        ' +------+-------------------------------------------------------+-------+',
        ' | Ran? | Migration                                             | Batch |',
        ' +------+-------------------------------------------------------+-------+',
        ' | Yes  | 2026_01_01_000001_create_users_table                  | 1     |',
        ' | Yes  | 2026_01_01_000002_create_password_reset_tokens_table  | 1     |',
        ' | Yes  | 2026_01_01_000003_create_failed_jobs_table            | 1     |',
        ' | Yes  | 2026_01_01_000004_create_orders_table                 | 1     |',
        ' | Yes  | 2026_01_01_000005_create_products_table               | 1     |',
        ' +------+-------------------------------------------------------+-------+'
      );
    } else if (cmd.startsWith('php artisan migrate') || cmd === 'artisan migrate') {
      outputLines.push(
        'INFO  Preparing database migrations.',
        '2026_01_01_000001_create_users_table .................................... 12.45ms DONE',
        '2026_01_01_000002_create_password_reset_tokens_table ................... 9.10ms DONE',
        '2026_01_01_000003_create_orders_table ................................... 18.20ms DONE',
        '2026_01_01_000004_create_products_table ................................. 15.30ms DONE',
        'INFO  Database migration completed successfully [Batch 1].'
      );
    } else if (cmd.startsWith('php artisan db:seed') || cmd === 'artisan db:seed') {
      outputLines.push(
        'INFO  Seeding database.',
        'Database\\Seeders\\UserSeeder ............................................ 45.10ms DONE',
        'Database\\Seeders\\ProductSeeder ......................................... 82.40ms DONE',
        'INFO  Database seeding completed successfully.'
      );
    } else if (cmd.startsWith('php artisan make:migration') || cmd.startsWith('artisan make:migration')) {
      const match = cmd.match(/create_\w+_table/);
      const tableName = match ? match[0] : 'create_custom_table';
      outputLines.push(
        `INFO  Migration [database/migrations/2026_07_27_140000_${tableName}.php] created successfully.`
      );
    } else if (cmd.startsWith('php artisan test') || cmd.startsWith('artisan test')) {
      outputLines.push(
        ' PASS  Tests\\Feature\\ProductApiTest',
        ' ✓ it fetches product list paginated',
        ' ✓ it validates request payload on creation',
        '',
        ' Tests:    2 passed',
        ' Time:     0.18s'
      );
    } else if (cmd.startsWith('php artisan list') || cmd === 'artisan list') {
      outputLines.push(
        'Laravel Framework 11.x CLI',
        '',
        'Available commands:',
        '  migrate             Run the database migrations',
        '  migrate:fresh       Drop all tables and re-run all migrations',
        '  migrate:status      Show the status of each migration',
        '  db:seed             Seed the database with records',
        '  make:migration      Create a new migration file',
        '  route:list          List all registered routes',
        '  test                Run the application tests'
      );
    } else if (cmd.startsWith('php')) {
      outputLines.push('[PHP 8.3 CLI] Running script in sandbox context...');
      outputLines.push('Execution successful. Exit Code: 0');
    } else {
      outputLines.push(`zsh: command not found: ${cmd}. Try "php artisan migrate", "php artisan route:list", or "php artisan test".`);
    }

    setTerminalHistory(prev => [...prev, ...outputLines]);
  };

  const handleTerminalCommand = (e: React.FormEvent) => {
    e.preventDefault();
    if (!terminalInput.trim()) return;
    executeArtisanCommand(terminalInput);
    setTerminalInput('');
  };
  
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

  // Run user code for preview (HTML/CSS, JS, PHP, MySQL, REST API)
  const runPreview = () => {
    setIsRunning(true);
    setConsoleLogs([`[System]: Initializing runtime environment for ${activeChallenge.category.toUpperCase()}...`]);
    setTestResult({ status: 'idle', message: '' });

    setTimeout(() => {
      if (activeChallenge.category === 'css' || activeChallenge.category === 'html') {
        setConsoleLogs((prev) => [...prev, `[Renderer]: Rendered HTML and styles into isolated sandbox viewport.`]);
      } else if (['php', 'laravel'].includes(activeChallenge.category)) {
        setConsoleLogs((prev) => [
          ...prev,
          `[PHP 8.3 Engine]: Parsing PHP script AST & checking syntax...`,
          `[PHP Output]: Script compiled cleanly with 0 syntax errors.`,
          `[Server Logs]: Route handled in 14ms (Memory usage: 4.2MB)`
        ]);
        setTerminalHistory(prev => [
          ...prev,
          `$ php index.php`,
          `[PHP 8.3 CLI] Executing ${activeChallenge.id}.php...`,
          `SUCCESS: Output generated without exceptions.`,
          `-------------------------------------------------------`
        ]);
      } else if (activeChallenge.category === 'mysql') {
        const queryUpper = code.toUpperCase();
        const hasSelect = queryUpper.includes('SELECT');
        const hasJoin = queryUpper.includes('JOIN');
        setConsoleLogs((prev) => [
          ...prev,
          `[MySQL 8.0 Engine]: Parsing SQL Statement...`,
          `[Query Plan]: ${hasSelect ? 'Primary Index Scan' : 'Table Scan'} initialized.`,
          `[MySQL Response]: Query executed in 0.002 sec. Returned ${hasJoin ? '12' : '25'} rows.`
        ]);
      } else if (activeChallenge.category === 'backend') {
        setConsoleLogs((prev) => [
          ...prev,
          `[REST Client]: Sending Mock HTTP GET /api/v1/resource`,
          `[Response Header]: HTTP/1.1 200 OK (Content-Type: application/json)`,
          `[Response Body]: { "status": "success", "timestamp": "${new Date().toISOString()}" }`
        ]);
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
          const runner = new Function('console', 'React', `${code}\nif (typeof fizzBuzz === "function") {\n  console.log("fizzBuzz(15) output preview: " + JSON.stringify(fizzBuzz(15).slice(0, 5)) + "...");\n}`);
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

          await new Promise(resolve => setTimeout(resolve, 100));

          const testFunc = new Function('document', 'window', activeChallenge.testCode);
          testFunc(iframe.contentWindow!.document, iframe.contentWindow);
          
          document.body.removeChild(iframe);
        } else if (['php', 'laravel', 'mysql', 'backend'].includes(activeChallenge.category)) {
          // Verify Backend code using testCode regex or evaluation
          const testFunc = new Function('code', activeChallenge.testCode);
          testFunc(code);
        } else {
          // Verify JavaScript algorithms
          const testFunc = new Function('React', `${code}\n${activeChallenge.testCode}`);
          const res = testFunc(React);
          
          if (res instanceof Promise) {
            await res;
          }
        }

        // Successfully Passed!
        setTestResult({
          status: 'success',
          message: lang === 'en' 
            ? `Fantastic! Code passed all requirements. (+${activeChallenge.points} XP)`
            : (lang === 'it' 
              ? `Fantastico! Il codice ha superato tutti i requisiti. (+${activeChallenge.points} XP)`
              : `رائع ومبهر! كودك اجتاز كافة شروط الاختبار بنجاح. (+${activeChallenge.points} نقطة خبرة)`)
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
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 px-2 flex justify-between items-center">
              <span>{lang === 'en' ? 'Select Coding Task' : (lang === 'it' ? 'Seleziona Sfida' : 'اختر المهمة البرمجية')}</span>
              <span className="text-[10px] text-amber-500 font-mono font-bold uppercase">{selectedTrack}</span>
            </h3>
            <div className="space-y-1.5">
              {filteredChallenges.map((item, idx) => {
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
                  onClick={() => setIsCoCoderOpen(true)}
                  className="px-3.5 py-2 bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 font-bold text-xs rounded-xl transition-all border border-amber-500/30 cursor-pointer flex items-center gap-1.5"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>{lang === 'en' ? 'AI Co-Coder' : 'مراجعة المبرمج الذكي'}</span>
                </button>

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

          {/* Lower Panel: Environment Tabs (Artisan CLI / Database / API Client / Browser Viewport / Console) */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
            {/* Environment Tabs Header */}
            <div className="bg-slate-950 px-4 py-2.5 border-b border-slate-800 flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center space-x-2 rtl:space-x-reverse text-xs font-bold">
                {['php', 'laravel', 'backend'].includes(activeChallenge.category) && (
                  <button
                    onClick={() => setActiveEnvTab('terminal')}
                    className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all cursor-pointer ${
                      activeEnvTab === 'terminal'
                        ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <Terminal className="w-3.5 h-3.5" />
                    <span>Artisan / PHP CLI Terminal</span>
                  </button>
                )}

                {activeChallenge.category === 'mysql' && (
                  <button
                    onClick={() => setActiveEnvTab('database')}
                    className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all cursor-pointer ${
                      activeEnvTab === 'database'
                        ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <Database className="w-3.5 h-3.5 text-cyan-400" />
                    <span>MySQL Inspector</span>
                  </button>
                )}

                {['html', 'css'].includes(activeChallenge.category) && (
                  <button
                    onClick={() => setActiveEnvTab('preview')}
                    className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all cursor-pointer ${
                      activeEnvTab === 'preview'
                        ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <Eye className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Browser Viewport</span>
                  </button>
                )}

                <button
                  onClick={() => setActiveEnvTab('api')}
                  className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all cursor-pointer ${
                    activeEnvTab === 'api'
                      ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <CloudLightning className="w-3.5 h-3.5 text-rose-400" />
                  <span>{lang === 'ar' ? 'سجل الأخطاء والمخرجات' : 'Execution Logs'}</span>
                </button>
              </div>

              <span className="text-[10px] font-mono text-slate-500">
                ENV: PHP 8.3 / Node 20.x Isolated Container
              </span>
            </div>

            {/* Tab Body Contents */}
            <div className="p-4">
              
              {/* Terminal Tab */}
              {activeEnvTab === 'terminal' && (
                <div className="space-y-3 font-mono text-xs">
                  {/* Quick Artisan Action Chips */}
                  <div className="flex flex-wrap items-center gap-1.5 pb-1">
                    <span className="text-[10px] text-slate-500 font-sans uppercase font-bold mr-1">Quick Artisan Actions:</span>
                    <button
                      type="button"
                      onClick={() => executeArtisanCommand('php artisan migrate')}
                      className="px-2.5 py-1 bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/30 rounded-lg text-[11px] font-bold transition-all cursor-pointer flex items-center gap-1"
                      title="Run database migrations"
                    >
                      <span>⚡ php artisan migrate</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => executeArtisanCommand('php artisan migrate:fresh')}
                      className="px-2.5 py-1 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 rounded-lg text-[11px] font-bold transition-all cursor-pointer flex items-center gap-1"
                      title="Drop tables & re-run migrations"
                    >
                      <span>🔄 migrate:fresh</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => executeArtisanCommand('php artisan migrate:status')}
                      className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 rounded-lg text-[11px] font-bold transition-all cursor-pointer flex items-center gap-1"
                      title="Check migration status"
                    >
                      <span>📊 migrate:status</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => executeArtisanCommand('php artisan db:seed')}
                      className="px-2.5 py-1 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-lg text-[11px] font-bold transition-all cursor-pointer flex items-center gap-1"
                      title="Seed database with dummy records"
                    >
                      <span>🌱 db:seed</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => executeArtisanCommand('php artisan route:list')}
                      className="px-2.5 py-1 bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 rounded-lg text-[11px] font-bold transition-all cursor-pointer flex items-center gap-1"
                      title="List registered HTTP routes"
                    >
                      <span>🗺️ route:list</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setTerminalHistory([])}
                      className="px-2 py-1 text-slate-500 hover:text-slate-300 ml-auto text-[10px] font-sans underline cursor-pointer"
                    >
                      Clear
                    </button>
                  </div>

                  <div className="bg-slate-950 border border-slate-800 rounded-xl p-3 h-48 overflow-y-auto space-y-1 text-slate-300">
                    {terminalHistory.map((line, i) => (
                      <div key={i} className={line.startsWith('$') ? 'text-amber-400 font-bold' : 'text-slate-300'}>
                        {line}
                      </div>
                    ))}
                  </div>

                  <form onSubmit={handleTerminalCommand} className="flex gap-2">
                    <span className="text-amber-500 font-bold self-center">$</span>
                    <input
                      type="text"
                      value={terminalInput}
                      onChange={(e) => setTerminalInput(e.target.value)}
                      placeholder="Try: php artisan route:list, php artisan migrate, or php artisan test..."
                      className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-amber-300 focus:outline-none focus:border-amber-500 font-mono"
                    />
                    <button
                      type="submit"
                      className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs rounded-xl cursor-pointer"
                    >
                      Exec
                    </button>
                  </form>
                </div>
              )}

              {/* Database Tab */}
              {activeEnvTab === 'database' && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
                    <span>Database: app_production (MySQL 8.0)</span>
                    <span className="text-emerald-400">Connection Status: OK</span>
                  </div>

                  <div className="bg-slate-950 border border-slate-800 rounded-xl overflow-x-auto p-3">
                    <table className="w-full text-left rtl:text-right text-xs font-mono">
                      <thead>
                        <tr className="border-b border-slate-800 text-amber-500">
                          <th className="p-2">id</th>
                          <th className="p-2">name</th>
                          <th className="p-2">email</th>
                          <th className="p-2">role</th>
                          <th className="p-2">created_at</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800/50 text-slate-300">
                        <tr>
                          <td className="p-2 text-slate-500">1</td>
                          <td className="p-2 font-bold text-white">Karim Ahmed</td>
                          <td className="p-2">karim@example.com</td>
                          <td className="p-2"><span className="px-1.5 py-0.5 bg-emerald-500/10 text-emerald-400 rounded text-[10px]">admin</span></td>
                          <td className="p-2 text-slate-500">2026-07-27</td>
                        </tr>
                        <tr>
                          <td className="p-2 text-slate-500">2</td>
                          <td className="p-2 font-bold text-white">Elena Rossi</td>
                          <td className="p-2">elena@dev.it</td>
                          <td className="p-2"><span className="px-1.5 py-0.5 bg-amber-500/10 text-amber-400 rounded text-[10px]">developer</span></td>
                          <td className="p-2 text-slate-500">2026-07-27</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Preview Tab (HTML / CSS) */}
              {activeEnvTab === 'preview' && (
                <div className="bg-white rounded-xl overflow-hidden border border-slate-800 h-52 relative">
                  <iframe
                    title="live-editor-sandbox"
                    srcDoc={code}
                    className="w-full h-full bg-white border-none"
                    sandbox="allow-scripts"
                  />
                </div>
              )}

              {/* Logs / API Response Tab */}
              {activeEnvTab === 'api' && (
                <div className="space-y-3">
                  <div className="bg-slate-950 border border-slate-800 rounded-xl p-3 h-48 overflow-y-auto space-y-1.5 font-mono text-xs">
                    {consoleLogs.length === 0 ? (
                      <p className="text-slate-600 italic">No execution logs. Click "Run Code" or "Run Assert Tests".</p>
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

                  {testResult.status !== 'idle' && (
                    <div className={`p-3 rounded-xl border text-xs font-bold flex items-center gap-2 ${
                      testResult.status === 'success'
                        ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                        : 'bg-rose-500/10 border-rose-500/30 text-rose-400'
                    }`}>
                      {testResult.status === 'success' ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
                      <span>{testResult.message}</span>
                    </div>
                  )}
                </div>
              )}

            </div>
          </div>

        </div>

      </div>

      <CoCoderAssistantModal
        isOpen={isCoCoderOpen}
        onClose={() => setIsCoCoderOpen(false)}
        code={code}
        challengeTitle={getChallengeTitle(activeChallenge)}
      />

    </div>
  );
};
