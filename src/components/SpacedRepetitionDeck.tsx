/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Layers, RotateCw, Check, Sparkles, Brain, Flame,
  Award, RefreshCw, Eye, ChevronRight, ChevronLeft, ThumbsUp
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export interface Flashcard {
  id: string;
  category: 'react' | 'javascript' | 'backend' | 'sql' | 'system_design' | 'web3';
  questionEn: string;
  questionAr: string;
  answerEn: string;
  answerAr: string;
  codeSnippet?: string;
  difficulty: 'easy' | 'medium' | 'hard';
  intervalDays?: number;
}

const DEFAULT_CARDS: Flashcard[] = [
  {
    id: 'fc-1',
    category: 'react',
    difficulty: 'medium',
    questionEn: 'What is the key difference between useMemo and useCallback in React?',
    questionAr: 'ما الفرق الأساسي بين useMemo و useCallback في مكتبة ريأكت؟',
    answerEn: 'useMemo returns the memoized result of a calculation function, whereas useCallback returns the memoized callback function itself without invoking it.',
    answerAr: 'تُرجع useMemo القيمة المرجعة المجهزة من دالة حسابية، بينما تُرجع useCallback دالة الاستدعاء نفسها مجهزة للتمكن من تمريرها دون إعادة الإنشاء.',
    codeSnippet: `// useMemo caches value:
const totalScore = useMemo(() => calculateTotal(items), [items]);

// useCallback caches function instance:
const handleClick = useCallback(() => submitForm(id), [id]);`
  },
  {
    id: 'fc-2',
    category: 'javascript',
    difficulty: 'hard',
    questionEn: 'How does the Event Loop handle Microtasks vs Macrotasks in V8 engine?',
    questionAr: 'كيف يتعامل حلقة الأحداث (Event Loop) مع المهام الدقيقة (Microtasks) والمهام الكبيرة (Macrotasks)؟',
    answerEn: 'Microtasks (Promises, process.nextTick) execute immediately after the current script finishes and BEFORE any Macrotasks (setTimeout, setInterval, I/O) are picked up from the queue.',
    answerAr: 'المهام الدقيقة (Microtasks مثل Promises) تُنفذ فوراً بعد انتهاء السكريبت الحالي وقبل اختيار أي مهمة من طابور المهام الكبيرة (Macrotasks مثل setTimeout).',
    codeSnippet: `console.log('1');
setTimeout(() => console.log('2'), 0);
Promise.resolve().then(() => console.log('3'));
console.log('4');
// Output order: 1, 4, 3, 2`
  },
  {
    id: 'fc-3',
    category: 'backend',
    difficulty: 'medium',
    questionEn: 'How does Eloquent ORM prevent N+1 query problem in Laravel?',
    questionAr: 'كيف يمنع Eloquent ORM مشكلة الاستعلامات المكررة (N+1 Problem) في لارفيل؟',
    answerEn: 'Through Eager Loading using the `with()` method, which performs a single `WHERE IN` query instead of querying relations inside a loop.',
    answerAr: 'عن طريق التحميل المسبق (Eager Loading) عبر دالة `with()` التي تنفذ استعلاماً واحداً بـ `WHERE IN` بدلاً من تنفيذ استعلام لكل عنصر داخل الحلقة.',
    codeSnippet: `// BAD: N+1 queries
$posts = Post::all();
foreach ($posts as $post) { echo $post->author->name; }

// GOOD: 2 queries total
$posts = Post::with('author')->get();`
  },
  {
    id: 'fc-4',
    category: 'system_design',
    difficulty: 'hard',
    questionEn: 'What is the CAP Theorem and why can’t a distributed system have all three simultaneously?',
    questionAr: 'ما هي نظرية CAP وتفرعاتها ولماذا لا يمكن تحقيق الثلاثية كاملة في أي نظام موزع؟',
    answerEn: 'CAP states a distributed system can only provide two of Consistency, Availability, and Partition Tolerance. Since network partitions (P) are inevitable in real networks, you must choose between Consistency (CP) or Availability (AP).',
    answerAr: 'تنص نظرية CAP على أن النظام الموزع يمكنه تحقيق اثنين فقط من: الاتساق (Consistency)، التوافر (Availability)، والتسامح مع انقطاع الشبكة (Partition Tolerance). وبما أن انقطاع الشبكة حتمي، يجب الاختيار بين الاتساق أو التوافر.',
  },
  {
    id: 'fc-5',
    category: 'sql',
    difficulty: 'medium',
    questionEn: 'Why are B-Tree indexes vastly faster for range queries than Hash indexes?',
    questionAr: 'لماذا تعد كشافات B-Tree أسرع بكثير من كشافات Hash في استعلامات المدى (Range Queries)؟',
    answerEn: 'B-Tree indexes maintain keys in a sorted balanced tree structure allowing binary search and range traversal (e.g. BETWEEN 10 AND 50), whereas Hash indexes only support exact equality matches (=).',
    answerAr: 'تحافظ B-Tree على تسلسل المفاتيح داخل شجرة متوازنة مرتبة مما يسمح بالبحث عن المدى، بينما تدعم كشافات Hash فقط المطبقة المباشرة (=).',
  }
];

