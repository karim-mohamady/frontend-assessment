/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Question, Difficulty, QuestionCategory, CareerTrack } from '../types';
import { CORE_QUESTIONS, generateProceduralQuestions } from './questions';
import { INITIAL_BACKEND_QUESTIONS } from './backendQuestions';

export interface RevisionItem {
  id: string;
  category: QuestionCategory;
  track: CareerTrack;
  topic: string;
  difficulty: Difficulty;
  type: string;
  questionTextEn: string;
  questionTextAr: string;
  optionsEn: string[];
  optionsAr: string[];
  correctAnswerTextEn: string;
  correctAnswerTextAr: string;
  explanationEn: string;
  explanationAr: string;
  codeSnippet?: string;
  practicalCodeExample: string;
  standardOrder: number; // Order index for standard pedagogical sequencing
}

// Category metadata with localization and icons
export const REVISION_CATEGORIES: {
  id: QuestionCategory;
  track: CareerTrack[];
  nameEn: string;
  nameAr: string;
  nameIt: string;
  icon: string;
  color: string;
}[] = [
  { id: 'html', track: ['frontend', 'uiux', 'fullstack'], nameEn: 'HTML5 & Semantics', nameAr: 'HTML5 والهياكل الدلالية', nameIt: 'HTML5 e Semantica', icon: '🌐', color: 'border-orange-500/40 text-orange-400 bg-orange-500/10' },
  { id: 'css', track: ['frontend', 'uiux', 'fullstack'], nameEn: 'CSS3, Flexbox & Grid', nameAr: 'CSS3 والتجاوب والشبكات', nameIt: 'CSS3, Flexbox e Grid', icon: '🎨', color: 'border-blue-500/40 text-blue-400 bg-blue-500/10' },
  { id: 'javascript', track: ['frontend', 'web3', 'fullstack'], nameEn: 'JavaScript ES6+ & Async', nameAr: 'جافا سكريبت والمزامنة وES6+', nameIt: 'JavaScript ES6+ e Async', icon: '⚡', color: 'border-amber-500/40 text-amber-400 bg-amber-500/10' },
  { id: 'react', track: ['frontend', 'web3', 'fullstack'], nameEn: 'React 19 & Architecture', nameAr: 'ريأكت والخطافات والبنية البرمجية', nameIt: 'React 19 e Architettura', icon: '⚛️', color: 'border-cyan-500/40 text-cyan-400 bg-cyan-500/10' },
  { id: 'bootstrap', track: ['frontend', 'fullstack'], nameEn: 'Bootstrap 5 Layouts', nameAr: 'بوتستراب 5 والتخطيط السريع', nameIt: 'Bootstrap 5 e Layout', icon: '🅱️', color: 'border-purple-500/40 text-purple-400 bg-purple-500/10' },
  { id: 'php', track: ['backend', 'fullstack'], nameEn: 'PHP 8.x & Security', nameAr: 'PHP 8.x والبرمجة الكائنية والأمان', nameIt: 'PHP 8.x e Sicurezza', icon: '🐘', color: 'border-indigo-500/40 text-indigo-400 bg-indigo-500/10' },
  { id: 'laravel', track: ['backend', 'fullstack'], nameEn: 'Laravel 11 & Eloquent', nameAr: 'لارافيل 11 وعلاقات Eloquent', nameIt: 'Laravel 11 e Eloquent', icon: '🔴', color: 'border-red-500/40 text-red-400 bg-red-500/10' },
  { id: 'mysql', track: ['backend', 'fullstack'], nameEn: 'MySQL & Database JOINs', nameAr: 'MySQL واستعلامات SQL والفهارس', nameIt: 'MySQL e Query SQL', icon: '🐬', color: 'border-teal-500/40 text-teal-400 bg-teal-500/10' },
  { id: 'backend', track: ['backend', 'fullstack'], nameEn: 'Backend APIs & Security', nameAr: 'هندسة الباك إند والـ APIs', nameIt: 'API Backend e Sicurezza', icon: '🖥️', color: 'border-pink-500/40 text-pink-400 bg-pink-500/10' },
  { id: 'uiux', track: ['uiux', 'fullstack'], nameEn: 'UI/UX Design Systems', nameAr: 'تصميم الواجهات وتجربة المستخدم', nameIt: 'Sistemi di Design UI/UX', icon: '✨', color: 'border-rose-500/40 text-rose-400 bg-rose-500/10' },
  { id: 'figma', track: ['uiux', 'fullstack'], nameEn: 'Figma Auto-Layout & Tokens', nameAr: 'أداة Figma والتخطيط التلقائي', nameIt: 'Figma Auto-Layout e Token', icon: '📐', color: 'border-fuchsia-500/40 text-fuchsia-400 bg-fuchsia-500/10' },
  { id: 'web3', track: ['web3', 'fullstack'], nameEn: 'Web3 & EVM Fundamentals', nameAr: 'أساسيات Web3 وتقنية البلوكشين', nameIt: 'Fondamenti Web3 e EVM', icon: '🪙', color: 'border-yellow-500/40 text-yellow-400 bg-yellow-500/10' },
  { id: 'solidity', track: ['web3', 'fullstack'], nameEn: 'Solidity & Smart Contracts', nameAr: 'لغة Solidity وأمان العقود الذكية', nameIt: 'Solidity e Smart Contract', icon: '📜', color: 'border-emerald-500/40 text-emerald-400 bg-emerald-500/10' },
  { id: 'english', track: ['frontend', 'backend', 'uiux', 'web3', 'fullstack'], nameEn: 'Technical English for Devs', nameAr: 'اللغة الإنجليزية التقنية للمطورين', nameIt: 'Inglese Tecnico per Sviluppatori', icon: '📖', color: 'border-slate-500/40 text-slate-300 bg-slate-500/10' }
];

