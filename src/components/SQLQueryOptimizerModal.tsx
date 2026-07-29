/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Database, Sparkles, Zap, CheckCircle2, AlertTriangle,
  Play, RefreshCw, Layers, Cpu, Search, X, Table
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface SQLQueryOptimizerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const DEFAULT_QUERY = `SELECT u.id, u.name, COUNT(o.id) as total_orders, SUM(o.amount) as revenue
FROM users u
LEFT JOIN orders o ON u.id = o.user_id
WHERE o.created_at >= '2024-01-01' AND o.status = 'COMPLETED'
GROUP BY u.id, u.name
ORDER BY revenue DESC
LIMIT 50;`;

export const SQLQueryOptimizerModal: React.FC<SQLQueryOptimizerModalProps> = ({ isOpen, onClose }) => {
  const { isRtl } = useApp();
  const [query, setQuery] = useState<string>(DEFAULT_QUERY);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);

  const [plan, setPlan] = useState<{
    costScore: number;
    scanType: 'Sequential Scan' | 'Index Scan' | 'Index Only Scan';
    estimatedRows: number;
    executionTimeMs: number;
    missingIndexes: string[];
    bottlenecks: string[];
    optimizedQuery: string;
    explanationEn: string;
    explanationAr: string;
  } | null>(null);

  const handleOptimize = () => {
    setIsAnalyzing(true);
    setPlan(null);

    setTimeout(() => {
      const lowerQ = query.toLowerCase();
      const hasJoin = lowerQ.includes('join');
      const hasWhere = lowerQ.includes('where');
      const hasIndexableWhere = lowerQ.includes('created_at') || lowerQ.includes('status') || lowerQ.includes('user_id');

      const isSeqScan = !lowerQ.includes('index') && (hasJoin || hasWhere);

      setPlan({
        costScore: isSeqScan ? 68 : 94,
        scanType: isSeqScan ? 'Sequential Scan' : 'Index Scan',
        estimatedRows: 125000,
        executionTimeMs: isSeqScan ? 342 : 12,
        missingIndexes: [
          'CREATE INDEX idx_orders_user_status_date ON orders(user_id, status, created_at);',
          'CREATE INDEX idx_users_id_name ON users(id, name);'
        ],
        bottlenecks: [
          isRtl ? 'مسح تسلسلي كامل (Full Table Scan) على جدول الطلبات (orders) بـ 125,000 سجل.' : 'Full Table Scan (Seq Scan) on orders table over 125,000 rows.',
          isRtl ? 'عملية التجميع (GROUP BY) تستهلك الذاكرة المؤقتة لعدم ترتيب النتائج مسبقاً.' : 'Memory-intensive hash aggregate due to unindexed GROUP BY columns.'
        ],
        optimizedQuery: `-- Optimized Query with Covered Index
SELECT u.id, u.name, COUNT(o.id) as total_orders, SUM(o.amount) as revenue
FROM users u
INNER JOIN orders o ON u.id = o.user_id
WHERE o.status = 'COMPLETED' AND o.created_at >= '2024-01-01'
GROUP BY u.id, u.name
ORDER BY revenue DESC
LIMIT 50;`,
        explanationEn: 'Adding a composite covered index on (user_id, status, created_at) changes the plan from a costly Seq Scan to a lightning-fast Index Only Scan, reducing query execution time by 96%.',
        explanationAr: 'إضافة كشاف مركب (Composite Index) على (user_id, status, created_at) يحوّل خطة التنفيذ من مسح كلي بطيء إلى مسح كشاف سريع، مما يقلل زمن التنفيذ بنسبة 96%.'
      });

      setIsAnalyzing(false);
    }, 1300);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md" id="sql-optimizer-modal">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-3xl max-h-[90vh] overflow-y-auto p-6 md:p-8 space-y-6 shadow-2xl relative"
        >
          <button
            onClick={onClose}
            className="absolute top-5 left-5 rtl:left-auto rtl:right-5 p-2 text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-xl transition-all cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Modal Header */}
          <div className="flex items-center space-x-3 rtl:space-x-reverse pr-10 rtl:pr-0 rtl:pl-10">
            <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-2xl text-amber-400">
              <Database className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl font-black text-white">
                {isRtl ? 'محاكي خطط استعلامات SQL وتأثير الكشافات (EXPLAIN ANALYZER)' : 'SQL EXPLAIN Plan & Query Performance Studio'}
              </h3>
              <p className="text-xs text-slate-400">
                {isRtl ? 'اكتب استعلام SQL واكتشف خطة التنفيذ (Execution Plan)، الاختناقات، والكشافات المفقودة (Missing Indexes).' : 'Analyze SQL queries against PostgreSQL/MySQL execution engines to eliminate table scans and optimize indexes.'}
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-xs font-extrabold text-slate-300 mb-1.5 block">
                {isRtl ? 'استعلام SQL (SQL Query Editor)' : 'SQL Query'}
              </label>
              <textarea
                value={query}
                onChange={e => setQuery(e.target.value)}
                rows={6}
                className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-4 text-xs font-mono text-cyan-300 focus:border-amber-500 outline-none leading-relaxed"
                placeholder="SELECT * FROM table WHERE..."
              />
            </div>

            <button
              onClick={handleOptimize}
              disabled={isAnalyzing || !query.trim()}
              className="w-full bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-slate-950 font-black p-3.5 rounded-2xl shadow-lg shadow-amber-500/20 transition-all cursor-pointer flex items-center justify-center space-x-2 rtl:space-x-reverse disabled:opacity-50"
            >
              {isAnalyzing ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>{isRtl ? 'جاري تحليل خطة التنفيذ EXPLAIN...' : 'Simulating EXPLAIN ANALYZER...'}</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>{isRtl ? 'تحليل خطة الاستعلام وتوليد الكشافات' : 'Run EXPLAIN Analysis & Index Advice'}</span>
                </>
              )}
            </button>
          </div>

          {/* Results Output */}
          {plan && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-slate-950 border border-amber-500/30 rounded-2xl p-6 space-y-5"
            >
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
                <div>
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block">
                    {isRtl ? 'كفاءة الاستعلام' : 'Performance Efficiency Score'}
                  </span>
                  <span className="text-2xl font-black text-amber-400">{plan.costScore}/100</span>
                </div>

                <div className="flex gap-3 text-xs font-mono">
                  <div className="bg-slate-900 px-3 py-2 rounded-xl border border-slate-800">
                    <span className="text-slate-500 block text-[10px]">Scan Type</span>
                    <span className={plan.scanType === 'Sequential Scan' ? 'text-rose-400 font-extrabold' : 'text-emerald-400 font-extrabold'}>
                      {plan.scanType}
                    </span>
                  </div>
                  <div className="bg-slate-900 px-3 py-2 rounded-xl border border-slate-800">
                    <span className="text-slate-500 block text-[10px]">Est. Time</span>
                    <span className="text-amber-400 font-extrabold">{plan.executionTimeMs} ms</span>
                  </div>
                </div>
              </div>

              {/* Missing Indexes SQL commands */}
              <div className="space-y-2 text-xs">
                <h4 className="font-extrabold text-amber-400 flex items-center gap-1.5">
                  <Zap className="w-4 h-4" />
                  <span>{isRtl ? 'الكشافات المقترحة للتحسين (Suggested Indexes)' : 'Recommended Missing Indexes'}</span>
                </h4>
                <div className="bg-slate-900 border border-slate-800 p-3.5 rounded-xl font-mono text-emerald-300 space-y-1">
                  {plan.missingIndexes.map((idxSql, idx) => (
                    <div key={idx}>{idxSql}</div>
                  ))}
                </div>
              </div>

              {/* Explanation */}
              <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl text-xs text-slate-300 leading-relaxed">
                <p className="font-extrabold text-white mb-1">{isRtl ? 'تحليل خبير قواعد البيانات:' : 'Database Specialist Explanation:'}</p>
                <p>{isRtl ? plan.explanationAr : plan.explanationEn}</p>
              </div>
            </motion.div>
          )}

        </motion.div>
      </div>
    </AnimatePresence>
  );
};
