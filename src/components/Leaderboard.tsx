/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { Trophy, Medal, Award, Search, Sparkles, Star, ShieldCheck, Zap, User, ArrowUp } from 'lucide-react';

interface LeaderboardUser {
  rank: number;
  name: string;
  avatarSeed: string;
  score: number; // overall percentage
  assessmentsCompleted: number;
  accuracy: number;
  isCurrentUser?: boolean;
  title: string;
  badgeColor: string;
}

export const Leaderboard: React.FC = () => {
  const { progress, isRtl } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeMetric, setActiveMetric] = useState<'score' | 'completed'>('score');

  // Calculate user's dynamic metrics from actual real progress
  const userMetrics = useMemo(() => {
    const assessments = progress.completedAssessments || [];
    const count = assessments.length;
    
    // Calculate best or average score
    const bestScore = count > 0 
      ? Math.max(...assessments.map(a => a.percentage)) 
      : 0;

    const avgAccuracy = count > 0
      ? Math.round(assessments.reduce((sum, a) => sum + (a.accuracy || a.percentage), 0) / count)
      : 0;

    return {
      name: progress.userName || (isRtl ? 'مطور نخبوي' : 'Elite Developer'),
      score: bestScore > 0 ? bestScore : 0,
      completed: count,
      accuracy: avgAccuracy > 0 ? avgAccuracy : 0
    };
  }, [progress, isRtl]);

  // List of high-performing mock developers to populate the global board
  const mockLeaderboard: Omit<LeaderboardUser, 'rank'>[] = [
    {
      name: 'Youssef Al-Harbi',
      avatarSeed: 'Y',
      score: 98,
      assessmentsCompleted: 14,
      accuracy: 96,
      title: isRtl ? 'مهندس برمجيات رئيسي' : 'Lead Arch',
      badgeColor: 'border-cyan-500 text-cyan-400 bg-cyan-500/10'
    },
    {
      name: 'Sarah Chen',
      avatarSeed: 'S',
      score: 95,
      assessmentsCompleted: 11,
      accuracy: 94,
      title: isRtl ? 'خبير ريأكت' : 'React Master',
      badgeColor: 'border-sky-500 text-sky-400 bg-sky-500/10'
    },
    {
      name: 'Elena Rostova',
      avatarSeed: 'E',
      score: 92,
      assessmentsCompleted: 15,
      accuracy: 90,
      title: isRtl ? 'محترف جافا سكريبت' : 'JS Wizard',
      badgeColor: 'border-yellow-500 text-yellow-400 bg-yellow-500/10'
    },
    {
      name: 'Omar Farooq',
      avatarSeed: 'O',
      score: 89,
      assessmentsCompleted: 9,
      accuracy: 92,
      title: isRtl ? 'مطور واجهات متكامل' : 'UI Architect',
      badgeColor: 'border-purple-500 text-purple-400 bg-purple-500/10'
    },
    {
      name: 'Akiro Tanaka',
      avatarSeed: 'A',
      score: 87,
      assessmentsCompleted: 12,
      accuracy: 89,
      title: isRtl ? 'مهندس استجابة فائق' : 'CSS Specialist',
      badgeColor: 'border-orange-500 text-orange-400 bg-orange-500/10'
    },
    {
      name: 'Mona El-Sayed',
      avatarSeed: 'M',
      score: 84,
      assessmentsCompleted: 8,
      accuracy: 88,
      title: isRtl ? 'مطور نظم الويب' : 'Web Engineer',
      badgeColor: 'border-emerald-500 text-emerald-400 bg-emerald-500/10'
    },
    {
      name: 'Lucas Dupont',
      avatarSeed: 'L',
      score: 81,
      assessmentsCompleted: 10,
      accuracy: 85,
      title: isRtl ? 'مطور فرونت-إند' : 'FE Developer',
      badgeColor: 'border-indigo-500 text-indigo-400 bg-indigo-500/10'
    },
    {
      name: 'Zahra Mansour',
      avatarSeed: 'Z',
      score: 79,
      assessmentsCompleted: 7,
      accuracy: 83,
      title: isRtl ? 'خبير تخطيط ونظم' : 'Layout Pro',
      badgeColor: 'border-pink-500 text-pink-400 bg-pink-500/10'
    },
    {
      name: 'David Miller',
      avatarSeed: 'D',
      score: 76,
      assessmentsCompleted: 6,
      accuracy: 80,
      title: isRtl ? 'مطور واجهات مبتدئ' : 'Associate FE',
      badgeColor: 'border-blue-500 text-blue-400 bg-blue-500/10'
    }
  ];

  // Dynamically integrate the current user into the leaderboard
  const compiledLeaderboard = useMemo(() => {
    // Current user row
    const currentUserRow: Omit<LeaderboardUser, 'rank'> = {
      name: userMetrics.name,
      avatarSeed: userMetrics.name.charAt(0).toUpperCase() || 'U',
      score: userMetrics.score,
      assessmentsCompleted: userMetrics.completed,
      accuracy: userMetrics.accuracy || userMetrics.score,
      isCurrentUser: true,
      title: userMetrics.completed > 0 
        ? (userMetrics.score >= 80 ? (isRtl ? 'مطور محترف' : 'Pro Dev') : (isRtl ? 'مطور ممارس' : 'Practitioner')) 
        : (isRtl ? 'عضو جديد' : 'New Competitor'),
      badgeColor: 'border-amber-500 text-amber-400 bg-amber-500/10'
    };

    const combinedList = [...mockLeaderboard, currentUserRow];

    // Sort based on the active metric
    if (activeMetric === 'score') {
      combinedList.sort((a, b) => {
        if (b.score !== a.score) return b.score - a.score;
        return b.assessmentsCompleted - a.assessmentsCompleted;
      });
    } else {
      combinedList.sort((a, b) => {
        if (b.assessmentsCompleted !== a.assessmentsCompleted) return b.assessmentsCompleted - a.assessmentsCompleted;
        return b.score - a.score;
      });
    }

    // Add rank attribute
    return combinedList.map((user, idx) => ({
      ...user,
      rank: idx + 1
    }));
  }, [userMetrics, activeMetric, isRtl]);

  // Apply search filtering
  const filteredLeaderboard = useMemo(() => {
    if (!searchQuery.trim()) return compiledLeaderboard;
    const query = searchQuery.toLowerCase().trim();
    return compiledLeaderboard.filter(user => 
      user.name.toLowerCase().includes(query) || 
      user.title.toLowerCase().includes(query)
    );
  }, [compiledLeaderboard, searchQuery]);

  // User's own summary ranking stats to display at top of leaderboard component
  const currentUserRankInfo = useMemo(() => {
    const found = compiledLeaderboard.find(u => u.isCurrentUser);
    return found ? { rank: found.rank, ...found } : { rank: 10, ...compiledLeaderboard[compiledLeaderboard.length - 1] };
  }, [compiledLeaderboard]);

  return (
    <div className="bg-slate-900 border border-slate-800/80 rounded-3xl p-6 md:p-8 space-y-6" id="global-leaderboard-panel">
      
      {/* Header section with Trophy icon & description */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <Trophy className="w-5.5 h-5.5 text-amber-500 animate-bounce" />
            <h3 className="font-extrabold text-white text-base md:text-lg">
              {isRtl ? 'صدارة المطورين العالمية' : 'Global Developer Leaderboard'}
            </h3>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            {isRtl 
              ? 'تحدى مجتمع المحترفين واحتل مركز الصدارة عبر زيادة نقاط تقييماتك ودقتك البرمجية.' 
              : 'Compete with developers worldwide. Rank up by completing quizzes with high precision and speed.'}
          </p>
        </div>

        {/* Tab Switchers: Score vs Completed */}
        <div className="flex bg-slate-950 p-1.5 rounded-xl border border-slate-800/80" id="leaderboard-metrics-toggle">
          <button
            onClick={() => setActiveMetric('score')}
            className={`px-3 py-1.5 rounded-lg text-[11px] font-black tracking-wider uppercase transition-all cursor-pointer ${
              activeMetric === 'score'
                ? 'bg-amber-500 text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            {isRtl ? 'أعلى الدرجات' : 'Best Score'}
          </button>
          <button
            onClick={() => setActiveMetric('completed')}
            className={`px-3 py-1.5 rounded-lg text-[11px] font-black tracking-wider uppercase transition-all cursor-pointer ${
              activeMetric === 'completed'
                ? 'bg-amber-500 text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            {isRtl ? 'المحاولات المنجزة' : 'Most Attempts'}
          </button>
        </div>
      </div>

      {/* Real-time personal rank badge banner */}
      <div className="bg-gradient-to-r from-amber-500/15 to-amber-600/5 border border-amber-500/30 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center space-x-3.5 rtl:space-x-reverse">
          <div className="w-10 h-10 rounded-xl bg-amber-500 flex items-center justify-center shadow-lg font-black text-slate-950 font-mono text-lg shrink-0">
            #{currentUserRankInfo.rank}
          </div>
          <div>
            <h4 className="text-xs font-black text-white flex items-center gap-1.5">
              <span>{isRtl ? 'تصنيفك العالمي الحالي' : 'Your Live Leaderboard Status'}</span>
              <span className="animate-pulse w-2 h-2 rounded-full bg-emerald-500" />
            </h4>
            <p className="text-[10px] text-amber-200/80 mt-0.5">
              {isRtl 
                ? `اسمك المتسابق: ${currentUserRankInfo.name} • اللقب: ${currentUserRankInfo.title}` 
                : `Handle: ${currentUserRankInfo.name} • Badge: ${currentUserRankInfo.title}`}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4 text-xs font-mono">
          <div className="text-center bg-slate-950/60 py-1.5 px-3 rounded-lg border border-slate-800">
            <span className="text-slate-400 block text-[9px] uppercase font-black">{isRtl ? 'الدقة' : 'Accuracy'}</span>
            <span className="text-emerald-400 font-bold">{currentUserRankInfo.accuracy}%</span>
          </div>
          <div className="text-center bg-slate-950/60 py-1.5 px-3 rounded-lg border border-slate-800">
            <span className="text-slate-400 block text-[9px] uppercase font-black">{isRtl ? 'أفضل درجة' : 'Best score'}</span>
            <span className="text-amber-400 font-bold">{currentUserRankInfo.score}%</span>
          </div>
          <div className="text-center bg-slate-950/60 py-1.5 px-3 rounded-lg border border-slate-800">
            <span className="text-slate-400 block text-[9px] uppercase font-black">{isRtl ? 'التقييمات' : 'Assessments'}</span>
            <span className="text-purple-400 font-bold">{currentUserRankInfo.assessmentsCompleted}</span>
          </div>
        </div>
      </div>

      {/* Search Input Bar */}
      <div className="relative">
        <input
          type="text"
          placeholder={isRtl ? 'ابحث عن مطور برمجيات بالاسم أو اللقب الفني...' : 'Search competitors by name, badge, or title...'}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-slate-950 border border-slate-800/80 focus:border-slate-700 focus:outline-none rounded-xl px-4 py-2.5 text-xs text-slate-200 pl-10 rtl:pl-4 rtl:pr-10 placeholder:text-slate-600"
        />
        <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-3 rtl:left-auto rtl:right-3.5" />
      </div>

      {/* Leaderboard Competitors Feed */}
      <div className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-950/40">
        <div className="divide-y divide-slate-900/60">
          
          {filteredLeaderboard.length > 0 ? (
            filteredLeaderboard.map((user) => {
              const isTop3 = user.rank <= 3;
              
              return (
                <div 
                  key={user.rank}
                  className={`flex flex-col sm:flex-row justify-between items-center p-4 transition-all gap-4 ${
                    user.isCurrentUser 
                      ? 'bg-amber-500/10 border-l-2 border-r-2 border-amber-500/30' 
                      : 'hover:bg-slate-900/40'
                  }`}
                >
                  
                  {/* Left Column: Rank + Avatar + Name */}
                  <div className="flex items-center space-x-3 rtl:space-x-reverse w-full sm:w-auto">
                    
                    {/* Rank Indicator */}
                    <div className="w-8 flex justify-center shrink-0">
                      {user.rank === 1 ? (
                        <Medal className="w-5.5 h-5.5 text-amber-400" />
                      ) : user.rank === 2 ? (
                        <Medal className="w-5.5 h-5.5 text-slate-300" />
                      ) : user.rank === 3 ? (
                        <Medal className="w-5.5 h-5.5 text-orange-400" />
                      ) : (
                        <span className="text-xs font-bold text-slate-500 font-mono">#{user.rank}</span>
                      )}
                    </div>

                    {/* Avatar sphere */}
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-xs font-black shrink-0 shadow-inner ${
                      isTop3 
                        ? 'bg-amber-500 text-slate-950 font-bold' 
                        : user.isCurrentUser
                        ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                        : 'bg-slate-900 text-slate-300 border border-slate-800'
                    }`}>
                      {user.avatarSeed}
                    </div>

                    {/* Handle and Title badge */}
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-1.5">
                        <span className={`text-xs font-bold ${user.isCurrentUser ? 'text-amber-400' : 'text-slate-200'}`}>
                          {user.name}
                        </span>
                        {user.isCurrentUser && (
                          <span className="text-[9px] bg-amber-500 text-slate-950 px-1 py-0.1 font-black rounded uppercase tracking-wider font-mono shrink-0">
                            {isRtl ? 'أنت' : 'You'}
                          </span>
                        )}
                        {isTop3 && (
                          <Star className="w-3 h-3 text-amber-500 fill-current shrink-0" />
                        )}
                      </div>
                      
                      {/* Job / competency title badge */}
                      <span className={`inline-flex px-2 py-0.2 rounded-md text-[9px] font-bold border ${user.badgeColor}`}>
                        {user.title}
                      </span>
                    </div>

                  </div>

                  {/* Right Column: Key performance metrics */}
                  <div className="flex items-center gap-6 text-xs font-mono justify-end w-full sm:w-auto">
                    
                    <div className="text-right rtl:text-left">
                      <span className="text-[10px] text-slate-500 block">{isRtl ? 'الدقة' : 'Accuracy'}</span>
                      <span className="text-slate-300 font-bold">{user.accuracy}%</span>
                    </div>

                    <div className="text-right rtl:text-left">
                      <span className="text-[10px] text-slate-500 block">{isRtl ? 'المحاولات' : 'Attempts'}</span>
                      <span className="text-slate-400 font-bold">{user.assessmentsCompleted}</span>
                    </div>

                    <div className="text-right rtl:text-left min-w-[70px]">
                      <span className="text-[10px] text-slate-500 block">{isRtl ? 'أعلى تقييم' : 'Max Score'}</span>
                      <span className="text-amber-400 font-black font-mono text-sm">{user.score}%</span>
                    </div>

                  </div>

                </div>
              );
            })
          ) : (
            <div className="py-12 text-center text-slate-500 italic text-xs">
              {isRtl ? 'لم يعثر على أي متسابق مطابق للبحث.' : 'No competitors match your current query.'}
            </div>
          )}

        </div>
      </div>

      {/* Small informative advice footer */}
      <div className="flex items-center gap-1.5 text-[10px] font-mono text-slate-500 pt-1">
        <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
        <span>
          {isRtl 
            ? 'تُحدّث قوائم الصدارة تلقائياً عند إنهاء أي تقييم أو تحدي كود فوري.' 
            : 'Leaderboards sync in real time upon finishing a competency evaluation or coding challenge.'}
        </span>
      </div>

    </div>
  );
};
