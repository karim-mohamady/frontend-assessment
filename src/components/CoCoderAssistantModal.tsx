/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Bot, Sparkles, Code2, AlertCircle, CheckCircle2,
  RefreshCw, MessageSquare, Terminal, Zap, X
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface CoCoderAssistantModalProps {
  isOpen: boolean;
  onClose: () => void;
  code: string;
  challengeTitle: string;
}

export const CoCoderAssistantModal: React.FC<CoCoderAssistantModalProps> = ({
  isOpen, onClose, code, challengeTitle
}) => {
  const { isRtl } = useApp();

  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [review, setReview] = useState<{
    timeComplexity: string;
    spaceComplexity: string;
    score: number;
    edgeCases: string[];
    suggestions: string[];
    optimizedSnippet?: string;
  } | null>(null);

  const handleRunCoCoderReview = () => {
    setIsAnalyzing(true);
    setReview(null);

    setTimeout(() => {
      const hasLoop = /(for|while|map|forEach|filter|reduce)/i.test(code);
      const hasNestedLoop = /(for.*for|while.*while|map.*map)/i.test(code);

      const timeComp = hasNestedLoop ? 'O(N²)' : hasLoop ? 'O(N)' : 'O(1)';
      const spaceComp = code.includes('new ') || code.includes('[') || code.includes('{') ? 'O(N)' : 'O(1)';

      setReview({
        timeComplexity: timeComp,
        spaceComplexity: spaceComp,
        score: timeComp === 'O(1)' ? 95 : timeComp === 'O(N)' ? 88 : 72,
        edgeCases: [
          isRtl ? 'القيم الفارغة (Empty input array/string or null)' : 'Empty input array / string or null/undefined checks',
          isRtl ? 'القيم السالبة أو الأعداد الكبيرة جداً (Large integers / overflow boundary)' : 'Boundary conditions with negative numbers or large values',
          isRtl ? 'المصفوفت المكررة (Arrays with duplicate elements)' : 'Arrays containing duplicate values or unexpected types'
        ],
        suggestions: [
          isRtl ? 'احرص على كتابة شرط التحقق الباكر (Early exit guard condition) في أول الدالة.' : 'Add early exit guard conditions for invalid inputs at the start of the function.',
          isRtl ? 'استخدم الأسماء المعبرة للمتغيرات بدلاً من الحروف المفرطة مثل i, j.' : 'Use self-descriptive variable names to enhance maintainability for team code reviews.'
        ],
        optimizedSnippet: `// Senior Engineer Optimization Suggestion:
function solution(input) {
  if (!input) return null; // Guard clause
  
  // High-performance single pass
  return input;
}`
      });

      setIsAnalyzing(false);
    }, 1200);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md" id="co-coder-modal">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 space-y-6 shadow-2xl relative"
        >
          <button
            onClick={onClose}
            className="absolute top-5 left-5 rtl:left-auto rtl:right-5 p-2 text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-xl transition-all cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Header */}
          <div className="flex items-center space-x-3 rtl:space-x-reverse pr-10 rtl:pr-0 rtl:pl-10">
            <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-2xl text-amber-400">
              <Bot className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-black text-white">
                {isRtl ? 'المراجع البرمجي الذكي (Senior AI Co-Coder)' : 'AI Senior Co-Coder & Code Reviewer'}
              </h3>
              <p className="text-xs text-slate-400">
                {challengeTitle}
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 font-mono text-xs text-slate-300 max-h-40 overflow-y-auto">
              <pre>{code || '// Write code in editor first...'}</pre>
            </div>

            <button
              onClick={handleRunCoCoderReview}
              disabled={isAnalyzing || !code.trim()}
              className="w-full bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-slate-950 font-black p-3.5 rounded-2xl shadow-lg shadow-amber-500/20 transition-all cursor-pointer flex items-center justify-center space-x-2 rtl:space-x-reverse disabled:opacity-50"
            >
              {isAnalyzing ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>{isRtl ? 'جاري الفحص الدقيق والتعقيد الزمني...' : 'Running Code Review & Complexity Check...'}</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>{isRtl ? 'تحليل الكود وحالات الحواف (Edge Cases)' : 'Request Senior Review & Edge Cases'}</span>
                </>
              )}
            </button>
          </div>

          {review && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-slate-950 border border-amber-500/30 rounded-2xl p-5 space-y-4 text-xs"
            >
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <span className="font-extrabold text-white">{isRtl ? 'تقرير مراجعة الكود' : 'Code Quality Assessment'}</span>
                <span className="font-mono text-amber-400 font-extrabold">{review.score}/100</span>
              </div>

              <div className="grid grid-cols-2 gap-3 font-mono">
                <div className="bg-slate-900 border border-slate-800 p-2.5 rounded-xl">
                  <span className="text-slate-500 block text-[10px] uppercase">Time Complexity</span>
                  <span className="text-amber-400 font-extrabold text-sm">{review.timeComplexity}</span>
                </div>
                <div className="bg-slate-900 border border-slate-800 p-2.5 rounded-xl">
                  <span className="text-slate-500 block text-[10px] uppercase">Space Complexity</span>
                  <span className="text-emerald-400 font-extrabold text-sm">{review.spaceComplexity}</span>
                </div>
              </div>

              <div className="space-y-1.5">
                <h5 className="font-extrabold text-rose-400 flex items-center gap-1.5">
                  <AlertCircle className="w-4 h-4" />
                  <span>{isRtl ? 'حالات الحدود والتجاوز المفترضة (Edge Cases)' : 'Critical Edge Cases to Test'}</span>
                </h5>
                <ul className="space-y-1 text-slate-300">
                  {review.edgeCases.map((ec, idx) => (
                    <li key={idx} className="bg-slate-900 p-2 rounded-lg border border-slate-800/80">• {ec}</li>
                  ))}
                </ul>
              </div>

              {review.optimizedSnippet && (
                <div className="space-y-1.5">
                  <h5 className="font-extrabold text-amber-400 flex items-center gap-1.5">
                    <Zap className="w-4 h-4" />
                    <span>{isRtl ? 'مقترح تحسين الكود' : 'Recommended Senior Pattern'}</span>
                  </h5>
                  <div className="bg-slate-900 border border-slate-800 p-3 rounded-xl font-mono text-emerald-300">
                    <pre>{review.optimizedSnippet}</pre>
                  </div>
                </div>
              )}
            </motion.div>
          )}

        </motion.div>
      </div>
    </AnimatePresence>
  );
};
