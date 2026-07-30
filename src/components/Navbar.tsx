/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { CareerTrack } from '../types';
import { Sun, Moon, Globe, Award, Zap, Code, User, LogOut, CheckCircle2, Shield, RefreshCw, ChevronDown, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { LoginModal } from './LoginModal';

const TRACK_OPTIONS: { id: CareerTrack; icon: string; labelEn: string; labelAr: string; labelIt: string; descEn: string; descAr: string; descIt: string }[] = [
  {
    id: 'frontend',
    icon: '💻',
    labelEn: 'Frontend Web',
    labelAr: 'واجهة أمامية',
    labelIt: 'Frontend Web',
    descEn: 'HTML, CSS, JS, React & Web Performance',
    descAr: 'تطوير الواجهات بـ React و JavaScript و CSS',
    descIt: 'HTML, CSS, JS, React e Prestazioni Web'
  },
  {
    id: 'backend',
    icon: '🖥️',
    labelEn: 'Backend Engineering',
    labelAr: 'هندسة الباك إند',
    labelIt: 'Ingegneria Backend',
    descEn: 'PHP 8, Laravel 11, MySQL & REST APIs',
    descAr: 'تطوير الخوادم وقواعد البيانات والـ APIs',
    descIt: 'PHP 8, Laravel 11, MySQL e REST API'
  },
  {
    id: 'uiux',
    icon: '🎨',
    labelEn: 'UI/UX Design',
    labelAr: 'تصميم UI/UX',
    labelIt: 'UI/UX Design',
    descEn: 'Figma Auto-Layout, Design Tokens & a11y',
    descAr: 'أنظمة التصميم و Figma وأبحاث تجربة المستخدم',
    descIt: 'Figma Auto-Layout, Design Token e Accessibilità'
  },
  {
    id: 'web3',
    icon: '🪙',
    labelEn: 'Web3 Development',
    labelAr: 'تطوير الويب 3',
    labelIt: 'Sviluppo Web3',
    descEn: 'Solidity, EVM, Smart Contracts & Ethereum',
    descAr: 'العقود الذكية والبلوكشين ولغة Solidity',
    descIt: 'Solidity, EVM, Smart Contract e Ethereum'
  },
  {
    id: 'testing',
    icon: '🧪',
    labelEn: 'Web & QA Testing',
    labelAr: 'اختبار الجودة والويب',
    labelIt: 'Web & QA Testing',
    descEn: 'Jest, React Testing Library, Playwright, Cypress & API Testing',
    descAr: 'اختبارات الوحدات والـ E2E وأتمتة الجودة و Postman',
    descIt: 'Jest, React Testing Library, Playwright, Cypress e API'
  },
  {
    id: 'fullstack',
    icon: '🌐',
    labelEn: 'Fullstack Track',
    labelAr: 'مسار شامل Fullstack',
    labelIt: 'Percorso Fullstack',
    descEn: 'Comprehensive assessment across all topics',
    descAr: 'تقييم شامل لجميع التقنيات والتخصصات',
    descIt: 'Valutazione completa di tutti gli argomenti'
  }
];

export const Navbar: React.FC = () => {
  const { theme, toggleTheme, lang, setLang, selectedTrack, setSelectedTrack, t, isRtl, progress, currentUser, logout } = useApp();
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isTrackMenuOpen, setIsTrackMenuOpen] = useState(false);

  const activeTrackOption = TRACK_OPTIONS.find(t => t.id === selectedTrack) || TRACK_OPTIONS[0];

  const activeStyle = "text-amber-500 font-bold border-b-2 border-amber-500 pb-1 whitespace-nowrap shrink-0";
  const inactiveStyle = "text-slate-300 hover:text-white transition-colors duration-200 pb-1 whitespace-nowrap shrink-0";

  return (
    <header className="sticky top-0 z-50 backdrop-blur-xl bg-slate-900/80 border-b border-slate-800" id="navbar-header">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo & Platform Title */}
          <Link to="/" className="flex items-center space-x-2 rtl:space-x-reverse" id="logo-link">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-lg shadow-amber-500/20">
              <Code className="w-6 h-6 text-slate-900" strokeWidth={2.5} />
            </div>
            <span className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent hidden sm:inline-block">
              {t('title')}
            </span>
          </Link>

          {/* Navigation Links */}
          <nav className="flex items-center space-x-4 rtl:space-x-reverse text-xs md:text-sm overflow-x-auto max-w-[280px] sm:max-w-md md:max-w-xl lg:max-w-2xl py-2 scrollbar-none" id="main-nav-links">
            <NavLink to="/" className={({ isActive }) => isActive ? activeStyle : inactiveStyle}>
              {t('home')}
            </NavLink>
            <NavLink to="/dashboard" className={({ isActive }) => isActive ? activeStyle : inactiveStyle}>
              {t('dashboard')}
            </NavLink>
            <NavLink to="/sandbox" className={({ isActive }) => isActive ? activeStyle : inactiveStyle}>
              {t('sandbox')}
            </NavLink>
            <NavLink to="/revision" className={({ isActive }) => isActive ? activeStyle : inactiveStyle}>
              {lang === 'ar' ? 'المراجعة والشرح' : lang === 'it' ? 'Revisione' : 'Revision'}
            </NavLink>
            <NavLink to="/interview" className={({ isActive }) => isActive ? activeStyle : inactiveStyle}>
              {t('interviewPrep')}
            </NavLink>
            <NavLink to="/system-design" className={({ isActive }) => isActive ? activeStyle : inactiveStyle}>
              {lang === 'ar' ? 'معمل النظم' : lang === 'it' ? 'System Design' : 'System Design'}
            </NavLink>
            <NavLink to="/english-placement" className={({ isActive }) => isActive ? activeStyle : inactiveStyle}>
              {lang === 'ar' ? 'تحديد مستوى إنجليزي' : lang === 'it' ? 'English Placement' : 'English Placement'}
            </NavLink>
            <NavLink to="/qa-testing" className={({ isActive }) => isActive ? activeStyle : inactiveStyle}>
              {lang === 'ar' ? 'معمل التستنج' : lang === 'it' ? 'QA & Testing' : 'QA & Testing'}
            </NavLink>
            <NavLink to="/db-designer" className={({ isActive }) => isActive ? activeStyle : inactiveStyle}>
              {lang === 'ar' ? 'مصمم ERD القواعد' : lang === 'it' ? 'DB Architect' : 'DB Architect'}
            </NavLink>
            <NavLink to="/devops" className={({ isActive }) => isActive ? activeStyle : inactiveStyle}>
              {lang === 'ar' ? 'DevOps & Docker' : 'DevOps & Docker'}
            </NavLink>
            <NavLink to="/web3" className={({ isActive }) => isActive ? activeStyle : inactiveStyle}>
              {lang === 'ar' ? 'Web3 & Solidity' : 'Web3 & Solidity'}
            </NavLink>
            <NavLink to="/algorithms" className={({ isActive }) => isActive ? activeStyle : inactiveStyle}>
              {lang === 'ar' ? 'محاكي الخوارزميات' : 'Algorithms'}
            </NavLink>
            <NavLink to="/cyber-security" className={({ isActive }) => isActive ? activeStyle : inactiveStyle}>
              {lang === 'ar' ? 'الأمن السيبراني' : 'Cyber Security'}
            </NavLink>
          </nav>

          {/* Settings, Language, Track, Streak & Theme controls */}
          <div className="flex items-center space-x-3 rtl:space-x-reverse" id="navbar-controls">
            
            {/* Career Track Dropdown Selector */}
            <div className="relative" id="track-dropdown-container">
              <button
                onClick={() => setIsTrackMenuOpen(!isTrackMenuOpen)}
                className="flex items-center space-x-2 rtl:space-x-reverse bg-slate-950/90 hover:bg-slate-800/90 px-3 py-1.5 rounded-xl border border-amber-500/30 hover:border-amber-500/60 text-xs font-bold transition-all text-slate-200 shadow-sm shadow-amber-500/5"
                id="track-dropdown-trigger"
                title="Select Career Track"
              >
                <span className="text-sm">{activeTrackOption.icon}</span>
                <span className="font-black text-amber-400 truncate max-w-[100px] sm:max-w-none">
                  {lang === 'ar' ? activeTrackOption.labelAr : lang === 'it' ? activeTrackOption.labelIt : activeTrackOption.labelEn}
                </span>
                <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${isTrackMenuOpen ? 'rotate-180' : ''}`} />
              </button>

              <AnimatePresence>
                {isTrackMenuOpen && (
                  <>
                    {/* Click backdrop */}
                    <div className="fixed inset-0 z-10" onClick={() => setIsTrackMenuOpen(false)} />

                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.95 }}
                      transition={{ duration: 0.15 }}
                      className="absolute left-0 rtl:right-0 rtl:left-auto top-11 w-72 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-2 z-20 space-y-1"
                      id="track-dropdown-menu"
                    >
                      <div className="px-3 py-1.5 text-[10px] font-extrabold uppercase tracking-wider text-slate-400 border-b border-slate-800/80 mb-1 flex items-center justify-between">
                        <span>{lang === 'ar' ? 'اختر مسار التطوير' : lang === 'it' ? 'Seleziona Percorso' : 'Select Career Track'}</span>
                        <span className="text-amber-500 text-[10px]">5 {lang === 'ar' ? 'مسارات' : 'Tracks'}</span>
                      </div>

                      {TRACK_OPTIONS.map((track) => {
                        const isSelected = selectedTrack === track.id;
                        return (
                          <button
                            key={track.id}
                            onClick={() => {
                              setSelectedTrack(track.id);
                              setIsTrackMenuOpen(false);
                            }}
                            className={`w-full text-left rtl:text-right p-2.5 rounded-xl transition-all flex items-start space-x-3 rtl:space-x-reverse ${
                              isSelected
                                ? 'bg-amber-500/10 border border-amber-500/40 text-white shadow-sm'
                                : 'hover:bg-slate-800/60 text-slate-300 border border-transparent'
                            }`}
                            id={`track-option-${track.id}`}
                          >
                            <div className="text-lg shrink-0 p-1.5 bg-slate-950/80 rounded-lg border border-slate-800">
                              {track.icon}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between">
                                <span className={`text-xs font-bold ${isSelected ? 'text-amber-400 font-extrabold' : 'text-slate-200'}`}>
                                  {lang === 'ar' ? track.labelAr : lang === 'it' ? track.labelIt : track.labelEn}
                                </span>
                                {isSelected && <Check className="w-4 h-4 text-amber-400 shrink-0 ml-1 rtl:mr-1 rtl:ml-0" />}
                              </div>
                              <p className="text-[10px] text-slate-400 truncate mt-0.5">
                                {lang === 'ar' ? track.descAr : lang === 'it' ? track.descIt : track.descEn}
                              </p>
                            </div>
                          </button>
                        );
                      })}
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>

            {/* Streak Counter */}
            {progress.streak > 0 && (
              <motion.div 
                whileHover={{ scale: 1.05 }}
                className="flex items-center space-x-1 rtl:space-x-reverse bg-amber-500/10 text-amber-500 border border-amber-500/20 px-3 py-1 rounded-full text-xs font-bold"
                title={`${progress.streak} Day Learning Streak`}
              >
                <Zap className="w-4 h-4 fill-amber-500 stroke-amber-500 animate-pulse" />
                <span>{progress.streak}</span>
              </motion.div>
            )}

            {/* Achievements shortcut icon */}
            <Link 
              to="/dashboard" 
              className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors hidden md:block"
              title="Unlocked Achievements"
            >
              <div className="relative">
                <Award className="w-5 h-5 text-amber-400" />
                {progress.achievements.length > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-[10px] text-white font-bold flex items-center justify-center rounded-full">
                    {progress.achievements.length}
                  </span>
                )}
              </div>
            </Link>

            {/* Language Switcher */}
            <button
              onClick={() => {
                if (lang === 'en') setLang('it');
                else if (lang === 'it') setLang('ar');
                else setLang('en');
              }}
              className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors flex items-center space-x-1 rtl:space-x-reverse"
              title="Switch Language"
              id="lang-toggle"
            >
              <Globe className="w-5 h-5" />
              <span className="text-xs uppercase font-bold">
                {lang === 'en' ? 'IT' : lang === 'it' ? 'AR' : 'EN'}
              </span>
            </button>

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
              title={theme === 'light' ? 'Switch to Dark' : 'Switch to Light'}
              id="theme-toggle"
            >
              {theme === 'light' ? <Moon className="w-5 h-5 text-indigo-400" /> : <Sun className="w-5 h-5 text-amber-400" />}
            </button>

            {/* User Avatar Badge */}
            <div className="relative flex items-center pl-2 border-l border-slate-800 rtl:border-l-0 rtl:border-r rtl:pl-0 rtl:pr-2">
              {currentUser ? (
                <>
                  <button
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="flex items-center space-x-2 rtl:space-x-reverse hover:bg-slate-800/60 p-1 px-2 rounded-xl transition-all"
                    id="profile-dropdown-btn"
                  >
                    {progress.customAvatar || currentUser.photoURL ? (
                      <img
                        src={progress.customAvatar || currentUser.photoURL}
                        alt="Profile"
                        referrerPolicy="no-referrer"
                        className="w-8 h-8 rounded-full border border-amber-500/20 object-cover"
                      />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-500 to-orange-600 text-slate-950 font-black flex items-center justify-center text-xs">
                        {(progress.userName || currentUser.displayName || 'DV').slice(0, 2).toUpperCase()}
                      </div>
                    )}
                    <span className="text-xs text-slate-200 font-bold max-w-[80px] truncate hidden md:inline-block">
                      {progress.userName || currentUser.displayName}
                    </span>
                  </button>

                  {/* Dropdown Popover */}
                  <AnimatePresence>
                    {isDropdownOpen && (
                      <>
                        {/* Click backdrop to close */}
                        <div className="fixed inset-0 z-10" onClick={() => setIsDropdownOpen(false)} />
                        
                        <motion.div
                          initial={{ opacity: 0, y: 10, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 10, scale: 0.95 }}
                          transition={{ duration: 0.15 }}
                          className="absolute right-0 rtl:left-0 rtl:right-auto top-12 w-64 bg-slate-900 border border-slate-800 rounded-2xl shadow-xl p-4 z-20 space-y-3 text-slate-300"
                          id="profile-dropdown-popover"
                        >
                          <div className="space-y-1">
                            <h4 className="text-sm font-extrabold text-white truncate">{progress.userName || currentUser.displayName}</h4>
                            {currentUser.email && (
                              <p className="text-[11px] text-slate-400 truncate">{currentUser.email}</p>
                            )}
                          </div>

                          <div className="h-px bg-slate-800" />

                          {/* Connection Status */}
                          <div className="flex items-center space-x-2 rtl:space-x-reverse p-2 bg-slate-950/40 rounded-xl border border-slate-800/50">
                            <Shield className={`w-4 h-4 ${currentUser.isMock ? 'text-slate-400' : 'text-emerald-400'}`} />
                            <div className="text-[11px] leading-tight text-right rtl:text-right ltr:text-left">
                              <p className="font-bold text-slate-200">
                                {currentUser.isMock ? (lang === 'ar' ? 'جلسة مطور محلية' : (lang === 'it' ? 'Sessione Dev Locale' : 'Local Dev Session')) : (lang === 'ar' ? 'جلسة فايربيز نشطة' : (lang === 'it' ? 'Sessione Firebase Attiva' : 'Firebase Session'))}
                              </p>
                              <p className="text-[9px] text-slate-500">
                                {currentUser.isMock ? (lang === 'ar' ? 'تخزين أوفلاين مؤمن' : (lang === 'it' ? 'Archiviazione locale offline' : 'Offline local storage')) : (lang === 'ar' ? 'مزامنة سحابية مستمرة' : (lang === 'it' ? 'Sincronizzazione cloud continua' : 'Continuous cloud sync'))}
                              </p>
                            </div>
                          </div>

                          {/* Actions */}
                          <button
                            onClick={() => {
                              logout();
                              setIsDropdownOpen(false);
                            }}
                            className="w-full flex items-center justify-between p-2 text-xs font-bold text-rose-400 hover:text-white hover:bg-rose-500/10 rounded-xl transition-all"
                          >
                            <span>{t('signOut')}</span>
                            <LogOut className="w-4 h-4" />
                          </button>
                        </motion.div>
                      </>
                    )}
                  </AnimatePresence>
                </>
              ) : (
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setIsLoginOpen(true)}
                  className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-slate-950 text-xs font-black shadow-md shadow-amber-500/10 transition-all flex items-center space-x-1.5 rtl:space-x-reverse"
                >
                  <User className="w-3.5 h-3.5" />
                  <span>{t('signIn')}</span>
                </motion.button>
              )}
            </div>

          </div>

        </div>
      </div>

      {/* Login Modal */}
      <LoginModal isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} />
    </header>
  );
};
