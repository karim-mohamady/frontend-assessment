/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Award, Clock, CheckCircle, HelpCircle, ArrowLeft, RefreshCw, MessageSquare, Play, Sparkles, AlertCircle, FileText, ChevronRight, ChevronLeft, Calendar, Brain, CheckSquare, Target, Star, Database
} from 'lucide-react';
import { MockInterviewResult, AppLanguage } from '../types';
import { processInterviewStep } from '../lib/interviewService';
import { ResumeAnalyzerModal } from '../components/ResumeAnalyzerModal';
import { STARInterviewStudio } from '../components/STARInterviewStudio';
import { SQLQueryOptimizerModal } from '../components/SQLQueryOptimizerModal';

export const InterviewPrep: React.FC = () => {
  const { progress, isRtl, saveMockInterview, lang, selectedTrack } = useApp();

  const [isResumeModalOpen, setIsResumeModalOpen] = useState<boolean>(false);
  const [isSqlModalOpen, setIsSqlModalOpen] = useState<boolean>(false);
  const [interviewMode, setInterviewMode] = useState<'mock' | 'star'>('mock');

  // Screen states: 'config' | 'active' | 'summary'
  const [screen, setScreen] = useState<'config' | 'active' | 'summary'>('config');

  // Config form states
  const [category, setCategory] = useState<string>('react');
  const [difficulty, setDifficulty] = useState<string>('Mid-Level');
  const [interviewLang, setInterviewLang] = useState<AppLanguage>(lang);

  // Active Interview state
  const [questionCount, setQuestionCount] = useState<number>(1);
  const [currentQuestion, setCurrentQuestion] = useState<string>('');
  const [userResponse, setUserResponse] = useState<string>('');
  const [feedback, setFeedback] = useState<string>('');
  const [score, setScore] = useState<number>(-1);
  
  // History of current active interview session
  const [qaHistory, setQaHistory] = useState<{
    question: string;
    answer: string;
    feedback: string;
    score: number;
  }[]>([]);

  // Summary results state
  const [overallSummary, setOverallSummary] = useState<string>('');
  const [overallScore, setOverallScore] = useState<number>(0);

  // Loading and Error states
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [loadingStep, setLoadingStep] = useState<string>('');
  const [error, setError] = useState<string>('');

  // Selected historic interview to view
  const [viewingHistoryItem, setViewingHistoryItem] = useState<MockInterviewResult | null>(null);

  const categories = [
    { id: 'react', labelEn: 'React & Front-End Frameworks', labelAr: 'مكتبة ريأكت وإطارات العمل', labelIt: 'React & Framework Front-End', track: 'frontend', icon: '⚛️' },
    { id: 'javascript', labelEn: 'JavaScript & Async ES6+', labelAr: 'جافا سكريبت والمزامنة', labelIt: 'JavaScript & Async ES6+', track: 'frontend', icon: '⚡' },
    { id: 'html_css', labelEn: 'HTML5, CSS3 & Responsive Web', labelAr: 'هيكلة الويب والتصميم المتجاوب', labelIt: 'HTML5, CSS3 & Design Responsive', track: 'frontend', icon: '🎨' },
    { id: 'php', labelEn: 'PHP 8.x, OOP & Security', labelAr: 'برمجة PHP 8 والأمان', labelIt: 'PHP 8.x, OOP & Sicurezza', track: 'backend', icon: '🐘' },
    { id: 'laravel', labelEn: 'Laravel 11 & Eloquent ORM', labelAr: 'إطار Laravel 11 و Eloquent', labelIt: 'Laravel 11 & Eloquent ORM', track: 'backend', icon: '🔴' },
    { id: 'mysql', labelEn: 'MySQL, Relational SQL & JOINs', labelAr: 'قواعد بيانات MySQL و SQL', labelIt: 'MySQL, SQL Relazionale & JOIN', track: 'backend', icon: '🐬' },
    { id: 'backend', labelEn: 'Backend Architecture & REST APIs', labelAr: 'معمارية الباك إند والواجهات', labelIt: 'Architettura Backend & REST API', track: 'backend', icon: '⚙️' },
    { id: 'uiux', labelEn: 'UI/UX Design & Design Systems', labelAr: 'تصميم الواجهات وأنظمة التصميم', labelIt: 'UI/UX Design & Design Systems', track: 'uiux', icon: '🎨' },
    { id: 'figma', labelEn: 'Figma Auto-Layout & Variants', labelAr: 'أداة فيجما والتصميم المتجاوب', labelIt: 'Figma Auto-Layout & Varianti', track: 'uiux', icon: '📐' },
    { id: 'web3', labelEn: 'Web3 & Blockchain Fundamentals', labelAr: 'أساسيات البلوكشين والويب 3', labelIt: 'Web3 & Fondamenti Blockchain', track: 'web3', icon: '🪙' },
    { id: 'solidity', labelEn: 'Solidity & EVM Smart Contracts', labelAr: 'لغة Solidity والعقود الذكية', labelIt: 'Solidity & Smart Contract EVM', track: 'web3', icon: '📜' },
    { id: 'performance', labelEn: 'Web Performance & Security', labelAr: 'الأداء الفائق وحماية الويب', labelIt: 'Prestazioni Web & Sicurezza', track: 'frontend', icon: '💨' },
    { id: 'system_design', labelEn: 'Full-Stack System Design', labelAr: 'تصميم أنظمة الويب الشاملة', labelIt: 'Progettazione Sistemi Web', track: 'fullstack', icon: '🏗️' }
  ];

  const filteredCategories = categories.filter(c => {
    if (selectedTrack === 'fullstack') return true;
    if (c.track === 'fullstack') return true;
    return c.track === selectedTrack;
  });

  const categoryNames: Record<string, string> = {
    react: isRtl ? 'ريأكت والخطافات' : (lang === 'it' ? 'React & Framework' : 'React & Frameworks'),
    javascript: isRtl ? 'جافا سكريبت والمزامنة' : (lang === 'it' ? 'JavaScript & Async' : 'JavaScript & Async'),
    html_css: isRtl ? 'تنسيق وتصميم الويب' : (lang === 'it' ? 'HTML5 & CSS3' : 'HTML5 & CSS3'),
    php: isRtl ? 'لغة PHP 8 والبرمجة الكائنية' : 'PHP 8 & OOP',
    laravel: isRtl ? 'إطار لارفيل 11' : 'Laravel 11 & Eloquent',
    mysql: isRtl ? 'قواعد بيانات MySQL' : 'MySQL & SQL Databases',
    backend: isRtl ? 'معمارية الباك إند و REST APIs' : 'Backend & REST APIs',
    performance: isRtl ? 'الأداء والحماية' : 'Web Performance',
    system_design: isRtl ? 'تصميم النظم' : 'System Design'
  };

  const loadingMessages = isRtl 
    ? [
        'جاري تحليل إجابتك البرمجية...',
        'جاري التحقق من التوافقية مع معايير هندسة البرمجيات...',
        'جاري تقييم المصطلحات الفنية المستخدمة...',
        'جاري تحضير الملاحظات البناءة والسؤال التالي...',
        'يقوم مدير التوظيف الافتراضي بتسجيل نقاطك...'
      ]
    : [
        'Analyzing your architectural response...',
        'Verifying core semantic accuracy...',
        'Evaluating vocabulary & coding practices...',
        'Preparing constructive feedback & next question...',
        'Virtual hiring manager is compiling your score...'
      ];

  const rotateLoadingMessages = () => {
    let index = 0;
    setLoadingStep(loadingMessages[0]);
    const interval = setInterval(() => {
      index = (index + 1) % loadingMessages.length;
      setLoadingStep(loadingMessages[index]);
    }, 2500);
    return interval;
  };

  // Start the interview session
  const handleStartInterview = async () => {
    setIsLoading(true);
    setError('');
    setQuestionCount(1);
    setQaHistory([]);
    setUserResponse('');
    setFeedback('');
    setScore(-1);

    const loadingInterval = rotateLoadingMessages();

    try {
      const data = await processInterviewStep({
        category,
        difficulty,
        language: interviewLang,
        currentQuestion: '',
        userResponse: '',
        questionCount: 0,
        track: selectedTrack
      });

      setCurrentQuestion(data.question);
      setScreen('active');
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Could not communicate with the interview backend.');
    } finally {
      clearInterval(loadingInterval);
      setIsLoading(false);
    }
  };

  // Submit response for evaluation and get the next question
  const handleSubmitResponse = async () => {
    if (!userResponse.trim()) return;

    setIsLoading(true);
    setError('');
    const loadingInterval = rotateLoadingMessages();

    try {
      const data = await processInterviewStep({
        category,
        difficulty,
        language: interviewLang,
        currentQuestion,
        userResponse,
        questionCount,
        track: selectedTrack
      });

      // Save this QA pair to the active session history
      const currentQA = {
        question: currentQuestion,
        answer: userResponse,
        feedback: data.feedback,
        score: data.score
      };
      
      const updatedHistory = [...qaHistory, currentQA];
      setQaHistory(updatedHistory);

      if (data.isEnd || questionCount >= 5) {
        // Conclude interview
        setOverallSummary(data.overallSummary || (isRtl ? 'أحسنت! تم إكمال محاكاة المقابلة بنجاح.' : 'Well done on completing your interview simulation.'));
        setOverallScore(data.overallScore || 75);
        
        // Save the result to local and cloud progress
        const interviewResult: MockInterviewResult = {
          id: `interview-${Date.now()}`,
          category,
          difficulty,
          language: interviewLang,
          date: new Date().toISOString(),
          score: data.overallScore || 75,
          overallSummary: data.overallSummary || (isRtl ? 'تمت بنجاح' : 'Completed successfully.'),
          qaHistory: updatedHistory
        };
        
        if (saveMockInterview) {
          saveMockInterview(interviewResult);
        }

        setScreen('summary');
      } else {
        // Transition to next question
        setCurrentQuestion(data.question);
        setQuestionCount(prev => prev + 1);
        setUserResponse('');
      }

    } catch (err: any) {
      console.error(err);
      setError(err.message || (isRtl ? 'حدث خطأ غير متوقع. يرجى المحاولة مرة أخرى.' : 'Connection lost. Please try submitting again.'));
    } finally {
      clearInterval(loadingInterval);
      setIsLoading(false);
    }
  };

  const getScoreBadgeClass = (s: number) => {
    if (s >= 8) return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
    if (s >= 5) return 'bg-amber-500/10 text-amber-400 border-amber-500/30';
    return 'bg-rose-500/10 text-rose-400 border-rose-500/30';
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 md:py-12 space-y-8" id="interview-prep-container">
      
      {/* 1. Header Hero Panel */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 pb-6 border-b border-slate-800">
        <div>
          <div className="inline-flex items-center space-x-2 rtl:space-x-reverse bg-amber-500/10 text-amber-400 border border-amber-500/20 px-3 py-1 rounded-full text-xs font-black tracking-wide uppercase mb-3">
            <Brain className="w-3.5 h-3.5" />
            <span>{isRtl ? 'محاكي المقابلات بالذكاء الاصطناعي' : 'AI Technical Interview Simulator'}</span>
          </div>
          <h1 className="text-2xl md:text-4xl font-extrabold text-white tracking-tight">
            {isRtl ? 'التحضير للمقابلات التقنية والمهنية' : 'Front-End Interview Prep Arena'}
          </h1>
          <p className="text-slate-400 text-sm mt-1.5 max-w-2xl leading-relaxed">
            {isRtl 
              ? 'تدرّب على مقابلات توظيف حقيقية ومخصصة لمستواك البرمجي. احصل على تقييم فوري لكل إجابة ومراجعة شاملة لتقريرك.' 
              : 'Conduct adaptive mock technical interviews powered by Gemini. Answer structured questions one-by-one and receive rigorous grading.'}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {screen === 'config' && (
            <>
              <button
                onClick={() => setIsResumeModalOpen(true)}
                className="flex items-center space-x-2 rtl:space-x-reverse bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/30 px-4 py-2.5 rounded-xl text-xs font-bold cursor-pointer transition-all shadow-md"
              >
                <FileText className="w-4 h-4" />
                <span>{isRtl ? 'تحليل السيرة الذاتية الـ ATS' : 'Analyze Resume (ATS)'}</span>
              </button>

              <button
                onClick={() => setIsSqlModalOpen(true)}
                className="flex items-center space-x-2 rtl:space-x-reverse bg-slate-900 hover:bg-slate-800 text-cyan-400 border border-slate-800 hover:border-cyan-500/30 px-4 py-2.5 rounded-xl text-xs font-bold cursor-pointer transition-all shadow-md"
              >
                <Database className="w-4 h-4" />
                <span>{isRtl ? 'محلل استعلامات SQL' : 'SQL EXPLAIN Optimizer'}</span>
              </button>
            </>
          )}

          {screen !== 'config' && (
            <button
              onClick={() => {
                if (window.confirm(isRtl ? 'هل تريد بالتأكيد إنهاء الجلسة والعودة؟' : 'Are you sure you want to exit this interview session?')) {
                  setScreen('config');
                }
              }}
              className="flex items-center space-x-2 rtl:space-x-reverse bg-slate-900 hover:bg-slate-800 text-slate-300 px-4 py-2 rounded-xl text-xs font-bold border border-slate-800 cursor-pointer transition-all"
            >
              {isRtl ? <ArrowLeft className="w-4 h-4" /> : <ArrowLeft className="w-4 h-4" />}
              <span>{isRtl ? 'إنهاء والعودة' : 'Exit Session'}</span>
            </button>
          )}
        </div>
      </div>

      {/* 2. Loading state */}
      {isLoading && (
        <div className="flex flex-col items-center justify-center py-20 px-6 bg-slate-900/50 border border-slate-800/80 rounded-3xl space-y-6 text-center animate-pulse" id="loading-overlay">
          <div className="relative">
            <div className="w-16 h-16 rounded-full border-4 border-amber-500/20 border-t-amber-500 animate-spin" />
            <Sparkles className="w-6 h-6 text-amber-400 absolute inset-0 m-auto animate-bounce" />
          </div>
          <div className="space-y-2 max-w-lg">
            <h3 className="text-white font-extrabold text-lg">{isRtl ? 'جاري الاتصال بمدير التوظيف...' : 'Connecting with Hiring Manager...'}</h3>
            <p className="text-slate-400 text-xs font-mono py-1 px-3 bg-slate-950 rounded-lg inline-block border border-slate-800">
              {loadingStep}
            </p>
            <p className="text-slate-500 text-[11px] leading-relaxed">
              {isRtl ? 'تعتمد الأسئلة على صعوبة وسمات التكنولوجيا المحددة لضمان أقصى كفاءة.' : 'Questions are dynamically formulated based on selected technology stack & seniority level.'}
            </p>
          </div>
        </div>
      )}

      {/* 3. ERROR BANNER */}
      {error && !isLoading && (
        <div className="p-4 bg-rose-500/15 border border-rose-500/30 text-rose-400 rounded-2xl flex items-start gap-3 text-xs" id="error-banner">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <div className="space-y-1">
            <p className="font-extrabold">{isRtl ? 'خطأ في الاتصال بالذكاء الاصطناعي' : 'API Connection Error'}</p>
            <p className="opacity-90">{error}</p>
            <button
              onClick={handleStartInterview}
              className="mt-2 bg-rose-500 text-slate-950 px-3 py-1.5 rounded-lg font-black tracking-wide uppercase hover:bg-rose-400 transition-colors cursor-pointer"
            >
              {isRtl ? 'إعادة المحاولة' : 'Retry Request'}
            </button>
          </div>
        </div>
      )}

      {/* Mode Selector Header */}
      {screen === 'config' && (
        <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
          <button
            onClick={() => setInterviewMode('mock')}
            className={`px-5 py-2.5 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center gap-2 ${
              interviewMode === 'mock'
                ? 'bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/20'
                : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            <Brain className="w-4 h-4" />
            <span>{isRtl ? 'محاكاة المقابلات التقنية (Technical Interview)' : 'Technical Interview AI Simulation'}</span>
          </button>

          <button
            onClick={() => setInterviewMode('star')}
            className={`px-5 py-2.5 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center gap-2 ${
              interviewMode === 'star'
                ? 'bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/20'
                : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            <Star className="w-4 h-4" />
            <span>{isRtl ? 'ورشة المقابلات السلوكية (STAR Method)' : 'Behavioral STAR Workshop'}</span>
          </button>
        </div>
      )}

      {/* Render STAR Studio if active */}
      {screen === 'config' && interviewMode === 'star' && (
        <STARInterviewStudio />
      )}

      {/* 4. CONFIGURATION VIEW */}
      {!isLoading && screen === 'config' && interviewMode === 'mock' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8" id="config-view-wrapper">
          
          {/* Main Config Form */}
          <div className="lg:col-span-2 bg-slate-900 border border-slate-800/80 rounded-3xl p-6 md:p-8 space-y-6 shadow-sm">
            <h2 className="text-white font-black text-lg flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-500" />
              <span>{isRtl ? 'ابدأ محاكاة جديدة للمقابلة' : 'Setup New Interview Simulation'}</span>
            </h2>

            {/* Select Category Cards */}
            <div className="space-y-3">
              <label className="text-xs font-black uppercase text-slate-400 tracking-wider block">
                {isRtl ? '1. اختر التخصص التقني' : (lang === 'it' ? '1. Scegli Dominio Tecnico' : '1. Choose Technical Domain')}
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {filteredCategories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setCategory(cat.id)}
                    className={`flex items-start text-left rtl:text-right p-4 rounded-2xl border transition-all cursor-pointer ${
                      category === cat.id
                        ? 'bg-amber-500/10 border-amber-500/50 text-white shadow-md'
                        : 'bg-slate-950/60 border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white'
                    }`}
                  >
                    <span className="text-2xl mr-3 rtl:mr-0 rtl:ml-3 shrink-0">{cat.icon}</span>
                    <div>
                      <h4 className="font-bold text-xs">{isRtl ? cat.labelAr : (lang === 'it' ? cat.labelIt : cat.labelEn)}</h4>
                      <p className="text-[10px] text-slate-400 mt-1 uppercase tracking-wide font-mono">
                        {cat.id.replace('_', ' ')}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Select Seniority / Difficulty */}
              <div className="space-y-2">
                <label className="text-xs font-black uppercase text-slate-400 tracking-wider block">
                  {isRtl ? '2. مستوى الأقدمية الوظيفية' : (lang === 'it' ? '2. Livello di Esperienza' : '2. Seniority Level')}
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {['Junior', 'Mid-Level', 'Senior'].map((lvl) => (
                    <button
                      key={lvl}
                      onClick={() => setDifficulty(lvl)}
                      className={`py-2 px-3 rounded-xl border text-xs font-extrabold transition-all cursor-pointer text-center ${
                        difficulty === lvl
                          ? 'bg-amber-500 text-slate-950 border-amber-600 shadow-md'
                          : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white hover:border-slate-700'
                      }`}
                    >
                      {lvl === 'Junior' ? (isRtl ? 'مبتدئ' : 'Junior') : lvl === 'Mid-Level' ? (isRtl ? 'متوسط' : 'Mid') : (isRtl ? 'خبير' : 'Senior')}
                    </button>
                  ))}
                </div>
              </div>

              {/* Language Selection */}
              <div className="space-y-2">
                <label className="text-xs font-black uppercase text-slate-400 tracking-wider block">
                  {lang === 'ar' ? '3. لغة المقابلة والمحادثة' : (lang === 'it' ? '3. Lingua dell\'Intervista' : '3. Interview Language')}
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'en', label: 'English' },
                    { id: 'it', label: 'Italiano' },
                    { id: 'ar', label: 'العربية' }
                  ].map((l) => (
                    <button
                      key={l.id}
                      onClick={() => setInterviewLang(l.id as any)}
                      className={`py-2 px-3 rounded-xl border text-xs font-extrabold transition-all cursor-pointer text-center ${
                        interviewLang === l.id
                          ? 'bg-amber-500 text-slate-950 border-amber-600 shadow-md'
                          : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white hover:border-slate-700'
                      }`}
                    >
                      {l.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Launch Button */}
            <button
              onClick={handleStartInterview}
              className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black tracking-wide text-sm py-4 rounded-2xl flex items-center justify-center space-x-2.5 rtl:space-x-reverse shadow-lg cursor-pointer transition-all duration-200"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>{isRtl ? 'ابدأ المقابلة الافتراضية الفورية' : 'Start Mock Technical Interview'}</span>
            </button>

          </div>

          {/* Right Column: Historical Attempts Log */}
          <div className="bg-slate-900 border border-slate-800/80 rounded-3xl p-6 md:p-8 space-y-6">
            <h3 className="text-white font-extrabold text-sm flex items-center gap-2">
              <Clock className="w-4 h-4 text-slate-400" />
              <span>{isRtl ? 'سجل المحاولات التقنية السابقة' : 'Historical Sessions Log'}</span>
            </h3>

            {progress.mockInterviews && progress.mockInterviews.length > 0 ? (
              <div className="space-y-3.5 max-h-[420px] overflow-y-auto pr-2">
                {progress.mockInterviews.map((item) => (
                  <div 
                    key={item.id}
                    className="p-3.5 bg-slate-950 border border-slate-800/80 hover:border-slate-700 rounded-2xl space-y-2.5 text-xs transition-colors"
                  >
                    <div className="flex justify-between items-start gap-2">
                      <div>
                        <span className="font-bold text-white block">
                          {categoryNames[item.category] || item.category}
                        </span>
                        <span className="text-[10px] text-slate-500 font-mono block mt-0.5">
                          {item.difficulty} • {item.language === 'ar' ? 'العربية' : (item.language === 'es' ? 'Español' : 'English')}
                        </span>
                      </div>
                      <span className={`px-2 py-0.5 rounded-lg border font-mono font-bold shrink-0 ${
                        item.score >= 80 
                          ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/20'
                          : item.score >= 50
                          ? 'bg-amber-500/15 text-amber-400 border-amber-500/20'
                          : 'bg-rose-500/15 text-rose-400 border-rose-500/20'
                      }`}>
                        {item.score}%
                      </span>
                    </div>

                    <p className="text-[11px] text-slate-400 line-clamp-2 italic leading-relaxed">
                      "{item.overallSummary}"
                    </p>

                    <button
                      onClick={() => setViewingHistoryItem(item)}
                      className="w-full text-center bg-slate-900 hover:bg-slate-850 text-slate-300 py-1.5 rounded-xl text-[10px] font-bold border border-slate-800 cursor-pointer transition-colors"
                    >
                      {isRtl ? 'عرض التقرير البرمجي كاملاً' : 'Review Complete Dialogue'}
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-12 text-center text-slate-500 italic text-xs space-y-2">
                <Brain className="w-10 h-10 text-slate-700 mx-auto stroke-[1.5]" />
                <p className="max-w-[220px] mx-auto leading-relaxed">
                  {isRtl 
                    ? 'لا توجد أي مقابلات مسجلة حالياً. ابدأ جلستك الأولى الآن لتراكم التقييمات!' 
                    : 'No previous interview transcripts. Complete your first session to build your portfolio!'}
                </p>
              </div>
            )}
          </div>

        </div>
      )}

      {/* 5. ACTIVE INTERVIEW VIEW */}
      {!isLoading && screen === 'active' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8" id="active-interview-wrapper">
          
          {/* Main Question & Answer Input Panel */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Question Card */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 space-y-4">
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-400 font-bold uppercase tracking-wider">
                  {isRtl ? `السؤال ${questionCount} من 5` : `Question ${questionCount} of 5`}
                </span>
                <span className="px-2.5 py-0.5 bg-slate-950 text-amber-400 border border-slate-800 rounded-full font-mono font-bold">
                  {difficulty}
                </span>
              </div>

              {/* Progress Indicator Dots */}
              <div className="flex gap-2.5 h-1.5 w-full bg-slate-950 rounded-full overflow-hidden p-0.5">
                {[1, 2, 3, 4, 5].map((idx) => (
                  <div 
                    key={idx}
                    className={`h-full rounded-full flex-1 transition-all duration-300 ${
                      idx < questionCount 
                        ? 'bg-emerald-500' 
                        : idx === questionCount 
                        ? 'bg-amber-500' 
                        : 'bg-slate-800'
                    }`}
                  />
                ))}
              </div>

              {/* The Question Text */}
              <div className="pt-2">
                <h3 className="text-white font-extrabold text-base md:text-xl leading-relaxed">
                  {currentQuestion}
                </h3>
              </div>
            </div>

            {/* Answer Textarea */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 space-y-4">
              <div className="flex justify-between items-center">
                <label className="text-xs font-black uppercase text-slate-400 tracking-wider flex items-center gap-1.5">
                  <FileText className="w-4 h-4 text-slate-400" />
                  <span>{isRtl ? 'اكتب إجابتك التقنية بالتفصيل' : 'Your Engineering Response'}</span>
                </label>
                <span className="text-[10px] text-slate-500 font-mono">
                  {isRtl ? 'يمكنك استخدام الكود أو الشرح النصي' : 'Markdown syntax & code snippets supported'}
                </span>
              </div>

              <textarea
                value={userResponse}
                onChange={(e) => setUserResponse(e.target.value)}
                placeholder={isRtl 
                  ? 'اكتب شرحك البرمجي، المفاهيم الأساسية، أو أرفق كوداً توضيحياً إذا تطلب السؤال...' 
                  : 'Explain the concepts, write code snippets, or reference best practices to provide a senior-level answer...'}
                className="w-full min-h-[220px] bg-slate-950 border border-slate-800 focus:border-amber-500/60 focus:outline-none rounded-2xl p-4 text-sm text-slate-200 placeholder:text-slate-600 font-sans leading-relaxed resize-y transition-colors"
                id="interview-response-textarea"
              />

              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <button
                  onClick={handleSubmitResponse}
                  disabled={!userResponse.trim()}
                  className="flex-1 bg-gradient-to-r from-emerald-500 to-emerald-600 disabled:from-slate-800 disabled:to-slate-800 text-slate-950 disabled:text-slate-600 font-black tracking-wide text-xs py-3.5 rounded-xl flex items-center justify-center space-x-2 rtl:space-x-reverse shadow-md cursor-pointer disabled:cursor-not-allowed transition-all"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>{isRtl ? 'إرسال الإجابة للتقييم' : 'Submit Answer & Continue'}</span>
                </button>

                <button
                  onClick={() => {
                    if (window.confirm(isRtl ? 'هل تريد تخطي هذا السؤال بنتيجة 0؟' : 'Are you sure you want to skip this question? You will receive a score of 0.')) {
                      setUserResponse('Skipped / تم التخطي');
                      setTimeout(() => handleSubmitResponse(), 100);
                    }
                  }}
                  className="bg-slate-950 border border-slate-800 text-slate-400 hover:text-white hover:border-slate-700 px-5 py-3 rounded-xl text-xs font-bold transition-all cursor-pointer"
                >
                  {isRtl ? 'تخطي السؤال' : 'Skip Question'}
                </button>
              </div>
            </div>

          </div>

          {/* Active dialogue transcript history panel */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 space-y-6">
            <h3 className="text-white font-extrabold text-sm flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-slate-400" />
              <span>{isRtl ? 'المحادثة والتقييمات الفورية' : 'Live Transcript Feed'}</span>
            </h3>

            {qaHistory.length > 0 ? (
              <div className="space-y-4 max-h-[480px] overflow-y-auto pr-1">
                {qaHistory.map((item, idx) => (
                  <div key={idx} className="p-3.5 bg-slate-950 border border-slate-800/80 rounded-2xl space-y-2.5">
                    <div className="flex justify-between items-center text-[10px] font-mono text-slate-500">
                      <span>{isRtl ? `سؤال رقم ${idx + 1}` : `Q&A #${idx + 1}`}</span>
                      <span className={`px-1.5 py-0.5 rounded border font-bold ${getScoreBadgeClass(item.score)}`}>
                        {item.score}/10
                      </span>
                    </div>

                    <div className="space-y-1">
                      <p className="text-[11px] font-black text-slate-300 leading-normal line-clamp-2">
                        Q: {item.question}
                      </p>
                      <p className="text-[11px] text-slate-400 leading-normal line-clamp-2">
                        A: {item.answer}
                      </p>
                    </div>

                    <div className="text-[10px] text-slate-400 border-t border-slate-900/60 pt-2 leading-relaxed">
                      <span className="font-bold text-amber-400 block mb-0.5">
                        {isRtl ? 'تقييم المصحح الافتراضي:' : 'Hiring Manager Critique:'}
                      </span>
                      {item.feedback}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-20 text-center text-slate-500 italic text-xs space-y-2">
                <HelpCircle className="w-10 h-10 text-slate-800 mx-auto stroke-[1.5]" />
                <p className="max-w-[200px] mx-auto leading-relaxed">
                  {isRtl ? 'لم تقم بإرسال أي إجابات بعد في هذا التقييم.' : 'Answer the current question to see your live evaluations here.'}
                </p>
              </div>
            )}
          </div>

        </div>
      )}

      {/* 6. COMPLETE INTERVIEW SUMMARY VIEW */}
      {!isLoading && screen === 'summary' && (
        <div className="space-y-6" id="summary-view-wrapper">
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Dial circular or high visual score panel */}
            <div className="bg-slate-900 border border-slate-800 p-6 md:p-8 rounded-3xl flex flex-col items-center justify-center text-center space-y-4">
              <span className="text-xs font-black uppercase tracking-wider text-slate-400">
                {isRtl ? 'التقييم العام النهائي' : 'Aggregate Performance Score'}
              </span>
              
              <div className="relative flex items-center justify-center">
                {/* SVG Dial border */}
                <svg className="w-36 h-36 transform -rotate-90">
                  <circle
                    cx="72"
                    cy="72"
                    r="60"
                    stroke="#1e293b"
                    strokeWidth="10"
                    fill="transparent"
                  />
                  <circle
                    cx="72"
                    cy="72"
                    r="60"
                    stroke="#f59e0b"
                    strokeWidth="10"
                    fill="transparent"
                    strokeDasharray={377}
                    strokeDashoffset={377 - (377 * overallScore) / 100}
                    className="transition-all duration-1000 ease-out"
                  />
                </svg>
                <div className="absolute flex flex-col items-center">
                  <span className="text-3xl font-black text-white font-mono">{overallScore}%</span>
                  <span className="text-[10px] text-slate-400 uppercase font-mono">{difficulty}</span>
                </div>
              </div>

              <div className="space-y-1">
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-black border uppercase tracking-wider ${
                  overallScore >= 75 
                    ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30' 
                    : 'bg-amber-500/15 text-amber-400 border-amber-500/30'
                }`}>
                  {overallScore >= 75 ? (isRtl ? 'جاهز للوظيفة' : 'Job Ready') : (isRtl ? 'يتطلب تدريب' : 'Needs Practice')}
                </span>
              </div>
            </div>

            {/* Detailed Overall Summary Text block */}
            <div className="md:col-span-2 bg-slate-900 border border-slate-800 p-6 md:p-8 rounded-3xl space-y-4">
              <h3 className="text-white font-black text-lg flex items-center gap-2">
                <Award className="w-5 h-5 text-amber-500" />
                <span>{isRtl ? 'تقرير الأداء الفني المفصل' : 'Comprehensive Evaluation Verdict'}</span>
              </h3>

              <p className="text-slate-300 text-sm leading-relaxed whitespace-pre-line">
                {overallSummary}
              </p>

              <div className="flex gap-4 pt-2 border-t border-slate-800/60 text-xs text-slate-400">
                <div>
                  <span className="block font-bold text-white">{isRtl ? 'المستوى المستهدف:' : 'Seniority Stack:'}</span>
                  <span className="font-mono text-[11px] text-slate-400">{difficulty}</span>
                </div>
                <div>
                  <span className="block font-bold text-white">{isRtl ? 'الفئة المقيّمة:' : 'Core Domain:'}</span>
                  <span className="font-mono text-[11px] text-slate-400">{categoryNames[category]}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Breakdown list of every question asked */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 space-y-6">
            <h3 className="text-white font-black text-base flex items-center gap-2">
              <FileText className="w-5 h-5 text-slate-400" />
              <span>{isRtl ? 'تفاصيل الحوار وتقييمات الأسئلة' : 'Step-by-Step Question Breakdown'}</span>
            </h3>

            <div className="space-y-4">
              {qaHistory.map((item, idx) => (
                <div 
                  key={idx} 
                  className="p-5 bg-slate-950 border border-slate-800/80 rounded-2xl space-y-4 text-xs"
                >
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-black text-amber-500">
                      {isRtl ? `سؤال رقم ${idx + 1}` : `Question #${idx + 1}`}
                    </span>
                    <span className={`px-2.5 py-1 rounded-xl border font-mono font-black ${getScoreBadgeClass(item.score)}`}>
                      {item.score} / 10
                    </span>
                  </div>

                  <div className="space-y-2">
                    <div>
                      <span className="block font-bold text-white mb-0.5">{isRtl ? 'السؤال المطروح:' : 'Question Asked:'}</span>
                      <p className="text-slate-300 text-[13px] leading-relaxed">{item.question}</p>
                    </div>

                    <div className="bg-slate-900 p-3 rounded-xl border border-slate-800/60">
                      <span className="block font-bold text-slate-400 mb-1">{isRtl ? 'إجابتك المقدمة:' : 'Your Response:'}</span>
                      <p className="text-slate-200 font-mono text-[11px] whitespace-pre-wrap leading-relaxed">{item.answer}</p>
                    </div>

                    <div className="text-slate-300">
                      <span className="block font-black text-emerald-400 mb-1">{isRtl ? 'النقد الفني والتحليلي:' : 'Constructive Evaluation:'}</span>
                      <p className="leading-relaxed whitespace-pre-line">{item.feedback}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-4 flex justify-center">
              <button
                onClick={() => setScreen('config')}
                className="bg-amber-500 hover:bg-amber-400 text-slate-950 px-8 py-3 rounded-xl text-xs font-black uppercase tracking-wide cursor-pointer transition-colors"
              >
                {isRtl ? 'الرجوع للقائمة والتحضير لمقابلة أخرى' : 'Start Another Interview Simulation'}
              </button>
            </div>
          </div>

        </div>
      )}

      {/* 7. FULL SCREEN HISTORIC ITEM TRANSCRIPT VIEW MODAL */}
      {viewingHistoryItem && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in" id="history-transcript-modal">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-4xl max-h-[85vh] overflow-y-auto shadow-2xl p-6 md:p-8 space-y-6 animate-scale-up">
            
            <div className="flex justify-between items-start border-b border-slate-800 pb-4">
              <div>
                <span className="text-[10px] uppercase font-mono tracking-wider text-amber-500">
                  {viewingHistoryItem.difficulty} • {viewingHistoryItem.language === 'ar' ? 'العربية' : (viewingHistoryItem.language === 'es' ? 'Español' : 'English')}
                </span>
                <h3 className="text-white font-extrabold text-lg md:text-xl">
                  {categoryNames[viewingHistoryItem.category] || viewingHistoryItem.category}
                </h3>
              </div>
              <div className="flex items-center gap-3">
                <span className="bg-amber-500/10 text-amber-400 border border-amber-500/30 px-3 py-1 rounded-xl font-mono font-bold text-xs">
                  {viewingHistoryItem.score}%
                </span>
                <button
                  onClick={() => setViewingHistoryItem(null)}
                  className="bg-slate-950 hover:bg-slate-850 text-slate-400 hover:text-white p-2 rounded-lg cursor-pointer"
                >
                  ✕
                </button>
              </div>
            </div>

            <div className="space-y-4">
              <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 text-xs leading-relaxed text-slate-300">
                <span className="font-extrabold text-white block mb-1">{isRtl ? 'ملخص التقييم العام للمدير الموظف:' : 'Overall Performance Summary:'}</span>
                {viewingHistoryItem.overallSummary}
              </div>

              <div className="space-y-4">
                {viewingHistoryItem.qaHistory.map((item, idx) => (
                  <div key={idx} className="p-4 bg-slate-950 border border-slate-800/60 rounded-xl space-y-3 text-xs">
                    <div className="flex justify-between items-center font-mono">
                      <span className="text-slate-400 font-bold">{isRtl ? `سؤال رقم ${idx + 1}` : `Question #${idx + 1}`}</span>
                      <span className="text-amber-500 font-bold">{item.score}/10</span>
                    </div>

                    <div>
                      <span className="font-bold text-slate-300 block mb-0.5">Q:</span>
                      <p className="text-slate-300 font-medium leading-relaxed">{item.question}</p>
                    </div>

                    <div className="bg-slate-900 p-2.5 rounded-lg border border-slate-850">
                      <span className="font-bold text-slate-500 block mb-0.5">A:</span>
                      <p className="text-slate-400 font-mono leading-relaxed">{item.answer}</p>
                    </div>

                    <div>
                      <span className="font-bold text-emerald-400 block mb-0.5">{isRtl ? 'ملاحظات التقييم والتعديل:' : 'Manager Evaluation & Critique:'}</span>
                      <p className="text-slate-300 leading-relaxed">{item.feedback}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-end pt-2 border-t border-slate-800">
              <button
                onClick={() => setViewingHistoryItem(null)}
                className="bg-slate-950 hover:bg-slate-850 text-slate-300 font-bold px-6 py-2 rounded-xl text-xs border border-slate-800 cursor-pointer"
              >
                {isRtl ? 'إغلاق التقرير' : 'Close Transcript'}
              </button>
            </div>

          </div>
        </div>
      )}

      {/* Resume ATS Analyzer Modal */}
      <ResumeAnalyzerModal
        isOpen={isResumeModalOpen}
        onClose={() => setIsResumeModalOpen(false)}
      />

      {/* SQL EXPLAIN Optimizer Modal */}
      <SQLQueryOptimizerModal
        isOpen={isSqlModalOpen}
        onClose={() => setIsSqlModalOpen(false)}
      />

    </div>
  );
};
