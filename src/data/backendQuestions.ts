/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Question } from '../types';

export const INITIAL_BACKEND_QUESTIONS: Question[] = [
  // LARAVEL QUESTIONS
  {
    id: 'backend-laravel-001',
    category: 'laravel',
    topic: 'Eloquent ORM & Relationships',
    difficulty: 'medium',
    type: 'multiple-choice',
    questionText: 'Which Eloquent method defines a One-To-Many inverse relationship in a Laravel model?',
    questionTextAr: 'ما هي طريقة Eloquent التي تُعرّف العلاقة العكسية من نوع (واحد إلى متعدد) في نموذج Laravel؟',
    questionTextIt: 'Quale metodo Eloquent definisce una relazione inversa Uno-a-Molti in un modello Laravel?',
    codeSnippet: `class Post extends Model {
    public function user() {
        return $this->???('App\\Models\\User');
    }
}`,
    options: [
      'belongsTo()',
      'hasMany()',
      'hasOne()',
      'belongsToMany()'
    ],
    optionsAr: [
      'belongsTo()',
      'hasMany()',
      'hasOne()',
      'belongsToMany()'
    ],
    optionsIt: [
      'belongsTo()',
      'hasMany()',
      'hasOne()',
      'belongsToMany()'
    ],
    correctAnswer: [0],
    explanation: 'In Laravel Eloquent, `belongsTo()` defines the inverse of a `hasMany` or `hasOne` relationship, establishing that the current model holds the foreign key.',
    explanationAr: 'في Laravel Eloquent، تُعرف `belongsTo()` العكس لعلاقة `hasMany` أو `hasOne`، حيث يحمل النموذج الحالي المفتاح الأجنبي (Foreign Key).',
    explanationIt: 'In Laravel Eloquent, `belongsTo()` definisce l\'inverso di una relazione `hasMany` o `hasOne`, indicando che il modello corrente contiene la chiave esterna.',
    hint: 'Think of the child model possessing the foreign key column (e.g. user_id).',
    hintAr: 'فكر في النموذج الفرعي الذي يمتلك عمود المفتاح الأجنبي مثل user_id.'
  },
  {
    id: 'backend-laravel-002',
    category: 'laravel',
    topic: 'Service Container & Dependency Injection',
    difficulty: 'hard',
    type: 'multiple-choice',
    questionText: 'In Laravel 11, what is the difference between `$this->app->bind()` and `$this->app->singleton()` in a Service Provider?',
    questionTextAr: 'في Laravel 11، ما الفرق بين `$this->app->bind()` و `$this->app->singleton()` في مزود الخدمة (Service Provider)؟',
    questionTextIt: 'In Laravel 11, qual è la differenza tra `$this->app->bind()` e `$this->app->singleton()` in un Service Provider?',
    options: [
      'bind() creates a new instance every time it is resolved, while singleton() resolves the same single instance across the request.',
      'bind() is used for interfaces, while singleton() can only be used for concrete classes.',
      'singleton() creates a new database connection per query, while bind() caches it.',
      'There is no functional difference; singleton() is an alias of bind().'
    ],
    optionsAr: [
      'تنشئ bind() نسخة جديدة في كل مرة يتم حل الخدمة فيها، بينما تقوم singleton() بإرجاع نفس النسخة طوال مدة الطلب.',
      'تُستخدم bind() للواجهات فقط، بينما تُستخدم singleton() للفئات الملموسة.',
      'تنشئ singleton() اتصال قاعدة بيانات جديد لكل استعلام.',
      'لا يوجد فرق وظيفي؛ singleton() مجرد اسم مستعار لـ bind().'
    ],
    optionsIt: [
      'bind() crea una nuova istanza ogni volta che viene risolto, mentre singleton() risolve la stessa singola istanza durante la richiesta.',
      'bind() viene usato solo per le interfacce, mentre singleton() solo per classi concrete.',
      'singleton() crea una nuova connessione al database per query.',
      'Non c\'è alcuna differenza funzionale; singleton() è un alias di bind().'
    ],
    correctAnswer: [0],
    explanation: '`bind()` executes the resolver closure every time the service is requested from the container. `singleton()` executes the closure once and reuses that instance for subsequent resolutions in the request lifecycle.',
    explanationAr: 'تنفذ `bind()` دالة الحل في كل مرة تطلب فيها الخدمة، بينما تنفذها `singleton()` مرة واحدة فقط وتشارك نفس النسخة عبر طلب التصفح.',
    explanationIt: '`bind()` esegue la closure ogni volta che il servizio viene richiesto. `singleton()` esegue la closure una sola volta e riutilizza l\'istanza.',
    hint: 'Consider object lifecycle persistence in container binding.',
    hintAr: 'فكر في دورة حياة كائن الخدمة داخل حاوية الخدمات.'
  },
  {
    id: 'backend-laravel-003',
    category: 'laravel',
    topic: 'Middleware & HTTP Pipeline',
    difficulty: 'medium',
    type: 'multiple-choice',
    questionText: 'Where do you register route middleware or global middleware pipelines in Laravel 11 (`bootstrap/app.php`)?',
    questionTextAr: 'أين تقوم بتسجيل وسائط المسارات (Route Middleware) أو الوسائط العامة في Laravel 11 داخل ملف `bootstrap/app.php`؟',
    questionTextIt: 'Dove registri i middleware delle rotte o i middleware globali in Laravel 11 (`bootstrap/app.php`)?',
    codeSnippet: `return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(web: __DIR__.\'/../routes/web.php\')
    ->withMiddleware(function (Middleware $middleware) {
        $middleware->???([
            EnsureTokenIsValid::class,
        ]);
    })->create();`,
    options: [
      '$middleware->append() or $middleware->alias()',
      '$middleware->registerGlobal()',
      '$middleware->addRoute()',
      '$middleware->inject()'
    ],
    optionsAr: [
      '$middleware->append() أو $middleware->alias()',
      '$middleware->registerGlobal()',
      '$middleware->addRoute()',
      '$middleware->inject()'
    ],
    optionsIt: [
      '$middleware->append() o $middleware->alias()',
      '$middleware->registerGlobal()',
      '$middleware->addRoute()',
      '$middleware->inject()'
    ],
    correctAnswer: [0],
    explanation: 'In Laravel 11, middleware configuration is streamlined in `bootstrap/app.php` using `$middleware->append()`, `$middleware->prepend()`, or `$middleware->alias()`.',
    explanationAr: 'في Laravel 11، يتم إعداد الوسائط بشكل مبسط داخل `bootstrap/app.php` باستخدام طرق `$middleware->append()` أو `$middleware->alias()`.',
    explanationIt: 'In Laravel 11, la configurazione dei middleware avviene in `bootstrap/app.php` tramite `$middleware->append()`, `$middleware->prepend()` o `$middleware->alias()`.',
    hint: 'Laravel 11 replaced Kernel.php with fluent methods on the Middleware instance.',
    hintAr: 'استبدلت لارفيل 11 ملف Kernel.php بطرق سلسة على كائن Middleware.'
  },

  // MYSQL QUESTIONS
  {
    id: 'backend-mysql-001',
    category: 'mysql',
    topic: 'SQL JOINs & Query Optimization',
    difficulty: 'medium',
    type: 'multiple-choice',
    questionText: 'Which SQL JOIN type returns all records from the left table, and matching records from the right table (filling NULL if no match)?',
    questionTextAr: 'ما هو نوع الربط (JOIN) في SQL الذي يعيد جميع السجلات من الجدول الأيسر والسجلات المطابقة من الجدول الأيمن (مع ملء NULL عند عدم المطابقة)؟',
    questionTextIt: 'Quale tipo di JOIN SQL restituisce tutti i record dalla tabella di sinistra e i record corrispondenti dalla tabella di destra?',
    options: [
      'LEFT JOIN (or LEFT OUTER JOIN)',
      'INNER JOIN',
      'RIGHT JOIN',
      'FULL OUTER JOIN'
    ],
    optionsAr: [
      'LEFT JOIN (أو LEFT OUTER JOIN)',
      'INNER JOIN',
      'RIGHT JOIN',
      'FULL OUTER JOIN'
    ],
    optionsIt: [
      'LEFT JOIN (o LEFT OUTER JOIN)',
      'INNER JOIN',
      'RIGHT JOIN',
      'FULL OUTER JOIN'
    ],
    correctAnswer: [0],
    explanation: 'A `LEFT JOIN` retrieves all rows from the left table regardless of whether a matching row exists in the right table. Non-matching columns from the right table are populated with NULL values.',
    explanationAr: 'يعيد `LEFT JOIN` كافة الصفوف من الجدول الأيسر بغض النظر عن وجود تطابق في الجدول الأيمن، ويضع القيمة NULL للقيم غير المطابقة.',
    explanationIt: 'Il `LEFT JOIN` recupera tutte le righe dalla tabella di sinistra, indipendentemente dalla presenza di corrispondenze nella tabella di destra.',
    hint: 'The left table remains complete and untouched.',
    hintAr: 'الجدول الأيسر يبقى كاملاً دون حذف أي من صفوفه.'
  },
  {
    id: 'backend-mysql-002',
    category: 'mysql',
    topic: 'Indexing & Performance',
    difficulty: 'hard',
    type: 'multiple-choice',
    questionText: 'What data structure does MySQL InnoDB storage engine primarily use for table indexes to enable O(log N) lookup speeds?',
    questionTextAr: 'ما هي بنية البيانات التي يستخدمها محرك InnoDB في MySQL بشكل أساسي لفهارس الجداول لتحقيق سرعة البحث O(log N)؟',
    questionTextIt: 'Quale struttura dati utilizza principalmente il motore di archiviazione InnoDB di MySQL per gli indici delle tabelle?',
    options: [
      'B+ Tree (B-Tree variant)',
      'Hash Table',
      'Red-Black Binary Search Tree',
      'Linked List Array'
    ],
    optionsAr: [
      'شجرة B+ Tree (متغيرة من B-Tree)',
      'جدول التجزئة Hash Table',
      'شجرة البحث الثنائية الحمراء والصفراء Red-Black Tree',
      'المصفوفات المترابطة Linked List'
    ],
    optionsIt: [
      'Albero B+ (variante B-Tree)',
      'Tabella Hash',
      'Albero Binario Red-Black',
      'Array a Liste Collegate'
    ],
    correctAnswer: [0],
    explanation: 'InnoDB uses B+ Trees for primary (clustered) and secondary indexes. B+ Trees keep data sorted and allow efficient range scans, insertions, and lookups.',
    explanationAr: 'يستخدم InnoDB شجرة B+ Tree للفهارس الأساسية والفرعية، حيث تحافظ على ترتيب البيانات وتتيح استعلامات النطاق المباشرة بسرعة عالية.',
    explanationIt: 'InnoDB utilizza gli alberi B+ per gli indici primari e secondari, mantenendo i dati ordinati per scansionare rapidamente intervalli.',
    hint: 'It allows self-balancing multi-way tree search operations.',
    hintAr: 'تسمح بالبحث الشجري متزن الاتجاهات عبر الأقراص الصلبة.'
  },
  {
    id: 'backend-mysql-003',
    category: 'mysql',
    topic: 'ACID Transactions & Isolation',
    difficulty: 'expert',
    type: 'multiple-choice',
    questionText: 'In MySQL InnoDB transactions, what does the "I" in ACID stand for and what is the default isolation level in MySQL?',
    questionTextAr: 'في معاملات MySQL InnoDB، ماذا يعني حرف "I" في الاختصار ACID، وما هو مستوى العزل الافتراضي (Default Isolation Level)؟',
    questionTextIt: 'Nelle transazioni MySQL InnoDB, cosa significa la "I" in ACID e qual è il livello di isolamento predefinito?',
    options: [
      'Isolation; Default level is REPEATABLE READ.',
      'Integrity; Default level is READ COMMITTED.',
      'Indexation; Default level is SERIALIZABLE.',
      'Immutable; Default level is READ UNCOMMITTED.'
    ],
    optionsAr: [
      'Isolation (العزل)؛ ومستوى العزل الافتراضي هو REPEATABLE READ.',
      'Integrity (النزاهة)؛ ومستوى العزل الافتراضي هو READ COMMITTED.',
      'Indexation (الفهرسة)؛ ومستوى العزل الافتراضي هو SERIALIZABLE.',
      'Immutable (عدم التغيير)؛ ومستوى العزل الافتراضي هو READ UNCOMMITTED.'
    ],
    optionsIt: [
      'Isolamento; Il livello predefinito è REPEATABLE READ.',
      'Integrità; Il livello predefinito è READ COMMITTED.',
      'Indicizzazione; Il livello predefinito è SERIALIZABLE.',
      'Immutabile; Il livello predefinito è READ UNCOMMITTED.'
    ],
    correctAnswer: [0],
    explanation: 'ACID stands for Atomicity, Consistency, Isolation, and Durability. InnoDB\'s default isolation level is `REPEATABLE READ`, which uses Next-Key Locks to prevent phantom reads during queries.',
    explanationAr: 'ترمز ACID إلى الأفراد والاتساق والعزل والمتانة. مستوى العزل الافتراضي في InnoDB هو `REPEATABLE READ` الذي يمنع القراءات الوهمية أثناء المعاملات.',
    explanationIt: 'ACID sta per Atomicità, Coerenza, Isolamento e Durabilità. Il livello di isolamento predefinito in InnoDB è `REPEATABLE READ`.',
    hint: 'Repeatable read prevents non-repeatable reads during concurrent transactions.',
    hintAr: 'يمنع هذا المستوى التغييرات غير المتسقة في القراءات أثناء المعاملات المتزامنة.'
  },

  // PHP 8.X & SECURITY QUESTIONS
  {
    id: 'backend-php-001',
    category: 'php',
    topic: 'PHP 8.x Features',
    difficulty: 'medium',
    type: 'multiple-choice',
    questionText: 'Which PHP 8.0 feature allows declaring class properties directly inside the constructor signature?',
    questionTextAr: 'ما هي ميزة PHP 8.0 التي تسمح بإعلان خصائص الفئة مباشرة داخل توقيع البناء (Constructor)؟',
    questionTextIt: 'Quale funzionalità di PHP 8.0 consente di dichiarare le proprietà della classe direttamente nella firma del costruttore?',
    codeSnippet: `class User {
    public function __construct(
        public string $name,
        public string $email,
        private string $password
    ) {}
}`,
    options: [
      'Constructor Property Promotion',
      'Named Arguments',
      'Match Expressions',
      'Attributes Annotation'
    ],
    optionsAr: [
      'ترقية خصائص البناء Constructor Property Promotion',
      'الوسائط المسمات Named Arguments',
      'تعبيرات التطابق Match Expressions',
      'السمات المخصصة Attributes'
    ],
    optionsIt: [
      'Promozione delle Proprietà del Costruttore',
      'Argomenti Nominati',
      'Espressioni Match',
      'Annotazione degli Attributi'
    ],
    correctAnswer: [0],
    explanation: 'Constructor Property Promotion in PHP 8 simplifies boilerplate code by combining property declarations and assignments directly inside `__construct()`.',
    explanationAr: 'تختصر ميزة Constructor Property Promotion في PHP 8 الكود المكرر من خلال الجمع بين إعلان الخصائص وتعيينها داخل دالة `__construct()`.',
    explanationIt: 'La Promozione delle Proprietà del Costruttore in PHP 8 riduce il codice boilerplate combinando dichiarazione e assegnazione nel `__construct()`.',
    hint: 'It reduces typing public $var; $this->var = $var;',
    hintAr: 'تقلل من إعادة كتابة الإسناد اليدوي للخصائص.'
  },
  {
    id: 'backend-backend-001',
    category: 'backend',
    topic: 'REST API & Authentication',
    difficulty: 'medium',
    type: 'multiple-choice',
    questionText: 'What HTTP Status Code should a backend REST API return when a client request fails due to invalid JWT token authentication credentials?',
    questionTextAr: 'ما هو رمز حالة HTTP الذي يجب أن ترجعه واجهة برمجة التطبيقات (REST API) عندما يفشل طلب العميل بسبب توكن JWT غير صالح؟',
    questionTextIt: 'Quale codice di stato HTTP deve restituire un\'API REST backend quando una richiesta fallisce a causa di un token JWT non valido?',
    options: [
      '401 Unauthorized',
      '403 Forbidden',
      '400 Bad Request',
      '422 Unprocessable Entity'
    ],
    optionsAr: [
      '401 Unauthorized (غير مخول)',
      '403 Forbidden (محظور)',
      '400 Bad Request (طلب سيئ)',
      '422 Unprocessable Entity (كيان غير قابل للمعالجة)'
    ],
    optionsIt: [
      '401 Non autorizzato',
      '403 Proibito',
      '400 Richiesta errata',
      '422 Entità non elaborabile'
    ],
    correctAnswer: [0],
    explanation: 'HTTP `401 Unauthorized` indicates that the request lacks valid authentication credentials. HTTP `403 Forbidden` means the server understood the credentials but refuses authorization.',
    explanationAr: 'رمز `401 Unauthorized` يعني أن الطلب يفتقر إلى بيانات اعتماد أو توكن مصادقة صالحة. بينما 403 تعني أن الخادم فهم الهوية ولكنه يرفض الإذن.',
    explanationIt: 'HTTP `401 Unauthorized` indica che la richiesta manca di credenziali valide. `403 Forbidden` indica che le credenziali sono note ma l\'accesso è negato.',
    hint: '401 is for missing or invalid authentication token.',
    hintAr: 'استخدم 401 عند غياب أو بطلان التوكن.'
  }
];

export function getBackendQuestions(count = 10): Question[] {
  return INITIAL_BACKEND_QUESTIONS.slice(0, count);
}
