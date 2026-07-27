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

export interface Question {
  id: string;
  category: 'html' | 'css' | 'javascript' | 'react' | 'bootstrap' | 'english';
  topic: string;
  difficulty: Difficulty;
  type: QuestionType;
  questionText: string;
  questionTextAr: string;
  questionTextEs?: string;
  codeSnippet?: string;
  // For multiple-choice, multiple-answer, true-false
  options?: string[];
  optionsAr?: string[];
  optionsEs?: string[];
  // Correct answers: indices or strings
  correctAnswer: number[] | string | string[]; // numbers for indices, or strings/objects
  // For match columns format
  matchLeft?: string[];
  matchLeftAr?: string[];
  matchLeftEs?: string[];
  matchRight?: string[]; // correct matches correspond to indices in matchLeft
  matchRightAr?: string[];
  matchRightEs?: string[];
  explanation: string;
  explanationAr: string;
  explanationEs?: string;
  hint?: string;
  hintAr?: string;
  hintEs?: string;
}

export interface AssessmentResult {
  id: string;
  category: 'html' | 'css' | 'javascript' | 'react' | 'bootstrap' | 'english';
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
}

export interface Achievement {
  id: string;
  titleEn: string;
  titleAr: string;
  titleEs?: string;
  descEn: string;
  descAr: string;
  descEs?: string;
  icon: string;
  unlockedAt?: string;
}

export interface FAQItem {
  qEn: string;
  qAr: string;
  qEs?: string;
  aEn: string;
  aAr: string;
  aEs?: string;
}
