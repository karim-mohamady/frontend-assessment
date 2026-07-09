/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Question, Difficulty, QuestionType } from '../types';

// Core High-Fidelity Benchmark Questions (6 per category, 36 total, covering all types)
export const CORE_QUESTIONS: Question[] = [
  // --- HTML ---
  {
    id: 'html-1',
    category: 'html',
    topic: 'Semantic HTML',
    difficulty: 'medium',
    type: 'multiple-choice',
    questionText: 'Which of the following semantic structures is the most accessible choice for wrapping a main site navigation block?',
    questionTextAr: 'أي من الهياكل الدلالية التالية هو الخيار الأكثر سهولة في الاستخدام لتغليف كتلة التنقل الرئيسية للموقع؟',
    options: [
      '<div id="main-nav">',
      '<section class="nav">',
      '<nav>',
      '<menu role="navigation">'
    ],
    optionsAr: [
      '<div id="main-nav">',
      '<section class="nav">',
      '<nav>',
      '<menu role="navigation">'
    ],
    correctAnswer: [2],
    explanation: 'The <nav> element is an HTML5 sectioning element designed specifically for primary navigation. Assisted technologies (screen readers) can identify and jump straight to <nav> areas.',
    explanationAr: 'عنصر <nav> هو عنصر هيكلي في HTML5 مصمم خصيصاً للتنقل الرئيسي. يمكن للتقنيات المساعدة (قارئات الشاشة) تحديد مناطق <nav> والانتقال إليها مباشرة.'
  },
  {
    id: 'html-2',
    category: 'html',
    topic: 'ARIA & Accessibility',
    difficulty: 'hard',
    type: 'match-columns',
    questionText: 'Match the ARIA attribute to its correct functional purpose.',
    questionTextAr: 'طابق سمة ARIA بالغرض الوظيفي الصحيح لها.',
    matchLeft: [
      'aria-live="polite"',
      'aria-expanded="true"',
      'aria-haspopup="listbox"',
      'aria-controls="dialog-id"'
    ],
    matchLeftAr: [
      'aria-live="polite"',
      'aria-expanded="true"',
      'aria-haspopup="listbox"',
      'aria-controls="dialog-id"'
    ],
    matchRight: [
      'Announces dynamic content updates gently to screen readers without interrupting.',
      'Indicates that an accordion or dropdown menu is currently open and visible.',
      'Signals that activating this button opens a selection menu or dropdown list.',
      'Identifies the specific collapsible element or popup container controlled by this trigger.'
    ],
    matchRightAr: [
      'تعلن عن تحديثات المحتوى الديناميكي بلطف لقارئات الشاشة دون مقاطعة.',
      'تشير إلى أن القائمة المنسدلة أو الأكورديون مفتوح ومرئي حالياً.',
      'تشير إلى أن تفعيل هذا الزر يفتح قائمة اختيار أو قائمة منسدلة.',
      'تحدد العنصر القابل للطي المحدد أو الحاوية المنبثقة التي يتم التحكم فيها بواسطة هذا المشغل.'
    ],
    correctAnswer: [0, 1, 2, 3], // Corresponds indices in matchRight
    explanation: 'aria-live="polite" reads changes asynchronously. aria-expanded tells state. aria-haspopup denotes child menu type. aria-controls links a trigger to target element.',
    explanationAr: 'aria-live="polite" يقرأ التغييرات بشكل غير متزامن. aria-expanded يعلم الحالة. aria-haspopup يدل على نوع قائمة الابن. aria-controls يربط المشغل بالعنصر المستهدف.'
  },
  {
    id: 'html-3',
    category: 'html',
    topic: 'Forms & Inputs',
    difficulty: 'easy',
    type: 'true-false',
    questionText: 'Setting the type attribute of an <input> element to "email" provides automatic client-side format validation in modern browsers without needing custom JavaScript.',
    questionTextAr: 'إن تعيين سمة النوع لعنصر <input> إلى "email" يوفر تحليلاً تلقائياً للتنسيق في المتصفحات الحديثة دون الحاجة إلى جافا سكريبت مخصصة.',
    options: ['True / صحيح', 'False / خطأ'],
    optionsAr: ['True / صحيح', 'False / خطأ'],
    correctAnswer: [0],
    explanation: 'Modern browsers validate input type="email" automatically when inside a <form> upon submission, prompting the user if it lacks an "@" symbol or domain.',
    explanationAr: 'تتحقق المتصفحات الحديثة من إدخال type="email" تلقائياً عندما يكون داخل <form> عند الإرسال، مما ينبه المستخدم إذا كان يفتقر إلى رمز "@" أو اسم النطاق.'
  },
  {
    id: 'html-4',
    category: 'html',
    topic: 'SEO & Meta Tags',
    difficulty: 'expert',
    type: 'code-output',
    questionText: 'What is the correct tag setup to prevent search engines from indexing a page while still allowing them to follow external outbound links?',
    questionTextAr: 'ما هو الإعداد الصحيح لعلامة التعريف (meta tag) لمنع محركات البحث من فهرسة الصفحة مع السماح لها بمتابعة الروابط الخارجية الخارجة؟',
    codeSnippet: `<meta name="robots" content="______" />`,
    options: [
      'noindex, nofollow',
      'index, nofollow',
      'noindex, follow',
      'none'
    ],
    optionsAr: [
      'noindex, nofollow',
      'index, nofollow',
      'noindex, follow',
      'none'
    ],
    correctAnswer: [2],
    explanation: 'The value "noindex" tells search crawlers not to index this page, and "follow" permits them to crawl links on this page to index other linked resources.',
    explanationAr: 'تخبر القيمة "noindex" برامج زحف البحث بعدم فهرسة هذه الصفحة، وتسمح لهم "follow" بالزحف إلى الروابط الموجودة في هذه الصفحة لفهرسة الموارد الأخرى المرتبطة.'
  },
  {
    id: 'html-5',
    category: 'html',
    topic: 'HTML5 Canvas',
    difficulty: 'medium',
    type: 'fill-in-blank',
    questionText: 'To draw a 2D context on an HTML5 canvas, you first select the canvas element and execute the method: canvasElement.________("2d").',
    questionTextAr: 'لرسم سياق ثنائي الأبعاد على قماش HTML5 (canvas)، يجب أولاً تحديد عنصر القماش وتطبيق الدالة: canvasElement.________("2d").',
    correctAnswer: 'getContext',
    explanation: 'The getContext() method returns a drawing context on the canvas, or null if the context identifier is not supported.',
    explanationAr: 'تقوم الدالة getContext() بإرجاع سياق رسم على القماش، أو null إذا كان معرف السياق غير مدعوم.'
  },
  {
    id: 'html-6',
    category: 'html',
    topic: 'Error Detection & Best Practices',
    difficulty: 'hard',
    type: 'bug-fixing',
    questionText: 'Locate the semantic and standard error in this markup structure:',
    questionTextAr: 'حدد الخطأ الدلالي والقياسي في هيكل الترميز هذا:',
    codeSnippet: `<ul>
  <div>
    <li>List item 1</li>
    <li>List item 2</li>
  </div>
</ul>`,
    options: [
      'The ul element cannot contain div as a direct child. Only li tags are allowed.',
      'The list items lack unique id attributes.',
      'Lists must always use ol instead of ul for semantic grouping.',
      'The div tag should have class="list-item-wrapper".'
    ],
    optionsAr: [
      'لا يمكن لعنصر ul أن يحتوي على div كابن مباشر. يُسمح فقط بعلامات li.',
      'تفتقر عناصر القائمة إلى سمات id فريدة.',
      'يجب أن تستخدم القوائم دائماً ol بدلاً من ul للتجميع الدلالي.',
      'يجب أن تحتوي علامة div على class="list-item-wrapper".'
    ],
    correctAnswer: [0],
    explanation: 'Under W3C standards, a <ul> or <ol> element may only contain <li> elements, <script>, or <template> as its direct children. Placing a <div> directly inside <ul> violates standard HTML specs.',
    explanationAr: 'بموجب معايير W3C، يمكن لعنصر <ul> أو <ol> أن يحتوي فقط على عناصر <li> أو <script> أو <template> كأبناء مباشرين له. وضع <div> مباشرة داخل <ul> ينتهك مواصفات HTML القياسية.'
  },

  // --- CSS ---
  {
    id: 'css-1',
    category: 'css',
    topic: 'Specificity',
    difficulty: 'hard',
    type: 'code-output',
    questionText: 'Given the CSS below, what will be the color of the text inside <div class="text-card" id="main-text">Hello</div>?',
    questionTextAr: 'بالنظر إلى تنسيقات CSS أدناه، ما لون النص داخل <div class="text-card" id="main-text">Hello</div>؟',
    codeSnippet: `div.text-card { color: blue; }
#main-text { color: green; }
div#main-text.text-card { color: orange; }
.text-card { color: red; }`,
    options: ['blue / أزرق', 'green / أخضر', 'orange / برتقالي', 'red / أحمر'],
    optionsAr: ['blue / أزرق', 'green / أخضر', 'orange / برتقالي', 'red / أحمر'],
    correctAnswer: [2],
    explanation: 'Specificity is calculated as (ID, Class/Attribute/Pseudo-class, Element). "div#main-text.text-card" has a specificity of (1, 1, 1), whereas "#main-text" has (1, 0, 0), "div.text-card" has (0, 1, 1), and ".text-card" has (0, 1, 0). (1,1,1) wins.',
    explanationAr: 'يتم حساب الخصوصية كـ (ID, Class, Element). التحديد "div#main-text.text-card" له خصوصية (1, 1, 1)، بينما "#main-text" لديه (1, 0, 0)، "div.text-card" لديه (0, 1, 1)، و ".text-card" لديه (0, 1, 0). يفوز (1,1,1).'
  },
  {
    id: 'css-2',
    category: 'css',
    topic: 'Flexbox',
    difficulty: 'medium',
    type: 'multiple-choice',
    questionText: 'Which CSS property-value pair distributes space evenly such that the first and last child elements are flush against the edges of the parent container?',
    questionTextAr: 'أي من خصائص CSS التالية توزع المساحة بالتساوي بحيث تكون عناصر الابن الأولى والأخيرة ملاصقة تماماً لحواف الحاوية الأب؟',
    options: [
      'justify-content: space-around',
      'justify-content: space-between',
      'justify-content: space-evenly',
      'align-items: stretch'
    ],
    optionsAr: [
      'justify-content: space-around',
      'justify-content: space-between',
      'justify-content: space-evenly',
      'align-items: stretch'
    ],
    correctAnswer: [1],
    explanation: 'justify-content: space-between allocates all remaining white space evenly between the children, keeping the first item on the start edge and the last item on the end edge.',
    explanationAr: 'يقوم justify-content: space-between بتخصيص كل المساحة البيضاء المتبقية بالتساوي بين الأبناء، مع إبقاء العنصر الأول في الحافة البادئة والعنصر الأخير في الحافة النهائية.'
  },
  {
    id: 'css-3',
    category: 'css',
    topic: 'CSS Grid',
    difficulty: 'expert',
    type: 'fill-in-blank',
    questionText: 'To create a grid layout with three columns where the sidebars take exactly 200px each and the middle column fills the remaining flexible space, use: grid-template-columns: 200px ________ 200px;',
    questionTextAr: 'لإنشاء تخطيط شبكي (grid) بثلاثة أعمدة حيث تأخذ الأشرطة الجانبية 200 بكسل لكل منها والعمود الأوسط يملأ المساحة المرنة المتبقية، استخدم: grid-template-columns: 200px ________ 200px;',
    correctAnswer: '1fr',
    explanation: 'The fr unit represents a fraction of the free space in the grid container. "1fr" allocates all leftover space to the center column.',
    explanationAr: 'تمثل وحدة fr كسرًا من المساحة الحرة في حاوية الشبكة. "1fr" يخصص جميع المساحة المتبقية للعمود الأوسط.'
  },
  {
    id: 'css-4',
    category: 'css',
    topic: 'Transitions & Animations',
    difficulty: 'hard',
    type: 'match-columns',
    questionText: 'Match the CSS transition-timing-function value to its visual acceleration behavior.',
    questionTextAr: 'طابق قيمة وظيفة التوقيت الانتقالي لـ CSS بسلوك التسارع البصري الخاص بها.',
    matchLeft: [
      'linear',
      'ease-in',
      'ease-out',
      'cubic-bezier(0.68, -0.6, 0.32, 1.6)'
    ],
    matchLeftAr: [
      'linear',
      'ease-in',
      'ease-out',
      'cubic-bezier(0.68, -0.6, 0.32, 1.6)'
    ],
    matchRight: [
      'Uniform constant speed from start to finish.',
      'Starts slow, then accelerates towards the end.',
      'Starts fast, then decelerates gradually to a halt.',
      'Anticipatory pull-back at start, overshoot bouncy bounce at the end.'
    ],
    matchRightAr: [
      'سرعة ثابتة منتظمة من البداية إلى النهاية.',
      'يبدأ ببطء، ثم يتسارع نحو النهاية.',
      'يبدأ سريعاً، ثم يتباطأ تدريجياً حتى يتوقف.',
      'سحب ترقبي للخلف عند البدء، مع تجاوز ارتدادي عند النهاية.'
    ],
    correctAnswer: [0, 1, 2, 3],
    explanation: 'Linear preserves speed. Ease-in starts slow. Ease-out decelerates. Custom cubic-bezier creates custom bounce dynamics.',
    explanationAr: 'يحافظ linear على السرعة. يبدأ ease-in ببطء. يتباطأ ease-out. ينشئ cubic-bezier المخصص ديناميكيات ارتداد مخصصة.'
  },
  {
    id: 'css-5',
    category: 'css',
    topic: 'Box Model',
    difficulty: 'easy',
    type: 'true-false',
    questionText: 'Using box-sizing: border-box means that padding and border calculations are included within the element\'s declared width and height, rather than added on top of them.',
    questionTextAr: 'استخدام box-sizing: border-box يعني أنه يتم تضمين حسابات الحشو (padding) والحدود (border) ضمن العرض والارتفاع المعلنين للعنصر، بدلاً من إضافتهما فوقهما.',
    options: ['True / صحيح', 'False / خطأ'],
    optionsAr: ['True / صحيح', 'False / خطأ'],
    correctAnswer: [0],
    explanation: 'By default, the box-sizing is content-box, which appends borders and paddings outside the set width. border-box absorbs them inside, which facilitates pixel-perfect responsive designs.',
    explanationAr: 'افتراضياً، يكون نموذج الحجم content-box، والذي يلحق الحدود والحشو خارج العرض المحدد. بينما يقوم border-box بامتصاصها بالداخل، مما يسهل تصميمات متجاوبة بكسل بكسل.'
  },
  {
    id: 'css-6',
    category: 'css',
    topic: 'CSS Variables',
    difficulty: 'medium',
    type: 'code-output',
    questionText: 'What is the correct syntax to reference a declared CSS custom property named "--accent-color" with a fallback value of "navy"?',
    questionTextAr: 'ما هي الصيغة الصحيحة للإشارة إلى خاصية CSS مخصصة تم الإعلان عنها باسم "--accent-color" بقيمة احتياطية هي "navy"؟',
    options: [
      'color: var(--accent-color, navy);',
      'color: val(--accent-color, "navy");',
      'color: $accent-color(navy);',
      'color: var(--accent-color: navy);'
    ],
    optionsAr: [
      'color: var(--accent-color, navy);',
      'color: val(--accent-color, "navy");',
      'color: $accent-color(navy);',
      'color: var(--accent-color: navy);'
    ],
    correctAnswer: [0],
    explanation: 'The CSS var() function takes the custom property name as the first argument, and an optional fallback value as the second argument if the variable has not been initialized.',
    explanationAr: 'تأخذ وظيفة var() في CSS اسم الخاصية المخصصة كمعامل أول، وقيمة احتياطية اختيارية كمعامل ثانٍ في حال لم يتم تهيئة المتغير.'
  },

  // --- JavaScript ---
  {
    id: 'js-1',
    category: 'javascript',
    topic: 'Event Loop & Execution Order',
    difficulty: 'hard',
    type: 'code-output',
    questionText: 'What is the correct console print order when executing this JavaScript code block?',
    questionTextAr: 'ما هو ترتيب الطباعة الصحيح لوحدة التحكم عند تشغيل كتلة كود جافا سكريبت التالية؟',
    codeSnippet: `console.log('1');
setTimeout(() => console.log('2'), 0);
Promise.resolve().then(() => console.log('3'));
console.log('4');`,
    options: [
      '1, 2, 3, 4',
      '1, 4, 2, 3',
      '1, 4, 3, 2',
      '1, 3, 4, 2'
    ],
    optionsAr: [
      '1, 2, 3, 4',
      '1, 4, 2, 3',
      '1, 4, 3, 2',
      '1, 3, 4, 2'
    ],
    correctAnswer: [2],
    explanation: 'Synchronous operations (1, 4) execute first. Microtasks (Promise.then) run immediately after current synchronous script, before Macrotasks (setTimeout callbacks). So "3" (microtask) precedes "2" (macrotask).',
    explanationAr: 'العمليات المتزامنة (1، 4) تنفذ أولاً. مهام Microtasks (مثل Promise.then) تعمل فوراً بعد البرنامج النصي المتزامن الحالي، وقبل مهام Macrotasks (مثل setTimeout). لذلك "3" تسبق "2".'
  },
  {
    id: 'js-2',
    category: 'javascript',
    topic: 'Closures & Scope',
    difficulty: 'medium',
    type: 'code-output',
    questionText: 'What is the output of executing the following function counter sequence?',
    questionTextAr: 'ما هي نتيجة تشغيل تسلسل وظيفة العداد التالية؟',
    codeSnippet: `function makeCounter() {
  let count = 0;
  return function() {
    return ++count;
  };
}
const c1 = makeCounter();
const c2 = makeCounter();
console.log(c1(), c1(), c2());`,
    options: [
      '1 2 3',
      '1 2 1',
      '1 1 1',
      'Undefined'
    ],
    optionsAr: [
      '1 2 3',
      '1 2 1',
      '1 1 1',
      'Undefined'
    ],
    correctAnswer: [1],
    explanation: 'Each call to makeCounter() creates a new independent lexical environment scope. c1 tracks its own count independently of c2. First c1() = 1, second c1() = 2, and c2() initializes its own separate variable count to yield 1.',
    explanationAr: 'كل استدعاء لـ makeCounter() ينشئ نطاق بيئة معجمية مستقل جديد. يتبع c1 عداده الخاص بشكل مستقل عن c2. أول c1() = 1، ثاني c1() = 2، و c2() يبدأ متغيره المنفصل ليخرج 1.'
  },
  {
    id: 'js-3',
    category: 'javascript',
    topic: 'Promises & Async/Await',
    difficulty: 'hard',
    type: 'multiple-choice',
    questionText: 'Which Promise utility method evaluates a list of Promises and settles as soon as ANY of the input promises settles (either fulfills or rejects), returning that single settled value/error?',
    questionTextAr: 'أي من طرق فحص الوعود (Promise utility) تقيم قائمة وعود وتنتهي بمجرد استقرار أي (ANY) من الوعود المدخلة (سواء بالنجاح أو الرفض)، وتُرجع تلك القيمة أو الخطأ المستقر؟',
    options: [
      'Promise.all()',
      'Promise.allSettled()',
      'Promise.race()',
      'Promise.any()'
    ],
    optionsAr: [
      'Promise.all()',
      'Promise.allSettled()',
      'Promise.race()',
      'Promise.any()'
    ],
    correctAnswer: [2],
    explanation: 'Promise.race() settles immediately upon the fulfillment or rejection of the very first promise that completes. Promise.any() ignores rejections and waits for the first successful fulfillment.',
    explanationAr: 'يستقر Promise.race() بمجرد تلبية أو رفض أول وعد يكتمل على الإطلاق. بينما يتجاهل Promise.any() حالات الرفض وينتظر أول تلبية ناجحة.'
  },
  {
    id: 'js-4',
    category: 'javascript',
    topic: 'Array Methods',
    difficulty: 'easy',
    type: 'fill-in-blank',
    questionText: 'What is the name of the ES6 array method that returns the value of the FIRST element in the array that satisfies the provided testing function? (Write the method name only without parentheses)',
    questionTextAr: 'ما اسم دالة مصفوفة ES6 التي ترجع قيمة أول (FIRST) عنصر في المصفوفة يستوفي شرط الاختبار المقدم؟ (اكتب اسم الدالة فقط دون أقواس)',
    correctAnswer: 'find',
    explanation: 'The find() method returns the value of the first element in the array that satisfies the provided testing function. Otherwise, undefined is returned.',
    explanationAr: 'دالة find() ترجع قيمة أول عنصر في المصفوفة يستوفي دالة الاختبار المحددة. وإلا، يتم إرجاع undefined.'
  },
  {
    id: 'js-5',
    category: 'javascript',
    topic: 'Prototypes & OOP',
    difficulty: 'expert',
    type: 'true-false',
    questionText: 'In ES6 classes, which are syntactical sugar over JavaScript\'s prototype-based inheritance, changing a property directly on a class\'s constructor prototype is immediately reflected across all instantiated instances of that class, even if created beforehand.',
    questionTextAr: 'في فئات ES6، والتي هي غلاف تسهيلي فوق الوراثة القائمة على النموذج الأولي (prototype) لجافا سكريبت، فإن تغيير خاصية مباشرة على النموذج الأولي لمنشئ الفئة ينعكس فوراً على جميع الكائنات المنشأة من تلك الفئة، حتى لو تم إنشاؤها مسبقاً.',
    options: ['True / صحيح', 'False / خطأ'],
    optionsAr: ['True / صحيح', 'False / خطأ'],
    correctAnswer: [0],
    explanation: 'Because instantiated instances hold active live references to the constructor\'s prototype chain, adding or modifying values on the parent constructor prototype affects existing and future objects instantly.',
    explanationAr: 'نظراً لأن الكائنات المنشأة تحتفظ بمراجع حية نشطة لسلسلة النموذج الأولي للمنشئ، فإن إضافة أو تعديل القيم على النموذج الأولي يؤثر على الكائنات الحالية والمستقبلية فوراً.'
  },
  {
    id: 'js-6',
    category: 'javascript',
    topic: 'Data Types & Equality',
    difficulty: 'easy',
    type: 'code-output',
    questionText: 'What are the outputs of console.log(typeof null) and console.log(1 == "1", 1 === "1")?',
    questionTextAr: 'ما هي مخرجات console.log(typeof null) و console.log(1 == "1", 1 === "1")؟',
    options: [
      '"null" and true, false',
      '"object" and true, false',
      '"object" and true, true',
      '"undefined" and false, false'
    ],
    optionsAr: [
      '"null" و true, false',
      '"object" و true, false',
      '"object" و true, true',
      '"undefined" و false, false'
    ],
    correctAnswer: [1],
    explanation: 'typeof null returns "object" due to an original legacy JS implementation quirk. Double equals (==) performs type coercion so 1 equals "1" is true, whereas triple equals (===) enforces strict type match so number versus string yields false.',
    explanationAr: 'typeof null يرجع "object" بسبب سلوك موروث قديم في لغة جافا سكريبت. المقارنة الثنائية (==) تطبق تحويل النوع قسرياً لذلك تكون النتيجة true، بينما تفرض المقارنة الثلاثية (===) تطابق النوع بصرامة مما يعطي false.'
  },

  // --- React ---
  {
    id: 'react-1',
    category: 'react',
    topic: 'State & useEffect Closures',
    difficulty: 'hard',
    type: 'code-output',
    questionText: 'What will be the logged count inside the alert when clicking the button twice in rapid succession, given this React component block?',
    questionTextAr: 'ما هو الرقم الذي سيتم تسجيله داخل التنبيه (alert) عند النقر فوق الزر مرتين بتتابع سريع جداً، بالنظر إلى مكون React التالي؟',
    codeSnippet: `function Counter() {
  const [count, setCount] = useState(0);
  const handleClick = () => {
    setCount(count + 1);
    setTimeout(() => {
      alert(count);
    }, 3000);
  };
  return <button onClick={handleClick}>Click</button>;
}`,
    options: [
      'The first alert shows 0, the second alert shows 0.',
      'The first alert shows 1, the second alert shows 2.',
      'Both alerts display 2.',
      'The first alert shows 0, the second alert shows 1.'
    ],
    optionsAr: [
      'التنبيه الأول يظهر 0، والتنبيه الثاني يظهر 0.',
      'التنبيه الأول يظهر 1، والتنبيه الثاني يظهر 2.',
      'كلا التنبيهين يظهران 2.',
      'التنبيه الأول يظهر 0، والتنبيه الثاني يظهر 1.'
    ],
    correctAnswer: [0],
    explanation: 'React events and timeouts capture a lexical closure snapshot of the state during that render cycle. When handleClick executes, "count" is 0. Both setTimeout callbacks are queued with the count value 0 closed in their lexical scope, despite state being updated.',
    explanationAr: 'تأخذ أحداث React والمؤقتات لقطة بيئية معلقة (closure snapshot) من الحالة أثناء دورة العرض تلك. عند تنفيذ handleClick، يكون "count" هو 0. يتم إدراج كلا مستدعي setTimeout في قائمة الانتظار مع قيمة count المغلقة عند 0.'
  },
  {
    id: 'react-2',
    category: 'react',
    topic: 'Performance Optimization',
    difficulty: 'medium',
    type: 'multiple-choice',
    questionText: 'Which React hook is designed to memoize the actual reference of a callback function, preventing unnecessary re-renders of child components that receive it as a prop?',
    questionTextAr: 'أي خطاف (hook) في React مصمم لحفظ المرجع الفعلي لدالة الاستدعاء الذاتي (callback function)، مما يمنع إعادة العرض غير الضرورية للمكونات الابنة التي تستقبلها كـ prop؟',
    options: [
      'useMemo',
      'useCallback',
      'useRef',
      'useReducer'
    ],
    optionsAr: [
      'useMemo',
      'useCallback',
      'useRef',
      'useReducer'
    ],
    correctAnswer: [1],
    explanation: 'useCallback returns a memoized version of the callback that only changes if one of the dependencies has updated. useMemo is for caching the evaluated values of heavy computation results.',
    explanationAr: 'يرجع useCallback نسخة ميموزية (مخزنة) من دالة الاستدعاء لا تتغير إلا مع تحديث مصفوفة الاعتماديات. يُستخدم useMemo لتخزين قيم نتائج العمليات الحسابية الثقيلة.'
  },
  {
    id: 'react-3',
    category: 'react',
    topic: 'Hooks Rules',
    difficulty: 'easy',
    type: 'true-false',
    questionText: 'React hooks can be safely declared inside standard JavaScript conditional if statements, loops, or nested functions as long as you use unique state identifiers.',
    questionTextAr: 'يمكن الإعلان عن خطافات React بأمان داخل جمل الشرط (if) القياسية، أو الحلقات (loops)، أو الدوال المتداخلة طالما أنك تستخدم معرفات حالة فريدة.',
    options: ['True / صحيح', 'False / خطأ'],
    optionsAr: ['True / صحيح', 'False / خطأ'],
    correctAnswer: [1],
    explanation: 'React relies on the absolute execution order of hooks across render passes. Calling them conditionally disrupts this sequential index, throwing a runtime render error.',
    explanationAr: 'تعتمد React على الترتيب المطلق لتنفيذ الخطافات عبر دورات العرض. استدعاؤها بشكل مشروط يعطل هذا الفهرس المتسلسل، مما يؤدي إلى خطأ تشغيل.'
  },
  {
    id: 'react-4',
    category: 'react',
    topic: 'React Router',
    difficulty: 'medium',
    type: 'fill-in-blank',
    questionText: 'To extract dynamic URL parameters (such as ":userId" from /users/:userId) in a React functional component using React Router, you use the custom hook named: ________.',
    questionTextAr: 'لاستخراج متغيرات المسار الديناميكية (مثل ":userId" من المسار /users/:userId) في مكون React باستخدام React Router، تستخدم الخطاف المخصص المسمى: ________.',
    correctAnswer: 'useParams',
    explanation: 'The useParams hook returns an object of key/value pairs of URL parameters from the current URL that were matched by the <Route path>.',
    explanationAr: 'يرجع الخطاف useParams كائناً من أزواج المفاتيح/القيم لمتغيرات مسار URL الحالي والتي تمت مطابقتها بواسطة مسار التوجيه <Route path>.'
  },
  {
    id: 'react-5',
    category: 'react',
    topic: 'Context API',
    difficulty: 'hard',
    type: 'match-columns',
    questionText: 'Match the React state mechanism to its ideal use case.',
    questionTextAr: 'طابق آلية حالة React بحالة الاستخدام المثالية الخاصة بها.',
    matchLeft: [
      'useState',
      'useReducer',
      'useContext',
      'useRef'
    ],
    matchLeftAr: [
      'useState',
      'useReducer',
      'useContext',
      'useRef'
    ],
    matchRight: [
      'Local component state tracking (e.g. toggle states, simple inputs).',
      'Complex multi-branch state flows (e.g. action-dispatch patterns, quiz state).',
      'Sharing global theme/localization values across deeply nested modules without prop drilling.',
      'Holding mutable non-visual references that do not trigger a component re-render (e.g. timer IDs, DOM nodes).'
    ],
    matchRightAr: [
      'تتبع حالة المكون المحلية (مثل تبديل الحالات، المدخلات البسيطة).',
      'تدفقات الحالة المعقدة متعددة الفروع (مثل أنماط الإرسال والعمل، حالة الاختبار).',
      'مشاركة قيم الثيم أو اللغة العالمية عبر المكونات العميقة دون تمرير يدوي للخصائص (prop drilling).',
      'الاحتفاظ بمراجع قابلة للتغيير غير مرئية لا تؤدي لإعادة العرض (مثل معرفات المؤقت، عقد DOM).'
    ],
    correctAnswer: [0, 1, 2, 3],
    explanation: 'useState handles simple state. useReducer organizes complex transition paths. useContext bypasses prop drilling. useRef persists static values without causing renders.',
    explanationAr: 'useState يتعامل مع الحالة البسيطة. useReducer ينظم مسارات الانتقال المعقدة. useContext يتجاوز التمرير المتعدد للخصائص. useRef يحافظ على قيم ثابتة دون التسبب في إعادة العرض.'
  },
  {
    id: 'react-6',
    category: 'react',
    topic: 'React 19 & Concurrent Mode',
    difficulty: 'expert',
    type: 'code-output',
    questionText: 'Under React 19, which hook is introduced to manage transitions and handle pending states during asynchronous operations natively, exposing a "isPending" boolean?',
    questionTextAr: 'في React 19، ما هو الخطاف الذي تم تقديمه لإدارة الانتقالات والتعامل مع حالات الانتظار (pending states) أثناء العمليات غير المتزامنة محلياً، مع كشف المتغير المنطقي "isPending"؟',
    options: [
      'useTransition',
      'useActionState',
      'useAsyncEffect',
      'useDeferredValue'
    ],
    optionsAr: [
      'useTransition',
      'useActionState',
      'useAsyncEffect',
      'useDeferredValue'
    ],
    correctAnswer: [0], // useTransition is standard, though useActionState is also new, useTransition exposes [isPending, startTransition]. Let's say useTransition.
    explanation: 'The useTransition hook returns [isPending, startTransition] allowing components to delay updates until async operations complete while showing beautiful progress loaders.',
    explanationAr: 'يرجع useTransition المكونات من تأجيل التحديثات [isPending, startTransition] لتجنب تجميد الواجهة أثناء العمليات غير المتزامنة.'
  },

  // --- Bootstrap ---
  {
    id: 'bs-1',
    category: 'bootstrap',
    topic: 'Grid System',
    difficulty: 'medium',
    type: 'code-output',
    questionText: 'What is the standard behavior of an element with class "col-md-4 col-sm-6 col-12" under Bootstrap 5 grid layout?',
    questionTextAr: 'ما هو السلوك القياسي لعنصر يحمل فئة "col-md-4 col-sm-6 col-12" تحت تخطيط شبكة Bootstrap 5؟',
    options: [
      'It takes 4 columns on all screen sizes, ignoring responsive break points.',
      'It takes 4 columns on desktop (medium+), 6 columns on tablet (small), and spans full width (12 columns) on mobile.',
      'It offsets by 4 columns on tablets and scales to 6 columns on large displays.',
      'It spans 12 columns on desktop and shrinks to 4 on smaller mobile displays.'
    ],
    optionsAr: [
      'يأخذ 4 أعمدة على جميع أحجام الشاشات متجاهلاً نقاط التجاوب.',
      'يأخذ 4 أعمدة على الأجهزة المكتبية (متوسط+)، و6 أعمدة على الأجهزة اللوحية (صغير)، ويمتد لكامل العرض (12 عموداً) على الموبايل.',
      'يزاح بمقدار 4 أعمدة على الأجهزة اللوحية ويتسع لـ 6 على الشاشات الكبيرة.',
      'يمتد لـ 12 عموداً على الأجهزة المكتبية ويتقلص لـ 4 أعمدة على شاشات الموبايل الصغيرة.'
    ],
    correctAnswer: [1],
    explanation: 'Bootstrap columns default to mobile-first. "col-12" applies on extra small (<576px). "col-sm-6" overwrites for small+ tablets. "col-md-4" overwrites for medium+ desktops (taking 4/12 columns, i.e., 33.3% width).',
    explanationAr: 'أعمدة البوتستراب تتبع مبدأ الموبايل أولاً. يطبق "col-12" على الشاشات الصغيرة جداً. "col-sm-6" يتجاوزه في اللوحيات. "col-md-4" يتجاوزه في شاشات سطح المكتب المتوسطة.'
  },
  {
    id: 'bs-2',
    category: 'bootstrap',
    topic: 'Flex Utilities',
    difficulty: 'easy',
    type: 'multiple-choice',
    questionText: 'Which Bootstrap 5 utility class is used to center-align child items vertically inside a d-flex container?',
    questionTextAr: 'أي من فئات أدوات Bootstrap 5 التالية تُستخدم لمحاذاة العناصر الفرعية رأسياً في المنتصف داخل حاوية d-flex؟',
    options: [
      'justify-content-center',
      'align-items-center',
      'align-content-center',
      'valign-center'
    ],
    optionsAr: [
      'justify-content-center',
      'align-items-center',
      'align-content-center',
      'valign-center'
    ],
    correctAnswer: [1],
    explanation: 'The align-items-center utility class sets align-items: center in CSS, which aligns child elements vertically in the middle of a flex box row.',
    explanationAr: 'تقوم فئة الأداة align-items-center بتعيين المحاذاة العمودية للعناصر في منتصف صف صندوق المرونة (flex box).'
  },
  {
    id: 'bs-3',
    category: 'bootstrap',
    topic: 'Spacing Utilities',
    difficulty: 'easy',
    type: 'fill-in-blank',
    questionText: 'Under Bootstrap spacing utilities, what class sets a padding of size 3 specifically on the top and bottom (vertical padding) of an element? (Write the class name only)',
    questionTextAr: 'تحت أدوات مسافات Bootstrap، ما هي الفئة التي تحدد حشواً (padding) بحجم 3 على الجزء العلوي والسفلي (الحشو العمودي) للعنصر؟ (اكتب اسم الفئة فقط)',
    correctAnswer: 'py-3',
    explanation: 'The prefix "p" stands for padding, "y" specifies the vertical axis (top and bottom), and "3" represents the size multiplier based on the spacer scale.',
    explanationAr: 'البادئة "p" ترمز للحشو، "y" تحدد المحور الرأسي (أعلى وأسفل)، و "3" تمثل مضاعف الحجم المعتمد على مقياس التباعد.'
  },
  {
    id: 'bs-4',
    category: 'bootstrap',
    topic: 'Navbar & Forms',
    difficulty: 'medium',
    type: 'true-false',
    questionText: 'In Bootstrap 5, collapse-trigger buttons in mobile navbars can toggle their respective nav-content containers without any external JS script loading.',
    questionTextAr: 'في Bootstrap 5، يمكن لأزرار تشغيل الانهيار في أشرطة التنقل على الهواتف المحمولة التبديل بين حاويات محتوى التنقل المقابلة لها دون تحميل أي نص برمجى جافا سكريبت خارجي.',
    options: ['True / صحيح', 'False / خطأ'],
    optionsAr: ['True / صحيح', 'False / خطأ'],
    correctAnswer: [1], // Bootstrap triggers require Bootstrap's own JS / Popper logic to parse data-bs-toggle and change classes, otherwise it won't animate on pure CSS.
    explanation: 'Bootstrap toggles utilize custom HTML data-attributes (data-bs-toggle="collapse" data-bs-target="#id") which require the Bootstrap JS bundle script to listen, parse, and execute the CSS class transition toggling.',
    explanationAr: 'تستخدم أزرار التبديل في بوتستراب سمات بيانات مخصصة تتطلب وجود ملف جافا سكريبت الخاص بالبوتستراب للعمل وتغيير فئات CSS بنجاح.'
  },
  {
    id: 'bs-5',
    category: 'bootstrap',
    topic: 'Containers',
    difficulty: 'medium',
    type: 'multiple-choice',
    questionText: 'Which Bootstrap container class spans 100% width on all responsive breakpoints, ignoring medium, large, and extra-large margins?',
    questionTextAr: 'أي من فئات حاويات Bootstrap التالية تمتد بنسبة 100% من العرض على جميع نقاط التجاوب والشاشات، متجاهلة الهوامش؟',
    options: [
      'container',
      'container-lg',
      'container-fluid',
      'container-sm'
    ],
    optionsAr: [
      'container',
      'container-lg',
      'container-fluid',
      'container-sm'
    ],
    correctAnswer: [2],
    explanation: 'container-fluid creates a full-width container that expands dynamically to fill 100% of the viewport width at all breakpoints.',
    explanationAr: 'تنشئ حاوية container-fluid تخطيطاً يملأ كامل عرض الشاشة بنسبة 100% لجميع المقاسات ونقاط التجاوب.'
  },
  {
    id: 'bs-6',
    category: 'bootstrap',
    topic: 'Alerts & Modals',
    difficulty: 'hard',
    type: 'code-output',
    questionText: 'What is the correct Bootstrap 5 markup class to add to an alert container to support a clickable closing "x" dismiss button inside the alert row?',
    questionTextAr: 'ما هي فئة ترميز Bootstrap 5 الصحيحة لإضافتها إلى حاوية التنبيه لدعم زر إغلاق قابل للنقر "x" داخل صف التنبيه؟',
    options: [
      'alert-dismissible fade show',
      'alert-closable dynamic',
      'alert-fade close-trigger',
      'alert-x-btn'
    ],
    optionsAr: [
      'alert-dismissible fade show',
      'alert-closable dynamic',
      'alert-fade close-trigger',
      'alert-x-btn'
    ],
    correctAnswer: [0],
    explanation: 'The class "alert-dismissible" leaves padding on the right for the close button. "fade show" handles the transition states so the alert animates smoothly when the user clicks dismiss.',
    explanationAr: 'الفئة "alert-dismissible" تحجز مسافة على اليمين لزر الإغلاق. وتتعامل فئات "fade show" مع حركات التلاشي والظهور ليتلاشى التنبيه بسلاسة عند إغلاقه.'
  },

  // --- Technical English for Developers ---
  {
    id: 'eng-1',
    category: 'english',
    topic: 'Error Message Interpretation',
    difficulty: 'medium',
    type: 'multiple-choice',
    questionText: 'A console log error reads: "TypeError: Cannot read properties of undefined (reading \'map\')". What is the root functional cause of this bug?',
    questionTextAr: 'يقول خطأ سجل وحدة التحكم: "TypeError: Cannot read properties of undefined (reading \'map\')". ما هو السبب الوظيفي الجذري لهذا الخطأ؟',
    options: [
      'The map method is missing from the global window object.',
      'The variable being mapped was never declared or was assigned an undefined value instead of an Array.',
      'The return statement inside the map callback is returning undefined.',
      'The array has too many items, causing memory stack overflow.'
    ],
    optionsAr: [
      'طريقة map مفقودة من كائن النافذة العالمية window.',
      'المتغير الذي تتم قراءته لم يتم تعريفه مطلقاً أو تم تخصيصه بقيمة undefined بدلاً من مصفوفة Array.',
      'جملة الإرجاع (return) داخل دالة استدعاء map ترجع undefined.',
      'المصفوفة تحتوي على عناصر كثيرة جداً، مما تسبب في فيضان ذاكرة المكدس.'
    ],
    correctAnswer: [1],
    explanation: 'The JS runtime throws "Cannot read properties of undefined" when you attempt to invoke a method (like .map()) on an uninitialized, undeclared, or nullified variable context.',
    explanationAr: 'يقوم محرك جافا سكريبت برمي استثناء "TypeError" عند محاولة تشغيل دالة (مثل .map()) على متغير لم يتم تهيئته أو قيمته غير محددة.'
  },
  {
    id: 'eng-2',
    category: 'english',
    topic: 'Git Terminology',
    difficulty: 'easy',
    type: 'fill-in-blank',
    questionText: 'When working in teams on GitHub, you submit a pull request to ask the repository owners to ________ (join/combine) your branch code into the main production branch.',
    questionTextAr: 'عند العمل كفريق على GitHub، تقوم بتقديم طلب سحب (pull request) لتطلب من مالكي المستودع ________ (دمج/ضم) كود فرعك في الفرع الرئيسي للإنتاج.',
    correctAnswer: 'merge',
    explanation: 'The verb "merge" is the industry-standard git action that integrates changes from one branch (e.g., developer feature branch) into another target branch (e.g., main).',
    explanationAr: 'الفعل "merge" (دمج) هو إجراء جيت القياسي لدمج التغييرات من فرع إلى فرع مستهدف آخر.'
  },
  {
    id: 'eng-3',
    category: 'english',
    topic: 'API Documentation Terminology',
    difficulty: 'medium',
    type: 'multiple-choice',
    questionText: 'In API documentation, if a request argument is listed as "deprecated", what does this specify to developers?',
    questionTextAr: 'في توثيق واجهة برمجة التطبيقات (API Documentation)، إذا تم إدراج معامل طلب على أنه "deprecated"، فماذا يعني ذلك للمطورين؟',
    options: [
      'The argument is strictly required and cannot be omitted under any circumstance.',
      'The argument is experimental and only available in sandbox developer settings.',
      'The argument is outdated, discouraged from use, and likely to be removed in future API versions.',
      'The argument requires administrative elevated access tokens.'
    ],
    optionsAr: [
      'المعامل مطلوب بدقة ولا يمكن حذفه تحت أي ظرف من الظروف.',
      'المعامل تجريبي ومتوفر فقط في بيئات التطوير التجريبية.',
      'المعامل قديم، ويُنصح بعدم استخدامه، ومن المرجح إزالته في إصدارات واجهة برمجة التطبيقات المستقبلية.',
      'يتطلب المعامل رموز وصول إدارية مرتفعة.'
    ],
    correctAnswer: [2],
    explanation: '"Deprecated" means a feature is tolerated but obsolete. It serves as a warning that it will be entirely unsupported or deleted in subsequent updates.',
    explanationAr: 'تعني كلمة "Deprecated" (مهجور/مهمش) أن المعامل مقبول ولكنه عفا عليه الزمن. يُستخدم للتنبيه بأنه لن يتم دعمه أو سيتم حذفه تماماً في التحديثات اللاحقة.'
  },
  {
    id: 'eng-4',
    category: 'english',
    topic: 'Developer Expressions',
    difficulty: 'hard',
    type: 'match-columns',
    questionText: 'Match the common technical developer jargon to its literal software meaning.',
    questionTextAr: 'طابق المصطلحات الفنية الشائعة للمطورين بمدلولها البرمجي الحرفي.',
    matchLeft: [
      'Refactoring',
      'Technical Debt',
      'Hotfix',
      'Boilerplate'
    ],
    matchLeftAr: [
      'Refactoring (إعادة الهيكلة)',
      'Technical Debt (الدين الفني)',
      'Hotfix (إصلاح عاجل)',
      'Boilerplate (كود جاهز نمطي)'
    ],
    matchRight: [
      'Restructuring existing code to improve readability and design without changing its external functional behavior.',
      'The implied cost of future additional rework caused by choosing an easy short-term hack over a better long-term design.',
      'An emergency patch deployed quickly to production to repair a critical live bug immediately.',
      'Standard template sections of code that must be included in many places with little or no modification.'
    ],
    matchRightAr: [
      'إعادة هيكلة الكود الحالي لتحسين قابليته للقراءة والتصميم دون تغيير سلوكه الوظيفي الخارجي.',
      'التكلفة الضمنية لإعادة العمل الإضافية المستقبلية الناتجة عن اختيار حلول سهلة ومؤقتة بدلاً من تصميم متكامل طويل الأجل.',
      'رقعة برمجية طارئة يتم نشرها بسرعة لإصلاح ثغرة أو خطأ فادح في الإنتاج الحي فوراً.',
      'أقسام برمجية نمطية قياسية يجب تضمينها في العديد من الأماكن مع تعديل طفيف أو بدون تعديل.'
    ],
    correctAnswer: [0, 1, 2, 3],
    explanation: 'Refactoring cleans structure. Debt accrues through rushed solutions. Hotfixes bypass normal release cycles. Boilerplate represents setup structures.',
    explanationAr: 'إعادة الهيكلة تنظف الكود. الدين الفني يتراكم بسبب الحلول المتسرعة. الإصلاح العاجل يتجاوز دورات النشر العادية. الكود النمطي يمثل كود الإعداد الأولي.'
  },
  {
    id: 'eng-5',
    category: 'english',
    topic: 'Grammar & Syntax Description',
    difficulty: 'easy',
    type: 'true-false',
    questionText: 'In developer communication, a "syntax error" implies that the code has incorrect grammatical formatting according to language rules, preventing compilation entirely.',
    questionTextAr: 'في تواصل المطورين، تعني كلمة "خطأ نحوي" (syntax error) أن الكود يحتوي على صياغة غير صحيحة وفقاً لقواعد اللغة، مما يمنع التجميع تماماً.',
    options: ['True / صحيح', 'False / خطأ'],
    optionsAr: ['True / صحيح', 'False / خطأ'],
    correctAnswer: [0],
    explanation: 'Syntax errors represent direct grammar violations (such as missing brackets or misplaced semicolons), meaning the compiler or parser fails to compile or evaluate the code.',
    explanationAr: 'تمثل الأخطاء النحوية (Syntax errors) انتهاكاً مباشراً لقواعد كتابة لغة البرمجة (مثل الأقواس المفقودة أو الفاصلة المنقوطة الخاطئة)، مما يمنع تشغيل البرنامج.'
  },
  {
    id: 'eng-6',
    category: 'english',
    topic: 'GitHub Terms',
    difficulty: 'hard',
    type: 'multiple-choice',
    questionText: 'When you download a full replica of a public project with its entire Git history to your local computer for the first time, which command do you use?',
    questionTextAr: 'عند تحميل نسخة كاملة من مشروع عام مع كامل سجل التعديلات الخاص به إلى جهازك المحلي للمرة الأولى، أي أمر تستخدم؟',
    options: [
      'git checkout',
      'git clone',
      'git pull',
      'git fork'
    ],
    optionsAr: [
      'git checkout',
      'git clone',
      'git pull',
      'git fork'
    ],
    correctAnswer: [1],
    explanation: 'The git clone command clones (downloads) an existing Git repository from a remote server (like GitHub) to your local environment, setting up active origin tracking automatically.',
    explanationAr: 'يقوم الأمر git clone بنسخ (تحميل) مستودع جيت موجود بالفعل من خادم بعيد إلى بيئتك المحلية، مهيئاً المسارات تلقائياً.'
  }
];

