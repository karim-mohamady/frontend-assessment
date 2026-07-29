/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  MessageSquare, Sparkles, CheckCircle2, AlertCircle, Award,
  HelpCircle, ArrowRight, RefreshCw, Star, Zap, ThumbsUp, Send
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export interface STARQuestion {
  id: string;
  category: 'leadership' | 'conflict' | 'failure' | 'problem_solving' | 'pressure';
  titleEn: string;
  titleAr: string;
  tipEn: string;
  tipAr: string;
}

const STAR_QUESTIONS: STARQuestion[] = [
  {
    id: 'star-1',
    category: 'problem_solving',
    titleEn: 'Tell me about a time you solved a complex production bug under high pressure.',
    titleAr: 'تحدث عن موقف قمت فيه بحل ثغرة أو خطأ تقني معقد في بيئة التشغيل الفعلي (Production) تحت ضغط عالي.',
    tipEn: 'Focus on your diagnostic process, tools used (logs, metrics), root cause analysis, and the fix.',
    tipAr: 'ركز على آلية التشخيص، الأدوات المستخدمة (السجلات والمقاييس)، التحليل الجذري للمشكلة، والحل النهائي.'
  },
  {
    id: 'star-2',
    category: 'conflict',
    titleEn: 'Describe a situation where you disagreed with a Product Manager or Senior Tech Lead on architecture.',
    titleAr: 'صف موقفاً اختلفت فيه مع مدير المنتج أو كبير المهندسين حول معمارية برمجية أو قرار تقني.',
    tipEn: 'Highlight constructive communication, trade-off analysis, data-driven negotiation, and team alignment.',
    tipAr: 'ابرز التواصل البنّاء، تحليل الموازنات والحلول البديلة (Trade-offs)، والتفاوض المبني على أرقام وحقائق.'
  },
  {
    id: 'star-3',
    category: 'failure',
    titleEn: 'Tell me about a project that failed or missed its deadline. What did you learn?',
    titleAr: 'تحدث عن مشروع فشل أو تجاوز الموعد المحدد (Deadline). ماذا تعلمت وماذا غيرت في أسلوب عملك؟',
    tipEn: 'Take ownership without blaming others, explain the early warning signs missed, and post-mortem actions.',
    tipAr: 'تحمّل المسؤولية بشجاعة دون إلقاء اللوم على الآخرين، ووضح الدروس المستفادة والإجراءات الوقائية المستقبلية.'
  },
  {
    id: 'star-4',
    category: 'leadership',
    titleEn: 'Give an example of how you mentored a junior developer or improved engineering team practices.',
    titleAr: 'اعطِ مثالاً على كيفية توجيه وتدريب مهندس مبتدئ أو تحسين ممارسات الفريق البرمجي (Code Review, CI/CD).',
    tipEn: 'Quantify team productivity gains, code quality improvements, or onboarding time reduction.',
    tipAr: 'استعرض التأثير الرقمي على إنتاجية الفريق، تحسين جودة الكود، أو تقليل زمن تجهيز الموظفين الجدد.'
  }
];

