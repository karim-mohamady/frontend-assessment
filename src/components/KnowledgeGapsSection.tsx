/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  AlertTriangle,
  Brain,
  BookOpen,
  ArrowRight,
  Zap,
  CheckCircle2,
  Sparkles,
  TrendingUp,
  RotateCcw,
  ChevronDown,
  ChevronUp,
  Target,
  Flame,
  Layers
} from 'lucide-react';
import { AssessmentResult, QuestionCategory, CareerTrack } from '../types';
import { RevisionItem, REVISION_CATEGORIES } from '../data/revisionData';
import { WeeklyStudyPlanner } from './WeeklyStudyPlanner';

export interface KnowledgeGap {
  id: string;
  category: QuestionCategory;
  categoryNameEn: string;
  categoryNameAr: string;
  topicName: string;
  accuracy: number; // 0 - 100
  severity: 'critical' | 'moderate' | 'minor';
  reasonEn: string;
  reasonAr: string;
  relatedItemsCount: number;
  sampleQuestionEn: string;
  sampleQuestionAr: string;
}

interface KnowledgeGapsSectionProps {
  completedAssessments: AssessmentResult[];
  selectedTrack: CareerTrack;
  allRevisionItems: RevisionItem[];
  onFilterTopic: (topicQuery: string, categoryId?: QuestionCategory) => void;
  onStartQuizForGap: (items: RevisionItem[], gapTitle: string) => void;
  isArabic: boolean;
}

