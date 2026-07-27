/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { BookOpen, AlertTriangle, Lightbulb, CheckCircle2 } from 'lucide-react';

interface ChartDataPoint {
  id?: string;
  label: string;
  value: number;
  previousValue?: number | null;
  avgValue?: number;
  color: string;
}

interface InteractiveChartProps {
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

const SHORT_LABELS: { [key: string]: { en: string; es: string; ar: string } } = {
  html: { en: 'HTML5', es: 'HTML5', ar: 'HTML5' },
  css: { en: 'CSS3', es: 'CSS3', ar: 'CSS3' },
  javascript: { en: 'JS', es: 'JS', ar: 'جافا سكريبت' },
  react: { en: 'React', es: 'React', ar: 'ريأكت' },
  bootstrap: { en: 'Bootstrap', es: 'Bootstrap', ar: 'بوتستراب' },
  english: { en: 'English', es: 'Inglés', ar: 'إنجليزية' }
};

const STUDY_RECOMMENDATIONS = {
  html: {
    titleEn: "HTML5 & Accessibility Guidance",
    titleAr: "دليل HTML5 وإمكانية الوصول",
    itemsEn: [
      "Master semantic layout structures (<article>, <aside>, <section>) to optimize SEO indexing.",
      "Integrate WAI-ARIA labels, aria-live dynamic containers, and perfect tabindex behaviors.",
      "Review input constraints and validation lifecycle handlers for web forms."
    ],
    itemsAr: [
      "أتقن الهيكلية الدلالية للموقع (<article>, <aside>, <section>) لتسهيل عمل محركات البحث.",
      "اضبط أدوار WAI-ARIA، والحقول النشطة، ومؤشر علامة التبويب بدقة متناهية.",
      "راجع قيود التحقق من المدخلات ومميزات التحكم بالنماذج التفاعلية."
    ]
  },
  css: {
    titleEn: "Modern CSS Grid & Layout Tactics",
    titleAr: "تخطيطات CSS وخصوصية الأنماط",
    itemsEn: [
      "Build complex responsive grids with custom column layouts and grid-template-areas.",
      "Override variables cleanly to avoid cascading style specificity clutter.",
      "Practice timing functions, transitions, hardware-accelerated transforms, and keyframes."
    ],
    itemsAr: [
      "صمم تخطيطات مرنة ومعقدة بالشبكات المتجاوبة ومناطق القوالب المخصصة.",
      "تجاوز قيم المتغيرات الافتراضية بنظام تحكّم مركزي لحماية توازن الأنماط.",
      "حسّن أداء الرسوم وتأثيرات الانتقال ومحاور التحويل الفيزيائية ثلاثية الأبعاد."
    ]
  },
  javascript: {
    titleEn: "JS Async Engines & Closures Guide",
    titleAr: "جافا سكريبت غير المتزامنة والمغلقات",
    itemsEn: [
      "Deconstruct Event Loop mechanics (microtask scheduling, rendering triggers, callbacks).",
      "Understand scope closure memory storage, lexical scopes, and custom global dispatchers.",
      "Refine Promise error chains, dynamic module loaders, and asynchronous loops."
    ],
    itemsAr: [
      "ادرس حلقة الأحداث (Event Loop) للربط الدقيق بين العمليات المباشرة والمهام الخلفية.",
      "استوعب المغلقات (Closures)، السلاسل المعجمية، ومستودعات الذاكرة المرتبطة بالوظائف.",
      "تعمق في تتابع وعود (Promises)، وميزات الاستيراد الديناميكي غير المتزامن."
    ]
  },
  react: {
    titleEn: "React Component Lifecycle & Optimizations",
    titleAr: "دورة حياة مكونات ريأكت وإدارة الحالة",
    itemsEn: [
      "Avoid memory leaks by validating dependency arrays for useEffect and useMemo.",
      "Safeguard components against excessive rendering using useCallback, useRef, and React.memo.",
      "Use useReducer and custom context hooks to pipe multi-stage data pipelines securely."
    ],
    itemsAr: [
      "تجنب تكرار الصياغة اللانهائي بتثبيت جدول اعتماديات خطافات ريأكت (useEffect).",
      "حافظ على الأداء فائق السرعة عبر useCallback و useRef وميزة React.memo.",
      "استخدم useReducer لتجميع أحداث التحكم في الحالات التفاعلية المتشابكة."
    ]
  },
  bootstrap: {
    titleEn: "Grid Offsets & SASS Overrides",
    titleAr: "بوتستراب 5 وتجاوب الهياكل",
    itemsEn: [
      "Utilize grid offsets, flex container scales, and column breakpoints.",
      "Override default CSS variables cleanly in custom SASS setups.",
      "Construct fully accessible modals and popovers with strict keyboard capture control."
    ],
    itemsAr: [
      "تحكم في إزاحة الأعمدة وشبكة التجاوب ومحاذاة الحاويات المرنة (flex) بنقاط التجاوب.",
      "خصص الأنماط بأمان بتجاوز قيم المتغيرات الافتراضية داخل ملفات SASS الخاصة بك.",
      "صمم مكونات حوارية (modals) متوافقة تماماً مع التنقل باستخدام لوحة المفاتيح."
    ]
  },
  english: {
    titleEn: "Technical Glossary & Developer Docs",
    titleAr: "المصطلحات التقنية الإنجليزية ووثائق المطور",
    itemsEn: [
      "Interpret framework stack traces, compiler logs, and API deprecation alerts.",
      "Master standard industry Git methodologies (rebase workflow, squashing, merging).",
      "Scan RFC documentation specs and library package release change notes."
    ],
    itemsAr: [
      "تدرب على فحص سجلات إطار العمل وتحليلات الأخطاء لتسريع تصحيح الكود.",
      "اتقن اصطلاحات Git العالمية في المشاريع البرمجية الكبرى (rebase, squash).",
      "اقرأ مستندات المواصفات التقنية (RFC) وقوائم التغيير للبرمجيات والمكتبات بثقة."
    ]
  }
};

export const InteractiveChart: React.FC<InteractiveChartProps> = ({ data, compareGlobal = false }) => {
  const { lang, isRtl } = useApp();
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  const maxVal = 100;
  const chartHeight = 220;
  const paddingLeft = isRtl ? 15 : 50;
  const paddingRight = isRtl ? 50 : 15;
  const paddingTop = 25;
  const paddingBottom = 40;
  const chartWidth = 500;

  const graphWidth = chartWidth - paddingLeft - paddingRight;
  const graphHeight = chartHeight - paddingTop - paddingBottom;

  // Identify dynamic weakest categories
  const sortedData = [...data].sort((a, b) => a.value - b.value);
  const weakestIds = sortedData.slice(0, 2).map((item) => item.id || '');

  const barWidth = graphWidth / data.length - 20;
  const hoverX = hoveredIdx !== null ? (paddingLeft + hoveredIdx * (graphWidth / data.length) + (graphWidth / data.length - barWidth) / 2) : 0;
  const hoverY = hoveredIdx !== null ? (paddingTop + graphHeight - (data[hoveredIdx].value / maxVal) * graphHeight) : 0;

  const tooltipLeft = `${(hoverX / chartWidth) * 100}%`;
  const tooltipTop = `${(hoverY / chartHeight) * 100}%`;
  const tooltipXOffset = hoveredIdx !== null ? (hoverX > chartWidth / 2 ? '-105%' : '5%') : '0%';
  const tooltipYOffset = hoveredIdx !== null ? (hoverY > chartHeight / 2 ? '-105%' : '0%') : '0%';

  // Generate points for the latest and previous attempts trend lines
  const hasPreviousScores = data.some(item => item.previousValue !== undefined && item.previousValue !== null);

  const latestTrendPoints = data.map((item, idx) => {
    const x = paddingLeft + idx * (graphWidth / data.length) + (graphWidth / data.length) / 2;
    const y = paddingTop + graphHeight - (item.value / maxVal) * graphHeight;
    return { x, y };
  });
  const latestTrendPath = latestTrendPoints.map((p, idx) => `${idx === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');

  const previousTrendPoints = data
    .map((item, idx) => {
      if (item.previousValue === undefined || item.previousValue === null) return null;
      const x = paddingLeft + idx * (graphWidth / data.length) + (graphWidth / data.length) / 2;
      const y = paddingTop + graphHeight - (item.previousValue / maxVal) * graphHeight;
      return { x, y };
    })
    .filter((p): p is { x: number; y: number } => p !== null);
  const previousTrendPath = previousTrendPoints.map((p, idx) => `${idx === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');

  return (
    <div className="w-full relative select-none" id="assessment-chart-container">
      <div className="w-full overflow-x-auto">
        <div className="min-w-[450px] relative">
          <svg
            viewBox={`0 0 ${chartWidth} ${chartHeight}`}
            className="w-full h-auto font-sans overflow-visible text-slate-400"
            id="assessment-chart-svg"
          >
            {/* Grid lines */}
            {[0, 25, 50, 75, 100].map((tick, idx) => {
              const y = paddingTop + graphHeight - (tick / maxVal) * graphHeight;
              return (
                <g key={tick} className="opacity-40">
                  <line
                    x1={paddingLeft}
                    y1={y}
                    x2={chartWidth - paddingRight}
                    y2={y}
                    stroke="#475569"
                    strokeWidth="1"
                    strokeDasharray="4 4"
                  />
                  <text
                    x={isRtl ? chartWidth - 10 : 35}
                    y={y + 4}
                    textAnchor="end"
                    className="text-[10px] fill-slate-400 font-mono"
                  >
                    {tick}%
                  </text>
                </g>
              );
            })}

            {/* Trend Lines Overlay */}
            {latestTrendPoints.length > 0 && (
              <path
                d={latestTrendPath}
                fill="none"
                stroke="#f59e0b"
                strokeWidth="2"
                strokeOpacity="0.35"
                className="pointer-events-none"
              />
            )}
            {hasPreviousScores && previousTrendPoints.length > 0 && (
              <path
                d={previousTrendPath}
                fill="none"
                stroke="#10b981"
                strokeWidth="2"
                strokeDasharray="4 4"
                strokeOpacity="0.75"
                className="pointer-events-none"
              />
            )}

            {/* Bar Chart rendering */}
            {data.map((item, idx) => {
              const bHeight = (item.value / maxVal) * graphHeight;
              const x =
                paddingLeft +
                idx * (graphWidth / data.length) +
                (graphWidth / data.length - barWidth) / 2;
              const y = paddingTop + graphHeight - bHeight;

              const gVal = item.id ? (GLOBAL_AVERAGES[item.id] || 65) : 65;
              const gY = paddingTop + graphHeight - (gVal / maxVal) * graphHeight;

              // Get short label to avoid overlapping text
              const labelToUse = item.id && SHORT_LABELS[item.id]
                ? (lang === 'ar' ? SHORT_LABELS[item.id].ar : (lang === 'es' ? SHORT_LABELS[item.id].es : SHORT_LABELS[item.id].en))
                : item.label;

              return (
                <g 
                  key={item.label} 
                  className="group cursor-pointer"
                  onMouseEnter={() => setHoveredIdx(idx)}
                  onMouseLeave={() => setHoveredIdx(null)}
                >
                  {/* Gradient Definition */}
                  <defs>
                    <linearGradient id={`grad-${idx}`} x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor={item.color} stopOpacity="1" />
                      <stop offset="100%" stopColor={item.color} stopOpacity="0.2" />
                    </linearGradient>
                  </defs>

                  {/* Animated bar background track */}
                  <rect
                    x={x}
                    y={paddingTop}
                    width={barWidth}
                    height={graphHeight}
                    fill="#334155"
                    fillOpacity="0.1"
                    rx="6"
                  />

                  {/* Main value bar */}
                  <rect
                    x={x}
                    y={y}
                    width={barWidth}
                    height={Math.max(bHeight, 4)}
                    fill={`url(#grad-${idx})`}
                    rx="6"
                    className="transition-all duration-700 ease-out hover:fill-opacity-90"
                  />

                  {/* Comparative Global Average dashed line marker */}
                  {compareGlobal && item.id && (
                    <line
                      x1={x - 2}
                      y1={gY}
                      x2={x + barWidth + 2}
                      y2={gY}
                      stroke="#818cf8"
                      strokeWidth="2.5"
                      strokeDasharray="4 2"
                      className="transition-all duration-300"
                    />
                  )}

                  {/* Value text above bar - always visible as subtle slate-400 and pops on hover */}
                  <text
                    x={x + barWidth / 2}
                    y={y - 6}
                    textAnchor="middle"
                    className="text-[10px] font-bold fill-slate-400/80 group-hover:fill-amber-400 group-hover:text-xs transition-all duration-200"
                  >
                    {Math.round(item.value)}%
                  </text>

                  {/* Previous Attempt score marker circle on the bar chart */}
                  {item.previousValue !== undefined && item.previousValue !== null && (
                    <circle
                      cx={x + barWidth / 2}
                      cy={paddingTop + graphHeight - (item.previousValue / maxVal) * graphHeight}
                      r="4.5"
                      fill="#0f172a"
                      stroke="#10b981"
                      strokeWidth="2.5"
                      className="transition-all duration-300"
                    />
                  )}

                  {/* Label below bar */}
                  <text
                    x={x + barWidth / 2}
                    y={paddingTop + graphHeight + 18}
                    textAnchor="middle"
                    className="text-[10px] md:text-xs fill-slate-300 font-bold group-hover:fill-white transition-colors"
                  >
                    {labelToUse}
                  </text>
                </g>
              );
            })}

            {/* Axis Line */}
            <line
              x1={paddingLeft}
              y1={paddingTop + graphHeight}
              x2={chartWidth - paddingRight}
              y2={paddingTop + graphHeight}
              stroke="#64748b"
              strokeWidth="1.5"
            />
          </svg>

          {/* Absolute floating HTML recommendations tooltip */}
          {hoveredIdx !== null && data[hoveredIdx] && (
            <div
              className={`absolute p-3 rounded-xl bg-slate-950/95 border text-left rtl:text-right shadow-2xl backdrop-blur-md z-30 pointer-events-none w-[240px] sm:w-[280px] ${
                data[hoveredIdx].id && weakestIds.includes(data[hoveredIdx].id!)
                  ? 'border-red-500/30 shadow-red-500/5 ring-1 ring-red-500/10'
                  : data[hoveredIdx].value >= 70
                  ? 'border-emerald-500/30'
                  : 'border-amber-500/30'
              }`}
              style={{
                left: tooltipLeft,
                top: tooltipTop,
                transform: `translate(${tooltipXOffset}, ${tooltipYOffset})`,
              }}
            >
              <div className="flex items-center justify-between gap-2 mb-1.5 pb-1.5 border-b border-slate-900">
                <div>
                  <h5 className="text-[10px] font-black text-white">{data[hoveredIdx].label}</h5>
                  <p className="text-[8px] text-slate-500 font-mono">
                    {isRtl ? 'النتيجة الأخيرة:' : 'Latest Score:'}{' '}
                    <strong className="text-amber-500 font-mono text-[10px]">{Math.round(data[hoveredIdx].value)}%</strong>
                  </p>
                  {data[hoveredIdx].previousValue !== undefined && data[hoveredIdx].previousValue !== null && (
                    <p className="text-[8px] text-slate-500 font-mono mt-0.5">
                      {isRtl ? 'المحاولة السابقة:' : 'Previous Attempt:'}{' '}
                      <strong className="text-emerald-400 font-mono text-[10px]">{Math.round(data[hoveredIdx].previousValue!)}%</strong>
                    </p>
                  )}
                  {compareGlobal && data[hoveredIdx].id && (
                    <p className="text-[8px] text-slate-500 font-mono mt-0.5">
                      {isRtl ? 'المعدل العالمي:' : 'Global Average:'}{' '}
                      <strong className="text-indigo-400 font-mono text-[10px]">{GLOBAL_AVERAGES[data[hoveredIdx].id!] || 65}%</strong>
                    </p>
                  )}
                </div>
                {data[hoveredIdx].id && weakestIds.includes(data[hoveredIdx].id!) ? (
                  <span className="flex items-center gap-0.5 bg-red-500/10 text-red-400 text-[7px] font-black uppercase px-1.5 py-0.5 rounded border border-red-500/10 shrink-0">
                    <AlertTriangle className="w-2.5 h-2.5" />
                    <span>{isRtl ? 'أولوية تركيز' : 'Weakest'}</span>
                  </span>
                ) : data[hoveredIdx].value >= 70 ? (
                  <span className="flex items-center gap-0.5 bg-emerald-500/10 text-emerald-400 text-[7px] font-black uppercase px-1.5 py-0.5 rounded border border-emerald-500/10 shrink-0">
                    <CheckCircle2 className="w-2.5 h-2.5" />
                    <span>{isRtl ? 'ممتاز' : 'Passed'}</span>
                  </span>
                ) : (
                  <span className="flex items-center gap-0.5 bg-amber-500/10 text-amber-400 text-[7px] font-black uppercase px-1.5 py-0.5 rounded border border-amber-500/10 shrink-0">
                    <Lightbulb className="w-2.5 h-2.5" />
                    <span>{isRtl ? 'تحتاج تطوير' : 'Needs Work'}</span>
                  </span>
                )}
              </div>

              <div className="space-y-1">
                <p className="text-[9px] font-bold text-slate-300 flex items-center gap-1">
                  <BookOpen className="w-3 h-3 text-amber-500 shrink-0" />
                  <span>
                    {data[hoveredIdx].id && (isRtl 
                      ? STUDY_RECOMMENDATIONS[data[hoveredIdx].id as keyof typeof STUDY_RECOMMENDATIONS]?.titleAr 
                      : STUDY_RECOMMENDATIONS[data[hoveredIdx].id as keyof typeof STUDY_RECOMMENDATIONS]?.titleEn
                    )}
                  </span>
                </p>
                <ul className="space-y-1 pl-3 rtl:pl-0 rtl:pr-3 list-disc text-slate-400 text-[8px] leading-relaxed font-sans font-normal">
                  {data[hoveredIdx].id && (isRtl 
                    ? STUDY_RECOMMENDATIONS[data[hoveredIdx].id as keyof typeof STUDY_RECOMMENDATIONS]?.itemsAr 
                    : STUDY_RECOMMENDATIONS[data[hoveredIdx].id as keyof typeof STUDY_RECOMMENDATIONS]?.itemsEn
                  )?.map((item, idx) => (
                    <li key={idx} className="hover:text-slate-200 transition-colors">
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Legend Block */}
      <div className="flex flex-wrap justify-center items-center gap-4 text-[9px] font-mono font-bold text-slate-500 mt-2" id="bar-legend">
        <span className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded bg-amber-500" />
          <span>{isRtl ? 'النتيجة الأخيرة' : 'Latest Score'}</span>
        </span>
        {hasPreviousScores && (
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full border border-emerald-500 bg-slate-900" />
            <span>{isRtl ? 'المحاولة السابقة' : 'Previous Attempt'}</span>
          </span>
        )}
        {compareGlobal && (
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-0.5 border-t border-dashed border-indigo-400" />
            <span>{isRtl ? 'المعدل العالمي' : 'Global Average'}</span>
          </span>
        )}
      </div>
    </div>
  );
};
