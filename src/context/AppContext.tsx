/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProgress, Achievement } from '../types';

// Localization Dictionary
export const TRANSLATIONS = {
  en: {
    title: 'Frontend Assessment Platform',
    heroTitle: 'Evaluate & Certify Your Front-End Developer Skills',
    heroSub: 'From beginner tags to expert hooks. Identify your strengths, address your weaknesses, and verify your job readiness with real, comprehensive testing.',
    startBtn: 'Start Assessment',
    continueBtn: 'Continue assessment',
    dailyChallenge: 'Daily Challenge',
    dailyChallengeDesc: 'A quick 5-question mix to maintain your learning streak!',
    certificates: 'Certificates',
    certSub: 'Pass any exam above 70% to unlock your professional, verifiable certificate.',
    aboutTitle: 'About The Platform',
    aboutText: 'This interactive engine evaluates standard HTML5 structures, advanced CSS specificity, responsive grids, asynchronous JS pipelines, modern React 19, and professional technical developer vocabulary. Fully aligned with commercial certification expectations.',
    faqTitle: 'Frequently Asked Questions',
    footerRights: 'All Rights Reserved. Created as a premium developer evaluation benchmark.',
    
    // Categories
    catHtml: 'HTML5 & Semantics',
    catCss: 'CSS3, Grid & Flexbox',
    catJs: 'JavaScript & Async ES6+',
    catReact: 'React, Hooks & Architecture',
    catBs: 'Bootstrap 5 & Layouts',
    catEng: 'Technical English for Devs',

    // Category descriptions
    catHtmlDesc: 'Semantic structures, Forms, inputs, ARIA attributes, SEO and accessibility guidelines.',
    catCssDesc: 'Box model, cascading specificity, Flexbox, Grid layouts, transitions and CSS variables.',
    catJsDesc: 'Closures, scope, promises, async/await pipelines, DOM events, and prototypes.',
    catReactDesc: 'Hooks lifecycle, state closures, memoization, Context API, and React 19 concurrent features.',
    catBsDesc: 'Responsive grids, utility layout wrappers, form control systems, and modular structures.',
    catEngDesc: 'Error logs reading, API documents parsing, Git vocabulary, and professional coding terms.',

    // Modes & Stats
    overallScore: 'Overall Front-End Score',
    completedTests: 'Completed Tests',
    remainingTests: 'Remaining Tests',
    learningStreak: 'Learning Streak',
    streakDays: '{{count}} Days',
    avgAccuracy: 'Average Accuracy',
    timeSpent: 'Total Time Spent',
    sec: 'sec',
    min: 'mins',
    hr: 'hours',
    strongestSkills: 'Strongest Core Skills',
    weakestSkills: 'Skills Requiring Practice',
    recommendations: 'AI Study Recommendations',
    noAssessmentsYet: 'No assessments completed yet. Take your first test to compile your stats!',
    
    // Assessment UI
    question: 'Question',
    difficulty: 'Difficulty',
    type: 'Question Type',
    bookmark: 'Bookmark',
    bookmarked: 'Bookmarked',
    next: 'Next Question',
    prev: 'Previous Question',
    submitExam: 'Submit Assessment',
    confirmSubmit: 'Are you sure you want to submit? Skipped questions will count as incorrect.',
    timer: 'Timer',
    examMode: 'Exam Mode',
    studyMode: 'Study Mode',
    reviewAnswers: 'Review Answers',
    correct: 'Correct!',
    incorrect: 'Incorrect',
    explanation: 'Explanation',
    retryIncorrect: 'Retry Incorrect Questions',
    practiceMode: 'Practice Mode',

    // Difficulties
    easy: 'Easy',
    medium: 'Medium',
    hard: 'Hard',
    expert: 'Expert',

    // Technical Job Readiness
    readinessTitle: 'Job Readiness Verdict',
    readyJunior: 'Ready for Junior Front-End Positions',
    readyMid: 'Ready for Mid-Level Front-End Positions',
    notReadyYet: 'Continuing Development Required',
    readinessDesc: 'Calculated using accuracy weights, expert difficulty scores, and total category coverage.',

    // Settings & Actions
    profileSettings: 'Profile Settings',
    developerName: 'Developer Name',
    save: 'Save Changes',
    exportData: 'Export Progress',
    importData: 'Import Progress',
    clearData: 'Reset All Progress',
    dangerZone: 'Danger Zone',
    achievements: 'Platform Achievements',
    
    // UI Theme & Lang
    lightMode: 'Light Mode',
    darkMode: 'Dark Mode',
    language: 'Language',
    dashboard: 'Dashboard',
    home: 'Home',
    sandbox: 'Coding Arena',
    assessments: 'Assessments',
    viewCert: 'View Certificate',
    printCert: 'Print / Export',
    verifiedCert: 'VERIFIED DEVELOPER ASSESSMENT CERTIFICATE'
  },
  ar: {
    title: 'منصة تقييم مطوري الواجهة الأمامية',
    heroTitle: 'قيّم واعتمِد مهاراتك كمطور واجهة أمامية محترف',
    heroSub: 'من وسوم المبتدئين إلى خطافات الخبراء. حدد نقاط قوتك، وعالج نقاط ضعفك، وتحقق من جاهزيتك للوظائف من خلال اختبارات حقيقية وشاملة.',
    startBtn: 'ابدأ التقييم',
    continueBtn: 'متابعة التقييم',
    dailyChallenge: 'التحدي اليومي',
    dailyChallengeDesc: 'مزيج سريع من 5 أسئلة للحفاظ على سلسلة تعلمك ونشاطك!',
    certificates: 'الشهادات المتاحة',
    certSub: 'اجتز أي اختبار بنسبة أعلى من 70٪ لفتح شهادة مهنية قابلة للتحقق والطباعة فوراً.',
    aboutTitle: 'حول المنصة والتقييم',
    aboutText: 'يقوم هذا المحرك التفاعلي بتقييم هياكل HTML5 القياسية، وخصوصية CSS المتقدمة، والشبكات المتجاوبة، وتدفقات JS غير المتزامنة، وReact 19 الحديثة، والمصطلحات التقنية للمطورين المحترفين. متوافق تماماً مع توقعات الاعتماد التجاري.',
    faqTitle: 'الأسئلة الشائعة',
    footerRights: 'جميع الحقوق محفوظة. تم إنشاؤها كمعيار تقييم متميز للمطورين.',

    // Categories
    catHtml: 'HTML5 والهياكل الدلالية',
    catCss: 'CSS3 والشبكات والتجاوب',
    catJs: 'جافا سكريبت والمزامنة وES6+',
    catReact: 'ريأكت والخطافات والبنية البرمجية',
    catBs: 'بوتستراب 5 والتخطيطات',
    catEng: 'اللغة الإنجليزية للمطورين',

    // Category descriptions
    catHtmlDesc: 'الهياكل الدلالية، النماذج، المدخلات، سمات ARIA، وإرشادات تحسين محركات البحث سيو وإمكانية الوصول.',
    catCssDesc: 'نموذج الصندوق، الخصوصية المتتالية، Flexbox، شبكة Grid، الانتقالات المتكاملة ومتغيرات CSS.',
    catJsDesc: 'الclosures، النطاقات، الوعود وعمليات المزامنة، أحداث DOM، والبروتوتيب الموروث.',
    catReactDesc: 'دورة حياة الخطافات، والclosures في الحالة، والتخزين المؤقت، وسياق Context API، ومميزات React 19.',
    catBsDesc: 'الشبكات المتجاوبة، أدوات التخطيط السريعة، أنظمة التحكم في النماذج، والهياكل البرمجية الموحدة.',
    catEngDesc: 'قراءة سجلات الأخطاء، تحليل مستندات واجهات البرمجيات، مصطلحات Git، والتعبيرات التقنية للمبرمجين.',

    // Modes & Stats
    overallScore: 'مجموع نقاط الواجهة الأمامية',
    completedTests: 'الاختبارات المكتملة',
    remainingTests: 'الاختبارات المتبقية',
    learningStreak: 'سلسلة التعلم والنشاط',
    streakDays: '{{count}} أيام',
    avgAccuracy: 'متوسط الدقة والإتقان',
    timeSpent: 'إجمالي الوقت المستغرق',
    sec: 'ثانية',
    min: 'دقيقة',
    hr: 'ساعة',
    strongestSkills: 'أقوى المهارات الأساسية',
    weakestSkills: 'مهارات تتطلب ممارسة وتدريب',
    recommendations: 'توصيات الدراسة الذكية (AI)',
    noAssessmentsYet: 'لم تكتمل أي اختبارات حتى الآن. خذ اختبارك الأول لتجميع إحصاءاتك المهنية!',

    // Assessment UI
    question: 'سؤال',
    difficulty: 'مستوى الصعوبة',
    type: 'نوع السؤال',
    bookmark: 'حفظ المرجعية',
    bookmarked: 'تم الحفظ',
    next: 'السؤال التالي',
    prev: 'السؤال السابق',
    submitExam: 'تسليم التقييم النهائي',
    confirmSubmit: 'هل أنت متأكد من رغبتك في تسليم الاختبار؟ الأسئلة التي تم تخطيها ستعتبر إجابات خاطئة.',
    timer: 'المؤقت',
    examMode: 'وضع الامتحان',
    studyMode: 'وضع الدراسة والشرح',
    reviewAnswers: 'مراجعة الإجابات وشرحها',
    correct: 'إجابة صحيحة!',
    incorrect: 'إجابة غير صحيحة',
    explanation: 'تفسير وشرح الإجابة',
    retryIncorrect: 'إعادة محاولة الأسئلة الخاطئة',
    practiceMode: 'وضع الممارسة الحرة',

    // Difficulties
    easy: 'سهل',
    medium: 'متوسط',
    hard: 'صعب',
    expert: 'خبير / احترافي',

    // Technical Job Readiness
    readinessTitle: 'قرار الجاهزية للوظائف',
    readyJunior: 'مؤهل لوظائف مطور واجهة أمامية مبتدئ (Junior)',
    readyMid: 'مؤهل لوظائف مطور واجهة أمامية متوسط (Mid-Level)',
    notReadyYet: 'يتطلب مواصلة التعلم والتدريب',
    readinessDesc: 'تم حساب الجاهزية بناءً على أوزان دقة الإجابات، نتائج الأسئلة الخبيرة، والتغطية الشاملة للفئات.',

    // Settings & Actions
    profileSettings: 'إعدادات الملف الشخصي',
    developerName: 'اسم المطور',
    save: 'حفظ التعديلات',
    exportData: 'تصدير التقدم البرمجي',
    importData: 'استيراد التقدم البرمجي',
    clearData: 'حذف وإعادة ضبط كافة التقدم',
    dangerZone: 'منطقة الخطر الإداري',
    achievements: 'إنجازات وأوسمة المنصة',

    // UI Theme & Lang
    lightMode: 'المظهر المضيء',
    darkMode: 'المظهر الداكن',
    language: 'اللغة المعتمدة',
    dashboard: 'لوحة التحكم',
    home: 'الرئيسية',
    sandbox: 'تحديات الكود',
    assessments: 'التقييمات',
    viewCert: 'استعراض الشهادة المعتمدة',
    printCert: 'طباعة / تصدير PDF',
    verifiedCert: 'شهادة معتمدة لتقييم مطوري الواجهة الأمامية'
  }
};

