/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { CertificateView } from '../components/CertificateView';
import { generateCertificateId } from '../data/questions';
import { 
  Award, CheckCircle2, XCircle, HelpCircle, ArrowLeft, RefreshCw, LayoutDashboard, Brain, BookOpen, Clock, Target, ShieldCheck
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const Report: React.FC = () => {
  const { t, isRtl, progress } = useApp();
  const location = useLocation();
  const navigate = useNavigate();

  // Selected result data from route state
  const stateData = location.state || {};
  const result = stateData.result;
  const questions = stateData.questions || [];

  const [activeTab, setActiveTab] = useState<'summary' | 'review' | 'certificate'>('summary');

  if (!result) {
    return (
      <div className="max-w-md mx-auto text-center py-16 space-y-4" id="report-empty-state">
        <HelpCircle className="w-12 h-12 text-slate-600 mx-auto" />
        <h2 className="text-xl font-bold text-white">No Assessment Data Found</h2>
        <p className="text-xs text-slate-400">Complete an assessment from the home page to review your performance metrics.</p>
        <button
          onClick={() => navigate('/')}
          className="bg-amber-500 hover:bg-amber-600 text-slate-900 font-bold px-4 py-2 rounded-xl text-xs"
        >
          Return Home
        </button>
      </div>
    );
  }

  // Generate a mock certificate validation ID
  const certId = generateCertificateId(progress.userName, result.category);

  // Personalized Intelligent Feedback based on percentages
  const getPersonalizedFeedback = () => {
    const score = result.percentage;
    if (score >= 90) {
      return {
        rating: 'Outstanding Master',
        grade: 'A+',
        commentEn: `Exceptional mastery! You have demonstrated comprehensive expertise in ${result.category.toUpperCase()}. Your solutions are robust, quick, and structurally sound. You are fully prepared for mid-to-senior technical roles in this domain!`,
        commentAr: `إتقان استثنائي وممتاز! لقد أظهرت خبرة شاملة في ${result.category.toUpperCase()}. حلولك قوية وسريعة ومصاغة بشكل سليم هيكلياً. أنت مؤهل تماماً للأدوار التقنية المتوسطة والمتقدمة في هذا المجال!`,
        color: 'text-emerald-400'
      };
    }
    if (score >= 75) {
      return {
        rating: 'Competent Practitioner',
        grade: 'A',
        commentEn: `Great job! You have strong core foundations in ${result.category.toUpperCase()} and are ready for junior development positions. Review your minor weak topics to maximize accuracy under strict execution logs.`,
        commentAr: `عمل رائع! لديك أسس قوية في ${result.category.toUpperCase()} وأنت جاهز تماماً لوظائف التطوير المبتدئة. راجع الموضوعات الضعيفة الطفيفة لتحقيق أقصى قدر من دقة الكود.`,
        color: 'text-indigo-400'
      };
    }
    if (score >= 60) {
      return {
        rating: 'Developing Programmer',
        grade: 'B',
        commentEn: `Satisfactory baseline. You understand general semantic guidelines and basic properties, but require additional practice with advanced parameters, specificity conflicts, or memory closure scopes.`,
        commentAr: `خط أساس مرضي. أنت تفهم الإرشادات العامة للموضوع والخصائص الأساسية، ولكنك تحتاج لمزيد من الممارسة مع المعاملات المتقدمة، وتعارض الخصوصية، أو نطاقات الـ closures في الذاكرة.`,
        color: 'text-amber-500'
      };
    }
    return {
      rating: 'Apprentice Developer',
      grade: 'C',
      commentEn: `Continuing study recommended. Focus heavily on core terminology, syntax rules, and standard responsive layout builders. Retry incorrect questions in study mode to build core knowledge.`,
      commentAr: `يوصى بمواصلة الدراسة والتدريب. ركز بشكل كبير على المصطلحات الأساسية، قواعد الصياغة، وبناء التخطيطات القياسية المتجاوبة. أعد المحاولة في وضع الدراسة لبناء المعرفة الأساسية.`,
      color: 'text-red-400'
    };
  };

  const feedback = getPersonalizedFeedback();

  // Helper to get matching option letters
  const getOptionLetter = (idx: number) => String.fromCharCode(65 + idx);

  // Format question state displays for user review
  const getAnswerReviewDetails = (q: any) => {
    const uAns = result.answers[q.id];
    let isCorrect = false;
    let uAnsText = 'Skipped / تم التخطي';

    if (uAns !== undefined && uAns !== null) {
      if (q.type === 'multiple-choice' || q.type === 'true-false' || q.type === 'code-output' || q.type === 'bug-fixing') {
        const correctOptIdx = q.correctAnswer[0];
        if (uAns[0] === correctOptIdx) isCorrect = true;
        uAnsText = `${getOptionLetter(uAns[0])}. ${isRtl ? q.optionsAr[uAns[0]] : q.options[uAns[0]]}`;
      } else if (q.type === 'multiple-answer') {
        const correctList = q.correctAnswer;
        const matchAll = correctList.length === uAns.length && correctList.every((val: any) => uAns.includes(val));
        if (matchAll) isCorrect = true;
        uAnsText = uAns.map((idx: number) => getOptionLetter(idx)).join(', ');
      } else if (q.type === 'fill-in-blank') {
        if (String(uAns).trim().toLowerCase() === String(q.correctAnswer).trim().toLowerCase()) isCorrect = true;
        uAnsText = String(uAns);
      } else if (q.type === 'match-columns') {
        let allMatched = true;
        for (let i = 0; i < q.matchLeft!.length; i++) {
          if (uAns[i] !== q.correctAnswer[i]) {
            allMatched = false;
            break;
          }
        }
        if (allMatched) isCorrect = true;
        uAnsText = 'Completed connections';
      }
    }

    const correctText = (q.type === 'multiple-choice' || q.type === 'true-false' || q.type === 'code-output' || q.type === 'bug-fixing')
      ? `${getOptionLetter(q.correctAnswer[0])}. ${isRtl ? q.optionsAr[q.correctAnswer[0]] : q.options[q.correctAnswer[0]]}`
      : q.type === 'multiple-answer'
        ? q.correctAnswer.map((idx: number) => getOptionLetter(idx)).join(', ')
        : String(q.correctAnswer);

    return {
      isCorrect,
      uAnsText,
      correctText
    };
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-10" id="report-view-root">
      
      {/* 1. Header & Quick actions */}
      <section className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4" id="report-header">
        <div className="space-y-1">
          <h1 className="text-xl md:text-2xl font-black text-white uppercase tracking-tight">Assessment Report</h1>
          <p className="text-xs text-slate-400">Complete analysis of your performance weights and skills mapping.</p>
        </div>

        <div className="flex space-x-2 rtl:space-x-reverse">
          <button
            onClick={() => navigate(`/assessment?category=${result.category}`)}
            className="flex items-center space-x-1.5 rtl:space-x-reverse bg-slate-900 hover:bg-slate-800 border border-slate-800 px-4 py-2 rounded-xl text-xs font-bold text-slate-300 transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Retake Exam</span>
          </button>
          
          <button
            onClick={() => navigate('/dashboard')}
            className="flex items-center space-x-1.5 rtl:space-x-reverse bg-amber-500 hover:bg-amber-600 text-slate-900 px-4 py-2 rounded-xl text-xs font-extrabold transition-colors"
          >
            <LayoutDashboard className="w-4 h-4" />
            <span>Go to Dashboard</span>
          </button>
        </div>
      </section>

      {/* 2. Custom Tabs navigation */}
      <nav className="flex space-x-1.5 rtl:space-x-reverse bg-slate-900 p-1.5 rounded-2xl border border-slate-800/80 w-fit mx-auto sm:mx-0">
        <button
          onClick={() => setActiveTab('summary')}
          className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'summary' 
              ? 'bg-slate-950 text-amber-500 shadow-md border border-slate-800' 
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Performance Summary
        </button>

        <button
          onClick={() => setActiveTab('review')}
          className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'review' 
              ? 'bg-slate-950 text-amber-500 shadow-md border border-slate-800' 
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Review Questions ({questions.length})
        </button>

        {result.percentage >= 70 && (
          <button
            onClick={() => setActiveTab('certificate')}
            className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'certificate' 
                ? 'bg-slate-950 text-amber-500 shadow-md border border-slate-800' 
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Award Certificate 🎓
          </button>
        )}
      </nav>

      {/* 3. Render tabs content */}
      <AnimatePresence mode="wait">
        
        {/* TAB 1: Summary report */}
        {activeTab === 'summary' && (
          <motion.div
            key="summary-tab"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="space-y-8"
          >
            {/* Scoring & intelligent comments banner */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-slate-900 border border-slate-800/80 p-6 md:p-8 rounded-3xl backdrop-blur-md">
              
              <div className="flex flex-col items-center justify-center text-center space-y-3 md:border-r border-slate-800 rtl:md:border-r-0 rtl:md:border-l py-4">
                <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">Final Weighted Grade</span>
                <div className="w-24 h-24 rounded-full bg-slate-950 flex items-center justify-center border-4 border-amber-500 shadow-xl shadow-amber-500/5">
                  <span className="text-3xl font-black text-white">{feedback.grade}</span>
                </div>
                <div className="space-y-0.5">
                  <p className="text-sm font-black text-amber-500 font-mono">{Math.round(result.percentage)}%</p>
                  <p className="text-[10px] text-slate-500 uppercase">{feedback.rating}</p>
                </div>
              </div>

              {/* AI intelligent comment box */}
              <div className="md:col-span-2 flex flex-col justify-center space-y-4 py-4 md:px-6">
                <div className="flex items-center space-x-2 rtl:space-x-reverse text-amber-500">
                  <Brain className="w-5 h-5" />
                  <h3 className="font-extrabold text-xs uppercase tracking-wider">Intelligent AI Evaluation Logs</h3>
                </div>
                <p className="text-slate-300 text-xs md:text-sm leading-relaxed italic bg-slate-950/40 p-4 rounded-xl border border-slate-800/50">
                  "{isRtl ? feedback.commentAr : feedback.commentEn}"
                </p>
              </div>

            </div>

            {/* Metrics Breakdown Bento Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              
              <div className="p-5 bg-slate-900/50 border border-slate-800 rounded-2xl flex items-center space-x-4 rtl:space-x-reverse">
                <div className="w-10 h-10 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <div className="space-y-0.5">
                  <p className="text-[10px] text-slate-500 uppercase font-semibold">Correct Items</p>
                  <p className="text-lg font-black text-slate-200 font-mono">{result.correctCount} Qs</p>
                </div>
              </div>

              <div className="p-5 bg-slate-900/50 border border-slate-800 rounded-2xl flex items-center space-x-4 rtl:space-x-reverse">
                <div className="w-10 h-10 rounded-lg bg-red-500/10 text-red-400 flex items-center justify-center">
                  <XCircle className="w-5 h-5" />
                </div>
                <div className="space-y-0.5">
                  <p className="text-[10px] text-slate-500 uppercase font-semibold">Incorrect Items</p>
                  <p className="text-lg font-black text-slate-200 font-mono">{result.incorrectCount} Qs</p>
                </div>
              </div>

              <div className="p-5 bg-slate-900/50 border border-slate-800 rounded-2xl flex items-center space-x-4 rtl:space-x-reverse">
                <div className="w-10 h-10 rounded-lg bg-slate-800 text-slate-400 flex items-center justify-center">
                  <HelpCircle className="w-5 h-5" />
                </div>
                <div className="space-y-0.5">
                  <p className="text-[10px] text-slate-500 uppercase font-semibold">Skipped Items</p>
                  <p className="text-lg font-black text-slate-200 font-mono">{result.skippedCount} Qs</p>
                </div>
              </div>

              <div className="p-5 bg-slate-900/50 border border-slate-800 rounded-2xl flex items-center space-x-4 rtl:space-x-reverse">
                <div className="w-10 h-10 rounded-lg bg-sky-500/10 text-sky-400 flex items-center justify-center">
                  <Clock className="w-5 h-5" />
                </div>
                <div className="space-y-0.5">
                  <p className="text-[10px] text-slate-500 uppercase font-semibold">Elapsed Duration</p>
                  <p className="text-lg font-black text-slate-200 font-mono">
                    {Math.floor(result.timeSpent / 60)}m {result.timeSpent % 60}s
                  </p>
                </div>
              </div>

            </div>

            {/* Strengths & Weaknesses breakdown */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              <div className="bg-slate-900 border border-slate-800/80 p-6 rounded-2xl space-y-4">
                <div className="flex items-center space-x-2 rtl:space-x-reverse text-emerald-400 font-extrabold text-sm uppercase tracking-wider">
                  <CheckCircle2 className="w-5 h-5" />
                  <span>Demonstrated Strengths</span>
                </div>
                <ul className="space-y-2.5">
                  {result.strengths.map((str: string, idx: number) => (
                    <li key={idx} className="text-xs md:text-sm text-slate-300 flex items-center space-x-2.5 rtl:space-x-reverse bg-slate-950/60 p-3 rounded-xl border border-slate-800">
                      <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                      <span>{str}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-slate-900 border border-slate-800/80 p-6 rounded-2xl space-y-4">
                <div className="flex items-center space-x-2 rtl:space-x-reverse text-amber-500 font-extrabold text-sm uppercase tracking-wider">
                  <XCircle className="w-5 h-5" />
                  <span>Topic Improvement Areas</span>
                </div>
                <ul className="space-y-2.5">
                  {result.weaknesses.map((weak: string, idx: number) => (
                    <li key={idx} className="text-xs md:text-sm text-slate-300 flex items-center space-x-2.5 rtl:space-x-reverse bg-slate-950/60 p-3 rounded-xl border border-slate-800">
                      <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                      <span>{weak}</span>
                    </li>
                  ))}
                </ul>
              </div>

            </div>

            {/* Difficulty Analysis statistics */}
            <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-4" id="difficulty-breakdown-card">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">Difficulty Accuracy Breakdown</h3>
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                {Object.entries(result.difficultyBreakdown).map(([diff, counts]: [string, any]) => {
                  const percentage = counts.total > 0 ? (counts.correct / counts.total) * 100 : 0;
                  return (
                    <div key={diff} className="p-4 bg-slate-950 rounded-xl space-y-2 text-center border border-slate-800/50">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{diff}</p>
                      <p className="text-lg font-black text-white font-mono">{counts.correct} / {counts.total}</p>
                      <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                        <div className="h-full bg-indigo-500" style={{ width: `${percentage}%` }}></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

          </motion.div>
        )}

        {/* TAB 2: Review Questions Mode */}
        {activeTab === 'review' && (
          <motion.div
            key="review-tab"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="space-y-6"
          >
            {questions.map((q: any, idx: number) => {
              const { isCorrect, uAnsText, correctText } = getAnswerReviewDetails(q);
              return (
                <div 
                  key={q.id}
                  className={`p-6 rounded-2xl border ${
                    isCorrect 
                      ? 'bg-slate-900 border-emerald-500/20' 
                      : 'bg-slate-900 border-red-500/20'
                  } space-y-4`}
                >
                  <div className="flex justify-between items-start gap-4">
                    <div className="space-y-1">
                      <span className="text-[9px] font-mono font-bold uppercase px-2 py-0.5 rounded-full bg-slate-950 text-amber-500">
                        {q.topic}
                      </span>
                      <h3 className="text-xs md:text-sm text-slate-200 font-medium">
                        Q{idx + 1}. {isRtl ? q.questionTextAr : q.questionText}
                      </h3>
                    </div>

                    <span className={`text-xs font-bold px-3 py-1 rounded-full ${
                      isCorrect ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'
                    }`}>
                      {isCorrect ? 'Correct' : 'Incorrect'}
                    </span>
                  </div>

                  {q.codeSnippet && (
                    <pre className="p-3.5 bg-slate-950 rounded-xl text-xs font-mono text-amber-400/95 overflow-x-auto border border-slate-800/80">
                      <code>{q.codeSnippet}</code>
                    </pre>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs md:text-sm pt-2 border-t border-slate-950">
                    <div className="p-3 bg-slate-950/60 rounded-xl space-y-1">
                      <p className="text-[10px] text-slate-500 font-bold uppercase">Your Selection:</p>
                      <p className={`font-semibold ${isCorrect ? 'text-emerald-400' : 'text-red-400'}`}>{uAnsText}</p>
                    </div>

                    <div className="p-3 bg-slate-950/60 rounded-xl space-y-1">
                      <p className="text-[10px] text-slate-500 font-bold uppercase">Correct Answer:</p>
                      <p className="font-semibold text-slate-200">{correctText}</p>
                    </div>
                  </div>

                  <div className="p-4 bg-slate-950/40 border border-slate-850 rounded-xl text-xs md:text-sm text-slate-400 space-y-1">
                    <p className="font-bold text-slate-300 text-[10px] uppercase">Explanation & Reference logs:</p>
                    <p>{isRtl ? q.explanationAr : q.explanation}</p>
                  </div>
                </div>
              );
            })}
          </motion.div>
        )}

        {/* TAB 3: Verifiable Certificate */}
        {activeTab === 'certificate' && result.percentage >= 70 && (
          <motion.div
            key="certificate-tab"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
          >
            <CertificateView
              userName={progress.userName}
              categoryName={result.category.toUpperCase() + " Core Competency evaluation"}
              score={result.percentage}
              date={result.date}
              certId={certId}
            />
          </motion.div>
        )}

      </AnimatePresence>

    </div>
  );
};
