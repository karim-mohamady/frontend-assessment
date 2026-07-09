/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useApp, ACHIEVEMENTS } from '../context/AppContext';
import { InteractiveChart } from '../components/InteractiveChart';
import { 
  Award, Clock, CheckCircle2, AlertTriangle, Lightbulb, Settings, Download, Upload, Trash2, Edit2, Zap, Target
} from 'lucide-react';
import { motion } from 'motion/react';

export const Dashboard: React.FC = () => {
  const { 
    t, isRtl, progress, setUserName, clearAllProgress, exportProgress, importProgress, unlockAchievement 
  } = useApp();

  const [isEditingName, setIsEditingName] = useState(false);
  const [tempName, setTempName] = useState(progress.userName);
  const [importStr, setImportStr] = useState('');
  const [showImportArea, setShowImportArea] = useState(false);
  const [copiedExport, setCopiedExport] = useState(false);
  const [importStatus, setImportStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleSaveName = () => {
    setUserName(tempName);
    setIsEditingName(false);
  };

  const handleExport = () => {
    const data = exportProgress();
    navigator.clipboard.writeText(data);
    setCopiedExport(true);
    setTimeout(() => setCopiedExport(false), 2000);
  };

  const handleImport = () => {
    const success = importProgress(importStr);
    if (success) {
      setImportStatus('success');
      setImportStr('');
      setTimeout(() => {
        setImportStatus('idle');
        setShowImportArea(false);
      }, 1500);
    } else {
      setImportStatus('error');
      setTimeout(() => setImportStatus('idle'), 2000);
    }
  };

  // 1. Calculate general stats across categories
  const categoriesList: ('html' | 'css' | 'javascript' | 'react' | 'bootstrap' | 'english')[] = [
    'html', 'css', 'javascript', 'react', 'bootstrap', 'english'
  ];

  const categoryNames = {
    html: t('catHtml'),
    css: t('catCss'),
    javascript: t('catJs'),
    react: t('catReact'),
    bootstrap: t('catBs'),
    english: t('catEng')
  };

  const categoryColors = {
    html: '#f97316', // Orange
    css: '#3b82f6', // Blue
    javascript: '#f59e0b', // Yellow
    react: '#0ea5e9', // Sky blue
    bootstrap: '#8b5cf6', // Purple
    english: '#10b981' // Green
  };

  // Find average percentages for each category
  const categoryScores = categoriesList.map((cat) => {
    const matchingTests = progress.completedAssessments.filter((t) => t.category === cat);
    const avgScore = matchingTests.length > 0
      ? matchingTests.reduce((acc, curr) => acc + curr.percentage, 0) / matchingTests.length
      : 0;
    
    return {
      id: cat,
      label: categoryNames[cat],
      value: avgScore,
      color: categoryColors[cat],
      count: matchingTests.length
    };
  });

  const totalAssessments = progress.completedAssessments.length;
  
  const overallAvgScore = totalAssessments > 0
    ? Math.round(progress.completedAssessments.reduce((acc, curr) => acc + curr.percentage, 0) / totalAssessments)
    : 0;

  const totalAccuracy = totalAssessments > 0
    ? Math.round(progress.completedAssessments.reduce((acc, curr) => acc + curr.accuracy, 0) / totalAssessments)
    : 0;

  const totalTimeSpent = progress.completedAssessments.reduce((acc, curr) => acc + curr.timeSpent, 0);

  // Time spent formatting
  const formatTimeSpent = (secs: number) => {
    if (secs < 60) return `${secs} ${t('sec')}`;
    const mins = Math.floor(secs / 60);
    if (mins < 60) return `${mins} ${t('min')}`;
    const hrs = Math.floor(mins / 60);
    const remMins = mins % 60;
    return `${hrs} ${t('hr')} ${remMins} ${t('min')}`;
  };

  // Find strongest and weakest skills
  const completedStats = categoryScores.filter((s) => s.count > 0);
  const strongest = completedStats.length > 0
    ? [...completedStats].sort((a, b) => b.value - a.value).filter((s) => s.value >= 70).slice(0, 2)
    : [];
  
  const weakest = categoryScores
    .map((s) => ({ ...s, value: s.count > 0 ? s.value : 0 })) // Treat non-attempted as areas needing attention
    .sort((a, b) => a.value - b.value)
    .slice(0, 2);

  // Dynamic AI-Style intelligent feedback suggestions
  const generateAIRecommendations = () => {
    const recommendations: string[] = [];

    categoryScores.forEach((score) => {
      if (score.count === 0) {
        recommendations.push(`You have not taken the "${score.label}" assessment yet. Complete it to evaluate your baseline!`);
      } else if (score.value < 75) {
        if (score.id === 'html') {
          recommendations.push("Practice HTML5 form input attributes and ARIA roles for accessibility mapping.");
        } else if (score.id === 'css') {
          recommendations.push("Focus on CSS Grid column-definition grids, and transitions timing easing functions.");
        } else if (score.id === 'javascript') {
          recommendations.push("Strengthen your understanding of the Event Loop microtask queues and asynchronous closures.");
        } else if (score.id === 'react') {
          recommendations.push("Review state capture rules inside useEffect timeouts, and memoize handlers with useCallback.");
        } else if (score.id === 'bootstrap') {
          recommendations.push("Read up on Bootstrap responsive offset columns grid wrappers and spacing scales.");
        } else if (score.id === 'english') {
          recommendations.push("Improve technical developer reading skills, API deprecation alerts, and Git merge flows.");
        }
      }
    });

    if (recommendations.length === 0) {
      recommendations.push("Stellar job! You have demonstrated high mastery across all front-end topics. Take on expert difficulties to unlock further honors.");
    }

    return recommendations.slice(0, 4);
  };

  const aiRecs = generateAIRecommendations();

  // Job readiness categorization
  const getJobReadiness = () => {
    const attemptedCount = completedStats.length;
    if (attemptedCount < 3 || overallAvgScore < 60) {
      return {
        level: t('notReadyYet'),
        desc: 'Complete at least 3 major core assessments with a minimum average score of 60% to demonstrate initial competency.',
        color: 'text-amber-500 border-amber-500/20 bg-amber-500/5'
      };
    }
    if (overallAvgScore >= 85 && attemptedCount >= 5) {
      return {
        level: t('readyMid'),
        desc: 'Exceptional skill! Your score profile highlights deep architectural expertise in React, CSS specificity, and JS queues. Ready to lead projects.',
        color: 'text-emerald-400 border-emerald-500/20 bg-emerald-500/5'
      };
    }
    return {
      level: t('readyJunior'),
      desc: 'Great baseline! You satisfy crucial requirements for junior level positions. Focus on strengthening remaining weak topics.',
      color: 'text-sky-400 border-sky-500/20 bg-sky-500/5'
    };
  };

  const readiness = getJobReadiness();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10" id="dashboard-root">
      
      {/* 1. Header Profile & Settings Area */}
      <section className="bg-slate-900 border border-slate-800 p-6 md:p-8 rounded-3xl backdrop-blur-md flex flex-col md:flex-row justify-between items-start md:items-center gap-6" id="dashboard-header-profile">
        <div className="space-y-3">
          <div className="flex items-center space-x-3 rtl:space-x-reverse">
            {isEditingName ? (
              <div className="flex items-center space-x-2 rtl:space-x-reverse">
                <input
                  type="text"
                  value={tempName}
                  onChange={(e) => setTempName(e.target.value)}
                  className="bg-slate-950 border border-slate-700 rounded-lg px-3 py-1.5 text-sm text-white focus:outline-none focus:border-amber-500"
                />
                <button
                  onClick={handleSaveName}
                  className="bg-amber-500 hover:bg-amber-600 text-slate-900 px-3 py-1.5 rounded-lg text-xs font-bold"
                >
                  {t('save')}
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-3 rtl:space-x-reverse">
                <h1 className="text-xl md:text-2xl font-black text-white">{progress.userName}</h1>
                <button
                  onClick={() => setIsEditingName(true)}
                  className="p-1 text-slate-500 hover:text-slate-300 transition-colors"
                  title="Rename Profile"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
          <p className="text-xs text-slate-400">
            Last Active: <span className="font-mono">{progress.lastActive}</span> | Learning Streak: <span className="text-amber-500 font-bold">{progress.streak} days</span>
          </p>
        </div>

        {/* State sync & settings buttons */}
        <div className="flex flex-wrap gap-2">
          <button
            onClick={handleExport}
            className="flex items-center space-x-1.5 rtl:space-x-reverse bg-slate-800 hover:bg-slate-700 text-slate-200 px-4 py-2 rounded-xl text-xs font-bold transition-all"
            title="Copy state backup code"
          >
            <Download className="w-4 h-4" />
            <span>{copiedExport ? 'Copied!' : t('exportData')}</span>
          </button>

          <button
            onClick={() => setShowImportArea(!showImportArea)}
            className="flex items-center space-x-1.5 rtl:space-x-reverse bg-slate-800 hover:bg-slate-700 text-slate-200 px-4 py-2 rounded-xl text-xs font-bold transition-all"
          >
            <Upload className="w-4 h-4" />
            <span>{t('importData')}</span>
          </button>

          <button
            onClick={() => {
              if (window.confirm('Delete all records and achievements? This action is irreversible.')) {
                clearAllProgress();
              }
            }}
            className="flex items-center space-x-1.5 rtl:space-x-reverse bg-red-950/40 hover:bg-red-900/40 text-red-400 border border-red-900/30 px-4 py-2 rounded-xl text-xs font-bold transition-all"
          >
            <Trash2 className="w-4 h-4" />
            <span>{t('clearData')}</span>
          </button>
        </div>
      </section>

      {/* Import input tray */}
      {showImportArea && (
        <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl space-y-3" id="import-data-tray">
          <h4 className="text-xs font-bold text-slate-300">Paste your backup code:</h4>
          <div className="flex gap-2">
            <input
              type="text"
              value={importStr}
              onChange={(e) => setImportStr(e.target.value)}
              placeholder="e.g. eyJVc2VyTmFtZSI6IkVsaXRlRGV2ZW..."
              className="flex-1 bg-slate-950 border border-slate-800 focus:border-slate-700 rounded-xl px-3 py-2 text-xs font-mono text-slate-300 focus:outline-none"
            />
            <button
              onClick={handleImport}
              className="bg-amber-500 hover:bg-amber-600 text-slate-900 font-bold px-4 py-2 rounded-xl text-xs transition-colors"
            >
              Apply Backup
            </button>
          </div>
          {importStatus === 'success' && <p className="text-xs text-emerald-400">Progress synchronized successfully!</p>}
          {importStatus === 'error' && <p className="text-xs text-red-400">Invalid code context. Verify your key structure.</p>}
        </div>
      )}

      {/* 2. Key Metrics Bento Grid */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6" id="dashboard-metrics-grid">
        
        {/* Metric Card 1: Overall Score */}
        <div className="bg-slate-900/50 border border-slate-800 p-5 rounded-2xl space-y-3 relative overflow-hidden">
          <div className="flex justify-between items-start">
            <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">{t('overallScore')}</p>
            <Target className="w-5 h-5 text-amber-500" />
          </div>
          <div className="space-y-1">
            <h2 className="text-3xl font-black text-white font-mono">{overallAvgScore}%</h2>
            <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
              <div className="h-full bg-amber-500" style={{ width: `${overallAvgScore}%` }}></div>
            </div>
          </div>
        </div>

        {/* Metric Card 2: Tests Completed vs Remaining */}
        <div className="bg-slate-900/50 border border-slate-800 p-5 rounded-2xl space-y-3 relative overflow-hidden">
          <div className="flex justify-between items-start">
            <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Evaluation Status</p>
            <CheckCircle2 className="w-5 h-5 text-indigo-400" />
          </div>
          <div className="space-y-1">
            <h2 className="text-3xl font-black text-white font-mono">
              {totalAssessments} <span className="text-xs text-slate-500">done</span>
            </h2>
            <p className="text-[10px] text-slate-400">
              {6 - Math.min(categoryScores.filter(s => s.count > 0).length, 6)} remaining categories to compile
            </p>
          </div>
        </div>

        {/* Metric Card 3: Avg Accuracy */}
        <div className="bg-slate-900/50 border border-slate-800 p-5 rounded-2xl space-y-3 relative overflow-hidden">
          <div className="flex justify-between items-start">
            <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">{t('avgAccuracy')}</p>
            <Award className="w-5 h-5 text-emerald-400" />
          </div>
          <div className="space-y-1">
            <h2 className="text-3xl font-black text-white font-mono">{totalAccuracy}%</h2>
            <p className="text-[10px] text-slate-400">Calculated across answers and skipped questions</p>
          </div>
        </div>

        {/* Metric Card 4: Time Spent */}
        <div className="bg-slate-900/50 border border-slate-800 p-5 rounded-2xl space-y-3 relative overflow-hidden">
          <div className="flex justify-between items-start">
            <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">{t('timeSpent')}</p>
            <Clock className="w-5 h-5 text-sky-400" />
          </div>
          <div className="space-y-1">
            <h2 className="text-2xl font-black text-white font-mono">{formatTimeSpent(totalTimeSpent)}</h2>
            <p className="text-[10px] text-slate-400">Total session hours compiled offline</p>
          </div>
        </div>

      </section>

      {/* 3. Job Readiness Notification Banner */}
      <section className={`p-6 rounded-2xl border ${readiness.color} flex flex-col md:flex-row items-start md:items-center justify-between gap-4`} id="readiness-section">
        <div className="space-y-1.5 max-w-2xl">
          <h3 className="text-sm font-bold uppercase tracking-wider flex items-center gap-2">
            <Award className="w-5 h-5" />
            <span>{t('readinessTitle')}: {readiness.level}</span>
          </h3>
          <p className="text-xs opacity-80 leading-relaxed">{readiness.desc}</p>
        </div>
        <div className="text-xs font-mono opacity-60">Status Verifiable</div>
      </section>

      {/* 4. Chart Visualizer & Weakest/Strongest panel */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6" id="dashboard-charts-panel">
        
        {/* Left column: SVG Interactive Chart */}
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800/80 p-6 rounded-2xl space-y-4">
          <div className="space-y-1">
            <h3 className="font-bold text-white text-sm md:text-base">Skill Category Performance Score</h3>
            <p className="text-xs text-slate-400">Displays weighted category averages for passed assessments.</p>
          </div>
          <InteractiveChart data={categoryScores} />
        </div>

        {/* Right column: Strongest / Weakest block */}
        <div className="bg-slate-900 border border-slate-800/80 p-6 rounded-2xl flex flex-col justify-between space-y-6">
          
          <div className="space-y-4">
            <h3 className="font-bold text-white text-sm uppercase tracking-wider">{t('strongestSkills')}</h3>
            <div className="space-y-2">
              {strongest.length > 0 ? (
                strongest.map((s) => (
                  <div key={s.id} className="flex items-center justify-between p-3 bg-slate-950/60 border border-slate-800 rounded-xl">
                    <span className="text-xs font-bold text-slate-200">{s.label}</span>
                    <span className="text-xs font-bold text-emerald-400">{Math.round(s.value)}%</span>
                  </div>
                ))
              ) : (
                <p className="text-xs text-slate-500 italic">Complete assessments above 70% to evaluate strengths.</p>
              )}
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="font-bold text-white text-sm uppercase tracking-wider">{t('weakestSkills')}</h3>
            <div className="space-y-2">
              {weakest.map((s) => (
                <div key={s.id} className="flex items-center justify-between p-3 bg-slate-950/60 border border-slate-800 rounded-xl">
                  <span className="text-xs font-bold text-slate-200">{s.label}</span>
                  <span className="text-xs font-bold text-amber-500">{Math.round(s.value)}%</span>
                </div>
              ))}
            </div>
          </div>

        </div>

      </section>

      {/* 5. Smart Study Recommendations & AI Feedback */}
      <section className="bg-slate-900 border border-slate-800/80 p-6 md:p-8 rounded-3xl space-y-6" id="ai-recs-panel">
        <div className="flex items-center space-x-2.5 rtl:space-x-reverse">
          <Lightbulb className="w-5 h-5 text-amber-500" />
          <h3 className="font-extrabold text-white text-sm md:text-base">{t('recommendations')}</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {aiRecs.map((rec, idx) => (
            <div key={idx} className="p-4 bg-slate-950 border border-slate-800/80 rounded-xl flex items-start space-x-3 rtl:space-x-reverse">
              <span className="text-amber-500 text-xs font-mono font-bold">0{idx + 1}.</span>
              <p className="text-xs md:text-sm text-slate-300 leading-relaxed">{rec}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 6. Platform Achievements & Badges */}
      <section className="bg-slate-900 border border-slate-800/80 p-6 md:p-8 rounded-3xl space-y-6" id="achievements-panel">
        <div className="space-y-1">
          <h3 className="font-extrabold text-white text-sm md:text-base">{t('achievements')}</h3>
          <p className="text-xs text-slate-400">Unlock developer honors by scoring high grades, answering swiftly, and practicing daily.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {ACHIEVEMENTS.map((ach) => {
            const isUnlocked = progress.achievements.includes(ach.id);
            return (
              <div 
                key={ach.id} 
                className={`p-4 rounded-xl border flex space-x-3.5 rtl:space-x-reverse transition-all ${
                  isUnlocked 
                    ? 'bg-slate-950/80 border-amber-500/30' 
                    : 'bg-slate-950/20 border-slate-900 opacity-40'
                }`}
              >
                <div className="text-2xl flex items-center justify-center bg-slate-900 w-11 h-11 rounded-xl shadow-inner">
                  {ach.icon}
                </div>
                <div className="space-y-1">
                  <h4 className={`text-xs font-bold ${isUnlocked ? 'text-amber-500' : 'text-slate-400'}`}>
                    {isRtl ? ach.titleAr : ach.titleEn}
                  </h4>
                  <p className="text-[10px] text-slate-400 leading-snug">
                    {isRtl ? ach.descAr : ach.descEn}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

    </div>
  );
};