// Topic ordering dictionary for standard pedagogical sequence (Fundamentals -> Intermediate -> Advanced -> Architecture)
const PEDAGOGICAL_ORDER: Record<string, number> = {
  'Semantic HTML': 10,
  'Forms & Inputs': 20,
  'ARIA & Accessibility': 30,
  'Accessibility': 35,
  'SEO & Meta Tags': 40,
  'HTML5 Canvas': 50,
  'Error Detection & Best Practices': 60,

  'Specificity': 10,
  'Box Model': 20,
  'Flexbox': 30,
  'Flexbox Layout': 35,
  'CSS Grid': 40,
  'Grid Layout': 45,
  'Responsive Design': 50,
  'Animations & Transitions': 60,

  'Variables & Types': 10,
  'Closures & Scope': 20,
  'Functions & Closures': 25,
  'Promises & Async/Await': 30,
  'Event Loop & Microtasks': 40,
  'Array Methods': 50,
  'Prototypes & OOP': 60,

  'JSX & Components': 10,
  'State & useEffect Closures': 20,
  'Hooks Rules': 30,
  'Performance Optimization': 40,
  'React Router': 50,
  'Context API': 60,
  'React 19 & Concurrent Mode': 70,

  'PHP 8.x Features': 10,
  'PHP 8.x Syntax & Types': 15,
  'OOP & Classes': 20,
  'PDO & Security': 30,
  'Namespaces & Autoloading': 40,

  'Eloquent ORM': 10,
  'Eloquent ORM & Relationships': 15,
  'Service Container': 20,
  'Service Container & Dependency Injection': 25,
  'Middleware & HTTP Pipeline': 30,

  'SQL JOINs': 10,
  'SQL Queries & SELECT': 15,
  'Indexes & B-Trees': 20,
  'ACID Transactions & Locks': 30,

  'REST & HTTP Status Codes': 10,
  'Security & CORS': 20,
  'JWT & OAuth Authentication': 30,

  'Visual Hierarchy': 10,
  'Color Theory & Contrast': 20,
  'WCAG Accessibility (a11y)': 30,

  'Figma Auto-Layout 5.0': 10,
  'Component Variants & Properties': 20,

  'Blockchain Fundamentals': 10,
  'EVM Architecture': 20,
  'Gas Fees & Network Congestion': 30,

  'Solidity Syntax & Data Types': 10,
  'Smart Contract Security': 20,
  'Reentrancy Guard': 30
};

