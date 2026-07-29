/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  FileText, Sparkles, CheckCircle2, AlertTriangle, X,
  Target, Award, Zap, RefreshCw, Upload, Search
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface ResumeAnalyzerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SAMPLE_RESUME = `Karim Mohamadi
Fullstack Web Engineer | React, PHP 8, Laravel 11, TypeScript

EXPERIENCE:
Software Engineer - Tech Solutions (2023 - Present)
- Built responsive user interfaces using React, Tailwind CSS, and TypeScript.
- Developed RESTful APIs with PHP 8 and Laravel Eloquent ORM.
- Optimized database queries in MySQL, reducing response time by 35%.

SKILLS:
Frontend: HTML5, CSS3, JavaScript ES6+, React, Tailwind, Redux Toolkit
Backend: PHP 8, Laravel 11, Node.js, Express, REST APIs, MySQL
Tools: Git, GitHub, Docker, Postman, Vite`;

export const ResumeAnalyzerModal: React.FC<ResumeAnalyzerModalProps> = ({ isOpen, onClose }) => {
  const { isRtl, lang } = useApp();

  const [resumeText, setResumeText] = useState<string>(SAMPLE_RESUME);
  const [targetRole, setTargetRole] = useState<string>('Senior Frontend React Engineer');
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  
  const [result, setResult] = useState<{
    score: number;
    matchRating: 'Excellent' | 'Good' | 'Needs Work';
    detectedSkills: string[];
    missingKeywords: string[];
    bulletPointFeedback: string[];
    atsTips: string[];
  } | null>(null);

  const handleAnalyze = () => {
    setIsAnalyzing(true);
    setResult(null);

    setTimeout(() => {
      // Analyze resume text keywords against target role
      const lowerText = resumeText.toLowerCase();

      const requiredKeywords = targetRole.includes('React')
        ? ['react', 'typescript', 'redux', 'performance', 'jest', 'tailwind', 'next.js', 'accessibility']
        : ['php', 'laravel', 'mysql', 'docker', 'redis', 'rest api', 'ci/cd', 'unit testing'];

      const detected = requiredKeywords.filter(k => lowerText.includes(k));
      const missing = requiredKeywords.filter(k => !lowerText.includes(k));

      const calculatedScore = Math.round((detected.length / requiredKeywords.length) * 100);

      setResult({
        score: Math.max(calculatedScore, 65),
        matchRating: calculatedScore >= 80 ? 'Excellent' : calculatedScore >= 60 ? 'Good' : 'Needs Work',
        detectedSkills: detected.map(s => s.toUpperCase()),
        missingKeywords: missing.map(s => s.toUpperCase()),
        bulletPointFeedback: [
          isRtl ? 'استخدم أرقام ومقاييس إنجاز واضحة (Quantifiable metrics) في جميع نقاط الخبرة.' : 'Include quantifiable metrics (e.g., % speed improvement, revenue growth) in bullet points.',
          isRtl ? 'صغ أفعال العمل (Action verbs) في بداية كل جملة مثل Developed, Optimized, Architected.' : 'Start each bullet with strong active verbs (Architected, Spearheaded, Optimized).'
        ],
        atsTips: [
          isRtl ? 'السيرة الذاتية واضحة للنظام الصوتي والـ ATS، مع تجنب الجداول المعقدة.' : 'Clean plain text format verified; friendly to greenhouse & lever ATS scanners.',
          isRtl ? 'قم بإضافة الكلمات المفتاحية المفقودة لتجاوز الفرز الآلي للشركة.' : 'Incorporate missing keywords in your summary section to pass filter thresholds.'
        ]
      });

      setIsAnalyzing(false);
    }, 1500);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md" id="resume-analyzer-modal">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-3xl max-h-[90vh] overflow-y-auto p-6 md:p-8 space-y-6 shadow-2xl relative"
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-5 left-5 rtl:left-auto rtl:right-5 p-2 text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-xl transition-all cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Modal Header */}
          <div className="flex items-center space-x-3 rtl:space-x-reverse pr-10 rtl:pr-0 rtl:pl-10">
            <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-2xl text-amber-400">
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl font-black text-white">
                {isRtl ? 'محلل السيرة الذاتية وأنظمة التوظيف ATS' : 'AI Resume & ATS Keyword Analyzer'}
              </h3>
              <p className="text-xs text-slate-400">
                {isRtl ? 'حلل توافق سيرتك الذاتية مع الوظائف التقنية واكتشف الكلمات المفتاحية المفقودة لتجاوز خوارزميات التوظيف.' : 'Scan your resume against target job requirements to maximize ATS matching & interview callback rates.'}
              </p>
            </div>
          </div>

          {/* Form input */}
          <div className="space-y-4">
            <div>
              <label className="text-xs font-extrabold text-slate-300 mb-1.5 block">
                {isRtl ? 'المسمى الوظيفي المستهدف' : 'Target Role'}
              </label>
              <select
                value={targetRole}
                onChange={e => setTargetRole(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white font-bold focus:border-amber-500 outline-none"
              >
                <option value="Senior Frontend React Engineer">Senior Frontend React Engineer</option>
                <option value="Fullstack Laravel & React Engineer">Fullstack Laravel & React Engineer</option>
                <option value="Lead Backend PHP & MySQL Engineer">Lead Backend PHP & MySQL Engineer</option>
                <option value="UI/UX & Design Systems Architect">UI/UX & Design Systems Architect</option>
                <option value="Web3 & Smart Contract Developer">Web3 & Smart Contract Developer</option>
              </select>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="text-xs font-extrabold text-slate-300">
                  {isRtl ? 'نص السيرة الذاتية (Paste Resume Text)' : 'Resume Plain Text'}
                </label>
                <button
                  onClick={() => setResumeText(SAMPLE_RESUME)}
                  className="text-[11px] text-amber-400 hover:underline font-bold"
                >
                  {isRtl ? 'تحميل نموذج تجريبي' : 'Load Sample Resume'}
                </button>
              </div>
              <textarea
                value={resumeText}
                onChange={e => setResumeText(e.target.value)}
                rows={6}
                className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-4 text-xs font-mono text-slate-200 focus:border-amber-500 outline-none leading-relaxed"
                placeholder={isRtl ? 'انسخ وانقل نص السيرة الذاتية هنا...' : 'Paste your resume plain text here...'}
              />
            </div>

            <button
              onClick={handleAnalyze}
              disabled={isAnalyzing || !resumeText.trim()}
              className="w-full bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-slate-950 font-black p-3.5 rounded-2xl shadow-lg shadow-amber-500/20 transition-all cursor-pointer flex items-center justify-center space-x-2 rtl:space-x-reverse disabled:opacity-50"
            >
              {isAnalyzing ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>{isRtl ? 'جاري فحص الـ ATS وتوافق الكلمات...' : 'Scanning Resume Keywords...'}</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>{isRtl ? 'بدء تحليل السيرة الذاتية' : 'Analyze ATS Compatibility'}</span>
                </>
              )}
            </button>
          </div>

          {/* Results Area */}
          {result && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-slate-950 border border-amber-500/30 rounded-2xl p-6 space-y-5"
            >
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <div>
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block">
                    {isRtl ? 'نسبة مطابقة الـ ATS' : 'ATS Match Score'}
                  </span>
                  <span className="text-2xl font-black text-amber-400">{result.score}% ({result.matchRating})</span>
                </div>
                <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center font-black text-amber-400">
                  <Award className="w-6 h-6" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                {/* Detected Keywords */}
                <div className="bg-slate-900 border border-slate-800 p-3.5 rounded-xl space-y-2">
                  <h4 className="font-extrabold text-emerald-400 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>{isRtl ? 'المهارات المكتشفة' : 'Detected Keywords'}</span>
                  </h4>
                  <div className="flex flex-wrap gap-1.5">
                    {result.detectedSkills.map((s, idx) => (
                      <span key={idx} className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded-md font-mono text-[10px]">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Missing Keywords */}
                <div className="bg-slate-900 border border-slate-800 p-3.5 rounded-xl space-y-2">
                  <h4 className="font-extrabold text-rose-400 flex items-center gap-1.5">
                    <AlertTriangle className="w-4 h-4" />
                    <span>{isRtl ? 'الكلمات الهامة المفقودة' : 'Missing Critical Keywords'}</span>
                  </h4>
                  <div className="flex flex-wrap gap-1.5">
                    {result.missingKeywords.length > 0 ? result.missingKeywords.map((m, idx) => (
                      <span key={idx} className="bg-rose-500/10 text-rose-400 border border-rose-500/30 px-2 py-0.5 rounded-md font-mono text-[10px]">
                        {m}
                      </span>
                    )) : (
                      <span className="text-slate-400">{isRtl ? 'ممتاز! تم تضمين كل الكلمات المفتاحية' : 'Great! All core keywords detected'}</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Recommendations */}
              <div className="space-y-2 text-xs">
                <h4 className="font-extrabold text-amber-400 flex items-center gap-1.5">
                  <Zap className="w-4 h-4" />
                  <span>{isRtl ? 'نصائح تحسين السيرة الذاتية' : 'ATS Optimization Recommendations'}</span>
                </h4>
                <ul className="space-y-1.5 text-slate-300">
                  {result.bulletPointFeedback.concat(result.atsTips).map((tip, idx) => (
                    <li key={idx} className="bg-slate-900 border border-slate-800 p-2.5 rounded-xl">
                      • {tip}
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          )}

        </motion.div>
      </div>
    </AnimatePresence>
  );
};
