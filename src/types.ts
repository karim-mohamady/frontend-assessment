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
  codeSnippet?: string;
  // For multiple-choice, multiple-answer, true-false
  options?: string[];
  optionsAr?: string[];
  // Correct answers: indices or strings
  correctAnswer: number[] | string | string[]; // numbers for indices, or strings/objects
  // For match columns format
  matchLeft?: string[];
  matchLeftAr?: string[];
  matchRight?: string[]; // correct matches correspond to indices in matchLeft
  matchRightAr?: string[];
  explanation: string;
  explanationAr: string;
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
}

export interface UserProgress {
  streak: number;
  lastActive: string; // ISO date
  completedAssessments: AssessmentResult[];
  bookmarks: string[]; // globally bookmarked question IDs
  achievements: string[]; // IDs of unlocked achievements
  userName: string;
}

export interface Achievement {
  id: string;
  titleEn: string;
  titleAr: string;
  descEn: string;
  descAr: string;
  icon: string;
  unlockedAt?: string;
}

export interface FAQItem {
  qEn: string;
  qAr: string;
  aEn: string;
  aAr: string;
}
