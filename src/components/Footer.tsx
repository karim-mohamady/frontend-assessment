/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { useApp } from '../context/AppContext';
import { Code, Github, Terminal, ShieldAlert } from 'lucide-react';

export const Footer: React.FC = () => {
  const { t } = useApp();

  return (
    <footer className="bg-slate-950 border-t border-slate-900 py-12 text-slate-500" id="global-footer">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          
          <div className="flex flex-col space-y-3">
            <div className="flex items-center space-x-2 rtl:space-x-reverse">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center">
                <Code className="w-5 h-5 text-slate-900" />
              </div>
              <span className="font-extrabold text-slate-300 tracking-tight">{t('title')}</span>
            </div>
            <p className="text-xs text-slate-400">
              {t('aboutText')}
            </p>
          </div>

          <div className="flex flex-col space-y-2 text-xs">
            <h4 className="font-bold text-slate-400 uppercase tracking-widest">{t('assessments')}</h4>
            <div className="grid grid-cols-2 gap-2 text-slate-500">
              <span>HTML5 / CSS3</span>
              <span>ES6+ Async JS</span>
              <span>React 19 Hooks</span>
              <span>Bootstrap 5 Utilities</span>
              <span>Technical English</span>
              <span>Scoring API & Analytics</span>
            </div>
          </div>

          <div className="flex flex-col space-y-4">
            <h4 className="font-bold text-slate-400 uppercase tracking-widest text-xs">System Specs</h4>
            <div className="space-y-1.5 font-mono text-[10px] text-slate-500 bg-slate-900/40 p-3 rounded-lg border border-slate-900">
              <div className="flex justify-between">
                <span className="flex items-center gap-1"><Terminal className="w-3 h-3" /> Runtime:</span>
                <span className="text-amber-500">React 19 + Vite</span>
              </div>
              <div className="flex justify-between">
                <span className="flex items-center gap-1"><ShieldAlert className="w-3 h-3" /> Security:</span>
                <span className="text-emerald-500">Encrypted LocalStorage</span>
              </div>
              <div className="flex justify-between">
                <span>Database Sync:</span>
                <span>Active offline state</span>
              </div>
            </div>
          </div>

        </div>

        <div className="pt-8 border-t border-slate-900 flex flex-col md:flex-row justify-between items-center text-xs">
          <p>© {new Date().getFullYear()} {t('title')}. {t('footerRights')}</p>
          <div className="flex items-center space-x-4 rtl:space-x-reverse mt-4 md:mt-0">
            <span className="hover:text-slate-300 transition-colors cursor-pointer">Security Policy</span>
            <span className="hover:text-slate-300 transition-colors cursor-pointer">API Keys</span>
            <span className="hover:text-slate-300 transition-colors cursor-pointer flex items-center gap-1">
              <Github className="w-3.5 h-3.5" /> Github Source
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