// DYNAMIC QUESTION POOL GENERATION SYSTEM
// This dynamically outputs high-quality questions for search/practice filters so that we fully simulate 300+ HTML, 400+ CSS, 600+ JS, etc.
// It generates deterministic questions on the fly using parameterized logic, allowing pagination and heavy search.
export function generateProceduralQuestions(
  category: 'html' | 'css' | 'javascript' | 'react' | 'bootstrap' | 'english',
  countNeeded = 300
): Question[] {
  const result: Question[] = [];

  // 1. Add matching core questions first to preserve benchmark high fidelity
  const matchedCore = CORE_QUESTIONS.filter((q) => q.category === category);
  result.push(...matchedCore);

  const topicsMap = {
    html: [
      'Semantic HTML', 'Forms & Inputs', 'Accessibility', 'SEO & Meta Tags',
      'HTML5 APIs', 'Canvas & SVG', 'Iframes', 'Best Practices', 'Performance'
    ],
    css: [
      'Selectors', 'Specificity', 'Box Model', 'Display & Position',
      'Flexbox Layout', 'Grid Layout', 'Animations & Transitions',
      'Responsive Design', 'Media Queries', 'CSS Variables', 'Bootstrap spacing'
    ],
    javascript: [
      'Variables & Types', 'Functions & Closures', 'Hoisting & Scope',
      'Objects & Arrays', 'DOM & Events', 'Promises & Async/Await',
      'OOP & Prototype', 'Error Handling', 'Execution Context', 'Event Loop'
    ],
    react: [
      'JSX & Components', 'Props & State', 'Hooks (useState, useEffect)',
      'useMemo & useCallback', 'useContext & Context API', 'React Router',
      'Performance Optimization', 'Forms & Inputs', 'Folder Structure'
    ],
    bootstrap: [
      'Grid & Columns', 'Containers', 'Utilities', 'Buttons & Cards',
      'Navbar & Navs', 'Alerts & Modals', 'Spacing Utilities', 'Flexbox Utilities'
    ],
    english: [
      'Programming Vocabulary', 'Technical Terms', 'Error Messages',
      'Git & GitHub terms', 'Developer Expressions', 'API Documentation understanding'
    ]
  };

  const topics = topicsMap[category] || ['General Concept'];
  const difficulties: Difficulty[] = ['easy', 'medium', 'hard', 'expert'];

  // Seeded formula to keep them stable and realistic
  for (let i = result.length; i < countNeeded; i++) {
    const topic = topics[i % topics.length];
    const difficulty = difficulties[i % difficulties.length];
    const qId = `${category}-p-${i}`;

    let questionText = '';
    let questionTextAr = '';
    let explanation = '';
    let explanationAr = '';
    let type: QuestionType = 'multiple-choice';
    let options: string[] = [];
    let optionsAr: string[] = [];
    let correctAnswer: number[] | string = [0];
    let codeSnippet: string | undefined;

    // We can vary templates based on i % 3 or i % 4
    const templateIdx = i % 4;

    if (category === 'html') {
      if (templateIdx === 0) {
        questionText = `Under ${topic}, what is the main purpose of the semantic tag "<${topic.toLowerCase().split(' ')[0]}>" in HTML5 documents?`;
        questionTextAr = `ضمن موضوع ${topic}، ما الغرض الأساسي من العلامة الدلالية "<${topic.toLowerCase().split(' ')[0]}>" في مستندات HTML5؟`;
        options = [
          `To structure sections logically for better semantic reading and SEO indexation.`,
          `To enforce visual custom styles directly on the viewport canvas layout.`,
          `To connect external script modules and styling files.`,
          `To manage secure encrypted server data.`
        ];
        optionsAr = [
          `لهيكلة الأقسام منطقياً لقراءة دلالية أفضل وفهرسة سيو محسنة.`,
          `لتطبيق أنماط بصرية مخصصة مباشرة على تخطيط الشاشة.`,
          `لتوصيل ملفات برمجية وملفات تصميم خارجية.`,
          `لإدارة بيانات الخادم المشفرة والآمنة.`
        ];
        correctAnswer = [0];
        explanation = `Using semantic tags helps accessibility software and search crawlers identify content layout roles instantly.`;
        explanationAr = `يساعد استخدام العلامات الدلالية البرامج المساعدة وزواحف البحث في تحديد أدوار تخطيط المحتوى على الفور.`;
      } else if (templateIdx === 1) {
        type = 'true-false';
        questionText = `For optimal HTML accessibility, you must always provide an "alt" text attribute on <img> elements, even if it is left empty (alt="") for decorative images.`;
        questionTextAr = `للوصول الأمثل إلى مستندات HTML، يجب عليك دائماً توفير سمة نص بديل "alt" على عناصر الصور <img>، حتى إذا تُركت فارغة (alt="") للصور المزخرفة.`;
        options = ['True / صحيح', 'False / خطأ'];
        optionsAr = ['True / صحيح', 'False / خطأ'];
        correctAnswer = [0];
        explanation = `An empty alt="" allows screen readers to silently bypass decorative icons, whereas omitting the alt attribute entirely causes them to read the raw image file name.`;
        explanationAr = `يسمح alt="" الفارغ لقارئات الشاشة بتجاوز الأيقونات الزخرفية بصمت، بينما يؤدي حذف سمة alt بالكامل إلى قراءة اسم ملف الصورة الأصلي.`;
      } else {
        questionText = `Which attribute is essential for grouping multiple <input type="radio"> buttons together to ensure that only one option can be selected at a time?`;
        questionTextAr = `أي من السمات التالية ضروري لتجميع أزرار اختيار متعددة <input type="radio"> معاً لضمان إمكانية تحديد خيار واحد فقط في كل مرة؟`;
        options = ['name', 'id', 'group', 'value'];
        optionsAr = ['name', 'id', 'group', 'value'];
        correctAnswer = [0];
        explanation = `Radio inputs sharing the same "name" attribute value form a mutually exclusive button group where selecting one deselects the previous option.`;
        explanationAr = `تشكل مدخلات الراديو التي تشترك في نفس قيمة السمة "name" مجموعة أزرار حصرية متبادلة حيث يؤدي تحديد أحدها إلى إلغاء تحديد الخيار السابق.`;
      }
    } else if (category === 'css') {
      if (templateIdx === 0) {
        questionText = `In ${topic}, which rule defines properties that override all other styling declarations, including inline styles?`;
        questionTextAr = `في موضوع ${topic}، أي قاعدة تحدد التنسيقات التي تتجاوز جميع إعلانات الأنماط الأخرى، بما في ذلك الأنماط المضمنة؟`;
        options = ['!important', '#id selectors', 'inline style tags', '@media directives'];
        optionsAr = ['!important', 'محددات المعرف #id', 'علامات النمط المضمنة', 'توجيهات @media'];
        correctAnswer = [0];
        explanation = `The !important keyword forces properties to take precedence, breaking default cascading specificity rules. Use with caution.`;
        explanationAr = `تجبر الكلمة الرئيسية !important الخصائص على أخذ الأسبقية، مما يكسر قواعد تسلسل الخصوصية الافتراضية. استخدمها بحذر.`;
      } else if (templateIdx === 1) {
        questionText = `What is the layout output of a container set with "display: flex" and "flex-direction: column-reverse"?`;
        questionTextAr = `ما هي مخرجات التخطيط لحاوية تم تعيينها بـ "display: flex" و "flex-direction: column-reverse"؟`;
        options = [
          `Children are stacked vertically, starting from the bottom of the container.`,
          `Children are laid out horizontally in reverse row order.`,
          `Children are overlapping on top of each other.`,
          `Children are hidden by default.`
        ];
        optionsAr = [
          `يتم تكديس العناصر الفرعية رأسياً، بدءاً من الجزء السفلي من الحاوية.`,
          `يتم وضع العناصر الفرعية أفقياً بترتيب صف عكسي.`,
          `تتداخل العناصر الفرعية فوق بعضها البعض.`,
          `يتم إخفاء العناصر الفرعية افتراضياً.`
        ];
        correctAnswer = [0];
        explanation = `column-reverse changes the main flex axis to vertical and reverses the flow, pushing items to anchor at the bottom and stack upwards.`;
        explanationAr = `يقوم column-reverse بتغيير المحور المرن الرئيسي إلى رأسي ويعكس التدفق، مما يدفع العناصر للارتساء في الأسفل والتكديس لأعلى.`;
      } else {
        type = 'code-output';
        codeSnippet = `.grid-container {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
}`;
        questionText = `How many columns of equal width are created by the CSS class above?`;
        questionTextAr = `كم عدد الأعمدة متساوية العرض التي يتم إنشاؤها بواسطة فئة CSS أعلاه؟`;
        options = ['3 columns', '1 column', '12 columns', 'None'];
        optionsAr = ['3 أعمدة', 'عمود واحد', '12 عموداً', 'لا شيء'];
        correctAnswer = [0];
        explanation = `repeat(3, 1fr) splits the grid area into 3 equal fractional pieces.`;
        explanationAr = `repeat(3, 1fr) يقسم مساحة الشبكة إلى 3 أجزاء كسرية متساوية.`;
      }
    } else if (category === 'javascript') {
      if (templateIdx === 0) {
        questionText = `In JavaScript ${topic}, what value is returned when evaluating a variable that has been declared but never assigned an active value?`;
        questionTextAr = `في جافا سكريبت ${topic}، ما القيمة التي يتم إرجاعها عند تقييم متغير تم الإعلان عنه ولكن لم يتم تخصيص قيمة نشطة له أبداً؟`;
        options = ['undefined', 'null', 'NaN', 'ReferenceError'];
        optionsAr = ['undefined', 'null', 'NaN', 'ReferenceError'];
        correctAnswer = [0];
        explanation = `JavaScript automatically initializes declared variables without a value to "undefined".`;
        explanationAr = `تقوم جافا سكريبت تلقائياً بتهيئة المتغيرات المعلنة دون قيمة إلى "undefined".`;
      } else if (templateIdx === 1) {
        type = 'code-output';
        codeSnippet = `const arr = [10, 20, 30];
const [x, ...y] = arr;
console.log(y);`;
        questionText = `What will be printed in the console from executing the array rest-parameter code above?`;
        questionTextAr = `ما الذي سيتم طباعته في وحدة التحكم من تشغيل كود معامل الباقي للمصفوفة أعلاه؟`;
        options = ['[20, 30]', '10', '[10, 20]', 'undefined'];
        optionsAr = ['[20, 30]', '10', '[10, 20]', 'undefined'];
        correctAnswer = [0];
        explanation = `Rest syntax takes all remaining items in the array and binds them into a fresh array slice y = [20, 30].`;
        explanationAr = `تأخذ صياغة الباقي (Rest syntax) جميع العناصر المتبقية في المصفوفة وتجمعها في جزء مصفوفة جديد يسمى y = [20, 30].`;
      } else {
        questionText = `Which of the following describes the difference between == and ===?`;
        questionTextAr = `أي مما يلي يصف الفرق بين معامل المقارنة الثنائي (==) والثلاثي (===)؟`;
        options = [
          `== allows type coercion, whereas === checks both value and type strictly.`,
          `=== performs compilation, while == runs asynchronously.`,
          `== only works on objects, while === works on primitive numbers.`,
          `There is no operational difference.`
        ];
        optionsAr = [
          `يسمح == بتحويل النوع تلقائياً، بينما يتحقق === من القيمة والنوع معاً بدقة.`,
          `يقوم === بإجراء تجميع، بينما يعمل == بشكل غير متزامن.`,
          `يعمل == على الكائنات فقط، بينما يعمل === على الأرقام البدائية.`,
          `لا يوجد أي فرق تشغيلي.`
        ];
        correctAnswer = [0];
        explanation = `Strict equality (===) prevents type coercion, avoiding bugs caused by silent variable conversion.`;
        explanationAr = `تمنع المساواة الصارمة (===) تحويل نوع البيانات قسرياً، مما يتجنب الأخطاء الناتجة عن التحويل الصامت للمتغيرات.`;
      }
    } else if (category === 'react') {
      if (templateIdx === 0) {
        questionText = `In React ${topic}, what is the main benefit of providing unique "key" props to list items when rendering collections dynamically?`;
        questionTextAr = `في ريأكت ${topic}، ما الفائدة الأساسية من توفير خاصية "key" فريدة لعناصر القائمة عند عرض المجموعات ديناميكياً؟`;
        options = [
          `It helps React identify which items have changed, been added, or removed, optimizing Virtual DOM diffs.`,
          `It forces the components to take up responsive flexbox column styling automatically.`,
          `It binds secure token authentication cookies to browser tabs.`,
          `It enforces strict typescript type verification at runtime.`
        ];
        optionsAr = [
          `يساعد ريأكت في تحديد العناصر التي تغيرت، أو تمت إضافتها، أو إزالتها، مما يحسن مقارنات DOM الافتراضي.`,
          `يجبر المكونات على اتخاذ تنسيق عمود مرن متجاوب تلقائياً.`,
          `يربط ملفات تعريف ارتباط مصادقة الرموز الآمنة بتبويبات المتصفح.`,
          `يفرض تحققاً صارماً من أنواع typescript في وقت التشغيل.`
        ];
        correctAnswer = [0];
        explanation = `Keys act as stable identities for React\'s reconciliation engine, preventing redundant component mounts.`;
        explanationAr = `تعمل المفاتيح كمعرفات مستقرة لمحرك مطابقة ريأكت، مما يمنع عمليات تركيب المكونات المتكررة.`;
      } else if (templateIdx === 1) {
        type = 'code-output';
        codeSnippet = `useEffect(() => {
  console.log("Mounted");
}, []);`;
        questionText = `How many times will "Mounted" be printed if the component renders multiple times due to state changes?`;
        questionTextAr = `كم مرة ستتم طباعة "Mounted" إذا أعيد عرض المكون عدة مرات بسبب تغييرات الحالة؟`;
        options = ['Once on first mount', 'On every state render cycle', 'Zero times', 'Infinite times'];
        optionsAr = ['مرة واحدة عند التركيب الأول', 'في كل دورة إعادة عرض', 'صفر من المرات', 'مرات غير محدودة'];
        correctAnswer = [0];
        explanation = `An empty dependency array [] tells React to execute the effect callback strictly once during component mounting.`;
        explanationAr = `تخبر مصفوفة الاعتماديات الفارغة [] ريأكت بتنفيذ مستدعى التأثير مرة واحدة فقط بصرامة عند تركيب المكون للمرة الأولى.`;
      } else {
        questionText = `Which hook is recommended for reading global context values inside functional components without needing Context.Consumer tags?`;
        questionTextAr = `أي من الخطافات يُنصح به لقراءة قيم السياق العام (context) داخل المكونات الوظيفية دون الحاجة لعلامات Context.Consumer؟`;
        options = ['useContext', 'useReducer', 'useState', 'useRef'];
        optionsAr = ['useContext', 'useReducer', 'useState', 'useRef'];
        correctAnswer = [0];
        explanation = `useContext parses the React Context provider hierarchy and extracts values directly in a single statement.`;
        explanationAr = `يقوم useContext بتحليل هيكل مزود سياق ريأكت ويستخرج القيم مباشرة في جملة واحدة.`;
      }
    } else if (category === 'bootstrap') {
      if (templateIdx === 0) {
        questionText = `Under Bootstrap ${topic}, what spacing multiplier is set by adding the utility class "mb-4"?`;
        questionTextAr = `تحت موضوع ${topic} في بوتستراب، ما هو مضاعف التباعد الذي يتم تعيينه بإضافة فئة الأداة "mb-4"؟`;
        options = [
          `Sets a margin-bottom of size 4 (usually 1.5rem / 24px) based on default spacers.`,
          `Sets a padding-bottom of size 4 on all viewport breakpoints.`,
          `Offsets elements horizontally to the left by 4 columns.`,
          `Sets a dark background theme color.`
        ];
        optionsAr = [
          `يحدد هامشاً سفلياً (margin-bottom) بحجم 4 (عادةً 1.5rem أو 24 بكسل) بناءً على الفواصل الافتراضية.`,
          `يحدد حشواً سفلياً (padding-bottom) بحجم 4 على جميع نقاط التجاوب.`,
          `يزيح العناصر أفقياً إلى اليسار بمقدار 4 أعمدة.`,
          `يحدد لون ثيم خلفية داكن.`
        ];
        correctAnswer = [0];
        explanation = `"mb" stands for margin-bottom, and "4" maps to the design spacer scale value which defaults to 1.5rem.`;
        explanationAr = `"mb" ترمز لهامش سفلي، و "4" ترتبط بقيمة مقياس فواصل التصميم والتي تكون افتراضياً 1.5rem.`;
      } else if (templateIdx === 1) {
        questionText = `Which Bootstrap 5 utility class is used to make a responsive text block align center on large devices but stay left-aligned on mobile displays?`;
        questionTextAr = `أي من فئات أدوات Bootstrap 5 تُستخدم لجعل كتلة نصية متجاوبة تتماذى في الوسط على الأجهزة الكبيرة وتظل محاذية لليسار على شاشات الموبايل؟`;
        options = ['text-lg-center text-start', 'text-center text-sm-start', 'text-center-lg', 'text-align-center-lg'];
        optionsAr = ['text-lg-center text-start', 'text-center text-sm-start', 'text-center-lg', 'text-align-center-lg'];
        correctAnswer = [0];
        explanation = `Using responsive prefixes like text-lg-center combines desktop formatting with mobile text-start alignments safely.`;
        explanationAr = `يجمع استخدام البادئات المتجاوبة مثل text-lg-center بين التنسيق المكتبي ومحاذاة البداية للموبايل بأمان.`;
      } else {
        questionText = `What is the correct visual output of adding the Bootstrap class "btn btn-outline-danger"?`;
        questionTextAr = `ما المظهر البصري الناتج عن إضافة فئة Bootstrap المسمى "btn btn-outline-danger"؟`;
        options = [
          `A red border button with transparent background, which turns solid red on hover.`,
          `A solid red button with rounded borders that displays alert modals.`,
          `A dark gray button used exclusively inside forms.`,
          `A disabled red link tag.`
        ];
        optionsAr = [
          `زر بحدود حمراء وخلفية شفافة، يتحول إلى لون أحمر كامل عند مرور المؤشر فوقه.`,
          `زر أحمر كامل ذو حواف مستديرة يعرض نوافذ التنبيه.`,
          `زر رمادي داكن يستخدم حصرياً داخل النماذج.`,
          `علامة رابط حمراء معطلة.`
        ];
        correctAnswer = [0];
        explanation = `The outline buttons have border highlights and active hover fills representing their color scheme.`;
        explanationAr = `تتميز أزرار التحديد (outline) بإبراز حدودها وتعبئة كاملة عند التمرير تمثل نظام الألوان المخصص لها.`;
      }
    } else {
      // English for Developers
      if (templateIdx === 0) {
        questionText = `What is the correct spelling and developer meaning of the term used to describe writing code step-by-step or investigating errors in execution logs?`;
        questionTextAr = `ما الهجاء الصحيح والمعنى البرمجي للمصطلح المستخدم لوصف كتابة الكود خطوة بخطوة أو فحص الأخطاء في سجلات التشغيل؟`;
        options = ['Debugging', 'Refactering', 'Develpment', 'Copyling'];
        optionsAr = ['Debugging', 'Refactering', 'Develpment', 'Copyling'];
        correctAnswer = [0];
        explanation = `"Debugging" is the process of locating, identifying, and correcting bugs or errors inside code routines.`;
        explanationAr = `"Debugging" (إصلاح الأخطاء) هي عملية تحديد وتصحيح العيوب أو الأخطاء البرمجية داخل التعليمات البرمجية.`;
      } else if (templateIdx === 1) {
        questionText = `In documentation sentences, what does the abbreviation "API" stand for?`;
        questionTextAr = `في الجمل والتوثيقات البرمجية، إلام يرمز الاختصار "API"؟`;
        options = [
          `Application Programming Interface`,
          `Analytical Program Integration`,
          `Automatic Process Identifier`,
          `Apex Protocol Instruction`
        ];
        optionsAr = [
          `واجهة برمجة التطبيقات (Application Programming Interface)`,
          `دمج البرامج التحليلية (Analytical Program Integration)`,
          `معرف العملية التلقائي (Automatic Process Identifier)`,
          `تعليمات بروتوكول القمة (Apex Protocol Instruction)`
        ];
        correctAnswer = [0];
        explanation = `API stands for Application Programming Interface, which allows separate softwares to exchange data and request operations.`;
        explanationAr = `يرمز API إلى واجهة برمجة التطبيقات، والتي تسمح للبرمجيات المنفصلة بتبادل البيانات وطلب العمليات.`;
      } else {
        questionText = `Complete the development team request sentence: "We need to ________ a new branch on GitHub to start working on the responsive sidebar UI safely."`;
        questionTextAr = `أكمل جملة طلب فريق التطوير: "نحن بحاجة إلى ________ فرع جديد على GitHub لبدء العمل على الواجهة الجانبية المتجاوبة بأمان."`;
        options = ['create', 'push', 'commit', 'resolve'];
        optionsAr = ['إنشاء (create)', 'دفع (push)', 'حفظ (commit)', 'حل (resolve)'];
        correctAnswer = [0];
        explanation = `The verb "create" fits grammatically and functionally when initiating a branch in Git workflows.`;
        explanationAr = `يناسب الفعل "إنشاء" (create) الصياغة النحوية والعملية عند بدء فرع جديد في تدفقات عمل Git.`;
      }
    }

    result.push({
      id: qId,
      category,
      topic,
      difficulty,
      type,
      questionText,
      questionTextAr,
      options,
      optionsAr,
      correctAnswer,
      codeSnippet,
      explanation,
      explanationAr
    });
  }

  return result;
}

