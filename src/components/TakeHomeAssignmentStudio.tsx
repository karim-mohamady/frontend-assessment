/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Briefcase, Sparkles, CheckCircle2, AlertCircle, Award,
  Code2, Terminal, RefreshCw, FileText, Send, ChevronRight,
  ShieldCheck, Zap, Layers, Cpu, Check, X, FileCode
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export interface TakeHomeTask {
  id: string;
  track: 'frontend' | 'backend' | 'fullstack';
  titleEn: string;
  titleAr: string;
  companyName: string;
  timeLimitDays: number;
  difficulty: 'Mid-Senior' | 'Senior' | 'Lead Architect';
  summaryEn: string;
  summaryAr: string;
  requirementsEn: string[];
  requirementsAr: string[];
  starterTemplate: string;
}

const TAKE_HOME_TASKS: TakeHomeTask[] = [
  {
    id: 'task-be-1',
    track: 'backend',
    companyName: 'FinTech Cloud Inc.',
    timeLimitDays: 3,
    difficulty: 'Senior',
    titleEn: 'Distributed Rate Limiter & Security API Middleware',
    titleAr: 'تاسك تطوير محدد معدل الطلبات (Distributed Rate Limiter) وبوابة الأمان API',
    summaryEn: 'Build a production-grade Sliding Window Rate Limiter service in Node.js/TypeScript that handles 10,000 requests/sec with Redis fallback.',
    summaryAr: 'تصميم وبناء خدمة تحديد معدل الاستعلامات (Rate Limiter) بأسلوب نافذة الانزلاق (Sliding Window) للحد من الهجمات وتحمل 10,000 طلب/ثانية.',
    requirementsEn: [
      'Implement sliding window counter algorithm with Redis memory store.',
      'Graceful handling when Redis connection fails (fallback to local in-memory LRU cache).',
      'Provide IP-based and JWT User ID-based rate limits simultaneously.',
      'Return standard HTTP headers: X-RateLimit-Limit, X-RateLimit-Remaining, Retry-After.'
    ],
    requirementsAr: [
      'برمجة خوارزمية Sliding Window باستخدام قاعدة بيانات Redis للذاكرة المؤقتة.',
      'معالجة حالات سقوط التوصيل بـ Redis عبر الـ Fallback بذاكرة LRU محلياً.',
      'توفير تحديد المعدل على مستوى IP للمستخدمين المجهولين وعلى مستوى User ID للمسجلين.',
      'إرجاع ترويسات HTTP القياسية: X-RateLimit-Limit و X-RateLimit-Remaining و Retry-After.'
    ],
    starterTemplate: `// Take-Home Solution Submission: Distributed Rate Limiter
import express from 'express';

export class SlidingWindowRateLimiter {
  private windowSizeMs: number = 60000; // 1 minute
  private maxLimit: number = 100;

  async isAllowed(clientId: string): Promise<{ allowed: boolean; remaining: number }> {
    const now = Date.now();
    // TODO: Implement sliding window algorithm
    return { allowed: true, remaining: 99 };
  }
}

export const rateLimiterMiddleware = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
  // Your production middleware logic here
  next();
};`
  },
  {
    id: 'task-fe-1',
    track: 'frontend',
    companyName: 'Global SaaS Metrics',
    timeLimitDays: 2,
    difficulty: 'Mid-Senior',
    titleEn: 'High-Performance Real-Time Financial Analytics Dashboard',
    titleAr: 'تاسك بناء لوحة تحكم ومراقبة مالية فورية عالية الأداء (Real-Time Dashboard)',
    summaryEn: 'Build a responsive React/TypeScript dashboard displaying live stock updates with WebSockets, optimistic UI updates, and zero layout shift.',
    summaryAr: 'تطوير لوحة تحكم تفاعلية في ريأكت تقدم تحليلات مالية وتحديثات فورية دون إعادة تحميل الصفحة وبكفاءة رندر عالية.',
    requirementsEn: [
      'Virtualize long data lists (10,000+ items) to maintain 60 FPS scrolling.',
      'Implement custom custom hooks for WebSocket retry logic with exponential backoff.',
      'State management using React Context with selectors or Zustand to avoid unnecessary re-renders.',
      'Full accessibility (WCAG AA) with screen-reader friendly status updates.'
    ],
    requirementsAr: [
      'استخدام تقنية القوائم الافتراضية (List Virtualization) لمعالجة +10,000 سجل بـ 60 FPS.',
      'إنشاء Custom Hook لاتصالات WebSocket مع إعادة المحاولة التلقائية (Exponential Backoff).',
      'إدارة الحالة بكفاءة تضمن عدم تكرار إعادة الرندر (Re-renders) للواجهات غير المتأثرة.',
      'دعم معايير إمكانية الوصول (WCAG AA) وقراءة الشاشة بامتياز.'
    ],
    starterTemplate: `// Take-Home Solution Submission: Real-Time Analytics Dashboard
import React, { useState, useEffect, useMemo } from 'react';

export const AnalyticsDashboard: React.FC = () => {
  const [metrics, setMetrics] = useState([]);

  // TODO: Implement WebSocket listener with reconnect backoff
  useEffect(() => {
    const ws = new WebSocket('wss://api.example.com/stocks');
    ws.onmessage = (event) => {
      // Handle batch updates efficiently
    };
    return () => ws.close();
  }, []);

  return (
    <div className="dashboard-container">
      <h2>Live Metrics Studio</h2>
      {/* Virtualized List Render */}
    </div>
  );
};`
  },
  {
    id: 'task-fs-1',
    track: 'fullstack',
    companyName: 'LogiTech Enterprise',
    timeLimitDays: 4,
    difficulty: 'Lead Architect',
    titleEn: 'Full-Stack Fleet Tracking & Order Management System',
    titleAr: 'تاسك مشروع متكامل لتتبع الشحنات وإدارة الطلبات (Full-Stack System)',
    summaryEn: 'Build an end-to-end full-stack app with React frontend, Node/Express backend, relational DB queries, and role-based access control.',
    summaryAr: 'بناء تطبيق فول ستاك كامل يحتوي على لوحة متحكم بالمستخدمين، قاعدة بيانات مرتبطة، بوابات أمان وحماية الصلاحيات (RBAC).',
    requirementsEn: [
      'REST API with transactional DB operations (ACID compliance for order changes).',
      'Role-Based Access Control (RBAC) middleware for Admin, Operator, and Customer roles.',
      'Frontend reactive map tracker with real-time SSE or WebSocket stream.',
      'Comprehensive unit and integration test coverage for core business APIs.'
    ],
    requirementsAr: [
      'إنشاء واجهة برمجة تطبيقات REST API تدعم المعاملات التزامنية (Database Transactions).',
      'تطبيق نظام أمان وإدارة صلاحيات الصلاحيات (RBAC) للأدوار: مدير، مشغّل، وعميل.',
      'توفير شاشة متابعة تفاعلية تتلقى البث المباشر للشحنات عبر SSE أو WebSockets.',
      'كتابة اختبارات برمجة شاملة (Unit & Integration Tests) للمسارات الحساسة.'
    ],
    starterTemplate: `// Full-Stack Take-Home Project Architecture Blueprint
// Backend: Express Controller with Transactional Integrity
export async function processOrderCheckout(req, res) {
  const dbSession = await db.startTransaction();
  try {
    // 1. Verify Inventory
    // 2. Charge Wallet
    // 3. Create Shipment
    await dbSession.commit();
    res.status(200).json({ success: true });
  } catch (err) {
    await dbSession.rollback();
    res.status(500).json({ error: 'Checkout failed safely' });
  }
}`
  }
];

