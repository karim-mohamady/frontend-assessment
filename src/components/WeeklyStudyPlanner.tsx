/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Calendar,
  CheckCircle2,
  Circle,
  Clock,
  Sparkles,
  Zap,
  BookOpen,
  RotateCcw,
  Award,
  ChevronDown,
  ChevronUp,
  Target,
  Flame,
  Check,
  TrendingUp,
  Sliders,
  CheckSquare
} from 'lucide-react';
import { KnowledgeGap } from './KnowledgeGapsSection';
import { RevisionItem } from '../data/revisionData';
import { CareerTrack, QuestionCategory } from '../types';
import { useApp } from '../context/AppContext';

export interface DailyScheduleItem {
  dayNumber: number;
  dayNameEn: string;
  dayNameAr: string;
  focusGapId?: string;
  category: QuestionCategory;
  categoryNameEn: string;
  categoryNameAr: string;
  topicTitleEn: string;
  topicTitleAr: string;
  estimatedMinutes: number;
  taskTypeEn: string;
  taskTypeAr: string;
  descriptionEn: string;
  descriptionAr: string;
  tasksEn: string[];
  tasksAr: string[];
}

interface WeeklyStudyPlannerProps {
  gaps: KnowledgeGap[];
  selectedTrack: CareerTrack;
  allRevisionItems: RevisionItem[];
  onFilterTopic: (topicQuery: string, categoryId?: QuestionCategory) => void;
  onStartQuizForGap: (items: RevisionItem[], gapTitle: string) => void;
  isArabic: boolean;
}

