/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { useApp } from '../context/AppContext';
import { Link } from 'react-router-dom';
import { 
  Code, 
  Github, 
  Terminal, 
  ShieldAlert, 
  Phone, 
  MessageCircle, 
  Sparkles, 
  CheckCircle2, 
  Cpu, 
  Layers, 
  Send, 
  UserCheck, 
  Globe,
  ExternalLink
} from 'lucide-react';

export const Footer: React.FC = () => {
  const { t, lang } = useApp();

  const isAr = lang === 'ar';
  const whatsappNumber = '201017238942';
  const displayPhone = '01017238942';
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent('السلام عليكم مهندس كريم، أريد التواصل بخصوص منصة التقييم البرمجي')}`;

  return (
    <footer className="bg-slate-950 border-t border-slate-900 pt-14 pb-8 text-slate-400 font-sans" id="global-footer">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Prominent Creator Signature Badge */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-amber-950/30 to-slate-900 p-6 md:p-8 border border-amber-500/30 shadow-2xl shadow-amber-500/5">
          <div className="absolute top-0 right-0 -mt-8 -mr-8 w-48 h-48 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 -mb-8 -ml-8 w-48 h-48 bg-orange-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center space-x-4 rtl:space-x-reverse">
              <div className="relative shrink-0">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-amber-500 via-orange-500 to-amber-300 p-0.5 shadow-lg shadow-amber-500/20">
                  <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
                    <UserCheck className="w-8 h-8 text-amber-400" />
                  </div>
                </div>
                <span className="absolute -bottom-1 -right-1 flex h-4 w-4">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-4 w-4 bg-emerald-500 border-2 border-slate-950"></span>
                </span>
              </div>

              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  <span className="text-xs font-black tracking-widest text-amber-400 uppercase">
                    {isAr ? 'المهندس المطور والمنفذ للنظام' : 'Lead Engineer & Creator'}
                  </span>
                </div>
                <h3 className="text-xl md:text-2xl font-black text-white tracking-tight">
                  {isAr ? 'تم الإنشاء بواسطة المهندس كريم محمدى' : 'Created & Engineered by Eng. Karim Mohamadi'}
                </h3>
                <p className="text-xs text-slate-400 mt-1 max-w-xl">
                  {isAr 
                    ? 'منصة برمجية متكاملة لتقييم واختبار مهارات المطوّرين، إعداد المقابلات التقنية، هندسة النظم، وتجهيز سيرتك الذاتية بأحدث معايير السوق العالمي.'
                    : 'A comprehensive engineering platform for developer assessments, technical interview prep, system architecture, and career development.'}
                </p>
              </div>
            </div>

            {/* Direct WhatsApp Call to Action */}
            <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0 w-full md:w-auto">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs shadow-lg shadow-emerald-600/20 transition-all flex items-center justify-center space-x-2 rtl:space-x-reverse hover:scale-105 active:scale-95"
              >
                <MessageCircle className="w-4 h-4" />
                <span>{isAr ? 'تواصل عبر واتساب (مباشر)' : 'Chat on WhatsApp'}</span>
              </a>

              <a
                href={`tel:${displayPhone}`}
                className="w-full sm:w-auto px-5 py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-extrabold text-xs transition-all flex items-center justify-center space-x-2 rtl:space-x-reverse"
              >
                <Phone className="w-4 h-4 text-amber-400" />
                <span dir="ltr">{displayPhone}</span>
              </a>
            </div>
          </div>
        </div>

        {/* Navigation Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          
          {/* Col 1: Platform About & System Specs */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2 rtl:space-x-reverse">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-md shadow-amber-500/20">
                <Code className="w-5 h-5 text-slate-950" strokeWidth={2.5} />
              </div>
              <span className="font-extrabold text-lg text-white tracking-tight">{t('title')}</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              {t('aboutText')}
            </p>

            <div className="pt-2">
              <h5 className="text-[11px] font-extrabold text-slate-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Cpu className="w-3.5 h-3.5 text-amber-400" />
                {isAr ? 'مواصفات وتأمين البيئة' : 'System Architecture'}
              </h5>
              <div className="space-y-1.5 font-mono text-[11px] bg-slate-900/60 p-3 rounded-xl border border-slate-800/80 text-slate-400">
                <div className="flex justify-between">
                  <span>{isAr ? 'المحرك' : 'Engine'}:</span>
                  <span className="text-amber-400 font-bold">React 19 + Vite</span>
                </div>
                <div className="flex justify-between">
                  <span>{isAr ? 'التخزين' : 'Storage'}:</span>
                  <span className="text-emerald-400 font-bold">Encrypted Local + Firebase</span>
                </div>
                <div className="flex justify-between">
                  <span>{isAr ? 'الحالة' : 'Status'}:</span>
                  <span className="text-cyan-400 font-bold">100% Offline Capable</span>
                </div>
              </div>
            </div>
          </div>

          {/* Col 2: Platform Main Sections & Tools */}
          <div className="space-y-3">
            <h4 className="font-extrabold text-sm text-white uppercase tracking-wider flex items-center gap-2">
              <Layers className="w-4 h-4 text-amber-400" />
              {isAr ? 'أقسام المنصة والأدوات' : 'Platform Modules'}
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/" className="hover:text-amber-400 transition-colors flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-slate-600" />
                  {t('home')}
                </Link>
              </li>
              <li>
                <Link to="/dashboard" className="hover:text-amber-400 transition-colors flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-slate-600" />
                  {t('dashboard')}
                </Link>
              </li>
              <li>
                <Link to="/sandbox" className="hover:text-amber-400 transition-colors flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-slate-600" />
                  {t('sandbox')}
                </Link>
              </li>
              <li>
                <Link to="/revision" className="hover:text-amber-400 transition-colors flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-slate-600" />
                  {isAr ? 'المراجعة والشرح التفصيلي' : 'Revision & Explanations'}
                </Link>
              </li>
              <li>
                <Link to="/interview" className="hover:text-amber-400 transition-colors flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-slate-600" />
                  {t('interviewPrep')}
                </Link>
              </li>
              <li>
                <Link to="/system-design" className="hover:text-amber-400 transition-colors flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-slate-600" />
                  {isAr ? 'معمل تصميم وتأمين النظم' : 'System Design Lab'}
                </Link>
              </li>
              <li>
                <Link to="/english-placement" className="hover:text-amber-400 transition-colors flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-slate-600" />
                  {isAr ? 'تحديد مستوى اللغة الإنجليزية' : 'English Placement Assessment'}
                </Link>
              </li>
              <li>
                <Link to="/qa-testing" className="hover:text-amber-400 transition-colors flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-slate-600" />
                  {isAr ? 'معمل واختبارات الجودة (QA & Testing)' : 'QA & Web Testing Studio'}
                </Link>
              </li>
              <li>
                <Link to="/db-designer" className="hover:text-amber-400 transition-colors flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-slate-600" />
                  {isAr ? 'مصمم ومصمّم قواعد البيانات (ERD & SQL Architect)' : 'Interactive DB Schema Studio'}
                </Link>
              </li>
              <li>
                <Link to="/devops" className="hover:text-amber-400 transition-colors flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-slate-600" />
                  {isAr ? 'معمل أتمتة البنية التحتية (DevOps & Docker)' : 'DevOps & Docker Studio'}
                </Link>
              </li>
              <li>
                <Link to="/web3" className="hover:text-amber-400 transition-colors flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-slate-600" />
                  {isAr ? 'معمل العقود الذكية (Web3 & Solidity)' : 'Web3 & Smart Contract Studio'}
                </Link>
              </li>
              <li>
                <Link to="/algorithms" className="hover:text-amber-400 transition-colors flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-slate-600" />
                  {isAr ? 'محاكي الخوارزميات وهياكل البيانات' : 'Algorithm Visualizer Studio'}
                </Link>
              </li>
              <li>
                <Link to="/cyber-security" className="hover:text-amber-400 transition-colors flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-slate-600" />
                  {isAr ? 'مركز الأمن السيبراني وتأمين المنصة' : 'Cyber Security & Hardening Studio'}
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Career Tracks & Assessment Topics */}
          <div className="space-y-3">
            <h4 className="font-extrabold text-sm text-white uppercase tracking-wider flex items-center gap-2">
              <Globe className="w-4 h-4 text-amber-400" />
              {isAr ? 'المسارات والتخصصات' : 'Career Tracks'}
            </h4>
            <div className="grid grid-cols-1 gap-2 text-xs">
              <div className="bg-slate-900/40 p-2 rounded-xl border border-slate-800/60 hover:border-amber-500/30 transition-all">
                <span className="font-bold text-slate-200 block mb-0.5">💻 Frontend Web</span>
                <span className="text-[10px] text-slate-400">HTML5, CSS3, JS ES6+, React 19, Bootstrap 5</span>
              </div>
              <div className="bg-slate-900/40 p-2 rounded-xl border border-slate-800/60 hover:border-amber-500/30 transition-all">
                <span className="font-bold text-slate-200 block mb-0.5">🖥️ Backend Engineering</span>
                <span className="text-[10px] text-slate-400">PHP 8.3, Laravel 11, MySQL, REST APIs</span>
              </div>
              <div className="bg-slate-900/40 p-2 rounded-xl border border-slate-800/60 hover:border-amber-500/30 transition-all">
                <span className="font-bold text-slate-200 block mb-0.5">🎨 UI/UX Design</span>
                <span className="text-[10px] text-slate-400">Figma Auto-Layout, Tokens, Accessibility</span>
              </div>
              <div className="bg-slate-900/40 p-2 rounded-xl border border-slate-800/60 hover:border-amber-500/30 transition-all">
                <span className="font-bold text-slate-200 block mb-0.5">🪙 Web3 & Solidity</span>
                <span className="text-[10px] text-slate-400">Smart Contracts, Ethereum, EVM Security</span>
              </div>
              <div className="bg-slate-900/40 p-2 rounded-xl border border-slate-800/60 hover:border-lime-500/30 transition-all">
                <span className="font-bold text-slate-200 block mb-0.5">🧪 QA & Web Testing</span>
                <span className="text-[10px] text-slate-400">Jest, Playwright, Cypress, Postman API</span>
              </div>
            </div>
          </div>

          {/* Col 4: Contact & Direct Connect */}
          <div className="space-y-3">
            <h4 className="font-extrabold text-sm text-white uppercase tracking-wider flex items-center gap-2">
              <Phone className="w-4 h-4 text-amber-400" />
              {isAr ? 'معلومات التواصل المباشر' : 'Direct Contact'}
            </h4>
            
            <div className="space-y-3 text-xs bg-slate-900/80 p-4 rounded-2xl border border-slate-800">
              <div>
                <span className="text-[10px] uppercase font-black text-slate-400 tracking-wider block">
                  {isAr ? 'المهندس المسؤول' : 'Lead Engineer'}
                </span>
                <span className="font-extrabold text-white text-sm">
                  {isAr ? 'المهندس كريم محمدى' : 'Eng. Karim Mohamadi'}
                </span>
              </div>

              <div>
                <span className="text-[10px] uppercase font-black text-slate-400 tracking-wider block">
                  {isAr ? 'رقم الهاتف / الواتس اب' : 'Phone / WhatsApp'}
                </span>
                <div className="flex items-center space-x-2 rtl:space-x-reverse mt-1">
                  <a 
                    href={`tel:${displayPhone}`}
                    className="font-mono text-amber-400 hover:underline font-extrabold text-sm"
                    dir="ltr"
                  >
                    {displayPhone}
                  </a>
                  <span className="text-[10px] bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded-md font-bold">
                    واتساب متاح
                  </span>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-800 space-y-2">
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2 px-3 rounded-xl bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-400 border border-emerald-500/30 font-bold text-xs flex items-center justify-between transition-all"
                >
                  <span className="flex items-center gap-1.5">
                    <Send className="w-3.5 h-3.5" />
                    {isAr ? 'إرسال رسالة مباشرة' : 'Send WhatsApp Message'}
                  </span>
                  <ExternalLink className="w-3 h-3" />
                </a>

                <a
                  href={`tel:${displayPhone}`}
                  className="w-full py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-bold text-xs flex items-center justify-between transition-all"
                >
                  <span className="flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-amber-400" />
                    {isAr ? 'اتصال هاتفي' : 'Phone Call'}
                  </span>
                  <span dir="ltr" className="font-mono text-[11px] text-amber-400">{displayPhone}</span>
                </a>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Bar Rights & Security */}
        <div className="pt-6 border-t border-slate-900 flex flex-col md:flex-row justify-between items-center text-xs text-slate-500 gap-4">
          <div className="flex items-center gap-2">
            <span>© {new Date().getFullYear()} {t('title')}. {t('footerRights')}</span>
          </div>

          <div className="flex items-center space-x-6 rtl:space-x-reverse text-slate-400 font-bold">
            <span className="text-amber-400/90 font-extrabold">
              {isAr ? 'بواسطة المطور المهندس كريم محمدى' : 'Engineered by Eng. Karim Mohamadi'}
            </span>
            <span className="hover:text-white transition-colors cursor-pointer flex items-center gap-1">
              <ShieldAlert className="w-3.5 h-3.5 text-emerald-400" /> 
              {isAr ? 'حماية البيانات' : 'Privacy'}
            </span>
          </div>
        </div>

      </div>
    </footer>
  );
};

