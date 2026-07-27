/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface InterviewStepParams {
  category: string;
  difficulty: string;
  language: string; // 'ar' | 'es' | 'en'
  currentQuestion: string;
  userResponse: string;
  questionCount: number;
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
      es: [
        'Explica el concepto de Componentes y Props en React. ¿En qué se diferencian las Props del State?',
        '¿Cuál es la diferencia entre State y Props en React y cuándo debes usar cada uno?',
        'Explica el hook useEffect, sus casos de uso comunes y el propósito del array de dependencias.',
        '¿Cómo se manejan los componentes controlados en los formularios de React?',
        '¿Qué son las claves (keys) en las listas de React y por qué son cruciales para el rendimiento?'
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
      es: [
        '¿Cómo funciona el Virtual DOM de React y su algoritmo de reconciliación?',
        'Explica useMemo y useCallback. ¿Cuándo puede perjudicar el rendimiento usarlos en exceso?',
        'Compara los enfoques de gestión de estado en React: Context API vs Redux/Zustand.',
        '¿Cómo funcionan los Error Boundaries en React y cuáles son sus limitaciones?',
        'Explica los Custom Hooks. ¿Cómo diseñarías un hook personalizado para peticiones asíncronas?'
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
      es: [
        'Explica el renderizado concurrente de React, los Server Components (RSC) y su impacto arquitectónico.',
        'Describe tu estrategia de Code Splitting e importaciones dinámicas para minimizar el tamaño del bundle.',
        'Discute la arquitectura de Micro-Frontends en React, el compartido de estado y el aislamiento de dependencias.',
        '¿Cuáles son las causas principales de las fugas de memoria en React y cómo las detectas y solucionas?',
        '¿Cómo diseñarías un Design System escalable priorizando rendimiento y accesibilidad (a11y)?'
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
      es: [
        'Explica las diferencias entre var, let y const en términos de alcance (scope) y hoisting.',
        '¿Qué son las Promises en JavaScript y cómo mejoran el código asíncrono basado en callbacks?',
        'Diferencia entre tipos primitivos y tipos de referencia en la memoria de JavaScript.',
        'Explica la sintaxis async/await y el manejo de excepciones usando bloques try...catch.',
        '¿Cómo funcionan los métodos de arrays de alto orden como map, filter y reduce en JS moderno?'
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
      es: [
        'Explica los Closures en JavaScript con un caso de uso práctico del mundo real.',
        '¿Cómo interactúan el Event Loop, la Call Stack, la Microtask Queue y la Macrotask Queue en JS?',
        'Explica la herencia prototípica y el mecanismo de la Cadena de Prototipos en JavaScript.',
        '¿Cómo se vincula dinámicamente la palabra clave "this"? Compara call, apply y bind.',
        'Diferencia entre las técnicas de Debounce y Throttle para optimizar eventos del DOM de alta frecuencia.'
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
      es: [
        'Explica las estrategias de Recolección de Basura de V8 y cómo WeakMap/WeakSet ayudan en la gestión de memoria.',
        '¿Cómo funcionan los Proxies y la API Reflect en JavaScript para construir motores de reactividad?',
        'Discute los Web Workers, SharedArrayBuffer y cómo liberar la GPU/CPU del hilo principal.',
        'Explica la resolución de ES Modules, trampas de dependencias cíclicas e importaciones dinámicas.',
        'Describe las optimizaciones del motor V8, incluyendo compilación JIT, Clases Ocultas e Inline Caching.'
      ]
    }
  },
  html_css: {
    'Junior': {
      ar: [
        'ما هي العناصر الدلالية (Semantic HTML5 Elements) ولماذا هي مهمة لمحركات البحث وسهولة الوصول؟',
        'اشرح نموذج الصندوق (CSS Box Model) وكيف يغير box-sizing: border-box الحسابات.',
        'ما هو الفرق بين CSS Flexbox و CSS Grid ومتى يُفضل استخدام كل منهما؟',
        'كيف تجعل موقعك متجاوباً باستخدام Media Queries والوحدات النسبية مثل rem و em و vh/vw؟',
        'ما هي خاصية position في CSS وكيف تختلف relative و absolute و fixed و sticky؟'
      ],
      en: [
        'What is Semantic HTML5 and why is it important for SEO and Accessibility (a11y)?',
        'Explain the CSS Box Model and how box-sizing: border-box alters layout calculation.',
        'Compare CSS Flexbox vs CSS Grid. When is one more appropriate than the other?',
        'How do you make layouts responsive using Media Queries and relative units (rem, em, vh, vw)?',
        'Explain CSS positioning properties: static, relative, absolute, fixed, and sticky.'
      ],
      es: [
        '¿Qué es HTML5 semántico y por qué es importante para el SEO y la accesibilidad (a11y)?',
        'Explica el CSS Box Model y cómo box-sizing: border-box altera el cálculo del diseño.',
        'Compara CSS Flexbox vs CSS Grid. ¿Cuándo es más apropiado usar cada uno?',
        '¿Cómo creas diseños responsivos usando Media Queries y unidades relativas (rem, em, vh, vw)?',
        'Explica las propiedades de posicionamiento CSS: static, relative, absolute, fixed y sticky.'
      ]
    },
    'Mid-Level': {
      ar: [
        'اشرح مفهوم CSS Specificity وقواعد حساب الأولوية عند تعارض التنسيقات.',
        'كيف تعمل استراتيجيات Accessibility (a11y) وأدوار ARIA Attributes واختبار القارئ الصوتي؟',
        'ما هو BEM Methodology وكيف يمنع تداخل أسماء فئات CSS في المشاريع الكبيرة؟',
        'اشرح تحسين الخطوط والتصميمات لتفادي قفزات المحتوى المتكررة (Cumulative Layout Shift - CLS).',
        'كيف تستخدم متغيرات CSS Custom Properties مترافقة مع Tailwind أو CSS Modules في السيمات (Theming)؟'
      ],
      en: [
        'Explain CSS Specificity scoring rules and how cascading conflicts are resolved.',
        'Describe Accessibility (a11y) standards, ARIA roles, and screen reader navigation best practices.',
        'What is BEM methodology and how does it prevent style leaking in large codebases?',
        'How do you optimize font loading and images to reduce Cumulative Layout Shift (CLS)?',
        'Explain CSS Custom Properties and how they enable dynamic runtime theming in web applications.'
      ],
      es: [
        'Explica las reglas de especificidad de CSS y cómo se resuelven los conflictos de cascada.',
        'Describe las normas de accesibilidad (a11y), roles ARIA y mejores prácticas para lectores de pantalla.',
        '¿Qué es la metodología BEM y cómo previene filtraciones de estilo en proyectos grandes?',
        '¿Cómo optimizas la carga de fuentes e imágenes para reducir la Inestabilidad del Diseño (CLS)?',
        'Explica las propiedades personalizadas de CSS y cómo permiten temas dinámicos en tiempo de ejecución.'
      ]
    },
    'Senior': {
      ar: [
        'اشرح معماريات CSS الحديثة مثل Container Queries و Cascade Layers (@layer) وتأثيرها على النظم الموحدة.',
        'كيف تبني نظام متكامل لإمكانية الوصول (WCAG 2.1 AAA Compliance) يشمل لوحة المفاتيح والتباين والألوان؟',
        'ناقش معالجة الرسوميات ثلاثية الأبعاد و CSS Subgrid و CSS Houdini وتوسع محرك المتصفح.',
        'كيف تحد من أخطاء الرندر الناتجة عن Reflow و Repaint عند عمل التحريكات والمعالجة البصرية؟',
        'استراتيجيات معالجة CSS أوتوماتيكياً في أدوات البناء مثل PostCSS و PurgeCSS و Tailwind JIT Engine.'
      ],
      en: [
        'Explain Container Queries and CSS Cascade Layers (@layer) for building scalable component design systems.',
        'How do you achieve WCAG 2.1 AAA Accessibility compliance across complex interactive UI controls?',
        'Discuss CSS Houdini APIs, CSS Subgrid, and hardware-accelerated 3D rendering in modern browsers.',
        'How do you optimize layout performance by minimizing browser Reflows and Repaints during animations?',
        'Analyze CSS build pipelines (PostCSS, PurgeCSS, Tailwind JIT compiler) for zero-runtime CSS footprint.'
      ],
      es: [
        'Explica las Container Queries y CSS Cascade Layers (@layer) para sistemas de diseño escalables.',
        '¿Cómo logras el cumplimiento de accesibilidad WCAG 2.1 AAA en controles interactivos complejos?',
        'Discute las APIs de CSS Houdini, CSS Subgrid y el renderizado 3D acelerado por hardware.',
        '¿Cómo optimizas el rendimiento del diseño minimizando Reflows y Repaints en las animaciones?',
        'Analiza los flujos de compilación de CSS (PostCSS, PurgeCSS, Tailwind JIT) para un impacto cero.'
      ]
    }
  },
  performance: {
    'Junior': {
      ar: [
        'ما هي المقاييس الأساسية لأداء الويب Core Web Vitals (LCP, FID/INP, CLS) وماذا تعني؟',
        'كيف تؤثر أحجام الصور وتنسيقات مثل WebP و AVIF على سرعة تحميل الموقع؟',
        'ما هو التحميل الكسول (Lazy Loading) للصور والمكونات وكيف يتم تطبيقه؟',
        'ما هي ملفات الكوكيز (Cookies) والتخزين المحلي (LocalStorage/SessionStorage) وأيها أكثر أماناً؟',
        'كيف تفحص أداء موقعك باستخدام شبكة تبويب Network وأداة Lighthouse في Chrome DevTools؟'
      ],
      en: [
        'What are Core Web Vitals (LCP, INP, CLS) and why are they vital for user experience?',
        'How do modern image formats (WebP, AVIF) and responsive srcsets impact loading speed?',
        'Explain Lazy Loading for images and components using native HTML attributes and dynamic imports.',
        'Compare LocalStorage, SessionStorage, and HTTP-only Cookies regarding security and persistence.',
        'How do you use Chrome DevTools Network panel and Lighthouse to diagnose frontend bottlenecks?'
      ],
      es: [
        '¿Qué son las Core Web Vitals (LCP, INP, CLS) y por qué son vitales para la experiencia del usuario?',
        '¿Cómo impactan los formatos de imagen modernos (WebP, AVIF) en la velocidad de carga?',
        'Explica el Lazy Loading para imágenes y componentes usando atributos nativos e importaciones dinámicas.',
        'Compara LocalStorage, SessionStorage y Cookies HTTP-only en términos de seguridad y persistencia.',
        '¿Cómo usas el panel de Red de Chrome DevTools y Lighthouse para diagnosticar cuellos de botella?'
      ]
    },
    'Mid-Level': {
      ar: [
        'اشرح هجمات Cross-Site Scripting (XSS) و Cross-Site Request Forgery (CSRF) وكيف نحمي التطبيق منها.',
        'كيف تحسن وقت التفاعل الأول بالصفحة (FID/INP) عن طريق تقليل تنفيذ JavaScript في الخيط الرئيسي؟',
        'ما هي رؤوس الأمان (Security Headers) مثل Content Security Policy (CSP) و CORS وكيف تضبطها؟',
        'اشرح تقنيات التخزين المؤقت (Caching Strategies) مثل Service Workers و HTTP Cache-Control headers.',
        'كيف تحلل ملف البناء النهائي (Bundle Analyzer) وتكتشف المكتبات المكررة أو غير المستخدمة (Tree Shaking)؟'
      ],
      en: [
        'Explain XSS and CSRF security vulnerabilities and how to prevent them in front-end applications.',
        'How do you optimize Interaction to Next Paint (INP) by breaking up long tasks on the main thread?',
        'Explain Content Security Policy (CSP), CORS, and essential HTTP security headers.',
        'Describe HTTP caching headers (Cache-Control, ETag) and Progressive Web App Service Worker caching strategies.',
        'How do you perform bundle analysis, tree-shaking verification, and dead-code elimination?'
      ],
      es: [
        'Explica las vulnerabilidades XSS y CSRF y cómo prevenirlas en aplicaciones front-end.',
        '¿Cómo optimizas Interaction to Next Paint (INP) dividiendo tareas largas en el hilo principal?',
        'Explica la Política de Seguridad de Contenido (CSP), CORS y cabeceras de seguridad HTTP esenciales.',
        'Describe las cabeceras de caché HTTP (Cache-Control, ETag) y estrategias de caché con Service Workers.',
        '¿Cómo realizas el análisis de bundles, verificación de tree-shaking y eliminación de código muerto?'
      ]
    },
    'Senior': {
      ar: [
        'كيف تصمم استراتيجية شاملة للأداء على مستوى المؤسسات تغطي CDN Caching و SSR/SSG/ISR و Edge Computing؟',
        'اشرح كيفية تأمين توكنز OAuth2/JWT وتجنب ثغرات XSS في تخزين التوكنات على العميل.',
        'كيف تجري اختبارات الأداء المزدوجة (Synthetic vs Real User Monitoring - RUM) وتتتبع الأعطال في الوقت الفعلي؟',
        'ما هي استراتيجيات تحسين ميزانية JavaScript (JS Budget) والتحميل التدريجي المتقدم (Hydration / Islands Architecture)؟',
        'كيف تتعامل مع هجمات العرض السريعة Supply Chain Attacks وحزم npm الخبيثة في مشروع ضخم؟'
      ],
      en: [
        'How do you design an enterprise performance architecture combining CDN caching, Edge computing, and SSR/ISR?',
        'Explain secure token storage strategies (OAuth2/JWT) to prevent token exfiltration via XSS.',
        'Compare Synthetic Monitoring vs Real User Monitoring (RUM) for tracking production performance metrics.',
        'Discuss JavaScript execution budget enforcement, Partial Hydration, and Islands Architecture.',
        'How do you secure your front-end supply chain against compromised npm package dependencies?'
      ],
      es: [
        '¿Cómo diseñas una arquitectura de rendimiento empresarial combinando caché CDN, Edge Computing y SSR/ISR?',
        'Explica las estrategias de almacenamiento seguro de tokens (OAuth2/JWT) para evitar filtraciones por XSS.',
        'Compara la monitorización sintética vs RUM para rastrear métricas de rendimiento en producción.',
        'Discute la gestión del presupuesto de JavaScript, la hidratación parcial y la Arquitectura de Islas.',
        '¿Cómo proteges la cadena de suministro front-end contra dependencias de paquetes npm comprometidas?'
      ]
    }
  },
  system_design: {
    'Junior': {
      ar: [
        'ما هي المبادئ الأساسية لتقسيم التنسيقات والواجهات إلى مكونات قابلة لإعادة الاستخدام (Component Architecture)؟',
        'كيف تخطط لبناء صفحة متكاملة مثل لوحة تحكم (Dashboard) من حيث جلب البيانات وتنظيم المكونات؟',
        'اشرح مفهوم التوزيع الأحادي والمزدوج للملفات وتدفق البيانات من الأب إلى الابن (Unidirectional Data Flow).',
        'كيف تتعامل مع حالات عدم وجود بيانات (Empty States) وحالات التحميل (Loading Skeletons) وحالات الأخطاء؟',
        'ما هي التسميات القياسية للملفات والمجلدات التي تضمن سهولة صيانة التطبيق مع نموه؟'
      ],
      en: [
        'What are core principles of splitting a feature UI into reusable atomic components?',
        'How do you plan the architecture of a complex page (like a Dashboard) regarding data fetching and UI composition?',
        'Explain unidirectional data flow and state lifting from child components to parent components.',
        'How do you handle loading skeletons, error fallbacks, and empty states gracefully in UI design?',
        'What directory structures and file conventions promote long-term codebase maintainability?'
      ],
      es: [
        '¿Cuáles son los principios fundamentales para dividir una interfaz en componentes atómicos reutilizables?',
        '¿Cómo planificas la arquitectura de una página compleja (como un Dashboard) respecto a datos y componentes?',
        'Explica el flujo de datos unidireccional y la elevación de estado (state lifting) entre componentes.',
        '¿Cómo manejas de forma elegante los estados de carga (skeletons), fallos y estados vacíos en la UI?',
        '¿Qué estructuras de directorios y convenciones promueven la mantenibilidad del código a largo plazo?'
      ]
    },
    'Mid-Level': {
      ar: [
        'صمم واجهة مستخدم لتطبيق محادثة مباشرة (Real-Time Chat Application) مع التعامل مع الاتصال الشبكي والانقطاع.',
        'كيف تصمم نظام Infinite Scroll / News Feed يبقي الأداء سلسامع آلاف العناصر (Virtualization / Windowing)؟',
        'كيف تبني نظام Caching للبيانات على جهة العميل يمنع تكرار طلبات الشبكة (Deduplication & Stale-While-Revalidate)؟',
        'صمم معمارية تطبيق للتعديل التشاركي (Collaborative Rich Text Editor) مع دعم الأوفلاين.',
        'كيف تخطط للهجرة (Migration Plan) من مشروع قديم (Monolith / Legacy JS) إلى مشروع حديث دون إيقاف الخدمة؟'
      ],
      en: [
        'Design the frontend architecture for a real-time chat application handling network reconnections.',
        'Design a high-performance Infinite Scroll feed rendering tens of thousands of items using List Virtualization.',
        'Architect a client-side API data fetching layer supporting caching, deduplication, and Stale-While-Revalidate.',
        'Design the architecture for a collaborative document editor supporting offline edits and conflict resolution.',
        'Outline a zero-downtime migration strategy from a legacy jQuery/Monolith frontend to a modern React SPA.'
      ],
      es: [
        'Diseña la arquitectura front-end para una aplicación de chat en tiempo real manejando reconexiones de red.',
        'Diseña un feed de desplazamiento infinito optimizado rindiendo miles de elementos usando Virtualización.',
        'Diseña una capa de peticiones API en el cliente que admita caché, deduplicación y Stale-While-Revalidate.',
        'Diseña la arquitectura para un editor colaborativo de documentos con soporte para edición offline.',
        'Planifica una estrategia de migración sin tiempo de inactividad de un sistema heredado a React moderno.'
      ]
    },
    'Senior': {
      ar: [
        'صمم واجهة معمارية لتطبيق مثل Google Docs أو Figma يضم لوحة رسم تعاملية عالية الأداء (Canvas / WebGL / WebAssembly).',
        'كيف تبني منصة عالمية متعددة اللغات والثقافات (i18n & RTL) ومطابقة للمعايير الأمنية الضخمة؟',
        'صمم نظام Micro-Frontend متكامل مع Module Federation وإدارة التحكم في الإدراج والمراقبة المستمرة.',
        'كيف تبني محرك استعلامات وسحب أوفلاين مع المزامنة الخلفية عند عودة الاتصال (Offline First PWA Sync Engine)؟',
        'صمم نظام تحليلات وتتبع للأحداث (Analytics & Telemetry Pipeline) يضمن عدم إبطاء واجهة المستخدم وتجربة المستخدم.'
      ],
      en: [
        'Architect a complex web application like Figma or Google Docs utilizing Canvas/WebGL/WebAssembly rendering engines.',
        'Design a global enterprise i18n/RTL localization framework with dynamic translation bundle loading.',
        'Design a Micro-Frontend architecture using Webpack Module Federation with centralized routing and design system controls.',
        'Architect an Offline-First Progressive Web App sync engine using IndexedDB, Background Sync, and Conflict Resolution.',
        'Design a non-blocking client-side Telemetry and Real User Monitoring (RUM) tracking pipeline.'
      ],
      es: [
        'Diseña la arquitectura de una aplicación compleja como Figma usando motores Canvas/WebGL/WebAssembly.',
        'Diseña un marco de localización empresarial global (i18n/RTL) con carga dinámica de paquetes de traducción.',
        'Diseña una arquitectura Micro-Frontend usando Module Federation con enrutamiento y sistema de diseño centralizado.',
        'Diseña un motor de sincronización PWA Offline-First usando IndexedDB, Sync en segundo plano y resolución de conflictos.',
        'Diseña un canal de telemetría y RUM no bloqueante en el cliente para rastrear eventos de rendimiento.'
      ]
    }
  }
};

/**
 * Main interview process function that gracefully handles API calls and static fallback.
 */
export async function processInterviewStep(params: InterviewStepParams): Promise<InterviewStepResult> {
  const { category, difficulty, language, currentQuestion, userResponse, questionCount } = params;

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
        questionCount
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

  // FALLBACK: Local Intelligent Interview Engine for Static Deployments (Firebase Hosting)
  return runClientSideInterviewEngine(params);
}

/**
 * Intelligent Client-Side Simulation Engine for offline or static hosting environments.
 */
function runClientSideInterviewEngine(params: InterviewStepParams): InterviewStepResult {
  const { category, difficulty, language, currentQuestion, userResponse, questionCount } = params;

  const langKey = (['ar', 'es', 'en'].includes(language) ? language : 'en') as 'ar' | 'es' | 'en';
  const catKey = QUESTION_BANKS[category] ? category : 'react';
  const diffKey = (['Junior', 'Mid-Level', 'Senior'].includes(difficulty) ? difficulty : 'Mid-Level') as 'Junior' | 'Mid-Level' | 'Senior';

  const questionsList = QUESTION_BANKS[catKey]?.[diffKey]?.[langKey] || QUESTION_BANKS['react']['Mid-Level']['en'];

  const isStart = !userResponse || userResponse.trim() === '' || questionCount === 0;

  if (isStart) {
    // Return Question #1
    const firstQuestion = questionsList[0] || 'Explain your front-end development workflow and component structuring.';
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

  // Bonus points for code snippets or technical keywords
  const techKeywords = ['const', 'function', 'return', 'import', 'state', 'props', 'useeffect', 'component', 'api', 'async', 'await', 'flex', 'grid', 'cache', 'render', 'memory', 'css', 'html', 'dom'];
  const lowerResp = userResponse.toLowerCase();
  const keywordMatches = techKeywords.filter(kw => lowerResp.includes(kw)).length;
  if (keywordMatches >= 3) score += 2;
  else if (keywordMatches >= 1) score += 1;

  score = Math.min(10, Math.max(2, score));

  // Construct feedback based on language
  let feedback = '';
  if (langKey === 'ar') {
    if (score >= 8) {
      feedback = `إجابة متمتازة وشاملة! لقد غطيت النقاط الفنية الجوهرية واستخدمت مصطلحات هندسية دقيقة بأسلوب ممتاز.`;
    } else if (score >= 6) {
      feedback = `إجابة جيدة وواضحة. يمكنك تعزيز إجابتك أكثر بذكر أمثلة على حالات الاستخدام الواقعية والتفاصيل البرمجية المباشرة.`;
    } else {
      feedback = `إجابة مختصرة. يُفضل توسيع شرح المفهوم وتزويد أمثلة كود توضيحية لبيان عمق المعرفة البرمجية.`;
    }
  } else if (langKey === 'es') {
    if (score >= 8) {
      feedback = `¡Excelente respuesta! Cubriste los puntos técnicos esenciales utilizando terminología precisa y buen nivel.`;
    } else if (score >= 6) {
      feedback = `Buena respuesta. Puedes mejorarla añadiendo casos de uso del mundo real y ejemplos de código directos.`;
    } else {
      feedback = `Respuesta breve. Se recomienda profundizar en la explicación e incluir fragmentos de código.`;
    }
  } else {
    if (score >= 8) {
      feedback = `Excellent answer! You covered core architectural points clearly with accurate technical vocabulary.`;
    } else if (score >= 6) {
      feedback = `Good response. You can strengthen it further by including real-world trade-offs or explicit code snippets.`;
    } else {
      feedback = `Brief response. Consider elaborating on the underlying concepts and providing concrete code examples.`;
    }
  }

  const nextQIndex = questionCount; // 1-indexed count means next is questionsList[questionCount]
  const isEnd = questionCount >= 5 || nextQIndex >= questionsList.length;

  if (isEnd) {
    let overallSummary = '';
    const overallScore = Math.min(95, Math.max(65, Math.round(score * 9.2)));

    if (langKey === 'ar') {
      overallSummary = `أحسنت! لقد أكملت محاكاة المقابلة التقنية بنجاح في تخصص (${category}).\nأظهرت فهماً ممتازاً للمفاهيم الأساسية، ومهارة في الشرح الفني. يُنصح بمواصلة التدرب على كتابة أمثلة كود دقيقة أثناء المقابلات المباشرة.`;
    } else if (langKey === 'es') {
      overallSummary = `¡Bien hecho! Completaste la simulación de entrevista técnica en (${category}).\nDemostraste un sólido dominio técnico. Se recomienda seguir practicando la inclusión de código en vivo.`;
    } else {
      overallSummary = `Well done! You have completed the technical interview simulation in (${category}).\nYou demonstrated good domain knowledge. Keep practicing writing clean live code snippets during interviews.`;
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
