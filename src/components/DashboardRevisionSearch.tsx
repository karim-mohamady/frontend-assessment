/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, BookOpen, Code, ArrowRight, Sparkles, X, ChevronRight, Layers, CheckCircle } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { getAllRevisionItems, REVISION_CATEGORIES, RevisionItem } from '../data/revisionData';

export const DashboardRevisionSearch: React.FC = () => {
  const { lang, selectedTrack } = useApp();
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const isArabic = lang === 'ar';

  // Load all revision items once
  const allRevisionItems = useMemo(() => getAllRevisionItems(), []);

  // Filtered matching items for live dropdown
  const searchResults = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase().trim();
    return allRevisionItems.filter(item =>
      item.questionTextEn.toLowerCase().includes(q) ||
      item.questionTextAr.includes(q) ||
      item.topic.toLowerCase().includes(q) ||
      item.explanationEn.toLowerCase().includes(q) ||
      item.explanationAr.includes(q) ||
      item.practicalCodeExample.toLowerCase().includes(q)
    ).slice(0, 5); // top 5 preview results
  }, [allRevisionItems, query]);

  const totalMatchCount = useMemo(() => {
    if (!query.trim()) return 0;
    const q = query.toLowerCase().trim();
    return allRevisionItems.filter(item =>
      item.questionTextEn.toLowerCase().includes(q) ||
      item.questionTextAr.includes(q) ||
      item.topic.toLowerCase().includes(q) ||
      item.explanationEn.toLowerCase().includes(q) ||
      item.explanationAr.includes(q) ||
      item.practicalCodeExample.toLowerCase().includes(q)
    ).length;
  }, [allRevisionItems, query]);

  // Click outside listener to close live results
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (query.trim()) {
      navigate(`/revision?search=${encodeURIComponent(query.trim())}`);
    } else {
      navigate('/revision');
    }
  };

  const handleQuickTopicClick = (topicText: string) => {
    setQuery(topicText);
    navigate(`/revision?search=${encodeURIComponent(topicText)}`);
  };

  // Popular search chips tailored to career tracks
  const popularTopics = [
    { labelEn: 'React 19 & Hooks', labelAr: 'ريأكت والخطافات', query: 'React' },
    { labelEn: 'CSS Flexbox & Grid', labelAr: 'تنسيق Flexbox وGrid', query: 'Flexbox' },
    { labelEn: 'PHP 8.x PDO', labelAr: 'أمان PHP 8 وPDO', query: 'PDO' },
    { labelEn: 'Eloquent ORM', labelAr: 'علاقات Eloquent', query: 'Eloquent' },
    { labelEn: 'Solidity & EVM', labelAr: 'لغة Solidity والـ EVM', query: 'Solidity' },
    { labelEn: 'Figma Auto-Layout', labelAr: 'تخطيط Figma والتصميم', query: 'Auto-Layout' },
    { labelEn: 'WCAG Accessibility', labelAr: 'إمكانية الوصول WCAG', query: 'Accessibility' }
  ];

  return (
    <div className="bg-gradient-to-r from-slate-900 via-slate-900/95 to-slate-950 border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xl space-y-4 relative" ref={containerRef}>
      
      {/* Header Info */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center shrink-0 shadow-sm">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm sm:text-base font-extrabold text-white flex items-center gap-2">
              <span>{isArabic ? 'البحث السريع في قسم المراجعة والشرح' : 'Global Revision Search Bar'}</span>
              <span className="px-2 py-0.5 rounded-md bg-amber-500/10 text-amber-400 border border-amber-500/30 text-[10px] font-bold uppercase tracking-wider">
                {allRevisionItems.length} {isArabic ? 'سؤال وشرح' : 'Questions'}
              </span>
            </h3>
            <p className="text-xs text-slate-400">
              {isArabic 
                ? 'ابحث في كافة الأسئلة والشروحات والأمثلة البرمجية مباشرة من لوحة التحكم' 
                : 'Instantly search questions, step-by-step explanations, and code examples across all tracks'}
            </p>
          </div>
        </div>

        <button
          onClick={() => navigate('/revision')}
          className="self-start sm:self-auto px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-400 hover:text-amber-300 border border-slate-700/60 text-xs font-bold transition-all flex items-center gap-1.5 shrink-0"
        >
          <span>{isArabic ? 'فتح مكتبة المراجعة' : 'Open Revision Library'}</span>
          <ArrowRight className={`w-3.5 h-3.5 ${isArabic ? 'rotate-180' : ''}`} />
        </button>
      </div>

      {/* Main Search Input */}
      <form onSubmit={handleSearchSubmit} className="relative">
        <div className="relative flex items-center">
          <Search className={`absolute ${isArabic ? 'right-4' : 'left-4'} w-5 h-5 text-amber-400 pointer-events-none`} />
          <input
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setIsOpen(true);
            }}
            onFocus={() => setIsOpen(true)}
            placeholder={
              isArabic
                ? 'ابحث بالموضوع (مثلاً: React, Flexbox, Eloquent, Solidity, WCAG, Async...)'
                : 'Search any question or topic (e.g. React 19, Flexbox, Eloquent ORM, EVM, Security)...'
            }
            className={`w-full bg-slate-950/90 border border-slate-800 focus:border-amber-500/60 rounded-2xl py-3.5 text-xs sm:text-sm text-slate-100 placeholder-slate-500 focus:outline-none transition-all shadow-inner ${
              isArabic ? 'pr-12 pl-24' : 'pl-12 pr-24'
            }`}
          />

          {/* Right Button inside Input */}
          <div className={`absolute ${isArabic ? 'left-2' : 'right-2'} flex items-center gap-1`}>
            {query && (
              <button
                type="button"
                onClick={() => setQuery('')}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-all"
              >
                <X className="w-4 h-4" />
              </button>
            )}

            <button
              type="submit"
              className="px-3.5 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition-all shadow-md flex items-center gap-1"
            >
              <span>{isArabic ? 'بحث' : 'Search'}</span>
            </button>
          </div>
        </div>

        {/* Live Auto-complete Dropdown */}
        {isOpen && query.trim().length > 0 && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl z-50 overflow-hidden divide-y divide-slate-800/80">
            <div className="p-3 bg-slate-950/80 flex items-center justify-between text-xs text-slate-400">
              <span className="font-semibold flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                {isArabic ? `نتائج البحث السريعة (${searchResults.length} من أصل ${totalMatchCount})` : `Live Matches (${searchResults.length} of ${totalMatchCount})`}
              </span>
              <button
                type="button"
                onClick={handleSearchSubmit}
                className="text-amber-400 hover:underline font-bold text-[11px]"
              >
                {isArabic ? 'عرض كل النتائج ↵' : 'View all results ↵'}
              </button>
            </div>

            {searchResults.length === 0 ? (
              <div className="p-6 text-center text-xs text-slate-400 space-y-1">
                <p className="font-semibold text-slate-300">
                  {isArabic ? 'لم نجد أسئلة تطابق هذا البحث في قاعدة بيانات المراجعة' : 'No review items found for this query'}
                </p>
                <p className="text-slate-500 text-[11px]">
                  {isArabic ? 'اضغط Enter لفتح صفحة المراجعة واستعراض كافة الأسئلة المتاحة.' : 'Press Enter to browse all available questions.'}
                </p>
              </div>
            ) : (
              searchResults.map((item) => {
                const categoryMeta = REVISION_CATEGORIES.find(c => c.id === item.category);

                return (
                  <div
                    key={item.id}
                    onClick={() => {
                      setIsOpen(false);
                      navigate(`/revision?search=${encodeURIComponent(query.trim())}`);
                    }}
                    className="p-3.5 hover:bg-slate-800/60 cursor-pointer transition-colors space-y-1.5 group"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        {categoryMeta && (
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${categoryMeta.color}`}>
                            {categoryMeta.icon} {isArabic ? categoryMeta.nameAr : categoryMeta.nameEn}
                          </span>
                        )}
                        <span className="text-[10px] text-slate-400 font-medium">
                          {item.topic}
                        </span>
                      </div>

                      <span className="text-[10px] text-amber-400 opacity-0 group-hover:opacity-100 transition-opacity font-bold flex items-center gap-0.5">
                        <span>{isArabic ? 'عرض في المراجعة' : 'Open in Revision'}</span>
                        <ChevronRight className="w-3 h-3" />
                      </span>
                    </div>

                    <p className="text-xs font-semibold text-slate-200 line-clamp-2 leading-relaxed group-hover:text-amber-300 transition-colors">
                      {isArabic ? item.questionTextAr : item.questionTextEn}
                    </p>
                  </div>
                );
              })
            )}

            {totalMatchCount > 5 && (
              <button
                type="button"
                onClick={handleSearchSubmit}
                className="w-full p-3 bg-slate-950/90 hover:bg-slate-800/80 text-amber-400 text-xs font-bold text-center transition-colors flex items-center justify-center gap-1"
              >
                <span>{isArabic ? `عرض باقي النتائج (${totalMatchCount - 5} سؤال إضافي) في صفحة المراجعة` : `View remaining ${totalMatchCount - 5} questions in Revision`}</span>
                <ArrowRight className={`w-3.5 h-3.5 ${isArabic ? 'rotate-180' : ''}`} />
              </button>
            )}
          </div>
        )}
      </form>

      {/* Popular Search Topic Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none pt-1">
        <span className="text-[11px] font-semibold text-slate-400 shrink-0 flex items-center gap-1">
          <Layers className="w-3 h-3 text-amber-400" />
          {isArabic ? 'مواضيع شائعة:' : 'Popular Topics:'}
        </span>

        {popularTopics.map((top, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => handleQuickTopicClick(top.query)}
            className="px-2.5 py-1 rounded-lg bg-slate-950 text-slate-300 hover:text-amber-300 border border-slate-800 hover:border-amber-500/40 text-[11px] font-medium transition-all shrink-0 hover:bg-slate-900"
          >
            {isArabic ? top.labelAr : top.labelEn}
          </button>
        ))}
      </div>
    </div>
  );
};

export default DashboardRevisionSearch;
