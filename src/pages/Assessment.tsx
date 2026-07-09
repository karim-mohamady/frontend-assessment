/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { generateProceduralQuestions, getQuestionsByCategory, generateCertificateId } from '../data/questions';
import { Question, Difficulty, QuestionType } from '../types';
import { 
  Play, Pause, BookMarked, ChevronLeft, ChevronRight, Check, AlertCircle, HelpCircle, Flame, Clock, RefreshCw, Bookmark, Award, GraduationCap
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const Assessment: React.FC = () => {
  const { t, isRtl, toggleGlobalBookmark, progress, saveAssessmentResult } = useApp();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const categoryParam = searchParams.get('category') || 'javascript';
  const modeParam = searchParams.get('mode') || 'exam'; // 'exam' | 'study' | 'daily'

  // Assessment configurations based on parameters
  const getCategoryTitle = (cat: string) => {
    switch (cat) {
      case 'html': return t('catHtml');
      case 'css': return t('catCss');
      case 'javascript': return t('catJs');
      case 'react': return t('catReact');
      case 'bootstrap': return t('catBs');
      case 'english': return t('catEng');
      default: return 'Evaluation';
    }
  };

  // State
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [userAnswers, setUserAnswers] = useState<{ [qId: string]: any }>({});
  const [localBookmarks, setLocalBookmarks] = useState<string[]>([]);
  const [isAssessmentSubmitted, setIsAssessmentSubmitted] = useState(false);
  const [difficultyFilter, setDifficultyFilter] = useState<Difficulty>('medium');
  const [isQuizConfiguring, setIsQuizConfiguring] = useState(true);

  // Timer states
  const [isTimerActive, setIsTimerActive] = useState(true);
  const [timeRemaining, setTimeRemaining] = useState(600); // 10 minutes default
  const [timeElapsed, setTimeElapsed] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Load questions based on wizard configuration
  const handleStartQuiz = () => {
    let qPool: Question[] = [];
    if (modeParam === 'daily') {
      // 5 mixed questions
      const cats: ('html' | 'css' | 'javascript' | 'react' | 'bootstrap' | 'english')[] = ['html', 'css', 'javascript', 'react', 'bootstrap', 'english'];
      cats.forEach((c) => {
        const singleQ = getQuestionsByCategory(c, 1, '', undefined);
        if (singleQ.length > 0) qPool.push(singleQ[0]);
      });
      qPool = qPool.sort(() => Math.random() - 0.5).slice(0, 5);
    } else {
      qPool = getQuestionsByCategory(categoryParam as any, 10, '', difficultyFilter);
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
      handleStartQuiz();
    }
  }, [modeParam]);

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
      mode: modeParam
    };

    saveAssessmentResult(result);

    // Redirect to custom Report View
    navigate('/report', { state: { result, questions } });
  };

  if (isQuizConfiguring && modeParam !== 'daily') {
    return (
      <div className="max-w-xl mx-auto px-4 py-16 space-y-8" id="assessment-setup-wizard">
        
        <div className="text-center space-y-3">
          <GraduationCap className="w-12 h-12 text-amber-500 mx-auto" />
          <h1 className="text-2xl md:text-3xl font-black text-white">Assessment Wizard</h1>
          <p className="text-sm text-slate-400">Configure your parameters for "{getCategoryTitle(categoryParam)}" evaluation.</p>
        </div>

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
            className="w-full bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-slate-900 font-extrabold py-3.5 rounded-xl shadow-lg shadow-amber-500/10 transition-all text-sm"
          >
            Launch Evaluation
          </button>

        </div>

      </div>
    );
  }

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
            {t('question')} {currentIdx + 1} of {questions.length}
          </p>
        </div>

        {/* Timer UI block */}
        <div className="flex items-center space-x-3 rtl:space-x-reverse">
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
                  {isRtl ? currentQuestion.questionTextAr : currentQuestion.questionText}
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

            {/* 4. Active Interactive Answers Rendering */}
            <div className="pt-4 border-t border-slate-950 space-y-3">
              
              {/* Type: Multiple Choice, Multiple Answer, True-False */}
              {(currentQuestion.type === 'multiple-choice' || currentQuestion.type === 'true-false' || currentQuestion.type === 'multiple-answer' || currentQuestion.type === 'code-output' || currentQuestion.type === 'bug-fixing') && (
                <div className="grid grid-cols-1 gap-3">
                  {(isRtl ? currentQuestion.optionsAr : currentQuestion.options)!.map((opt, oIdx) => {
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
                          <span className="w-6 h-6 rounded-lg bg-slate-900 flex items-center justify-center font-mono text-[10px] font-bold text-slate-500 group-hover:text-slate-300">
                            {String.fromCharCode(65 + oIdx)}
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
                  {isRtl ? currentQuestion.explanationAr : currentQuestion.explanation}
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
              <button
                onClick={() => handleSubmitQuiz()}
                className="bg-emerald-500 hover:bg-emerald-600 text-slate-900 font-extrabold px-5 py-2.5 rounded-xl text-xs shadow-lg shadow-emerald-500/10 transition-colors"
              >
                {t('submitExam')}
              </button>
            )}
          </div>

        </div>
      )}

    </div>
  );
};
