/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Play, 
  CheckCircle2, 
  XCircle, 
  Terminal, 
  Sparkles, 
  Cpu, 
  ShieldCheck, 
  FileCode, 
  RefreshCw, 
  Copy, 
  Check, 
  Layers, 
  Send, 
  AlertTriangle, 
  Bug,
  Gauge,
  Sliders
} from 'lucide-react';
import { motion } from 'motion/react';

interface TestSuite {
  id: string;
  nameEn: string;
  nameAr: string;
  framework: 'Playwright E2E' | 'React Testing Library' | 'Jest Unit' | 'Postman API';
  descriptionEn: string;
  descriptionAr: string;
  code: string;
  steps: {
    titleEn: string;
    titleAr: string;
    selector?: string;
    expected: string;
    status: 'passed' | 'failed' | 'pending';
    durationMs: number;
  }[];
}

const PRESET_TEST_SUITES: TestSuite[] = [
  {
    id: 'e2e-checkout',
    nameEn: 'Playwright E2E: User Checkout & Payment Verification',
    nameAr: 'اختبار بلاي رايت الشامل: عملية الدفع وإتمام الطلب',
    framework: 'Playwright E2E',
    descriptionEn: 'Automated end-to-end user flow testing cart addition, coupon validation, and payment submission.',
    descriptionAr: 'اختبار مؤتمت كامل من البداية للنهاية لإضافة السلة، تفعيل الكوبون، وإتمام عملية الشراء.',
    code: `import { test, expect } from '@playwright/test';

test('completes e-commerce checkout flow successfully', async ({ page }) => {
  // 1. Navigate to store page
  await page.goto('https://app.store.com/checkout');
  
  // 2. Fill customer details
  await page.fill('[data-testid="customer-email"]', 'engineer.karim@example.com');
  await page.fill('[data-testid="coupon-code"]', 'PROMO2026');
  await page.click('button:has-text("Apply")');

  // 3. Assert coupon discount applied
  await expect(page.locator('.discount-badge')).toBeVisible();
  await expect(page.locator('.total-price')).toHaveText('$80.00');

  // 4. Submit order
  await page.click('button[type="submit"]');
  await expect(page.locator('h1')).toHaveText('Order Confirmed!');
});`,
    steps: [
      { titleEn: 'Navigate to Checkout URL', titleAr: 'الانتقال لرابط الدفع', selector: 'https://app.store.com/checkout', expected: 'HTTP 200 OK', status: 'passed', durationMs: 142 },
      { titleEn: 'Fill Customer Inputs', titleAr: 'ملء بيانات العميل والكوبون', selector: '[data-testid="customer-email"]', expected: 'Inputs Populated', status: 'passed', durationMs: 88 },
      { titleEn: 'Verify Coupon Calculation', titleAr: 'التحقق من الخصم وشارة العرض', selector: '.discount-badge', expected: 'Visible & $80.00 Total', status: 'passed', durationMs: 65 },
      { titleEn: 'Submit Order Payload', titleAr: 'تأكيد وإرسال شحنة الطلب', selector: 'button[type="submit"]', expected: 'Header = Order Confirmed!', status: 'passed', durationMs: 210 }
    ]
  },
  {
    id: 'rtl-search',
    nameEn: 'React Testing Library: Dynamic Filter & Debounce',
    nameAr: 'مكتبة اختبار ريأكت: تصفية البيانات والفلترة الديناميكية',
    framework: 'React Testing Library',
    descriptionEn: 'Component level user interaction assertion verifying debounce timer and DOM list re-rendering.',
    descriptionAr: 'اختبار تفاعل المستخدم مع المكون للتحقق من مؤقت الانتظار وإعادة عرض العناصر بحسب الفلترة.',
    code: `import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { SearchPanel } from './SearchPanel';

test('filters candidate questions by category on query input', async () => {
  render(<SearchPanel category="testing" />);

  const searchInput = screen.getByRole('textbox', { name: /search/i });
  fireEvent.change(searchInput, { target: { value: 'Playwright' } });

  await waitFor(() => {
    const listItems = screen.getAllByTestId('question-item');
    expect(listItems).toHaveLength(3);
    expect(screen.getByText(/Page Object Model/i)).toBeInTheDocument();
  });
});`,
    steps: [
      { titleEn: 'Render SearchPanel Component', titleAr: 'عرض مكون شريط البحث في الـ DOM', selector: '<SearchPanel />', expected: 'DOM Mounted', status: 'passed', durationMs: 45 },
      { titleEn: 'Simulate Keypress Query Input', titleAr: 'محاكاة إدخال نص البحث في الحقل', selector: 'input[role="textbox"]', expected: 'value = "Playwright"', status: 'passed', durationMs: 32 },
      { titleEn: 'Wait for Debounce Async Resolution', titleAr: 'انتظار اكتمال دالة التأخير غير المتزامنة', selector: 'waitFor()', expected: 'Resolved < 300ms', status: 'passed', durationMs: 110 },
      { titleEn: 'Assert DOM List Length & Match Text', titleAr: 'تأكيد عدد نتائج القائمة ومطابقة النص', selector: 'screen.getAllByTestId()', expected: 'Length === 3', status: 'passed', durationMs: 28 }
    ]
  },
  {
    id: 'jest-auth',
    nameEn: 'Jest Unit: JWT Token Validation & Expiry Guard',
    nameAr: 'اختبارات Jest الذاتية: التحقق من انقضاء توكن الأمان',
    framework: 'Jest Unit',
    descriptionEn: 'Unit test verifying cryptographic token parsing and automatic refresh trigger on expiration.',
    descriptionAr: 'اختبار وحدة للتحقق من فك تشفير التوكن وتفعيل التحديث التلقائي عند انتهاء الصلاحية.',
    code: `import { isTokenValid, refreshToken } from '../lib/authGuard';

describe('JWT Auth Security Guard', () => {
  it('returns false for expired timestamp and requests fresh payload', () => {
    const mockExpiredToken = {
      exp: Math.floor(Date.now() / 1000) - 3600, // 1 hour ago
      user: 'Eng. Karim'
    };

    const isValid = isTokenValid(mockExpiredToken);
    expect(isValid).toBe(false);

    const newToken = refreshToken(mockExpiredToken);
    expect(newToken.exp).toBeGreaterThan(Math.floor(Date.now() / 1000));
  });
});`,
    steps: [
      { titleEn: 'Create Expired Token Mock', titleAr: 'إنشاء توكن وهمي منتهي الصلاحية', expected: 'exp < Date.now()', status: 'passed', durationMs: 12 },
      { titleEn: 'Execute isTokenValid() Guard', titleAr: 'تنفيذ فحص الصلاحية', expected: 'Returns false', status: 'passed', durationMs: 8 },
      { titleEn: 'Trigger refreshToken() Service', titleAr: 'استدعاء خدمة تجديد التوكن', expected: 'Returns Fresh Signed Token', status: 'passed', durationMs: 42 },
      { titleEn: 'Assert Fresh Expiry Timestamp', titleAr: 'تأكيد الوقت الجديد للتجربة', expected: 'exp > Current Time', status: 'passed', durationMs: 5 }
    ]
  },
  {
    id: 'postman-api',
    nameEn: 'Postman / Supertest: REST API Order Schema Guard',
    nameAr: 'اختبار واجهات البرمجة: صحة وهيكل استجابة طلبات الهيدر',
    framework: 'Postman API',
    descriptionEn: 'HTTP endpoint integration assertion validating response schema, authorization headers, and status code 201.',
    descriptionAr: 'اختبار تكامل واجهة برمجة التقييم للتحقق من العناوين الشفرية ورمز الاستجابة 201 Created.',
    code: `import request from 'supertest';
import app from '../server';

describe('POST /api/v1/orders Endpoint QA', () => {
  it('rejects unauthorized payloads and creates order on valid token', async () => {
    // 1. Test 401 Unauthorized
    await request(app)
      .post('/api/v1/orders')
      .send({ items: [] })
      .expect(401);

    // 2. Test 201 Created with Bearer
    const response = await request(app)
      .post('/api/v1/orders')
      .set('Authorization', 'Bearer valid_qa_token_2026')
      .send({ items: [{ id: 'Q1', qty: 2 }] })
      .expect(201);

    expect(response.body).toHaveProperty('orderId');
    expect(response.body.status).toBe('CONFIRMED');
  });
});`,
    steps: [
      { titleEn: 'POST /api/v1/orders Without Auth Header', titleAr: 'إرسال طلب بدون ترويسة مصادقة', expected: 'HTTP 401 Unauthorized', status: 'passed', durationMs: 84 },
      { titleEn: 'Set Bearer Authorization Token', titleAr: 'إرفاق مفتاح المصادقة التشفيري', expected: 'Header Attached', status: 'passed', durationMs: 15 },
      { titleEn: 'Send JSON Payload & Assert 201', titleAr: 'إرسال البيانات والتحقق من رمز 201', expected: 'HTTP 201 Created', status: 'passed', durationMs: 140 },
      { titleEn: 'Validate Response Schema Keys', titleAr: 'فحص مطابقة الحقول المفتاحية', expected: 'orderId exists & status = CONFIRMED', status: 'passed', durationMs: 18 }
    ]
  }
];