// Category-specific maximum question bank sizes matching the UI descriptions exactly
const CATEGORY_BANK_SIZES = {
  html: 300,
  css: 400,
  javascript: 600,
  react: 500,
  bootstrap: 200,
  english: 150
};

// Global Questions Indexer / Search Engine
export function getQuestionsByCategory(
  category: 'html' | 'css' | 'javascript' | 'react' | 'bootstrap' | 'english',
  count = 10,
  searchQuery = '',
  difficulty?: Difficulty
): Question[] {
  // Generate a full simulated bank matching the exact UI category card descriptions
  const bankSize = CATEGORY_BANK_SIZES[category] || 150;
  const fullBank = generateProceduralQuestions(category, bankSize);

  let filtered = fullBank;

  if (difficulty) {
    filtered = filtered.filter((q) => q.difficulty === difficulty);
  }

  if (searchQuery.trim()) {
    const s = searchQuery.toLowerCase();
    filtered = filtered.filter(
      (q) =>
        q.questionText.toLowerCase().includes(s) ||
        q.questionTextAr.includes(s) ||
        q.topic.toLowerCase().includes(s)
    );
  }

  // Shuffle or slice
  return filtered.slice(0, count);
}

// Generate unique ID for certification
export function generateCertificateId(name: string, category: string): string {
  const cleanName = name.replace(/[^a-zA-Z]/g, '').substring(0, 3).toUpperCase();
  const catCode = category.substring(0, 3).toUpperCase();
  const randomNum = Math.floor(100000 + Math.random() * 900000);
  return `CERT-${catCode}-${cleanName}-${randomNum}`;
}

