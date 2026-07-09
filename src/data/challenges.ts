/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Difficulty } from '../types';

export interface CodingChallenge {
  id: string;
  titleEn: string;
  titleAr: string;
  descEn: string;
  descAr: string;
  category: 'html' | 'css' | 'javascript' | 'react';
  difficulty: Difficulty;
  boilerplateCode: string;
  testCode: string; // Executable JS assertions that throw on failure
  points: number;
  hintEn: string;
  hintAr: string;
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
  }
];
