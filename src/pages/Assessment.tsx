/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { generateProceduralQuestions, getQuestionsByCategory, getQuestionsByTrack, getTrackCategories, generateCertificateId } from '../data/questions';
import { Question, Difficulty, QuestionType, QuestionCategory } from '../types';
import { 
  Play, Pause, BookMarked, ChevronLeft, ChevronRight, Check, AlertCircle, HelpCircle, Flame, Clock, RefreshCw, Bookmark, Award, GraduationCap, ClipboardList, Edit, Eye, Lightbulb, Briefcase, Globe
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { TakeHomeAssignmentStudio } from '../components/TakeHomeAssignmentStudio';

const getCodingQuestionHint = (q: Question, isRtl: boolean): string => {
  if (isRtl && q.hintAr) return q.hintAr;
  if (!isRtl && q.hint) return q.hint;

  // Specific high-fidelity hints for core benchmark questions
  if (q.id === 'css-1') {
    return isRtl 
      ? 'تذكر أن الخصوصية تُحسب بالترتيب: (ID, Class, Element). قارن دقة div#main-text.text-card مقابل #main-text.'
      : 'Remember specificity is calculated in order: (ID, Class, Element). Compare div#main-text.text-card versus #main-text.';
  }
  if (q.id === 'js-1') {
    return isRtl
      ? 'العمليات المتزامنة تنفذ أولاً. ثم الوعود (Microtasks)، ثم المؤقتات (Macrotasks).'
      : 'Synchronous code runs first. Then microtasks (Promises), and finally macrotasks (setTimeout callbacks).';
  }
  if (q.id === 'js-2') {
    return isRtl
      ? 'كل استدعاء لـ makeCounter ينشئ مغلف نطاق (closure scope) مستقل خاص به. تتبع متى يتم استدعاء c1 ومتى c2.'
      : 'Each call to makeCounter creates its own independent closure scope. Track when c1 is called versus c2.';
  }
  if (q.id === 'js-6') {
    return isRtl
      ? 'تحقق من السلوك التاريخي الشهير لـ typeof null في JS، وتذكر أن === لا تقوم بتحويل نوع البيانات.'
      : 'Check the famous historical quirk of typeof null in JS, and remember that === performs no type coercion.';
  }
  if (q.id === 'react-1') {
    return isRtl
      ? 'تعمل دوال التنبيه alert والمؤقتات setTimeout في لقطة مغلقة (closure snapshot) للحالة عند وقت النقر.'
      : 'The alert and setTimeout run inside a closure snapshot of the state value at the exact time of clicking.';
  }

  // Fallback messages for other questions of coding category
  if (q.category === 'javascript') {
    return isRtl
      ? `تلميح لـ ${q.topic}: انتبه لطريقة عمل النطاقات (scope)، المراجع، والوظائف غير المتزامنة في جافا سكريبت.`
      : `Hint for ${q.topic}: Pay attention to scoping, reference types, and asynchronous execution in JS.`;
  }
  if (q.category === 'react') {
    return isRtl
      ? `تلميح لـ ${q.topic}: تذكر أن تحديثات الحالة في ريأكت تتم بشكل غير متزامن وتعتمد على دورة حياة المكون.`
      : `Hint for ${q.topic}: Remember that state updates in React are queued and components capture state at render time.`;
  }
  if (q.category === 'css') {
    return isRtl
      ? `تلميح لـ ${q.topic}: تحقق من تراتبية القواعد، الخصائص الموروثة، وتأثير نموذج الصندوق (Box Model).`
      : `Hint for ${q.topic}: Verify the cascading hierarchy, inherited properties, and the box-model metrics.`;
  }

  return isRtl 
    ? `تلميح لـ ${q.topic}: ركز على المطلوب بدقة وتحقق من بناء الكود البرمجي (Syntax).`
    : `Hint for ${q.topic}: Focus on the precise requirements and inspect the code syntax/logic flow carefully.`;
};

export const Assessment: React.FC = () => {
  const { t, lang, isRtl, toggleGlobalBookmark, progress, saveAssessmentResult, selectedTrack } = useApp();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const getQuestionText = (q: Question) => {
    if (lang === 'ar') return q.questionTextAr;
    if (lang === 'es' && q.questionTextEs) return q.questionTextEs;
    return q.questionText;
  };

  const getQuestionOptions = (q: Question) => {
    if (lang === 'ar') return q.optionsAr || [];
    if (lang === 'es' && q.optionsEs) return q.optionsEs;
    return q.options || [];
  };

  const getQuestionExplanation = (q: Question) => {
    if (lang === 'ar') return q.explanationAr;
    if (lang === 'es' && q.explanationEs) return q.explanationEs;
    return q.explanation;
  };

  const rawCategoryParam = searchParams.get('category');
  const allowedTrackCategories = getTrackCategories(selectedTrack);
  const defaultCategoryForTrack = selectedTrack === 'backend' ? 'laravel' : 'javascript';

  const categoryParam = (rawCategoryParam && allowedTrackCategories.includes(rawCategoryParam as QuestionCategory))
    ? (rawCategoryParam as QuestionCategory)
    : defaultCategoryForTrack;

  const modeParam = searchParams.get('mode') || 'exam'; // 'exam' | 'study' | 'daily'

  // Assessment configurations based on parameters
  const getCategoryTitle = (cat: string) => {
    switch (cat) {
      case 'html': return t('catHtml');
      case 'css': return t('catCss');
      case 'javascript': return t('catJs');
      case 'react': return t('catReact');
      case 'bootstrap': return t('catBs');
      case 'php': return t('catPhp');
      case 'laravel': return t('catLaravel');
      case 'mysql': return t('catMysql');
      case 'backend': return t('catBackend');
      case 'english': return t('catEng');
      default: return 'Evaluation';
    }
  };

  // State
  const [assessmentTab, setAssessmentTab] = useState<'quiz' | 'takehome'>('quiz');
  const STORAGE_KEY = `dev_assessment_session_${categoryParam}_${modeParam}`;
  const [hasSavedSession, setHasSavedSession] = useState(false);
  const [savedSessionData, setSavedSessionData] = useState<any>(null);

  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [userAnswers, setUserAnswers] = useState<{ [qId: string]: any }>({});
  const [localBookmarks, setLocalBookmarks] = useState<string[]>([]);
  const [isAssessmentSubmitted, setIsAssessmentSubmitted] = useState(false);
  const [difficultyFilter, setDifficultyFilter] = useState<Difficulty>('medium');
  const [isQuizConfiguring, setIsQuizConfiguring] = useState(true);
  const [showReviewMode, setShowReviewMode] = useState(false);
  const [hintsUsed, setHintsUsed] = useState<string[]>([]);

  // Timer states
  const [isTimerActive, setIsTimerActive] = useState(true);
  const [timeRemaining, setTimeRemaining] = useState(600); // 10 minutes default
  const [timeElapsed, setTimeElapsed] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Load saved session on mount
  useEffect(() => {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      try {
        const parsed = JSON.parse(raw);
        if (parsed && parsed.questions && parsed.questions.length > 0) {
          setHasSavedSession(true);
          setSavedSessionData(parsed);

          // For daily challenge, automatically restore immediately on mount
          if (modeParam === 'daily') {
            setQuestions(parsed.questions);
            setCurrentIdx(parsed.currentIdx);
            setUserAnswers(parsed.userAnswers || {});
            setLocalBookmarks(parsed.localBookmarks || []);
            setTimeRemaining(parsed.timeRemaining);
            setTimeElapsed(parsed.timeElapsed || 0);
            setDifficultyFilter(parsed.difficultyFilter || 'medium');
            setShowReviewMode(parsed.showReviewMode || false);
            setHintsUsed(parsed.hintsUsed || []);
            setIsQuizConfiguring(false);
          }
        }
      } catch (err) {
        console.error("Error reading saved session:", err);
      }
    } else {
      setHasSavedSession(false);
      setSavedSessionData(null);
    }
  }, [STORAGE_KEY, modeParam]);

  // Auto-save effect
  useEffect(() => {
    if (isQuizConfiguring || isAssessmentSubmitted || questions.length === 0) {
      return;
    }

    const sessionData = {
      questions,
      currentIdx,
      userAnswers,
      localBookmarks,
      timeRemaining,
      timeElapsed,
      difficultyFilter,
      showReviewMode,
      hintsUsed
    };

    localStorage.setItem(STORAGE_KEY, JSON.stringify(sessionData));
  }, [
    isQuizConfiguring,
    isAssessmentSubmitted,
    questions,
    currentIdx,
    userAnswers,
    localBookmarks,
    timeRemaining,
    timeElapsed,
    difficultyFilter,
    showReviewMode,
    hintsUsed,
    STORAGE_KEY
  ]);

  // Load questions based on wizard configuration
  const handleStartQuiz = () => {
    let qPool: Question[] = [];
    if (modeParam === 'daily') {
      // 5 mixed questions based on selected track
      qPool = getQuestionsByTrack(selectedTrack, 5, '', difficultyFilter);
      if (qPool.length < 5) {
        const cats = getTrackCategories(selectedTrack);
        cats.forEach((c) => {
          const singleQ = getQuestionsByCategory(c, 1, '', difficultyFilter);
          if (singleQ.length > 0) qPool.push(singleQ[0]);
        });
        qPool = qPool.sort(() => Math.random() - 0.5).slice(0, 5);
      }
    } else {
      qPool = getQuestionsByCategory(categoryParam as any, 10, '', difficultyFilter);
      if (qPool.length === 0) {
        qPool = getQuestionsByTrack(selectedTrack, 10, '', difficultyFilter);
      }
    }
    setQuestions(qPool);
    setIsQuizConfiguring(false);
    setTimeRemaining(qPool.length * 60); // 1 minute per question
    setTimeElapsed(0);
    setIsTimerActive(true);
  };

  // Trigger setup immediately for daily challenge
  useEffect(() => {
    if (modeParam === 'daily') {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        try {
          const parsed = JSON.parse(raw);
          if (parsed && parsed.questions && parsed.questions.length > 0) {
            // Already handled by mount effect, do not start fresh
            return;
          }
        } catch (e) {}
      }
      handleStartQuiz();
    }
  }, [modeParam, STORAGE_KEY]);

  // Handle countdown Timer
  useEffect(() => {
    if (isQuizConfiguring || isAssessmentSubmitted || !isTimerActive) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }

    timerRef.current = setInterval(() => {
      setTimeElapsed((prev) => prev + 1);
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          if (timerRef.current) clearInterval(timerRef.current);
          handleAutoSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isQuizConfiguring, isAssessmentSubmitted, isTimerActive]);

  const toggleLocalBookmarkState = (qId: string) => {
    setLocalBookmarks((prev) =>
      prev.includes(qId) ? prev.filter((id) => id !== qId) : [...prev, qId]
    );
    toggleGlobalBookmark(qId);
  };

  const handleSelectOption = (qId: string, optionIdx: number, isMulti = false) => {
    if (isAssessmentSubmitted) return;

    setUserAnswers((prev) => {
      const current = prev[qId];
      if (isMulti) {
        const arr = Array.isArray(current) ? [...current] : [];
        if (arr.includes(optionIdx)) {
          return { ...prev, [qId]: arr.filter((idx) => idx !== optionIdx) };
        } else {
          return { ...prev, [qId]: [...arr, optionIdx] };
        }
      } else {
        return { ...prev, [qId]: [optionIdx] }; // Single answer index saved as array
      }
    });
  };

  const handleMatchColumnsSelect = (qId: string, leftIdx: number, rightSelectionIdx: number) => {
    if (isAssessmentSubmitted) return;

    setUserAnswers((prev) => {
      const current = prev[qId] || {};
      return {
        ...prev,
        [qId]: {
          ...current,
          [leftIdx]: rightSelectionIdx
        }
      };
    });
  };

  const handleTextAnswerChange = (qId: string, text: string) => {
    if (isAssessmentSubmitted) return;
    setUserAnswers((prev) => ({
      ...prev,
      [qId]: text
    }));
  };

  const handleAutoSubmit = () => {
    handleSubmitQuiz(true);
  };

  const handleSubmitQuiz = (forced = false) => {
    if (!forced && !window.confirm(t('confirmSubmit'))) {
      return;
    }

    setIsAssessmentSubmitted(true);
    if (timerRef.current) clearInterval(timerRef.current);

    // Calculate Scores & Metrics
    let correctCount = 0;
    let incorrectCount = 0;
    let skippedCount = 0;
    let weightedScore = 0;
    let maxWeightedScore = 0;

    const strengthsMap: { [topic: string]: { correct: number; total: number } } = {};
    const weaknessesMap: { [topic: string]: { correct: number; total: number } } = {};

    const difficultyBreakdown = {
      easy: { correct: 0, total: 0 },
      medium: { correct: 0, total: 0 },
      hard: { correct: 0, total: 0 },
      expert: { correct: 0, total: 0 }
    };

    questions.forEach((q) => {
      const uAns = userAnswers[q.id];
      const difficultyPoints = q.difficulty === 'easy' ? 10 : q.difficulty === 'medium' ? 20 : q.difficulty === 'hard' ? 30 : 50;
      maxWeightedScore += difficultyPoints;

      difficultyBreakdown[q.difficulty].total += 1;

      if (uAns === undefined || uAns === null || (Array.isArray(uAns) && uAns.length === 0)) {
        skippedCount++;
        return;
      }

      let isCorrect = false;

      // Verification based on Question Type
      if (q.type === 'multiple-choice' || q.type === 'true-false' || q.type === 'code-output' || q.type === 'bug-fixing') {
        const correctOptIdx = q.correctAnswer[0];
        if (Array.isArray(uAns) && uAns[0] === correctOptIdx) {
          isCorrect = true;
        }
      } else if (q.type === 'multiple-answer') {
        const correctList = q.correctAnswer as number[];
        if (Array.isArray(uAns)) {
          const matchAll = correctList.length === uAns.length && correctList.every(val => uAns.includes(val));
          if (matchAll) isCorrect = true;
        }
      } else if (q.type === 'fill-in-blank') {
        const uStr = String(uAns).trim().toLowerCase();
        const correctStr = String(q.correctAnswer).trim().toLowerCase();
        if (uStr === correctStr) isCorrect = true;
      } else if (q.type === 'match-columns') {
        // match columns uses keyed maps representing {leftIdx: rightIdx} matches
        const correctMap = q.correctAnswer as number[];
        let allMatched = true;
        for (let i = 0; i < q.matchLeft!.length; i++) {
          if (uAns[i] !== correctMap[i]) {
            allMatched = false;
            break;
          }
        }
        if (allMatched) isCorrect = true;
      }

      if (isCorrect) {
        correctCount++;
        weightedScore += difficultyPoints;
        difficultyBreakdown[q.difficulty].correct += 1;

        strengthsMap[q.topic] = strengthsMap[q.topic] 
          ? { correct: strengthsMap[q.topic].correct + 1, total: strengthsMap[q.topic].total + 1 }
          : { correct: 1, total: 1 };
      } else {
        incorrectCount++;
        weaknessesMap[q.topic] = weaknessesMap[q.topic]
          ? { correct: weaknessesMap[q.topic].correct, total: weaknessesMap[q.topic].total + 1 }
          : { correct: 0, total: 1 };
      }
    });

    const finalPercentage = maxWeightedScore > 0 ? (weightedScore / maxWeightedScore) * 100 : 0;
    const finalAccuracy = questions.length > 0 ? (correctCount / questions.length) * 100 : 0;

    // Filter strengths/weaknesses list
    const finalStrengths = Object.entries(strengthsMap)
      .filter(([topic, counts]) => (counts.correct / counts.total) >= 0.7)
      .map(([topic]) => topic);

    const finalWeaknesses = Object.entries(weaknessesMap)
      .filter(([topic, counts]) => (counts.correct / counts.total) < 0.7)
      .map(([topic]) => topic);

    const result = {
      id: `res-${Date.now()}`,
      category: modeParam === 'daily' ? 'javascript' : categoryParam, // fallback key for history
      date: new Date().toLocaleDateString(isRtl ? 'ar-EG' : 'en-US'),
      score: weightedScore,
      maxScore: maxWeightedScore,
      percentage: finalPercentage,
      accuracy: finalAccuracy,
      timeSpent: timeElapsed,
      correctCount,
      incorrectCount,
      skippedCount,
      answers: userAnswers,
      bookmarks: localBookmarks,
      strengths: finalStrengths.length > 0 ? finalStrengths : [getCategoryTitle(categoryParam) + " Fundamentals"],
      weaknesses: finalWeaknesses.length > 0 ? finalWeaknesses : ["Advanced speed timers"],
      difficultyBreakdown,
      mode: modeParam,
      hintsUsed
    };

    saveAssessmentResult(result);

    // Clear active session upon successful completion
    localStorage.removeItem(STORAGE_KEY);

    // Redirect to custom Report View
    navigate('/report', { state: { result, questions } });
  };

  // Keyboard Shortcuts Hook for Accessibility & Speed
  useEffect(() => {
    if (isQuizConfiguring || isAssessmentSubmitted || !isTimerActive) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      const key = e.key;
      const isCtrlOrCmd = e.ctrlKey || e.metaKey;

      // 1. GLOBAL SHORTCUT: Ctrl+Enter or Cmd+Enter to submit the quiz from anywhere
      if (isCtrlOrCmd && key === 'Enter') {
        e.preventDefault();
        handleSubmitQuiz();
        return;
      }

      // Check if user is typing in an input, textarea, or select
      const active = document.activeElement;
      const isTypingInInput = active && (
        active.tagName === 'INPUT' || 
        active.tagName === 'TEXTAREA' || 
        active.tagName === 'SELECT' ||
        active.getAttribute('contenteditable') === 'true'
      );

      if (isTypingInInput) {
        // 2. INPUT SHORTCUT: Enter in fill-in-the-blank input moves to next question or review mode
        if (key === 'Enter' && active.tagName === 'INPUT') {
          const currentQuestion = questions[currentIdx];
          if (currentQuestion && currentQuestion.type === 'fill-in-blank') {
            e.preventDefault();
            if (currentIdx < questions.length - 1) {
              setCurrentIdx((prev) => prev + 1);
            } else {
              setShowReviewMode(true);
            }
          }
        }
        return;
      }

      const currentQuestion = questions[currentIdx];
      if (!currentQuestion) return;

      // 3. Question Navigation: Arrows or P/N keys
      if (key === 'ArrowLeft' || key.toLowerCase() === 'p') {
        e.preventDefault();
        setCurrentIdx((prev) => Math.max(prev - 1, 0));
      } else if (key === 'ArrowRight' || key.toLowerCase() === 'n') {
        e.preventDefault();
        if (currentIdx < questions.length - 1) {
          setCurrentIdx((prev) => prev + 1);
        } else {
          setShowReviewMode(true);
        }
      }

      // 4. Bookmark Toggle
      if (key.toLowerCase() === 'm') {
        e.preventDefault();
        toggleLocalBookmarkState(currentQuestion.id);
      }

      // 5. Option Selection for supported question types
      if (
        currentQuestion.type === 'multiple-choice' ||
        currentQuestion.type === 'true-false' ||
        currentQuestion.type === 'multiple-answer' ||
        currentQuestion.type === 'code-output' ||
        currentQuestion.type === 'bug-fixing'
      ) {
        const currentOptions = getQuestionOptions(currentQuestion);
        const numOptions = currentOptions.length;

        // Number keys (1 to 9)
        const numValue = parseInt(key, 10);
        if (!isNaN(numValue) && numValue >= 1 && numValue <= numOptions) {
          e.preventDefault();
          const optionIdx = numValue - 1;
          const isMulti = currentQuestion.type === 'multiple-answer';
          handleSelectOption(currentQuestion.id, optionIdx, isMulti);
        }

        // Letter keys (A to Z)
        const letterCode = key.toUpperCase().charCodeAt(0);
        if (key.length === 1 && letterCode >= 65 && letterCode < 65 + numOptions) {
          e.preventDefault();
          const optionIdx = letterCode - 65;
          const isMulti = currentQuestion.type === 'multiple-answer';
          handleSelectOption(currentQuestion.id, optionIdx, isMulti);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [
    isQuizConfiguring, 
    isAssessmentSubmitted, 
    isTimerActive, 
    currentIdx, 
    questions, 
    isRtl, 
    toggleLocalBookmarkState, 
    handleSelectOption, 
    handleSubmitQuiz, 
    setShowReviewMode
  ]);

  if (isQuizConfiguring && modeParam !== 'daily') {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12 space-y-8" id="assessment-setup-wizard">
        
        <div className="text-center space-y-3">
          <GraduationCap className="w-12 h-12 text-amber-500 mx-auto" />
          <h1 className="text-2xl md:text-3xl font-black text-white">
            {isRtl ? 'مركز التقييم واختبارات القبول' : 'Evaluation & Assessment Hub'}
          </h1>
          <p className="text-sm text-slate-400">
            {isRtl ? 'اختر نوع التقييم: أسئلة سرعة وتقييم نظري، أو مشروع تاسك قبول وظيفي عملي (Take-Home Task).' : `Configure your parameters for "${getCategoryTitle(categoryParam)}" evaluation or submit a company take-home project.`}
          </p>
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-500/10 border border-amber-500/20 rounded-full text-xs font-bold text-amber-400">
            <span>{selectedTrack === 'backend' ? '🖥️ Active Track: Backend (PHP / Laravel / MySQL)' : selectedTrack === 'fullstack' ? '🌐 Active Track: Fullstack' : '🎨 Active Track: Frontend (HTML / CSS / JS / React)'}</span>
          </div>

          {/* Mode Switcher Tabs */}
          <div className="flex flex-wrap justify-center gap-3 pt-2">
            <button
              onClick={() => setAssessmentTab('quiz')}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs transition-all cursor-pointer border ${
                assessmentTab === 'quiz'
                  ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-lg shadow-amber-500/20'
                  : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              <ClipboardList className="w-4 h-4" />
              <span>{isRtl ? 'اختبار الأسئلة والنظري (Speed Quiz)' : 'Multiple-Choice & Speed Quiz'}</span>
            </button>

            <button
              onClick={() => setAssessmentTab('takehome')}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs transition-all cursor-pointer border ${
                assessmentTab === 'takehome'
                  ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-lg shadow-amber-500/20'
                  : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              <Briefcase className="w-4 h-4" />
              <span>{isRtl ? 'تاسك مشروع القبول الوظيفي (Take-Home Task)' : 'Take-Home Project Assignment'}</span>
            </button>

            <button
              onClick={() => navigate('/english-placement')}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs transition-all cursor-pointer border bg-indigo-500/10 hover:bg-indigo-500/20 border-indigo-500/30 text-indigo-300 hover:text-white"
            >
              <Globe className="w-4 h-4 text-indigo-400" />
              <span>{isRtl ? 'اختبار تحديد المستوى الدولي للإنجليزية (CEFR)' : 'Global English CEFR Placement Test'}</span>
            </button>
          </div>
        </div>

        {/* Render Take-Home Studio when tab selected */}
        {assessmentTab === 'takehome' ? (
          <TakeHomeAssignmentStudio />
        ) : (
          <div className="max-w-xl mx-auto space-y-8">
        {hasSavedSession && savedSessionData && (
          <div className="bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/20 p-5 rounded-2xl space-y-3 relative overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-300" id="resume-session-banner">
            <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/5 rounded-full blur-2xl pointer-events-none" />
            <div className="flex items-start gap-3">
              <div className="p-2 bg-amber-500/20 text-amber-500 rounded-xl">
                <Clock className="w-5 h-5 animate-pulse" />
              </div>
              <div className="text-left rtl:text-right flex-1">
                <h3 className="font-extrabold text-white text-sm">
                  {isRtl ? 'لديك جلسة اختبار غير مكتملة!' : 'Unfinished Session Found!'}
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  {isRtl 
                    ? `لقد أجبت على ${Object.keys(savedSessionData.userAnswers || {}).length} من أصل ${savedSessionData.questions?.length} أسئلة في هذه الفئة.`
                    : `You have an active session with ${Object.keys(savedSessionData.userAnswers || {}).length} of ${savedSessionData.questions?.length} questions answered.`}
                </p>
                <div className="text-[10px] text-slate-500 font-mono mt-1">
                  {isRtl 
                    ? `الوقت المتبقي: ${Math.floor(savedSessionData.timeRemaining / 60)}:${String(savedSessionData.timeRemaining % 60).padStart(2, '0')}`
                    : `Time Remaining: ${Math.floor(savedSessionData.timeRemaining / 60)}:${String(savedSessionData.timeRemaining % 60).padStart(2, '0')}`}
                </div>
              </div>
            </div>
            <div className="flex gap-2 pt-1">
              <button
                onClick={() => {
                  setQuestions(savedSessionData.questions);
                  setCurrentIdx(savedSessionData.currentIdx);
                  setUserAnswers(savedSessionData.userAnswers || {});
                  setLocalBookmarks(savedSessionData.localBookmarks || []);
                  setTimeRemaining(savedSessionData.timeRemaining);
                  setTimeElapsed(savedSessionData.timeElapsed || 0);
                  setDifficultyFilter(savedSessionData.difficultyFilter || 'medium');
                  setShowReviewMode(savedSessionData.showReviewMode || false);
                  setHintsUsed(savedSessionData.hintsUsed || []);
                  setIsQuizConfiguring(false);
                }}
                className="flex-1 bg-amber-500 hover:bg-amber-600 text-slate-900 font-black py-2.5 px-3 rounded-xl text-xs transition-all shadow-md shadow-amber-500/10 cursor-pointer"
              >
                {isRtl ? 'استئناف الجلسة السابقة ⚡' : 'Resume Saved Session ⚡'}
              </button>
              <button
                onClick={() => {
                  if (window.confirm(isRtl ? 'هل أنت متأكد أنك تريد حذف الجلسة المحفوظة وبدء اختبار جديد؟' : 'Are you sure you want to discard your saved session and start a new evaluation?')) {
                    localStorage.removeItem(STORAGE_KEY);
                    setHasSavedSession(false);
                    setSavedSessionData(null);
                  }
                }}
                className="bg-slate-950 hover:bg-red-950/40 border border-slate-800 hover:border-red-900/30 text-slate-400 hover:text-red-400 font-bold px-3 py-2.5 rounded-xl text-xs transition-colors cursor-pointer"
              >
                {isRtl ? 'بدء جديد' : 'Discard'}
              </button>
            </div>
          </div>
        )}

        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-6">
          
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Select Difficulty Level</label>
            <div className="grid grid-cols-2 gap-2">
              {(['easy', 'medium', 'hard', 'expert'] as Difficulty[]).map((level) => (
                <button
                  key={level}
                  onClick={() => setDifficultyFilter(level)}
                  className={`p-3 rounded-xl border text-xs font-bold transition-all ${
                    difficultyFilter === level 
                      ? 'bg-amber-500/10 border-amber-500 text-amber-500' 
                      : 'bg-slate-950 border-slate-800 hover:border-slate-700 text-slate-400'
                  }`}
                >
                  {level.toUpperCase()}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Guidelines & Time Limits</label>
            <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-2 text-xs text-slate-400 leading-relaxed">
              <p>• The exam is formatted with **10 weighted questions**.</p>
              <p>• You have **60 seconds** limit per item (**10 minutes** overall timer).</p>
              <p>• Correct answers yield multipliers. Skipped items count as zero points.</p>
              <p>• Score above **70%** to generate your printable verified certification.</p>
            </div>
          </div>

          <button
            onClick={handleStartQuiz}
            className="w-full bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-slate-900 font-extrabold py-3.5 rounded-xl shadow-lg shadow-amber-500/10 transition-all text-sm cursor-pointer"
          >
            Launch Evaluation
          </button>

        </div>
        </div>
        )}

      </div>
    );
  }

  // Get a short preview of the user's selected answer for review mode
  const getAnswerPreview = (q: Question, ans: any) => {
    if (ans === undefined || ans === null || (Array.isArray(ans) && ans.length === 0) || (typeof ans === 'object' && Object.keys(ans).length === 0)) {
      return isRtl ? 'لم تتم الإجابة بعد' : 'Not answered yet';
    }

    if (q.type === 'multiple-choice' || q.type === 'true-false' || q.type === 'code-output' || q.type === 'bug-fixing') {
      const optIdx = Array.isArray(ans) ? ans[0] : ans;
      const opts = getQuestionOptions(q);
      return opts && opts[optIdx] ? opts[optIdx] : (isRtl ? 'تم تحديد خيار' : 'Option selected');
    }

    if (q.type === 'multiple-answer') {
      const opts = getQuestionOptions(q);
      if (Array.isArray(ans)) {
        const selectedTexts = ans.map(idx => opts?.[idx] || '').filter(Boolean);
        return selectedTexts.join(', ');
      }
      return isRtl ? 'تم تحديد خيارات متعددة' : 'Multiple options selected';
    }

    if (q.type === 'fill-in-blank') {
      return String(ans);
    }

    if (q.type === 'match-columns') {
      const matchesCount = Object.keys(ans).length;
      return isRtl 
        ? `تم مطابقة ${matchesCount} من العناصر` 
        : `Matched ${matchesCount} items`;
    }

    return isRtl ? 'تمت الإجابة' : 'Answered';
  };

  // Active quiz render
  const currentQuestion = questions[currentIdx];
  if (!currentQuestion) return null;

  const currentAns = userAnswers[currentQuestion.id];
  const isBookmarked = localBookmarks.includes(currentQuestion.id) || progress.bookmarks.includes(currentQuestion.id);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6" id="assessment-quiz-active">
      
      {/* 1. Header controls, timer, pause buttons */}
      <section className="bg-slate-900/80 border border-slate-800 p-4 rounded-2xl flex flex-col sm:flex-row justify-between items-center gap-4 sticky top-18 z-40 backdrop-blur-md">
        
        <div className="space-y-1">
          <h2 className="text-sm font-extrabold text-white flex items-center gap-2">
            <Flame className="w-5 h-5 text-amber-500" />
            <span>Evaluating: {getCategoryTitle(categoryParam)} ({modeParam.toUpperCase()})</span>
          </h2>
          <p className="text-[10px] text-slate-400">
            {showReviewMode 
              ? (isRtl ? 'وضع مراجعة كافة الإجابات وتعديلها' : 'Reviewing All Answers Mode')
              : `${t('question')} ${currentIdx + 1} of ${questions.length}`
            }
          </p>
        </div>

        {/* Timer UI block */}
        <div className="flex items-center space-x-3 rtl:space-x-reverse">
          <div className="hidden sm:flex items-center space-x-1 rtl:space-x-reverse text-[9px] text-emerald-500 font-mono font-bold bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-full select-none" id="autosave-indicator">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span>{isRtl ? 'حفظ تلقائي' : 'Auto-saved'}</span>
          </div>

          <div className="flex items-center space-x-1.5 rtl:space-x-reverse bg-slate-950 border border-slate-800 px-3.5 py-1.5 rounded-xl text-xs font-mono font-bold text-slate-300">
            <Clock className="w-4 h-4 text-amber-500 animate-pulse" />
            <span>{Math.floor(timeRemaining / 60)}:{(timeRemaining % 60).toString().padStart(2, '0')}</span>
          </div>

          {/* Pause / Resume button */}
          <button
            onClick={() => setIsTimerActive(!isTimerActive)}
            className={`p-2.5 rounded-xl border transition-colors ${
              isTimerActive 
                ? 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200' 
                : 'bg-amber-500/10 border-amber-500/30 text-amber-500 hover:bg-amber-500/20'
            }`}
            title={isTimerActive ? 'Pause Assessment' : 'Resume Assessment'}
          >
            {isTimerActive ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          </button>

          {/* Review Answers Toggle Button */}
          <button
            onClick={() => setShowReviewMode(!showReviewMode)}
            className={`flex items-center space-x-1.5 rtl:space-x-reverse px-3 py-2 rounded-xl text-xs font-bold transition-all ${
              showReviewMode 
                ? 'bg-amber-500 text-slate-900 border border-amber-400' 
                : 'bg-slate-950 hover:bg-slate-900 border border-slate-800 text-slate-300 hover:text-white'
            }`}
            title={isRtl ? 'مراجعة وتعديل الإجابات' : 'Review and Edit Answers'}
          >
            <ClipboardList className="w-4 h-4" />
            <span className="hidden md:inline">{showReviewMode ? (isRtl ? 'الأسئلة' : 'View Questions') : t('reviewAnswers')}</span>
          </button>

          {/* Global Submit trigger */}
          <button
            onClick={() => handleSubmitQuiz()}
            className="bg-emerald-500 hover:bg-emerald-600 text-slate-900 font-extrabold px-4 py-2 rounded-xl text-xs shadow-lg shadow-emerald-500/10 transition-colors"
          >
            {t('submitExam')}
          </button>
        </div>

      </section>

      {/* 2. Frozen/Pause Screen Overlay */}
      {!isTimerActive && (
        <div className="bg-slate-950/90 border border-slate-800/80 p-8 rounded-3xl text-center space-y-4 max-w-md mx-auto" id="quiz-pause-overlay">
          <Clock className="w-12 h-12 text-amber-500 mx-auto animate-bounce" />
          <h3 className="text-lg font-black text-white">Assessment Paused</h3>
          <p className="text-xs text-slate-400">The test timer is frozen. Resume whenever you are ready to continue your evaluations.</p>
          <button
            onClick={() => setIsTimerActive(true)}
            className="w-full bg-amber-500 hover:bg-amber-600 text-slate-900 font-extrabold py-2.5 rounded-xl text-xs"
          >
            Resume Evaluation
          </button>
        </div>
      )}

      {isTimerActive && (
        showReviewMode ? (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-slate-900 border border-slate-800 p-6 md:p-8 rounded-3xl space-y-6"
            id="assessment-review-mode-panel"
          >
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-slate-800">
              <div>
                <h2 className="text-xl font-black text-white flex items-center gap-2">
                  <ClipboardList className="w-6 h-6 text-amber-500" />
                  <span>{isRtl ? 'مراجعة كافة إجاباتك' : 'Review All Your Answers'}</span>
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  {isRtl 
                    ? 'يرجى مراجعة وتعديل إجاباتك قبل تسليم التقييم النهائي. انقر على أي سؤال للعودة وتعديل الإجابة.' 
                    : 'Please check and edit your answers before final submission. Click any question card to return and change its answer.'}
                </p>
              </div>
              
              <div className="flex gap-2">
                <button
                  onClick={() => setShowReviewMode(false)}
                  className="bg-slate-950 hover:bg-slate-900 border border-slate-800 text-slate-300 hover:text-white px-4 py-2 rounded-xl text-xs font-bold transition-colors"
                >
                  {isRtl ? 'العودة للاختبار' : 'Back to Test'}
                </button>
                <button
                  onClick={() => handleSubmitQuiz()}
                  className="bg-emerald-500 hover:bg-emerald-600 text-slate-900 font-extrabold px-5 py-2 rounded-xl text-xs shadow-lg shadow-emerald-500/15 transition-colors"
                >
                  {t('submitExam')}
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {questions.map((q, idx) => {
                const ans = userAnswers[q.id];
                const isAnswered = ans !== undefined && ans !== null && !(Array.isArray(ans) && ans.length === 0) && !(typeof ans === 'object' && Object.keys(ans).length === 0);
                const isBookmarkedLocal = localBookmarks.includes(q.id) || progress.bookmarks.includes(q.id);

                return (
                  <div 
                    key={q.id}
                    onClick={() => {
                      setCurrentIdx(idx);
                      setShowReviewMode(false);
                    }}
                    className={`group relative p-4 rounded-2xl border text-left rtl:text-right cursor-pointer transition-all duration-300 hover:scale-[1.01] ${
                      isAnswered 
                        ? 'bg-slate-950/40 border-slate-800 hover:border-amber-500/30' 
                        : 'bg-red-500/5 border-red-950/40 hover:border-red-500/30'
                    }`}
                  >
                    <div className="flex justify-between items-start gap-2 mb-2">
                      <div className="flex items-center gap-2">
                        <span className="w-5 h-5 rounded bg-slate-900 flex items-center justify-center font-mono text-[10px] font-black text-amber-500 border border-slate-800">
                          {idx + 1}
                        </span>
                        <span className="text-[9px] font-mono font-bold uppercase px-2 py-0.5 rounded bg-slate-950 text-slate-400">
                          {q.topic}
                        </span>
                        <span className={`text-[9px] font-mono font-bold uppercase px-2 py-0.5 rounded ${
                          q.difficulty === 'easy' ? 'bg-emerald-500/10 text-emerald-400' :
                          q.difficulty === 'medium' ? 'bg-indigo-500/10 text-indigo-400' :
                          q.difficulty === 'hard' ? 'bg-orange-500/10 text-orange-400' :
                          'bg-red-500/10 text-red-400'
                        }`}>
                          {q.difficulty.toUpperCase()}
                        </span>
                      </div>

                      <div className="flex items-center gap-1.5">
                        {isBookmarkedLocal && (
                          <Bookmark className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                        )}
                        <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${
                          isAnswered ? 'bg-emerald-500/15 text-emerald-400' : 'bg-red-500/15 text-red-400'
                        }`}>
                          {isAnswered ? (isRtl ? 'تمت الإجابة' : 'Answered') : (isRtl ? 'متروك' : 'Skipped')}
                        </span>
                      </div>
                    </div>

                    <p className="text-xs text-slate-300 line-clamp-1 group-hover:text-white transition-colors">
                      {getQuestionText(q)}
                    </p>

                    <div className="mt-2 pt-2 border-t border-slate-950/60 flex justify-between items-center text-[10px]">
                      <span className="text-slate-500 font-medium truncate max-w-[70%]">
                        <span className="text-slate-600 mr-1 rtl:ml-1 font-bold">{isRtl ? 'الإجابة:' : 'Answer:'}</span>
                        <span className="text-amber-500/90 font-mono font-bold">{getAnswerPreview(q, ans)}</span>
                      </span>
                      <span className="text-amber-500 font-bold group-hover:translate-x-1 rtl:group-hover:-translate-x-1 transition-transform flex items-center gap-1">
                        <span>{isRtl ? 'تعديل' : 'Edit'}</span>
                        <Edit className="w-3 h-3" />
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="pt-4 border-t border-slate-800 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-slate-500">
              <p>
                {isRtl 
                  ? `تم الإجابة على ${questions.filter(q => userAnswers[q.id] !== undefined).length} من أصل ${questions.length} أسئلة.` 
                  : `Answered ${questions.filter(q => userAnswers[q.id] !== undefined).length} of ${questions.length} questions.`}
              </p>
              <button
                onClick={() => handleSubmitQuiz()}
                className="w-full sm:w-auto bg-emerald-500 hover:bg-emerald-600 text-slate-900 font-extrabold px-6 py-3 rounded-xl text-xs shadow-lg shadow-emerald-500/10 transition-colors"
              >
                {isRtl ? 'تسليم التقييم والنتيجة' : 'Submit and Get Result'}
              </button>
            </div>
          </motion.div>
        ) : (
          <div className="space-y-6">
          
          {/* 3. Question Card Box */}
          <div className="bg-slate-900 border border-slate-800/80 p-6 md:p-8 rounded-3xl space-y-6">
            
            <div className="flex justify-between items-start gap-4">
              <div className="space-y-1.5">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-[9px] font-mono font-bold uppercase px-2.5 py-0.5 rounded-full bg-slate-950 text-amber-500">
                    {currentQuestion.topic}
                  </span>
                  <span className={`text-[9px] font-mono font-bold uppercase px-2.5 py-0.5 rounded-full ${
                    currentQuestion.difficulty === 'easy' ? 'bg-emerald-500/10 text-emerald-400' :
                    currentQuestion.difficulty === 'medium' ? 'bg-indigo-500/10 text-indigo-400' :
                    currentQuestion.difficulty === 'hard' ? 'bg-orange-500/10 text-orange-400' :
                    'bg-red-500/10 text-red-400'
                  }`}>
                    {currentQuestion.difficulty.toUpperCase()}
                  </span>
                </div>
                <h3 className="text-base md:text-lg text-slate-100 font-medium leading-relaxed">
                  {getQuestionText(currentQuestion)}
                </h3>
              </div>

              {/* Bookmark Selector */}
              <button
                onClick={() => toggleLocalBookmarkState(currentQuestion.id)}
                className={`p-2.5 rounded-xl border transition-all ${
                  isBookmarked 
                    ? 'bg-amber-500/10 border-amber-500/30 text-amber-500' 
                    : 'border-slate-800 hover:border-slate-700 text-slate-500 hover:text-slate-300'
                }`}
                title="Bookmark"
              >
                <BookMarked className="w-4.5 h-4.5" />
              </button>
            </div>

            {/* Code Snippet Box (if it exists) */}
            {currentQuestion.codeSnippet && (
              <pre className="p-4 bg-slate-950 rounded-xl text-xs md:text-sm font-mono text-amber-400/95 overflow-x-auto border border-slate-800/80 shadow-inner">
                <code>{currentQuestion.codeSnippet}</code>
              </pre>
            )}

            {/* Hint UI Block for Coding Questions */}
            {(currentQuestion.type === 'code-output' || currentQuestion.type === 'bug-fixing' || !!currentQuestion.codeSnippet) && (
              <div className="mt-3" id="coding-question-hint">
                {!hintsUsed.includes(currentQuestion.id) ? (
                  <div className="flex justify-start">
                    <button
                      type="button"
                      onClick={() => {
                        if (!hintsUsed.includes(currentQuestion.id)) {
                          setHintsUsed([...hintsUsed, currentQuestion.id]);
                        }
                      }}
                      className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-amber-500/20 bg-amber-500/5 hover:bg-amber-500/10 text-amber-400 hover:text-amber-300 text-xs font-bold transition-all cursor-pointer shadow-sm shadow-amber-500/5"
                    >
                      <Lightbulb className="w-3.5 h-3.5 animate-pulse" />
                      <span>{isRtl ? 'عرض تلميح ذكي' : 'Reveal Guided Hint'}</span>
                    </button>
                  </div>
                ) : (
                  <div className="bg-amber-500/5 border border-amber-500/20 rounded-2xl p-4 text-xs text-slate-300 space-y-1.5 animate-in fade-in slide-in-from-top-2 duration-300">
                    <div className="flex items-center gap-1.5 text-amber-500 font-black uppercase tracking-wide text-[10px]">
                      <Lightbulb className="w-3.5 h-3.5 text-amber-400" />
                      <span>{isRtl ? 'تلميح موجه' : 'Guided Suggestion'}</span>
                    </div>
                    <p className="leading-relaxed font-medium">{getCodingQuestionHint(currentQuestion, isRtl)}</p>
                  </div>
                )}
              </div>
            )}

            {/* 4. Active Interactive Answers Rendering */}
            <div className="pt-4 border-t border-slate-950 space-y-3">
              
              {/* Type: Multiple Choice, Multiple Answer, True-False */}
              {(currentQuestion.type === 'multiple-choice' || currentQuestion.type === 'true-false' || currentQuestion.type === 'multiple-answer' || currentQuestion.type === 'code-output' || currentQuestion.type === 'bug-fixing') && (
                <div className="grid grid-cols-1 gap-3">
                  {getQuestionOptions(currentQuestion).map((opt, oIdx) => {
                    const isMulti = currentQuestion.type === 'multiple-answer';
                    const isSelected = Array.isArray(currentAns) && currentAns.includes(oIdx);

                    return (
                      <button
                        key={oIdx}
                        onClick={() => handleSelectOption(currentQuestion.id, oIdx, isMulti)}
                        className={`w-full text-left rtl:text-right p-4 rounded-xl border text-xs md:text-sm transition-all flex items-center justify-between ${
                          isSelected 
                            ? 'bg-gradient-to-r from-amber-500/10 to-transparent border-amber-500/50 text-white font-semibold' 
                            : 'bg-slate-950/40 border-slate-800 hover:border-slate-700/80 text-slate-300'
                        }`}
                      >
                        <span className="flex items-center space-x-3 rtl:space-x-reverse">
                          <span 
                            className="relative w-6 h-6 rounded-lg bg-slate-900 flex items-center justify-center font-mono text-[10px] font-bold text-slate-500 group-hover:text-slate-300"
                            title={isRtl ? `مفتاح: ${oIdx + 1} أو ${String.fromCharCode(65 + oIdx)}` : `Shortcut: ${oIdx + 1} or ${String.fromCharCode(65 + oIdx)}`}
                          >
                            {String.fromCharCode(65 + oIdx)}
                            <span className="absolute -top-1.5 -right-1.5 text-[8px] leading-none px-1 py-0.5 bg-slate-950 text-amber-500 font-black rounded border border-slate-800/80 shadow">
                              {oIdx + 1}
                            </span>
                          </span>
                          <span>{opt}</span>
                        </span>

                        {isSelected && <Check className="w-4 h-4 text-amber-500" />}
                      </button>
                    );
                  })}
                </div>
              )}

              {/* Type: Fill in Blank */}
              {currentQuestion.type === 'fill-in-blank' && (
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase text-slate-500">Type Your Code Answer Here:</label>
                  <input
                    type="text"
                    value={currentAns || ''}
                    onChange={(e) => handleTextAnswerChange(currentQuestion.id, e.target.value)}
                    placeholder="Case-insensitive keyword or method..."
                    className="w-full bg-slate-950 border border-slate-800 focus:border-slate-700 focus:outline-none rounded-xl px-4 py-3 text-sm font-mono text-amber-400 focus:ring-1 focus:ring-amber-500/30"
                  />
                </div>
              )}

              {/* Type: Match Columns */}
              {currentQuestion.type === 'match-columns' && (
                <div className="space-y-4">
                  <p className="text-[10px] font-bold uppercase text-slate-500">Map left items to right functional descriptions:</p>
                  <div className="grid grid-cols-1 gap-3">
                    {currentQuestion.matchLeft!.map((leftItem, lIdx) => {
                      const selectedRightIdx = currentAns?.[lIdx];

                      return (
                        <div 
                          key={lIdx} 
                          className="flex flex-col md:flex-row items-stretch md:items-center justify-between bg-slate-950/40 border border-slate-800/80 p-4 rounded-xl gap-4"
                        >
                          <span className="font-mono text-xs md:text-sm text-amber-400 bg-slate-900 px-3 py-1.5 rounded-lg border border-slate-800/50">
                            {leftItem}
                          </span>
                          
                          <div className="relative">
                            <select
                              value={selectedRightIdx !== undefined ? selectedRightIdx : ''}
                              onChange={(e) => handleMatchColumnsSelect(currentQuestion.id, lIdx, Number(e.target.value))}
                              className="bg-slate-950 border border-slate-800 rounded-lg py-1.5 px-3 text-xs text-slate-300 focus:outline-none focus:border-amber-500 cursor-pointer w-full md:w-64"
                            >
                              <option value="">-- Choose matching description --</option>
                              {currentQuestion.matchRight!.map((rightDesc, rIdx) => (
                                <option key={rIdx} value={rIdx}>
                                  {rightDesc.substring(0, 50)}...
                                </option>
                              ))}
                            </select>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

            </div>

            {/* Keyboard Shortcuts Legend */}
            <div className="pt-4 border-t border-slate-950/50 flex flex-wrap justify-center sm:justify-start gap-4 text-[10px] text-slate-500 font-mono" id="keyboard-shortcuts-legend">
              <span className="flex items-center gap-1.5">
                <kbd className="px-1.5 py-0.5 rounded bg-slate-950 border border-slate-800/80 text-amber-500 text-[9px] font-bold shadow">1</kbd>-
                <kbd className="px-1.5 py-0.5 rounded bg-slate-950 border border-slate-800/80 text-amber-500 text-[9px] font-bold shadow">9</kbd> / 
                <kbd className="px-1.5 py-0.5 rounded bg-slate-950 border border-slate-800/80 text-amber-500 text-[9px] font-bold shadow">A</kbd>-
                <kbd className="px-1.5 py-0.5 rounded bg-slate-950 border border-slate-800/80 text-amber-500 text-[9px] font-bold shadow">D</kbd>:
                <span className="text-slate-400">{isRtl ? 'تحديد إجابة' : 'Select Option'}</span>
              </span>
              <span className="flex items-center gap-1.5">
                <kbd className="px-1.5 py-0.5 rounded bg-slate-950 border border-slate-800/80 text-amber-500 text-[9px] font-bold shadow">←</kbd> / 
                <kbd className="px-1.5 py-0.5 rounded bg-slate-950 border border-slate-800/80 text-amber-500 text-[9px] font-bold shadow">→</kbd> /
                <kbd className="px-1.5 py-0.5 rounded bg-slate-950 border border-slate-800/80 text-amber-500 text-[9px] font-bold shadow">P</kbd> /
                <kbd className="px-1.5 py-0.5 rounded bg-slate-950 border border-slate-800/80 text-amber-500 text-[9px] font-bold shadow">N</kbd>:
                <span className="text-slate-400">{isRtl ? 'السابق / التالي' : 'Prev / Next'}</span>
              </span>
              <span className="flex items-center gap-1.5">
                <kbd className="px-1.5 py-0.5 rounded bg-slate-950 border border-slate-800/80 text-amber-500 text-[9px] font-bold shadow">M</kbd>:
                <span className="text-slate-400">{isRtl ? 'حفظ السؤال' : 'Bookmark'}</span>
              </span>
              <span className="flex items-center gap-1.5">
                <kbd className="px-1.5 py-0.5 rounded bg-slate-950 border border-slate-800/80 text-amber-500 text-[9px] font-bold shadow">Ctrl</kbd>+
                <kbd className="px-1.5 py-0.5 rounded bg-slate-950 border border-slate-800/80 text-amber-500 text-[9px] font-bold shadow">Enter</kbd>:
                <span className="text-slate-400">{isRtl ? 'إنهاء وتسليم' : 'Submit Exam'}</span>
              </span>
              {currentQuestion.type === 'fill-in-blank' && (
                <span className="flex items-center gap-1.5">
                  <kbd className="px-1.5 py-0.5 rounded bg-slate-950 border border-slate-800/80 text-amber-500 text-[9px] font-bold shadow">Enter</kbd>:
                  <span className="text-slate-400">{isRtl ? 'التالي (أثناء الكتابة)' : 'Next (While Typing)'}</span>
                </span>
              )}
            </div>

            {/* Study Mode Instant Feedback panel */}
            {modeParam === 'study' && currentAns !== undefined && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-6 p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-2 text-xs md:text-sm"
              >
                <div className="flex items-center space-x-2 rtl:space-x-reverse text-amber-500 font-bold">
                  <HelpCircle className="w-4 h-4" />
                  <span>{t('explanation')}</span>
                </div>
                <p className="text-slate-400 leading-relaxed">
                  {getQuestionExplanation(currentQuestion)}
                </p>
              </motion.div>
            )}

          </div>

          {/* 5. Navigation Pagination controllers */}
          <div className="flex justify-between items-center" id="quiz-navigation">
            <button
              onClick={() => setCurrentIdx((prev) => Math.max(prev - 1, 0))}
              disabled={currentIdx === 0}
              className="flex items-center space-x-1.5 rtl:space-x-reverse bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 text-slate-400 hover:text-slate-200 px-4 py-2.5 rounded-xl text-xs font-bold transition-all disabled:opacity-30 disabled:pointer-events-none"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>{t('prev')}</span>
            </button>

            <div className="flex space-x-1 rtl:space-x-reverse">
              {questions.map((_, qIdx) => (
                <button
                  key={qIdx}
                  onClick={() => setCurrentIdx(qIdx)}
                  className={`w-2 h-2 rounded-full transition-all ${
                    currentIdx === qIdx 
                      ? 'bg-amber-500 w-4' 
                      : userAnswers[questions[qIdx].id] !== undefined 
                        ? 'bg-indigo-400' 
                        : 'bg-slate-800'
                  }`}
                  title={`Go to Question ${qIdx + 1}`}
                />
              ))}
            </div>

            {currentIdx < questions.length - 1 ? (
              <button
                onClick={() => setCurrentIdx((prev) => prev + 1)}
                className="flex items-center space-x-1.5 rtl:space-x-reverse bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 text-slate-400 hover:text-slate-200 px-4 py-2.5 rounded-xl text-xs font-bold transition-all"
              >
                <span>{t('next')}</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <div className="flex gap-2">
                <button
                  onClick={() => setShowReviewMode(true)}
                  className="bg-slate-950 hover:bg-slate-900 border border-slate-800 text-slate-300 hover:text-white px-4 py-2.5 rounded-xl text-xs font-bold transition-all"
                >
                  {isRtl ? 'مراجعة كافة الإجابات' : 'Review All Answers'}
                </button>
                <button
                  onClick={() => handleSubmitQuiz()}
                  className="bg-emerald-500 hover:bg-emerald-600 text-slate-900 font-extrabold px-5 py-2.5 rounded-xl text-xs shadow-lg shadow-emerald-500/10 transition-colors"
                >
                  {t('submitExam')}
                </button>
              </div>
            )}
          </div>

        </div>
        )
      )}

    </div>
  );
};