export const ACHIEVEMENTS: Achievement[] = [
  {
    id: 'ach-first-step',
    titleEn: 'First Steps Taken',
    titleAr: 'الخطوة الأولى',
    descEn: 'Complete your first skill assessment on the platform.',
    descAr: 'أكمل أول تقييم مهارات لك على المنصة بنجاح.',
    icon: '🚀'
  },
  {
    id: 'ach-html-master',
    titleEn: 'HTML5 Architect',
    titleAr: 'مهندس هيكلة الويب',
    descEn: 'Score 90% or higher on the HTML assessment.',
    descAr: 'احصل على نتيجة 90% أو أعلى في تقييم HTML دلالي.',
    icon: '🧱'
  },
  {
    id: 'ach-css-wizard',
    titleEn: 'CSS Specificity Wizard',
    titleAr: 'ساحر تصاميم CSS',
    descEn: 'Score 90% or higher on the CSS assessment.',
    descAr: 'احصل على نتيجة 90% أو أعلى في تقييم تخطيطات CSS.',
    icon: '🎨'
  },
  {
    id: 'ach-js-ninja',
    titleEn: 'JS Closure Ninja',
    titleAr: 'محارب جافا سكريبت',
    descEn: 'Score 90% or higher on the JavaScript assessment.',
    descAr: 'احصل على نتيجة 90% أو أعلى في تقييم JavaScript.',
    icon: '⚡'
  },
  {
    id: 'ach-react-expert',
    titleEn: 'React Hook Wizard',
    titleAr: 'خبير مكونات ريأكت',
    descEn: 'Score 90% or higher on the React assessment.',
    descAr: 'احصل على نتيجة 90% أو أعلى في تقييم React 19.',
    icon: '⚛️'
  },
  {
    id: 'ach-streak-3',
    titleEn: 'Dedicated Learner',
    titleAr: 'المبرمج الملتزم',
    descEn: 'Maintain a learning streak of 3 days or more.',
    descAr: 'حافظ على سلسلة تعلم نشطة لمدة 3 أيام متتالية أو أكثر.',
    icon: '🔥'
  },
  {
    id: 'ach-multilingual',
    titleEn: 'Polyglot Dev',
    titleAr: 'مطور متعدد اللغات',
    descEn: 'Toggle language options to assess in English and Arabic.',
    descAr: 'قم بتبديل خيارات اللغة للتقييم باللغتين العربية والإنجليزية.',
    icon: '🌐'
  },
  {
    id: 'ach-speedster',
    titleEn: 'Light Speed Syntax',
    titleAr: 'سرعة البرق البرمجية',
    descEn: 'Submit an assessment with average speed under 15s per item.',
    descAr: 'قم بتسليم أي تقييم بمتوسط وقت أقل من 15 ثانية لكل سؤال.',
    icon: '💨'
  }
];

