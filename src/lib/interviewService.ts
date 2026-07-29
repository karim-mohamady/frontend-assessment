/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { CareerTrack } from '../types';

export interface InterviewStepParams {
  category: string;
  difficulty: string;
  language: string; // 'ar' | 'it' | 'en'
  currentQuestion: string;
  userResponse: string;
  questionCount: number;
  track?: CareerTrack;
}

export interface InterviewStepResult {
  feedback: string;
  score: number;
  question: string;
  isEnd: boolean;
  overallSummary?: string;
  overallScore?: number;
}

// Question Banks for local fallback (used when deployed on static hosts like Firebase Hosting)
const QUESTION_BANKS: Record<string, Record<string, Record<string, string[]>>> = {
  react: {
    'Junior': {
      ar: [
        'اشرح مفهوم المكونات (Components) والـ Props في مكتبة React، وكيف يختلف الـ Props عن الـ State؟',
        'ما هو الفرق بين State و Props في React ومتى نستخدم كلاً منهما؟',
        'اشرح خطاف useEffect وما هي استخداماته الأساسية ومصفوفة التبعيات (Dependency Array)؟',
        'كيف تتم إدارة النماذج (Forms) في React والمكونات الخاضعة للسيطرة (Controlled Components)؟',
        'ما هي مفاتيح القوائم (Keys in Lists) في React ولماذا تعد مهمة جداً للأداء؟'
      ],
      en: [
        'Explain the core concept of Components and Props in React. How do Props differ from State?',
        'What is the difference between State and Props in React and when should you use each?',
        'Explain the useEffect hook, its common use cases, and the purpose of the dependency array.',
        'How are controlled components handled in React form management?',
        'What are React list keys and why are they crucial for rendering performance?'
      ],
      it: [
        'Spiega il concetto di Componenti e Props in React. In cosa differiscono le Props dallo Stato?',
        'Qual è la differenza tra State e Props in React e quando utilizzare ciascuno?',
        'Spiega l\'hook useEffect, i suoi casi d\'uso comuni e lo scopo dell\'array di dipendenze.',
        'Come vengono gestiti i componenti controllati nei moduli React?',
        'Cosa sono le chiavi di lista in React e perché sono cruciali per le prestazioni di rendering?'
      ]
    },
    'Mid-Level': {
      ar: [
        'كيف تعمل شجرة Virtual DOM في React وكيف تقارن الخوارزمية (Reconcilation Algorithm) بين الأشجار؟',
        'اشرح استخدامات useMemo و useCallback، ومتى تكون إضافتهما ضارة بالأداء بدلاً من تحسينه؟',
        'ما هي استراتيجيات إدارة الحالة المعقدة في React؟ قارن بين Context API و Redux/Zustand.',
        'كيف تتعامل مع أخطاء الواجهة في React باستخدام Error Boundaries وأين تظهر حدودها؟',
        'اشرح مفهوم Custom Hooks وكيف تنشئ خطافاً مخصصاً لجلب البيانات مع التعامل مع حالة التحميل والأخطاء.'
      ],
      en: [
        'How does React\'s Virtual DOM and Reconciliation algorithm optimize DOM updates?',
        'Explain useMemo and useCallback. When does over-using them negatively impact performance?',
        'Compare state management approaches in React: Context API vs Redux/Zustand.',
        'How do Error Boundaries work in React and what are their operational limitations?',
        'Explain Custom Hooks. How would you design a custom hook for asynchronous data fetching?'
      ],
      it: [
        'Come funziona il Virtual DOM di React e il suo algoritmo di riconciliazione?',
        'Spiega useMemo e useCallback. Quando un uso eccessivo può danneggiare le prestazioni?',
        'Confronta gli approcci di gestione dello stato in React: Context API vs Redux/Zustand.',
        'Come funzionano gli Error Boundaries in React e quali sono i loro limiti operativi?',
        'Spiega i Custom Hook. Come progetteresti un hook personalizzato per il recupero dati asincrono?'
      ]
    },
    'Senior': {
      ar: [
        'اشرح معمارية React Concurrent Mode و React Server Components (RSC) وتأثيرهما على أداء التطبيقات الكبيرة.',
        'كيف تطبق استراتيجية Code Splitting وتوجيه Dynamic Imports لتقليل حجم Bundle البداية في مشروع React ضخم؟',
        'ناقش معمارية Micro-Frontends في تطبيقات React الكبيرة وكيفية مشاركة الحالة وتفادي تعارض الإصدارات.',
        'ما هي الأسباب الجذرية لحدوث التسريبات في الذاكرة (Memory Leaks) في React وكيف يتم اكتشافها وحلها؟',
        'كيف تصمم نظام تصميم (Design System) مخصص مع إعادة استخدام المكونات والحفاظ على الأداء وسهولة الوصول (a11y)؟'
      ],
      en: [
        'Explain React Concurrent Rendering, Server Components (RSC), and their architectural impact on enterprise apps.',
        'Describe your strategy for Code Splitting and dynamic imports to minimize initial bundle size in massive apps.',
        'Discuss Micro-Frontends architecture in React ecosystem, state sharing, and dependency version isolation.',
        'What are common root causes of memory leaks in React and how do you profile and eliminate them?',
        'How do you architect a scalable Component Library / Design System focusing on performance and accessibility (a11y)?'
      ],
      it: [
        'Spiega il rendering concorrente di React, i Server Components (RSC) e il loro impatto su app aziendali.',
        'Descrivi la tua strategia per il Code Splitting e le importazioni dinamiche per ridurre il bundle iniziale.',
        'Discussione sull\'architettura Micro-Frontend in React, condivisione dello stato e isolamento delle dipendenze.',
        'Quali sono le cause principali delle perdite di memoria in React e come le elimini?',
        'Come progetteresti un Design System scalabile dando priorità a prestazioni e accessibilità (a11y)?'
      ]
    }
  },
  javascript: {
    'Junior': {
      ar: [
        'اشرح الفرق بين var و let و const ونطاق النماذج (Scope) والرفع (Hoisting) في JavaScript.',
        'ما هي وعود JavaScript (Promises) وكيف تختلف عن الدوال التراجعية (Callbacks)؟',
        'ما هي أنواع البيانات البديلة (Primitives) والأنواع المرجعية (Reference Types) في JavaScript؟',
        'اشرح استخدام async/await وكيف يتم التعامل مع الأخطاء باستخدام try...catch.',
        'كيف تعمل المصفوفات والدوال المرتفعة مثل map و filter و reduce في JS؟'
      ],
      en: [
        'Explain the differences between var, let, and const in terms of scope and hoisting.',
        'What are JavaScript Promises and how do they improve upon callback-based asynchronous code?',
        'Differentiate between primitive data types and reference types in JavaScript memory execution.',
        'Explain async/await syntax and proper exception handling using try...catch blocks.',
        'How do higher-order array methods like map, filter, and reduce function in modern JS?'
      ],
      it: [
        'Spiega le differenze tra var, let e const in termini di scope e hoisting.',
        'Cosa sono le Promise in JavaScript e come migliorano il codice asincrono basato su callback?',
        'Differenzia tra tipi primitivi e tipi di riferimento nella memoria JavaScript.',
        'Spiega la sintassi async/await e la gestione delle eccezioni tramite blocchi try...catch.',
        'Come funzionano i metodi di array di ordine superiore come map, filter e reduce in JS moderno?'
      ]
    },
    'Mid-Level': {
      ar: [
        'اشرح مفهوم الإغلاقات (Closures) في JavaScript وأعطِ مثالاً عملياً لاستخدامها في الحياة الواقعية.',
        'كيف يعمل حلقة الأحداث (Event Loop) والطابور الصغير (Microtask Queue) والماكرو (Macrotask Queue)؟',
        'ما هو السلسلة الممتدة للموجهات (Prototype Chain) وكيف تعمل الوراثة في JS؟',
        'اشرح الروابط الديناميكية لكلمة this وكيف تغير call و apply و bind سلوكها.',
        'ما هو الفرق بين Debounce و Throttle ومتى نستخدم كل منهما عند التعامل مع الأحداث السريعة؟'
      ],
      en: [
        'Explain JavaScript Closures with a practical real-world engineering use case.',
        'How does the Event Loop, Call Stack, Microtask Queue, and Macrotask Queue interact in JS runtime?',
        'Explain Prototypal Inheritance and Prototype Chain mechanisms in JavaScript.',
        'How is the "this" keyword dynamically bound? Compare call, apply, and bind methods.',
        'Differentiate between Debounce and Throttle techniques for high-frequency DOM event optimization.'
      ],
      it: [
        'Spiega le Closure in JavaScript con un caso d\'uso pratico reale.',
        'Come interagiscono Event Loop, Call Stack, Microtask Queue e Macrotask Queue in JS?',
        'Spiega l\'ereditarietà prototipale e la catena di prototipi in JavaScript.',
        'Come viene associata dinamicamente la parola chiave "this"? Confronta call, apply e bind.',
        'Differenza tra le tecniche di Debounce e Throttle per l\'ottimizzazione degli eventi DOM.'
      ]
    },
    'Senior': {
      ar: [
        'اشرح كيفية عمل جامع القمامة (Garbage Collector) والمشيرات الضائعة (WeakMap / WeakSet) للحد من تسريب الذاكرة.',
        'كيف تعمل الوكلاء (Proxies) والعاكسات (Reflect API) في JS وكيف تُمكّن الأنظمة التفاعلية (Reactivity Engines)؟',
        'ناقش تفاصيل تنفيذ Web Workers والتحكم في الخيوط الأحادية (Single-Threaded Limitations) للعمليات الثقيلة.',
        'كيف تعمل الوحدات النمطية ES Modules في المتصفح وتأثير الاستيراد الأسطواني (Circular Dependencies)؟',
        'اشرح تقنيات تحسين أداء V8 Engine مثل JIT Compilation و Inline Caching وشكل الكائنات (Hidden Classes).'
      ],
      en: [
        'Explain V8 Garbage Collection strategies and how WeakMap/WeakSet aid in memory management.',
        'How do JavaScript Proxies & Reflect API work, and how are they used to build reactivity engines?',
        'Discuss Web Workers, SharedArrayBuffer, and offloading heavy compute tasks off the main thread.',
        'Explain ES Module resolution, cyclic dependency traps, and dynamic import loading mechanics.',
        'Describe V8 JS engine optimizations including JIT compilation, Hidden Classes, and Inline Caching.'
      ],
      it: [
        'Spiega le strategie di Garbage Collection in V8 e come WeakMap/WeakSet aiutano la memoria.',
        'Come funzionano i Proxy e la Reflect API in JavaScript per costruire motori di reattività?',
        'Discussione su Web Workers, SharedArrayBuffer e liberazione del thread principale per calcoli pesanti.',
        'Spiega la risoluzione degli ES Module, le dipendenze cicliche e il caricamento dinamico.',
        'Descrivi le ottimizzazioni del motore V8, tra cui la compilazione JIT e le Hidden Classes.'
      ]
    }
  },
  php: {
    'Junior': {
      ar: [
        'ما هي التحسينات الأساسية في PHP 8.x مثل Constructor Property Promotion و Match Expressions؟',
        'اشرح الفرق بين PDO و MySQLi للاتصال بقواعد البيانات ولماذا يُفضل PDO للأمان؟',
        'كيف تعمل إدارة الجلسات (Sessions) والـ Cookies في PHP وكيف نمنع هجمات Session Hijacking؟',
        'ما هي فئات الأخطاء والاستثناءات (Exceptions) في PHP وكيف تتعامل معها باستخدام try...catch؟',
        'اشرح دور ملف composer.json والتحميل التلقائي للملفات (PSR-4 Autoloading).'
      ],
      en: [
        'What are key modern features of PHP 8.x like Constructor Property Promotion and Match Expressions?',
        'Compare PDO vs MySQLi for database connections and explain why PDO is preferred for security.',
        'How do PHP Sessions and Cookies work and how do you prevent Session Hijacking?',
        'Explain Throwable hierarchy in PHP 8 and exception handling using try...catch...finally.',
        'Explain the role of composer.json and PSR-4 autoloading in PHP projects.'
      ],
      it: [
        'Quali sono le novità principali di PHP 8.x come la promozione delle proprietà nel costruttore e le espressioni Match?',
        'Confronta PDO e MySQLi per le connessioni al database e spiega perché PDO è preferito per la sicurezza.',
        'Come funzionano le sessioni e i cookie PHP e come si previene il Session Hijacking?',
        'Spiega la gerarchia delle eccezioni in PHP 8 e la gestione tramite try...catch...finally.',
        'Spiega il ruolo di composer.json e l\'autoloading PSR-4 nei progetti PHP.'
      ]
    },
    'Mid-Level': {
      ar: [
        'اشرح مفاهيم البرمجة الكائنية المتقدمة في PHP: Interfaces vs Abstract Classes ومتى نستخدم Traits؟',
        'كيف تمنع هجمات SQL Injection في PHP باستخدام Prepared Statements والمعاملات المربوطة؟',
        'ما هي حواشي البيانات (Attributes) في PHP 8 وكيف تستخدمها أطر العمل لتعريف المسارات والوثائق؟',
        'اشرح دور مجمع الذاكرة OPcache وكيف يحسن أداء تنفيذ سكربتات PHP في السيرفر.',
        'كيف تطبق مبادئ SOLID الخمسة في كتابة كود PHP نظيف وقابل للصيانة والتوسع؟'
      ],
      en: [
        'Compare Interfaces vs Abstract Classes in PHP, and discuss appropriate use cases for Traits.',
        'How do Prepared Statements and Parameter Binding strictly prevent SQL Injection attacks in PHP?',
        'Explain PHP 8 Attributes and how frameworks utilize them for Routing and Metadata.',
        'Explain OPcache byte-code caching and its architectural impact on PHP request execution performance.',
        'How do you apply SOLID software principles when designing modular PHP classes?'
      ],
      it: [
        'Confronta Interfacce e Classi Astratte in PHP, e discuti i casi d\'uso appropriati per i Trait.',
        'In che modo i Prepared Statement e il Parameter Binding prevengono gli attacchi SQL Injection in PHP?',
        'Spiega gli Attributi di PHP 8 e come i framework li utilizzano per il Routing e i Metadati.',
        'Spiega il caching del bytecode OPcache e il suo impatto sulle prestazioni delle richieste PHP.',
        'Come applichi i principi SOLID quando progetti classi PHP modulari?'
      ]
    },
    'Senior': {
      ar: [
        'اشرح مفهوم PHP Fibers وتطبيقات البرمجة غير المتزامنة (Asynchronous I/O) مثل Swoole و Workerman.',
        'كيف تتعامل مع تسريب الذاكرة (Memory Leaks) في معالجة السكربتات الطويلة (CLI / Queue Workers)؟',
        'صمم مكتبة PHP مخصصة مع اتباع حزم PSR (PSR-7 HTTP Messages, PSR-11 Container, PSR-12 Style).',
        'ناقش أنماط التصميم المعمارية في PHP مثل Repository Pattern, Factory Pattern, و Dependency Injection Container.',
        'كيف تستخدم أدوات Xdebug و Blackfire لتحليل أداء الاستعلامات واستهلاك الذاكرة في تطبيق PHP ضخم؟'
      ],
      en: [
        'Explain PHP 8 Fibers and asynchronous concurrency frameworks like Swoole and FrankenPHP.',
        'How do you identify and eliminate memory leaks in long-running PHP CLI processes and Queue Workers?',
        'Architect a custom PSR-compliant PHP package following PSR-7, PSR-11, and PSR-12 specifications.',
        'Discuss advanced PHP design patterns: Repository, Abstract Factory, and Service Locator vs Dependency Injection.',
        'How do you profile memory consumption and execution bottlenecks in legacy PHP systems using Xdebug or Blackfire?'
      ],
      it: [
        'Spiega i Fibers di PHP 8 e i framework di concorrenza asincrona come Swoole e FrankenPHP.',
        'Come identifichi ed elimini le perdite di memoria nei processi CLI PHP a lunga esecuzione e Queue Workers?',
        'Progetta un pacchetto PHP conforme alle specifiche PSR-7, PSR-11 e PSR-12.',
        'Discussione sui design pattern PHP avanzati: Repository, Factory e Dependency Injection Container.',
        'Come analizzi il consumo di memoria e i colli di bottiglia nei sistemi PHP usando Xdebug o Blackfire?'
      ]
    }
  },
  laravel: {
    'Junior': {
      ar: [
        'ما هي معمارية MVC في إطار Laravel وكيف ينتقل الطلب من Route إلى Controller إلى Blade View؟',
        'اشرح استخدامات أداة Artisan CLI وأهم الأوامر مثل make:controller و make:model و migrate.',
        'ما هو Eloquent ORM وكيف تجري استعلامات بسيطة مثل find و where و create و update؟',
        'كيف تعمل ملفات التهجير (Database Migrations) و MIGRATION ROLLBACK في Laravel؟',
        'ما هو حماية CSRF Token في نماذج Blade وكيف تحمي التطبيق من الهجمات؟'
      ],
      en: [
        'Explain the MVC architectural pattern in Laravel and how a request flows through Routes, Controllers, and Blade Views.',
        'What is Artisan CLI and what are essential commands for generator scaffolding and database migrations?',
        'What is Eloquent ORM and how do you execute basic queries (find, where, create, update, delete)?',
        'How do Database Migrations and rollback mechanisms maintain database version control in Laravel?',
        'Explain CSRF protection directive in Blade forms (@csrf) and its security role.'
      ],
      it: [
        'Spiega il pattern architetturale MVC in Laravel e il flusso di una richiesta tra Route, Controller e Blade View.',
        'Cos\'è la CLI Artisan e quali sono i comandi essenziali per la generazione di codice e migrazioni?',
        'Cos\'è Eloquent ORM e come si eseguono query di base (find, where, create, update, delete)?',
        'Come funzionano le migrazioni del database e i meccanismi di rollback in Laravel?',
        'Spiega la direttiva di protezione CSRF nei moduli Blade (@csrf) e il suo ruolo di sicurezza.'
      ]
    },
    'Mid-Level': {
      ar: [
        'اشرح أنواع العلاقات في Eloquent: hasOne, hasMany, belongsTo, belongsToMany مع ضبط المفاتيح الأجنبية.',
        'كيف تتعامل مع مشكلة N+1 Query Problem في Laravel وكيف يحلها الـ Eager Loading (with)؟',
        'ما هو دور الوسائط (Middleware) في Laravel وكيف تنشئ ميديليوَي مخصص للتحقق من الصلاحيات؟',
        'اشرح حاوية الخدمات (Service Container) وحقن التبعيات (Dependency Injection) في Laravel.',
        'كيف تتم إدارة المهام المجدولة والأعمال المجدولة (Queues & Jobs) في الخلفية باستخدام Redis؟'
      ],
      en: [
        'Explain Eloquent Relationships (hasOne, hasMany, belongsTo, belongsToMany) and pivot table configurations.',
        'What is the N+1 Query Problem in Eloquent and how does Eager Loading (with) resolve it?',
        'What is Middleware in Laravel? How do you write custom middleware for authorization and logging?',
        'Explain Laravel\'s Service Container, Service Providers, and Dependency Injection mechanisms.',
        'How do asynchronous Queue Workers and Jobs handle background processing in Laravel using Redis?'
      ],
      it: [
        'Spiega le relazioni Eloquent (hasOne, hasMany, belongsTo, belongsToMany) e la configurazione delle tabelle pivot.',
        'Cos\'è il problema delle N+1 query in Eloquent e come lo risolve l\'Eager Loading (with)?',
        'Cos\'è un Middleware in Laravel? Come scrivi un middleware personalizzato per l\'autorizzazione?',
        'Spiega il Service Container di Laravel, i Service Provider e l\'Iniezione delle Dipendenze.',
        'Come gestiscono i Queue Worker asincroni il processo in background in Laravel utilizzando Redis?'
      ]
    },
    'Senior': {
      ar: [
        'اشرح كيفية تسريع تطبيقات Laravel باستخدام Laravel Octane المدمج مع Swoole أو FrankenPHP.',
        'صمم نظام حزم مخصص (Custom Package Architecture) لإعادة الاستخدام عبر مشاريع Laravel متعددة.',
        'كيف تبني نظام أذونات معقد بالاعتماد على Policies, Gates, و RBAC في مشاريع المؤسسات؟',
        'ناقش استخدام Laravel Horizon لمراقبة طوابير Redis وموازنة الأحمال ومقابلة استهلاك الذاكرة.',
        'كيف تطبق استراتيجية Event-Driven Architecture و Domain-Driven Design (DDD) في مشروع Laravel ضخم؟'
      ],
      en: [
        'How does Laravel Octane with FrankenPHP or Swoole achieve high-throughput application execution?',
        'Architect a custom reusable Laravel Package complete with Service Providers, Config, Migrations, and Auto-discovery.',
        'How do you design enterprise Authorization using Policies, Gates, and Role-Based Access Control (RBAC)?',
        'Discuss monitoring, auto-scaling, and memory management of queue workers using Laravel Horizon and Redis.',
        'How do you apply Domain-Driven Design (DDD) principles and Event-Driven Architecture in massive Laravel applications?'
      ],
      it: [
        'In che modo Laravel Octane con FrankenPHP o Swoole ottiene elevate prestazioni di esecuzione?',
        'Progetta un pacchetto Laravel riutilizzabile completo di Service Provider, Config e Migrazioni.',
        'Come progetti l\'autorizzazione aziendale utilizzando Policy, Gate e Controllo di Accesso Basato sui Ruoli (RBAC)?',
        'Discussione sul monitoraggio e lo scalamento dei worker di coda utilizzando Laravel Horizon e Redis.',
        'Come applichi i principi del Domain-Driven Design (DDD) e l\'architettura ad eventi in grandi applicazioni Laravel?'
      ]
    }
  },
  mysql: {
    'Junior': {
      ar: [
        'ما هي أنواع البيانات الأساسية في MySQL (VARCHAR, TEXT, INT, DATETIME, DECIMAL) ومتى نختار كل منها؟',
        'اشرح الفرق بين المفتاح الرئيسي (Primary Key) والمفتاح الأجنبي (Foreign Key).',
        'كيف تكتب استعلامات SELECT مع التصفية بـ WHERE والترتيب بـ ORDER BY وتحديد الترقيم بـ LIMIT؟',
        'ما هي عمليات الربط INNER JOIN و LEFT JOIN وما الفرق بينهما؟',
        'ما هو الهدف من عملية تنقيح قواعد البيانات (Database Normalization) والشكل الطبيعي الأول (1NF)؟'
      ],
      en: [
        'What are core MySQL data types (VARCHAR, TEXT, INT, DATETIME, DECIMAL) and selection guidelines?',
        'Explain the difference between Primary Key and Foreign Key constraints in relational database schema.',
        'How do you compose SELECT queries with WHERE filtering, ORDER BY sorting, and LIMIT pagination?',
        'Compare INNER JOIN vs LEFT JOIN with concrete table matching examples.',
        'What is Database Normalization and why is First Normal Form (1NF) foundational?'
      ],
      it: [
        'Quali sono i tipi di dati principali in MySQL (VARCHAR, TEXT, INT, DATETIME, DECIMAL) e come sceglierli?',
        'Spiega la differenza tra i vincoli di Chiave Primaria e Chiave Esterna in uno schema relazionale.',
        'Come componi le query SELECT con filtri WHERE, ordinamento ORDER BY e paginazione LIMIT?',
        'Confronta INNER JOIN e LEFT JOIN con esempi pratici.',
        'Cos\'è la Normalizzazione del Database e perché la Prima Forma Normale (1NF) è fondamentale?'
      ]
    },
    'Mid-Level': {
      ar: [
        'اشرح كيفية عمل فهارس B-Tree Indexes في MySQL وكيف تسسرع الاستعلامات وما هي سلبياتها؟',
        'ما هي خصائص معاملات ACID (Atomicity, Consistency, Isolation, Durability) في محرك InnoDB؟',
        'كيف تكتب استعلامات الربط المتقدمة (RIGHT JOIN, FULL OUTER JOIN, SELF JOIN) واستخدام GROUP BY مع HAVING؟',
        'اشرح قيود السلامة المرجعية (ON DELETE CASCADE / SET NULL) وتأثيرها عند حذف السجلات.',
        'كيف تكشف عن الاستعلامات البطيئة وتستخدم استعلام EXPLAIN لتحليل خطة التنفيذ؟'
      ],
      en: [
        'How do B-Tree Indexes function in MySQL InnoDB engine to accelerate query performance and what are the write overhead trade-offs?',
        'Explain ACID transaction properties in InnoDB and how START TRANSACTION, COMMIT, and ROLLBACK operate.',
        'Write complex query logic using GROUP BY, HAVING, subqueries, and aggregate functions (COUNT, SUM, AVG).',
        'Explain referential integrity actions (ON DELETE CASCADE, ON DELETE SET NULL, RESTRICT).',
        'How do you identify slow queries and interpret MySQL EXPLAIN query execution plans?'
      ],
      it: [
        'Come funzionano gli Indici B-Tree nel motore InnoDB di MySQL per accelerare le query e quali sono i costi in scrittura?',
        'Spiega le proprietà delle transazioni ACID in InnoDB e come funzionano COMMIT e ROLLBACK.',
        'Scrivi query complesse utilizzando GROUP BY, HAVING, sottoquery e funzioni aggregate (COUNT, SUM, AVG).',
        'Spiega le azioni di integrità referenziale (ON DELETE CASCADE, ON DELETE SET NULL, RESTRICT).',
        'Come identifichi le query lente e come interpreti il piano di esecuzione EXPLAIN di MySQL?'
      ]
    },
    'Senior': {
      ar: [
        'ناقش مستويات عزلة المعاملات (Transaction Isolation Levels) في InnoDB وتجنب مشاكل Dirty Reads و Phantom Reads.',
        'صمم استراتيجية Partitioning و Sharding لقاعدة بيانات ضخمة تتجاوز مئات الملايين من السجلات.',
        'كيف تضبط موازنة النسخ المماثلة (Master-Replica Replication) وتتعامل مع تأخير النسخ (Replication Lag)؟',
        'كيف تعالج مشكلة اللاقفل والقفول الميتة (Deadlocks Detection & Prevention) في الأنظمة عالية الكثافة؟',
        'استراتيجيات التحسين والضبط لـ InnoDB Buffer Pool و Query Caching والمعالجة الموازية.'
      ],
      en: [
        'Discuss InnoDB Transaction Isolation Levels (Read Uncommitted, Read Committed, Repeatable Read, Serializable) and concurrency phenomena.',
        'Design a Database Sharding and Horizontal Partitioning strategy for tables exceeding hundreds of millions of rows.',
        'Explain Primary-Replica (Master-Slave) MySQL Replication architecture and how to handle Replication Lag.',
        'How do you diagnose and prevent InnoDB Deadlocks in high-concurrency transactional systems?',
        'Explain server tuning metrics including InnoDB Buffer Pool Size, Max Connections, and Thread Cache.'
      ],
      it: [
        'Discussione sui Livelli di Isolamento delle Transazioni in InnoDB (Read Committed, Repeatable Read, Serializable).',
        'Progetta una strategia di Sharding e Partizionamento Orizzontale per tabelle con centinaia di milioni di righe.',
        'Spiega l\'architettura di Replicazione MySQL Primary-Replica e come gestire il Replication Lag.',
        'Come diagnostichi e previeni i Deadlock in InnoDB in sistemi ad alta concorrenza?',
        'Spiega le metriche di ottimizzazione del server tra cui la dimensione dell\'InnoDB Buffer Pool e Max Connections.'
      ]
    }
  },
  backend: {
    'Junior': {
      ar: [
        'ما هي معمارية RESTful API وما هي أفعال HTTP الرئيسية (GET, POST, PUT, DELETE, PATCH)؟',
        'اشرح رموز حالات HTTP الشائعة (200 OK, 201 Created, 400 Bad Request, 401 Unauthorized, 403 Forbidden, 404 Not Found, 500 Server Error).',
        'ما هو تسلسل JSON ولماذا يعد المعيار الذهبي لتبادل البيانات بين السيرفر والعميل؟',
        'ما هو الفرق بين المعلمات الممررة في المسار (Path Parameters) والطلب (Query Parameters) ونص الطلب (Request Body)؟',
        'كيف تختبر واجهات البرمجيات باستخدام أدوات مثل Postman أو Hoppscotch أو cURL؟'
      ],
      en: [
        'What is RESTful API architecture and what are standard HTTP methods (GET, POST, PUT, DELETE, PATCH)?',
        'Explain essential HTTP status code categories (200, 201, 400, 401, 403, 404, 500) and their appropriate API responses.',
        'What is JSON serialization and why is it ubiquitous for client-server data exchange?',
        'Differentiate between Query Parameters, Path Variables, and Request Body payloads in API design.',
        'How do you test and inspect API endpoints using Postman, Thunder Client, or cURL command line?'
      ],
      it: [
        'Cos\'è l\'architettura RESTful API e quali sono i metodi HTTP standard (GET, POST, PUT, DELETE, PATCH)?',
        'Spiega le categorie principali dei codici di stato HTTP (200, 201, 400, 401, 403, 404, 500) e il loro significato.',
        'Cos\'è la serializzazione JSON e perché è lo standard per lo scambio di dati client-server?',
        'Differenza tra Query Parameter, Path Variable e Request Body nella progettazione di API.',
        'Come verifichi e collaudi le API utilizzando strumenti come Postman, Insomnia o cURL?'
      ]
    },
    'Mid-Level': {
      ar: [
        'اشرح آلية المصادقة باستخدام JWT Tokens (Header.Payload.Signature) وكيف تختلف عن Sessions؟',
        'ما هي سياسة حظر وتأمين الموارد بين الأصول (CORS) وكيف تضبط الرؤوس لتأمين API الخاص بك؟',
        'كيف تطبق استراتيجيات Rate Limiting لحماية الـ APIs من هجمات Denial of Service؟',
        'اشرح استخدام نظام Redis في التخزين المؤقت للطلبات الشائعة (API Caching Layer) وإلغاء صلاحية الكاش.',
        'كيف توثق واجهات البرمجيات باستخدام معيار OpenAPI / Swagger لضمان التنسيق السلس مع فريق الفرونت إند؟'
      ],
      en: [
        'Explain JWT authentication mechanics (Header, Payload, Signature) vs Session-based authentication.',
        'What is Cross-Origin Resource Sharing (CORS) and how do you configure headers securely?',
        'How do you implement API Rate Limiting algorithms (Token Bucket, Leaky Bucket) to prevent abuse?',
        'Describe caching strategies using Redis (Cache Aside, Write Through) and Cache Invalidation rules.',
        'How do you document backend APIs using OpenAPI / Swagger specifications for front-end consumption?'
      ],
      it: [
        'Spiega il funzionamento dell\'autenticazione JWT (Header, Payload, Signature) rispetto all\'autenticazione basata su Sessioni.',
        'Cos\'è il Cross-Origin Resource Sharing (CORS) e come si configurano gli header in modo sicuro?',
        'Come implementi algoritmi di Rate Limiting per prevenire abusi e attacchi DDoS?',
        'Descrivi le strategie di caching con Redis (Cache Aside, Write Through) e le regole di invalidazione.',
        'Come documenti le API backend utilizzando le specifiche OpenAPI / Swagger per l\'integrazione front-end?'
      ]
    },
    'Senior': {
      ar: [
        'صمم معمارية Microservices متكاملة تشمل API Gateway, Service Discovery, Circuit Breaker, و Event Bus.',
        'كيف تبني نظام توزيع الرسائل (Message Queue Architecture) باستخدام RabbitMQ أو Apache Kafka للمعالجة غير المتزامنة؟',
        'ناقش استراتيجيات التوسع الأفقي (Horizontal Scaling) وموازنة الأحمال (Load Balancing) مع الحفاظ على الاتساق.',
        'كيف تصمم نظام النشر بدون توقف (Zero-Downtime Deployment) مثل Blue-Green أو Canary Deployments؟',
        'كيف تطبق مبدأ Idempotency في معالجة عمليات الدفع والتحويلات المالية لتجنب الخصم المزدوج؟'
      ],
      en: [
        'Architect an enterprise Microservices ecosystem including API Gateways, Service Discovery, Circuit Breakers, and Centralized Logging.',
        'Design a high-throughput Message Queue architecture using RabbitMQ or Apache Kafka for async event pipelines.',
        'Discuss Horizontal Scaling techniques, Database Read Replicas, Load Balancing, and CAP theorem trade-offs.',
        'Design a Zero-Downtime Deployment pipeline utilizing Blue-Green or Canary deployment strategies.',
        'How do you enforce API Idempotency (Idempotency Keys) for payment processing and financial transactions?'
      ],
      it: [
        'Progetta un ecosistema di Microservizi aziendale comprendente API Gateway, Service Discovery e Circuit Breaker.',
        'Progetta un\'architettura di code di messaggi ad elevate prestazioni con RabbitMQ o Kafka per flussi asincroni.',
        'Discussione sulle tecniche di Scalabilità Orizzontale, Repliche in Lettura del Database e Bilanciamento del Carico.',
        'Progetta una pipeline di rilascio a Zero-Downtime utilizzando strategie Blue-Green o Canary.',
        'Come applichi l\'Idempotenza nelle API per l\'elaborazione di pagamenti e transazioni finanziarie?'
      ]
    }
  },
  uiux: {
    'Junior': {
      ar: [
        'اشرح المبادئ الأساسية للتسلسل الهرمي البصري (Visual Hierarchy) وكيف توجه نظر المستخدم في تصميم الواجهة؟',
        'ما هو الفرق بين UI (تصميم الواجهة) و UX (تجربة المستخدم)، وكيف يكمل كل منهما الآخر؟',
        'كيف تستخدم الألوان ونظريات التباين لتحسين إمكانية الوصول (Accessibility - WCAG) في التطبيقات؟',
        'ما هي الشخصيات الافتراضية (User Personas) وكيف تساعد في تحديد متطلبات التصميم؟',
        'اشرح أهمية الشبكات (Grids) والمسافات النمطية (8pt Grid System) في تنظيم العناصر.'
      ],
      en: [
        'Explain the core principles of Visual Hierarchy and how it guides user attention on a UI screen.',
        'What is the difference between UI (User Interface) and UX (User Experience) design?',
        'How do you utilize color theory and contrast ratios to comply with WCAG accessibility standards?',
        'What are User Personas and how do they inform user-centered design decisions?',
        'Explain the purpose of standard layout grids and the 8pt spacing system in consistent interface design.'
      ],
      it: [
        'Spiega i principi fondamentali della Gerarchia Visiva e come guida l\'attenzione dell\'utente.',
        'Qual è la differenza tra progettazione UI (Interfaccia Utente) e UX (Esperienza Utente)?',
        'Come utilizzi la teoria dei colori e i rapporti di contrasto per rispettare gli standard WCAG?',
        'Cosa sono le User Persona e come informano le decisioni di progettazione?',
        'Spiega lo scopo delle griglie di layout e del sistema di spaziatura a 8pt.'
      ]
    },
    'Mid-Level': {
      ar: [
        'كيف تصمم وتدير نظام تصميم (Design System) متمسك باستخدام متغيرات المكونات (Variants) ومتغيرات التصميم (Tokens)؟',
        'اشرح مفهوم Auto-Layout في Figma وكيف تحاكي نموذج Flexbox في الواجهات المتجاوبة؟',
        'كيف تجري اختبارات قابلية الاستخدام (Usability Testing) وتحلل الخرائط الحرارية (Heatmaps) لتحسين التدفقات؟',
        'ما هي استراتيجيات تسليم التصاميم للمطورين (Design-to-Dev Handoff) لضمان الدقة وتفادي الأخطاء؟',
        'كيف تتعامل مع تصميم التفاعلات الدقيقة (Micro-interactions) ودعم الوضع الداكن (Dark Mode)؟'
      ],
      en: [
        'How do you architect and maintain a scalable Design System using Component Variants and Design Tokens?',
        'Explain Figma Auto-Layout and how it translates to CSS Flexbox layout logic for developers.',
        'How do you conduct Usability Testing sessions and utilize user feedback to iterate on wireframes?',
        'Describe your strategy for Design-to-Dev Handoff to guarantee high-fidelity implementation.',
        'How do you design cohesive Micro-interactions and engineer seamless Dark Mode theme support?'
      ],
      it: [
        'Come architetti e mantieni un Design System scalabile utilizzando Varianti di Componenti e Design Tokens?',
        'Spiega Figma Auto-Layout e come si traduce nella logica di layout CSS Flexbox.',
        'Come conduci le sessioni di Usability Testing e utilizzi i feedback degli utenti?',
        'Descrivi la tua strategia per l\'Handoff Sviluppatori garantendo un\'implementazione fedele.',
        'Come progetti Micro-interazioni coerenti e supporti la modalità scura (Dark Mode)?'
      ]
    },
    'Senior': {
      ar: [
        'كيف تقيس وتثبت القيمة الاستراتيجية وعائد الاستثمار (ROI) لتجربة المستخدم في المنتجات البرمجية الضخمة؟',
        'صمم معمارية معلومات (Information Architecture) وتدفق مستخدم (User Flow) لنظام معقد ذي أذونات متعددة.',
        'كيف تقود حوكمة نظام التصميم (Design System Governance) عبر فرق متعددة من المصممين والمطورين؟',
        'ناقش استراتيجيات تصميم الواجهات التكيفية للذكاء الاصطناعي (AI-Driven Adaptive UIs) وتجربة الحوار.',
        'كيف تدمج معايير إمكانية الوصول المتقدمة (WCAG 2.2 AAA) والأجهزة المساعدة في ثقافة الفريق؟'
      ],
      en: [
        'How do you define and measure UX KPIs and prove the ROI of UX investments to executive stakeholders?',
        'Architect an Information Architecture and User Journey for a complex enterprise system with multi-tenant roles.',
        'How do you lead Design System Governance across cross-functional product and engineering squads?',
        'Discuss strategies for designing AI-driven adaptive interfaces and generative UI conversational flows.',
        'How do you embed advanced accessibility compliance (WCAG 2.2 AAA) into early product lifecycle phases?'
      ],
      it: [
        'Come definisci e misuri i KPI UX dimostrando il ROI degli investimenti agli stakeholder?',
        'Progetta l\'Architettura dell\'Informazione per un sistema aziendale complesso con ruoli multi-tenant.',
        'Come guidi la Governance del Design System tra team interfunzionali?',
        'Discussione sulle strategie per la progettazione di interfacce adattive guidate dall\'IA.',
        'Come integri l\'accessibilità avanzata (WCAG 2.2 AAA) nelle prime fasi del ciclo di vita del prodotto?'
      ]
    }
  },
  web3: {
    'Junior': {
      ar: [
        'اشرح المفاهيم الأساسية لتقنية البلوكشين (Blockchain) والفرق بين الشبكات المركزية واللامركزية.',
        'ما هو العقد الذكي (Smart Contract) وكيف ينفذ على الآلة الافتراضية لـ Ethereum (EVM)؟',
        'كيف تعمل محفظة Web3 (مثل Metamask) وما هو دور المفاتيح العامة والخاصة (Public/Private Keys)؟',
        'ما هي رسوم Gas في شبكة إيثريوم ولماذا تتغير قيمتها بناءً على ازدحام الشبكة؟',
        'اشرح معيار ERC-20 للتوكنات القابلة للاستبدال ومعيار ERC-721 للرموز غير القابلة للاستبدال (NFTs).'
      ],
      en: [
        'Explain the core principles of Blockchain technology and how decentralized ledgers differ from centralized databases.',
        'What is a Smart Contract and how does it execute on the Ethereum Virtual Machine (EVM)?',
        'How do Web3 wallets (e.g. Metamask) work, and what are the roles of public vs private keys?',
        'What is Ethereum Gas, how is it calculated, and why does gas price fluctuate during network congestion?',
        'Explain the ERC-20 standard for fungible tokens and the ERC-721 standard for non-fungible tokens (NFTs).'
      ],
      it: [
        'Spiega i principi fondamentali della tecnologia Blockchain e come differisce dai database centralizzati.',
        'Cos\'è uno Smart Contract e come si esegue sulla Ethereum Virtual Machine (EVM)?',
        'Come funzionano i wallet Web3 (es. Metamask) e quali sono i ruoli delle chiavi pubbliche e private?',
        'Cos\'è il Gas in Ethereum e perché il suo prezzo oscilla durante la congestione della rete?',
        'Spiega lo standard ERC-20 per token fungibili e lo standard ERC-721 per NFT.'
      ]
    },
    'Mid-Level': {
      ar: [
        'كيف تكتب عقداً ذكياً بلغة Solidity مع تطبيق أنماط الأمان لمنع ثغرات إعادة الدخول (Reentrancy Attacks)؟',
        'اشرح كيفية ربط واجهة تطبيق React بشبكة البلوكشين باستخدام مكتبات Ethers.js أو Viem/Wagmi.',
        'ما هي حلول التوسع من المستوى الثاني (Layer 2 Rollups مثل Arbitrum و Optimism) وكيف تقلل تكاليف المعاملات؟',
        'كيف تتعامل مع معالجة الأحداث (Events & Logs) والتسجيل العكسي لتحديث حالة dApp بسرعة؟',
        'ما هو الفرق بين التخزين على السلسلة (On-Chain) والتخزين اللامركزي خارج السلسلة (IPFS/Arweave)؟'
      ],
      en: [
        'How do you write a secure Solidity smart contract incorporating ReentrancyGuard and AccessControl modules?',
        'Explain how to integrate a React frontend with smart contracts using Ethers.js or Viem/Wagmi hooks.',
        'What are Layer 2 scaling solutions (Optimistic and ZK-Rollups) and how do they reduce gas fees?',
        'How do you listen to contract Events and handle transaction confirmations gracefully in dApp UIs?',
        'Compare on-chain storage constraints with decentralized storage solutions like IPFS and Arweave.'
      ],
      it: [
        'Come scrivi uno smart contract Solidity sicuro incorporando ReentrancyGuard e controlli di accesso?',
        'Spiega come integrare un frontend React con gli smart contract usando Ethers.js o Wagmi.',
        'Cosa sono le soluzioni di ridimensionamento Layer 2 (Rollup) e come riducono le commissioni di gas?',
        'Come ascolti gli eventi del contratto e gestisci le conferme delle transazioni nella UI dApp?',
        'Confronta i vincoli di archiviazione on-chain con soluzioni decentralizzate come IPFS e Arweave.'
      ]
    },
    'Senior': {
      ar: [
        'صمم معمارية بروتوكول تمويل لامركزي (DeFi Protocol Architecture) يضمن توازن السيولة والتجميع الأمني.',
        'كيف تجري مراجعة تدقيق أمني (Security Audit) لعقود Solidity الشاملة وتكتشف الثغرات مثل Flash Loan Exploits؟',
        'ناقش تقنيات إثبات المعرفة الصفرية (Zero-Knowledge Proofs - zk-SNARKs) وتطبيقاتها في الخصوصية والتوسع.',
        'كيف تبني نظام حوكمة لامركزية (DAO Governance) مع التوفير الآمن لتصويت العقد والإيقاف الاستثماري Emergency Pausable؟',
        'ما هي استراتيجيات تحسين كود Bytecode وتقليل استهلاك Gas في عقود Solidity المعقدة؟'
      ],
      en: [
        'Architect a decentralized finance (DeFi) protocol ensuring liquidity pool mechanics, oracle integration, and flash-loan resistance.',
        'How do you perform a comprehensive Solidity security audit to catch reentrancy, front-running, and integer overflow risks?',
        'Discuss Zero-Knowledge Proofs (zk-SNARKs/zk-STARKs) and their applications in blockchain privacy and scalability.',
        'How do you architect an immutable DAO Governance protocol with timelocks and multi-sig emergency pauses?',
        'Describe advanced EVM assembly (Yul) and bytecode optimization techniques for minimum gas usage.'
      ],
      it: [
        'Progetta l\'architettura di un protocollo DeFi garantendo la gestione della liquidità e la sicurezza da flash loan.',
        'Come esegui un audit di sicurezza Solidity completo per individuare vulnerabilità avanzate?',
        'Discussione sulle prove a conoscenza zero (zk-SNARK) e le loro applicazioni nella privacy e scalabilità.',
        'Come progetti un protocollo di Governance DAO immutabile con timelock e pause di emergenza multi-sig?',
        'Descrivi le tecniche di ottimizzazione del bytecode EVM e assembly (Yul) per il minimo consumo di gas.'
      ]
    }
  }
};

