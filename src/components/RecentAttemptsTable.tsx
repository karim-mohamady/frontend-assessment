/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { getQuestionsByCategory } from '../data/questions';
import { AssessmentResult } from '../types';
import { 
  Search, SlidersHorizontal, Trash2, Eye, Calendar, Award, Clock, ChevronDown, ChevronUp, X, RefreshCw, BookOpen, Activity, Play, CheckCircle, AlertCircle
} from 'lucide-react';

export const RecentAttemptsTable: React.FC = () => {
  const { progress, isRtl, t } = useApp();
  const navigate = useNavigate();

  // Filter and sort states
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedMode, setSelectedMode] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'date-desc' | 'date-asc' | 'score-desc' | 'score-asc' | 'time-desc' | 'time-asc'>('date-desc');
  const [showFilters, setShowFilters] = useState(false);

  const categoriesList = [
    { id: 'html', label: isRtl ? 'هيكلة الويب HTML5' : 'HTML5 Structure', color: '#f97316' },
    { id: 'css', label: isRtl ? 'تنسيق الويب CSS3' : 'CSS3 Styling', color: '#3b82f6' },
    { id: 'javascript', label: isRtl ? 'جافا سكريبت' : 'JS Programming', color: '#f59e0b' },
    { id: 'react', label: isRtl ? 'مكتبة ريأكت' : 'React Framework', color: '#0ea5e9' },
    { id: 'bootstrap', label: isRtl ? 'إطار بوتستراب' : 'Bootstrap Layouts', color: '#8b5cf6' },
    { id: 'english', label: isRtl ? 'اللغة الإنجليزية' : 'Technical English', color: '#10b981' }
  ];

  const categoryNames: Record<string, string> = {
    html: isRtl ? 'هيكلة الويب HTML5' : 'HTML5 Structure',
    css: isRtl ? 'تنسيق الويب CSS3' : 'CSS3 Styling',
    javascript: isRtl ? 'جافا سكريبت' : 'JS Programming',
    react: isRtl ? 'مكتبة ريأكت' : 'React Framework',
    bootstrap: isRtl ? 'إطار بوتستراب' : 'Bootstrap Layouts',
    english: isRtl ? 'اللغة الإنجليزية' : 'Technical English'
  };

  const categoryColors: Record<string, string> = {
    html: 'from-orange-500/20 to-orange-500/5 text-orange-400 border-orange-500/30',
    css: 'from-blue-500/20 to-blue-500/5 text-blue-400 border-blue-500/30',
    javascript: 'from-amber-500/20 to-amber-500/5 text-amber-400 border-amber-500/30',
    react: 'from-sky-500/20 to-sky-500/5 text-sky-400 border-sky-500/30',
    bootstrap: 'from-purple-500/20 to-purple-500/5 text-purple-400 border-purple-500/30',
    english: 'from-emerald-500/20 to-emerald-500/5 text-emerald-400 border-emerald-500/30'
  };

  // Format date nicely
  const formatDate = (dateStr: string) => {
    try {
      const date = new Date(dateStr);
      if (isNaN(date.getTime())) return dateStr;
      
      return date.toLocaleDateString(isRtl ? 'ar-EG' : 'en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return dateStr;
    }
  };

  // Format time spent
  const formatTime = (secs: number) => {
    if (secs < 60) return `${secs} ${isRtl ? 'ثانية' : 'sec'}`;
    const mins = Math.floor(secs / 60);
    const remainingSecs = secs % 60;
    if (remainingSecs === 0) return `${mins} ${isRtl ? 'دقيقة' : 'min'}`;
    return `${mins}m ${remainingSecs}s`;
  };

  // Filter & Sort core logic
  const filteredAttempts = useMemo(() => {
    let list = [...(progress.completedAssessments || [])];

    // Search query filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      list = list.filter((attempt) => {
        const catName = categoryNames[attempt.category]?.toLowerCase() || '';
        const percentage = `${attempt.percentage}%`;
        const score = `${attempt.score}/${attempt.maxScore}`;
        const mode = attempt.mode.toLowerCase();
        
        return (
          catName.includes(query) ||
          percentage.includes(query) ||
          score.includes(query) ||
          mode.includes(query)
        );
      });
    }

    // Category filter
    if (selectedCategory !== 'all') {
      list = list.filter((attempt) => attempt.category === selectedCategory);
    }

    // Mode filter
    if (selectedMode !== 'all') {
      list = list.filter((attempt) => attempt.mode === selectedMode);
    }

    // Sort operations
    list.sort((a, b) => {
      if (sortBy === 'date-desc') return new Date(b.date).getTime() - new Date(a.date).getTime();
      if (sortBy === 'date-asc') return new Date(a.date).getTime() - new Date(b.date).getTime();
      if (sortBy === 'score-desc') return b.percentage - a.percentage;
      if (sortBy === 'score-asc') return a.percentage - b.percentage;
      if (sortBy === 'time-desc') return b.timeSpent - a.timeSpent;
      if (sortBy === 'time-asc') return a.timeSpent - b.timeSpent;
      return 0;
    });

    return list;
  }, [progress.completedAssessments, searchQuery, selectedCategory, selectedMode, sortBy]);

  // Handle navigate to Report view
  const handleReviewAttempt = (attempt: AssessmentResult) => {
    // Generate questions matching this category to pass inside state
    const categoryQuestions = getQuestionsByCategory(attempt.category, 10);
    
    navigate('/report', { 
      state: { 
        result: attempt,
        questions: categoryQuestions
      } 
    });
  };

  // Reset all filters
  const handleClearFilters = () => {
    setSearchQuery('');
    setSelectedCategory('all');
    setSelectedMode('all');
    setSortBy('date-desc');
  };

  return (
    <div className="bg-slate-900 border border-slate-800/80 rounded-3xl p-6 md:p-8 space-y-6" id="recent-attempts-table-section">
      
      {/* Table Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h3 className="font-extrabold text-white text-base md:text-lg flex items-center gap-2.5">
            <Clock className="w-5 h-5 text-amber-500" />
            <span>{isRtl ? 'سجل المحاولات والتقييمات الأخيرة' : 'Recent Assessment Attempts'}</span>
          </h3>
          <p className="text-xs text-slate-400">
            {isRtl 
              ? 'تتبع تاريخ درجاتك البرمجية ومراجعة إجاباتك بالتفصيل.' 
              : 'Browse your history of finished competency assessments and view detailed reports.'}
          </p>
        </div>

        {/* Filters control button */}
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`flex items-center space-x-1.5 rtl:space-x-reverse px-4 py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
            showFilters || selectedCategory !== 'all' || selectedMode !== 'all' || searchQuery !== ''
              ? 'bg-amber-500/15 border-amber-500/40 text-amber-400'
              : 'bg-slate-950 border-slate-800 text-slate-300 hover:bg-slate-900'
          }`}
          id="btn-toggle-filters"
        >
          <SlidersHorizontal className="w-3.5 h-3.5" />
          <span>{isRtl ? 'فرز وتصفية' : 'Filter & Sort'}</span>
          {(selectedCategory !== 'all' || selectedMode !== 'all' || searchQuery !== '') && (
            <span className="w-2 h-2 rounded-full bg-amber-500" />
          )}
        </button>
      </div>

      {/* Expandable Advanced Filters and Sort options */}
      {showFilters && (
        <div className="p-5 bg-slate-950/80 border border-slate-800/60 rounded-2xl grid grid-cols-1 md:grid-cols-4 gap-4 animate-fade-in" id="filters-container">
          
          {/* Search Box */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">
              {isRtl ? 'بحث نصي' : 'Keyword Search'}
            </label>
            <div className="relative">
              <input
                type="text"
                placeholder={isRtl ? 'ابحث بالفئة، النسبة...' : 'Search category, score...'}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800/80 focus:border-slate-700 focus:outline-none rounded-xl px-3.5 py-2 text-xs text-slate-200 placeholder:text-slate-500 pl-9 rtl:pl-3.5 rtl:pr-9"
              />
              <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-3 rtl:left-auto rtl:right-3" />
            </div>
          </div>

          {/* Category Dropdown */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">
              {isRtl ? 'تصفية حسب الفئة' : 'Filter by Category'}
            </label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800/80 focus:border-slate-700 focus:outline-none rounded-xl px-3 py-2 text-xs text-slate-200"
            >
              <option value="all">{isRtl ? 'جميع الفئات البرمجية' : 'All Categories'}</option>
              {categoriesList.map((cat) => (
                <option key={cat.id} value={cat.id}>{cat.label}</option>
              ))}
            </select>
          </div>

          {/* Mode Dropdown */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">
              {isRtl ? 'تصفية حسب وضع التقييم' : 'Filter by Mode'}
            </label>
            <select
              value={selectedMode}
              onChange={(e) => setSelectedMode(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800/80 focus:border-slate-700 focus:outline-none rounded-xl px-3 py-2 text-xs text-slate-200"
            >
              <option value="all">{isRtl ? 'جميع الأوضاع' : 'All Modes'}</option>
              <option value="exam">{isRtl ? 'وضع الامتحان' : 'Exam Mode'}</option>
              <option value="study">{isRtl ? 'وضع الدراسة' : 'Study Mode'}</option>
              <option value="daily">{isRtl ? 'التحدي اليومي' : 'Daily Challenge'}</option>
            </select>
          </div>

          {/* Sort Selection */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">
              {isRtl ? 'ترتيب النتائج حسب' : 'Sort Results By'}
            </label>
            <div className="flex gap-2">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="flex-1 bg-slate-900 border border-slate-800/80 focus:border-slate-700 focus:outline-none rounded-xl px-3 py-2 text-xs text-slate-200"
              >
                <option value="date-desc">{isRtl ? 'الأحدث أولاً' : 'Newest Attempt'}</option>
                <option value="date-asc">{isRtl ? 'الأقدم أولاً' : 'Oldest Attempt'}</option>
                <option value="score-desc">{isRtl ? 'الدرجة الأعلى' : 'Highest Score'}</option>
                <option value="score-asc">{isRtl ? 'الدرجة الأقل' : 'Lowest Score'}</option>
                <option value="time-asc">{isRtl ? 'السرعة الأعلى' : 'Fastest Time'}</option>
                <option value="time-desc">{isRtl ? 'السرعة الأقل' : 'Slowest Time'}</option>
              </select>

              {(searchQuery !== '' || selectedCategory !== 'all' || selectedMode !== 'all' || sortBy !== 'date-desc') && (
                <button
                  onClick={handleClearFilters}
                  className="bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-400 hover:text-slate-200 p-2 rounded-xl"
                  title={isRtl ? 'إعادة ضبط' : 'Reset Filters'}
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

        </div>
      )}

      {/* Attempts Table Element */}
      <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-950/40" id="table-scroll-wrapper">
        <table className="w-full text-left rtl:text-right border-collapse">
          <thead>
            <tr className="bg-slate-950/90 border-b border-slate-800/80 text-[10px] font-black text-slate-400 uppercase tracking-wider">
              <th className="py-4 px-5">{isRtl ? 'الفئة المقيّمة' : 'Assessed Category'}</th>
              <th className="py-4 px-4">{isRtl ? 'التاريخ والوقت' : 'Date & Time'}</th>
              <th className="py-4 px-4">{isRtl ? 'الوضع' : 'Mode'}</th>
              <th className="py-4 px-4">{isRtl ? 'النتيجة المكتسبة' : 'Earned Score'}</th>
              <th className="py-4 px-4">{isRtl ? 'الدقة والفاعلية' : 'Accuracy'}</th>
              <th className="py-4 px-4">{isRtl ? 'الوقت المستغرق' : 'Time Spent'}</th>
              <th className="py-4 px-5 text-center">{isRtl ? 'خيارات' : 'Options'}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-900/60">
            {filteredAttempts.length > 0 ? (
              filteredAttempts.map((attempt) => {
                const pass = attempt.percentage >= 70;
                return (
                  <tr 
                    key={attempt.id} 
                    className="hover:bg-slate-900/40 transition-colors group text-slate-300"
                  >
                    {/* Category Label */}
                    <td className="py-4 px-5">
                      <div className="flex items-center space-x-3 rtl:space-x-reverse">
                        <div className={`text-xs px-2.5 py-1 rounded-lg border font-bold bg-gradient-to-br ${categoryColors[attempt.category] || 'bg-slate-800'}`}>
                          {categoryNames[attempt.category]}
                        </div>
                      </div>
                    </td>

                    {/* Format Date */}
                    <td className="py-4 px-4 text-xs font-mono text-slate-400">
                      <div className="flex items-center space-x-1.5 rtl:space-x-reverse">
                        <Calendar className="w-3.5 h-3.5 text-slate-500" />
                        <span>{formatDate(attempt.date)}</span>
                      </div>
                    </td>

                    {/* Mode badge */}
                    <td className="py-4 px-4">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold border uppercase tracking-wider ${
                        attempt.mode === 'exam' 
                          ? 'bg-red-500/10 text-red-400 border-red-500/20' 
                          : attempt.mode === 'daily'
                          ? 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                          : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                      }`}>
                        {attempt.mode === 'exam' ? (isRtl ? 'امتحان' : 'Exam') : attempt.mode === 'daily' ? (isRtl ? 'يومي' : 'Daily') : (isRtl ? 'دراسة' : 'Study')}
                      </span>
                    </td>

                    {/* Percentage & exact score */}
                    <td className="py-4 px-4">
                      <div className="space-y-1">
                        <div className="flex items-center space-x-2 rtl:space-x-reverse">
                          <span className={`text-sm font-black font-mono ${pass ? 'text-emerald-400' : 'text-amber-500'}`}>
                            {attempt.percentage}%
                          </span>
                          <span className="text-[10px] text-slate-500 font-mono">
                            ({attempt.score}/{attempt.maxScore})
                          </span>
                        </div>
                        {/* Miniature progress bar */}
                        <div className="h-1 w-20 bg-slate-900 rounded-full overflow-hidden">
                          <div 
                            className={`h-full ${pass ? 'bg-emerald-400' : 'bg-amber-500'}`} 
                            style={{ width: `${attempt.percentage}%` }}
                          />
                        </div>
                      </div>
                    </td>

                    {/* Accuracy rate */}
                    <td className="py-4 px-4">
                      <div className="flex items-center space-x-1.5 rtl:space-x-reverse">
                        <Activity className="w-3.5 h-3.5 text-indigo-400" />
                        <span className="text-xs font-mono font-bold text-slate-300">{attempt.accuracy}%</span>
                      </div>
                    </td>

                    {/* Time Spent */}
                    <td className="py-4 px-4 text-xs font-mono text-slate-400">
                      <div className="flex items-center space-x-1.5 rtl:space-x-reverse">
                        <Clock className="w-3.5 h-3.5 text-slate-500" />
                        <span>{formatTime(attempt.timeSpent)}</span>
                      </div>
                    </td>

                    {/* Action buttons */}
                    <td className="py-4 px-5 text-center">
                      <button
                        onClick={() => handleReviewAttempt(attempt)}
                        className="inline-flex items-center space-x-1 rtl:space-x-reverse bg-slate-900 hover:bg-amber-500 border border-slate-800 hover:border-amber-600 text-slate-300 hover:text-slate-900 px-3 py-1.5 rounded-xl text-[11px] font-extrabold transition-all duration-200 shadow-sm cursor-pointer"
                        title={isRtl ? 'تفاصيل المحاولة والتقرير' : 'View report and certificate details'}
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>{isRtl ? 'عرض التقرير' : 'View Report'}</span>
                      </button>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={7} className="py-12 px-5 text-center text-slate-500 text-xs italic">
                  <div className="flex flex-col items-center justify-center space-y-3">
                    <BookOpen className="w-10 h-10 text-slate-700 stroke-[1.5]" />
                    <p className="max-w-md leading-relaxed text-slate-400">
                      {isRtl 
                        ? 'لم يتم تسجيل أي محاولات مطابقة للتصفية الحالية. ابدأ تقييماً جديداً لتجميع المحاولات والسجل!' 
                        : 'No assessment attempts match the current filters. Take a skill assessment to populate your record table!'}
                    </p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Tiny summary banner */}
      {filteredAttempts.length > 0 && (
        <div className="flex justify-between items-center text-[10px] font-mono text-slate-500 pt-2" id="attempts-footer-stats">
          <span>
            {isRtl 
              ? `عرض ${filteredAttempts.length} من أصل ${progress.completedAssessments.length} محاولة` 
              : `Showing ${filteredAttempts.length} of ${progress.completedAssessments.length} compiled attempts`}
          </span>
          <span className="flex items-center gap-1">
            <CheckCircle className="w-3 h-3 text-emerald-400" />
            <span>
              {isRtl ? 'الدرجة الكفؤة هي 70٪ فأكثر' : '70%+ earns certified status'}
            </span>
          </span>
        </div>
      )}

    </div>
  );
};
