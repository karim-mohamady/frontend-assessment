/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProgress, Achievement, MockInterviewResult, AppLanguage, CareerTrack, Question, Difficulty } from '../types';
import { BADGES } from '../data/badges';
import { getQuestionsByTrack } from '../data/questions';

// Localization Dictionary
export const TRANSLATIONS = {
  en: {
    title: 'code-interview-Assessment',
    heroTitle: 'Evaluate, Revise & Certify Developer Mastery',
    heroSub: 'Multi-track assessments across Frontend, Backend, UI/UX, and Web3. Live coding sandboxes, interactive revision notes, interview preparation, and verifiable reports.',
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
    catPhp: 'PHP 8.x & OOP Security',
    catLaravel: 'Laravel 11 & Eloquent ORM',
    catMysql: 'MySQL, SQL JOINs & Indexes',
    catBackend: 'Backend Architecture & APIs',
    catEng: 'Technical English for Devs',
    catUiux: 'UI/UX Design Systems & Research',
    catFigma: 'Figma Auto-Layout & Design Tokens',
    catWeb3: 'Web3 & Blockchain Fundamentals',
    catSolidity: 'Solidity & Smart Contract Security',

    // Category descriptions
    catHtmlDesc: 'Semantic structures, Forms, inputs, ARIA attributes, SEO and accessibility guidelines.',
    catCssDesc: 'Box model, cascading specificity, Flexbox, Grid layouts, transitions and CSS variables.',
    catJsDesc: 'Closures, scope, promises, async/await pipelines, DOM events, and prototypes.',
    catReactDesc: 'Hooks lifecycle, state closures, memoization, Context API, and React 19 concurrent features.',
    catBsDesc: 'Responsive grids, utility layout wrappers, form control systems, and modular structures.',
    catPhpDesc: 'PHP 8.x types, OOP property promotion, PDO security, namespaces, and Composer autoloader.',
    catLaravelDesc: 'Eloquent relationships, Artisan CLI, Middleware pipelines, Service Container, and Blade.',
    catMysqlDesc: 'SQL queries, JOINs, B-Tree indexes, ACID transactions, normalization, and FOREIGN KEYs.',
    catBackendDesc: 'RESTful API architecture, JWT authentication, Redis caching, CORS security, and status codes.',
    catEngDesc: 'Error logs reading, API documents parsing, Git vocabulary, and professional coding terms.',
    catUiuxDesc: 'User personas, journey mapping, wireframing, color theory, typography scale, and WCAG accessibility.',
    catFigmaDesc: 'Auto-Layout 5.0, component variants, interactive prototypes, design tokens, and dev handoff.',
    catWeb3Desc: 'Ethereum EVM, decentralized ledger, gas optimization, wallet connections (Metamask), and dApp flows.',
    catSolidityDesc: 'Smart contracts, reentrancy guards, ERC-20/ERC-721 standards, Hardhat deployment, and ABI interfaces.',

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
    signIn: 'Sign In',
    signOut: 'Sign Out',
    loginDesc: 'Sync your achievements, coding challenges, and assessment scores securely to the cloud.',
    firebaseActive: 'Cloud Sync Active',
    firebaseOffline: 'Local Session',
    
    // UI Theme & Lang
    lightMode: 'Light Mode',
    darkMode: 'Dark Mode',
    language: 'Language',
    dashboard: 'Dashboard',
    home: 'Home',
    sandbox: 'Coding Arena',
    interviewPrep: 'Interview Prep',
    assessments: 'Assessments',
    viewCert: 'View Certificate',
    printCert: 'Print / Export',
    verifiedCert: 'VERIFIED DEVELOPER ASSESSMENT CERTIFICATE'
  },
  ar: {
    title: 'code-interview-Assessment',
    heroTitle: 'قيّم واعتمِد ورراجع مهاراتك البرمجية الاحترافية',
    heroSub: 'تقييمات متعددة المسارات في الواجهة الأمامية، الباك إند، UI/UX، والويب 3. مع بيئة بيئة برمجة حية، ملاحظات مراجعة شخصية، واستعداد للمقابلات.',
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
    catPhp: 'PHP 8.x والبرمجة الكائنية والأمان',
    catLaravel: 'لارافيل 11 وعلاقات Eloquent',
    catMysql: 'MySQL واستعلامات SQL والفهارس',
    catBackend: 'هندسة الباك إند والـ APIs',
    catEng: 'اللغة الإنجليزية للمطورين',
    catUiux: 'تصميم الواجهات وتجربة المستخدم UI/UX',
    catFigma: 'أداة Figma والتخطيط التلقائي Auto-Layout',
    catWeb3: 'أساسيات Web3 وتقنية البلوكشين',
    catSolidity: 'لغة Solidity وأمان العقود الذكية',

    // Category descriptions
    catHtmlDesc: 'الهياكل الدلالية، النماذج، المدخلات، سمات ARIA، وإرشادات تحسين محركات البحث سيو وإمكانية الوصول.',
    catCssDesc: 'نموذج الصندوق، الخصوصية المتتالية، Flexbox، شبكة Grid، الانتقالات المتكاملة ومتغيرات CSS.',
    catJsDesc: 'الclosures، النطاقات، الوعود وعمليات المزامنة، أحداث DOM، والبروتوتيب الموروث.',
    catReactDesc: 'دورة حياة الخطافات، والclosures في الحالة، والتخزين المؤقت، وسياق Context API، ومميزات React 19.',
    catBsDesc: 'الشبكات المتجاوبة، أدوات التخطيط السريعة، أنظمة التحكم في النماذج، والهياكل البرمجية الموحدة.',
    catPhpDesc: 'أنواع PHP 8.x، ترقية خصائص البناء، أمان استعلامات PDO، مساحات الأسماء والتحميل التلقائي.',
    catLaravelDesc: 'علاقات Eloquent ORM، أواامر Artisan، وسائط Middleware، حاوية الخدمات وقوالب Blade.',
    catMysqlDesc: 'استعلامات SQL، عمليات الربط JOINs، فهارس B-Tree، معاملات ACID، التنسيق والمفاتيح الأجنبية.',
    catBackendDesc: 'معمارية RESTful API، توكنات JWT، التخزين المؤقت بـ Redis، أمان CORS ورموز حالات HTTP.',
    catEngDesc: 'قراءة سجلات الأخطاء، تحليل مستندات واجهات البرمجيات، مصطلحات Git، والتعبيرات التقنية للمبرمجين.',
    catUiuxDesc: 'شخصيات المستخدمين، خرائط رحلة العميل، التخطيط السلكي، نظرية الألوان، هرمية الخطوط، وسهولة الوصول WCAG.',
    catFigmaDesc: 'تخطيط Auto-Layout 5.0، متغيرات المكونات، النماذج التفاعلية، متغيرات التصميم Tokens، وتسليم الأكواد للمطورين.',
    catWeb3Desc: 'شبكة Ethereum EVM، السجل اللامركزي، تحسين رسوم Gas، ربط المحافظ (Metamask)، وتدفقات تطبيقات dApps.',
    catSolidityDesc: 'العقود الذكية، حماية Reentrancy، معايير ERC-20/ERC-721، بيئة Hardhat، وواجهات ABI.',

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
    signIn: 'تسجيل الدخول',
    signOut: 'تسجيل الخروج',
    loginDesc: 'احفظ إنجازاتك وتحديات الكود ودرجاتك البرمجية بأمان في السحابة ومزامنتها تلقائياً.',
    firebaseActive: 'المزامنة السحابية نشطة',
    firebaseOffline: 'جلسة تخزين محلية (أوفلاين)',

    // UI Theme & Lang
    lightMode: 'المظهر المضيء',
    darkMode: 'المظهر الداكن',
    language: 'اللغة المعتمدة',
    dashboard: 'لوحة التحكم',
    home: 'الرئيسية',
    sandbox: 'تحديات الكود',
    interviewPrep: 'التحضير للمقابلات',
    assessments: 'التقييمات',
    viewCert: 'استعراض الشهادة المعتمدة',
    printCert: 'طباعة / تصدير PDF',
    verifiedCert: 'شهادة معتمدة لتقييم مطوري الواجهة الأمامية'
  },
  it: {
    title: 'code-interview-Assessment',
    heroTitle: 'Valuta e Certifica le tue Competenze Front-End & Back-End',
    heroSub: 'Da HTML/CSS e React a PHP 8, Laravel 11, MySQL e REST API. Identifica i punti di forza, migliora le debolezze e ottieni certificati verificabili.',
    startBtn: 'Inizia Valutazione',
    continueBtn: 'Continua valutazione',
    dailyChallenge: 'Sfida Giornaliera',
    dailyChallengeDesc: 'Un quiz rapido di 5 domande per mantenere la tua striscia di apprendimento!',
    certificates: 'Certificati',
    certSub: 'Supera qualsiasi esame oltre il 70% per sbloccare il tuo certificato professionale verificabile.',
    aboutTitle: 'Sulla Piattaforma',
    aboutText: 'Questo motore interattivo valuta strutture HTML5, CSS avanzato, JS asincrono, React 19, PHP 8 OOP, Laravel 11, MySQL e API REST secondo standard commerciali.',
    faqTitle: 'Domande Frequenti',
    footerRights: 'Tutti i diritti riservati. Sviluppato come benchmark di valutazione professionale.',
    
    // Tracks
    trackTitle: 'Seleziona il tuo Percorso',
    trackFrontend: 'Percorso Front-End',
    trackBackend: 'Percorso Back-End',
    trackFullstack: 'Vista Full-Stack',
    trackFrontendDesc: 'HTML5, CSS3, JS ES6+, React 19 & Bootstrap',
    trackBackendDesc: 'PHP 8.x, Laravel 11, MySQL & REST API',
    trackFullstackDesc: 'Ingegneria Web Completa',

    // Categories
    catHtml: 'HTML5 e Semantica',
    catCss: 'CSS3, Grid & Flexbox',
    catJs: 'JavaScript & Async ES6+',
    catReact: 'React, Hooks & Architettura',
    catBs: 'Bootstrap 5 e Layout',
    catPhp: 'PHP 8.x e Sicurezza OOP',
    catLaravel: 'Laravel 11 ed Eloquent ORM',
    catMysql: 'MySQL, SQL JOIN e Indici',
    catBackend: 'Architettura Backend e API',
    catEng: 'Inglese Tecnico per Dev',
    catUiux: 'UI/UX Design Systems & Research',
    catFigma: 'Figma Auto-Layout & Design Tokens',
    catWeb3: 'Fondamenti di Web3 & Blockchain',
    catSolidity: 'Solidity & Sicurezza Smart Contract',

    // Category descriptions
    catHtmlDesc: 'Strutture semantiche, Form, input, attributi ARIA, SEO e accessibilità.',
    catCssDesc: 'Box model, specificità CSS, Flexbox, Grid, transizioni e variabili CSS.',
    catJsDesc: 'Closure, scope, promise, pipeline async/await, eventi DOM e prototipi.',
    catReactDesc: 'Ciclo di vita degli Hook, stato, memoizzazione, Context API e React 19.',
    catBsDesc: 'Griglie responsive, utility layout, moduli e strutture modulari.',
    catPhpDesc: 'Tipi PHP 8.x, promozioni proprietà OOP, sicurezza PDO, namespace e Composer.',
    catLaravelDesc: 'Relazioni Eloquent, Artisan CLI, Middleware, Service Container e Blade.',
    catMysqlDesc: 'Query SQL, JOIN, indici B-Tree, transazioni ACID e chiavi esterne.',
    catBackendDesc: 'Architettura REST API, autenticazione JWT, cache Redis, CORS e codici HTTP.',
    catEngDesc: 'Lettura dei log di errore, analisi documenti API, vocabolario Git e termini tecnici.',
    catUiuxDesc: 'User persona, journey map, wireframe, teoria dei colori, tipografia e accessibilità WCAG.',
    catFigmaDesc: 'Auto-Layout 5.0, varianti di componenti, prototipi interattivi, design tokens e handoff.',
    catWeb3Desc: 'Ethereum EVM, registro decentralizzato, ottimizzazione gas, connessione wallet e dApp.',
    catSolidityDesc: 'Smart contract, protezione reentrancy, standard ERC-20/ERC-721, Hardhat e interfacce ABI.',

    // Modes & Stats
    overallScore: 'Punteggio Generale Ingegneria',
    completedTests: 'Test Completati',
    remainingTests: 'Test Rimanenti',
    learningStreak: 'Striscia di Apprendimento',
    streakDays: '{{count}} Giorni',
    avgAccuracy: 'Accuratezza Media',
    timeSpent: 'Tempo Totale Trascorso',
    sec: 'sec',
    min: 'min',
    hr: 'ore',
    strongestSkills: 'Punti di Forza',
    weakestSkills: 'Competenze da Migliorare',
    recommendations: 'Raccomandazioni di Studio AI',
    noAssessmentsYet: 'Nessuna valutazione completata finora. Fai il tuo primo test!',
    
    // Assessment UI
    question: 'Domanda',
    difficulty: 'Difficoltà',
    type: 'Tipo di Domanda',
    bookmark: 'Salva',
    bookmarked: 'Salvato',
    next: 'Prossima Domanda',
    prev: 'Domanda Precedente',
    submitExam: 'Invia Valutazione',
    confirmSubmit: 'Sei sicuro di voler inviare? Le domande saltate saranno conteggiate come errate.',
    timer: 'Timer',
    examMode: 'Modalità Esame',
    studyMode: 'Modalità Studio',
    reviewAnswers: 'Rivedi Risposte',
    correct: 'Corretto!',
    incorrect: 'Errato',
    explanation: 'Spiegazione',
    retryIncorrect: 'Riprova Domande Errate',
    practiceMode: 'Modalità Esercitazione',

    // Difficulties
    easy: 'Facile',
    medium: 'Medio',
    hard: 'Difficile',
    expert: 'Esperto',

    // Technical Job Readiness
    readinessTitle: 'Verdetto di Idoneità Lavorativa',
    readyJunior: 'Pronto per Posizioni Junior Developer',
    readyMid: 'Pronto per Posizioni Mid-Level Developer',
    notReadyYet: 'Sviluppo Continuo Richiesto',
    readinessDesc: 'Calcolato utilizzando la precisione, i punteggi di difficoltà e la copertura dei temi.',

    // Settings & Actions
    profileSettings: 'Impostazioni Profilo',
    developerName: 'Nome Sviluppatore',
    save: 'Salva Modifiche',
    exportData: 'Esporta Progressi',
    importData: 'Importa Progressi',
    clearData: 'Ripristina Progressi',
    dangerZone: 'Zona di Pericolo',
    achievements: 'Obiettivi della Piattaforma',
    signIn: 'Accedi',
    signOut: 'Disconnetti',
    loginDesc: 'Sincronizza i tuoi risultati e le tue valutazioni in modo sicuro nel cloud.',
    firebaseActive: 'Sincronizzazione Cloud Attiva',
    firebaseOffline: 'Sessione Locale Dev',
    
    // UI Theme & Lang
    lightMode: 'Modalità Chiara',
    darkMode: 'Modalità Scura',
    language: 'Lingua',
    dashboard: 'Dashboard',
    home: 'Home',
    sandbox: 'Arena Codice',
    interviewPrep: 'Colloquio AI',
    assessments: 'Valutazioni',
    viewCert: 'Visualizza Certificato',
    printCert: 'Stampa / Esporta PDF',
    verifiedCert: 'CERTIFICADO DI VALUTAZIONE SVILUPPATORE VERIFICATO'
  }
};

