/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { QuestionCategory } from '../types';
import { CORE_QUESTIONS, PLATFORM_FAQS, getQuestionsByCategory } from '../data/questions';
import { 
  ArrowRight, ShieldCheck, HelpCircle, GraduationCap, Code2, Sparkles, BookOpen, Search, Filter, BookMarked, Layers, Clock, Zap, Brain, Briefcase, Globe
} from 'lucide-react';
import { motion } from 'motion/react';

export const Home: React.FC = () => {
  const { t, lang, isRtl, progress, toggleGlobalBookmark, selectedTrack } = useApp();
  const navigate = useNavigate();

  // Search & Filter state for the Interactive Questions Explorer
  const [explorerCategory, setExplorerCategory] = useState<QuestionCategory>('javascript');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState<any>('');
  const [showFaqIdx, setShowFaqIdx] = useState<number | null>(null);
  const [visibleCount, setVisibleCount] = useState(5);

  // Reset pagination count when filter values change
  React.useEffect(() => {
    setVisibleCount(5);
  }, [explorerCategory, searchQuery, selectedDifficulty]);

  const allCategories = [
    { id: 'html' as const, title: t('catHtml'), desc: t('catHtmlDesc'), icon: '🧱', color: 'from-orange-500 to-red-600', totalQ: '300+', track: 'frontend' },
    { id: 'css' as const, title: t('catCss'), desc: t('catCssDesc'), icon: '🎨', color: 'from-blue-500 to-cyan-600', totalQ: '400+', track: 'frontend' },
    { id: 'javascript' as const, title: t('catJs'), desc: t('catJsDesc'), icon: '⚡', color: 'from-yellow-400 to-amber-600', totalQ: '600+', track: 'frontend' },
    { id: 'react' as const, title: t('catReact'), desc: t('catReactDesc'), icon: '⚛️', color: 'from-sky-400 to-blue-600', totalQ: '500+', track: 'frontend' },
    { id: 'bootstrap' as const, title: t('catBs'), desc: t('catBsDesc'), icon: '⚙️', color: 'from-purple-500 to-indigo-600', totalQ: '200+', track: 'frontend' },
    { id: 'php' as const, title: t('catPhp'), desc: t('catPhpDesc'), icon: '🐘', color: 'from-indigo-600 to-violet-700', totalQ: '350+', track: 'backend' },
    { id: 'laravel' as const, title: t('catLaravel'), desc: t('catLaravelDesc'), icon: '🔴', color: 'from-red-600 to-rose-700', totalQ: '400+', track: 'backend' },
    { id: 'mysql' as const, title: t('catMysql'), desc: t('catMysqlDesc'), icon: '🐬', color: 'from-blue-600 to-teal-700', totalQ: '350+', track: 'backend' },
    { id: 'backend' as const, title: t('catBackend'), desc: t('catBackendDesc'), icon: '🖥️', color: 'from-slate-700 to-emerald-800', totalQ: '450+', track: 'backend' },
    { id: 'uiux' as const, title: t('catUiux'), desc: t('catUiuxDesc'), icon: '🎨', color: 'from-pink-500 to-rose-600', totalQ: '300+', track: 'uiux' },
    { id: 'figma' as const, title: t('catFigma'), desc: t('catFigmaDesc'), icon: '📐', color: 'from-purple-600 to-fuchsia-600', totalQ: '250+', track: 'uiux' },
    { id: 'web3' as const, title: t('catWeb3'), desc: t('catWeb3Desc'), icon: '🪙', color: 'from-amber-500 to-yellow-600', totalQ: '350+', track: 'web3' },
    { id: 'solidity' as const, title: t('catSolidity'), desc: t('catSolidityDesc'), icon: '📜', color: 'from-cyan-600 to-blue-700', totalQ: '300+', track: 'web3' },
    { id: 'testing' as const, title: lang === 'ar' ? 'اختبار الجودة والويب' : 'QA & Web Testing', desc: lang === 'ar' ? 'اختبارات Jest و Playwright و Cypress و APIs' : 'Jest, RTL, Playwright, Cypress & Postman API', icon: '🧪', color: 'from-lime-500 to-emerald-600', totalQ: '350+', track: 'testing' },
    { id: 'english' as const, title: t('catEng'), desc: t('catEngDesc'), icon: '📝', color: 'from-emerald-500 to-teal-600', totalQ: '150+', track: 'fullstack' }
  ];

  const categories = allCategories.filter(c => {
    if (selectedTrack === 'fullstack') return true;
    if (c.track === 'fullstack') return true;
    return c.track === selectedTrack;
  });

  // Fetch all matching search results to calculate total matched count
  const allExploredQuestions = getQuestionsByCategory(
    explorerCategory,
    1000,
    searchQuery,
    selectedDifficulty || undefined
  );

  // Slice questions to display only up to visibleCount
  const exploredQuestions = allExploredQuestions.slice(0, visibleCount);

  const handleStartQuiz = (catId: string) => {
    navigate(`/assessment?category=${catId}`);
  };

  // Quick landing page stats
  const totalAssessmentsTaken = progress.completedAssessments.length;
  const avgScore = totalAssessmentsTaken > 0 
    ? Math.round(progress.completedAssessments.reduce((acc, curr) => acc + curr.percentage, 0) / totalAssessmentsTaken)
    : 0;

  return (
    <div className="space-y-16 pb-20" id="landing-page-root">
      
      {/* 1. Hero Section */}
      <section className="relative overflow-hidden pt-12 md:pt-20" id="hero-section">
        {/* Decorative backdrop shapes */}
        <div className="absolute top-1/4 left-1/3 w-96 h-96 bg-amber-500/10 blur-[120px] rounded-full pointer-events-none"></div>
        <div className="absolute bottom-10 right-1/4 w-96 h-96 bg-indigo-500/10 blur-[120px] rounded-full pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10 space-y-6">
          
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center space-x-2 rtl:space-x-reverse bg-slate-800/60 border border-slate-700/50 px-3.5 py-1.5 rounded-full text-xs font-semibold text-slate-300 shadow-sm"
          >
            <Sparkles className="w-4 h-4 text-amber-500 animate-spin" style={{ animationDuration: '6s' }} />
            <span>React 19 & ESM Compliant Assessment Pipeline</span>
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="text-4xl sm:text-6xl font-black tracking-tight leading-[1.1] max-w-4xl mx-auto text-white"
          >
            {t('heroTitle')}
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-base sm:text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed"
          >
            {t('heroSub')}
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.45 }}
            className="pt-4 flex flex-wrap justify-center gap-4"
          >
            <button
              onClick={() => handleStartQuiz('javascript')}
              className="px-8 py-4 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-slate-900 font-extrabold rounded-2xl shadow-xl shadow-amber-500/10 flex items-center space-x-2.5 rtl:space-x-reverse transform hover:-translate-y-0.5 transition-all text-sm"
              id="hero-primary-cta"
            >
              <span>{t('startBtn')}</span>
              <ArrowRight className="w-4.5 h-4.5" />
            </button>

            <button
              onClick={() => navigate('/dashboard')}
              className="px-8 py-4 bg-slate-800/80 hover:bg-slate-800 border border-slate-700 hover:border-slate-600 text-slate-200 font-bold rounded-2xl flex items-center space-x-2 rtl:space-x-reverse transition-all text-sm"
              id="hero-secondary-cta"
            >
              <span>{t('dashboard')}</span>
            </button>

            <button
              onClick={() => navigate('/sandbox')}
              className="px-8 py-4 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/20 hover:border-amber-500/40 text-amber-500 font-bold rounded-2xl flex items-center space-x-2 rtl:space-x-reverse transition-all text-sm animate-pulse"
              id="hero-sandbox-cta"
              style={{ animationDuration: '3s' }}
            >
              <Code2 className="w-4.5 h-4.5 text-amber-500" />
              <span>{t('sandbox')}</span>
            </button>

            <button
              onClick={() => navigate('/assessment')}
              className="px-8 py-4 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 hover:border-emerald-500/50 text-emerald-400 font-bold rounded-2xl flex items-center space-x-2 rtl:space-x-reverse transition-all text-sm"
              id="hero-takehome-cta"
            >
              <Briefcase className="w-4.5 h-4.5 text-emerald-400" />
              <span>{isRtl ? 'تاسك اختبار القبول الوظيفي' : 'Take-Home Project Task'}</span>
            </button>

            <button
              onClick={() => navigate('/interview')}
              className="px-8 py-4 bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/20 hover:border-purple-500/40 text-purple-400 font-bold rounded-2xl flex items-center space-x-2 rtl:space-x-reverse transition-all text-sm"
              id="hero-interview-cta"
            >
              <Brain className="w-4.5 h-4.5 text-purple-400" />
              <span>{t('interviewPrep')}</span>
            </button>

            <button
              onClick={() => navigate('/english-placement')}
              className="px-8 py-4 bg-indigo-500/10 hover:bg-indigo-500/20 border border-indigo-500/30 hover:border-indigo-500/50 text-indigo-400 font-bold rounded-2xl flex items-center space-x-2 rtl:space-x-reverse transition-all text-sm"
              id="hero-english-cta"
            >
              <Globe className="w-4.5 h-4.5 text-indigo-400" />
              <span>{isRtl ? 'اختبار تحديد مستوى اللغة الإنجليزية' : 'Global English Placement'}</span>
            </button>
          </motion.div>

        </div>
      </section>

      {/* 2. Platform Statistics Metrics */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" id="stats-section">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 bg-slate-900/60 border border-slate-800/80 p-6 md:p-8 rounded-3xl backdrop-blur-md">
          
          <div className="text-center space-y-1">
            <p className="text-3xl md:text-4xl font-extrabold text-amber-500 font-mono">2,150+</p>
            <p className="text-xs text-slate-400 font-medium uppercase tracking-wider">Dynamic Questions</p>
          </div>

          <div className="text-center space-y-1 border-l border-slate-800 rtl:border-l-0 rtl:border-r">
            <p className="text-3xl md:text-4xl font-extrabold text-white font-mono">{totalAssessmentsTaken}</p>
            <p className="text-xs text-slate-400 font-medium uppercase tracking-wider">{t('completedTests')}</p>
          </div>

          <div className="text-center space-y-1 border-l border-slate-800 rtl:border-l-0 rtl:border-r">
            <p className="text-3xl md:text-4xl font-extrabold text-indigo-400 font-mono">{avgScore}%</p>
            <p className="text-xs text-slate-400 font-medium uppercase tracking-wider">{t('avgAccuracy')}</p>
          </div>

          <div className="text-center space-y-1 border-l border-slate-800 rtl:border-l-0 rtl:border-r">
            <p className="text-3xl md:text-4xl font-extrabold text-emerald-400 font-mono">{progress.streak} 🔥</p>
            <p className="text-xs text-slate-400 font-medium uppercase tracking-wider">{t('learningStreak')}</p>
          </div>

        </div>
      </section>

      {/* 3. Categories Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8" id="categories-section">
        <div className="text-center md:text-left rtl:md:text-right space-y-2">
          <h2 className="text-2xl md:text-3xl font-black text-white">{t('assessments')}</h2>
          <p className="text-slate-400 text-sm">{t('certSub')}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((cat, idx) => (
            <motion.div
              whileHover={{ y: -4 }}
              key={cat.id}
              className="group relative bg-slate-900 border border-slate-800/80 hover:border-slate-700/80 rounded-2xl p-6 flex flex-col justify-between space-y-6 transition-all"
            >
              <div className="space-y-4">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${cat.color} flex items-center justify-center text-xl shadow-lg shadow-black/20`}>
                  {cat.icon}
                </div>
                <div className="space-y-1.5">
                  <div className="flex justify-between items-center">
                    <h3 className="font-bold text-white group-hover:text-amber-500 transition-colors text-base md:text-lg">{cat.title}</h3>
                    <span className="text-[10px] font-mono font-bold bg-slate-800 text-slate-400 px-2 py-0.5 rounded-full">{cat.totalQ} Qs</span>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">{cat.desc}</p>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-slate-900">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Self Verifiable</span>
                <button
                  onClick={() => handleStartQuiz(cat.id)}
                  className="flex items-center space-x-1.5 rtl:space-x-reverse text-xs font-bold text-amber-500 group-hover:text-amber-400 transition-colors"
                >
                  <span>{t('startBtn')}</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 rtl:group-hover:-translate-x-1 transition-transform" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* 4. Interactive Questions Pool Explorer & Bookmark manager */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6" id="questions-explorer">
        <div className="bg-slate-900/40 border border-slate-800 p-6 md:p-8 rounded-3xl space-y-6">
          
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="space-y-1">
              <h3 className="text-lg md:text-xl font-extrabold text-white flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-amber-500" />
                <span>Search & Practice Questions Pool</span>
              </h3>
              <p className="text-xs text-slate-400">Search the dynamic database or practice specific single questions.</p>
            </div>

            {/* Category toggle */}
            <div className="flex flex-wrap gap-1.5 bg-slate-950 p-1 rounded-xl border border-slate-800">
              {categories.map((c) => (
                <button
                  key={c.id}
                  onClick={() => { setExplorerCategory(c.id as any); setSearchQuery(''); }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    explorerCategory === c.id 
                      ? 'bg-slate-800 text-amber-500' 
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {c.id.toUpperCase()}
                </button>
              ))}
            </div>
          </div>

          {/* Filtering bar */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            
            <div className="relative">
              <Search className="absolute left-3 top-3 w-4 h-4 text-slate-500" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search questions by topic, text..."
                className="w-full bg-slate-950 border border-slate-800 focus:border-slate-700 focus:outline-none pl-9 pr-3 py-2 rounded-xl text-xs text-slate-200 transition-all placeholder:text-slate-600"
              />
            </div>

            <div className="relative">
              <Filter className="absolute left-3 top-3 w-4 h-4 text-slate-500" />
              <select
                value={selectedDifficulty}
                onChange={(e) => setSelectedDifficulty(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 focus:border-slate-700 focus:outline-none pl-9 pr-3 py-2 rounded-xl text-xs text-slate-200 appearance-none transition-all cursor-pointer"
              >
                <option value="">All Difficulties</option>
                <option value="easy">{t('easy')}</option>
                <option value="medium">{t('medium')}</option>
                <option value="hard">{t('hard')}</option>
                <option value="expert">{t('expert')}</option>
              </select>
            </div>

            {/* Quick stats on explorer selection */}
            <div className="flex items-center justify-end text-xs text-slate-500 pr-2 font-mono">
              {isRtl 
                ? `عرض ${exploredQuestions.length} من أصل ${allExploredQuestions.length}`
                : `Showing ${exploredQuestions.length} of ${allExploredQuestions.length}`
              }
            </div>

          </div>

          {/* Questions list */}
          <div className="space-y-4">
            {exploredQuestions.length > 0 ? (
              exploredQuestions.map((q) => {
                const isSaved = progress.bookmarks.includes(q.id);
                return (
                  <div 
                    key={q.id}
                    className="p-4 bg-slate-950/60 border border-slate-800/80 rounded-xl hover:border-slate-800 transition-all space-y-3 flex flex-col justify-between"
                  >
                    <div className="flex justify-between items-start gap-4">
                      <div className="space-y-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="text-[9px] font-mono font-bold uppercase px-2 py-0.5 rounded-full bg-slate-900 text-amber-500">
                            {q.topic}
                          </span>
                          <span className={`text-[9px] font-mono font-bold uppercase px-2 py-0.5 rounded-full ${
                            q.difficulty === 'easy' ? 'bg-emerald-500/10 text-emerald-400' :
                            q.difficulty === 'medium' ? 'bg-indigo-500/10 text-indigo-400' :
                            q.difficulty === 'hard' ? 'bg-orange-500/10 text-orange-400' :
                            'bg-red-500/10 text-red-400'
                          }`}>
                            {q.difficulty}
                          </span>
                          <span className="text-[9px] text-slate-500">Format: {q.type}</span>
                        </div>
                        <h4 className="text-xs md:text-sm text-slate-200 font-medium leading-relaxed">
                          {lang === 'ar' ? q.questionTextAr : (lang === 'es' && q.questionTextEs ? q.questionTextEs : q.questionText)}
                        </h4>
                      </div>

                      {/* Bookmark Button */}
                      <button
                        onClick={() => toggleGlobalBookmark(q.id)}
                        className={`p-2 rounded-lg border transition-all ${
                          isSaved 
                            ? 'bg-amber-500/10 border-amber-500/30 text-amber-500' 
                            : 'border-slate-800 hover:border-slate-700 text-slate-500 hover:text-slate-300'
                        }`}
                        title={isSaved ? t('bookmarked') : t('bookmark')}
                      >
                        <BookMarked className="w-4 h-4" />
                      </button>
                    </div>

                    {q.codeSnippet && (
                      <pre className="p-3 bg-slate-900 rounded-lg text-xs font-mono text-amber-400/90 overflow-x-auto border border-slate-800/50">
                        <code>{q.codeSnippet}</code>
                      </pre>
                    )}

                    {/* Explanatory prompt preview */}
                    <p className="text-[11px] text-slate-500 italic bg-slate-900/20 p-2 rounded-lg">
                      <strong className="text-slate-400 font-bold uppercase text-[9px] not-italic mr-1">
                        {lang === 'ar' ? 'معاينة الشرح:' : (lang === 'es' ? 'Vista previa de explicación:' : 'Explanation Preview:')}
                      </strong>
                      {lang === 'ar' ? q.explanationAr : (lang === 'es' && q.explanationEs ? q.explanationEs : q.explanation)}
                    </p>
                  </div>
                );
              })
            ) : (
              <div className="text-center py-6 text-slate-500 text-xs">
                {lang === 'ar' 
                  ? 'لم يتم العثور على أسئلة تطابق الفلتر.' 
                  : (lang === 'es' ? 'No se encontraron preguntas que coincidan con tus filtros.' : 'No matching questions found in our custom database. Try shifting your filters or queries.')
                }
              </div>
            )}
          </div>

          {visibleCount < allExploredQuestions.length && (
            <div className="flex justify-center pt-2">
              <button
                onClick={() => setVisibleCount((prev) => prev + 10)}
                className="px-6 py-2.5 bg-slate-950 hover:bg-slate-900 border border-slate-800 hover:border-slate-700 text-amber-500 hover:text-amber-400 font-extrabold text-xs rounded-xl transition-all shadow-md cursor-pointer"
              >
                {lang === 'ar' ? 'تحميل المزيد من الأسئلة' : (lang === 'es' ? 'Cargar más preguntas' : 'Load More Questions')}
              </button>
            </div>
          )}

        </div>
      </section>

      {/* 5. Certificates Showcase Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" id="certificates-promo">
        <div className="bg-gradient-to-r from-amber-500/10 via-indigo-500/5 to-transparent border border-slate-800 p-8 rounded-3xl flex flex-col lg:flex-row justify-between items-center gap-8">
          <div className="space-y-4 max-w-xl text-center lg:text-left rtl:lg:text-right">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center mx-auto lg:mx-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-xl md:text-2xl font-black text-white">{t('certificates')}</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              {t('certSub')} Our certificates are fully localized in English and Arabic, and include an absolute score breakdown, verifiable validation ID, and QR code mapping.
            </p>
          </div>

          <div className="flex flex-col items-center bg-slate-950 p-6 rounded-2xl border border-slate-800 max-w-sm w-full relative shadow-xl">
            {/* Mock Certificate design inside home page */}
            <div className="w-full border border-amber-500/30 p-4 rounded-xl text-center space-y-2 relative">
              <span className="absolute top-2 right-2 text-[8px] font-mono text-slate-500">PLATFORM DRAFT</span>
              <p className="text-[10px] font-bold text-amber-500 uppercase tracking-widest">{t('verifiedCert')}</p>
              <h4 className="text-sm font-extrabold text-white">Elite Front-End Developer</h4>
              <p className="text-[9px] text-slate-400">Score Achieved: 94% (Grade A+)</p>
              <div className="h-[1px] w-24 bg-slate-800 mx-auto"></div>
              <p className="text-[8px] font-mono text-slate-500">ID: CERT-JS-ELI-582910</p>
            </div>
          </div>
        </div>
      </section>

      {/* 6. About the Platform Details */}
      <section className="max-w-3xl mx-auto px-4 text-center space-y-4" id="about-section">
        <h3 className="text-xl md:text-2xl font-black text-white">{t('aboutTitle')}</h3>
        <p className="text-sm text-slate-400 leading-relaxed">
          {t('aboutText')}
        </p>
      </section>

      {/* 7. Accordion FAQ Section */}
      <section className="max-w-3xl mx-auto px-4 space-y-6" id="faq-section">
        <div className="text-center space-y-2">
          <h3 className="text-xl md:text-2xl font-black text-white flex items-center justify-center gap-2">
            <HelpCircle className="w-6 h-6 text-indigo-400" />
            <span>{t('faqTitle')}</span>
          </h3>
        </div>

        <div className="space-y-3">
          {PLATFORM_FAQS.map((faq, idx) => (
            <div 
              key={idx}
              className="border border-slate-800/80 bg-slate-900/30 rounded-xl overflow-hidden"
            >
              <button
                onClick={() => setShowFaqIdx(showFaqIdx === idx ? null : idx)}
                className="w-full text-left rtl:text-right p-4 font-bold text-slate-200 text-xs md:text-sm hover:bg-slate-800/40 transition-colors flex justify-between items-center"
              >
                <span>{lang === 'ar' ? faq.qAr : (lang === 'es' ? faq.qEs : faq.qEn)}</span>
                <span className="text-xs text-amber-500 font-mono">{showFaqIdx === idx ? '−' : '+'}</span>
              </button>
              {showFaqIdx === idx && (
                <div className="p-4 bg-slate-950/60 border-t border-slate-800 text-xs md:text-sm text-slate-400 leading-relaxed">
                  {lang === 'ar' ? faq.aAr : (lang === 'es' ? faq.aEs : faq.aEn)}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

    </div>
  );
};