/**
 * Main interview process function that gracefully handles API calls and static fallback.
 */
export async function processInterviewStep(params: InterviewStepParams): Promise<InterviewStepResult> {
  const { category, difficulty, language, currentQuestion, userResponse, questionCount, track } = params;

  // Attempt to call the backend Express API first
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 6000); // 6s timeout

    const response = await fetch('/api/interview/chat', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        category,
        difficulty,
        language,
        currentQuestion,
        userResponse,
        questionCount,
        track
      }),
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    const contentType = response.headers.get('content-type') || '';
    
    // Check if response is JSON and ok
    if (response.ok && contentType.includes('application/json')) {
      const text = await response.text();
      // Ensure text is not HTML string
      if (!text.trim().startsWith('<')) {
        const data = JSON.parse(text);
        if (data && typeof data === 'object' && ('question' in data || 'feedback' in data)) {
          return data;
        }
      }
    }
  } catch (apiErr) {
    console.warn('Backend interview API unavailable or returned static page. Using intelligent client-side simulation engine.', apiErr);
  }

  // FALLBACK: Local Intelligent Interview Engine for Static Deployments
  return runClientSideInterviewEngine(params);
}

/**
 * Constructs a domain-specific AI system prompt dynamically adjusted to the user's active career track
 * (Frontend, Backend, Fullstack, UI/UX, or Web3) to ensure highly relevant assessment feedback and technical depth.
 */