export const TakeHomeAssignmentStudio: React.FC = () => {
  const { isRtl, lang } = useApp();

  const [selectedTaskId, setSelectedTaskId] = useState<string>(TAKE_HOME_TASKS[0].id);
  const [submissionCode, setSubmissionCode] = useState<string>(TAKE_HOME_TASKS[0].starterTemplate);
  const [notes, setNotes] = useState<string>('');

  const [isEvaluating, setIsEvaluating] = useState<boolean>(false);
  const [evaluation, setEvaluation] = useState<{
    score: number;
    decision: 'HIRE_STRONG' | 'LEAN_HIRE' | 'REJECT';
    architectureScore: number;
    edgeCaseScore: number;
    securityScore: number;
    performanceScore: number;
    feedbackEn: string;
    feedbackAr: string;
    highlights: string[];
    improvements: string[];
    refactoringSnippet: string;
  } | null>(null);

  const activeTask = TAKE_HOME_TASKS.find(t => t.id === selectedTaskId) || TAKE_HOME_TASKS[0];

  const handleSelectTask = (task: TakeHomeTask) => {
    setSelectedTaskId(task.id);
    setSubmissionCode(task.starterTemplate);
    setEvaluation(null);
  };

  const handleRunEvaluation = () => {
    setIsEvaluating(true);
    setEvaluation(null);

    setTimeout(() => {
      const codeLen = submissionCode.length;
      const hasTryCatch = /(try\s*\{|catch\s*\(|\.catch\()/i.test(submissionCode);
      const hasTypes = /(interface|type|enum|Promise<|Response)/i.test(submissionCode);
      const hasAsync = /(async|await|Promise)/i.test(submissionCode);

      const arch = hasTypes ? 24 : 16;
      const edge = hasTryCatch ? 23 : 14;
      const sec = codeLen > 200 ? 22 : 15;
      const perf = hasAsync ? 23 : 18;

      const totalScore = arch + edge + sec + perf;
      const decision = totalScore >= 85 ? 'HIRE_STRONG' : totalScore >= 70 ? 'LEAN_HIRE' : 'REJECT';

      setEvaluation({
        score: totalScore,
        decision,
        architectureScore: arch,
        edgeCaseScore: edge,
        securityScore: sec,
        performanceScore: perf,
        feedbackEn: totalScore >= 85
          ? 'Exceptional Submission! Your code shows senior-level enterprise architectural choices, clean error boundaries, and production-ready structure.'
          : 'Solid attempt! To improve your score to Strong Hire, ensure you add explicit error fallback boundaries and comprehensive payload validation.',
        feedbackAr: totalScore >= 85
          ? 'مشروع ممتاز وجاهز للتشغيل الفعلي! يظهر الكود نضجاً معمارياً عالياً في توزيع المسئوليات ومعالجة الاستثناءات.'
          : 'محاولة جيدة جداً! لرفع التقييم إلى قبول ممتاز (Strong Hire)، أضف معالجة شاملة لحالات سقوط السيرفرات والتحقق من المدخلات (Validation).',
        highlights: [
          isRtl ? 'استخدام ممتاز للأنواع البرمجية (TypeScript Types/Interfaces)' : 'Clean separation of concerns with strong TypeScript typing',
          isRtl ? 'معالجة جيدة للمسارات غير المتزامنة (Asynchronous Execution Flow)' : 'Robust async error handling pattern applied in critical paths'
        ],
        improvements: hasTryCatch ? [] : [
          isRtl ? 'إضافة كتل try/catch حول الاستعلامات الخارجية والشبكة' : 'Wrap network & database calls inside try/catch blocks for safety'
        ],
        refactoringSnippet: `// Recommended Enterprise Refactor Pattern:
export class ProductionReadyHandler {
  async executeSafely<T>(fn: () => Promise<T>): Promise<{ data: T | null; error: Error | null }> {
    try {
      const data = await fn();
      return { data, error: null };
    } catch (error: any) {
      console.error('[Telemetry Log]', error);
      return { data: null, error };
    }
  }
}`
      });

      setIsEvaluating(false);
    }, 1600);
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 space-y-8" id="take-home-studio">
      
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div className="flex items-center space-x-3 rtl:space-x-reverse">
          <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-2xl text-amber-400">
            <Briefcase className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl font-black text-white">
              {isRtl ? 'مشروع اختبار القبول الوظيفي (Take-Home Technical Project)' : 'Take-Home Technical Assignment Reviewer'}
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              {isRtl ? 'اختر تاسك الشركة، اكتب حلك البرمجي أو الهيكلي، واحصل على تقييم وتصنيف فوري من لجنة التوظيف الذكية.' : 'Select a realistic company assignment, code your solution, and receive an instant hiring committee decision & scorecard.'}
            </p>
          </div>
        </div>

        {/* Task Selection Selector */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          {TAKE_HOME_TASKS.map(task => (
            <button
              key={task.id}
              onClick={() => handleSelectTask(task)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 border ${
                selectedTaskId === task.id
                  ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-md shadow-amber-500/20'
                  : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              <span>{task.companyName}</span>
              <span className="text-[10px] opacity-75 font-mono">({task.difficulty})</span>
            </button>
          ))}
        </div>
      </div>

      {/* Task Details Card */}
      <div className="bg-slate-950 border border-amber-500/30 rounded-2xl p-6 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-black uppercase tracking-wider text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded-md border border-amber-500/20">
              {activeTask.track.toUpperCase()} TRACK
            </span>
            <span className="text-xs text-slate-400 font-mono flex items-center gap-1">
              <Briefcase className="w-3.5 h-3.5 text-slate-500" />
              <span>{activeTask.companyName}</span>
            </span>
          </div>

          <div className="flex items-center gap-3 text-xs font-mono text-slate-400">
            <span>⏱️ Time Limit: {activeTask.timeLimitDays} Days</span>
            <span className="text-amber-400 font-bold">• {activeTask.difficulty}</span>
          </div>
        </div>

        <h4 className="text-lg font-black text-white">
          {isRtl ? activeTask.titleAr : activeTask.titleEn}
        </h4>
        <p className="text-xs text-slate-300 leading-relaxed">
          {isRtl ? activeTask.summaryAr : activeTask.summaryEn}
        </p>

        {/* Requirements List */}
        <div className="space-y-2 pt-2">
          <h5 className="text-xs font-extrabold text-amber-400 flex items-center gap-1.5">
            <Zap className="w-4 h-4" />
            <span>{isRtl ? 'متطلبات التسليم الفني (Acceptance Criteria):' : 'Technical Acceptance Criteria:'}</span>
          </h5>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
            {(isRtl ? activeTask.requirementsAr : activeTask.requirementsEn).map((req, idx) => (
              <div key={idx} className="bg-slate-900 border border-slate-800/80 p-2.5 rounded-xl text-slate-300 flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>{req}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Code Submission Editor Area */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-xs font-extrabold text-slate-300 flex items-center gap-2">
            <Code2 className="w-4 h-4 text-amber-400" />
            <span>{isRtl ? 'محرر تقديم مشروع التاسك (Submission Source Code)' : 'Your Project Solution Code'}</span>
          </label>
          <span className="text-[10px] text-slate-500 font-mono">TypeScript / ES6 Module</span>
        </div>

        <textarea
          value={submissionCode}
          onChange={e => setSubmissionCode(e.target.value)}
          rows={10}
          className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-4 text-xs font-mono text-emerald-300 focus:border-amber-500 outline-none leading-relaxed"
          placeholder="// Paste your complete project solution code here..."
        />

        {/* Architectural Notes */}
        <textarea
          value={notes}
          onChange={e => setNotes(e.target.value)}
          rows={2}
          className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-slate-300 focus:border-amber-500 outline-none leading-relaxed"
          placeholder={isRtl ? 'ملاحظات المعمارية والحلول البديلة (Trade-offs & Assumptions)...' : 'Architectural decisions, trade-offs, and run instructions...'}
        />

        {/* Action Button */}
        <button
          onClick={handleRunEvaluation}
          disabled={isEvaluating || !submissionCode.trim()}
          className="w-full bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-slate-950 font-black p-4 rounded-2xl shadow-lg shadow-amber-500/20 transition-all cursor-pointer flex items-center justify-center space-x-2 rtl:space-x-reverse disabled:opacity-50"
        >
          {isEvaluating ? (
            <>
              <RefreshCw className="w-5 h-5 animate-spin" />
              <span>{isRtl ? 'جاري تقييم التاسك ومراجعة جودة الكود...' : 'Evaluating Assignment & Running Hiring Audit...'}</span>
            </>
          ) : (
            <>
              <Sparkles className="w-5 h-5" />
              <span>{isRtl ? 'تسليم التاسك واستلام تقييم لجنة التوظيف' : 'Submit Task & Generate Hiring Evaluation Scorecard'}</span>
            </>
          )}
        </button>
      </div>

      {/* Hiring Decision & Scorecard Output */}
      <AnimatePresence>
        {evaluation && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-slate-950 border border-amber-500/30 rounded-2xl p-6 md:p-8 space-y-6"
          >
            {/* Decision Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
              <div className="flex items-center space-x-4 rtl:space-x-reverse">
                <div className={`w-14 h-14 rounded-2xl border flex items-center justify-center font-black text-2xl font-mono ${
                  evaluation.decision === 'HIRE_STRONG' ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-400' :
                  evaluation.decision === 'LEAN_HIRE' ? 'bg-amber-500/10 border-amber-500/40 text-amber-400' :
                  'bg-rose-500/10 border-rose-500/40 text-rose-400'
                }`}>
                  {evaluation.score}%
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className={`text-[10px] font-black uppercase px-2.5 py-0.5 rounded-md ${
                      evaluation.decision === 'HIRE_STRONG' ? 'bg-emerald-500/20 text-emerald-300' :
                      evaluation.decision === 'LEAN_HIRE' ? 'bg-amber-500/20 text-amber-300' :
                      'bg-rose-500/20 text-rose-300'
                    }`}>
                      {evaluation.decision === 'HIRE_STRONG' ? (isRtl ? 'قبول مميز (Strong Hire)' : 'STRONG HIRE') :
                       evaluation.decision === 'LEAN_HIRE' ? (isRtl ? 'مقبول (Lean Hire)' : 'LEAN HIRE') :
                       (isRtl ? 'إعادة نظر (Needs Refactoring)' : 'REJECT / REVISE')}
                    </span>
                  </div>
                  <h4 className="text-base font-extrabold text-white mt-1">
                    {isRtl ? 'نتيجة تقييم تاسك القبول الوظيفي' : 'Take-Home Assessment Hiring Decision'}
                  </h4>
                  <p className="text-xs text-slate-400 mt-0.5">
                    {isRtl ? evaluation.feedbackAr : evaluation.feedbackEn}
                  </p>
                </div>
              </div>
            </div>

            {/* Scorecard breakdown */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono text-xs">
              <div className="bg-slate-900 border border-slate-800 p-3 rounded-xl">
                <span className="text-slate-500 block text-[10px] uppercase">Architecture</span>
                <span className="text-amber-400 font-extrabold text-sm">{evaluation.architectureScore}/25</span>
              </div>
              <div className="bg-slate-900 border border-slate-800 p-3 rounded-xl">
                <span className="text-slate-500 block text-[10px] uppercase">Edge Cases</span>
                <span className="text-blue-400 font-extrabold text-sm">{evaluation.edgeCaseScore}/25</span>
              </div>
              <div className="bg-slate-900 border border-slate-800 p-3 rounded-xl">
                <span className="text-slate-500 block text-[10px] uppercase">Security</span>
                <span className="text-emerald-400 font-extrabold text-sm">{evaluation.securityScore}/25</span>
              </div>
              <div className="bg-slate-900 border border-slate-800 p-3 rounded-xl">
                <span className="text-slate-500 block text-[10px] uppercase">Performance</span>
                <span className="text-rose-400 font-extrabold text-sm">{evaluation.performanceScore}/25</span>
              </div>
            </div>

            {/* Refactoring Tip */}
            {evaluation.refactoringSnippet && (
              <div className="space-y-2 text-xs">
                <h5 className="font-extrabold text-amber-400 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4" />
                  <span>{isRtl ? 'نموذج إعادة الهيكلة المقترح (Senior Refactoring Pattern):' : 'Recommended Senior Engineering Pattern:'}</span>
                </h5>
                <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl font-mono text-emerald-300">
                  <pre>{evaluation.refactoringSnippet}</pre>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
};