export const KnowledgeGapsSection: React.FC<KnowledgeGapsSectionProps> = ({
  completedAssessments,
  selectedTrack,
  allRevisionItems,
  onFilterTopic,
  onStartQuizForGap,
  isArabic
}) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [dismissedGapIds, setDismissedGapIds] = useState<Set<string>>(new Set());

  // Default curated gap templates per track if user hasn't taken assessments yet or needs guidance
  const defaultTrackGaps: Record<CareerTrack, KnowledgeGap[]> = useMemo(() => {
    return {
      frontend: [
        {
          id: 'gap-react-19',
          category: 'react',
          categoryNameEn: 'React 19 & Hooks',
          categoryNameAr: 'ريأكت والخطافات',
          topicName: 'useActionState & Concurrent Rendering',
          accuracy: 48,
          severity: 'critical',
          reasonEn: 'Inconsistent score on React 19 async transitions and state closures.',
          reasonAr: 'درجات متذبذبة في انتقالات React 19 غير المتزامنة ومفهوم الإغلاقات.',
          relatedItemsCount: 4,
          sampleQuestionEn: 'How does useActionState optimize form pending states without manual useState?',
          sampleQuestionAr: 'كيف يقلل useActionState تعقيد حالات الانتظار دون الحاجة لـ useState إضافية؟'
        },
        {
          id: 'gap-css-flexgrid',
          category: 'css',
          categoryNameEn: 'CSS3 & Layouts',
          categoryNameAr: 'تنسيق CSS3 والشبكات',
          topicName: 'Flexbox Shorthand & Stacking Context',
          accuracy: 62,
          severity: 'moderate',
          reasonEn: 'Mistakes on flex-grow / flex-shrink calculations and z-index isolation.',
          reasonAr: 'أخطاء في حسابات flex-grow وعزل سياق التكديس (z-index).',
          relatedItemsCount: 3,
          sampleQuestionEn: 'Why does z-index fail on child elements with separate stacking contexts?',
          sampleQuestionAr: 'لماذا يفشل z-index على العناصر الابنة مع سياقات تكديس منفصلة؟'
        },
        {
          id: 'gap-js-async',
          category: 'javascript',
          categoryNameEn: 'JavaScript & ES6+',
          categoryNameAr: 'جافا سكريبت والمزامنة',
          topicName: 'Event Loop & Microtasks vs Macrotasks',
          accuracy: 55,
          severity: 'critical',
          reasonEn: 'Need practice on promise execution order vs setTimeout callbacks.',
          reasonAr: 'يحتاج تدريب على ترتيب تنفيذ الـ Promises مقابل setTimeout.',
          relatedItemsCount: 5,
          sampleQuestionEn: 'What is the precise output order of Promise.then vs queueMicrotask?',
          sampleQuestionAr: 'ما هو الترتيب الدقيق لمخرجات Promise.then مقابل queueMicrotask؟'
        }
      ],
      backend: [
        {
          id: 'gap-php-pdo',
          category: 'php',
          categoryNameEn: 'PHP 8.x & OOP',
          categoryNameAr: 'لغة PHP 8 والبرمجة الكائنية',
          topicName: 'PDO Prepared Statements & Injection Prevention',
          accuracy: 50,
          severity: 'critical',
          reasonEn: 'Potential security oversights in raw SQL bindings and transaction handling.',
          reasonAr: 'ثغرات محتملة في ربط المتغيرات يدويًا وإدارة معاملات SQL.',
          relatedItemsCount: 4,
          sampleQuestionEn: 'How do prepared statements prevent SQL injection at the driver level?',
          sampleQuestionAr: 'كيف تمنع البيانات المحضرة هجمات حقن SQL على مستوى محرك قاعدة البيانات؟'
        },
        {
          id: 'gap-laravel-eloquent',
          category: 'laravel',
          categoryNameEn: 'Laravel 11 & Eloquent',
          categoryNameAr: 'لارافيل 11 وعلاقات Eloquent',
          topicName: 'N+1 Query Problem & Eager Loading',
          accuracy: 58,
          severity: 'moderate',
          reasonEn: 'Overlooking with() eager loading causing memory spikes in big collections.',
          reasonAr: 'إغفال الربط المسبق with() مما يسبب استهلاكًا عاليًا للذاكرة.',
          relatedItemsCount: 3,
          sampleQuestionEn: 'How to detect and fix N+1 lazy loading queries using Laravel Telescope?',
          sampleQuestionAr: 'كيف تكتشف وتعالج استعلامات N+1 الكسولة باستخدام Laravel Telescope؟'
        },
        {
          id: 'gap-mysql-indexes',
          category: 'mysql',
          categoryNameEn: 'MySQL & Databases',
          categoryNameAr: 'قواعد بيانات MySQL',
          topicName: 'B-Tree Composite Indexes & Query Optimization',
          accuracy: 64,
          severity: 'moderate',
          reasonEn: 'Incorrect column ordering in multi-column B-Tree indexes.',
          reasonAr: 'ترتيب غير صحيح للأعمدة في الفهارس المركبة B-Tree.',
          relatedItemsCount: 4,
          sampleQuestionEn: 'Why does a composite index (A, B) fail when querying WHERE B = X?',
          sampleQuestionAr: 'لماذا يفشل الفهرس المركب (A, B) عند الاستعلام بشرط WHERE B = X فقط؟'
        }
      ],
      fullstack: [
        {
          id: 'gap-fs-auth',
          category: 'backend',
          categoryNameEn: 'Backend APIs & Auth',
          categoryNameAr: 'هندسة الـ APIs والأمان',
          topicName: 'JWT Refresh Token Rotation & CORS Policy',
          accuracy: 52,
          severity: 'critical',
          reasonEn: 'Security questions regarding token storage and HttpOnly cookies.',
          reasonAr: 'أسئلة الأمان المتعلقة بتخزين التوكن وتدوير مفاتيح JWT.',
          relatedItemsCount: 4,
          sampleQuestionEn: 'Why is HttpOnly flag required for refresh tokens against XSS attacks?',
          sampleQuestionAr: 'لماذا يُشترط تفعيل خاصية HttpOnly لتجنب هجمات XSS على التوكن؟'
        },
        {
          id: 'gap-fs-react',
          category: 'react',
          categoryNameEn: 'React 19 & State',
          categoryNameAr: 'ريأكت وإدارة الحالة',
          topicName: 'useMemo & useCallback Anti-Patterns',
          accuracy: 60,
          severity: 'moderate',
          reasonEn: 'Unnecessary memoization leading to memory overhead.',
          reasonAr: 'التخزين المؤقت الزائد بدون داعٍ مما يؤثر على كفاءة الذاكرة.',
          relatedItemsCount: 3,
          sampleQuestionEn: 'When does overusing useMemo hurt performance instead of improving it?',
          sampleQuestionAr: 'متى يتسبب الإفراط في useMemo في تراجع الأداء بدل تحسينه؟'
        },
        {
          id: 'gap-fs-php',
          category: 'php',
          categoryNameEn: 'PHP 8 & Security',
          categoryNameAr: 'PHP 8 وأمان التطبيقات',
          topicName: 'Constructor Property Promotion & Match Expressions',
          accuracy: 65,
          severity: 'minor',
          reasonEn: 'Modern PHP 8 syntax adoption vs legacy switch patterns.',
          reasonAr: 'استخدام صياغات PHP 8 الحديثة مقابل الأنماط القديمة.',
          relatedItemsCount: 3,
          sampleQuestionEn: 'How does match expression differ strictly from switch in return types?',
          sampleQuestionAr: 'كيف تختلف عبارة match تمامًا عن switch من حيث إرجاع القيم؟'
        }
      ],
      uiux: [
        {
          id: 'gap-uiux-wcag',
          category: 'uiux',
          categoryNameEn: 'UI/UX & Design Systems',
          categoryNameAr: 'تصميم الواجهات ونظم التصميم',
          topicName: 'WCAG 2.1 Contrast & Accessibility Standards',
          accuracy: 54,
          severity: 'critical',
          reasonEn: 'Low scores on color contrast ratios (4.5:1) and focus state indicators.',
          reasonAr: 'درجات منخفضة في نسب تباين الألوان (4.5:1) ومؤشرات التركيز.',
          relatedItemsCount: 3,
          sampleQuestionEn: 'What is the required contrast ratio for standard body text under WCAG AA?',
          sampleQuestionAr: 'ما هي نسبة التباين المطلوبة للنصوص العادية حسب معيار WCAG AA؟'
        },
        {
          id: 'gap-figma-autolayout',
          category: 'figma',
          categoryNameEn: 'Figma & Design Tokens',
          categoryNameAr: 'أداة Figma والمتغيرات',
          topicName: 'Auto-Layout 5.0 Min/Max Constraints',
          accuracy: 61,
          severity: 'moderate',
          reasonEn: 'Errors in responsive frame wrapping and gap distribution.',
          reasonAr: 'أخطاء في التغليف المتجاوب وتوزيع الفراغات.',
          relatedItemsCount: 3,
          sampleQuestionEn: 'How do minimum and maximum width properties prevent broken layouts in Figma?',
          sampleQuestionAr: 'كيف تمنع خاصيتا العرض الأدنى والأقصى انكسار التصميم في Figma؟'
        }
      ],
      web3: [
        {
          id: 'gap-solidity-security',
          category: 'solidity',
          categoryNameEn: 'Solidity & Security',
          categoryNameAr: 'لغة Solidity وأمان العقود',
          topicName: 'Reentrancy Attacks & Checks-Effects-Interactions Pattern',
          accuracy: 45,
          severity: 'critical',
          reasonEn: 'Critical vulnerability detection in state updates after external transfers.',
          reasonAr: 'اكتشاف ثغرات خطيرة في تحديث الحالة بعد التحويلات الخارجية.',
          relatedItemsCount: 4,
          sampleQuestionEn: 'How does nonReentrant modifier protect contract funds during call()?',
          sampleQuestionAr: 'كيف يحمي معدل nonReentrant أموال العقد أثناء استدعاء call()؟'
        },
        {
          id: 'gap-web3-evm',
          category: 'web3',
          categoryNameEn: 'Web3 & EVM',
          categoryNameAr: 'أساسيات Web3 وEVM',
          topicName: 'Gas Optimization & Storage Layout',
          accuracy: 58,
          severity: 'moderate',
          reasonEn: 'High gas consumption patterns in storage vs memory slots.',
          reasonAr: 'أنماط استهلاك الغاز العالي في تخزين Storage مقابل Memory.',
          relatedItemsCount: 3,
          sampleQuestionEn: 'Why packing uint128 variables in a single slot reduces gas fees?',
          sampleQuestionAr: 'لماذا يقلل ضغط متغيرة uint128 في خانة واحدة من رسوم الغاز؟'
        }
      ]
    };
  }, []);

  // Compute active knowledge gaps combining assessment history and default gap templates
  const gapsList = useMemo(() => {
    // 1. Analyze completed assessments if present
    const categoryScores: Record<string, { totalAccuracy: number; count: number; category: QuestionCategory }> = {};

    completedAssessments.forEach(ass => {
      if (!categoryScores[ass.category]) {
        categoryScores[ass.category] = { totalAccuracy: 0, count: 0, category: ass.category };
      }
      categoryScores[ass.category].totalAccuracy += ass.accuracy || ass.percentage || 0;
      categoryScores[ass.category].count += 1;
    });

    const calculatedGaps: KnowledgeGap[] = [];

    // Check categories with avg accuracy < 70%
    Object.entries(categoryScores).forEach(([catKey, data]) => {
      const avg = Math.round(data.totalAccuracy / data.count);
      if (avg < 70) {
        const catMeta = REVISION_CATEGORIES.find(c => c.id === catKey);
        const relatedItems = allRevisionItems.filter(i => i.category === catKey);

        calculatedGaps.push({
          id: `calculated-gap-${catKey}`,
          category: catKey as QuestionCategory,
          categoryNameEn: catMeta?.nameEn || catKey,
          categoryNameAr: catMeta?.nameAr || catKey,
          topicName: catMeta ? (isArabic ? `أساسيات ${catMeta.nameAr}` : `${catMeta.nameEn} Core Concepts`) : catKey,
          accuracy: avg,
          severity: avg < 50 ? 'critical' : avg < 62 ? 'moderate' : 'minor',
          reasonEn: `Your assessment accuracy in ${catMeta?.nameEn || catKey} is currently ${avg}%.`,
          reasonAr: `مستوى الدقة في تقييماتك لـ ${catMeta?.nameAr || catKey} بلغ ${avg}% فقط.`,
          relatedItemsCount: relatedItems.length || 3,
          sampleQuestionEn: relatedItems[0]?.questionTextEn || `Review essential ${catMeta?.nameEn} rules`,
          sampleQuestionAr: relatedItems[0]?.questionTextAr || `راجع القواعد والأساسيات المهمة لـ ${catMeta?.nameAr}`
        });
      }
    });

    // Merge track defaults
    const defaults = defaultTrackGaps[selectedTrack] || defaultTrackGaps.frontend;
    
    // Combine and deduplicate
    const combined = [...calculatedGaps];
    defaults.forEach(def => {
      if (!combined.some(c => c.category === def.category)) {
        combined.push(def);
      }
    });

    // Filter out dismissed
    return combined.filter(g => !dismissedGapIds.has(g.id));
  }, [completedAssessments, selectedTrack, defaultTrackGaps, allRevisionItems, dismissedGapIds, isArabic]);

  if (gapsList.length === 0) {
    return (
      <div className="bg-slate-900/60 border border-emerald-500/30 rounded-3xl p-6 text-center space-y-3 shadow-lg">
        <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center mx-auto border border-emerald-500/20">
          <CheckCircle2 className="w-6 h-6" />
        </div>
        <h4 className="text-base font-bold text-slate-100">
          {isArabic ? 'ممتاز! لا توجد فجوات معرفية حرجة حالياً' : 'Great Job! No Critical Knowledge Gaps Detected'}
        </h4>
        <p className="text-xs text-slate-400 max-w-md mx-auto">
          {isArabic
            ? 'أداؤك متميز ومستواك متناسق عبر كافة الفئات. يمكنك إجراء اختبارات جديدة لتطوير أسلوبك.'
            : 'Your accuracy across review categories is consistent. Keep taking fresh assessments to maintain your edge!'}
        </p>
      </div>
    );
  }

  const handleStartGapQuiz = (gap: KnowledgeGap) => {
    // Get matching revision items for this gap's category/topic
    const items = allRevisionItems.filter(i => i.category === gap.category);
    const finalItems = items.length >= 3 ? items : allRevisionItems;
    onStartQuizForGap(finalItems, isArabic ? gap.categoryNameAr : gap.categoryNameEn);
  };

  const handleDismissGap = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setDismissedGapIds(prev => new Set(prev).add(id));
  };

  return (
    <div className="bg-gradient-to-br from-slate-900 via-slate-900/90 to-slate-950 border border-rose-500/30 rounded-3xl p-5 sm:p-6 shadow-2xl space-y-5">
      
      {/* Header */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-400 flex items-center justify-center shrink-0 shadow-sm animate-pulse">
            <Brain className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base sm:text-lg font-extrabold text-white">
                {isArabic ? 'الفجوات المعرفية والمواضيع الموصى بمراجعتها' : 'Knowledge Gaps & Targeted Study Guide'}
              </h3>
              <span className="px-2.5 py-0.5 rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-400 font-bold text-[11px]">
                {gapsList.length} {isArabic ? 'فجوات مُحددة' : 'Gaps Found'}
              </span>
            </div>
            <p className="text-xs text-slate-400">
              {isArabic 
                ? 'تحليل تلقائي للمواضيع التي تحتاج لتعزيز بناءً على أداء الاختبارات والمراجعات'
                : 'Automated AI identification of weak topics requiring review to raise your readiness score'}
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-all text-xs font-bold flex items-center gap-1"
        >
          {isCollapsed ? (
            <>
              <span>{isArabic ? 'إظهار' : 'Show'}</span>
              <ChevronDown className="w-4 h-4" />
            </>
          ) : (
            <>
              <span>{isArabic ? 'إخفاء' : 'Hide'}</span>
              <ChevronUp className="w-4 h-4" />
            </>
          )}
        </button>
      </div>

      {!isCollapsed && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-1">
          {gapsList.map((gap) => {
            const isCritical = gap.severity === 'critical';
            const isModerate = gap.severity === 'moderate';

            const severityBadge = isCritical
              ? { bg: 'bg-rose-500/10 border-rose-500/30 text-rose-400', labelEn: 'Critical Gap', labelAr: 'فجوة حرجة' }
              : isModerate
              ? { bg: 'bg-amber-500/10 border-amber-500/30 text-amber-400', labelEn: 'Moderate Gap', labelAr: 'فجوة متوسطة' }
              : { bg: 'bg-blue-500/10 border-blue-500/30 text-blue-400', labelEn: 'Minor Gap', labelAr: 'تحسين طفيف' };

            return (
              <div
                key={gap.id}
                className="bg-slate-950/80 border border-slate-800/90 hover:border-slate-700 rounded-2xl p-4 flex flex-col justify-between space-y-4 transition-all hover:shadow-xl group relative overflow-hidden"
              >
                {/* Top Bar */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${severityBadge.bg}`}>
                      {isArabic ? severityBadge.labelAr : severityBadge.labelEn}
                    </span>

                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-black text-rose-400 font-mono">
                        {gap.accuracy}% {isArabic ? 'دقة' : 'Acc.'}
                      </span>
                      <button
                        onClick={(e) => handleDismissGap(gap.id, e)}
                        className="text-slate-500 hover:text-slate-300 text-[10px] px-1.5 py-0.5 rounded hover:bg-slate-800 transition-colors"
                        title={isArabic ? 'إخفاء هذه الفجوة' : 'Dismiss gap'}
                      >
                        ✕
                      </button>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-xs text-slate-400 font-bold uppercase tracking-wider">
                      {isArabic ? gap.categoryNameAr : gap.categoryNameEn}
                    </h4>
                    <p className="text-sm font-extrabold text-white group-hover:text-amber-300 transition-colors line-clamp-1">
                      {gap.topicName}
                    </p>
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed bg-slate-900/80 p-2.5 rounded-xl border border-slate-800/60">
                    {isArabic ? gap.reasonAr : gap.reasonEn}
                  </p>

                  <div className="pt-1">
                    <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1">
                      <Target className="w-3 h-3" />
                      {isArabic ? 'سؤال عيّنة موصى بمراجعته:' : 'Sample Review Question:'}
                    </span>
                    <p className="text-xs font-semibold text-slate-200 line-clamp-2 mt-1 italic">
                      "{isArabic ? gap.sampleQuestionAr : gap.sampleQuestionEn}"
                    </p>
                  </div>
                </div>

                {/* Card Action Buttons */}
                <div className="pt-2 border-t border-slate-800/80 flex items-center gap-2">
                  <button
                    onClick={() => onFilterTopic(gap.topicName.split(' ')[0], gap.category)}
                    className="flex-1 py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold border border-slate-700/80 transition-all flex items-center justify-center gap-1.5"
                  >
                    <BookOpen className="w-3.5 h-3.5 text-amber-400" />
                    <span>{isArabic ? 'مراجعة الكارت' : 'Review Cards'}</span>
                  </button>

                  <button
                    onClick={() => handleStartGapQuiz(gap)}
                    className="py-2 px-3 rounded-xl bg-rose-500/15 hover:bg-rose-500/25 border border-rose-500/40 text-rose-300 hover:text-rose-200 text-xs font-bold transition-all flex items-center justify-center gap-1"
                    title={isArabic ? 'اختبار مكثف في هذه الفجوة' : 'Quick quiz on this gap'}
                  >
                    <Zap className="w-3.5 h-3.5 fill-rose-400 text-rose-400" />
                    <span>{isArabic ? 'اختبار' : 'Quiz'}</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Integrated Weekly Study Planner */}
        <div className="pt-2">
          <WeeklyStudyPlanner
            gaps={gapsList}
            selectedTrack={selectedTrack}
            allRevisionItems={allRevisionItems}
            onFilterTopic={onFilterTopic}
            onStartQuizForGap={onStartQuizForGap}
            isArabic={isArabic}
          />
        </div>
      </div>
    )}
  </div>
);
};

export default KnowledgeGapsSection;
