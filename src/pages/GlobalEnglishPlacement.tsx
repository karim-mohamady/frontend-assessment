/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import {
  Globe, Award, CheckCircle2, XCircle, RefreshCw, Volume2, Sparkles,
  ArrowRight, ArrowLeft, ShieldCheck, HelpCircle, BookOpen, Clock,
  Brain, Zap, ChevronRight, Share2, Download, Check, Star, Layers
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export interface CEFRQuestion {
  id: string;
  level: 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2';
  category: 'Tech Vocabulary' | 'Grammar & Syntax' | 'Business Communication' | 'Code Review & PRs';
  questionEn: string;
  questionAr: string;
  options: { id: string; textEn: string; textAr?: string }[];
  correctOptionId: string;
  explanationEn: string;
  explanationAr: string;
}

export const CEFR_QUESTIONS: CEFRQuestion[] = [
  {
    id: 'eng-1',
    level: 'A1',
    category: 'Tech Vocabulary',
    questionEn: 'Which of the following describes a temporary memory area used by servers?',
    questionAr: 'أي مما يلي يصف منطقة ذاكرة مؤقتة تستخدمها الخوادم لتسريع الاستجابة؟',
    options: [
      { id: 'a', textEn: 'Cache', textAr: 'الذاكرة المؤقتة (Cache)' },
      { id: 'b', textEn: 'Monolith', textAr: 'النظام الأحادي' },
      { id: 'c', textEn: 'Compiler', textAr: 'المترجم' },
      { id: 'd', textEn: 'Repository', textAr: 'المستودع' }
    ],
    correctOptionId: 'a',
    explanationEn: 'Cache refers to high-speed data storage layer that stores a subset of data temporarily.',
    explanationAr: 'الـ Cache هي طبقة تخزين فائقة السرعة تحتفظ ببيانات مؤقتة للوصول السريع.'
  },
  {
    id: 'eng-2',
    level: 'A2',
    category: 'Grammar & Syntax',
    questionEn: 'Complete the sentence for a daily standup: "I _____ the bug yesterday and now I am testing it."',
    questionAr: 'أكمل الجملة في اجتماع اليوميات: "أنا _____ الخطأ البرمجي بالأمس والآن أقوم باختباره."',
    options: [
      { id: 'a', textEn: 'fix' },
      { id: 'b', textEn: 'fixed' },
      { id: 'c', textEn: 'have fixed' },
      { id: 'd', textEn: 'fixing' }
    ],
    correctOptionId: 'b',
    explanationEn: 'Use simple past "fixed" because a specific past time frame ("yesterday") is stated.',
    explanationAr: 'نستخدم الماضي البسيط "fixed" لوجود تحديد زمني محدد بالماضي وهو "yesterday".'
  },
  {
    id: 'eng-3',
    level: 'B1',
    category: 'Business Communication',
    questionEn: 'How should you politely ask a teammate to clarify a Pull Request review comment?',
    questionAr: 'كيف تطلب من زميلك بأدب احترافي توضيح تعليق على مراجعة كود (Pull Request)؟',
    options: [
      { id: 'a', textEn: 'Your comment makes no sense. Explain it.' },
      { id: 'b', textEn: 'Could you please elaborate on what you mean by refactoring this module?' },
      { id: 'c', textEn: 'I will ignore this comment if you do not reply now.' },
      { id: 'd', textEn: 'Re-write your comment again.' }
    ],
    correctOptionId: 'b',
    explanationEn: '"Could you please elaborate..." is professional, clear, and constructive engineering communication.',
    explanationAr: 'عبارة "Could you please elaborate..." مؤدبة ومحترفة وتدعو للحوار البنّاء في بيئة العمل.'
  },
  {
    id: 'eng-4',
    level: 'B2',
    category: 'Code Review & PRs',
    questionEn: 'In a Code Review, a senior dev writes: "This operation is synchronous and might cause thread blockage under high concurrency." What is the main concern?',
    questionAr: 'في مراجعة الكود، كتب المطور الخبير: "تلك العملية تزامنية وقد تسبب انسداد التهدات عند ضغط الزوار". ما المشكلة الرئيسية؟',
    options: [
      { id: 'a', textEn: 'The UI color scheme is wrong.' },
      { id: 'b', textEn: 'The function blocks execution threads and harms server throughput.' },
      { id: 'c', textEn: 'The code is missing semicolon brackets.' },
      { id: 'd', textEn: 'The database has deleted all records.' }
    ],
    correctOptionId: 'b',
    explanationEn: '"Thread blockage under concurrency" means blocking execution threads under high load, causing performance latency.',
    explanationAr: 'المقصود هو أن الدوال التزامنية الثقيلة تحجز التهدات وتعطل معالجة بقية الطلبات عند ضغط المستخدمين.'
  },
  {
    id: 'eng-5',
    level: 'C1',
    category: 'Tech Vocabulary',
    questionEn: 'What does the term "Idempotent" mean in RESTful API design?',
    questionAr: 'ماذا يعني مصطلح "Idempotent" في تصميم واجهات REST API؟',
    options: [
      { id: 'a', textEn: 'An API call that fails randomly on every retry.' },
      { id: 'b', textEn: 'An operation that produces the exact same side-effect regardless of how many times it is executed.' },
      { id: 'c', textEn: 'An API method that encrypts user passwords in transit.' },
      { id: 'd', textEn: 'A route that only accepts WebSocket connections.' }
    ],
    correctOptionId: 'b',
    explanationEn: 'Idempotency guarantees that multiple identical requests leave the server in the exact same state (e.g., HTTP PUT / DELETE).',
    explanationAr: 'المقصود بالـ Idempotent أن تنفيذ الطلب مرة واحدة أو عدة مرات ينتج عنه نفس الحالة النهائية بالضبط بدون تكرار للآثار المترتبة.'
  },
  {
    id: 'eng-6',
    level: 'C2',
    category: 'Business Communication',
    questionEn: 'Identify the nuance in: "While we acknowledge the legacy system\'s resilience, migrating to event-driven microservices is imperative to mitigate cascading latency under peak loads."',
    questionAr: 'حدد المعنى الدقيق للجملة: "على الرغم من تقديرنا لصلابة النظام القديم، فإن الانتقال للموجّه بالأحداث أمر حتمي لمنع تراكم البطء بالذروة."',
    options: [
      { id: 'a', textEn: 'The speaker recommends keeping the monolith forever.' },
      { id: 'b', textEn: 'The speaker respects the old architecture but strongly mandates migration to prevent system failure.' },
      { id: 'c', textEn: 'The system has already crashed and cannot be saved.' },
      { id: 'd', textEn: 'The architecture team has decided to abandon the cloud.' }
    ],
    correctOptionId: 'b',
    explanationEn: 'The speaker balances diplomatic praise for the old system ("acknowledge resilience") with an imperative business decision ("mitigate cascading latency").',
    explanationAr: 'المتحدث يعترف بصلابة القديم باحترافية، ولكنه يشدد على حتمية التحول كقرار معطيات هندسي لمنع تسلسل الانهيارات.'
  }
];

export const GlobalEnglishPlacement: React.FC = () => {
  const { isRtl, lang } = useApp();

  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>({});
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [testCompleted, setTestCompleted] = useState<boolean>(false);
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);

  const currentQ = CEFR_QUESTIONS[currentIndex];
  const userSelected = selectedAnswers[currentQ.id];

  // Speech synthesis for native sound
  const handleSpeakQuestion = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(currentQ.questionEn);
      utterance.lang = 'en-US';
      utterance.rate = 0.95;
      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleSelectOption = (optionId: string) => {
    if (isSubmitted) return;
    setSelectedAnswers(prev => ({ ...prev, [currentQ.id]: optionId }));
  };

  const handleNext = () => {
    if (currentIndex < CEFR_QUESTIONS.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setIsSubmitted(false);
    } else {
      setTestCompleted(true);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
    }
  };

  const handleReset = () => {
    setCurrentIndex(0);
    setSelectedAnswers({});
    setIsSubmitted(false);
    setTestCompleted(false);
  };

  // Score Calculations
  const calculateResult = () => {
    let totalCorrect = 0;
    const categoryScores: Record<string, { correct: number; total: number }> = {};

    CEFR_QUESTIONS.forEach(q => {
      const userAns = selectedAnswers[q.id];
      const isCorrect = userAns === q.correctOptionId;

      if (isCorrect) totalCorrect++;

      if (!categoryScores[q.category]) {
        categoryScores[q.category] = { correct: 0, total: 0 };
      }
      categoryScores[q.category].total++;
      if (isCorrect) categoryScores[q.category].correct++;
    });

    const percentage = Math.round((totalCorrect / CEFR_QUESTIONS.length) * 100);

    let cefrLevel: 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2' = 'A1';
    let titleAr = 'مبتدئ (A1)';
    let titleEn = 'Elementary (A1)';

    if (percentage >= 90) { cefrLevel = 'C2'; titleAr = 'متقن كالمتحدث الأصلي (C2 Master)'; titleEn = 'Mastery / Native Fluency (C2)'; }
    else if (percentage >= 75) { cefrLevel = 'C1'; titleAr = 'متقدم احترافي (C1 Advanced)'; titleEn = 'Effective Operational Proficiency (C1)'; }
    else if (percentage >= 60) { cefrLevel = 'B2'; titleAr = 'فوق المتوسط - طليق (B2 Vantage)'; titleEn = 'Vantage / Business Fluent (B2)'; }
    else if (percentage >= 45) { cefrLevel = 'B1'; titleAr = 'متوسط (B1 Threshold)'; titleEn = 'Threshold / Intermediate (B1)'; }
    else if (percentage >= 30) { cefrLevel = 'A2'; titleAr = 'دون المتوسط (A2 Waystage)'; titleEn = 'Waystage / Elementary (A2)'; }

    return { totalCorrect, totalCount: CEFR_QUESTIONS.length, percentage, cefrLevel, titleAr, titleEn, categoryScores };
  };

  const result = calculateResult();

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-8" id="global-english-placement-page">
      
      {/* Top Banner Header */}
      <div className="bg-gradient-to-r from-indigo-900/60 via-slate-900 to-slate-900 border border-indigo-500/30 rounded-3xl p-6 md:p-8 space-y-4 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center space-x-3 rtl:space-x-reverse">
            <div className="p-3 bg-indigo-500/20 border border-indigo-500/40 rounded-2xl text-indigo-300 shadow-md">
              <Globe className="w-8 h-8" />
            </div>
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-[11px] font-black text-indigo-400 uppercase tracking-wider mb-1">
                <span>CEFR Standard Framework</span>
              </div>
              <h1 className="text-2xl md:text-3xl font-black text-white">
                {isRtl ? 'اختبار تحديد مستوى اللغة الإنجليزية الدولي (Global CEFR Placement Test)' : 'Global CEFR English Placement Test'}
              </h1>
              <p className="text-xs md:text-sm text-slate-300 mt-1 max-w-2xl">
                {isRtl ? 'اختبار دولي متدرج يقيم مصطلحات البرمجة والتواصل في بيئة العمل التقنية (Code Reviews, Standups & Architecture Proposals).' : 'Adaptive test measuring technical vocabulary, engineering grammar, and global workplace communication according to the CEFR framework.'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 bg-slate-950/80 border border-slate-800 p-3 rounded-2xl font-mono text-xs">
            <Clock className="w-4 h-4 text-amber-400" />
            <span className="text-slate-300">{isRtl ? 'بدون حد زمني' : 'Untimed Assessment'}</span>
          </div>
        </div>
      </div>

      {!testCompleted ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Main Question Card Area */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* Progress Bar & Badges */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex items-center justify-between">
              <div className="flex items-center space-x-2 rtl:space-x-reverse">
                <span className="w-8 h-8 rounded-xl bg-indigo-500/20 border border-indigo-500/40 text-indigo-300 font-extrabold flex items-center justify-center text-xs font-mono">
                  {currentIndex + 1}
                </span>
                <span className="text-xs font-extrabold text-slate-300">
                  {isRtl ? `سؤال ${currentIndex + 1} من ${CEFR_QUESTIONS.length}` : `Question ${currentIndex + 1} of ${CEFR_QUESTIONS.length}`}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <span className="px-2.5 py-1 bg-amber-500/10 border border-amber-500/30 rounded-lg text-amber-400 text-xs font-mono font-bold">
                  Level {currentQ.level}
                </span>
                <span className="px-2.5 py-1 bg-slate-800 text-slate-300 rounded-lg text-xs font-bold hidden sm:inline-block">
                  {currentQ.category}
                </span>
              </div>
            </div>

            {/* Question Text Card */}
            <motion.div
              key={currentQ.id}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 space-y-6 shadow-xl relative"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-2 flex-1">
                  <h3 className="text-lg md:text-xl font-bold text-white leading-snug">
                    {currentQ.questionEn}
                  </h3>
                  {isRtl && (
                    <p className="text-xs text-slate-400 font-medium leading-relaxed bg-slate-950/60 p-3 rounded-xl border border-slate-800/80">
                      {currentQ.questionAr}
                    </p>
                  )}
                </div>

                {/* Text-to-Speech Audio Trigger */}
                <button
                  onClick={handleSpeakQuestion}
                  className={`p-2.5 rounded-xl border transition-all cursor-pointer ${
                    isSpeaking
                      ? 'bg-indigo-500 text-slate-950 border-indigo-400 animate-pulse'
                      : 'bg-slate-800 text-indigo-300 border-slate-700 hover:bg-slate-700'
                  }`}
                  title="Pronounce Question"
                >
                  <Volume2 className="w-5 h-5" />
                </button>
              </div>

              {/* Options Grid */}
              <div className="space-y-3 pt-2">
                {currentQ.options.map((opt) => {
                  const isChosen = userSelected === opt.id;
                  const isCorrect = opt.id === currentQ.correctOptionId;

                  let cardStyle = "bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700 hover:bg-slate-800/50";

                  if (isSubmitted) {
                    if (isCorrect) {
                      cardStyle = "bg-emerald-500/15 border-emerald-500/60 text-emerald-300 shadow-md shadow-emerald-500/10";
                    } else if (isChosen && !isCorrect) {
                      cardStyle = "bg-rose-500/15 border-rose-500/60 text-rose-300";
                    } else {
                      cardStyle = "bg-slate-950/40 border-slate-900 text-slate-500 opacity-60";
                    }
                  } else if (isChosen) {
                    cardStyle = "bg-indigo-500/15 border-indigo-500/60 text-indigo-200 shadow-lg shadow-indigo-500/10";
                  }

                  return (
                    <button
                      key={opt.id}
                      onClick={() => handleSelectOption(opt.id)}
                      disabled={isSubmitted}
                      className={`w-full text-left rtl:text-right p-4 rounded-2xl border transition-all duration-200 flex items-center justify-between gap-3 cursor-pointer ${cardStyle}`}
                    >
                      <div className="flex items-center space-x-3 rtl:space-x-reverse">
                        <span className={`w-7 h-7 rounded-xl border font-mono font-bold text-xs flex items-center justify-center shrink-0 ${
                          isChosen ? 'bg-indigo-500 text-slate-950 border-indigo-400' : 'bg-slate-900 border-slate-800 text-slate-400'
                        }`}>
                          {opt.id.toUpperCase()}
                        </span>
                        <div>
                          <span className="text-xs md:text-sm font-semibold">{opt.textEn}</span>
                          {opt.textAr && isRtl && (
                            <span className="block text-[11px] text-slate-400 font-normal mt-0.5">{opt.textAr}</span>
                          )}
                        </div>
                      </div>

                      {isSubmitted && isCorrect && <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />}
                      {isSubmitted && isChosen && !isCorrect && <XCircle className="w-5 h-5 text-rose-400 shrink-0" />}
                    </button>
                  );
                })}
              </div>

              {/* Immediate Feedback Explanation Box */}
              <AnimatePresence>
                {isSubmitted && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`p-4 rounded-2xl border text-xs space-y-2 ${
                      userSelected === currentQ.correctOptionId
                        ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-200'
                        : 'bg-rose-500/10 border-rose-500/30 text-rose-200'
                    }`}
                  >
                    <div className="flex items-center gap-2 font-black">
                      {userSelected === currentQ.correctOptionId ? (
                        <>
                          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                          <span>{isRtl ? 'إجابة صحيحة ممتاز!' : 'Correct Answer!'}</span>
                        </>
                      ) : (
                        <>
                          <XCircle className="w-4 h-4 text-rose-400" />
                          <span>{isRtl ? 'إجابة خاطئة - الشرح والتوضيح العلمي:' : 'Incorrect - Learning Explanation:'}</span>
                        </>
                      )}
                    </div>
                    <p className="leading-relaxed font-sans text-slate-300">
                      {isRtl ? currentQ.explanationAr : currentQ.explanationEn}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Navigation Controls */}
              <div className="flex items-center justify-between pt-4 border-t border-slate-800">
                <button
                  onClick={handlePrev}
                  disabled={currentIndex === 0}
                  className="px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-400 hover:text-white disabled:opacity-40 text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5"
                >
                  <ArrowLeft className="w-4 h-4 rtl:rotate-180" />
                  <span>{isRtl ? 'السابق' : 'Previous'}</span>
                </button>

                {!isSubmitted ? (
                  <button
                    onClick={() => setIsSubmitted(true)}
                    disabled={!userSelected}
                    className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold text-xs shadow-lg shadow-indigo-600/20 disabled:opacity-40 transition-all cursor-pointer flex items-center gap-1.5"
                  >
                    <Check className="w-4 h-4" />
                    <span>{isRtl ? 'تأكيد الإجابة والشرح' : 'Check & Explain'}</span>
                  </button>
                ) : (
                  <button
                    onClick={handleNext}
                    className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-slate-950 font-black text-xs shadow-lg shadow-amber-500/20 transition-all cursor-pointer flex items-center gap-1.5"
                  >
                    <span>{currentIndex === CEFR_QUESTIONS.length - 1 ? (isRtl ? 'عرض النتيجة والتصنيف' : 'View Full Scorecard') : (isRtl ? 'التالي' : 'Next Question')}</span>
                    <ArrowRight className="w-4 h-4 rtl:rotate-180" />
                  </button>
                )}
              </div>

            </motion.div>
          </div>

          {/* Sidebar Info & Categories */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* CEFR Scale Explainer */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4">
              <h4 className="text-sm font-black text-white flex items-center gap-2">
                <Award className="w-4 h-4 text-amber-400" />
                <span>{isRtl ? 'سلم درجات المرجعية الأوروبية (CEFR)' : 'CEFR Global Proficiency Levels'}</span>
              </h4>

              <div className="space-y-2 text-xs font-mono">
                {[
                  { level: 'C2', title: 'Native / Mastery', color: 'text-purple-400 bg-purple-500/10 border-purple-500/30' },
                  { level: 'C1', title: 'Professional Advanced', color: 'text-indigo-400 bg-indigo-500/10 border-indigo-500/30' },
                  { level: 'B2', title: 'Upper Intermediate / Fluent', color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30' },
                  { level: 'B1', title: 'Intermediate / Threshold', color: 'text-amber-400 bg-amber-500/10 border-amber-500/30' },
                  { level: 'A2', title: 'Elementary / Waystage', color: 'text-orange-400 bg-orange-500/10 border-orange-500/30' },
                  { level: 'A1', title: 'Beginner / Foundation', color: 'text-slate-400 bg-slate-800 border-slate-700' }
                ].map(item => (
                  <div key={item.level} className={`p-2.5 rounded-xl border flex items-center justify-between ${item.color}`}>
                    <span className="font-extrabold">{item.level}</span>
                    <span className="text-[11px] font-sans">{item.title}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Micro FAQ */}
            <div className="bg-slate-950 border border-slate-800/80 rounded-2xl p-5 space-y-2 text-xs text-slate-400">
              <h5 className="font-extrabold text-slate-200">{isRtl ? 'لماذا يركز الاختبار على المصطلحات التقنية؟' : 'Why Tech & Software Focused?'}</h5>
              <p className="leading-relaxed">
                {isRtl ? 'لأن المقابلات الوظيفية بالشركات العالمية تتطلب صياغة دقيقة لتعليقات مراجعة الكود (Code Reviews) والشرح بالاجتماعات اليومية.' : 'Global tech companies evaluate candidates on clarity during async PR reviews, architecture pitch presentations, and daily standups.'}
              </p>
            </div>

          </div>

        </div>
      ) : (
        /* Final Certificate & Scorecard Stage */
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-slate-900 border border-indigo-500/30 rounded-3xl p-6 md:p-10 space-y-8 shadow-2xl text-center relative overflow-hidden"
        >
          <div className="w-20 h-20 mx-auto rounded-3xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white shadow-xl shadow-indigo-500/20">
            <Award className="w-10 h-10" />
          </div>

          <div className="space-y-2 max-w-xl mx-auto">
            <span className="px-3 py-1 bg-indigo-500/20 border border-indigo-500/40 text-indigo-300 text-xs font-mono font-black rounded-full uppercase">
              Official CEFR Scorecard
            </span>
            <h2 className="text-3xl font-black text-white">
              {isRtl ? `مستواك المحدد: ${result.titleAr}` : `Your Placement Level: ${result.titleEn}`}
            </h2>
            <p className="text-xs text-slate-300">
              {isRtl ? `لقد أجبت بشكل صحيح على ${result.totalCorrect} من إجمالي ${result.totalCount} أسئلة بنسبة توفيق ${result.percentage}%.` : `You correctly answered ${result.totalCorrect} of ${result.totalCount} questions (${result.percentage}% Accuracy).`}
            </p>
          </div>

          {/* CEFR Level Gauge Badge */}
          <div className="inline-block bg-slate-950 border border-indigo-500/40 rounded-2xl p-6 shadow-inner space-y-2">
            <span className="text-[10px] uppercase font-mono tracking-widest text-indigo-400 block">CEFR Grade Band</span>
            <span className="text-5xl font-black font-mono text-amber-400">{result.cefrLevel}</span>
          </div>

          {/* Action buttons */}
          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <button
              onClick={handleReset}
              className="px-6 py-3 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold rounded-xl text-xs transition-all cursor-pointer flex items-center gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              <span>{isRtl ? 'إعادة الاختبار من جديد' : 'Retake Placement Test'}</span>
            </button>
          </div>
        </motion.div>
      )}

    </div>
  );
};