export const ACHIEVEMENTS: Achievement[] = [
  {
    id: 'ach-first-step',
    titleEn: 'First Steps Taken',
    titleAr: 'الخطوة الأولى',
    titleIt: 'Primi Passi Fatti',
    descEn: 'Complete your first skill assessment on the platform.',
    descAr: 'أكمل أول تقييم مهارات لك على المنصة بنجاح.',
    descIt: 'Completa la tua prima valutazione sulla piattaforma.',
    icon: '🚀'
  },
  {
    id: 'ach-html-master',
    titleEn: 'HTML5 Architect',
    titleAr: 'مهندس هيكلة الويب',
    titleIt: 'Architetto HTML5',
    descEn: 'Score 90% or higher on the HTML assessment.',
    descAr: 'احصل على نتيجة 90% أو أعلى في تقييم HTML دلالي.',
    descIt: 'Ottieni un punteggio del 90% o superiore in HTML.',
    icon: '🧱'
  },
  {
    id: 'ach-css-wizard',
    titleEn: 'CSS Specificity Wizard',
    titleAr: 'ساحر تصاميم CSS',
    titleIt: 'Mago della Specificità CSS',
    descEn: 'Score 90% or higher on the CSS assessment.',
    descAr: 'احصل على نتيجة 90% أو أعلى في تقييم تخطيطات CSS.',
    descIt: 'Ottieni un punteggio del 90% o superiore in CSS.',
    icon: '🎨'
  },
  {
    id: 'ach-js-ninja',
    titleEn: 'JS Closure Ninja',
    titleAr: 'محارب جافا سكريبت',
    titleIt: 'Ninja delle Closure JS',
    descEn: 'Score 90% or higher on the JavaScript assessment.',
    descAr: 'احصل على نتيجة 90% أو أعلى في تقييم JavaScript.',
    descIt: 'Ottieni un punteggio del 90% o superiore in JavaScript.',
    icon: '⚡'
  },
  {
    id: 'ach-react-expert',
    titleEn: 'React Hook Wizard',
    titleAr: 'خبير مكونات ريأكت',
    titleIt: 'Mago degli Hook React',
    descEn: 'Score 90% or higher on the React assessment.',
    descAr: 'احصل على نتيجة 90% أو أعلى في تقييم React 19.',
    descIt: 'Ottieni un punteggio del 90% o superiore in React.',
    icon: '⚛️'
  },
  {
    id: 'ach-php-master',
    titleEn: 'PHP 8 Master',
    titleAr: 'خبير برمجة PHP 8',
    titleIt: 'Maestro PHP 8',
    descEn: 'Score 90% or higher on the PHP assessment.',
    descAr: 'احصل على نتيجة 90% أو أعلى في تقييم PHP 8.',
    descIt: 'Ottieni un punteggio del 90% o superiore in PHP.',
    icon: '🐘'
  },
  {
    id: 'ach-laravel-ninja',
    titleEn: 'Laravel Artisan Specialist',
    titleAr: 'متخصص إطار لارفيل',
    titleIt: 'Specialista Laravel',
    descEn: 'Score 90% or higher on the Laravel assessment.',
    descAr: 'احصل على نتيجة 90% أو أعلى في تقييم Laravel.',
    descIt: 'Ottieni un punteggio del 90% o superiore in Laravel.',
    icon: '🔴'
  },
  {
    id: 'ach-streak-3',
    titleEn: 'Dedicated Learner',
    titleAr: 'المبرمج الملتزم',
    titleIt: 'Studente Dedicato',
    descEn: 'Maintain a learning streak of 3 days or more.',
    descAr: 'حافظ على سلسلة تعلم نشطة لمدة 3 أيام متتالية أو أكثر.',
    descIt: 'Mantiieni una striscia di apprendimento di 3 o più giorni.',
    icon: '🔥'
  },
  {
    id: 'ach-multilingual',
    titleEn: 'Polyglot Dev',
    titleAr: 'مطور متعدد اللغات',
    titleIt: 'Sviluppatore Poliglotta',
    descEn: 'Toggle language options to assess in English, Italian, and Arabic.',
    descAr: 'قم بتبديل خيارات اللغة للتقييم باللغات المختلفة.',
    descIt: 'Cambia le opzioni di lingua per valutare in inglese, italiano e arabo.',
    icon: '🌐'
  },
  {
    id: 'ach-speedster',
    titleEn: 'Light Speed Syntax',
    titleAr: 'سرعة البرق البرمجية',
    titleIt: 'Sintassi alla Velocità della Luce',
    descEn: 'Submit an assessment with average speed under 15s per item.',
    descAr: 'قم بتسليم أي تقييم بمتوسط وقت أقل من 15 ثانية لكل سؤال.',
    descIt: 'Invia una valutazione con un tempo medio inferiore a 15s per domanda.',
    icon: '💨'
  },
  ...BADGES.map(b => ({
    id: b.id,
    titleEn: b.titleEn,
    titleAr: b.titleAr,
    titleIt: b.titleIt,
    descEn: b.descEn,
    descAr: b.descAr,
    descIt: b.descIt,
    icon: b.icon
  }))
];

