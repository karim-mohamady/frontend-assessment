/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Area,
  ComposedChart,
  Line
} from 'recharts';
import { Compass, BarChart2, Activity, Award, BookOpen, AlertTriangle, Lightbulb, CheckCircle2 } from 'lucide-react';

interface ChartDataPoint {
  id: string;
  label: string;
  value: number;
  previousValue?: number | null;
  avgValue?: number;
  color: string;
  count: number;
}

interface RechartsPerformanceChartProps {
  data: ChartDataPoint[];
  compareGlobal?: boolean;
}

const GLOBAL_AVERAGES: { [key: string]: number } = {
  html: 75,
  css: 68,
  javascript: 62,
  react: 58,
  bootstrap: 70,
  english: 74
};

const STUDY_RECOMMENDATIONS = {
  html: {
    titleEn: "HTML5 & Accessibility Guides",
    titleAr: "دليل HTML5 وإمكانية الوصول",
    itemsEn: [
      "Master semantic architecture (<article>, <aside>, <section>) to boost SEO indices.",
      "Integrate WAI-ARIA roles, aria-live fields, and standard tabindex to meet WCAG standards.",
      "Explore HTML5 constraint validations, inputs, and form controls lifecycle attributes."
    ],
    itemsAr: [
      "أتقن الهيكلية الدلالية للموقع (<article>, <aside>, <section>) لرفع مؤشرات الأرشفة.",
      "اضبط أدوار WAI-ARIA، الحقول النشطة، ومؤشر علامة التبويب لتحقيق متطلبات WCAG.",
      "تعرّف على قيود التحقق من المدخلات ومميزات التحكم بنماذج الويب المتقدمة."
    ]
  },
  css: {
    titleEn: "Advanced CSS Grid & Specificity",
    titleAr: "تخطيطات CSS وخصوصية الأنماط",
    itemsEn: [
      "Build complex, fluid layouts with Grid (grid-template-areas, auto-fit/auto-fill).",
      "Avoid overrides and solve CSS specificity conflicts using modern custom variables.",
      "Refine transition timing cubic-beziers, hardware-accelerated transforms, and keyframes."
    ],
    itemsAr: [
      "أنشئ تخطيطات مرنة ومعقدة بالشبكات المتقدمة (auto-fit/auto-fill، ومناطق القوالب).",
      "تفادى التجاوز العشوائي وحل تعارضات خصوصية النمط باستخدام المتغيرات المخصصة.",
      "حسّن أداء الحركة وتأثيرات الانتقال الفيزيائية وإطارات الرسوم المتحركة الأساسية."
    ]
  },
  javascript: {
    titleEn: "JS Async Runtime & ES6+ Closures",
    titleAr: "بيئة تشغيل جافا سكريبت غير المتزامنة",
    itemsEn: [
      "Deconstruct JS Event Loop internals (microtask queues, rendering callbacks, macrotasks).",
      "Grasp scope closure memory retention, lexical scope chains, and custom event streams.",
      "Deep-dive into Promise sequence executions, dynamic imports, and async generator loops."
    ],
    itemsAr: [
      "افهم آلية عمل حلقة الأحداث (Event Loop) للربط بين مهام الدفع المباشر والمهام المؤجلة.",
      "استوعب المغلقات (Closures)، السلاسل المعجمية، ومستودعات الذاكرة المرتبطة بالوظائف.",
      "تعمق في تتابع وعود (Promises)، آليات الاستيراد الديناميكي، والمولدات غير المتزامنة."
    ]
  },
  react: {
    titleEn: "React Component Lifecycles & State",
    titleAr: "دورة حياة المكونات وإدارة الحالة",
    itemsEn: [
      "Avoid memory leaks by stabilizing dependency arrays for hooks like useEffect and useMemo.",
      "Safeguard high-frequency render triggers using useCallback, useRef, and React.memo.",
      "Utilize useReducer and unified state actions to control multi-stage data fetching pipelines."
    ],
    itemsAr: [
      "امنع تكرار الصياغة اللانهائي بالتحكم بجدول اعتماديات خطافات ريأكت (useEffect/useMemo).",
      "حافظ على سرعة الإطارات العالية بتثبيت المراجع واستخدام useCallback و React.memo.",
      "استخدم useReducer لتجميع أحداث التحكم في الحالات المتسلسلة والمترابطة."
    ]
  },
  bootstrap: {
    titleEn: "Grid Offsets & SASS Configuration",
    titleAr: "بوتستراب 5 وشبكات التجاوب",
    itemsEn: [
      "Manipulate responsive grid offsets, flex container configurations, and column break points.",
      "Customize themes cleanly by overriding standard Bootstrap variable pools in custom SASS.",
      "Design fully accessible modals and popovers ensuring robust keyboard trapping."
    ],
    itemsAr: [
      "تحكم في إزاحة الأعمدة وشبكة التجاوب ومحاذاة الحاويات المرنة (flex) بنقاط التجاوب.",
      "خصص الأنماط بأمان بتجاوز قيم المتغيرات الافتراضية داخل ملفات SASS الخاصة بك.",
      "صمم مكونات حوارية (modals) متوافقة تماماً مع التنقل باستخدام لوحة المفاتيح."
    ]
  },
  english: {
    titleEn: "Technical Lexicon & Git Docs",
    titleAr: "المصطلحات التقنية الإنجليزية ووثائق المطور",
    itemsEn: [
      "Train in scanning framework logs, compile warnings, and deprecation notices.",
      "Excel in standard industry Git conventions (rebase, squashing, cherry-pick operations).",
      "Read RFC specifications, security logs, and package change log updates smoothly."
    ],
    itemsAr: [
      "تدرب على فحص سجلات إطار العمل وتحليلات الأخطاء لتسريع عملية تصحيح الأكواد.",
      "اتقن اصطلاحات Git العالمية في المشاريع الكبرى (rebase, squash, cherry-pick).",
      "اقرأ مستندات المواصفات التقنية (RFC) وقوائم التغيير للبرمجيات والمكتبات بثقة."
    ]
  }
};