export function buildInterviewSystemPrompt(params: InterviewStepParams): string {
  const { category, difficulty, language, track } = params;
  const activeTrack = track || (
    ['php', 'laravel', 'mysql', 'backend'].includes(category) ? 'backend' :
    ['uiux', 'figma'].includes(category) ? 'uiux' :
    ['web3', 'solidity'].includes(category) ? 'web3' : 'frontend'
  );

  let trackRoleContext = '';
  if (activeTrack === 'backend') {
    trackRoleContext = `You are an expert Senior Backend & Database Engineering Interviewer conducting a technical assessment.
Focus Areas: Server-side architecture, PHP 8.x, Laravel 11, Eloquent ORM, MySQL 8 database schema design, REST API security (CSRF, SQL Injection prevention, JWT), and SOLID backend design patterns.
Ensure all questions, feedback, and scoring strictly align with modern Backend Software Engineering standards.`;
  } else if (activeTrack === 'frontend') {
    trackRoleContext = `You are an expert Senior Front-End Web Software Engineering Interviewer conducting a technical assessment.
Focus Areas: Client-side web architecture, React 18+, modern ES6+ JavaScript, CSS3/Tailwind responsive layouts, state management (Redux/Zustand/Context), Web Vitals performance, accessibility (a11y), and UI component design patterns.
Ensure all questions, feedback, and scoring strictly align with modern Front-End Web Engineering standards.`;
  } else if (activeTrack === 'uiux') {
    trackRoleContext = `You are an expert Lead UI/UX Product Design & Design Systems Interviewer conducting a technical assessment.
Focus Areas: Figma Auto-Layout 5.0, Design Tokens, Design Systems, User Research, Wireframing, Information Architecture, WCAG accessibility compliance (a11y), and Developer Handoff workflows.
Ensure all questions, feedback, and scoring strictly align with modern UI/UX Product Design standards.`;
  } else if (activeTrack === 'web3') {
    trackRoleContext = `You are an expert Senior Web3 & Smart Contract Engineering Interviewer conducting a technical assessment.
Focus Areas: Ethereum EVM, Solidity smart contracts, DeFi protocol architecture, Reentrancy protection, ERC-20/ERC-721 token standards, Web3 wallet integrations (Ethers.js / Wagmi / Metamask), and gas optimization.
Ensure all questions, feedback, and scoring strictly align with modern Web3 Blockchain Engineering standards.`;
  } else {
    trackRoleContext = `You are an expert Principal Full-Stack Software Engineering Interviewer conducting a technical assessment.
Focus Areas: End-to-end fullstack architecture covering Front-End (React, JavaScript, CSS), Back-End (PHP 8, Laravel 11, MySQL, REST APIs), UI/UX Design Systems, and Web3 decentralization standards.`;
  }

  const langInstruction = language === 'ar'
    ? 'Arabic (العربية) - Conduct the entire evaluation in fluent professional technical Arabic using industry standard engineering terminology.'
    : language === 'it'
    ? 'Italian (Italiano) - Conduct the entire evaluation in fluent technical Italian.'
    : 'English - Conduct the entire evaluation in clear, professional technical English.';

  return `${trackRoleContext}
Topic Category: ${category}
Seniority Level: ${difficulty}
Active Engineering Track: ${activeTrack.toUpperCase()}
Language: ${langInstruction}

Evaluation Rules:
1. Provide constructive, highly specific feedback on the candidate's answer.
2. Evaluate technical depth, accuracy, edge case handling, and best practices relevant to ${activeTrack}.
3. Assign an accurate integer score (0 to 10).
4. Output valid JSON matching the schema.`;
}