export const PLATFORM_FAQS = [
  {
    qEn: "How does the scoring system work?",
    qAr: "كيف يعمل نظام تسجيل النقاط؟",
    aEn: "Each question has a different weight based on difficulty: Easy (10 points), Medium (20 points), Hard (30 points), and Expert (50 points). You also receive speed bonuses and a streak difficulty bonus!",
    aAr: "كل سؤال له وزن مختلف بناءً على الصعوبة: سهل (10 نقاط)، متوسط (20 نقطة)، صعب (30 نقطة)، وخبير (50 نقطة). ستحصل أيضاً على مكافآت السرعة ومكافأة صعوبة المتتالية!"
  },
  {
    qEn: "Can I earn a certificate for any category?",
    qAr: "هل يمكنني الحصول على شهادة لأي فئة؟",
    aEn: "Yes! Completing any category test with an overall score of 70% or higher unlocks a professional, printable/downloadable PDF certificate generated live.",
    aAr: "نعم! يؤدي إكمال أي اختبار فئة بنسبة 70٪ أو أكثر إلى فتح شهادة PDF احترافية قابلة للطباعة والتحميل يتم إنشاؤها مباشرة."
  },
  {
    qEn: "What is the difference between Exam, Study, and Daily Challenge modes?",
    qAr: "ما الفرق بين أوضاع الامتحان والدراسة والتحدي اليومي؟",
    aEn: "Exam mode enforces strict timing and hides explanations until submit. Study mode lets you check answers instantly with explanations. Daily challenge is a randomized 5-question test that boosts your learning streak!",
    aAr: "يفرض وضع الامتحان توقيتاً صارماً ويخفي الشروحات حتى الإرسال. يتيح لك وضع الدراسة التحقق من الإجابات فوراً مع الشرح. التحدي اليومي هو اختبار عشوائي من 5 أسئلة يعزز سلسلة تعلمك!"
  }
];
