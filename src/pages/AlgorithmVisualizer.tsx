/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Play, 
  RotateCcw, 
  BarChart2, 
  Sparkles, 
  Zap, 
  Layers, 
  Clock, 
  Cpu,
  CheckCircle2
} from 'lucide-react';

export const AlgorithmVisualizer: React.FC = () => {
  const { lang } = useApp();
  const isAr = lang === 'ar';

  const [array, setArray] = useState<number[]>([45, 12, 89, 34, 67, 23, 91, 5, 52, 78]);
  const [comparingIdx, setComparingIdx] = useState<number[]>([]);
  const [swappingIdx, setSwappingIdx] = useState<number[]>([]);
  const [sortedIdx, setSortedIdx] = useState<number[]>([]);
  const [isSorting, setIsSorting] = useState(false);
  const [stepCount, setStepCount] = useState(0);

  const resetArray = () => {
    if (isSorting) return;
    const newArr = Array.from({ length: 12 }, () => Math.floor(Math.random() * 85) + 10);
    setArray(newArr);
    setComparingIdx([]);
    setSwappingIdx([]);
    setSortedIdx([]);
    setStepCount(0);
  };

  const bubbleSort = async () => {
    setIsSorting(true);
    let arr = [...array];
    let steps = 0;
    let n = arr.length;

    for (let i = 0; i < n; i++) {
      for (let j = 0; j < n - i - 1; j++) {
        setComparingIdx([j, j + 1]);
        await new Promise(r => setTimeout(r, 200));

        if (arr[j] > arr[j + 1]) {
          setSwappingIdx([j, j + 1]);
          let temp = arr[j];
          arr[j] = arr[j + 1];
          arr[j + 1] = temp;
          setArray([...arr]);
          steps++;
          setStepCount(steps);
          await new Promise(r => setTimeout(r, 200));
        }
        setSwappingIdx([]);
      }
      setSortedIdx(prev => [...prev, n - i - 1]);
    }
    setComparingIdx([]);
    setIsSorting(false);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-10 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header Hero */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-fuchsia-950/20 to-slate-950 p-6 md:p-10 border border-fuchsia-500/30 shadow-2xl shadow-fuchsia-500/5">
          <div className="relative flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="space-y-3">
              <div className="flex items-center space-x-3 rtl:space-x-reverse">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-fuchsia-500 to-pink-600 flex items-center justify-center shadow-lg shadow-fuchsia-500/20">
                  <BarChart2 className="w-7 h-7 text-slate-950" strokeWidth={2.5} />
                </div>
                <div>
                  <span className="text-xs font-black text-fuchsia-400 uppercase tracking-widest block">
                    {isAr ? 'محاكي وسجل خوارزميات وهياكل البيانات' : 'Interactive Algorithms & Data Structures Studio'}
                  </span>
                  <h1 className="text-2xl md:text-3xl font-black text-white tracking-tight">
                    {isAr ? 'محاكاة بصرية تفاعلية لعمليات الترتيب والبحث (Sorting & Graphs)' : 'Step-by-Step Visual Algorithm Execution Engine'}
                  </h1>
                </div>
              </div>
              <p className="text-xs md:text-sm text-slate-400 max-w-2xl leading-relaxed">
                {isAr 
                  ? 'شاهد كيفية عمل خوارزميات الترتيب والبحث في الذاكرة حياً خطوة بخطوة، مع مراقبة مؤشرات مقارنة العناصر وتبديل الأماكن وحساب التعقيد الزمني (Time Complexity).'
                  : 'Visualize sorting algorithms in memory in real time, inspect pointer swaps, compare operations, and analyze asymptotic time complexity.'}
              </p>
            </div>

            <div className="flex items-center space-x-3 rtl:space-x-reverse">
              <button
                onClick={resetArray}
                disabled={isSorting}
                className="px-4 py-3 rounded-2xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 font-bold text-xs transition-colors flex items-center space-x-2 rtl:space-x-reverse disabled:opacity-50"
              >
                <RotateCcw className="w-4 h-4" />
                <span>{isAr ? 'توليد أرقام عشوائية' : 'Generate New Array'}</span>
              </button>

              <button
                onClick={bubbleSort}
                disabled={isSorting}
                className="px-6 py-3 rounded-2xl bg-gradient-to-r from-fuchsia-500 to-pink-500 hover:from-fuchsia-400 hover:to-pink-400 text-slate-950 font-black text-xs shadow-xl shadow-fuchsia-500/20 transition-all flex items-center space-x-2 rtl:space-x-reverse disabled:opacity-50"
              >
                <Play className="w-4 h-4 fill-slate-950" />
                <span>{isAr ? 'بدء المحاكاة الحية' : 'Start Sorting Step'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Visualization Canvas */}
        <div className="bg-slate-900/90 p-8 rounded-2xl border border-slate-800 space-y-6">
          <div className="flex items-center justify-between text-xs font-mono">
            <div className="flex items-center space-x-4 rtl:space-x-reverse">
              <span className="text-slate-400 font-bold">Algorithm: <strong className="text-fuchsia-400">Bubble Sort</strong></span>
              <span className="text-slate-400 font-bold">Complexity: <strong className="text-amber-400">O(N²)</strong></span>
            </div>
            <span className="text-fuchsia-400 font-bold">
              Total Swaps / Steps: {stepCount}
            </span>
          </div>

          {/* Bar Charts */}
          <div className="h-64 flex items-end justify-center space-x-2 rtl:space-x-reverse pt-8 pb-4 border-b border-slate-800">
            {array.map((val, idx) => {
              const isComparing = comparingIdx.includes(idx);
              const isSwapping = swappingIdx.includes(idx);
              const isSorted = sortedIdx.includes(idx);

              let barColor = 'bg-slate-700';
              if (isSorted) barColor = 'bg-emerald-500';
              else if (isSwapping) barColor = 'bg-fuchsia-500 animate-pulse';
              else if (isComparing) barColor = 'bg-amber-400';

              return (
                <div key={idx} className="flex-1 flex flex-col items-center gap-2 max-w-[48px]">
                  <span className="text-[10px] font-mono text-slate-400 font-bold">{val}</span>
                  <div 
                    className={`w-full rounded-t-lg transition-all duration-200 ${barColor}`}
                    style={{ height: `${val * 2.2}px` }}
                  />
                </div>
              );
            })}
          </div>

          {/* Legend */}
          <div className="flex flex-wrap items-center justify-center gap-6 text-xs font-mono pt-2">
            <div className="flex items-center space-x-2 rtl:space-x-reverse">
              <div className="w-3.5 h-3.5 rounded bg-slate-700" />
              <span className="text-slate-400">Unsorted / غير مرتب</span>
            </div>
            <div className="flex items-center space-x-2 rtl:space-x-reverse">
              <div className="w-3.5 h-3.5 rounded bg-amber-400" />
              <span className="text-slate-400">Comparing / قيد المقارنة</span>
            </div>
            <div className="flex items-center space-x-2 rtl:space-x-reverse">
              <div className="w-3.5 h-3.5 rounded bg-fuchsia-500" />
              <span className="text-slate-400">Swapping / تبديل الأماكن</span>
            </div>
            <div className="flex items-center space-x-2 rtl:space-x-reverse">
              <div className="w-3.5 h-3.5 rounded bg-emerald-500" />
              <span className="text-slate-400">Sorted / مرتب بنجاح</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
