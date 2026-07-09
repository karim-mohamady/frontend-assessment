/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Sun, Moon, Globe, Award, Zap, Code, User } from 'lucide-react';
import { motion } from 'motion/react';

export const Navbar: React.FC = () => {
  const { theme, toggleTheme, lang, setLang, t, isRtl, progress } = useApp();

  const activeStyle = "text-amber-500 font-bold border-b-2 border-amber-500 pb-1";
  const inactiveStyle = "text-slate-300 hover:text-white transition-colors duration-200 pb-1";

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
          <nav className="flex space-x-6 rtl:space-x-reverse text-sm" id="main-nav-links">
            <NavLink to="/" className={({ isActive }) => isActive ? activeStyle : inactiveStyle}>
              {t('home')}
            </NavLink>
            <NavLink to="/dashboard" className={({ isActive }) => isActive ? activeStyle : inactiveStyle}>
              {t('dashboard')}
            </NavLink>
            <NavLink to="/sandbox" className={({ isActive }) => isActive ? activeStyle : inactiveStyle}>
              {t('sandbox')}
            </NavLink>
          </nav>

          {/* Settings, Language, Streak & Theme controls */}
          <div className="flex items-center space-x-3 rtl:space-x-reverse" id="navbar-controls">
            
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
              onClick={() => setLang(lang === 'en' ? 'ar' : 'en')}
              className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors flex items-center space-x-1 rtl:space-x-reverse"
              title="Switch Language"
              id="lang-toggle"
            >
              <Globe className="w-5 h-5" />
              <span className="text-xs uppercase font-bold">{lang === 'en' ? 'AR' : 'EN'}</span>
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
            <div className="flex items-center space-x-2 rtl:space-x-reverse pl-2 border-l border-slate-800 rtl:border-l-0 rtl:border-r rtl:pl-0 rtl:pr-2">
              <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center text-slate-200">
                <User className="w-4 h-4" />
              </div>
              <span className="text-xs text-slate-300 font-medium max-w-[80px] truncate hidden md:inline-block">
                {progress.userName}
              </span>
            </div>

          </div>

        </div>
      </div>
    </header>
  );
};
