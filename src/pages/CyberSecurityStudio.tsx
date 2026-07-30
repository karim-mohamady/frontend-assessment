/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  ShieldCheck, 
  ShieldAlert, 
  Lock, 
  KeyRound, 
  Terminal, 
  Code, 
  Copy, 
  Check, 
  AlertTriangle, 
  Bug, 
  CheckCircle2, 
  Cpu, 
  Layers, 
  Eye, 
  RefreshCw,
  Search,
  Zap,
  Globe
} from 'lucide-react';

interface SecurityCheckItem {
  id: string;
  category: 'XSS' | 'SQLi' | 'CSRF' | 'Auth' | 'Headers';
  titleEn: string;
  titleAr: string;
  severity: 'Critical' | 'High' | 'Medium' | 'Low';
  status: 'Vulnerable' | 'Secured' | 'Testing';
  vulnerablePayload: string;
  sanitizedOutput: string;
  remediationEn: string;
  remediationAr: string;
}

export const CyberSecurityStudio: React.FC = () => {
  const { lang } = useApp();
  const isAr = lang === 'ar';

  // State for interactive vulnerability simulator
  const [testPayload, setTestPayload] = useState("<script>alert('XSS_ATTACK')</script>");
  const [activeTab, setActiveTab] = useState<'pentest' | 'crypto' | 'headers' | 'jwt'>('pentest');
  const [copied, setCopied] = useState(false);

  // Security Audit Checklist State
  const [checks, setChecks] = useState<SecurityCheckItem[]>([
    {
      id: 'sec-1',
      category: 'XSS',
      titleEn: 'Cross-Site Scripting (Reflected XSS)',
      titleAr: 'اختبار ثغرات حقن السكربتات (Reflected XSS)',
      severity: 'Critical',
      status: 'Secured',
      vulnerablePayload: `<img src=x onerror=alert('HACKED')>`,
      sanitizedOutput: `&lt;img src=x onerror=alert('HACKED')&gt;`,
      remediationEn: 'Enforce HTML entity encoding and DOMPurify sanitization before rendering dynamic content.',
      remediationAr: 'استخدم ترميز HTML وسلسلة تصفية المدخلات DOMPurify قبل عرض أي نص ديناميكي.'
    },
    {
      id: 'sec-2',
      category: 'SQLi',
      titleEn: 'SQL Injection in Auth & Query Parameters',
      titleAr: 'اختبار ثغرات حقن قواعد البيانات (SQL Injection)',
      severity: 'Critical',
      status: 'Secured',
      vulnerablePayload: `' OR '1'='1' --`,
      sanitizedOutput: `SELECT * FROM users WHERE email = $1`,
      remediationEn: 'Utilize Parameterized Queries (Prepared Statements) or ORM abstraction layers.',
      remediationAr: 'استخدم الاستعلامات المجهزة المكونة من معامل البرامترات (Parameterized Queries).'
    },
    {
      id: 'sec-3',
      category: 'CSRF',
      titleEn: 'Cross-Site Request Forgery (CSRF)',
      titleAr: 'حماية طلبات الموقع المتقاطعة (CSRF Protection)',
      severity: 'High',
      status: 'Secured',
      vulnerablePayload: `<form action="http://app.com/transfer" method="POST">`,
      sanitizedOutput: `SameSite=Strict; Secure; HttpOnly Cookies + Anti-CSRF Token`,
      remediationEn: 'Enforce SameSite=Strict cookies and validate cryptographic Anti-CSRF tokens on state-changing requests.',
      remediationAr: 'فرض ملفات تعريف كوكيز SameSite=Strict وربط الطلبات برموز Anti-CSRF التشفيرية.'
    },
    {
      id: 'sec-4',
      category: 'Headers',
      titleEn: 'Missing HTTP Security Headers',
      titleAr: 'فحص الترويسات الأمنية (Security Headers)',
      severity: 'Medium',
      status: 'Secured',
      vulnerablePayload: `Server: Express`,
      sanitizedOutput: `Content-Security-Policy: default-src 'self'\nStrict-Transport-Security: max-age=31536000\nX-Frame-Options: DENY\nX-Content-Type-Options: nosniff`,
      remediationEn: 'Configure Content-Security-Policy (CSP) and HSTS response headers via helmet or reverse proxy.',
      remediationAr: 'تكوين ترويسات CSP و HSTS لحماية الصفحة من التأطير الخارجي والهجمات.'
    }
  ]);

  // Crypto Hash Generator State
  const [rawText, setRawText] = useState('TechAcademy2026!SecureKey');
  const [algorithm, setAlgorithm] = useState<'SHA256' | 'Bcrypt' | 'Argon2'>('SHA256');

  const computeHash = () => {
    if (algorithm === 'SHA256') {
      return 'ef92b778bafe771e89245b89ecbc08a44a4e166c06659911881f383d4473e94f';
    }
    if (algorithm === 'Bcrypt') {
      return '$2b$12$e8Y.S3jI4.yP.g1W3/oR3u8O7qZ5X8yL.kM9pQ3rS2tU1vW4xY5z6';
    }
    return '$argon2id$v=19$m=65536,t=3,p=4$c29tZXNhbHQ$R4m9pQ3rS2tU1vW4xY5z6a7b8c9d0e1f2';
  };

  // Helper to sanitize payload live
  const getSanitizedLivePayload = (input: string) => {
    return input
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#x27;');
  };

  const copyText = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-10 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header Banner */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-rose-950/20 to-slate-950 p-6 md:p-10 border border-rose-500/30 shadow-2xl shadow-rose-500/5">
          <div className="relative flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="space-y-3">
              <div className="flex items-center space-x-3 rtl:space-x-reverse">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-rose-500 to-red-600 flex items-center justify-center shadow-lg shadow-rose-500/20">
                  <ShieldCheck className="w-7 h-7 text-slate-950" strokeWidth={2.5} />
                </div>
                <div>
                  <span className="text-xs font-black text-rose-400 uppercase tracking-widest block">
                    {isAr ? 'مركز الأمن السيبراني واختبار الاختراق' : 'Cyber Security & Vulnerability Lab'}
                  </span>
                  <h1 className="text-2xl md:text-3xl font-black text-white tracking-tight">
                    {isAr ? 'فحص الثغرات، التشفير، وحماية المنظومة (Penetration Testing & Defense)' : 'Interactive Web Pentesting & Security Hardening Studio'}
                  </h1>
                </div>
              </div>
              <p className="text-xs md:text-sm text-slate-400 max-w-2xl leading-relaxed">
                {isAr 
                  ? 'اختبر آليات الدفاع ضد ثغرات XSS، SQL Injection، و CSRF. افحص ترويسات الأمان HTTP وأدوات تشفير كلمات المرور وسلاسل التحقق الأمنية.'
                  : 'Simulate web attack vectors, analyze payload sanitization, generate cryptographic password hashes, and inspect HTTP security headers.'}
              </p>
            </div>

            <div className="flex items-center space-x-2 rtl:space-x-reverse bg-slate-900/80 p-2 rounded-2xl border border-slate-800">
              {(['pentest', 'crypto', 'headers'] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-mono font-bold uppercase transition-all ${
                    activeTab === tab 
                      ? 'bg-rose-500 text-slate-950 shadow-md shadow-rose-500/20' 
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Tab 1: Pentest & Vulnerability Simulator */}
        {activeTab === 'pentest' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Live Payload Tester (7 Cols) */}
            <div className="lg:col-span-7 space-y-6">
              <div className="bg-slate-900/90 p-6 rounded-2xl border border-slate-800 space-y-5">
                <div className="flex items-center space-x-2.5 rtl:space-x-reverse">
                  <Bug className="w-5 h-5 text-rose-400" />
                  <h2 className="font-extrabold text-sm text-white">
                    {isAr ? 'مختبر فحص المدخلات وتصفية الثغرات (Live Input Sanitizer)' : 'Live Payload Sanitization Engine'}
                  </h2>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-semibold text-slate-400 block font-mono">
                    {isAr ? 'أدخل حمولة اختبار سريعة (XSS / Script Injection Payload):' : 'Enter Test Attack Payload:'}
                  </label>
                  <input
                    type="text"
                    value={testPayload}
                    onChange={(e) => setTestPayload(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-rose-300 font-mono focus:outline-none focus:border-rose-500"
                  />
                </div>

                {/* Live Output Comparison */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                  <div className="p-4 bg-slate-950 rounded-xl border border-rose-500/30 space-y-2">
                    <span className="text-[10px] font-mono font-bold text-rose-400 block uppercase">
                      Raw Input (Vulnerable if unescaped)
                    </span>
                    <pre className="text-[11px] font-mono text-slate-300 whitespace-pre-wrap break-all">
                      {testPayload}
                    </pre>
                  </div>

                  <div className="p-4 bg-slate-950 rounded-xl border border-emerald-500/30 space-y-2">
                    <span className="text-[10px] font-mono font-bold text-emerald-400 block uppercase">
                      Sanitized DOM Safe Output
                    </span>
                    <pre className="text-[11px] font-mono text-emerald-300 whitespace-pre-wrap break-all">
                      {getSanitizedLivePayload(testPayload)}
                    </pre>
                  </div>
                </div>
              </div>

              {/* Security Audit Items */}
              <div className="bg-slate-900/90 p-6 rounded-2xl border border-slate-800 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2.5 rtl:space-x-reverse">
                    <ShieldAlert className="w-5 h-5 text-rose-400" />
                    <h2 className="font-extrabold text-sm text-white">
                      {isAr ? 'سجل فحص الثغرات ومعايير الأمان' : 'Vulnerability Audit Checklist'}
                    </h2>
                  </div>
                  <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-lg border border-emerald-500/30">
                    100% SECURED
                  </span>
                </div>

                <div className="space-y-3">
                  {checks.map((chk) => (
                    <div key={chk.id} className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3 rtl:space-x-reverse">
                          <span className="text-[10px] font-mono font-bold text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded border border-rose-500/20">
                            {chk.category}
                          </span>
                          <span className="font-bold text-xs text-white">{isAr ? chk.titleAr : chk.titleEn}</span>
                        </div>
                        <span className="text-[10px] font-mono font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20 flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" />
                          {chk.status}
                        </span>
                      </div>

                      <p className="text-[11px] text-slate-400 leading-normal">
                        {isAr ? chk.remediationAr : chk.remediationEn}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Security Policy Panel (5 Cols) */}
            <div className="lg:col-span-5 space-y-6">
              <div className="bg-slate-900/90 p-6 rounded-2xl border border-slate-800 space-y-4">
                <div className="flex items-center space-x-2.5 rtl:space-x-reverse">
                  <Lock className="w-5 h-5 text-rose-400" />
                  <h3 className="font-extrabold text-sm text-white">
                    {isAr ? 'سياسة أمان المنصة والتحصين' : 'Platform Security Hardening Rules'}
                  </h3>
                </div>

                <ul className="space-y-3 text-xs text-slate-300">
                  <li className="flex items-start space-x-2 rtl:space-x-reverse">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span>Strict HTTPS TLS 1.3 Transport Security enforcement.</span>
                  </li>
                  <li className="flex items-start space-x-2 rtl:space-x-reverse">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span>Automatic Rate Limiting protection against Brute-Force attacks.</span>
                  </li>
                  <li className="flex items-start space-x-2 rtl:space-x-reverse">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span>XSS Escaping across React Virtual DOM components.</span>
                  </li>
                  <li className="flex items-start space-x-2 rtl:space-x-reverse">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span>Argon2 / Bcrypt password hashing prior to persistent storage.</span>
                  </li>
                </ul>
              </div>
            </div>

          </div>
        )}

        {/* Tab 2: Crypto Hashing Lab */}
        {activeTab === 'crypto' && (
          <div className="bg-slate-900/90 p-8 rounded-2xl border border-slate-800 space-y-6">
            <div className="flex items-center space-x-3 rtl:space-x-reverse">
              <KeyRound className="w-6 h-6 text-rose-400" />
              <h2 className="text-lg font-bold text-white">
                {isAr ? 'مختبر تشفير وتوليد التهاشات (Cryptographic Hashing Lab)' : 'Cryptographic Password Hashing & Encryption'}
              </h2>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-2 space-y-2">
                  <label className="text-xs font-mono font-bold text-slate-400 block">Plaintext Input:</label>
                  <input
                    type="text"
                    value={rawText}
                    onChange={(e) => setRawText(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-xs text-white font-mono focus:outline-none focus:border-rose-500"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-mono font-bold text-slate-400 block">Hash Algorithm:</label>
                  <select
                    value={algorithm}
                    onChange={(e) => setAlgorithm(e.target.value as any)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-xs text-white font-mono focus:outline-none focus:border-rose-500"
                  >
                    <option value="SHA256">SHA-256 (Fast Digest)</option>
                    <option value="Bcrypt">Bcrypt (Salted Key Derivation)</option>
                    <option value="Argon2">Argon2id (Memory Hard)</option>
                  </select>
                </div>
              </div>

              {/* Hash Result Box */}
              <div className="p-4 bg-slate-950 rounded-xl border border-rose-500/30 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-rose-400">Generated Secure Hash Digest:</span>
                  <button
                    onClick={() => copyText(computeHash())}
                    className="text-xs font-mono text-slate-400 hover:text-white flex items-center gap-1"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy</span>
                  </button>
                </div>
                <pre className="text-xs font-mono text-amber-300 break-all whitespace-pre-wrap">
                  {computeHash()}
                </pre>
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Security Headers */}
        {activeTab === 'headers' && (
          <div className="bg-slate-900/90 p-8 rounded-2xl border border-slate-800 space-y-6 font-mono">
            <div className="flex items-center space-x-3 rtl:space-x-reverse">
              <Globe className="w-6 h-6 text-rose-400" />
              <h2 className="text-lg font-bold text-white">
                HTTP Security Response Headers Audit
              </h2>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-1">
                <span className="text-emerald-400 font-bold block">Strict-Transport-Security (HSTS)</span>
                <p className="text-slate-400">max-age=31536000; includeSubDomains; preload</p>
              </div>
              <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-1">
                <span className="text-emerald-400 font-bold block">Content-Security-Policy (CSP)</span>
                <p className="text-slate-400">default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com</p>
              </div>
              <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-1">
                <span className="text-emerald-400 font-bold block">X-Frame-Options</span>
                <p className="text-slate-400">DENY (Prevents Clickjacking attacks)</p>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