export const WeeklyStudyPlanner: React.FC<WeeklyStudyPlannerProps> = ({
  gaps,
  selectedTrack,
  allRevisionItems,
  onFilterTopic,
  onStartQuizForGap,
  isArabic
}) => {
  const { addXp } = useApp();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [viewMode, setViewMode] = useState<'cards' | 'timeline'>('cards');

  // Track completed days in local state + localStorage
  const storageKey = `weekly_plan_completed_${selectedTrack}`;
  const [completedDays, setCompletedDays] = useState<number[]>(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(completedDays));
  }, [completedDays, storageKey]);

  // Generate 7-day suggested schedule based on the identified knowledge gaps
  const schedule: DailyScheduleItem[] = useMemo(() => {
    const defaultGap1 = gaps[0] || {
      category: 'react' as QuestionCategory,
      categoryNameEn: 'Frontend Core',
      categoryNameAr: 'أساسيات واجهة المستخدم',
      topicName: 'Component Lifecycle & Performance'
    };
    const defaultGap2 = gaps[1] || gaps[0] || {
      category: 'javascript' as QuestionCategory,
      categoryNameEn: 'Async JavaScript',
      categoryNameAr: 'البرمجة غير المتزامنة',
      topicName: 'Promises, Async/Await & Event Loop'
    };
    const defaultGap3 = gaps[2] || gaps[0] || {
      category: 'css' as QuestionCategory,
      categoryNameEn: 'Styling & Architecture',
      categoryNameAr: 'الهندسة والتنسيق',
      topicName: 'CSS Grid & Responsive Design'
    };

    return [
      {
        dayNumber: 1,
        dayNameEn: 'Day 1 • Priority Deep Dive',
        dayNameAr: 'اليوم الأول • تركيز أولي مكثف',
        focusGapId: defaultGap1.id,
        category: defaultGap1.category,
        categoryNameEn: defaultGap1.categoryNameEn,
        categoryNameAr: defaultGap1.categoryNameAr,
        topicTitleEn: defaultGap1.topicName,
        topicTitleAr: defaultGap1.topicName,
        estimatedMinutes: 20,
        taskTypeEn: 'Critical Gap Review',
        taskTypeAr: 'مراجعة الفجوة الأكثر أهمية',
        descriptionEn: 'Focus on understanding core concepts & resolving weak points in your primary gap.',
        descriptionAr: 'التركيز على فهم المفاهيم الأساسية وسد الفجوة البرمجية الأولى.',
        tasksEn: ['Review 4 key concept flashcards', 'Study code snippets and edge cases', 'Complete 3-question quick quiz'],
        tasksAr: ['مراجعة 4 كروت مفاهيم رئيسية', 'دراسة أمثلة الكود والحالات الخاصة', 'إجراء اختبار سريع من 3 أسئلة']
      },
      {
        dayNumber: 2,
        dayNameEn: 'Day 2 • Practical Code Syntax',
        dayNameAr: 'اليوم الثاني • التطبيق البرمجي العملي',
        focusGapId: defaultGap2.id,
        category: defaultGap2.category,
        categoryNameEn: defaultGap2.categoryNameEn,
        categoryNameAr: defaultGap2.categoryNameAr,
        topicTitleEn: defaultGap2.topicName,
        topicTitleAr: defaultGap2.topicName,
        estimatedMinutes: 15,
        taskTypeEn: 'Syntax & Implementation',
        taskTypeAr: 'تطبيق التراكيب البرمجية',
        descriptionEn: 'Practice implementing clean patterns and inspecting syntax variations.',
        descriptionAr: 'التدريب على كتابة الأنماط النظيفة ومراجعة تراكيب الكود.',
        tasksEn: ['Inspect 3 practical code examples', 'Self-test hidden answers in review cards', 'Identify common bug patterns'],
        tasksAr: ['فحص 3 أمثلة برمجية عملية', 'اختبار نفسك عبر إخفاء الإجابات', 'اكتشاف الأخطاء الشائعة وطرق تفاديها']
      },
      {
        dayNumber: 3,
        dayNameEn: 'Day 3 • Secondary Gap Mastery',
        dayNameAr: 'اليوم الثالث • إتقان الفجوة الثانية',
        focusGapId: defaultGap3.id,
        category: defaultGap3.category,
        categoryNameEn: defaultGap3.categoryNameEn,
        categoryNameAr: defaultGap3.categoryNameAr,
        topicTitleEn: defaultGap3.topicName,
        topicTitleAr: defaultGap3.topicName,
        estimatedMinutes: 20,
        taskTypeEn: 'Active Recall',
        taskTypeAr: 'الاسترجاع النشط للذاكرة',
        descriptionEn: 'Strengthen mental retention of secondary weak topics with flashcards.',
        descriptionAr: 'تعزيز الذاكرة واسترجاع التفكير البرمجي في المواضيع الفرعية.',
        tasksEn: ['Perform active recall test on 5 cards', 'Bookmark challenging cards for weekend', 'Earn +15 XP on review quiz'],
        tasksAr: ['إجراء اختبار استرجاع لـ 5 كروت', 'حفظ الكروت المعقدة للمراجعة لاحقاً', 'كسب 15+ نقطة خبرة في الكويز']
      },
      {
        dayNumber: 4,
        dayNameEn: 'Day 4 • Mid-Week Checkpoint',
        dayNameAr: 'اليوم الرابع • تقييم منتصف الأسبوع',
        category: defaultGap1.category,
        categoryNameEn: defaultGap1.categoryNameEn,
        categoryNameAr: defaultGap1.categoryNameAr,
        topicTitleEn: `Combined Review: ${defaultGap1.topicName}`,
        topicTitleAr: `مراجعة مشتركة: ${defaultGap1.topicName}`,
        estimatedMinutes: 15,
        taskTypeEn: 'Reinforcement Quiz',
        taskTypeAr: 'اختبار تثبيت المعلومات',
        descriptionEn: 'Consolidate learning from Day 1 & 2 to ensure long-term memory retention.',
        descriptionAr: 'دمج معلومات اليوم الأول والثاني لضمان تثبيت المفاهيم في الذاكرة طويلة المدى.',
        tasksEn: ['Take Quick Topic Quiz across weak areas', 'Analyze wrong answers and review notes', 'Mark mastered questions'],
        tasksAr: ['إجراء اختبار سريع شامل للفجوات', 'تحليل الأسئلة الخاطئة وتدوينها', 'تحديد الكروت المُتقنة']
      },
      {
        dayNumber: 5,
        dayNameEn: 'Day 5 • Advanced Architecture',
        dayNameAr: 'اليوم الخامس • المفاهيم المتقدمة والهندسة',
        focusGapId: defaultGap2.id,
        category: defaultGap2.category,
        categoryNameEn: defaultGap2.categoryNameEn,
        categoryNameAr: defaultGap2.categoryNameAr,
        topicTitleEn: defaultGap2.topicName,
        topicTitleAr: defaultGap2.topicName,
        estimatedMinutes: 25,
        taskTypeEn: 'System Design & Best Practices',
        taskTypeAr: 'أفضل الممارسات وبناء الأنظمة',
        descriptionEn: 'Explore real-world engineering trade-offs and performance optimization.',
        descriptionAr: 'استكشاف المقايضات الهندسية وتحسين كفاءة وأداء التطبيقات.',
        tasksEn: ['Read advanced explanations & edge cases', 'Study architecture trade-offs', 'Practice mental interview responses'],
        tasksAr: ['قراءة الشروحات المتقدمة والحالات الاستثنائية', 'دراسة خيارات البناء الهندسي', 'التدريب على إجابات المقابلات الفنية']
      },
      {
        dayNumber: 6,
        dayNameEn: 'Day 6 • Rapid Recall Blitz',
        dayNameAr: 'اليوم السادس • جولة التذكر السريع',
        category: defaultGap3.category,
        categoryNameEn: defaultGap3.categoryNameEn,
        categoryNameAr: defaultGap3.categoryNameAr,
        topicTitleEn: `Speed Review: ${defaultGap3.topicName}`,
        topicTitleAr: `مراجعة خاطفة: ${defaultGap3.topicName}`,
        estimatedMinutes: 15,
        taskTypeEn: 'Speed Drill',
        taskTypeAr: 'تدريب سرعة البديهة',
        descriptionEn: 'Test speed and precision on bookmarked & flagged revision cards.',
        descriptionAr: 'اختبار الدقة وسرعة البديهة على الكروت المحفوظة والمُفضلة.',
        tasksEn: ['Review all bookmarked revision items', 'Toggle self-testing mode to reveal answers', 'Clean up resolved bookmarked items'],
        tasksAr: ['مراجعة كافة الكروت المحفوظة', 'تفعيل وضع التقييم الذاتي للتحقق', 'تحديث القائمة وإزالة ما تم إتقانه']
      },
      {
        dayNumber: 7,
        dayNameEn: 'Day 7 • Weekly Assessment Benchmark',
        dayNameAr: 'اليوم السابع • اختبار الجاهزية الأسبوعي',
        category: defaultGap1.category,
        categoryNameEn: 'Full Track Evaluation',
        categoryNameAr: 'تقييم شامل للمسار البرمجي',
        topicTitleEn: `${selectedTrack.toUpperCase()} Career Track Comprehensive Check`,
        topicTitleAr: `اختبار الجاهزية الشامل لمسار ${selectedTrack.toUpperCase()}`,
        estimatedMinutes: 30,
        taskTypeEn: 'Full Mock Practice',
        taskTypeAr: 'اختبار الجاهزية التقييمي',
        descriptionEn: 'Validate your progress by running a complete assessment mock and measuring gap closure.',
        descriptionAr: 'التحقق النهائي من نمو مستواك وإغلاق الفجوات عبر إجراء تقييم كامل.',
        tasksEn: ['Take comprehensive track assessment', 'Compare new accuracy with baseline', 'Claim weekly completion badge & +100 XP'],
        tasksAr: ['إجراء التقييم الشامل للمسار', 'مقارنة نسبة الدقة الجديدة بالسابقة', 'الحصول على شارة الإنجاز و+100 XP']
      }
    ];
  }, [gaps, selectedTrack]);

  const toggleDayComplete = (dayNumber: number) => {
    if (completedDays.includes(dayNumber)) {
      setCompletedDays(prev => prev.filter(d => d !== dayNumber));
    } else {
      setCompletedDays(prev => [...prev, dayNumber]);
      addXp(25); // Reward +25 XP per study day completed!
    }
  };

  const handleResetSchedule = () => {
    setCompletedDays([]);
  };

  const completionPercentage = Math.round((completedDays.length / 7) * 100);

  return (
    <div className="bg-gradient-to-br from-slate-900 via-slate-900/95 to-slate-950 border border-amber-500/30 rounded-3xl p-5 sm:p-6 shadow-2xl space-y-6">
      
      {/* Top Banner Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800/80">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center shrink-0 shadow-md">
            <Calendar className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base sm:text-xl font-extrabold text-white">
                {isArabic ? 'خطة الدراسة والمراجعة الأسبوعية الذكية' : 'Smart Weekly Review Schedule'}
              </h3>
              <span className="px-2.5 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-[11px] font-bold">
                {isArabic ? 'مخصصة للفجوات' : 'Gap-Targeted'}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              {isArabic
                ? 'جدول يومي متوازن ومصمم تلقائياً لسد الفجوات البرمجية المكتشفة وتوزيع جهد المراجعة'
                : 'Automated 7-day personalized study guide tailored to close identified knowledge gaps'}
            </p>
          </div>
        </div>

        {/* Action Controls & Toggle Views */}
        <div className="flex items-center gap-2 self-end sm:self-center">
          <button
            onClick={() => setViewMode(viewMode === 'cards' ? 'timeline' : 'cards')}
            className="px-3 py-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 text-xs font-bold border border-slate-700/80 transition-all flex items-center gap-1.5"
          >
            <Sliders className="w-3.5 h-3.5 text-amber-400" />
            <span>{viewMode === 'cards' ? (isArabic ? 'عرض الجدول' : 'Timeline View') : (isArabic ? 'عرض الكروت' : 'Cards View')}</span>
          </button>

          {completedDays.length > 0 && (
            <button
              onClick={handleResetSchedule}
              className="px-3 py-1.5 rounded-xl bg-slate-800/80 hover:bg-rose-500/20 text-slate-400 hover:text-rose-300 text-xs font-bold border border-slate-700/80 transition-all flex items-center gap-1.5"
              title={isArabic ? 'إعادة ضبط الأسبوع' : 'Reset weekly progress'}
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>{isArabic ? 'إعادة ضبط' : 'Reset'}</span>
            </button>
          )}

          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-all"
          >
            {isCollapsed ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {!isCollapsed && (
        <div className="space-y-6">
          {/* Progress Indicator */}
          <div className="bg-slate-950/80 border border-slate-800 p-4 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center font-black text-sm shrink-0">
                {completionPercentage}%
              </div>
              <div className="space-y-1 flex-1">
                <div className="flex items-center justify-between text-xs font-bold">
                  <span className="text-slate-200">
                    {isArabic ? `إنجاز الأسبوع: ${completedDays.length} من أصل 7 أيام` : `Weekly Completion: ${completedDays.length} / 7 Days`}
                  </span>
                  <span className="text-amber-400 font-mono text-[11px] flex items-center gap-1">
                    <Sparkles className="w-3 h-3" />
                    +{completedDays.length * 25} XP
                  </span>
                </div>
                <div className="w-full sm:w-64 h-2 bg-slate-900 rounded-full overflow-hidden border border-slate-800">
                  <div
                    className="h-full bg-gradient-to-r from-amber-500 to-amber-400 transition-all duration-500"
                    style={{ width: `${completionPercentage}%` }}
                  />
                </div>
              </div>
            </div>

            <div className="text-xs text-slate-400 flex items-center gap-2">
              <Flame className="w-4 h-4 text-amber-500" />
              <span>
                {isArabic
                  ? 'إكمال الجلسة اليومية يمنحك +25 نقطة خبرة XP لتطوير ملفك الاحترافي'
                  : 'Completing each daily session rewards +25 XP towards your skill rank'}
              </span>
            </div>
          </div>

          {/* Cards View Mode */}
          {viewMode === 'cards' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {schedule.map((day) => {
                const isDone = completedDays.includes(day.dayNumber);
                const matchingGap = gaps.find(g => g.id === day.focusGapId) || gaps[0];

                return (
                  <div
                    key={day.dayNumber}
                    className={`rounded-2xl border p-4.5 flex flex-col justify-between space-y-4 transition-all ${
                      isDone
                        ? 'bg-emerald-950/20 border-emerald-500/40 shadow-lg shadow-emerald-500/5'
                        : 'bg-slate-950/70 border-slate-800/90 hover:border-slate-700'
                    }`}
                  >
                    {/* Top Row: Day Name & Badge */}
                    <div className="space-y-3">
                      <div className="flex items-center justify-between gap-2">
                        <span className={`px-2.5 py-1 rounded-lg text-xs font-black flex items-center gap-1.5 ${
                          isDone
                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                            : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                        }`}>
                          <span>{isArabic ? day.dayNameAr : day.dayNameEn}</span>
                        </span>

                        <div className="flex items-center gap-1 text-slate-400 text-xs font-mono">
                          <Clock className="w-3.5 h-3.5" />
                          <span>{day.estimatedMinutes}m</span>
                        </div>
                      </div>

                      {/* Topic Title */}
                      <div>
                        <div className="text-[10px] uppercase font-bold text-slate-400">
                          {isArabic ? day.categoryNameAr : day.categoryNameEn}
                        </div>
                        <h4 className="text-sm font-extrabold text-white line-clamp-1 mt-0.5">
                          {isArabic ? day.topicTitleAr : day.topicTitleEn}
                        </h4>
                      </div>

                      <p className="text-xs text-slate-300 leading-relaxed bg-slate-900/80 p-2.5 rounded-xl border border-slate-800/80">
                        {isArabic ? day.descriptionAr : day.descriptionEn}
                      </p>

                      {/* Daily Tasks Checklist */}
                      <div className="space-y-1.5 pt-1">
                        <div className="text-[10px] font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1">
                          <CheckSquare className="w-3 h-3" />
                          {isArabic ? 'خطوات مراجعة اليوم:' : "Today's Checklist:"}
                        </div>
                        {day.tasksEn.map((taskEn, tIdx) => {
                          const taskAr = day.tasksAr[tIdx] || taskEn;
                          return (
                            <div key={tIdx} className="flex items-start gap-2 text-xs text-slate-300">
                              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1.5 shrink-0" />
                              <span>{isArabic ? taskAr : taskEn}</span>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Bottom Action Controls */}
                    <div className="pt-3 border-t border-slate-800/80 flex flex-col gap-2">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => onFilterTopic(day.topicTitleEn.split(' ')[0], day.category)}
                          className="flex-1 py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold border border-slate-700 transition-all flex items-center justify-center gap-1"
                        >
                          <BookOpen className="w-3.5 h-3.5 text-amber-400" />
                          <span>{isArabic ? 'دراسة الكروت' : 'Study Cards'}</span>
                        </button>

                        <button
                          onClick={() => {
                            const items = allRevisionItems.filter(i => i.category === day.category);
                            onStartQuizForGap(items.length > 0 ? items : allRevisionItems, isArabic ? day.topicTitleAr : day.topicTitleEn);
                          }}
                          className="py-2 px-3 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 text-xs font-bold border border-amber-500/30 transition-all flex items-center justify-center gap-1"
                        >
                          <Zap className="w-3.5 h-3.5 fill-amber-400" />
                          <span>{isArabic ? 'كويز' : 'Quiz'}</span>
                        </button>
                      </div>

                      <button
                        onClick={() => toggleDayComplete(day.dayNumber)}
                        className={`w-full py-2.5 px-3 rounded-xl text-xs font-extrabold transition-all flex items-center justify-center gap-2 ${
                          isDone
                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                            : 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-md shadow-amber-500/10'
                        }`}
                      >
                        {isDone ? (
                          <>
                            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                            <span>{isArabic ? 'تم إكمال جلسة اليوم ✓ (+25 XP)' : 'Day Completed ✓ (+25 XP)'}</span>
                          </>
                        ) : (
                          <>
                            <Circle className="w-4 h-4" />
                            <span>{isArabic ? 'تحديد كـ مكتمل اليوم' : 'Mark Day as Complete'}</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            /* Timeline / Table View Mode */
            <div className="bg-slate-950/80 border border-slate-800 rounded-2xl overflow-hidden divide-y divide-slate-800/80">
              {schedule.map((day) => {
                const isDone = completedDays.includes(day.dayNumber);

                return (
                  <div
                    key={day.dayNumber}
                    className={`p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 transition-all ${
                      isDone ? 'bg-emerald-950/10' : 'hover:bg-slate-900/40'
                    }`}
                  >
                    <div className="flex items-start md:items-center gap-3">
                      <button
                        onClick={() => toggleDayComplete(day.dayNumber)}
                        className={`w-7 h-7 rounded-xl flex items-center justify-center shrink-0 border transition-all ${
                          isDone
                            ? 'bg-emerald-500 border-emerald-400 text-slate-950'
                            : 'bg-slate-800 border-slate-700 text-slate-400 hover:border-amber-400'
                        }`}
                      >
                        {isDone ? <Check className="w-4 h-4 stroke-[3]" /> : <Circle className="w-4 h-4" />}
                      </button>

                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-extrabold text-amber-400">
                            {isArabic ? day.dayNameAr : day.dayNameEn}
                          </span>
                          <span className="text-[10px] font-bold text-slate-400 px-2 py-0.5 rounded bg-slate-800 border border-slate-700">
                            {isArabic ? day.categoryNameAr : day.categoryNameEn}
                          </span>
                          <span className="text-[10px] text-slate-400 font-mono">
                            {day.estimatedMinutes} min
                          </span>
                        </div>
                        <p className="text-sm font-bold text-white mt-0.5">
                          {isArabic ? day.topicTitleAr : day.topicTitleEn}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 self-end md:self-center">
                      <button
                        onClick={() => onFilterTopic(day.topicTitleEn.split(' ')[0], day.category)}
                        className="py-1.5 px-3 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold border border-slate-700 transition-all flex items-center gap-1"
                      >
                        <BookOpen className="w-3.5 h-3.5 text-amber-400" />
                        <span>{isArabic ? 'الكروت' : 'Cards'}</span>
                      </button>

                      <button
                        onClick={() => {
                          const items = allRevisionItems.filter(i => i.category === day.category);
                          onStartQuizForGap(items.length > 0 ? items : allRevisionItems, isArabic ? day.topicTitleAr : day.topicTitleEn);
                        }}
                        className="py-1.5 px-3 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 text-xs font-bold border border-amber-500/30 transition-all flex items-center gap-1"
                      >
                        <Zap className="w-3.5 h-3.5 fill-amber-400" />
                        <span>{isArabic ? 'كويز' : 'Quiz'}</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default WeeklyStudyPlanner;
