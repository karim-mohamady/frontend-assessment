/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate, useLocation, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import {
  BookOpen,
  Search,
  Filter,
  CheckCircle,
  XCircle,
  Code,
  Sparkles,
  Bookmark,
  Check,
  Copy,
  ChevronDown,
  ChevronUp,
  Eye,
  EyeOff,
  Layers,
  Award,
  Terminal,
  HelpCircle,
  ExternalLink,
  RotateCcw,
  SlidersHorizontal,
  Flame,
  Zap,
  StickyNote,
  FileText,
  Edit3
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { CareerTrack, Difficulty, QuestionCategory } from '../types';
import {
  RevisionItem,
  getAllRevisionItems,
  REVISION_CATEGORIES
} from '../data/revisionData';
import { QuickQuizModal } from '../components/QuickQuizModal';
import { KnowledgeGapsSection } from '../components/KnowledgeGapsSection';
import { MyNotesPanel, QuestionNote } from '../components/MyNotesPanel';
import { SpacedRepetitionDeck } from '../components/SpacedRepetitionDeck';

export const Revision: React.FC = () => {
  const { selectedTrack, setTrack, language, t, progress } = useApp();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();

  // Mode switcher: 'library' or 'spaced_repetition'
  const [viewMode, setViewMode] = useState<'library' | 'spaced_repetition'>('library');

  // Filter States
  const [activeCategory, setActiveCategory] = useState<QuestionCategory | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState<Difficulty | 'all'>('all');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [sortOrder, setSortOrder] = useState<'standard' | 'difficulty' | 'topic'>('standard');
  const [selfTestingMode, setSelfTestingMode] = useState(false);
  const [expandedCardIds, setExpandedCardIds] = useState<Set<string>>(new Set());
  const [isQuickQuizOpen, setIsQuickQuizOpen] = useState(false);
  const [customQuizItems, setCustomQuizItems] = useState<RevisionItem[] | null>(null);
  const [customQuizTitle, setCustomQuizTitle] = useState<string | undefined>(undefined);

  // Sync initial query from URL search or navigation state
  useEffect(() => {
    const q = searchParams.get('search') || (location.state as any)?.searchQuery || '';
    if (q) {
      setSearchQuery(q);
    }
    const cat = searchParams.get('category');
    if (cat) {
      setActiveCategory(cat as any);
    }
  }, [searchParams, location.state]);

  // Bookmarks & Mastery state stored in localStorage
  const [bookmarkedIds, setBookmarkedIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('revision_bookmarks');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [masteredIds, setMasteredIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('revision_mastered');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // User notes stored in localStorage
  const [userNotes, setUserNotes] = useState<Record<string, QuestionNote>>(() => {
    try {
      const saved = localStorage.getItem('revision_user_notes');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  const [isNotesPanelOpen, setIsNotesPanelOpen] = useState(false);
  const [openNoteCardIds, setOpenNoteCardIds] = useState<Set<string>>(new Set());
  const [draftNotes, setDraftNotes] = useState<Record<string, string>>({});

  // Copied feedback toast
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    localStorage.setItem('revision_bookmarks', JSON.stringify(bookmarkedIds));
  }, [bookmarkedIds]);

  useEffect(() => {
    localStorage.setItem('revision_mastered', JSON.stringify(masteredIds));
  }, [masteredIds]);

  useEffect(() => {
    localStorage.setItem('revision_user_notes', JSON.stringify(userNotes));
  }, [userNotes]);

  const handleSaveNote = (questionId: string, noteText: string, item?: RevisionItem) => {
    if (!noteText.trim()) {
      handleDeleteNote(questionId);
      return;
    }
    const revItem = item || allItems.find(i => i.id === questionId);
    setUserNotes(prev => ({
      ...prev,
      [questionId]: {
        questionId,
        noteText: noteText.trim(),
        updatedAt: new Date().toISOString(),
        questionTopic: revItem?.topic || 'General',
        questionTextEn: revItem?.questionTextEn || '',
        questionTextAr: revItem?.questionTextAr || '',
        category: revItem?.category
      }
    }));
  };

  const handleDeleteNote = (questionId: string) => {
    setUserNotes(prev => {
      const next = { ...prev };
      delete next[questionId];
      return next;
    });
    setDraftNotes(prev => {
      const next = { ...prev };
      delete next[questionId];
      return next;
    });
  };

  const toggleNoteCardInput = (id: string, initialNoteText: string = '') => {
    setOpenNoteCardIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
        if (draftNotes[id] === undefined) {
          setDraftNotes(d => ({ ...d, [id]: initialNoteText }));
        }
      }
      return next;
    });
  };

  const handleSelectQuestionFromNotes = (questionId: string) => {
    // Scroll to target card if present
    const el = document.getElementById(`revision-card-${questionId}`);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    } else {
      // Find item category and navigate filter
      const targetItem = allItems.find(i => i.id === questionId);
      if (targetItem) {
        setSearchQuery(targetItem.topic);
      }
    }
  };

  // Load all revision items once
  const allItems = useMemo(() => getAllRevisionItems(), []);

  // Filter by Track
  const trackItems = useMemo(() => {
    if (selectedTrack === 'fullstack') return allItems;
    return allItems.filter(item => {
      if (item.track === selectedTrack) return true;
      if (item.category === 'english') return true; // English is shared across all tracks
      return false;
    });
  }, [allItems, selectedTrack]);

  // Available categories for current track
  const availableCategories = useMemo(() => {
    return REVISION_CATEGORIES.filter(cat => {
      if (selectedTrack === 'fullstack') return true;
      return cat.track.includes(selectedTrack) || cat.id === 'english';
    });
  }, [selectedTrack]);

  // Filtered and Sorted items
  const filteredItems = useMemo(() => {
    let result = [...trackItems];

    // Filter Category
    if (activeCategory !== 'all') {
      result = result.filter(item => item.category === activeCategory);
    }

    // Filter Difficulty
    if (selectedDifficulty !== 'all') {
      result = result.filter(item => item.difficulty === selectedDifficulty);
    }

    // Filter Type
    if (selectedType !== 'all') {
      result = result.filter(item => item.type === selectedType);
    }

    // Filter Search
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      result = result.filter(item =>
        item.questionTextEn.toLowerCase().includes(query) ||
        item.questionTextAr.includes(query) ||
        item.topic.toLowerCase().includes(query) ||
        item.explanationEn.toLowerCase().includes(query) ||
        item.explanationAr.includes(query) ||
        item.practicalCodeExample.toLowerCase().includes(query)
      );
    }

    // Sort
    if (sortOrder === 'standard') {
      result.sort((a, b) => a.standardOrder - b.standardOrder);
    } else if (sortOrder === 'difficulty') {
      const weights: Record<Difficulty, number> = { easy: 1, medium: 2, hard: 3, expert: 4 };
      result.sort((a, b) => weights[a.difficulty] - weights[b.difficulty]);
    } else if (sortOrder === 'topic') {
      result.sort((a, b) => a.topic.localeCompare(b.topic));
    }

    return result;
  }, [trackItems, activeCategory, selectedDifficulty, selectedType, searchQuery, sortOrder]);

  // Visible Items (Pagination / Infinite scroll limit for performance)
  const [visibleCount, setVisibleCount] = useState(20);
  const visibleItems = useMemo(() => filteredItems.slice(0, visibleCount), [filteredItems, visibleCount]);

  // Reset pagination on filter change
  useEffect(() => {
    setVisibleCount(20);
  }, [selectedTrack, activeCategory, selectedDifficulty, selectedType, searchQuery, sortOrder]);

  // Toggle card expansion
  const toggleCard = (id: string) => {
    setExpandedCardIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const expandAll = () => {
    setExpandedCardIds(new Set(filteredItems.map(item => item.id)));
  };

  const collapseAll = () => {
    setExpandedCardIds(new Set());
  };

  // Bookmark toggle
  const toggleBookmark = (id: string) => {
    setBookmarkedIds(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  // Mastered toggle
  const toggleMastered = (id: string) => {
    setMasteredIds(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  // Copy code or text
  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleFilterGapTopic = (topicQuery: string, categoryId?: QuestionCategory) => {
    setSearchQuery(topicQuery);
    if (categoryId) {
      setActiveCategory(categoryId);
    }
  };

  const handleStartGapQuiz = (items: RevisionItem[], gapTitle: string) => {
    setCustomQuizItems(items);
    setCustomQuizTitle(gapTitle);
    setIsQuickQuizOpen(true);
  };

  const isArabic = language === 'ar';

  return (
    <div className={`min-h-screen bg-slate-950 text-slate-100 pb-20 ${isArabic ? 'rtl' : 'ltr'}`}>
      {/* Hero Header */}
      <div className="relative overflow-hidden bg-gradient-to-b from-slate-900 via-slate-900/90 to-slate-950 border-b border-slate-800 py-12 px-4 sm:px-6 lg:px-8">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(245,158,11,0.15),rgba(255,255,255,0))]" />
        
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="space-y-3 max-w-3xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-semibold uppercase tracking-wider">
                <BookOpen className="w-3.5 h-3.5" />
                {isArabic ? 'قسم المراجعة والأسئلة الشاملة' : 'Comprehensive Revision & Study Engine'}
              </div>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                {isArabic ? 'مراجعة الأسئلة والشروحات والأمثلة البرمجية' : 'Questions, Explanations & Practical Code Examples'}
              </h1>
              <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
                {isArabic
                  ? 'دليل دراسي شامل لكل تخصص ولغة برمجية. يتضمن السؤال، خيارات الإجابة، الشرح المفصل، وأمثلة كود تطبيقية قياسية مع ترتيب هرمي تعليمي.'
                  : 'Complete structured study guide across all developer tracks. Includes questions, option breakdowns, detailed step-by-step explanations, and real practical code snippets.'}
              </p>
            </div>

            {/* Quick Stats & Quick Quiz / Notes Trigger */}
            <div className="flex flex-col gap-3 w-full md:w-auto">
              <div className="grid grid-cols-4 gap-2 bg-slate-900/80 border border-slate-800 p-3 sm:p-4 rounded-2xl backdrop-blur-md">
                <div className="text-center px-1">
                  <div className="text-xl sm:text-2xl font-bold text-amber-400">{filteredItems.length}</div>
                  <div className="text-[10px] sm:text-xs text-slate-400 mt-0.5">{isArabic ? 'سؤال متاح' : 'Questions'}</div>
                </div>
                <div className="text-center px-1 border-x border-slate-800">
                  <div className="text-xl sm:text-2xl font-bold text-emerald-400">{masteredIds.length}</div>
                  <div className="text-[10px] sm:text-xs text-slate-400 mt-0.5">{isArabic ? 'تم إتقانه' : 'Mastered'}</div>
                </div>
                <div className="text-center px-1 border-r border-slate-800 rtl:border-l rtl:border-r-0">
                  <div className="text-xl sm:text-2xl font-bold text-blue-400">{bookmarkedIds.length}</div>
                  <div className="text-[10px] sm:text-xs text-slate-400 mt-0.5">{isArabic ? 'محفوظ' : 'Saved'}</div>
                </div>
                <div className="text-center px-1">
                  <div className="text-xl sm:text-2xl font-bold text-amber-300">{Object.keys(userNotes).length}</div>
                  <div className="text-[10px] sm:text-xs text-slate-400 mt-0.5">{isArabic ? 'ملاحظاتي' : 'My Notes'}</div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsQuickQuizOpen(true)}
                  className="flex-1 py-3 px-4 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-slate-950 font-extrabold text-xs sm:text-sm transition-all shadow-lg shadow-amber-500/20 hover:scale-[1.01] flex items-center justify-center gap-2 border border-amber-300/40 cursor-pointer"
                >
                  <Zap className="w-4 h-4 fill-slate-950" />
                  <span>{isArabic ? 'اختبار سريع' : 'Quick Quiz'}</span>
                </button>

                <button
                  onClick={() => setIsNotesPanelOpen(true)}
                  className="py-3 px-4 rounded-2xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-amber-400 hover:text-amber-300 font-extrabold text-xs sm:text-sm transition-all flex items-center justify-center gap-2 shadow-md cursor-pointer shrink-0"
                >
                  <StickyNote className="w-4 h-4" />
                  <span>{isArabic ? 'ملاحظاتي' : 'My Notes'}</span>
                  {Object.keys(userNotes).length > 0 && (
                    <span className="w-5 h-5 rounded-full bg-amber-500 text-slate-950 text-[10px] font-black flex items-center justify-center">
                      {Object.keys(userNotes).length}
                    </span>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Track Switcher Tabs */}
          <div className="mt-8 pt-6 border-t border-slate-800/80 flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            <span className="text-xs font-semibold text-slate-400 flex items-center gap-1.5 shrink-0 pl-1">
              <Layers className="w-3.5 h-3.5 text-amber-400" />
              {isArabic ? 'التراك المختار:' : 'Career Track:'}
            </span>

            {[
              { id: 'frontend', nameEn: 'Frontend Dev', nameAr: 'تراك الواجهة الأمامية', icon: '💻' },
              { id: 'backend', nameEn: 'Backend Dev', nameAr: 'تراك الباك إند والقواعد', icon: '⚙️' },
              { id: 'uiux', nameEn: 'UI/UX Design', nameAr: 'تصميم الواجهات UI/UX', icon: '✨' },
              { id: 'web3', nameEn: 'Web3 & Crypto', nameAr: 'تراك Web3 والبلوكشين', icon: '🪙' },
              { id: 'fullstack', nameEn: 'Fullstack Developer', nameAr: 'شامل كل التخصصات', icon: '🚀' }
            ].map(tr => {
              const isActive = selectedTrack === tr.id;
              return (
                <button
                  key={tr.id}
                  onClick={() => {
                    setTrack(tr.id as CareerTrack);
                    setActiveCategory('all');
                  }}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-medium transition-all shrink-0 border ${
                    isActive
                      ? 'bg-amber-500 text-slate-950 font-bold border-amber-400 shadow-lg shadow-amber-500/20 scale-105'
                      : 'bg-slate-900/60 text-slate-300 border-slate-800 hover:border-slate-700 hover:text-white'
                  }`}
                >
                  <span>{tr.icon}</span>
                  <span>{isArabic ? tr.nameAr : tr.nameEn}</span>
                </button>
              );
            })}
          </div>

          {/* Mode Switcher Tabs (Explainer Library vs Spaced Repetition) */}
          <div className="mt-6 flex items-center gap-3 border-t border-slate-800/80 pt-4">
            <button
              onClick={() => setViewMode('library')}
              className={`px-5 py-2 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center gap-2 ${
                viewMode === 'library'
                  ? 'bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/20'
                  : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              <span>{isArabic ? 'مكتبة الشروحات والأسئلة' : 'Explainer Library'}</span>
            </button>

            <button
              onClick={() => setViewMode('spaced_repetition')}
              className={`px-5 py-2 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center gap-2 ${
                viewMode === 'spaced_repetition'
                  ? 'bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/20'
                  : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              <Layers className="w-4 h-4" />
              <span>{isArabic ? 'بطاقات المراجعة (Flashcards)' : 'Spaced Repetition Flashcards'}</span>
            </button>
          </div>
        </div>
      </div>

      {viewMode === 'spaced_repetition' ? (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <SpacedRepetitionDeck />
        </div>
      ) : (
        <>
          {/* Knowledge Gaps Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
        <KnowledgeGapsSection
          completedAssessments={progress?.completedAssessments || []}
          selectedTrack={selectedTrack}
          allRevisionItems={trackItems}
          onFilterTopic={handleFilterGapTopic}
          onStartQuizForGap={handleStartGapQuiz}
          isArabic={isArabic}
        />
      </div>

      {/* Filter and Control Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6 relative z-20">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-5 shadow-2xl space-y-4">
          
          {/* Categories Selector Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none border-b border-slate-800/80">
            <button
              onClick={() => setActiveCategory('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all shrink-0 border ${
                activeCategory === 'all'
                  ? 'bg-slate-100 text-slate-900 border-white font-semibold'
                  : 'bg-slate-950/80 text-slate-400 border-slate-800 hover:text-slate-200'
              }`}
            >
              {isArabic ? 'جميع اللغات والتخصصات' : 'All Categories'} ({trackItems.length})
            </button>

            {availableCategories.map(cat => {
              const catCount = trackItems.filter(i => i.category === cat.id).length;
              const isActive = activeCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all shrink-0 border ${
                    isActive
                      ? `${cat.color} font-bold border-current shadow-sm`
                      : 'bg-slate-950/80 text-slate-400 border-slate-800 hover:border-slate-700 hover:text-slate-200'
                  }`}
                >
                  <span>{cat.icon}</span>
                  <span>{isArabic ? cat.nameAr : cat.nameEn}</span>
                  <span className="text-[10px] opacity-75">({catCount})</span>
                </button>
              );
            })}
          </div>

          {/* Search, Filters, and Display Modes */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3">
            {/* Search Input */}
            <div className="lg:col-span-5 relative">
              <Search className={`absolute top-3 ${isArabic ? 'right-3' : 'left-3'} w-4 h-4 text-slate-500`} />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder={isArabic ? 'ابحث عن سؤال، مفهوم، دالة، أو كود...' : 'Search questions, concepts, code snippets...'}
                className={`w-full bg-slate-950 border border-slate-800 rounded-xl py-2 text-xs sm:text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-amber-500/50 ${
                  isArabic ? 'pr-9 pl-3' : 'pl-9 pr-3'
                }`}
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className={`absolute top-2.5 ${isArabic ? 'left-3' : 'right-3'} text-xs text-slate-500 hover:text-slate-300`}
                >
                  ✕
                </button>
              )}
            </div>

            {/* Difficulty Filter */}
            <div className="lg:col-span-2">
              <select
                value={selectedDifficulty}
                onChange={e => setSelectedDifficulty(e.target.value as Difficulty | 'all')}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-300 focus:outline-none focus:border-amber-500/50"
              >
                <option value="all">{isArabic ? 'كل المستويات' : 'All Difficulties'}</option>
                <option value="easy">{isArabic ? '🟢 مبتدئ (Easy)' : '🟢 Easy'}</option>
                <option value="medium">{isArabic ? '🟡 متوسط (Medium)' : '🟡 Medium'}</option>
                <option value="hard">{isArabic ? '🔴 متقدم (Hard)' : '🔴 Hard'}</option>
                <option value="expert">{isArabic ? '🟣 خبير (Expert)' : '🟣 Expert'}</option>
              </select>
            </div>

            {/* Sort Order */}
            <div className="lg:col-span-2">
              <select
                value={sortOrder}
                onChange={e => setSortOrder(e.target.value as any)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-300 focus:outline-none focus:border-amber-500/50"
              >
                <option value="standard">{isArabic ? 'ترتيب أستاندرد هرمي' : 'Standard Sequence'}</option>
                <option value="difficulty">{isArabic ? 'ترتيب حسب الصعوبة' : 'By Difficulty'}</option>
                <option value="topic">{isArabic ? 'أبجدياً حسب الموضوع' : 'By Topic'}</option>
              </select>
            </div>

            {/* Display Actions (Self Testing & Expand/Collapse) */}
            <div className="lg:col-span-3 flex items-center justify-end gap-2">
              <button
                onClick={() => setSelfTestingMode(!selfTestingMode)}
                className={`flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold border transition-all ${
                  selfTestingMode
                    ? 'bg-purple-500/20 text-purple-300 border-purple-500/50 shadow-sm'
                    : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-slate-200'
                }`}
                title={isArabic ? 'إخفاء الأجوبة لاختبار نفسك قبل الاطلاع على الإجابة' : 'Hide answers for self testing'}
              >
                {selfTestingMode ? <EyeOff className="w-3.5 h-3.5 text-purple-400" /> : <Eye className="w-3.5 h-3.5" />}
                <span>{selfTestingMode ? (isArabic ? 'اختبار ذاتي (إجابات مخفية)' : 'Self-Test Active') : (isArabic ? 'وضع الاختيارات' : 'Self-Test Mode')}</span>
              </button>

              <button
                onClick={expandedCardIds.size === filteredItems.length ? collapseAll : expandAll}
                className="px-2.5 py-2 rounded-xl bg-slate-950 text-slate-400 border border-slate-800 hover:text-slate-200 text-xs font-medium flex items-center gap-1"
                title={isArabic ? 'توسيع أو طي جميع الكروت' : 'Expand / Collapse all'}
              >
                {expandedCardIds.size === filteredItems.length ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Question Cards Feed */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 space-y-6">
        {filteredItems.length === 0 ? (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center space-y-4">
            <HelpCircle className="w-12 h-12 text-slate-600 mx-auto" />
            <h3 className="text-lg font-bold text-slate-300">
              {isArabic ? 'لم نجد أسئلة تطابق البحث أو الفلاتر' : 'No review questions match your filter'}
            </h3>
            <p className="text-slate-500 text-xs sm:text-sm max-w-md mx-auto">
              {isArabic
                ? 'جرب البحث عن كلمة أخرى، أو تغيير التراك المختار أو إعادة ضبط الفلاتر للاطلاع على باقي الأسئلة.'
                : 'Try searching for another keyword or resetting your filters.'}
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setActiveCategory('all');
                setSelectedDifficulty('all');
              }}
              className="px-4 py-2 bg-amber-500 text-slate-950 font-bold rounded-xl text-xs hover:bg-amber-400 transition-all inline-flex items-center gap-2"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              {isArabic ? 'إعادة ضبط الفلاتر' : 'Reset Filters'}
            </button>
          </div>
        ) : (
          visibleItems.map((item, index) => {
            const isExpanded = expandedCardIds.has(item.id) || !selfTestingMode;
            const isBookmarked = bookmarkedIds.includes(item.id);
            const isMastered = masteredIds.includes(item.id);
            const categoryMeta = REVISION_CATEGORIES.find(c => c.id === item.category);

            const isNoteOpen = openNoteCardIds.has(item.id);
            const savedNote = userNotes[item.id];

            return (
              <motion.div
                key={item.id}
                id={`revision-card-${item.id}`}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2, delay: Math.min(index * 0.03, 0.3) }}
                className={`bg-slate-900 border rounded-2xl overflow-hidden transition-all duration-200 ${
                  isMastered
                    ? 'border-emerald-500/30 bg-slate-900/90 shadow-sm'
                    : savedNote
                    ? 'border-amber-500/30 bg-slate-900/95 shadow-sm'
                    : 'border-slate-800 hover:border-slate-700'
                }`}
              >
                {/* Card Header Bar */}
                <div className="p-4 sm:p-5 border-b border-slate-800/80 bg-slate-900/50 flex flex-wrap items-center justify-between gap-3">
                  <div className="flex flex-wrap items-center gap-2">
                    {/* Index Sequence Badge */}
                    <span className="px-2.5 py-1 rounded-lg bg-slate-950 text-slate-400 text-xs font-mono font-bold border border-slate-800">
                      #{index + 1}
                    </span>

                    {/* Category Pill */}
                    {categoryMeta && (
                      <span className={`px-2.5 py-1 rounded-lg text-xs font-semibold border ${categoryMeta.color} flex items-center gap-1`}>
                        <span>{categoryMeta.icon}</span>
                        <span>{isArabic ? categoryMeta.nameAr : categoryMeta.nameEn}</span>
                      </span>
                    )}

                    {/* Topic Badge */}
                    <span className="px-2.5 py-1 rounded-lg bg-slate-800/80 text-slate-300 text-xs font-medium border border-slate-700/50">
                      {item.topic}
                    </span>

                    {/* Difficulty Badge */}
                    <span
                      className={`px-2 py-0.5 rounded-md text-[11px] font-bold uppercase tracking-wider ${
                        item.difficulty === 'easy'
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                          : item.difficulty === 'medium'
                          ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                          : item.difficulty === 'hard'
                          ? 'bg-rose-500/10 text-rose-400 border border-rose-500/30'
                          : 'bg-purple-500/10 text-purple-400 border border-purple-500/30'
                      }`}
                    >
                      {item.difficulty}
                    </span>
                  </div>

                  {/* Actions (Note, Bookmark, Mastered) */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => toggleNoteCardInput(item.id, savedNote?.noteText || '')}
                      className={`px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all border cursor-pointer ${
                        savedNote
                          ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                          : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-slate-200'
                      }`}
                      title={isArabic ? 'إضافة / تعديل ملاحظة شخصية' : 'Add or Edit Personal Note'}
                    >
                      <StickyNote className="w-3.5 h-3.5" />
                      <span>{savedNote ? (isArabic ? 'ملاحظة ✓' : 'Note ✓') : (isArabic ? 'ملاحظة' : 'Note')}</span>
                    </button>

                    <button
                      onClick={() => toggleMastered(item.id)}
                      className={`px-3 py-1 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all border cursor-pointer ${
                        isMastered
                          ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40 shadow-sm'
                          : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-slate-200'
                      }`}
                      title={isArabic ? 'تعليم كـ متمكن ومتقن' : 'Mark as Mastered'}
                    >
                      <CheckCircle className="w-3.5 h-3.5" />
                      <span>{isMastered ? (isArabic ? 'مُتقَن' : 'Mastered') : (isArabic ? 'تعليم كإتقان' : 'Master')}</span>
                    </button>

                    <button
                      onClick={() => toggleBookmark(item.id)}
                      className={`p-1.5 rounded-lg border transition-all cursor-pointer ${
                        isBookmarked
                          ? 'bg-amber-500/20 text-amber-400 border-amber-500/40'
                          : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-slate-200'
                      }`}
                      title={isArabic ? 'حفظ في المراجعة المرجعية' : 'Bookmark Question'}
                    >
                      <Bookmark className="w-4 h-4" />
                    </button>

                    {selfTestingMode && (
                      <button
                        onClick={() => toggleCard(item.id)}
                        className="px-2.5 py-1 rounded-lg bg-purple-500/10 text-purple-300 border border-purple-500/30 hover:bg-purple-500/20 text-xs font-semibold flex items-center gap-1 cursor-pointer"
                      >
                        {isExpanded ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                        <span>{isExpanded ? (isArabic ? 'إخفاء الإجابة' : 'Hide Answer') : (isArabic ? 'كشف الإجابة' : 'Show Answer')}</span>
                      </button>
                    )}
                  </div>
                </div>

                {/* Card Main Content */}
                <div className="p-5 sm:p-6 space-y-5">
                  {/* Card Note Section (If open or saved note exists) */}
                  {(isNoteOpen || savedNote) && (
                    <div className="bg-amber-500/5 border border-amber-500/20 rounded-xl p-4 space-y-3">
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-wider">
                          <StickyNote className="w-4 h-4" />
                          <span>{isArabic ? 'ملاحظتي الشخصية:' : 'My Personal Note:'}</span>
                        </div>
                        {savedNote && !isNoteOpen && (
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => toggleNoteCardInput(item.id, savedNote.noteText)}
                              className="text-[11px] text-amber-400 hover:text-amber-300 font-semibold flex items-center gap-1 bg-amber-500/10 px-2 py-0.5 rounded-lg border border-amber-500/20 cursor-pointer"
                            >
                              <Edit3 className="w-3 h-3" />
                              <span>{isArabic ? 'تعديل' : 'Edit'}</span>
                            </button>
                            <button
                              onClick={() => handleDeleteNote(item.id)}
                              className="text-[11px] text-rose-400 hover:text-rose-300 font-semibold flex items-center gap-1 bg-rose-500/10 px-2 py-0.5 rounded-lg border border-rose-500/20 cursor-pointer"
                            >
                              <span>{isArabic ? 'حذف' : 'Delete'}</span>
                            </button>
                          </div>
                        )}
                      </div>

                      {isNoteOpen ? (
                        <div className="space-y-2.5">
                          <textarea
                            value={draftNotes[item.id] !== undefined ? draftNotes[item.id] : (savedNote?.noteText || '')}
                            onChange={(e) => setDraftNotes(prev => ({ ...prev, [item.id]: e.target.value }))}
                            placeholder={isArabic ? 'اكتب ملاحظتك الشخصية أو التلخيص السريع لهذا السؤال...' : 'Write your personal summary or key reminder for this question...'}
                            rows={3}
                            className="w-full bg-slate-950 border border-amber-500/40 focus:border-amber-400 rounded-xl p-3 text-xs sm:text-sm text-amber-100 placeholder-slate-500 focus:outline-none resize-none font-sans"
                          />
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => toggleNoteCardInput(item.id)}
                              className="px-3 py-1 rounded-lg bg-slate-800 text-slate-300 hover:text-white text-xs font-bold cursor-pointer"
                            >
                              {isArabic ? 'إلغاء' : 'Cancel'}
                            </button>
                            <button
                              onClick={() => {
                                handleSaveNote(item.id, draftNotes[item.id] || '', item);
                                toggleNoteCardInput(item.id);
                              }}
                              className="px-3 py-1 rounded-lg bg-amber-500 text-slate-950 hover:bg-amber-400 text-xs font-bold shadow-md cursor-pointer"
                            >
                              {isArabic ? 'حفظ الملاحظة' : 'Save Note'}
                            </button>
                          </div>
                        </div>
                      ) : (
                        <p className="text-xs sm:text-sm text-amber-100/90 whitespace-pre-wrap leading-relaxed">
                          {savedNote?.noteText}
                        </p>
                      )}
                    </div>
                  )}

                  {/* Question Title */}
                  <div className="space-y-3">
                    <h2 className="text-base sm:text-lg font-semibold text-slate-100 leading-snug">
                      {isArabic ? item.questionTextAr : item.questionTextEn}
                    </h2>

                    {/* Question Code Snippet (if any) */}
                    {item.codeSnippet && (
                      <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 font-mono text-xs sm:text-sm text-amber-300 overflow-x-auto ltr text-left">
                        <pre>{item.codeSnippet}</pre>
                      </div>
                    )}
                  </div>

                  {/* Options List / Breakdown */}
                  {item.optionsEn && item.optionsEn.length > 0 && (
                    <div className="space-y-2 pt-2">
                      <div className="text-xs font-semibold text-slate-400 mb-2">
                        {isArabic ? 'الخيارات المتاحة:' : 'Available Options:'}
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {item.optionsEn.map((optEn, optIdx) => {
                          const optAr = item.optionsAr[optIdx] || optEn;
                          const optText = isArabic ? optAr : optEn;
                          
                          // Check if this option is the correct answer
                          const isCorrect = isExpanded && (
                            item.correctAnswerTextEn.includes(optEn) ||
                            item.correctAnswerTextAr.includes(optAr) ||
                            optEn === item.correctAnswerTextEn
                          );

                          return (
                            <div
                              key={optIdx}
                              className={`p-3 rounded-xl border text-xs sm:text-sm flex items-center justify-between gap-3 transition-all ${
                                isCorrect
                                  ? 'bg-emerald-500/10 border-emerald-500/50 text-emerald-200 font-semibold shadow-sm'
                                  : isExpanded
                                  ? 'bg-slate-950/60 border-slate-800/80 text-slate-400'
                                  : 'bg-slate-950/40 border-slate-800/60 text-slate-300'
                              }`}
                            >
                              <div className="flex items-center gap-2">
                                <span className={`w-5 h-5 rounded-full text-[10px] font-bold flex items-center justify-center border ${
                                  isCorrect
                                    ? 'bg-emerald-500 text-slate-950 border-emerald-400'
                                    : 'bg-slate-800 text-slate-400 border-slate-700'
                                }`}>
                                  {String.fromCharCode(65 + optIdx)}
                                </span>
                                <span>{optText}</span>
                              </div>

                              {isCorrect && (
                                <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 text-[10px] font-bold border border-emerald-500/30 shrink-0">
                                  {isArabic ? 'إجابة صحيحة ✓' : 'Correct Answer'}
                                </span>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Revealed Section (Answer Summary + Explanation + Code Example) */}
                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.2 }}
                        className="space-y-4 pt-4 border-t border-slate-800"
                      >
                        {/* Correct Answer Summary Box */}
                        <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-4 flex items-start gap-3">
                          <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                          <div className="space-y-1">
                            <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider block">
                              {isArabic ? 'الإجابة النموذجية الصحيحة:' : 'Official Correct Answer:'}
                            </span>
                            <p className="text-sm font-semibold text-emerald-100">
                              {isArabic ? item.correctAnswerTextAr : item.correctAnswerTextEn}
                            </p>
                          </div>
                        </div>

                        {/* Detailed Step-by-Step Explanation */}
                        <div className="bg-slate-950/80 border border-slate-800/80 rounded-xl p-4 space-y-2">
                          <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-wider">
                            <Sparkles className="w-4 h-4" />
                            <span>{isArabic ? 'الشرح التفصيلي والتفسير العلمي:' : 'Technical Explanation:'}</span>
                          </div>
                          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                            {isArabic ? item.explanationAr : item.explanationEn}
                          </p>
                        </div>

                        {/* Practical Code Example Box */}
                        {item.practicalCodeExample && (
                          <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-2">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2 text-cyan-400 text-xs font-bold uppercase tracking-wider">
                                <Code className="w-4 h-4" />
                                <span>{isArabic ? 'مثال برمجي تطبيقي (Practical Code Example):' : 'Practical Code Snippet:'}</span>
                              </div>

                              <button
                                onClick={() => copyToClipboard(item.practicalCodeExample, item.id)}
                                className="text-xs text-slate-400 hover:text-slate-200 flex items-center gap-1 bg-slate-900 border border-slate-800 px-2.5 py-1 rounded-lg transition-all"
                              >
                                {copiedId === item.id ? (
                                  <>
                                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                                    <span className="text-emerald-400">{isArabic ? 'تم النسخ!' : 'Copied!'}</span>
                                  </>
                                ) : (
                                  <>
                                    <Copy className="w-3.5 h-3.5" />
                                    <span>{isArabic ? 'نسخ الكود' : 'Copy Code'}</span>
                                  </>
                                )}
                              </button>
                            </div>

                            <div className="font-mono text-xs sm:text-sm text-cyan-200 bg-slate-900/90 border border-slate-800 p-3.5 rounded-lg overflow-x-auto ltr text-left">
                              <pre>{item.practicalCodeExample}</pre>
                            </div>
                          </div>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            );
          })
        )}

        {/* Load More Button */}
        {visibleCount < filteredItems.length && (
          <div className="text-center pt-6">
            <button
              onClick={() => setVisibleCount(prev => prev + 20)}
              className="px-6 py-3 bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-800 hover:border-slate-700 font-bold rounded-2xl text-xs sm:text-sm transition-all shadow-lg inline-flex items-center gap-2"
            >
              <span>{isArabic ? `عرض المزيد من الأسئلة (${filteredItems.length - visibleCount} متبقية)` : `Load More (${filteredItems.length - visibleCount} remaining)`}</span>
              <ChevronDown className="w-4 h-4 text-amber-400" />
            </button>
          </div>
        )}
      </div>
      </>
      )}

      {/* Quick Quiz Modal */}
      <QuickQuizModal
        isOpen={isQuickQuizOpen}
        onClose={() => {
          setIsQuickQuizOpen(false);
          setCustomQuizItems(null);
          setCustomQuizTitle(undefined);
        }}
        availableItems={customQuizItems || (filteredItems.length > 0 ? filteredItems : trackItems)}
        categoryTitle={
          customQuizTitle ||
          (activeCategory !== 'all'
            ? REVISION_CATEGORIES.find(c => c.id === activeCategory)?.nameAr || activeCategory
            : undefined)
        }
      />
      {/* My Notes Persistent Slide-over Panel */}
      <MyNotesPanel
        isOpen={isNotesPanelOpen}
        onClose={() => setIsNotesPanelOpen(false)}
        notes={userNotes}
        onSaveNote={handleSaveNote}
        onDeleteNote={handleDeleteNote}
        onSelectQuestion={handleSelectQuestionFromNotes}
        allRevisionItems={allItems}
        isArabic={isArabic}
      />
    </div>
  );
};

export default Revision;