import { onAuthStateChanged, signOut } from 'firebase/auth';
import { 
  isFirebaseConfigured, 
  getFirebaseAuth, 
  loginWithGoogle as fbLoginWithGoogle, 
  syncProgressToCloud, 
  fetchProgressFromCloud,
  registerWithEmailAndPassword,
  loginWithEmailAndPasswordCustom
} from '../lib/firebase';

export interface AppUser {
  uid: string;
  displayName: string | null;
  email: string | null;
  photoURL: string | null;
  isMock?: boolean;
}

interface AppContextType {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  lang: AppLanguage;
  setLang: (l: AppLanguage) => void;
  selectedTrack: CareerTrack;
  setSelectedTrack: (t: CareerTrack) => void;
  t: (key: keyof typeof TRANSLATIONS['en']) => string;
  isRtl: boolean;
  progress: UserProgress;
  setUserName: (name: string) => void;
  setUserAvatar: (avatarBase64: string) => void;
  saveAssessmentResult: (result: any) => void;
  toggleGlobalBookmark: (qId: string) => void;
  clearAllProgress: () => void;
  importProgress: (jsonStr: string) => boolean;
  exportProgress: () => string;
  unlockAchievement: (id: string) => void;
  currentUser: AppUser | null;
  loginWithGoogle: () => Promise<void>;
  loginCustom: (email: string, name: string) => Promise<void>;
  loginWithEmail: (email: string, pass: string) => Promise<void>;
  registerWithEmail: (email: string, pass: string, name: string) => Promise<void>;
  logout: () => Promise<void>;
  saveMockInterview: (result: MockInterviewResult) => void;
  getQuestionsForTrack: (overrideTrack?: CareerTrack, count?: number, searchQuery?: string, difficulty?: Difficulty) => Question[];
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // 1. Theme state
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    const saved = localStorage.getItem('assess-theme');
    return (saved as 'light' | 'dark') || 'dark'; // Elegant Dark mode by default for premium developer feel
  });

  // 2. Language state
  const [lang, setLangState] = useState<AppLanguage>(() => {
    const saved = localStorage.getItem('assess-lang');
    return (saved as AppLanguage) || 'ar';
  });

  // 2b. Career Track state
  const [selectedTrack, setSelectedTrackState] = useState<CareerTrack>(() => {
    const saved = localStorage.getItem('assess-track');
    return (saved as CareerTrack) || 'fullstack';
  });

  const setSelectedTrack = (track: CareerTrack) => {
    setSelectedTrackState(track);
    localStorage.setItem('assess-track', track);
  };

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

  // 4. Authentication state
  const [currentUser, setCurrentUser] = useState<AppUser | null>(() => {
    const saved = localStorage.getItem('assess-user-session');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return null;
  });

  // Watch for real Firebase auth state changes if configured
  useEffect(() => {
    if (isFirebaseConfigured()) {
      try {
        const auth = getFirebaseAuth();
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
          if (user) {
            const appUser: AppUser = {
              uid: user.uid,
              displayName: user.displayName || user.email?.split('@')[0] || 'Developer',
              email: user.email,
              photoURL: user.photoURL
            };
            setCurrentUser(appUser);
            localStorage.setItem('assess-user-session', JSON.stringify(appUser));
            
            // Sync user name
            if (user.displayName) {
              setUserName(user.displayName);
            }

            // Sync from Cloud Firestore if available
            try {
              const cloudProgress = await fetchProgressFromCloud(user.uid);
              if (cloudProgress) {
                saveProgressState(cloudProgress);
              }
            } catch (e) {
              console.log('Error syncing initial progress from cloud:', e);
            }

          } else {
            // Only clear non-mock session
            const saved = localStorage.getItem('assess-user-session');
            if (saved) {
              try {
                const parsed = JSON.parse(saved);
                if (!parsed.isMock) {
                  setCurrentUser(null);
                  localStorage.removeItem('assess-user-session');
                }
              } catch (e) {}
            }
          }
        });
        return () => unsubscribe();
      } catch (err) {
        console.log('Firebase auth subscription failed (offline or setup pending)');
      }
    }
  }, []);

  const loginWithGoogle = async () => {
    if (isFirebaseConfigured()) {
      try {
        const res = await fbLoginWithGoogle();
        if (res && res.user) {
          const appUser: AppUser = {
            uid: res.user.uid,
            displayName: res.user.displayName || res.user.email?.split('@')[0] || 'Developer',
            email: res.user.email,
            photoURL: res.user.photoURL
          };
          setCurrentUser(appUser);
          localStorage.setItem('assess-user-session', JSON.stringify(appUser));
          if (res.user.displayName) {
            setUserName(res.user.displayName);
          }
        }
      } catch (e) {
        console.error('Firebase login error:', e);
        throw e;
      }
    } else {
      // Offline / Mock fallback
      const mockUser: AppUser = {
        uid: 'mock-google-uid-123',
        displayName: 'Google Dev Champion',
        email: 'champion.dev@google-mock.com',
        photoURL: null,
        isMock: true
      };
      setCurrentUser(mockUser);
      localStorage.setItem('assess-user-session', JSON.stringify(mockUser));
      setUserName('Google Dev Champion');
    }
  };

  const loginCustom = async (email: string, name: string) => {
    const cleanEmail = email.trim() || 'developer@local.host';
    const cleanName = name.trim() || 'Elite Developer';
    const mockUser: AppUser = {
      uid: `local-dev-${Date.now()}`,
      displayName: cleanName,
      email: cleanEmail,
      photoURL: null,
      isMock: true
    };
    setCurrentUser(mockUser);
    localStorage.setItem('assess-user-session', JSON.stringify(mockUser));
    setUserName(cleanName);
  };

  const loginWithEmail = async (email: string, pass: string) => {
    if (isFirebaseConfigured()) {
      try {
        const res = await loginWithEmailAndPasswordCustom(email, pass);
        if (res && res.user) {
          const appUser: AppUser = {
            uid: res.user.uid,
            displayName: res.user.displayName || res.user.email?.split('@')[0] || 'Developer',
            email: res.user.email,
            photoURL: res.user.photoURL
          };
          setCurrentUser(appUser);
          localStorage.setItem('assess-user-session', JSON.stringify(appUser));
          if (res.user.displayName) {
            setUserName(res.user.displayName);
          }
        }
      } catch (e: any) {
        console.error('Firebase email login error:', e);
        throw e;
      }
    } else {
      // Offline / Mock fallback
      const savedMockUser = localStorage.getItem(`mock-user-${email.toLowerCase().trim()}`);
      if (savedMockUser) {
        try {
          const parsed = JSON.parse(savedMockUser);
          if (parsed.password === pass) {
            const appUser: AppUser = {
              uid: parsed.uid,
              displayName: parsed.displayName,
              email: parsed.email,
              photoURL: null,
              isMock: true
            };
            setCurrentUser(appUser);
            localStorage.setItem('assess-user-session', JSON.stringify(appUser));
            setUserName(parsed.displayName);
            return;
          } else {
            throw new Error(lang === 'ar' ? 'كلمة المرور غير صحيحة' : 'Incorrect password');
          }
        } catch (e: any) {
          throw new Error(e.message || (lang === 'ar' ? 'فشل تسجيل الدخول' : 'Sign-in failed'));
        }
      }
      throw new Error(lang === 'ar' ? 'لم يتم العثور على حساب بهذا البريد الإلكتروني. يرجى إنشاء حساب أولاً!' : 'No account found with this email. Please sign up first!');
    }
  };

  const registerWithEmail = async (email: string, pass: string, name: string) => {
    if (isFirebaseConfigured()) {
      try {
        const res = await registerWithEmailAndPassword(email, pass, name);
        if (res && res.user) {
          const appUser: AppUser = {
            uid: res.user.uid,
            displayName: name,
            email: res.user.email,
            photoURL: res.user.photoURL
          };
          setCurrentUser(appUser);
          localStorage.setItem('assess-user-session', JSON.stringify(appUser));
          setUserName(name);
        }
      } catch (e: any) {
        console.error('Firebase email register error:', e);
        throw e;
      }
    } else {
      // Offline / Mock fallback sign up
      const mockUid = `local-dev-${Date.now()}`;
      const mockUserData = {
        uid: mockUid,
        displayName: name,
        email: email,
        password: pass
      };
      localStorage.setItem(`mock-user-${email.toLowerCase().trim()}`, JSON.stringify(mockUserData));
      
      const appUser: AppUser = {
        uid: mockUid,
        displayName: name,
        email: email,
        photoURL: null,
        isMock: true
      };
      setCurrentUser(appUser);
      localStorage.setItem('assess-user-session', JSON.stringify(appUser));
      setUserName(name);
    }
  };

  const logout = async () => {
    if (isFirebaseConfigured()) {
      try {
        const auth = getFirebaseAuth();
        await signOut(auth);
      } catch (e) {
        console.error('Firebase signOut error:', e);
      }
    }
    setCurrentUser(null);
    localStorage.removeItem('assess-user-session');
  };

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

  // Auto-unlock badges based on score thresholds in completed assessments
  useEffect(() => {
    let unlockedAny = false;
    const achievementsToUnlock = [...progress.achievements];

    BADGES.forEach((badge) => {
      if (!achievementsToUnlock.includes(badge.id)) {
        const meetsThreshold = progress.completedAssessments.some(
          (result) => result.category === badge.category && result.percentage >= badge.threshold
        );
        if (meetsThreshold) {
          achievementsToUnlock.push(badge.id);
          unlockedAny = true;
        }
      }
    });

    if (unlockedAny) {
      saveProgressState({
        ...progress,
        achievements: achievementsToUnlock
      });
    }
  }, [progress.completedAssessments, progress.achievements]);

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

  const setLang = (l: 'en' | 'es' | 'ar') => {
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

  const setUserAvatar = (avatar: string) => {
    saveProgressState({
      ...progress,
      customAvatar: avatar
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

  const saveMockInterview = (result: MockInterviewResult) => {
    const updatedHistory = [result, ...(progress.mockInterviews || [])];
    saveProgressState({
      ...progress,
      mockInterviews: updatedHistory
    });
  };

  const clearAllProgress = () => {
    const defaultProgress: UserProgress = {
      streak: 1,
      lastActive: new Date().toISOString().split('T')[0],
      completedAssessments: [],
      bookmarks: [],
      achievements: [],
      userName: 'Elite Developer',
      mockInterviews: []
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

  const getQuestionsForTrack = (
    overrideTrack?: CareerTrack,
    count = 10,
    searchQuery = '',
    difficulty?: Difficulty
  ): Question[] => {
    const trackToUse = overrideTrack || selectedTrack;
    return getQuestionsByTrack(trackToUse, count, searchQuery, difficulty);
  };

  return (
    <AppContext.Provider
      value={{
        theme,
        toggleTheme,
        lang,
        setLang,
        selectedTrack,
        setSelectedTrack,
        t,
        isRtl,
        progress,
        setUserName,
        setUserAvatar,
        saveAssessmentResult,
        toggleGlobalBookmark,
        clearAllProgress,
        importProgress,
        exportProgress,
        unlockAchievement,
        currentUser,
        loginWithGoogle,
        loginCustom,
        loginWithEmail,
        registerWithEmail,
        logout,
        saveMockInterview,
        getQuestionsForTrack
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