// Practical code example mapping per topic
const CODE_EXAMPLES: Record<string, string> = {
  'Semantic HTML': `<header>\n  <nav aria-label="Main Navigation">\n    <ul>\n      <li><a href="/">Home</a></li>\n      <li><a href="/about">About</a></li>\n    </ul>\n  </nav>\n</header>\n<main>\n  <article>\n    <h1>Semantic Accessibility</h1>\n    <p>Using semantic elements like <nav> and <article> ensures screen readers understand layout structure.</p>\n  </article>\n</main>`,

  'ARIA & Accessibility': `<!-- Accessibility Best Practices -->\n<button \n  aria-expanded="false" \n  aria-controls="dropdown-menu" \n  aria-haspopup="true"\n  onclick="toggleMenu()"\n>\n  Menu Options\n</button>\n<div id="dropdown-menu" role="menu" aria-hidden="true">\n  <a role="menuitem" href="/profile">Profile</a>\n</div>`,

  'Forms & Inputs': `<form action="/submit" method="POST">\n  <label for="user-email">Email Address:</label>\n  <input \n    type="email" \n    id="user-email" \n    name="email" \n    required \n    placeholder="dev@example.com"\n  />\n  <button type="submit">Submit</button>\n</form>`,

  'Specificity': `/* CSS Specificity Rule Demo */\n/* Weight: (0, 0, 1) */\ndiv { color: gray; }\n\n/* Weight: (0, 1, 0) */\n.text-card { color: red; }\n\n/* Weight: (1, 0, 0) */\n#main-text { color: green; }\n\n/* Weight: (1, 1, 1) -> WINS */\ndiv#main-text.text-card { color: orange; }`,

  'Flexbox': `/* Flexbox Layout Utilities */\n.flex-container {\n  display: flex;\n  justify-content: space-between; /* Space items evenly */\n  align-items: center; /* Vertical centering */\n  gap: 1.5rem;\n  flex-wrap: wrap;\n}`,

  'CSS Grid': `/* Fluid Responsive Grid Without Media Queries */\n.grid-container {\n  display: grid;\n  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));\n  gap: 1.5rem;\n}`,

  'Event Loop & Microtasks': `console.log("1: Synchronous");\n\nsetTimeout(() => {\n  console.log("2: Macrotask");\n}, 0);\n\nPromise.resolve().then(() => {\n  console.log("3: Microtask");\n});\n\nconsole.log("4: Synchronous");\n\n// Output Order: 1, 4, 3, 2`,

  'Closures & Scope': `function createCounter() {\n  let count = 0; // Private lexical state\n  return {\n    increment: () => ++count,\n    getCount: () => count\n  };\n}\n\nconst counter1 = createCounter();\nconsole.log(counter1.increment()); // 1\nconsole.log(counter1.increment()); // 2`,

  'Promises & Async/Await': `async function fetchUserData(userId) {\n  try {\n    const response = await fetch(\`/api/users/\${userId}\`);\n    if (!response.ok) throw new Error("HTTP error " + response.status);\n    const data = await response.json();\n    return data;\n  } catch (err) {\n    console.error("Fetch failed:", err.message);\n  }\n}`,

  'State & useEffect Closures': `function Counter() {\n  const [count, setCount] = useState(0);\n\n  const handleAsyncAlert = () => {\n    // Captures snapshot of 'count' at the time of click\n    setTimeout(() => {\n      alert("Clicked state was: " + count);\n    }, 2000);\n  };\n\n  return <button onClick={handleAsyncAlert}>Alert Count</button>;\n}`,

  'Performance Optimization': `import React, { memo, useCallback, useState } from 'react';\n\n// Child component memoized to avoid re-renders\nconst ChildButton = memo(({ onClick, label }) => {\n  console.log('Child Rendered');\n  return <button onClick={onClick}>{label}</button>;\n});\n\nfunction Parent() {\n  const [count, setCount] = useState(0);\n  const handleClick = useCallback(() => {\n    console.log('Clicked');\n  }, []); // Stable function reference\n\n  return <ChildButton onClick={handleClick} label="Action" />;\n}`,

  'PHP 8.x Features': `<?php\n// PHP 8.0 Constructor Property Promotion & Named Arguments\nclass User {\n    public function __construct(\n        public string $name,\n        public string $email,\n        public string $role = 'developer'\n    ) {}\n}\n\n$user = new User(email: 'dev@test.com', name: 'Karim');`,

  'PDO & Security': `<?php\n// Secure SQL Injection Protection via Prepared Statements\n$stmt = $pdo->prepare('SELECT id, name, email FROM users WHERE email = :email AND status = :status');\n$stmt->execute([\n    'email' => $userEmail,\n    'status' => 'active'\n]);\n$user = $stmt->fetch(PDO::FETCH_ASSOC);`,

  'Eloquent ORM': `<?php\n// Laravel Eloquent Relationship & Eager Loading (Prevents N+1)\nnamespace App\\Http\\Controllers;\nuse App\\Models\\Post;\n\nclass PostController extends Controller {\n    public function index() {\n        $posts = Post::with(['user', 'comments'])->where('status', 'published')->paginate(10);\n        return view('posts.index', compact('posts'));\n    }\n}`,

  'Service Container': `<?php\n// Laravel Service Provider Singleton Registration\nnamespace App\\Providers;\nuse Illuminate\\Support\\ServiceProvider;\nuse App\\Services\\PaymentGateway;\n\nclass AppServiceProvider extends ServiceProvider {\n    public function register(): void {\n        $this->app->singleton(PaymentGateway::class, function ($app) {\n            return new PaymentGateway(config('services.stripe.secret'));\n        });\n    }\n}`,

  'SQL JOINs': `-- Left Join Querying All Users and Their Orders\nSELECT \n  u.id AS user_id,\n  u.name,\n  COALESCE(o.order_total, 0) AS order_total\nFROM users u\nLEFT JOIN orders o ON u.id = o.user_id\nWHERE u.status = 'active'\nORDER BY order_total DESC;`,

  'REST & HTTP Status Codes': `// Express RESTful API Controller Endpoint\napp.post('/api/v1/posts', authenticateToken, async (req, res) => {\n  const { title, content } = req.body;\n  const post = await Post.create({\n    title,\n    content,\n    authorId: req.user.id\n  });\n  return res.status(201).json({ success: true, data: post });\n});`,

  'WCAG Accessibility (a11y)': `/* High Contrast Accessible Color Pairings */\n.accessible-card {\n  background-color: #0f172a; /* Slate 900 */\n  color: #f8fafc; /* Slate 50 */\n  /* WCAG 2.2 AA Contrast Ratio > 7:1 */\n}\n\n.focus-ring:focus-visible {\n  outline: 2px solid #f59e0b;\n  outline-offset: 2px;\n}`,

  'Figma Auto-Layout 5.0': `// Design System JSON Token Spec\n{\n  "color": {\n    "primary": { "value": "#f59e0b" },\n    "background": { "value": "#020617" }\n  },\n  "spacing": {\n    "padding-container": { "value": "24px" },\n    "gap-items": { "value": "12px" }\n  }\n}`,

  'Reentrancy Guard': `// SPDX-License-Identifier: MIT\npragma solidity ^0.8.20;\n\nimport "@openzeppelin/contracts/utils/ReentrancyGuard.sol";\n\ncontract SecureVault is ReentrancyGuard {\n    mapping(address => uint256) public balances;\n\n    function withdraw(uint256 _amount) external nonReentrant {\n        require(balances[msg.sender] >= _amount, "Insufficient balance");\n        balances[msg.sender] -= _amount;\n        (bool success, ) = payable(msg.sender).call{value: _amount}("");\n        require(success, "ETH transfer failed");\n    }\n}`
};