export const STARInterviewStudio: React.FC = () => {
  const { isRtl, lang } = useApp();
  const [activeQIndex, setActiveQIndex] = useState<number>(0);

  // STAR responses state
  const [situation, setSituation] = useState<string>('');
  const [task, setTask] = useState<string>('');
  const [action, setAction] = useState<string>('');
  const [result, setResult] = useState<string>('');

  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [analysis, setAnalysis] = useState<{
    score: number;
    situationScore: number;
    taskScore: number;
    actionScore: number;
    resultScore: number;
    feedbackEn: string;
    feedbackAr: string;
    strengths: string[];
    improvements: string[];
  } | null>(null);

  const currentQ = STAR_QUESTIONS[activeQIndex];

  const handleEvaluateSTAR = () => {
    setIsAnalyzing(true);
    setAnalysis(null);

    setTimeout(() => {
      // Evaluate based on length, keywords, numbers in results
      const hasActionVerbs = /(built|developed|led|optimized|refactored|reduced|designed|implemented|صممت|أنشأت|طورت|قللت|حسّنت)/i.test(action);
      const hasMetrics = /\d+(%|k|ms|s|x|users|مستخدم|ثواني|ساعة)/i.test(result);

      const sScore = situation.length > 30 ? 25 : 15;
      const tScore = task.length > 25 ? 25 : 15;
      const aScore = hasActionVerbs && action.length > 40 ? 25 : 18;
      const rScore = hasMetrics && result.length > 30 ? 25 : 12;

      const totalScore = sScore + tScore + aScore + rScore;

      setAnalysis({
        score: totalScore,
        situationScore: sScore,
        taskScore: tScore,
        actionScore: aScore,
        resultScore: rScore,
        feedbackEn: totalScore >= 85 
          ? 'Outstanding response! You clearly structured the context, owned your personal actions, and provided measurable outcomes.'
          : 'Good structure, but make sure your Result section includes explicit numbers (e.g. 40% performance gain) to maximize impact.',
        feedbackAr: totalScore >= 85 
          ? 'إجابة ممتازة ومتكاملة! قمت بتأطير السياق ببراعة، وأبرزت دورك الفعلي، واستعرضت نتائج رقمية واضحة.'
          : 'بنية جيدة للإجابة، ولكن يُفضل إضافة أرقام ونسب مئوية محددة في قسم النتائج (مثل تحسين السرعة بنسبة 40%) لزيادة إقناع المقابل.',
        strengths: [
          isRtl ? 'اتّباع الهيكل الزمني السليم لأسلوب STAR' : 'Strict adherence to STAR chronological structure',
          isRtl ? 'استخدام أفعال إنجاز مباشرة وتوضيح الدور الشخصي' : 'Strong active verbs indicating clear personal ownership'
        ],
        improvements: hasMetrics ? [] : [
          isRtl ? 'أضف مقاييس وأرقام ملموسة في قسم النتائج (Quantifiable Metrics)' : 'Include measurable metrics in your Results section'
        ]
      });

      setIsAnalyzing(false);
    }, 1400);
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 space-y-6" id="star-interview-studio">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div className="flex items-center space-x-3 rtl:space-x-reverse">
          <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-2xl text-amber-400">
            <Star className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-black text-white">
              {isRtl ? 'ورشة التدريب على المقابلات السلوكية (STAR Method)' : 'Behavioral STAR Method Workshop'}
            </h3>
            <p className="text-xs text-slate-400">
              {isRtl ? 'تدرّب على صياغة الإجابات للأسئلة السلوكية والقيادية بأسلوب STAR المعتمد في الشركات العالمية.' : 'Craft structured responses for behavioral & culture-fit interviews using Situation, Task, Action, and Result framework.'}
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2 rtl:space-x-reverse text-xs">
          {STAR_QUESTIONS.map((_, idx) => (
            <button
              key={idx}
              onClick={() => {
                setActiveQIndex(idx);
                setAnalysis(null);
              }}
              className={`w-8 h-8 rounded-xl font-mono font-bold transition-all cursor-pointer ${
                activeQIndex === idx
                  ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                  : 'bg-slate-950 border border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              Q{idx + 1}
            </button>
          ))}
        </div>
      </div>

      {/* Active Question Box */}
      <div className="bg-slate-950 border border-amber-500/30 rounded-2xl p-5 space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-black uppercase tracking-wider text-amber-400 bg-amber-500/10 px-2.5 py-0.5 rounded-md border border-amber-500/20">
            {currentQ.category.toUpperCase()}
          </span>
          <span className="text-xs text-slate-400 font-mono">Question {activeQIndex + 1} of {STAR_QUESTIONS.length}</span>
        </div>
        <h4 className="text-base md:text-lg font-black text-white leading-relaxed">
          {isRtl ? currentQ.titleAr : currentQ.titleEn}
        </h4>
        <p className="text-xs text-amber-300/80 font-mono flex items-center gap-1.5 pt-1">
          <Zap className="w-3.5 h-3.5 shrink-0" />
          <span>{isRtl ? currentQ.tipAr : currentQ.tipEn}</span>
        </p>
      </div>

      {/* 4-Part STAR Grid Inputs */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Situation */}
        <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-xs font-black text-amber-400 flex items-center gap-1.5">
              <span className="w-5 h-5 rounded-md bg-amber-500/20 text-amber-400 flex items-center justify-center font-mono text-[11px]">S</span>
              <span>{isRtl ? 'الموقف (Situation)' : 'Situation (Context)'}</span>
            </span>
            <span className="text-[10px] text-slate-500">{isRtl ? 'ما هو السياق والتحدي؟' : 'Background context'}</span>
          </div>
          <textarea
            value={situation}
            onChange={e => setSituation(e.target.value)}
            rows={3}
            className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-xs text-slate-200 focus:border-amber-500 outline-none leading-relaxed"
            placeholder={isRtl ? 'صف خلفية المشكلة، المكان، والمشروع الذي كنت تعمل عليه...' : 'Describe the project background and the challenge faced...'}
          />
        </div>

        {/* Task */}
        <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-xs font-black text-blue-400 flex items-center gap-1.5">
              <span className="w-5 h-5 rounded-md bg-blue-500/20 text-blue-400 flex items-center justify-center font-mono text-[11px]">T</span>
              <span>{isRtl ? 'المهمة (Task)' : 'Task (Responsibility)'}</span>
            </span>
            <span className="text-[10px] text-slate-500">{isRtl ? 'ما الذي طُلب منك تنفيذه؟' : 'Your responsibility'}</span>
          </div>
          <textarea
            value={task}
            onChange={e => setTask(e.target.value)}
            rows={3}
            className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-xs text-slate-200 focus:border-amber-500 outline-none leading-relaxed"
            placeholder={isRtl ? 'ما هي المهمة أو الهدف الذي توجّب عليك تحقيقه بالتحديد؟' : 'What specifically was your goal or assigned responsibility?'}
          />
        </div>

        {/* Action */}
        <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-xs font-black text-emerald-400 flex items-center gap-1.5">
              <span className="w-5 h-5 rounded-md bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-mono text-[11px]">A</span>
              <span>{isRtl ? 'الإجراء المباشر (Action)' : 'Action (Your Contribution)'}</span>
            </span>
            <span className="text-[10px] text-slate-500">{isRtl ? 'ماذا فعلت أنت بنفسك؟' : 'What did YOU do?'}</span>
          </div>
          <textarea
            value={action}
            onChange={e => setAction(e.target.value)}
            rows={3}
            className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-xs text-slate-200 focus:border-amber-500 outline-none leading-relaxed"
            placeholder={isRtl ? 'استخدم أفعال مثل: صممت، برمجت، أصلحت، قدت الفريق...' : 'Describe steps you personally executed (e.g. refactored API, implemented cache)...'}
          />
        </div>

        {/* Result */}
        <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-xs font-black text-rose-400 flex items-center gap-1.5">
              <span className="w-5 h-5 rounded-md bg-rose-500/20 text-rose-400 flex items-center justify-center font-mono text-[11px]">R</span>
              <span>{isRtl ? 'النتيجة والأرقام (Result)' : 'Result (Impact & Metrics)'}</span>
            </span>
            <span className="text-[10px] text-slate-500">{isRtl ? 'الأرقام والمقاييس' : 'Quantifiable outcome'}</span>
          </div>
          <textarea
            value={result}
            onChange={e => setResult(e.target.value)}
            rows={3}
            className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-xs text-slate-200 focus:border-amber-500 outline-none leading-relaxed"
            placeholder={isRtl ? 'ما هي الأرقام والنتائج (مثل تحسين الأداء بنسبة 50% أو توفير $10k)...' : 'Quantify the outcome (e.g. reduced load time by 40%, zero downtime)...'}
          />
        </div>
      </div>

      {/* Evaluate Action */}
      <button
        onClick={handleEvaluateSTAR}
        disabled={isAnalyzing || (!situation && !action)}
        className="w-full bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-slate-950 font-black p-3.5 rounded-2xl shadow-lg shadow-amber-500/20 transition-all cursor-pointer flex items-center justify-center space-x-2 rtl:space-x-reverse disabled:opacity-50"
      >
        {isAnalyzing ? (
          <>
            <RefreshCw className="w-4 h-4 animate-spin" />
            <span>{isRtl ? 'جاري تحليل قوة إجابة STAR...' : 'Analyzing STAR Completeness...'}</span>
          </>
        ) : (
          <>
            <Sparkles className="w-4 h-4" />
            <span>{isRtl ? 'تقييم الإجابة بالذكاء الاصطناعي' : 'Evaluate STAR Response'}</span>
          </>
        )}
      </button>

      {/* Analysis Feedback Panel */}
      <AnimatePresence>
        {analysis && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-slate-950 border border-amber-500/30 rounded-2xl p-6 space-y-4"
          >
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center space-x-3 rtl:space-x-reverse">
                <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center font-black text-amber-400 text-xl">
                  {analysis.score}%
                </div>
                <div>
                  <h4 className="font-extrabold text-white text-sm">{isRtl ? 'درجة اكتمال إجابة STAR' : 'STAR Answer Score'}</h4>
                  <p className="text-xs text-slate-400">{isRtl ? analysis.feedbackAr : analysis.feedbackEn}</p>
                </div>
              </div>
            </div>

            {/* Breakdown bars */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div className="bg-slate-900 p-2.5 rounded-xl border border-slate-800">
                <span className="text-slate-500 block text-[10px]">Situation</span>
                <span className="font-mono text-amber-400 font-extrabold">{analysis.situationScore}/25</span>
              </div>
              <div className="bg-slate-900 p-2.5 rounded-xl border border-slate-800">
                <span className="text-slate-500 block text-[10px]">Task</span>
                <span className="font-mono text-blue-400 font-extrabold">{analysis.taskScore}/25</span>
              </div>
              <div className="bg-slate-900 p-2.5 rounded-xl border border-slate-800">
                <span className="text-slate-500 block text-[10px]">Action</span>
                <span className="font-mono text-emerald-400 font-extrabold">{analysis.actionScore}/25</span>
              </div>
              <div className="bg-slate-900 p-2.5 rounded-xl border border-slate-800">
                <span className="text-slate-500 block text-[10px]">Result</span>
                <span className="font-mono text-rose-400 font-extrabold">{analysis.resultScore}/25</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
};