export const WebTestingStudio: React.FC = () => {
  const { lang, isRtl } = useApp();
  const isAr = lang === 'ar';

  const [activeSuiteIdx, setActiveSuiteIdx] = useState(0);
  const activeSuite = PRESET_TEST_SUITES[activeSuiteIdx];

  const [isRunning, setIsRunning] = useState(false);
  const [testProgress, setTestProgress] = useState(100);
  const [executionLogs, setExecutionLogs] = useState<string[]>([
    'QA Automation Suite Initialized.',
    'Ready to execute test runner engine.'
  ]);
  const [copied, setCopied] = useState(false);

  // Bug Report Form State
  const [bugTitle, setBugTitle] = useState('Checkout coupon calculation failed on mobile viewports');
  const [bugSeverity, setBugSeverity] = useState<'critical' | 'high' | 'medium'>('high');
  const [bugReportGenerated, setBugReportGenerated] = useState(false);

  const runAutomatedTest = () => {
    setIsRunning(true);
    setTestProgress(0);
    setExecutionLogs([
      `[RUNNER] Launching ${activeSuite.framework} Engine...`,
      `[SUITE] Executing ${activeSuite.nameEn}...`
    ]);

    let step = 0;
    const interval = setInterval(() => {
      step++;
      const currentStepObj = activeSuite.steps[step - 1];
      if (currentStepObj) {
        setExecutionLogs(prev => [
          ...prev,
          `[STEP ${step}/${activeSuite.steps.length}] ${currentStepObj.titleEn} (${currentStepObj.durationMs}ms) -> ${currentStepObj.expected} [PASSED]`
        ]);
        setTestProgress((step / activeSuite.steps.length) * 100);
      }

      if (step >= activeSuite.steps.length) {
        clearInterval(interval);
        setIsRunning(false);
        setExecutionLogs(prev => [
          ...prev,
          `--------------------------------------------------`,
          `[RESULT] ALL ${activeSuite.steps.length} ASSERTIONS PASSED (100% Coverage)`,
          `[PERF] Total Execution Latency: ${activeSuite.steps.reduce((acc, s) => acc + s.durationMs, 0)}ms`
        ]);
      }
    }, 450);
  };

  const copyCodeToClipboard = () => {
    navigator.clipboard.writeText(activeSuite.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-10 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header Hero Section */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-lime-950/20 to-slate-950 p-6 md:p-10 border border-lime-500/30 shadow-2xl shadow-lime-500/5">
          <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 bg-lime-500/10 rounded-full blur-3xl pointer-events-none" />
          
          <div className="relative flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="space-y-3">
              <div className="flex items-center space-x-3 rtl:space-x-reverse">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-lime-500 to-emerald-600 flex items-center justify-center shadow-lg shadow-lime-500/20">
                  <ShieldCheck className="w-7 h-7 text-slate-950" strokeWidth={2.5} />
                </div>
                <div>
                  <span className="text-xs font-black text-lime-400 uppercase tracking-widest block">
                    {isAr ? 'معمل اختبارات الأتمتة والجودة اليدوية والمؤتمتة' : 'QA Automation & Web Testing Studio'}
                  </span>
                  <h1 className="text-2xl md:text-3xl font-black text-white tracking-tight">
                    {isAr ? 'بيئة تشغيل وفحص اختبارات الويب والـ APIs' : 'Live E2E, Unit & API Test Execution Lab'}
                  </h1>
                </div>
              </div>
              <p className="text-xs md:text-sm text-slate-400 max-w-2xl leading-relaxed">
                {isAr 
                  ? 'اختبر جودة تطبيقات الويب باستخدام أحدث أطر أتمتة الاختبار عالمياً (Playwright, Jest, React Testing Library, Postman). قم بتشغيل الاختبارات حياً، تحقق من صحة النتائج، وأنشئ تقارير الأخطاء الاحترافية.'
                  : 'Execute real-time test suites, inspect DOM selector assertions, verify API endpoints, and generate standardized bug tickets.'}
              </p>
            </div>

            <button
              onClick={runAutomatedTest}
              disabled={isRunning}
              className="w-full md:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-lime-500 to-emerald-500 hover:from-lime-400 hover:to-emerald-400 text-slate-950 font-black text-sm shadow-xl shadow-lime-500/20 transition-all flex items-center justify-center space-x-2 rtl:space-x-reverse hover:scale-105 active:scale-95 disabled:opacity-50"
            >
              {isRunning ? <RefreshCw className="w-5 h-5 animate-spin" /> : <Play className="w-5 h-5 fill-slate-950" />}
              <span>{isRunning ? (isAr ? 'جاري تنفيذ الاختبارات...' : 'Executing Test Suite...') : (isAr ? 'تشغيل حزمة الاختبار الآن' : 'Run Live Test Suite')}</span>
            </button>
          </div>
        </div>

        {/* Test Suite Selector Tabs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {PRESET_TEST_SUITES.map((suite, idx) => {
            const isSelected = activeSuiteIdx === idx;
            return (
              <button
                key={suite.id}
                onClick={() => setActiveSuiteIdx(idx)}
                className={`p-5 rounded-2xl border text-right rtl:text-right ltr:text-left transition-all duration-200 relative overflow-hidden flex flex-col justify-between ${
                  isSelected 
                    ? 'bg-slate-900 border-lime-500/60 shadow-lg shadow-lime-500/10 text-white' 
                    : 'bg-slate-950/60 border-slate-800/80 hover:border-slate-700 text-slate-400'
                }`}
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className={`text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-md border ${
                      isSelected ? 'bg-lime-500/20 text-lime-400 border-lime-500/40' : 'bg-slate-800 text-slate-400 border-slate-700'
                    }`}>
                      {suite.framework}
                    </span>
                    <CheckCircle2 className={`w-4 h-4 ${isSelected ? 'text-lime-400' : 'text-slate-700'}`} />
                  </div>
                  <h3 className="font-bold text-sm text-slate-200 line-clamp-1">
                    {isAr ? suite.nameAr : suite.nameEn}
                  </h3>
                  <p className="text-[11px] text-slate-400 line-clamp-2">
                    {isAr ? suite.descriptionAr : suite.descriptionEn}
                  </p>
                </div>
              </button>
            );
          })}
        </div>

        {/* Main Testing Execution Split Stage */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: Code Editor & Assertion Inspector (7 Cols) */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Code View Card */}
            <div className="bg-slate-900/90 rounded-2xl border border-slate-800 overflow-hidden shadow-xl">
              <div className="bg-slate-950 px-5 py-3 border-b border-slate-800/80 flex items-center justify-between">
                <div className="flex items-center space-x-2 rtl:space-x-reverse">
                  <FileCode className="w-4 h-4 text-lime-400" />
                  <span className="text-xs font-mono font-bold text-slate-300">
                    {activeSuite.framework.toLowerCase().replace(/\s+/g, '-')}.spec.ts
                  </span>
                </div>

                <button
                  onClick={copyCodeToClipboard}
                  className="flex items-center space-x-1.5 rtl:space-x-reverse text-[11px] font-bold text-slate-400 hover:text-white bg-slate-800 px-3 py-1 rounded-lg border border-slate-700 transition-colors"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? (isAr ? 'تم النسخ' : 'Copied') : (isAr ? 'نسخ الكود' : 'Copy Code')}</span>
                </button>
              </div>

              <div className="p-4 bg-slate-950 font-mono text-xs text-lime-300 overflow-x-auto max-h-[380px] leading-relaxed">
                <pre>{activeSuite.code}</pre>
              </div>
            </div>

            {/* Test Assertion Step Progress */}
            <div className="bg-slate-900/90 p-6 rounded-2xl border border-slate-800 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-extrabold text-sm text-white flex items-center gap-2">
                  <Sliders className="w-4 h-4 text-lime-400" />
                  {isAr ? 'مراحل ومحطات التحقق من الاختبار' : 'Assertion Step Breakdown'}
                </h3>
                <span className="text-xs font-mono text-lime-400 font-bold bg-lime-500/10 px-2.5 py-1 rounded-lg border border-lime-500/30">
                  {activeSuite.steps.length} {isAr ? 'محطات مؤتمتة' : 'Steps'}
                </span>
              </div>

              <div className="space-y-3">
                {activeSuite.steps.map((step, idx) => (
                  <div key={idx} className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800/80 flex items-center justify-between text-xs">
                    <div className="flex items-center space-x-3 rtl:space-x-reverse">
                      <div className="w-6 h-6 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center font-mono font-bold text-[10px]">
                        {idx + 1}
                      </div>
                      <div>
                        <span className="font-bold text-slate-200 block">
                          {isAr ? step.titleAr : step.titleEn}
                        </span>
                        {step.selector && (
                          <span className="font-mono text-[10px] text-slate-500">
                            Selector: {step.selector}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="text-right rtl:text-left space-y-0.5">
                      <span className="text-[11px] font-mono text-emerald-400 font-extrabold flex items-center justify-end gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" /> {step.expected}
                      </span>
                      <span className="text-[10px] font-mono text-slate-500 block">
                        {step.durationMs}ms
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Right Column: Execution Terminal & Bug Generator (5 Cols) */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Live Terminal Output Console */}
            <div className="bg-slate-950 rounded-2xl border border-slate-800 overflow-hidden shadow-2xl flex flex-col h-[340px]">
              <div className="bg-slate-900 px-4 py-3 border-b border-slate-800 flex items-center justify-between">
                <div className="flex items-center space-x-2 rtl:space-x-reverse">
                  <Terminal className="w-4 h-4 text-lime-400" />
                  <span className="text-xs font-mono font-extrabold text-slate-200">
                    QA Execution Terminal
                  </span>
                </div>
                <div className="flex space-x-1.5 rtl:space-x-reverse">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
                  <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/80" />
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
                </div>
              </div>

              {/* Progress bar */}
              <div className="w-full bg-slate-900 h-1">
                <div 
                  className="bg-gradient-to-r from-lime-500 to-emerald-400 h-full transition-all duration-300"
                  style={{ width: `${testProgress}%` }}
                />
              </div>

              <div className="p-4 font-mono text-[11px] text-slate-300 space-y-1.5 overflow-y-auto flex-1 leading-relaxed bg-slate-950">
                {executionLogs.map((log, index) => (
                  <div 
                    key={index} 
                    className={
                      log.includes('PASSED') ? 'text-emerald-400 font-bold' :
                      log.includes('RUNNER') ? 'text-cyan-400' :
                      log.includes('RESULT') ? 'text-amber-400 font-bold' : 'text-slate-400'
                    }
                  >
                    {log}
                  </div>
                ))}
              </div>
            </div>

            {/* QA Bug Report Generator */}
            <div className="bg-slate-900/90 p-6 rounded-2xl border border-slate-800 space-y-4">
              <div className="flex items-center space-x-2 rtl:space-x-reverse">
                <Bug className="w-5 h-5 text-red-400" />
                <h3 className="font-extrabold text-sm text-white">
                  {isAr ? 'مولد تقارير الثغرات والأخطاء (Bug Ticket Generator)' : 'QA Defect Ticket Generator'}
                </h3>
              </div>

              <div className="space-y-3 text-xs">
                <div>
                  <label className="block text-slate-400 font-bold mb-1">
                    {isAr ? 'عنوان الخطأ البرمجي:' : 'Bug Title:'}
                  </label>
                  <input
                    type="text"
                    value={bugTitle}
                    onChange={(e) => setBugTitle(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-sans focus:outline-none focus:border-lime-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 font-bold mb-1">
                    {isAr ? 'مستوى الخطورة (Severity):' : 'Severity:'}
                  </label>
                  <select
                    value={bugSeverity}
                    onChange={(e) => setBugSeverity(e.target.value as any)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-sans focus:outline-none focus:border-lime-500"
                  >
                    <option value="critical">Critical / حرج جداً</option>
                    <option value="high">High / مرتفع الخطورة</option>
                    <option value="medium">Medium / متوسط</option>
                  </select>
                </div>

                <button
                  onClick={() => setBugReportGenerated(true)}
                  className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-bold transition-colors flex items-center justify-center space-x-2 rtl:space-x-reverse"
                >
                  <Send className="w-3.5 h-3.5 text-lime-400" />
                  <span>{isAr ? 'توليد تذكرة الخطأ المنسقة' : 'Generate Formatted Ticket'}</span>
                </button>

                {bugReportGenerated && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-4 bg-slate-950 rounded-xl border border-red-500/30 space-y-2 font-mono text-[10px] text-slate-300"
                  >
                    <div className="text-red-400 font-bold">[BUG TICKET #{Math.floor(Math.random() * 9000) + 1000}]</div>
                    <div><strong>Title:</strong> {bugTitle}</div>
                    <div><strong>Severity:</strong> {bugSeverity.toUpperCase()}</div>
                    <div><strong>Engine:</strong> Eng. Karim Mohamadi QA Protocol</div>
                    <div><strong>Repro Script:</strong> npx playwright test {activeSuite.id}.spec.ts</div>
                    <div className="text-emerald-400 pt-1">✓ Saved to QA defect registry.</div>
                  </motion.div>
                )}
              </div>
            </div>

          </div>

        </div>

        {/* CI/CD Pipeline Simulator & Code Coverage Matrix */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-4">
          
          {/* CI/CD Pipeline Execution Stages (7 Cols) */}
          <div className="lg:col-span-7 bg-slate-900/90 p-6 rounded-2xl border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2.5 rtl:space-x-reverse">
                <Layers className="w-5 h-5 text-lime-400" />
                <h3 className="font-extrabold text-sm text-white">
                  {isAr ? 'محاكي خط أنابيب الأتمتة والنشر المستمر (CI/CD Pipeline Simulator)' : 'CI/CD Automated Deployment Pipeline'}
                </h3>
              </div>
              <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-md border border-emerald-500/30">
                ● GitHub Actions Active
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 pt-2">
              {[
                { stage: '1. Lint & Types', status: 'Passed', icon: '⚡', time: '12s' },
                { stage: '2. Unit Tests', status: 'Passed', icon: '🧪', time: '34s' },
                { stage: '3. E2E Playwright', status: 'Passed', icon: '🎭', time: '1m 10s' },
                { stage: '4. Security Audit', status: 'Passed', icon: '🛡️', time: '18s' },
                { stage: '5. Production Push', status: 'Deployed', icon: '🚀', time: '22s' }
              ].map((p, i) => (
                <div key={i} className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-center space-y-1 hover:border-lime-500/40 transition-colors">
                  <div className="text-lg">{p.icon}</div>
                  <span className="text-[11px] font-bold text-slate-200 block truncate">{p.stage}</span>
                  <div className="flex items-center justify-center space-x-1 rtl:space-x-reverse text-[9px] text-emerald-400 font-mono">
                    <CheckCircle2 className="w-3 h-3" />
                    <span>{p.status} ({p.time})</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Code Coverage Heatmap Matrix (5 Cols) */}
          <div className="lg:col-span-5 bg-slate-900/90 p-6 rounded-2xl border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2.5 rtl:space-x-reverse">
                <Gauge className="w-5 h-5 text-lime-400" />
                <h3 className="font-extrabold text-sm text-white">
                  {isAr ? 'مصفوفة تغطية الكود (Code Coverage Heatmap)' : 'Code Coverage Matrix (Istanbul/V8)'}
                </h3>
              </div>
              <span className="text-[10px] font-mono font-black text-lime-400">
                Overall: 95.6%
              </span>
            </div>

            <div className="space-y-3">
              {[
                { label: 'Statements / البيانات البرمجية', val: 96.4, color: 'from-lime-500 to-emerald-400' },
                { label: 'Branches / المسارات الشرطية', val: 92.1, color: 'from-emerald-500 to-teal-400' },
                { label: 'Functions / الدوال والاقترانات', val: 98.0, color: 'from-teal-400 to-cyan-400' },
                { label: 'Lines / أسطر الكود المغطاة', val: 95.8, color: 'from-lime-400 to-emerald-500' }
              ].map((cov, idx) => (
                <div key={idx} className="space-y-1">
                  <div className="flex justify-between text-[11px] font-mono text-slate-300">
                    <span>{cov.label}</span>
                    <span className="font-bold text-lime-400">{cov.val}%</span>
                  </div>
                  <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden border border-slate-800">
                    <div 
                      className={`h-full bg-gradient-to-r ${cov.color} transition-all duration-500`}
                      style={{ width: `${cov.val}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