export const RechartsPerformanceChart: React.FC<RechartsPerformanceChartProps> = ({ data, compareGlobal = false }) => {
  const { isRtl, t } = useApp();
  const [subChartType, setSubChartType] = useState<'radar' | 'composed'>('radar');

  const chartData = data.map((item) => ({
    ...item,
    globalValue: GLOBAL_AVERAGES[item.id] || 65
  }));

  // Identify dynamic weakest categories (the lowest scoring 2 areas)
  const sortedData = [...data].sort((a, b) => a.value - b.value);
  const weakestIds = sortedData.slice(0, 2).map((item) => item.id);

  // Custom tooltips matching the dashboard theme
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const point = payload[0].payload;
      const isWeak = weakestIds.includes(point.id);
      const isProficient = point.value >= 70;
      
      const rec = STUDY_RECOMMENDATIONS[point.id as keyof typeof STUDY_RECOMMENDATIONS];
      const recTitle = isRtl ? rec?.titleAr : rec?.titleEn;
      const recItems = isRtl ? rec?.itemsAr : rec?.itemsEn;

      return (
        <div 
          className={`bg-slate-950 border p-4 rounded-2xl shadow-2xl backdrop-blur-md text-left rtl:text-right max-w-sm sm:max-w-md ${
            isWeak 
              ? 'border-red-500/30 ring-1 ring-red-500/10' 
              : isProficient 
              ? 'border-emerald-500/30' 
              : 'border-amber-500/30'
          }`}
          id="recharts-custom-tooltip"
        >
          <div className="flex items-center justify-between gap-3 mb-2 pb-2 border-b border-slate-900">
            <div>
              <p className="text-xs font-black text-white">{point.label}</p>
              <p className="text-[10px] text-slate-500 font-mono mt-0.5">
                {isRtl 
                  ? `التقييمات المكتملة: ${point.count}` 
                  : `Assessments taken: ${point.count}`}
              </p>
            </div>
            
            {/* Actionable status badge */}
            {isWeak ? (
              <span className="flex items-center gap-1 bg-red-500/10 text-red-400 text-[9px] font-black uppercase px-2 py-0.5 rounded-md border border-red-500/20">
                <AlertTriangle className="w-3 h-3" />
                <span>{isRtl ? 'أولوية تركيز' : 'Weakest Area'}</span>
              </span>
            ) : isProficient ? (
              <span className="flex items-center gap-1 bg-emerald-500/10 text-emerald-400 text-[9px] font-black uppercase px-2 py-0.5 rounded-md border border-emerald-500/20">
                <CheckCircle2 className="w-3 h-3" />
                <span>{isRtl ? 'مستوى ممتاز' : 'Proficient'}</span>
              </span>
            ) : (
              <span className="flex items-center gap-1 bg-amber-500/10 text-amber-400 text-[9px] font-black uppercase px-2 py-0.5 rounded-md border border-amber-500/20">
                <Lightbulb className="w-3 h-3" />
                <span>{isRtl ? 'تحتاج تطوير' : 'Needs Work'}</span>
              </span>
            )}
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: point.color }} />
              <span className="text-xs text-slate-300">
                {isRtl ? 'النتيجة الأخيرة:' : 'Latest Score:'}{' '}
                <strong className="text-amber-500 font-mono font-black text-sm">{Math.round(point.value)}%</strong>
              </span>
            </div>

            {point.previousValue !== undefined && point.previousValue !== null && (
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                <span className="text-xs text-slate-300">
                  {isRtl ? 'المحاولة السابقة:' : 'Previous Attempt:'}{' '}
                  <strong className="text-emerald-400 font-mono font-black text-sm">{Math.round(point.previousValue)}%</strong>
                </span>
                <span className={`text-[10px] font-extrabold px-1.5 py-0.5 rounded flex items-center gap-0.5 ${
                  point.value >= point.previousValue 
                    ? 'bg-emerald-500/10 text-emerald-400' 
                    : 'bg-red-500/10 text-red-400'
                }`}>
                  <span>{point.value >= point.previousValue ? '▲' : '▼'}</span>
                  <span>{Math.abs(Math.round(point.value - point.previousValue))}%</span>
                </span>
              </div>
            )}

            {compareGlobal && (
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-indigo-500" />
                <span className="text-xs text-slate-300">
                  {isRtl ? 'المعدل العالمي:' : 'Global Average:'}{' '}
                  <strong className="text-indigo-400 font-mono font-black text-sm">{GLOBAL_AVERAGES[point.id] || 65}%</strong>
                </span>
              </div>
            )}

            {/* Personalized dynamic recommendations panel */}
            <div className="mt-3 p-2.5 bg-slate-900/60 rounded-xl border border-slate-800/40">
              <p className="text-[11px] font-black text-slate-200 flex items-center gap-1.5 mb-2">
                <BookOpen className="w-3.5 h-3.5 text-amber-400" />
                <span>{recTitle}</span>
              </p>
              <ul className="space-y-1.5 pl-4 rtl:pl-0 rtl:pr-4 list-disc text-slate-400 text-[10px] leading-relaxed">
                {recItems?.map((item, idx) => (
                  <li key={idx} className="hover:text-slate-200 transition-colors">
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-slate-950/40 border border-slate-900/50 rounded-2xl p-4 sm:p-6 space-y-5" id="recharts-performance-wrapper">
      
      {/* Chart controls and headers */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pb-3 border-b border-slate-900/60" id="recharts-chart-header">
        <div>
          <h4 className="text-xs font-black uppercase text-amber-500 tracking-wider flex items-center gap-1.5">
            <Activity className="w-3.5 h-3.5 animate-pulse" />
            <span>{isRtl ? 'تحليلات الأداء التفاعلية' : 'Interactive Analytics (Recharts)'}</span>
          </h4>
          <p className="text-[10px] text-slate-500 font-mono">
            {isRtl ? 'رسوم بيانية متقدمة لتتبع الكفاءة البرمجية' : 'Advanced charting for modern developer competencies'}
          </p>
        </div>

        {/* Toggle between Radar and Composed bar inside Recharts */}
        <div className="flex bg-slate-900/80 p-0.5 rounded-xl border border-slate-800/80" id="recharts-type-selector">
          <button
            onClick={() => setSubChartType('radar')}
            className={`flex items-center space-x-1.5 rtl:space-x-reverse px-2.5 py-1 rounded-lg text-[10px] font-black transition-all cursor-pointer ${
              subChartType === 'radar'
                ? 'bg-amber-500 text-slate-900 shadow-md shadow-amber-500/10'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Compass className="w-3 h-3" />
            <span>{isRtl ? 'شبكة العنكبوت' : 'Spider Radar'}</span>
          </button>
          <button
            onClick={() => setSubChartType('composed')}
            className={`flex items-center space-x-1.5 rtl:space-x-reverse px-2.5 py-1 rounded-lg text-[10px] font-black transition-all cursor-pointer ${
              subChartType === 'composed'
                ? 'bg-amber-500 text-slate-900 shadow-md shadow-amber-500/10'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <BarChart2 className="w-3 h-3" />
            <span>{isRtl ? 'منحنى الأعمدة' : 'Composed Area'}</span>
          </button>
        </div>
      </div>

      {/* Chart container */}
      <div className="w-full h-[320px] relative select-none flex items-center justify-center" id="recharts-chart-container">
        <ResponsiveContainer width="100%" height="100%">
          {subChartType === 'radar' ? (
            <RadarChart cx="50%" cy="50%" outerRadius="80%" data={chartData}>
              <PolarGrid stroke="#334155" strokeDasharray="3 3" />
              <PolarAngleAxis 
                dataKey="label" 
                tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 700 }}
              />
              <PolarRadiusAxis 
                angle={30} 
                domain={[0, 100]} 
                tick={{ fill: '#475569', fontSize: 8 }} 
                axisLine={false} 
              />
              <Radar
                name={isRtl ? 'النتيجة الأخيرة' : 'Latest Attempt'}
                dataKey="value"
                stroke="#f59e0b"
                fill="#f59e0b"
                fillOpacity={0.25}
                activeDot={{ r: 6, fill: '#ffffff', stroke: '#f59e0b', strokeWidth: 2 }}
              />
              <Radar
                name={isRtl ? 'المحاولة السابقة' : 'Previous Attempt'}
                dataKey="previousValue"
                stroke="#10b981"
                fill="#10b981"
                fillOpacity={0.12}
                activeDot={{ r: 5, fill: '#ffffff', stroke: '#10b981', strokeWidth: 2 }}
              />
              {compareGlobal && (
                <Radar
                  name={isRtl ? 'المعدل العالمي' : 'Global Average'}
                  dataKey="globalValue"
                  stroke="#818cf8"
                  fill="#818cf8"
                  fillOpacity={0.15}
                  activeDot={{ r: 5, fill: '#ffffff', stroke: '#818cf8', strokeWidth: 2 }}
                />
              )}
              <Tooltip content={<CustomTooltip />} />
            </RadarChart>
          ) : (
            <ComposedChart data={chartData} margin={{ top: 15, right: 10, bottom: 5, left: -20 }}>
              <CartesianGrid stroke="#1e293b" strokeDasharray="3 3" vertical={false} />
              <XAxis 
                dataKey="label" 
                tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 700 }}
                axisLine={{ stroke: '#334155' }}
                tickLine={false}
              />
              <YAxis 
                domain={[0, 100]} 
                tick={{ fill: '#64748b', fontSize: 9 }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip content={<CustomTooltip />} />
              <defs>
                <linearGradient id="rechartsAreaGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f59e0b" stopOpacity="0.25" />
                  <stop offset="95%" stopColor="#f59e0b" stopOpacity="0.0" />
                </linearGradient>
              </defs>
              <Area 
                type="monotone" 
                dataKey="value" 
                fill="url(#rechartsAreaGrad)" 
                stroke="none" 
              />
              <Bar 
                dataKey="value" 
                barSize={24} 
                radius={[4, 4, 0, 0]}
              >
                {chartData.map((entry, index) => (
                  <rect
                    key={`bar-rect-${index}`}
                    fill={entry.color}
                    fillOpacity={0.8}
                  />
                ))}
              </Bar>
              <Line 
                type="monotone" 
                dataKey="value" 
                stroke="#fbbf24" 
                strokeWidth={2} 
                dot={{ fill: '#0f172a', stroke: '#fbbf24', strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, fill: '#fff', stroke: '#f59e0b', strokeWidth: 2 }}
                name={isRtl ? 'النتيجة الأخيرة' : 'Latest Score'}
              />
              <Line 
                type="monotone" 
                dataKey="previousValue" 
                stroke="#10b981" 
                strokeDasharray="3 3"
                strokeWidth={2} 
                connectNulls={true}
                dot={{ fill: '#0f172a', stroke: '#10b981', strokeWidth: 2, r: 3 }}
                activeDot={{ r: 5, fill: '#fff', stroke: '#10b981', strokeWidth: 2 }}
                name={isRtl ? 'المحاولة السابقة' : 'Previous Attempt'}
              />
              {compareGlobal && (
                <Line 
                  type="monotone" 
                  dataKey="globalValue" 
                  stroke="#818cf8" 
                  strokeDasharray="4 4"
                  strokeWidth={2} 
                  dot={{ fill: '#0f172a', stroke: '#818cf8', strokeWidth: 2, r: 3 }}
                  activeDot={{ r: 5, fill: '#fff', stroke: '#818cf8', strokeWidth: 2 }}
                />
              )}
            </ComposedChart>
          )}
        </ResponsiveContainer>
      </div>

      {/* Legend & Help Information */}
      <div className="flex flex-wrap justify-center items-center gap-x-5 gap-y-2 pt-2 border-t border-slate-900/40 text-[9px] font-mono font-bold text-slate-500" id="recharts-legend">
        <span className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded bg-amber-500" />
          <span>{isRtl ? 'النتيجة الأخيرة' : 'Latest Attempt'}</span>
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded bg-emerald-500" />
          <span>{isRtl ? 'المحاولة السابقة' : 'Previous Attempt'}</span>
        </span>
        {compareGlobal && (
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded bg-indigo-500" />
            <span>{isRtl ? 'المعدل العالمي' : 'Global Average'}</span>
          </span>
        )}
        <span className="flex items-center gap-1.5">
          <Award className="w-3.5 h-3.5 text-indigo-400" />
          <span>{isRtl ? 'درجة النجاح الكفؤ (70%+)' : 'Competency Standard (70%+)'}</span>
        </span>
      </div>
    </div>
  );
};