// Converts raw questions into fully formed RevisionItems
export function getAllRevisionItems(): RevisionItem[] {
  const allRawQuestions: Question[] = [
    ...CORE_QUESTIONS,
    ...INITIAL_BACKEND_QUESTIONS
  ];

  // Supplement with categories generated from procedural bank
  const categoriesList: QuestionCategory[] = [
    'html', 'css', 'javascript', 'react', 'bootstrap',
    'php', 'laravel', 'mysql', 'backend', 'english',
    'uiux', 'figma', 'web3', 'solidity'
  ];

  categoriesList.forEach((cat) => {
    const existingCount = allRawQuestions.filter(q => q.category === cat).length;
    if (existingCount < 6) {
      const generated = generateProceduralQuestions(cat, 6 - existingCount);
      allRawQuestions.push(...generated);
    }
  });

  const difficultyWeights: Record<Difficulty, number> = {
    easy: 1,
    medium: 2,
    hard: 3,
    expert: 4
  };

  return allRawQuestions.map((q, idx) => {
    // Determine primary track
    let track: CareerTrack = 'frontend';
    if (['php', 'laravel', 'mysql', 'backend'].includes(q.category)) {
      track = 'backend';
    } else if (['uiux', 'figma'].includes(q.category)) {
      track = 'uiux';
    } else if (['web3', 'solidity'].includes(q.category)) {
      track = 'web3';
    }

    // Determine correct answer text
    let correctAnswerTextEn = '';
    let correctAnswerTextAr = '';

    if (Array.isArray(q.correctAnswer) && q.options) {
      const correctIndices = q.correctAnswer;
      correctAnswerTextEn = correctIndices.map(i => q.options?.[i] || '').join(', ');
      correctAnswerTextAr = correctIndices.map(i => q.optionsAr?.[i] || q.options?.[i] || '').join(', ');
    } else if (typeof q.correctAnswer === 'string') {
      correctAnswerTextEn = q.correctAnswer;
      correctAnswerTextAr = q.correctAnswer;
    }

    // Code example lookup
    const defaultExample = q.codeSnippet || CODE_EXAMPLES[q.topic] || CODE_EXAMPLES[q.category] || `// Practical Example for ${q.topic}\n// Topic: ${q.topic}\n// Difficulty: ${q.difficulty}`;

    const topicSeq = PEDAGOGICAL_ORDER[q.topic] || 50;
    const diffSeq = difficultyWeights[q.difficulty] || 2;
    const standardOrder = topicSeq * 10 + diffSeq;

    return {
      id: q.id,
      category: q.category,
      track,
      topic: q.topic,
      difficulty: q.difficulty,
      type: q.type,
      questionTextEn: q.questionText,
      questionTextAr: q.questionTextAr || q.questionText,
      optionsEn: q.options || [],
      optionsAr: q.optionsAr || q.options || [],
      correctAnswerTextEn,
      correctAnswerTextAr,
      explanationEn: q.explanation || 'See topic documentation.',
      explanationAr: q.explanationAr || q.explanation || 'راجع توثيق الموضوع للتعمق.',
      codeSnippet: q.codeSnippet,
      practicalCodeExample: defaultExample,
      standardOrder
    };
  }).sort((a, b) => a.standardOrder - b.standardOrder);
}
