/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Difficulty } from '../types';

export interface CodingChallenge {
  id: string;
  titleEn: string;
  titleAr: string;
  titleEs?: string;
  descEn: string;
  descAr: string;
  descEs?: string;
  category: 'html' | 'css' | 'javascript' | 'react' | 'php' | 'laravel' | 'mysql' | 'backend';
  difficulty: Difficulty;
  boilerplateCode: string;
  testCode: string; // Executable JS assertions that throw on failure
  points: number;
  hintEn: string;
  hintAr: string;
  hintEs?: string;
}

export const CODING_CHALLENGES: CodingChallenge[] = [
  {
    id: 'challenge-flexbox-center',
    titleEn: 'Centering a Flexbox Card',
    titleAr: 'توسيط بطاقة باستخدام Flexbox',
    descEn: 'Configure the CSS inside the `.container` class to perfectly center the `.card` horizontally and vertically. Set the `.card` background color to `orange` (or `#f97316`) and add `8px` of border-radius.',
    descAr: 'قم بضبط خصائص CSS داخل الفئة `.container` لتوسيط الفئة `.card` أفقيًا وعموديًا بالكامل. واجعل لون خلفية البطاقة باللون البرتقالي (`#f97316`) وأضف حوافًا دائرية بمقدار `8px`.',
    category: 'css',
    difficulty: 'easy',
    boilerplateCode: `<div class="container" style="height: 250px; background: #1e293b; border: 1px dashed #475569;">
  <div class="card">Center Me!</div>
</div>

<style>
/* Write your CSS rules below */
.container {
  display: block; /* Change this to flex and center items */
}

.card {
  padding: 16px;
  color: white;
  font-weight: bold;
}
</style>`,
    testCode: `
const container = document.querySelector('.container');
const card = document.querySelector('.card');
if (!container || !card) throw new Error('HTML structures .container or .card were not found.');

const containerStyles = window.getComputedStyle(container);
const cardStyles = window.getComputedStyle(card);

if (containerStyles.display !== 'flex') {
  throw new Error('The container display property must be set to "flex".');
}
if (containerStyles.justifyContent !== 'center' && containerStyles.justifyContent !== 'space-around' && containerStyles.justifyContent !== 'space-between') {
  if (containerStyles.justifyContent !== 'center') throw new Error('The container must center its items horizontally (e.g. justify-content: center).');
}
if (containerStyles.alignItems !== 'center') {
  throw new Error('The container must center its items vertically (e.g. align-items: center).');
}

// Check card background color
const bg = cardStyles.backgroundColor;
const isOrange = bg.includes('rgb(249, 115, 22)') || bg.includes('249') || bg === 'orange' || bg === 'rgb(255, 165, 0)';
if (!isOrange) {
  throw new Error('The card background color must be orange (#f97316). Got: ' + bg);
}

// Check border radius
const radius = cardStyles.borderRadius;
if (!radius || radius === '0px') {
  throw new Error('The card border-radius is missing or set to 0px.');
}
`,
    points: 40,
    hintEn: 'Use `display: flex; justify-content: center; align-items: center;` inside `.container`. Inside `.card`, set `background-color: #f97316; border-radius: 8px;`.',
    hintAr: 'استخدم `display: flex; justify-content: center; align-items: center;` داخل `.container`. وداخل `.card` أضف `background-color: #f97316; border-radius: 8px;`.'
  },
  {
    id: 'challenge-js-fizzbuzz',
    titleEn: 'Ultimate FizzBuzz Pipeline',
    titleAr: 'خوارزمية FizzBuzz الأساسية',
    descEn: 'Write a JavaScript function named `fizzBuzz(n)` that returns an array of strings from 1 to `n`. For multiples of 3, return "Fizz". For multiples of 5, return "Buzz". For multiples of both 3 and 5, return "FizzBuzz". Otherwise, return the number itself as a string.',
    descAr: 'اكتب دالة بلغة جافا سكريبت باسم `fizzBuzz(n)` تُرجع مصفوفة من السلاسل النصية من 1 إلى `n`. للمضاعفات الممثلة للرقم 3، يجب إرجاع "Fizz". وللمضاعفات الممثلة للرقم 5، يجب إرجاع "Buzz". وللمضاعفات الممثلة لكلا الرقمين معًا، يجب إرجاع "FizzBuzz". وبخلاف ذلك، أرجع الرقم نفسه كمتغير نصي.',
    category: 'javascript',
    difficulty: 'medium',
    boilerplateCode: `function fizzBuzz(n) {
  const result = [];
  // Write your loop and conditions below
  
  return result;
}`,
    testCode: `
if (typeof fizzBuzz !== 'function') {
  throw new Error('function fizzBuzz(n) is not defined or is not a function.');
}

const out = fizzBuzz(15);
if (!Array.isArray(out)) {
  throw new Error('fizzBuzz must return an array.');
}
if (out.length !== 15) {
  throw new Error('For n=15, the returned array must have exactly 15 items.');
}

if (out[2] !== 'Fizz') {
  throw new Error('Index 2 (number 3) must be "Fizz". Got: ' + out[2]);
}
if (out[4] !== 'Buzz') {
  throw new Error('Index 4 (number 5) must be "Buzz". Got: ' + out[4]);
}
if (out[14] !== 'FizzBuzz') {
  throw new Error('Index 14 (number 15) must be "FizzBuzz". Got: ' + out[14]);
}
if (out[0] != '1') {
  throw new Error('Index 0 (number 1) must be "1" (string or number). Got: ' + out[0]);
}
if (out[7] != '8') {
  throw new Error('Index 7 (number 8) must be "8". Got: ' + out[7]);
}
`,
    points: 60,
    hintEn: 'Use a loop from 1 to `n`. Check if `i % 15 === 0` first to output "FizzBuzz", then `i % 3 === 0` for "Fizz", then `i % 5 === 0` for "Buzz".',
    hintAr: 'استخدم حلقة تكرارية من 1 إلى `n`. افحص أولاً الشرط `i % 15 === 0` لطباعة "FizzBuzz"، ثم `i % 3 === 0` لـ "Fizz"، ثم `i % 5 === 0` لـ "Buzz".'
  },
  {
    id: 'challenge-js-debounce',
    titleEn: 'Standard Event Debouncing',
    titleAr: 'تطبيق تأخير الأحداث (Debounce)',
    descEn: 'Implement a professional utility function `debounce(fn, delay)` that limits the rate at which a function can fire. It should return a wrapper function that delays executing `fn` until after `delay` milliseconds have elapsed since the last call.',
    descAr: 'قم ببرمجة دالة مساعدة باسم `debounce(fn, delay)` تقوم بتأخير استدعاء الدالة الممررة إليها وتجميع الاستدعاءات المتتالية، حيث لا يتم تنفيذ الدالة الفعلية إلا بعد مرور الوقت المحدد `delay` بالملي ثانية من آخر استدعاء لها.',
    category: 'javascript',
    difficulty: 'hard',
    boilerplateCode: `function debounce(fn, delay) {
  let timerId;
  
  return function(...args) {
    // Implement closure timer clearing and triggering below
    
  };
}`,
    testCode: `
if (typeof debounce !== 'function') {
  throw new Error('function debounce(fn, delay) is not defined.');
}

let counter = 0;
const trigger = () => { counter++; };
const debounced = debounce(trigger, 50);

debounced();
debounced();
debounced();

if (counter !== 0) {
  throw new Error('Function should not fire immediately during successive debounce triggers.');
}

// Test with async timer
return new Promise((resolve, reject) => {
  setTimeout(() => {
    try {
      if (counter !== 0) {
        return reject(new Error('Counter should still be 0 before the complete 50ms delay has passed.'));
      }
      
      debounced(); // reset delay
      
      setTimeout(() => {
        try {
          if (counter !== 0) {
            return reject(new Error('Reset delay was violated. Fired too early.'));
          }
          
          setTimeout(() => {
            try {
              if (counter !== 1) {
                return reject(new Error('Expected function to fire exactly once after complete delay. Got: ' + counter));
              }
              resolve(true);
            } catch(e) { reject(e); }
          }, 40); // total 80ms since last trigger
          
        } catch(e) { reject(e); }
      }, 40); // 40ms since last trigger, should not fire yet
      
    } catch(e) { reject(e); }
  }, 30);
});
`,
    points: 100,
    hintEn: 'Store a mutable `timerId` variable in the closure scope. Every time the returned function is called, clear any existing timer using `clearTimeout(timerId)` and start a new one using `setTimeout`.',
    hintAr: 'قم بتخزين متغير `timerId` قابل للتعديل داخل نطاق الإغلاق (closure). وفي كل مرة يتم فيها استدعاء الدالة المرجعة، قم بإلغاء المؤقت القديم بـ `clearTimeout` وبدء مؤقت جديد بـ `setTimeout`.'
  },
  {
    id: 'challenge-js-flatten',
    titleEn: 'Nested Object Flattener',
    titleAr: 'تسطيح الكائنات المتداخلة',
    descEn: 'Write a recursive function `flattenObject(obj)` that takes a nested object and flattens it into a flat, single-level object. Keys in the flattened object should represent the key path of the original object joined with a dot `.`. Example: `{ a: { b: 1 } }` becomes `{ "a.b": 1 }`. If value is an array, keep it as is.',
    descAr: 'اكتب دالة تكرارية (recursive) باسم `flattenObject(obj)` تأخذ كائناً متداخلاً وتقوم بتسطيحه ليصبح بمستوى واحد. يجب أن تمثل المفاتيح في الكائن المسطح المسار الكامل للمفاتيح الأصلية مدموجة بنقطة `.`. مثال: `{ a: { b: 1 } }` تصبح `{ "a.b": 1 }`. وإذا كانت القيمة مصفوفة، فاتركها كما هي.',
    category: 'javascript',
    difficulty: 'expert',
    boilerplateCode: `function flattenObject(obj) {
  const result = {};
  
  function recurse(current, propPath) {
    // Write recursion helper
    
  }
  
  recurse(obj, '');
  return result;
}`,
    testCode: `
if (typeof flattenObject !== 'function') {
  throw new Error('function flattenObject(obj) is not defined.');
}

const testObj = {
  user: {
    name: 'Karim',
    address: {
      city: 'Cairo',
      zip: 11511
    }
  },
  roles: ['admin', 'dev'],
  active: true
};

const flat = flattenObject(testObj);

if (!flat || typeof flat !== 'object' || Array.isArray(flat)) {
  throw new Error('flattenObject must return an object.');
}

if (flat['user.name'] !== 'Karim') {
  throw new Error('Expected "user.name" to be "Karim". Got: ' + flat['user.name']);
}
if (flat['user.address.city'] !== 'Cairo') {
  throw new Error('Expected "user.address.city" to be "Cairo". Got: ' + flat['user.address.city']);
}
if (flat['user.address.zip'] !== 11511) {
  throw new Error('Expected "user.address.zip" to be 11511. Got: ' + flat['user.address.zip']);
}
if (flat['active'] !== true) {
  throw new Error('Expected "active" key to be true. Got: ' + flat['active']);
}
if (!Array.isArray(flat['roles']) || flat['roles'][0] !== 'admin') {
  throw new Error('Arrays should remain untouched. Expected "roles" to be ["admin", "dev"]. Got: ' + JSON.stringify(flat['roles']));
}
`,
    points: 120,
    hintEn: 'Iterate over object keys. If `typeof current[key] === "object"` and it is not null, nor an array, recurse by appending `.key`. Otherwise, assign `result[propPath + key] = current[key]`.',
    hintAr: 'كرر التنقل في مفاتيح الكائن. إذا كان `typeof current[key] === "object"` وليس فارغاً ولا مصفوفة، استدعِ الدالة تكرارياً مع دمج اسم المفتاح مع نقطة `.`. وبخلاف ذلك قم بتخزين القيمة مباشرة.'
  },
  {
    id: 'challenge-html-forms',
    titleEn: 'Accessible Semantic Form',
    titleAr: 'بناء نموذج دلالي ميسر الوصول',
    descEn: 'Write accessible, semantic HTML to build a simple subscription form containing: a text field for "Full Name" with `name="fullname"`, an email field for "Email" with `name="email"`, a check field for "I accept terms" with `name="terms"`, and a submit button. Make sure each input has a corresponding `<label>` linked via the `for` attribute and `id` property.',
    descAr: 'اكتب كود HTML دلالي وميسر للوصول لبناء نموذج اشتراك بسيط يحتوي على: حقل نصي لـ "الاسم الكامل" بخصائص `name="fullname"`، وحقل بريد إلكتروني لـ "البريد الإلكتروني" بخصائص `name="email"`، ومربع اختيار لـ "أوافق على الشروط" بخصائص `name="terms"`، وزر إرسال. تأكد من أن كل حقل إدخال له وسم `<label>` مطابق ومرتبط به من خلال صفتي `for` و `id`.',
    category: 'html',
    difficulty: 'easy',
    boilerplateCode: `<!-- Write your form structure below -->
<form id="subscribe-form">
  <!-- Add Full Name field with Label -->
  
  <!-- Add Email field with Label -->
  
  <!-- Add Terms checkbox with Label -->
  
  <!-- Add submit button -->
  
</form>`,
    testCode: `
const form = document.querySelector('#subscribe-form');
if (!form) throw new Error('Form tag with id="subscribe-form" is missing.');

const nameInput = form.querySelector('input[name="fullname"]');
const emailInput = form.querySelector('input[name="email"]');
const termsInput = form.querySelector('input[name="terms"]');
const btn = form.querySelector('button, input[type="submit"]');

if (!nameInput) throw new Error('Input with name="fullname" was not found.');
if (!emailInput) throw new Error('Input with name="email" was not found.');
if (!termsInput) throw new Error('Checkbox input with name="terms" was not found.');
if (termsInput.type !== 'checkbox') throw new Error('Terms input must have type="checkbox".');
if (!btn) throw new Error('Submit button was not found inside the form.');

// Check Labels
const labels = form.querySelectorAll('label');
if (labels.length < 3) {
  throw new Error('At least 3 <label> tags are required to ensure accessible inputs.');
}

// Verify labeling linking
const nameId = nameInput.getAttribute('id');
if (!nameId) throw new Error('Full name input is missing an "id" attribute to link with its label.');
const labelForName = form.querySelector(\`label[for="\${nameId}"]\`);
if (!labelForName) throw new Error(\`A label tag with for="\${nameId}" linking to your full name input was not found.\`);

const emailId = emailInput.getAttribute('id');
if (!emailId) throw new Error('Email input is missing an "id" attribute to link with its label.');
const labelForEmail = form.querySelector(\`label[for="\${emailId}"]\`);
if (!labelForEmail) throw new Error(\`A label tag with for="\${emailId}" linking to your email input was not found.\`);
`,
    points: 50,
    hintEn: 'Make sure your `<label for="xxx">` matches the `<input id="xxx">` exactly. The submit button should have `type="submit"` or simply be a `<button>` tag.',
    hintAr: 'تأكد من مطابقة وسم `<label for="xxx">` تماماً مع معرف المدخل `<input id="xxx">`. وزر الإرسال يجب أن يحتوي على الصفة `type="submit"` أو يكون مجرد وسم `<button>`.'
  },
  {
    id: 'challenge-php-array-filter',
    titleEn: 'PHP Array Filter & Transformer',
    titleAr: 'تصفية وتحويل المصفوفات في PHP',
    descEn: 'Write a function `processUsers(users)` that takes an array of user objects `{ id, name, active, role }`. Filter for `active: true` users who have the role `"admin"` or `"developer"`, and return an array of uppercase names.',
    descAr: 'اكتب دالة `processUsers(users)` تُعالج مصفوفة من كائنات المستخدمين `{ id, name, active, role }`. قم بتصفية المستخدمين النشطين (`active: true`) الذين يمتلكون دور `"admin"` أو `"developer"`، وأرجع مصفوفة بالأسماء بالكتبابة الكبيرة (Upper Case).',
    category: 'php',
    difficulty: 'medium',
    boilerplateCode: `function processUsers(users) {
  // Filter active users with role 'admin' or 'developer'
  // and return an array of uppercase names (e.g. "AHMED")
  return [];
}`,
    testCode: `
const sample = [
  { id: 1, name: 'Karim', active: true, role: 'developer' },
  { id: 2, name: 'Sara', active: false, role: 'admin' },
  { id: 3, name: 'Omar', active: true, role: 'admin' },
  { id: 4, name: 'Laila', active: true, role: 'user' }
];

const res = processUsers(sample);
if (!Array.isArray(res)) throw new Error('processUsers must return an array.');
if (res.length !== 2) throw new Error('Expected 2 filtered users (Karim, Omar). Got: ' + res.length);
if (res[0] !== 'KARIM' || res[1] !== 'OMAR') throw new Error('Expected uppercase names ["KARIM", "OMAR"]. Got: ' + JSON.stringify(res));
`,
    points: 60,
    hintEn: 'Filter users where user.active === true and (user.role === "admin" || user.role === "developer"), then map to user.name.toUpperCase().',
    hintAr: 'قم بتصفية المستخدمين عندما يكون user.active === true وبشرط أن يكون الدور إما admin أو developer، ثم استخدم map لإرجاع الاسم بحروف كبيرة.'
  },
  {
    id: 'challenge-mysql-sql-builder',
    titleEn: 'MySQL Aggregation SQL Builder',
    titleAr: 'بناء استعلام SQL التجميعي لـ MySQL',
    descEn: 'Write a function `buildSalesQuery(minTotal)` that returns a valid MySQL SQL query string. The query must select `customer_id` and the total spent as `total_spent` from the `orders` table, grouping by `customer_id`, where status is `"completed"`, and having `SUM(amount) >= minTotal`.',
    descAr: 'اكتب دالة `buildSalesQuery(minTotal)` تُرجع نص استعلام SQL صحيح لـ MySQL. يجب أن يحدد الاستعلام `customer_id` ومجموع المبالغ كـ `total_spent` من جدول `orders` مع التجميع حسب `customer_id` بحالة `"completed"` وبشرط `SUM(amount) >= minTotal`.',
    category: 'mysql',
    difficulty: 'hard',
    boilerplateCode: `function buildSalesQuery(minTotal) {
  // Construct and return the SQL query string
  return "";
}`,
    testCode: `
const sql = buildSalesQuery(500);
if (typeof sql !== 'string') throw new Error('buildSalesQuery must return a string.');
const cleaned = sql.toLowerCase().replace(/\\s+/g, ' ');

if (!cleaned.includes('select')) throw new Error('SQL query must contain SELECT clause.');
if (!cleaned.includes('customer_id')) throw new Error('SQL query must select customer_id.');
if (!cleaned.includes('total_spent')) throw new Error('SQL query must alias total sum as total_spent.');
if (!cleaned.includes('from orders')) throw new Error('SQL query must query FROM orders table.');
if (!cleaned.includes("where status = 'completed'") && !cleaned.includes('where status="completed"')) {
  throw new Error('SQL query must filter WHERE status = "completed".');
}
if (!cleaned.includes('group by customer_id')) throw new Error('SQL query must include GROUP BY customer_id.');
if (!cleaned.includes('having sum(amount) >= 500')) throw new Error('SQL query must filter HAVING SUM(amount) >= 500.');
`,
    points: 70,
    hintEn: 'SELECT customer_id, SUM(amount) AS total_spent FROM orders WHERE status = "completed" GROUP BY customer_id HAVING SUM(amount) >= 500',
    hintAr: 'صغ الاستعلام بالترتيب: SELECT customer_id, SUM(amount) AS total_spent FROM orders WHERE status = "completed" GROUP BY customer_id HAVING SUM(amount) >= 500'
  },
  {
    id: 'challenge-laravel-pipeline',
    titleEn: 'Laravel API Response & Status Builder',
    titleAr: 'منشئ استجابات API في Laravel',
    descEn: 'Write a function `formatApiResponse(data, message, statusCode)` that creates a standard Laravel JSON API response object with `{ success: boolean, message: string, data: object, code: number }`. If statusCode is between 200 and 299, success is true; otherwise false.',
    descAr: 'اكتب دالة `formatApiResponse(data, message, statusCode)` تُنشئ كائن استجابة JSON موحد في لارفيل يحتوي على `{ success: boolean, message: string, data: object, code: number }`. إذا كانت حالة الرمز بين 200 و 299 تكون success بـ true، وإلا false.',
    category: 'laravel',
    difficulty: 'medium',
    boilerplateCode: `function formatApiResponse(data, message, statusCode = 200) {
  // Construct standard Laravel API response structure
  return {};
}`,
    testCode: `
const okRes = formatApiResponse({ id: 10, name: 'Laravel' }, 'Fetched successfully', 200);
if (!okRes.success) throw new Error('Status code 200 must set success to true.');
if (okRes.code !== 200) throw new Error('Code field must equal 200.');
if (okRes.message !== 'Fetched successfully') throw new Error('Message field mismatch.');
if (okRes.data.name !== 'Laravel') throw new Error('Data payload mismatch.');

const errRes = formatApiResponse(null, 'Resource not found', 404);
if (errRes.success !== false) throw new Error('Status code 404 must set success to false.');
if (errRes.code !== 404) throw new Error('Code field must equal 404.');
`,
    points: 50,
    hintEn: 'Return { success: statusCode >= 200 && statusCode < 300, message, data, code: statusCode }.',
    hintAr: 'أرجع كائنا يحتوي على البيانات وتكون الخاصية success صحيحة فقط عندما يكون رمز الحالة في نطاق 200 إلى 299.'
  },
  {
    id: 'challenge-backend-jwt-auth',
    titleEn: 'Backend JWT Header Authenticator',
    titleAr: 'متحقق توكنات JWT للباك إند',
    descEn: 'Write a function `verifyAuthHeader(authHeader)` that extracts the token from a `Bearer <token>` string. If the header is missing, improperly formatted, or the token string is under 10 chars, throw an Error with message `"Unauthorized"`. Otherwise, return the clean token string.',
    descAr: 'اكتب دالة `verifyAuthHeader(authHeader)` تستخرج التوكن من سلسلة `Bearer <token>`. إذا كان الترويسة مفقودة أو غير مصاغة بشكل صحيح أو أن التوكن أقل من 10 أحرف، قم بإلقاء خطأ برمالة `"Unauthorized"`. بخلاف ذلك أرجع نص التوكن النظيف.',
    category: 'backend',
    difficulty: 'hard',
    boilerplateCode: `function verifyAuthHeader(authHeader) {
  // Validate Authorization header format and token length
  return "";
}`,
    testCode: `
let errorMsg = "";
try {
  verifyAuthHeader(null);
} catch(e) {
  errorMsg = e.message;
}
if (errorMsg !== 'Unauthorized') throw new Error('Missing authHeader must throw "Unauthorized".');

try {
  verifyAuthHeader("Basic 1234567890123");
} catch(e) {
  errorMsg = e.message;
}
if (errorMsg !== 'Unauthorized') throw new Error('Non-Bearer token must throw "Unauthorized".');

const cleanToken = verifyAuthHeader("Bearer eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIxMjM0NTY3ODkwIn0");
if (cleanToken !== "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIxMjM0NTY3ODkwIn0") {
  throw new Error('Valid Bearer header should return clean token string. Got: ' + cleanToken);
}
`,
    points: 70,
    hintEn: 'Check if authHeader starts with "Bearer ". Split by space, check token length >= 10, throw new Error("Unauthorized") if invalid.',
    hintAr: 'تأكد من بدء الترويسة بـ "Bearer " وقص النص للحصول على التوكن واختبار طوله، ثم ارفع خطأ باسم Unauthorized عند الفشل.'
  },
  {
    id: 'challenge-laravel-eloquent-scope',
    titleEn: 'Laravel Eloquent Scope & Filter',
    titleAr: 'تطبيق النطاقات المخصصة في Laravel Eloquent',
    descEn: 'Write a function `filterProducts(products, minPrice, category)` that mimics Eloquent local query scopes. Filter products where `price >= minPrice` and `category` matches (if provided). Return an array of sorted products by price ascending.',
    descAr: 'اكتب دالة `filterProducts(products, minPrice, category)` تحاكي نطاقات استعلام Eloquent المحلية. أعد المنتجات التي سعرها أكبر من أو يساوي `minPrice` والمطابقة لـ `category` (إن وجد). أرجع مصفوفة من المنتجات المفلترة والمرتبة تصاعدياً حسب السعر.',
    category: 'laravel',
    difficulty: 'medium',
    boilerplateCode: `function filterProducts(products, minPrice = 0, category = null) {
  // Filter products by minPrice and optional category
  // Return sorted array by price ascending
  return [];
}`,
    testCode: `
const items = [
  { id: 1, name: 'Laptop', price: 1200, category: 'tech' },
  { id: 2, name: 'Mouse', price: 25, category: 'tech' },
  { id: 3, name: 'Desk', price: 300, category: 'furniture' },
  { id: 4, name: 'Monitor', price: 400, category: 'tech' }
];

const res1 = filterProducts(items, 100, 'tech');
if (res1.length !== 2) throw new Error('Expected 2 tech products >= 100 (Monitor, Laptop). Got: ' + res1.length);
if (res1[0].name !== 'Monitor' || res1[1].name !== 'Laptop') {
  throw new Error('Expected ascending price order [Monitor 400, Laptop 1200].');
}

const res2 = filterProducts(items, 0, null);
if (res2.length !== 4) throw new Error('Null category should return all products sorted by price.');
if (res2[0].price !== 25) throw new Error('Cheapest item (Mouse 25) must be first.');
`,
    points: 60,
    hintEn: 'Use .filter() on products checking price >= minPrice and (!category || p.category === category), then .sort((a,b) => a.price - b.price).',
    hintAr: 'استخدم filter للاختبار على السعر والفئة، ثم sort للترتيب حسب السعر تصاعدياً.'
  },
  {
    id: 'challenge-mysql-join-query',
    titleEn: 'MySQL Inner Join & User Metrics Builder',
    titleAr: 'استعلام MySQL المعقد مع الدمج والتجميع',
    descEn: 'Write a function `buildUserOrderMetricsQuery()` that generates a MySQL query joining `users` (u) and `orders` (o) on `u.id = o.user_id`. Select `u.id`, `u.email`, `COUNT(o.id) AS total_orders`, and `SUM(o.total) AS lifetime_value`, grouping by `u.id` and ordering by `lifetime_value` DESC.',
    descAr: 'اكتب دالة `buildUserOrderMetricsQuery()` تولّد استعلام MySQL يدمج جدولين `users` (u) و `orders` (o) بشرط `u.id = o.user_id`. يجب تحديد `u.id` و `u.email` و `COUNT(o.id) AS total_orders` و `SUM(o.total) AS lifetime_value` والتجميع حسب `u.id` والترتيب حسب `lifetime_value` تنازلياً.',
    category: 'mysql',
    difficulty: 'hard',
    boilerplateCode: `function buildUserOrderMetricsQuery() {
  // Return the SQL string
  return "";
}`,
    testCode: `
const sql = buildUserOrderMetricsQuery().toLowerCase().replace(/\\s+/g, ' ');
if (!sql.includes('select u.id') && !sql.includes('select u.id,')) throw new Error('SQL must select u.id.');
if (!sql.includes('u.email')) throw new Error('SQL must select u.email.');
if (!sql.includes('count(o.id) as total_orders')) throw new Error('SQL must count orders as total_orders.');
if (!sql.includes('sum(o.total) as lifetime_value')) throw new Error('SQL must sum order totals as lifetime_value.');
if (!sql.includes('from users u') && !sql.includes('from users as u')) throw new Error('SQL must select FROM users u.');
if (!sql.includes('join orders o') && !sql.includes('join orders as o')) throw new Error('SQL must JOIN orders o.');
if (!sql.includes('on u.id = o.user_id') && !sql.includes('on o.user_id = u.id')) throw new Error('SQL must JOIN ON u.id = o.user_id.');
if (!sql.includes('group by u.id')) throw new Error('SQL must GROUP BY u.id.');
if (!sql.includes('order by lifetime_value desc')) throw new Error('SQL must ORDER BY lifetime_value DESC.');
`,
    points: 80,
    hintEn: 'SELECT u.id, u.email, COUNT(o.id) AS total_orders, SUM(o.total) AS lifetime_value FROM users u JOIN orders o ON u.id = o.user_id GROUP BY u.id ORDER BY lifetime_value DESC',
    hintAr: 'ابنِ الاستعلام مستخدماً JOIN بين الجدولين وحساب مجاميع القياسات مع GROUP BY و ORDER BY DESC.'
  },
  {
    id: 'challenge-php-di-container',
    titleEn: 'PHP Dependency Injection & Service Registry',
    titleAr: 'نموذج حقن التبعيات وحاوية الخدمات في PHP',
    descEn: 'Write a class `ServiceContainer` with methods `bind(name, resolver)` and `make(name)`. `bind` registers a service factory function. `make` executes the factory function to return the resolved instance. Throw an Error `"Service not found"` if the service is not bound.',
    descAr: 'اكتب كلاس `ServiceContainer` بطرق `bind(name, resolver)` و `make(name)`. تقوم `bind` بتسجيل دالة مصنع الخدمة، و `make` بتنفيذ الدالة لإرجاع النسخة المحلولة. ارفع خطأ برمالة `"Service not found"` إذا كانت الخدمة غير مسجلة.',
    category: 'php',
    difficulty: 'expert',
    boilerplateCode: `class ServiceContainer {
  constructor() {
    this.bindings = new Map();
  }

  bind(name, resolver) {
    // Bind service resolver
  }

  make(name) {
    // Resolve service instance or throw "Service not found"
  }
}`,
    testCode: `
const container = new ServiceContainer();
container.bind('db', () => ({ connection: 'mysql_connected' }));

const db = container.make('db');
if (!db || db.connection !== 'mysql_connected') {
  throw new Error('Container failed to resolve bound "db" service.');
}

let err = "";
try {
  container.make('non_existent');
} catch(e) {
  err = e.message;
}
if (err !== 'Service not found') {
  throw new Error('Expected "Service not found" error when resolving unbound service.');
}
`,
    points: 90,
    hintEn: 'Store resolvers in `this.bindings.set(name, resolver)`. In `make`, check if `this.bindings.has(name)`, then call `this.bindings.get(name)()`.',
    hintAr: 'خزن الدوال في Map باسم bindings. وفي make تحقق من وجود الخدمة ثم استدعِ الدالة المربوطة.'
  }
];

export function getChallengesByTrack(track: 'frontend' | 'backend' | 'fullstack'): CodingChallenge[] {
  return CODING_CHALLENGES.filter(c => {
    if (track === 'fullstack') return true;
    if (track === 'backend') {
      return ['php', 'laravel', 'mysql', 'backend'].includes(c.category);
    }
    return ['html', 'css', 'javascript', 'react'].includes(c.category);
  });
}

