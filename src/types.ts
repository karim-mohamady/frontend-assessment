/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type Difficulty = 'easy' | 'medium' | 'hard' | 'expert';

export type QuestionType =
  | 'multiple-choice'
  | 'multiple-answer'
  | 'true-false'
  | 'fill-in-blank'
  | 'match-columns'
  | 'code-output'
  | 'bug-fixing';

export type QuestionCategory = 'html' | 'css' | 'javascript' | 'react' | 'bootstrap' | 'php' | 'laravel' | 'mysql' | 'backend' | 'english' | 'uiux' | 'web3' | 'figma' | 'solidity';

export type CareerTrack = 'frontend' | 'backend' | 'fullstack' | 'uiux' | 'web3';

export type AppLanguage = 'ar' | 'en' | 'it';

export interface Question {
  id: string;
  category: QuestionCategory;
  topic: string;
  difficulty: Difficulty;
  type: QuestionType;
  questionText: string;
  questionTextAr: string;
  questionTextIt?: string;
  questionTextEs?: string;
  codeSnippet?: string;
  // For multiple-choice, multiple-answer, true-false
  options?: string[];
  optionsAr?: string[];
  optionsIt?: string[];
  optionsEs?: string[];
  // Correct answers: indices or strings
  correctAnswer: number[] | string | string[]; // numbers for indices, or strings/objects
  // For match columns format
  matchLeft?: string[];
  matchLeftAr?: string[];
  matchLeftIt?: string[];
  matchLeftEs?: string[];
  matchRight?: string[]; // correct matches correspond to indices in matchLeft
  matchRightAr?: string[];
  matchRightIt?: string[];
  matchRightEs?: string[];
  explanation: string;
  explanationAr: string;
  explanationIt?: string;
  explanationEs?: string;
  hint?: string;
  hintAr?: string;
  hintIt?: string;
  hintEs?: string;
}

export interface AssessmentResult {
  id: string;
  category: QuestionCategory;
  date: string;
  score: number; // Final weighted score
  maxScore: number;
  percentage: number;
  accuracy: number; // percentage of correct items
  timeSpent: number; // in seconds
  correctCount: number;
  incorrectCount: number;
  skippedCount: number;
  answers: { [questionId: string]: any }; // user's selected answers
  bookmarks: string[]; // questions that were bookmarked
  strengths: string[];
  weaknesses: string[];
  difficultyBreakdown: {
    easy: { correct: number; total: number };
    medium: { correct: number; total: number };
    hard: { correct: number; total: number };
    expert: { correct: number; total: number };
  };
  mode: 'exam' | 'study' | 'daily';
  hintsUsed?: string[]; // IDs of questions where hints were revealed
}

export interface MockInterviewResult {
  id: string;
  category: string;
  difficulty: string;
  language: string;
  date: string;
  score: number; // 0-100 percentage
  overallSummary: string;
  qaHistory: {
    question: string;
    answer: string;
    feedback: string;
    score: number;
  }[];
}

export interface UserProgress {
  streak: number;
  lastActive: string; // ISO date
  completedAssessments: AssessmentResult[];
  bookmarks: string[]; // globally bookmarked question IDs
  achievements: string[]; // IDs of unlocked achievements
  userName: string;
  mockInterviews?: MockInterviewResult[];
  customAvatar?: string;
  selectedTrack?: CareerTrack;
}

export interface Achievement {
  id: string;
  titleEn: string;
  titleAr: string;
  titleIt?: string;
  titleEs?: string;
  descEn: string;
  descAr: string;
  descIt?: string;
  descEs?: string;
  icon: string;
  unlockedAt?: string;
}

export interface FAQItem {
  qEn: string;
  qAr: string;
  qIt?: string;
  aEn: string;
  aAr: string;
  aIt?: string;
}