/**
 * Intelligent Client-Side Simulation Engine for offline or static hosting environments.
 */
function runClientSideInterviewEngine(params: InterviewStepParams): InterviewStepResult {
  const { category, difficulty, language, currentQuestion, userResponse, questionCount, track } = params;

  const activeTrack = track || (
    ['php', 'laravel', 'mysql', 'backend'].includes(category) ? 'backend' :
    ['uiux', 'figma'].includes(category) ? 'uiux' :
    ['web3', 'solidity'].includes(category) ? 'web3' : 'frontend'
  );
  const langKey = (['ar', 'it', 'en'].includes(language) ? language : 'en') as 'ar' | 'it' | 'en';
  
  // Select appropriate question bank category based on category and track fallback
  const catKey = QUESTION_BANKS[category] 
    ? category 
    : (activeTrack === 'backend' ? 'laravel' : activeTrack === 'uiux' ? 'uiux' : activeTrack === 'web3' ? 'web3' : 'react');
    
  const diffKey = (['Junior', 'Mid-Level', 'Senior'].includes(difficulty) ? difficulty : 'Mid-Level') as 'Junior' | 'Mid-Level' | 'Senior';

  const questionsList = QUESTION_BANKS[catKey]?.[diffKey]?.[langKey] 
    || QUESTION_BANKS[catKey]?.['Mid-Level']?.[langKey] 
    || QUESTION_BANKS['react']['Mid-Level']['en'];

  const isStart = !userResponse || userResponse.trim() === '' || questionCount === 0;

  if (isStart) {
    // Return Question #1
    const firstQuestion = questionsList[0] || 'Explain your development workflow and architecture choices.';
    return {
      feedback: '',
      score: -1,
      question: firstQuestion,
      isEnd: false
    };
  }

  // Evaluate candidate's response
  const responseLen = userResponse.trim().length;
  let score = 5;
  
  if (responseLen > 250) score += 3;
  else if (responseLen > 100) score += 2;
  else if (responseLen > 30) score += 1;

  // Track-specific technical keyword matching
  const backendKeywords = ['php', 'laravel', 'eloquent', 'mysql', 'select', 'join', 'index', 'pdo', 'middleware', 'route', 'controller', 'jwt', 'rest', 'api', 'sql', 'orm', 'acid', 'json', 'artisan', 'migration'];
  const frontendKeywords = ['const', 'function', 'return', 'import', 'state', 'props', 'useeffect', 'component', 'api', 'async', 'await', 'flex', 'grid', 'cache', 'render', 'memory', 'css', 'html', 'dom', 'jsx', 'tsx', 'hook', 'redux', 'zustand'];
  const uiuxKeywords = ['figma', 'auto-layout', 'variant', 'token', 'persona', 'grid', 'spacing', 'contrast', 'wcag', 'accessibility', 'wireframe', 'handoff', 'user', 'hierarchy', 'typography', 'dark mode', 'design system'];
  const web3Keywords = ['solidity', 'contract', 'ethereum', 'evm', 'gas', 'metamask', 'wallet', 'erc-20', 'erc-721', 'nft', 'ethers', 'wagmi', 'reentrancy', 'blockchain', 'decentralized', 'hash', 'bytecode', 'abi'];

  const techKeywords = activeTrack === 'backend' ? backendKeywords :
    activeTrack === 'uiux' ? uiuxKeywords :
    activeTrack === 'web3' ? web3Keywords : frontendKeywords;

  const lowerResp = userResponse.toLowerCase();
  const keywordMatches = techKeywords.filter(kw => lowerResp.includes(kw)).length;
  if (keywordMatches >= 3) score += 2;
  else if (keywordMatches >= 1) score += 1;

  score = Math.min(10, Math.max(2, score));

  // Construct track-aware feedback based on language and activeTrack
  let feedback = '';
  const trackNames = {
    backend: { en: 'Backend (PHP/Laravel/MySQL)', ar: 'الهندسة الخلفية (Laravel/MySQL)', it: 'Backend (Laravel/MySQL)' },
    frontend: { en: 'Frontend (React/JavaScript)', ar: 'واجهة المستخدم (React/JavaScript)', it: 'Frontend (React/JavaScript)' },
    uiux: { en: 'UI/UX Design (Figma/Design Systems)', ar: 'تصميم الواجهات وتجربة المستخدم (UI/UX)', it: 'UI/UX Design (Figma/Design Systems)' },
    web3: { en: 'Web3 & Blockchain (Solidity/Ethereum)', ar: 'تطبيقات الويب 3 والبلوكشين (Solidity/EVM)', it: 'Web3 e Blockchain (Solidity/Ethereum)' },
    fullstack: { en: 'Fullstack Engineering', ar: 'الهندسة الشاملة (Fullstack)', it: 'Ingegneria Fullstack' }
  };

  const trackNameObj = trackNames[activeTrack] || trackNames.frontend;
  const trackNameEn = trackNameObj.en;
  const trackNameAr = trackNameObj.ar || trackNameObj.en;
  const trackNameIt = trackNameObj.it;

  if (langKey === 'ar') {
    if (score >= 8) {
      feedback = `إجابة متمتازة في تخصص ${trackNameAr}! غطيت المفاهيم الجوهرية واستخدمت معايير دقيقة في ${category}.`;
    } else if (score >= 6) {
      feedback = `إجابة جيدة في ${trackNameAr}. يمكنك تدعيم الإجابة بأمثلة عملية وكيفية التعامل مع حالات الأخطاء المعقدة.`;
    } else {
      feedback = `إجابة مختصرة. يُفضل توسيع شرح المفهوم وتوفير نماذج توضيحية لبيان عمق المعرفة في ${trackNameAr}.`;
    }
  } else if (langKey === 'it') {
    if (score >= 8) {
      feedback = `Eccellente risposta per ${trackNameIt}! Hai coperto i punti chiave con terminologia tecnica accurata in ${category}.`;
    } else if (score >= 6) {
      feedback = `Buona risposta per ${trackNameIt}. Puoi rafforzarla includendo esempi pratici e gestione degli errori.`;
    } else {
      feedback = `Risposta breve. Si consiglia di approfondire i concetti fondamentali per il percorso ${trackNameIt}.`;
    }
  } else {
    if (score >= 8) {
      feedback = `Excellent answer for the ${trackNameEn} track! You covered core architectural points cleanly in ${category}.`;
    } else if (score >= 6) {
      feedback = `Good response for ${trackNameEn}. You can strengthen it by providing explicit examples and edge case handling.`;
    } else {
      feedback = `Brief response. Consider elaborating on key ${trackNameEn} concepts and providing practical examples.`;
    }
  }

  const nextQIndex = questionCount; // 1-indexed count means next is questionsList[questionCount]
  const isEnd = questionCount >= 5 || nextQIndex >= questionsList.length;

  if (isEnd) {
    let overallSummary = '';
    const overallScore = Math.min(95, Math.max(65, Math.round(score * 9.2)));

    if (langKey === 'ar') {
      overallSummary = `أحسنت! لقد أكملت محاكاة المقابلة التقنية بنجاح في مسار (${trackNameAr}) وتخصص (${category}).\nأظهرت فهماً ممتازاً للمفاهيم الأساسية. واصل التدرب لبيان عمق المعرفة في المقابلات المباشرة.`;
    } else if (langKey === 'it') {
      overallSummary = `Ben fatto! Hai completato la simulazione di colloquio tecnico nel percorso (${trackNameIt}) per (${category}).\nHai dimostrato una solida padronanza. Continua ad esercitarti.`;
    } else {
      overallSummary = `Well done! You have completed the technical interview simulation for the ${trackNameEn} track in (${category}).\nYou demonstrated strong domain knowledge. Keep practicing in live technical interviews!`;
    }

    return {
      feedback,
      score,
      question: '',
      isEnd: true,
      overallSummary,
      overallScore
    };
  }

  const nextQuestion = questionsList[nextQIndex] || questionsList[questionsList.length - 1];

  return {
    feedback,
    score,
    question: nextQuestion,
    isEnd: false
  };
}