interface AppContextType {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  lang: 'en' | 'ar';
  setLang: (l: 'en' | 'ar') => void;
  t: (key: keyof typeof TRANSLATIONS['en']) => string;
  isRtl: boolean;
  progress: UserProgress;
  setUserName: (name: string) => void;
  saveAssessmentResult: (result: any) => void;
  toggleGlobalBookmark: (qId: string) => void;
  clearAllProgress: () => void;
  importProgress: (jsonStr: string) => boolean;
  exportProgress: () => string;
  unlockAchievement: (id: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // 1. Theme state
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    const saved = localStorage.getItem('assess-theme');
    return (saved as 'light' | 'dark') || 'dark'; // Elegant Dark mode by default for premium developer feel
  });

  // 2. Language state
  const [lang, setLangState] = useState<'en' | 'ar'>(() => {
    const saved = localStorage.getItem('assess-lang');
    return (saved as 'en' | 'ar') || 'en';
  });

  // 3. User progress state
  const [progress, setProgress] = useState<UserProgress>(() => {
    const saved = localStorage.getItem('assess-progress-v1');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // use default
      }
    }
    return {
      streak: 1,
      lastActive: new Date().toISOString().split('T')[0],
      completedAssessments: [],
      bookmarks: [],
      achievements: [],
      userName: 'Elite Developer'
    };
  });

  // Synchronize streak on mount
  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    const lastActive = progress.lastActive;

    if (lastActive !== today) {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayStr = yesterday.toISOString().split('T')[0];

      let newStreak = progress.streak;
      if (lastActive === yesterdayStr) {
        newStreak += 1;
      } else {
        // Broke streak, reset to 1
        newStreak = 1;
      }

      setProgress((prev) => {
        const updated = {
          ...prev,
          streak: newStreak,
          lastActive: today
        };
        localStorage.setItem('assess-progress-v1', JSON.stringify(updated));
        return updated;
      });
    }
  }, []);

  // Sync theme
  useEffect(() => {
    localStorage.setItem('assess-theme', theme);
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [theme]);

  // Sync RTL
  const isRtl = lang === 'ar';
  useEffect(() => {
    localStorage.setItem('assess-lang', lang);
    document.documentElement.dir = isRtl ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;
  }, [lang, isRtl]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
    // Unlock night owl achievement
    unlockAchievement('ach-night-owl');
  };

  const setLang = (l: 'en' | 'ar') => {
    setLangState(l);
    unlockAchievement('ach-multilingual');
  };

  const t = (key: keyof typeof TRANSLATIONS['en']): string => {
    const dict = TRANSLATIONS[lang] || TRANSLATIONS['en'];
    return (dict[key] as string) || (TRANSLATIONS['en'][key] as string) || String(key);
  };

  // State sync helper
  const saveProgressState = (newProgress: UserProgress) => {
    setProgress(newProgress);
    localStorage.setItem('assess-progress-v1', JSON.stringify(newProgress));
  };

  const setUserName = (name: string) => {
    saveProgressState({
      ...progress,
      userName: name || 'Elite Developer'
    });
  };

  const unlockAchievement = (id: string) => {
    if (progress.achievements.includes(id)) return;
    const exists = ACHIEVEMENTS.find((a) => a.id === id) || id === 'ach-night-owl';
    if (!exists && id !== 'ach-night-owl') return;

    const updatedAchievements = [...progress.achievements, id];
    saveProgressState({
      ...progress,
      achievements: updatedAchievements
    });
  };

  const saveAssessmentResult = (result: any) => {
    const updatedHistory = [result, ...progress.completedAssessments];
    
    // Check achievements
    const achievementsToUnlock = [...progress.achievements];
    
    if (!achievementsToUnlock.includes('ach-first-step')) {
      achievementsToUnlock.push('ach-first-step');
    }

    // Category master checks (>90% score)
    const isMaster = result.percentage >= 90;
    if (isMaster) {
      if (result.category === 'html' && !achievementsToUnlock.includes('ach-html-master')) {
        achievementsToUnlock.push('ach-html-master');
      } else if (result.category === 'css' && !achievementsToUnlock.includes('ach-css-wizard')) {
        achievementsToUnlock.push('ach-css-wizard');
      } else if (result.category === 'javascript' && !achievementsToUnlock.includes('ach-js-ninja')) {
        achievementsToUnlock.push('ach-js-ninja');
      } else if (result.category === 'react' && !achievementsToUnlock.includes('ach-react-expert')) {
        achievementsToUnlock.push('ach-react-expert');
      }
    }

    // Speedster check (<15 seconds average time per question)
    const avgTimePerQ = result.timeSpent / (result.correctCount + result.incorrectCount + result.skippedCount || 1);
    if (avgTimePerQ < 15 && !achievementsToUnlock.includes('ach-speedster')) {
      achievementsToUnlock.push('ach-speedster');
    }

    // Streak check
    if (progress.streak >= 3 && !achievementsToUnlock.includes('ach-streak-3')) {
      achievementsToUnlock.push('ach-streak-3');
    }

    saveProgressState({
      ...progress,
      completedAssessments: updatedHistory,
      achievements: achievementsToUnlock
    });
  };

  const toggleGlobalBookmark = (qId: string) => {
    const isBookmarked = progress.bookmarks.includes(qId);
    let updatedBookmarks: string[];
    if (isBookmarked) {
      updatedBookmarks = progress.bookmarks.filter((id) => id !== qId);
    } else {
      updatedBookmarks = [...progress.bookmarks, qId];
    }
    saveProgressState({
      ...progress,
      bookmarks: updatedBookmarks
    });
  };

  const clearAllProgress = () => {
    const defaultProgress: UserProgress = {
      streak: 1,
      lastActive: new Date().toISOString().split('T')[0],
      completedAssessments: [],
      bookmarks: [],
      achievements: [],
      userName: 'Elite Developer'
    };
    saveProgressState(defaultProgress);
  };

  const exportProgress = (): string => {
    return btoa(JSON.stringify(progress));
  };

  const importProgress = (jsonStr: string): boolean => {
    try {
      const decoded = atob(jsonStr);
      const parsed = JSON.parse(decoded);
      if (parsed && typeof parsed === 'object' && 'userName' in parsed) {
        saveProgressState(parsed);
        return true;
      }
    } catch (e) {
      // invalid data
    }
    return false;
  };

  return (
    <AppContext.Provider
      value={{
        theme,
        toggleTheme,
        lang,
        setLang,
        t,
        isRtl,
        progress,
        setUserName,
        saveAssessmentResult,
        toggleGlobalBookmark,
        clearAllProgress,
        importProgress,
        exportProgress,
        unlockAchievement
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