export const SpacedRepetitionDeck: React.FC = () => {
  const { isRtl, lang } = useApp();
  const [cards] = useState<Flashcard[]>(DEFAULT_CARDS);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isFlipped, setIsFlipped] = useState<boolean>(false);
  const [streak, setStreak] = useState<number>(5);
  const [reviewedCount, setReviewedCount] = useState<number>(0);

  const currentCard = cards[currentIndex];

  const handleRating = (quality: 'again' | 'hard' | 'good' | 'easy') => {
    setReviewedCount(prev => prev + 1);
    if (quality === 'good' || quality === 'easy') {
      setStreak(prev => prev + 1);
    }
    setIsFlipped(false);
    setCurrentIndex((prev) => (prev + 1) % cards.length);
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 space-y-6" id="spaced-repetition-deck">
      
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div className="flex items-center space-x-3 rtl:space-x-reverse">
          <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-2xl text-amber-400">
            <Layers className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-black text-white">
              {isRtl ? 'بطاقات المراجعة المتباعدة (Spaced Repetition)' : 'Flashcard Mastery Studio'}
            </h3>
            <p className="text-xs text-slate-400">
              {isRtl ? 'راجع المفاهيم والخوارزميات الهامة بأسلوب Leitner لتثبيت المعلومات في الذاكرة طويلة المدى.' : 'Master algorithm & framework concepts using Leitner spaced repetition interval algorithms.'}
            </p>
          </div>
        </div>

        {/* Stats metrics */}
        <div className="flex items-center space-x-3 rtl:space-x-reverse text-xs">
          <div className="flex items-center space-x-1.5 rtl:space-x-reverse bg-amber-500/10 border border-amber-500/20 text-amber-400 px-3 py-1.5 rounded-xl font-extrabold">
            <Flame className="w-4 h-4 text-orange-500" />
            <span>{streak} {isRtl ? 'أيام متتالية' : 'Day Streak'}</span>
          </div>
          <div className="bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800 text-slate-300 font-mono font-bold">
            {currentIndex + 1} / {cards.length}
          </div>
        </div>
      </div>

      {/* Main Flashcard Container */}
      <div className="max-w-2xl mx-auto perspective-1000 my-4" id="flashcard-3d-wrapper">
        <motion.div
          onClick={() => setIsFlipped(!isFlipped)}
          animate={{ rotateY: isFlipped ? 180 : 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="w-full min-h-[300px] bg-slate-950 border border-slate-800 hover:border-amber-500/50 rounded-3xl p-8 cursor-pointer shadow-2xl relative flex flex-col justify-between transition-colors"
          style={{ transformStyle: 'preserve-3d' }}
        >
          {!isFlipped ? (
            /* FRONT OF CARD */
            <div className="space-y-6 flex flex-col justify-between h-full">
              <div className="flex justify-between items-center">
                <span className="text-xs font-black uppercase tracking-wider text-amber-400 bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/20">
                  {currentCard.category.toUpperCase()}
                </span>
                <span className="text-[11px] text-slate-500 font-mono flex items-center gap-1">
                  <Eye className="w-3.5 h-3.5" />
                  <span>{isRtl ? 'انقر لكشف الإجابة' : 'Click to flip card'}</span>
                </span>
              </div>

              <div className="my-auto py-4">
                <h4 className="text-lg md:text-xl font-extrabold text-white leading-relaxed text-center">
                  {isRtl ? currentCard.questionAr : currentCard.questionEn}
                </h4>
              </div>

              <div className="text-center text-xs text-amber-400 font-bold animate-pulse">
                {isRtl ? '💡 اضغط للقلب وعرض الشرح والكود' : '💡 Click anywhere on the card to reveal answer'}
              </div>
            </div>
          ) : (
            /* BACK OF CARD */
            <div className="space-y-4 flex flex-col justify-between h-full" style={{ transform: 'rotateY(180deg)' }}>
              <div className="flex justify-between items-center border-b border-slate-800/80 pb-3">
                <span className="text-xs font-black text-emerald-400 uppercase tracking-wider">
                  {isRtl ? 'الإجابة والشرح' : 'Explanation & Implementation'}
                </span>
                <span className="text-[10px] text-slate-400 font-mono">ID: {currentCard.id}</span>
              </div>

              <p className="text-sm text-slate-200 leading-relaxed font-sans">
                {isRtl ? currentCard.answerAr : currentCard.answerEn}
              </p>

              {currentCard.codeSnippet && (
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-3 text-xs font-mono text-emerald-300 overflow-x-auto">
                  <pre>{currentCard.codeSnippet}</pre>
                </div>
              )}

              <div className="text-center text-[11px] text-slate-500 pt-2">
                {isRtl ? 'اختر مدى سهولة الإجابة لتعديل موعد المراجعة القادم' : 'Select difficulty below to schedule next review'}
              </div>
            </div>
          )}
        </motion.div>
      </div>

      {/* Evaluation Control Buttons */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-2xl mx-auto">
        <button
          onClick={() => handleRating('again')}
          className="p-3 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-400 rounded-2xl text-xs font-black transition-all cursor-pointer flex flex-col items-center gap-1"
        >
          <span>🔴 {isRtl ? 'إعادة قريباً' : 'Again'}</span>
          <span className="text-[10px] font-mono opacity-70">&lt; 1 min</span>
        </button>

        <button
          onClick={() => handleRating('hard')}
          className="p-3 bg-orange-500/10 hover:bg-orange-500/20 border border-orange-500/30 text-orange-400 rounded-2xl text-xs font-black transition-all cursor-pointer flex flex-col items-center gap-1"
        >
          <span>🟧 {isRtl ? 'صعب' : 'Hard'}</span>
          <span className="text-[10px] font-mono opacity-70">2 days</span>
        </button>

        <button
          onClick={() => handleRating('good')}
          className="p-3 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 rounded-2xl text-xs font-black transition-all cursor-pointer flex flex-col items-center gap-1"
        >
          <span>🟩 {isRtl ? 'جيد جداً' : 'Good'}</span>
          <span className="text-[10px] font-mono opacity-70">5 days</span>
        </button>

        <button
          onClick={() => handleRating('easy')}
          className="p-3 bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/30 text-blue-400 rounded-2xl text-xs font-black transition-all cursor-pointer flex flex-col items-center gap-1"
        >
          <span>🟦 {isRtl ? 'سهل ممتاز' : 'Easy'}</span>
          <span className="text-[10px] font-mono opacity-70">10 days</span>
        </button>
      </div>

    </div>
  );
};
