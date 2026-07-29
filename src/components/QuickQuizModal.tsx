/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  Zap,
  CheckCircle2,
  XCircle,
  HelpCircle,
  RotateCcw,
  Sparkles,
  Award,
  ChevronRight,
  Code,
  Flame,
  Check
} from 'lucide-react';
import { RevisionItem } from '../data/revisionData';
import { useApp } from '../context/AppContext';

interface QuickQuizModalProps {
  isOpen: boolean;
  onClose: () => void;
  availableItems: RevisionItem[];
  categoryTitle?: string;
}

export const QuickQuizModal: React.FC<QuickQuizModalProps> = ({
  isOpen,
  onClose,
  availableItems,
  categoryTitle
}) => {
  const { lang, addXp } = useApp();
  const isArabic = lang === 'ar';

  const [quizQuestions, setQuizQuestions] = useState<RevisionItem[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  // Initialize 3 random questions when opened
  useEffect(() => {
    if (isOpen && availableItems.length > 0) {
      // Shuffle array copy and take 3 items
      const shuffled = [...availableItems].sort(() => 0.5 - Math.random());
      setQuizQuestions(shuffled.slice(0, 3));
      setCurrentIndex(0);
      setSelectedAnswers({});
      setSubmitted(false);
      setScore(0);
    }
  }, [isOpen, availableItems]);

  if (!isOpen || quizQuestions.length === 0) return null;

  const currentQ = quizQuestions[currentIndex];

  const handleSelectOption = (optionIdx: number) => {
    if (submitted) return;
    setSelectedAnswers(prev => ({
      ...prev,
      [currentIndex]: optionIdx
    }));
  };

  const handleNext = () => {
    if (currentIndex < quizQuestions.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      // Submit Quiz
      calculateResults();
    }
  };

  const calculateResults = () => {
    let correctCount = 0;
    quizQuestions.forEach((q, idx) => {
      const selectedIdx = selectedAnswers[idx];
      if (selectedIdx !== undefined && q.optionsEn) {
        const selectedTextEn = q.optionsEn[selectedIdx];
        const selectedTextAr = q.optionsAr[selectedIdx] || selectedTextEn;
        if (
          q.correctAnswerTextEn.includes(selectedTextEn) ||
          q.correctAnswerTextAr.includes(selectedTextAr)
        ) {
          correctCount++;
        }
      }
    });

    setScore(correctCount);
    setSubmitted(true);

    // Reward XP
    if (correctCount > 0) {
      addXp(correctCount * 15);
    }
  };

  const handleRestart = () => {
    const shuffled = [...availableItems].sort(() => 0.5 - Math.random());
    setQuizQuestions(shuffled.slice(0, 3));
    setCurrentIndex(0);
    setSelectedAnswers({});
    setSubmitted(false);
    setScore(0);
  };

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto ${isArabic ? 'rtl' : 'ltr'}`}>
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden my-8"
      >
        {/* Top Header */}
        <div className="px-6 py-4 bg-slate-950/90 border-b border-slate-800/80 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center shrink-0">
              <Zap className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-extrabold text-white flex items-center gap-2">
                <span>{isArabic ? 'اختبار سريع مكثف (3 أسئلة)' : 'Quick Topic Quiz (3 Questions)'}</span>
                {categoryTitle && (
                  <span className="text-xs text-amber-400 font-bold px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/20">
                    {categoryTitle}
                  </span>
                )}
              </h3>
              <p className="text-[11px] text-slate-400">
                {isArabic ? 'اختبر استيعابك السريع للموضوع المختار واحصل على نقاط XP' : 'Test your quick comprehension & earn XP rewards'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        {!submitted ? (
          <div className="p-6 space-y-6">
            {/* Step Progress Bar */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-bold">
                <span className="text-amber-400 flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5" />
                  {isArabic ? `السؤال ${currentIndex + 1} من أصل ${quizQuestions.length}` : `Question ${currentIndex + 1} of ${quizQuestions.length}`}
                </span>
                <span className="text-slate-400 font-mono">
                  {Math.round(((currentIndex + 1) / quizQuestions.length) * 100)}%
                </span>
              </div>
              <div className="w-full h-2 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
                <div
                  className="h-full bg-gradient-to-r from-amber-500 to-amber-400 transition-all duration-300"
                  style={{ width: `${((currentIndex + 1) / quizQuestions.length) * 100}%` }}
                />
              </div>
            </div>

            {/* Current Question */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 text-[10px] font-bold uppercase tracking-wider border border-slate-700">
                  {currentQ.topic}
                </span>
                <span className="px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 text-[10px] font-bold border border-amber-500/30">
                  {currentQ.difficulty}
                </span>
              </div>

              <h4 className="text-base sm:text-lg font-bold text-slate-100 leading-snug">
                {isArabic ? currentQ.questionTextAr : currentQ.questionTextEn}
              </h4>

              {currentQ.codeSnippet && (
                <div className="bg-slate-950 border border-slate-800 rounded-xl p-3.5 font-mono text-xs text-amber-300 overflow-x-auto ltr text-left">
                  <pre>{currentQ.codeSnippet}</pre>
                </div>
              )}

              {/* Options */}
              <div className="space-y-2.5 pt-2">
                {currentQ.optionsEn.map((optEn, optIdx) => {
                  const optAr = currentQ.optionsAr[optIdx] || optEn;
                  const optText = isArabic ? optAr : optEn;
                  const isSelected = selectedAnswers[currentIndex] === optIdx;

                  return (
                    <button
                      key={optIdx}
                      onClick={() => handleSelectOption(optIdx)}
                      className={`w-full p-3.5 rounded-2xl border text-left rtl:text-right text-xs sm:text-sm font-medium transition-all flex items-center justify-between gap-3 ${
                        isSelected
                          ? 'bg-amber-500/15 border-amber-500 text-amber-300 font-bold shadow-md scale-[1.01]'
                          : 'bg-slate-950/60 border-slate-800 hover:border-slate-700 text-slate-300 hover:bg-slate-800/40'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className={`w-6 h-6 rounded-full text-xs font-bold flex items-center justify-center border shrink-0 ${
                          isSelected
                            ? 'bg-amber-500 text-slate-950 border-amber-400'
                            : 'bg-slate-800 text-slate-400 border-slate-700'
                        }`}>
                          {String.fromCharCode(65 + optIdx)}
                        </span>
                        <span>{optText}</span>
                      </div>

                      {isSelected && <Check className="w-4 h-4 text-amber-400 shrink-0" />}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Modal Bottom Controls */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-800">
              <button
                onClick={onClose}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-slate-200 transition-colors"
              >
                {isArabic ? 'إلغاء' : 'Cancel'}
              </button>

              <button
                disabled={selectedAnswers[currentIndex] === undefined}
                onClick={handleNext}
                className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                  selectedAnswers[currentIndex] === undefined
                    ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                    : 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-lg shadow-amber-500/20'
                }`}
              >
                <span>
                  {currentIndex === quizQuestions.length - 1
                    ? (isArabic ? 'إنهاء وحساب النتيجة' : 'Submit Quiz')
                    : (isArabic ? 'السؤال التالي' : 'Next Question')}
                </span>
                <ChevronRight className={`w-4 h-4 ${isArabic ? 'rotate-180' : ''}`} />
              </button>
            </div>
          </div>
        ) : (
          /* Results Screen */
          <div className="p-8 text-center space-y-6">
            <div className="w-16 h-16 rounded-3xl bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center mx-auto shadow-xl">
              <Award className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <h3 className="text-xl sm:text-2xl font-extrabold text-white">
                {score === 3
                  ? (isArabic ? '🎉 نتيجة ممتازة 3/3!' : '🎉 Perfect Score 3/3!')
                  : score >= 1
                  ? (isArabic ? `👍 أحسنت! أجبت على ${score} من أصل 3 أسئلة` : `👍 Good job! You scored ${score}/3`)
                  : (isArabic ? 'حاول مرة أخرى لتثبيت المعلومة' : 'Keep practicing!')}
              </h3>
              <p className="text-xs sm:text-sm text-slate-400 max-w-md mx-auto">
                {isArabic
                  ? `حصلت على +${score * 15} نقطة خبرة XP لتطوير مستواك البرمجي!`
                  : `You gained +${score * 15} XP points for your career development!`}
              </p>
            </div>

            {/* Answer Breakdown Review */}
            <div className="space-y-3 text-left rtl:text-right bg-slate-950 p-4 rounded-2xl border border-slate-800 max-h-60 overflow-y-auto">
              <h5 className="text-xs font-bold text-amber-400 uppercase tracking-wider mb-2">
                {isArabic ? 'مراجعة إجاباتك:' : 'Answers Review:'}
              </h5>

              {quizQuestions.map((q, idx) => {
                const userOptIdx = selectedAnswers[idx];
                const userOptEn = userOptIdx !== undefined ? q.optionsEn[userOptIdx] : '';
                const userOptAr = userOptIdx !== undefined ? (q.optionsAr[userOptIdx] || userOptEn) : '';
                const isCorrect = userOptIdx !== undefined && (
                  q.correctAnswerTextEn.includes(userOptEn) ||
                  q.correctAnswerTextAr.includes(userOptAr)
                );

                return (
                  <div key={idx} className="p-3 bg-slate-900 rounded-xl border border-slate-800 space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-slate-200">
                        #{idx + 1} {isArabic ? q.questionTextAr : q.questionTextEn}
                      </span>
                      {isCorrect ? (
                        <span className="text-emerald-400 font-bold flex items-center gap-1 text-[11px]">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          {isArabic ? 'صحيح' : 'Correct'}
                        </span>
                      ) : (
                        <span className="text-rose-400 font-bold flex items-center gap-1 text-[11px]">
                          <XCircle className="w-3.5 h-3.5" />
                          {isArabic ? 'خطأ' : 'Incorrect'}
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-400">
                      <span className="font-semibold">{isArabic ? 'الإجابة النموذجية:' : 'Correct:'} </span>
                      {isArabic ? q.correctAnswerTextAr : q.correctAnswerTextEn}
                    </p>
                  </div>
                );
              })}
            </div>

            {/* Actions */}
            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                onClick={handleRestart}
                className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold border border-slate-700 transition-all flex items-center gap-2"
              >
                <RotateCcw className="w-4 h-4 text-amber-400" />
                <span>{isArabic ? 'اختبار آخر (3 أسئلة جديدة)' : 'Try Another 3 Questions'}</span>
              </button>

              <button
                onClick={onClose}
                className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold transition-all shadow-lg shadow-amber-500/20"
              >
                {isArabic ? 'إغلاق والعودة للشرح' : 'Done & Return to Study'}
              </button>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default QuickQuizModal;
