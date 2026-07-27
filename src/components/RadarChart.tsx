/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { motion, AnimatePresence } from 'motion/react';
import { BookOpen, AlertTriangle, Lightbulb, CheckCircle2 } from 'lucide-react';

interface ChartDataPoint {
  id: string;
  label: string;
  value: number;
  previousValue?: number | null;
  avgValue?: number;
  color: string;
  count: number;
}

interface RadarChartProps {
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

export const RadarChart: React.FC<RadarChartProps> = ({ data, compareGlobal = false }) => {
  const { lang, isRtl } = useApp();
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const width = 450;
  const height = 400;
  const cx = width / 2;
  const cy = height / 2 - 10;
  const r = 135; // Maximum radius for 100%

  const levels = [20, 40, 60, 80, 100];
  const numPoints = data.length;

  // Identify dynamic weakest categories
  const sortedData = [...data].sort((a, b) => a.value - b.value);
  const weakestIds = sortedData.slice(0, 2).map((item) => item.id);

  // Calculate coordinates for a given value (0-100) and category index
  const getCoordinates = (index: number, value: number) => {
    // Top is 0, angle increases clockwise
    const angle = (index * 2 * Math.PI) / numPoints - Math.PI / 2;
    const currentRadius = (value / 100) * r;
    const x = cx + currentRadius * Math.cos(angle);
    const y = cy + currentRadius * Math.sin(angle);
    return { x, y, angle };
  };

  // Generate the polygon path for the user's current scores
  const scorePoints = data.map((item, idx) => getCoordinates(idx, item.value));
  const polygonPath = scorePoints.map(p => `${p.x},${p.y}`).join(' ');

  // Generate the previous score polygon vertices and path
  const hasPreviousScores = data.some(item => item.previousValue !== undefined && item.previousValue !== null);
  const previousPoints = data.map((item, idx) => getCoordinates(idx, item.previousValue !== undefined && item.previousValue !== null ? item.previousValue : item.value));
  const previousPath = previousPoints.map(p => `${p.x},${p.y}`).join(' ');

  // Generate the global average polygon vertices and path
  const globalPoints = data.map((item, idx) => getCoordinates(idx, GLOBAL_AVERAGES[item.id] || 65));
  const globalPath = globalPoints.map(p => `${p.x},${p.y}`).join(' ');

  // Average line for reference (e.g., 70% passing threshold or just general visual benchmark)
  const referencePoints = data.map((_, idx) => getCoordinates(idx, 70));
  const referencePath = referencePoints.map(p => `${p.x},${p.y}`).join(' ');

  const hoveredPoint = hoveredIndex !== null ? getCoordinates(hoveredIndex, data[hoveredIndex].value) : null;
  const tooltipXOffset = hoveredPoint ? (hoveredPoint.x > cx ? '-105%' : '5%') : '0%';
  const tooltipYOffset = hoveredPoint ? (hoveredPoint.y > cy ? '-105%' : '5%') : '0%';

  return (
    <div className="relative w-full flex flex-col items-center bg-slate-950/40 p-4 sm:p-6 rounded-2xl border border-slate-900/50" id="radar-chart-wrapper">
      
      {/* Chart Title / Interactive State details */}
      <div className="w-full flex justify-between items-center mb-4 min-h-[48px]" id="radar-header">
        <div className="text-left rtl:text-right">
          <h4 className="text-xs font-black uppercase text-amber-500 tracking-wider">
            {isRtl ? 'خريطة مهارات المطور' : 'Developer Skill Radar'}
          </h4>
          <p className="text-[10px] text-slate-500 font-mono">
            {isRtl ? 'مؤشرات الأداء المتوازي للمهارات الستة' : 'Hexagonal parallel competency metrics'}
          </p>
        </div>

        {/* Hover Status Box */}
        <AnimatePresence mode="wait">
          {hoveredIndex !== null ? (
            <motion.div
              key={hoveredIndex}
              initial={{ opacity: 0, x: isRtl ? -10 : 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: isRtl ? -10 : 10 }}
              className="text-right rtl:text-left bg-slate-900/90 border border-slate-800 px-3 py-1.5 rounded-xl flex items-center gap-3.5"
            >
              <div className="text-left rtl:text-right">
                <p className="text-xs font-black text-white">{data[hoveredIndex].label}</p>
                <p className="text-[9px] text-slate-500 font-mono">
                  {isRtl ? `${data[hoveredIndex].count} تقييم مكتمل` : `${data[hoveredIndex].count} tests taken`}
                </p>
              </div>
              <div className="h-8 w-[1px] bg-slate-800" />
              <div className="flex flex-col items-center">
                <span className="text-base font-black text-amber-500 font-mono">{Math.round(data[hoveredIndex].value)}%</span>
                <span className="text-[8px] font-mono uppercase text-slate-400">
                  {data[hoveredIndex].value >= 85 ? (isRtl ? 'خبير' : 'Expert') :
                   data[hoveredIndex].value >= 70 ? (isRtl ? 'كفء' : 'Passed') :
                   data[hoveredIndex].value > 0 ? (isRtl ? 'مبتدئ' : 'Novice') : (isRtl ? 'لم يبدأ' : 'No Try')}
                </span>
              </div>
              {data[hoveredIndex].previousValue !== null && data[hoveredIndex].previousValue !== undefined && (
                <>
                  <div className="h-8 w-[1px] bg-slate-800" />
                  <div className="flex flex-col items-center">
                    <span className="text-base font-black text-emerald-400 font-mono">
                      {Math.round(data[hoveredIndex].previousValue!)}%
                    </span>
                    <span className="text-[8px] font-mono uppercase text-emerald-400 flex items-center gap-0.5">
                      {isRtl ? 'السابق' : 'Prev'}
                      <span className={`text-[8px] ${
                        data[hoveredIndex].value >= data[hoveredIndex].previousValue! 
                          ? 'text-emerald-400' 
                          : 'text-red-400'
                      }`}>
                        {data[hoveredIndex].value >= data[hoveredIndex].previousValue! ? '▲' : '▼'}
                      </span>
                    </span>
                  </div>
                </>
              )}
              {compareGlobal && (
                <>
                  <div className="h-8 w-[1px] bg-slate-800" />
                  <div className="flex flex-col items-center">
                    <span className="text-base font-black text-indigo-400 font-mono">{GLOBAL_AVERAGES[data[hoveredIndex].id] || 65}%</span>
                    <span className="text-[8px] font-mono uppercase text-indigo-400">
                      {isRtl ? 'العالمي' : 'Global'}
                    </span>
                  </div>
                </>
              )}
            </motion.div>
          ) : (
            <div className="text-right rtl:text-left hidden sm:block text-[10px] text-slate-500 font-mono italic">
              {isRtl ? 'مرر الماوس فوق النقاط لعرض التفاصيل 🧭' : 'Hover over nodes to explore skills 🧭'}
            </div>
          )}
        </AnimatePresence>
      </div>

      <div className="w-full max-w-[380px] sm:max-w-[420px] aspect-square relative select-none">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full h-full font-sans overflow-visible"
          id="radar-chart-svg"
        >
          <defs>
            {/* Area gradient */}
            <radialGradient id="radarGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.35" />
              <stop offset="80%" stopColor="#f59e0b" stopOpacity="0.08" />
              <stop offset="100%" stopColor="#f59e0b" stopOpacity="0" />
            </radialGradient>
            
            <linearGradient id="polyGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#fbbf24" stopOpacity="0.1" />
            </linearGradient>

            {/* Glowing filter */}
            <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* 1. Level grid hexagons (20%, 40%, 60%, 80%, 100%) */}
          {levels.map((level) => {
            const levelPoints = data.map((_, idx) => getCoordinates(idx, level));
            const pathString = levelPoints.map(p => `${p.x},${p.y}`).join(' ');
            return (
              <g key={level} className="opacity-40">
                <polygon
                  points={pathString}
                  fill="none"
                  stroke="#334155"
                  strokeWidth="1"
                  strokeDasharray={level === 100 ? 'none' : '3 3'}
                />
                {/* Level Percentage markers on top axis */}
                <text
                  x={cx}
                  y={cy - (level / 100) * r + 10}
                  textAnchor="middle"
                  className="text-[9px] fill-slate-600 font-mono font-bold"
                >
                  {level}%
                </text>
              </g>
            );
          })}

          {/* 2. Axis lines from center to outer vertices */}
          {data.map((item, idx) => {
            const outer = getCoordinates(idx, 100);
            return (
              <line
                key={`axis-${idx}`}
                x1={cx}
                y1={cy}
                x2={outer.x}
                y2={outer.y}
                stroke="#1e293b"
                strokeWidth="1.5"
                className="opacity-80"
              />
            );
          })}

          {/* 3. Shaded Reference Area (e.g. 70% Benchmark passing line) */}
          <polygon
            points={referencePath}
            fill="none"
            stroke="#475569"
            strokeWidth="1.2"
            strokeDasharray="4 4"
            className="opacity-40"
          />

          {/* Comparative Global Average Area polygon */}
          {compareGlobal && globalPoints.length > 0 && (
            <polygon
              points={globalPath}
              fill="none"
              stroke="#818cf8"
              strokeWidth="2"
              strokeDasharray="4 4"
              className="transition-all duration-500 ease-in-out opacity-80"
            />
          )}

          {/* Comparative Previous Average/Attempt Area polygon */}
          {hasPreviousScores && previousPoints.length > 0 && (
            <polygon
              points={previousPath}
              fill="none"
              stroke="#10b981"
              strokeWidth="2"
              strokeDasharray="3 3"
              className="transition-all duration-500 ease-in-out opacity-80"
            />
          )}

          {/* 4. Main User score area polygon with glowing outline */}
          {scorePoints.length > 0 && (
            <>
              <polygon
                points={polygonPath}
                fill="url(#polyGrad)"
                stroke="#f59e0b"
                strokeWidth="2.5"
                filter="url(#glow)"
                className="transition-all duration-500 ease-in-out"
              />
            </>
          )}

          {/* 5. Category vertices text labels */}
          {data.map((item, idx) => {
            const outer = getCoordinates(idx, 118);
            const labelToUse = SHORT_LABELS[item.id]
              ? (lang === 'ar' ? SHORT_LABELS[item.id].ar : (lang === 'es' ? SHORT_LABELS[item.id].es : SHORT_LABELS[item.id].en))
              : item.label;

            let anchor = 'middle';
            if (outer.x < cx - 10) anchor = 'end';
            if (outer.x > cx + 10) anchor = 'start';

            // Fine-tune label coordinates
            const yOffset = outer.y > cy ? 4 : -2;

            const isHovered = hoveredIndex === idx;

            return (
              <g 
                key={`label-${idx}`}
                className="cursor-pointer"
                onMouseEnter={() => setHoveredIndex(idx)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                <text
                  x={outer.x}
                  y={outer.y + yOffset}
                  textAnchor={anchor}
                  className={`text-[11px] font-extrabold transition-all duration-200 select-none ${
                    isHovered ? 'fill-amber-400 scale-105' : 'fill-slate-300'
                  }`}
                >
                  {labelToUse}
                </text>
              </g>
            );
          })}

          {/* 6. Active Nodes & Tooltip hover trigger targets */}
          {data.map((item, idx) => {
            const p = getCoordinates(idx, item.value);
            const isHovered = hoveredIndex === idx;

            return (
              <g
                key={`node-${idx}`}
                className="cursor-pointer"
                onMouseEnter={() => setHoveredIndex(idx)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                {/* Floating glow under active node */}
                {isHovered && (
                  <circle
                    cx={p.x}
                    cy={p.y}
                    r="12"
                    fill="#f59e0b"
                    fillOpacity="0.25"
                    className="animate-ping"
                  />
                )}

                {/* Outer colored border */}
                <circle
                  cx={p.x}
                  cy={p.y}
                  r={isHovered ? '7' : '4'}
                  fill={isHovered ? '#fff' : item.color}
                  stroke={isHovered ? '#f59e0b' : '#0f172a'}
                  strokeWidth="2.5"
                  className="transition-all duration-200 ease-out"
                />

                {/* Larger transparent hover capture circle */}
                <circle
                  cx={p.x}
                  cy={p.y}
                  r="24"
                  fill="transparent"
                />
              </g>
            );
          })}

          {/* Center visual dot */}
          <circle cx={cx} cy={cy} r="4" fill="#475569" className="opacity-80" />
        </svg>

        {/* Absolute floating study recommendations tooltip */}
        <AnimatePresence>
          {hoveredIndex !== null && hoveredPoint && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              className={`absolute p-3 rounded-xl bg-slate-950/95 border text-left rtl:text-right shadow-2xl backdrop-blur-md z-30 pointer-events-none w-[240px] sm:w-[280px] ${
                weakestIds.includes(data[hoveredIndex].id)
                  ? 'border-red-500/30 shadow-red-500/5 ring-1 ring-red-500/10'
                  : data[hoveredIndex].value >= 70
                  ? 'border-emerald-500/30'
                  : 'border-amber-500/30'
              }`}
              style={{
                left: `${(hoveredPoint.x / width) * 100}%`,
                top: `${(hoveredPoint.y / height) * 100}%`,
                transform: `translate(${tooltipXOffset}, ${tooltipYOffset})`,
              }}
            >
              <div className="flex items-center justify-between gap-2 mb-1.5 pb-1.5 border-b border-slate-900">
                <div>
                  <h5 className="text-[10px] font-black text-white">{data[hoveredIndex].label}</h5>
                  <p className="text-[8px] text-slate-500 font-mono">
                    {isRtl ? 'النتيجة الأخيرة:' : 'Latest Score:'}{' '}
                    <strong className="text-amber-500 font-mono text-[10px]">{Math.round(data[hoveredIndex].value)}%</strong>
                  </p>
                  {data[hoveredIndex].previousValue !== undefined && data[hoveredIndex].previousValue !== null && (
                    <p className="text-[8px] text-slate-500 font-mono mt-0.5">
                      {isRtl ? 'المحاولة السابقة:' : 'Previous Attempt:'}{' '}
                      <strong className="text-emerald-400 font-mono text-[10px]">{Math.round(data[hoveredIndex].previousValue!)}%</strong>
                    </p>
                  )}
                  {compareGlobal && (
                    <p className="text-[8px] text-slate-500 font-mono mt-0.5">
                      {isRtl ? 'المعدل العالمي:' : 'Global Average:'}{' '}
                      <strong className="text-indigo-400 font-mono text-[10px]">{GLOBAL_AVERAGES[data[hoveredIndex].id] || 65}%</strong>
                    </p>
                  )}
                </div>
                {weakestIds.includes(data[hoveredIndex].id) ? (
                  <span className="flex items-center gap-0.5 bg-red-500/10 text-red-400 text-[7px] font-black uppercase px-1.5 py-0.5 rounded border border-red-500/10 shrink-0">
                    <AlertTriangle className="w-2.5 h-2.5" />
                    <span>{isRtl ? 'أولوية تركيز' : 'Weakest'}</span>
                  </span>
                ) : data[hoveredIndex].value >= 70 ? (
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
                  <span>{isRtl ? STUDY_RECOMMENDATIONS[data[hoveredIndex].id as keyof typeof STUDY_RECOMMENDATIONS]?.titleAr : STUDY_RECOMMENDATIONS[data[hoveredIndex].id as keyof typeof STUDY_RECOMMENDATIONS]?.titleEn}</span>
                </p>
                <ul className="space-y-1 pl-3 rtl:pl-0 rtl:pr-3 list-disc text-slate-400 text-[8px] leading-relaxed font-sans">
                  {(isRtl ? STUDY_RECOMMENDATIONS[data[hoveredIndex].id as keyof typeof STUDY_RECOMMENDATIONS]?.itemsAr : STUDY_RECOMMENDATIONS[data[hoveredIndex].id as keyof typeof STUDY_RECOMMENDATIONS]?.itemsEn)?.map((item, idx) => (
                    <li key={idx} className="hover:text-slate-200 transition-colors">
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Legend Panel overlay inside radar */}
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex flex-wrap justify-center items-center gap-3 text-[9px] font-mono font-bold text-slate-500 bg-slate-950/85 border border-slate-900 px-3 py-1 rounded-full backdrop-blur-sm shadow-md" id="radar-legend-panel">
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded bg-amber-500 border border-amber-400 animate-pulse" />
            <span>{isRtl ? 'النتيجة الأخيرة' : 'Latest'}</span>
          </span>
          {hasPreviousScores && (
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-0.5 border-t border-dashed border-emerald-500" />
              <span>{isRtl ? 'المحاولة السابقة' : 'Previous'}</span>
            </span>
          )}
          {compareGlobal && (
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-0.5 border-t border-dashed border-indigo-500" />
              <span>{isRtl ? 'المعدل العالمي' : 'Global Avg'}</span>
            </span>
          )}
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-0.5 border-t border-dashed border-slate-500" />
            <span>{isRtl ? 'حد النجاح (70%)' : 'Passing (70%)'}</span>
          </span>
        </div>
      </div>
    </div>
  );
};
