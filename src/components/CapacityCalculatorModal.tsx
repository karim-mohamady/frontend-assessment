/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Calculator, Cpu, HardDrive, Database, Zap, Sparkles,
  X, HelpCircle, Layers, ArrowRight, Activity
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface CapacityCalculatorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CapacityCalculatorModal: React.FC<CapacityCalculatorModalProps> = ({ isOpen, onClose }) => {
  const { isRtl } = useApp();

  // Inputs
  const [dau, setDau] = useState<number>(10000000); // 10 Million DAU
  const [readsPerUser, setReadsPerUser] = useState<number>(20);
  const [writesPerUser, setWritesPerUser] = useState<number>(2);
  const [readSizeBytes, setReadSizeBytes] = useState<number>(10240); // 10 KB
  const [writeSizeBytes, setWriteSizeBytes] = useState<number>(1024); // 1 KB
  const [retentionYears, setRetentionYears] = useState<number>(5);
  const [peakMultiplier, setPeakMultiplier] = useState<number>(2.5);

  // Calculations
  const SECONDS_IN_DAY = 86400;

  const totalReadsDaily = dau * readsPerUser;
  const totalWritesDaily = dau * writesPerUser;
  const totalReqsDaily = totalReadsDaily + totalWritesDaily;

  const averageQps = Math.round(totalReqsDaily / SECONDS_IN_DAY);
  const readQps = Math.round(totalReadsDaily / SECONDS_IN_DAY);
  const writeQps = Math.round(totalWritesDaily / SECONDS_IN_DAY);
  const peakQps = Math.round(averageQps * peakMultiplier);

  // Bandwidth
  const ingressBytesPerSec = writeQps * writeSizeBytes;
  const egressBytesPerSec = readQps * readSizeBytes;

  const ingressMbSec = (ingressBytesPerSec / (1024 * 1024)).toFixed(2);
  const egressMbSec = (egressBytesPerSec / (1024 * 1024)).toFixed(2);

  // Storage
  const dailyStorageBytes = totalWritesDaily * writeSizeBytes;
  const yearlyStorageTb = ((dailyStorageBytes * 365) / (1024 * 1024 * 1024 * 1024)).toFixed(2);
  const totalStorageTb = ((dailyStorageBytes * 365 * retentionYears) / (1024 * 1024 * 1024 * 1024)).toFixed(2);

  // 80/20 Cache Rule (20% hot data cached)
  const dailyReadVolumeBytes = totalReadsDaily * readSizeBytes;
  const cacheRamGb = ((dailyReadVolumeBytes * 0.20) / (1024 * 1024 * 1024)).toFixed(2);

  // Instance estimations
  const webServersNeeded = Math.max(2, Math.ceil(peakQps / 1000));
  const redisNodesNeeded = Math.max(1, Math.ceil(parseFloat(cacheRamGb) / 32));

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md" id="capacity-calc-modal">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-4xl max-h-[90vh] overflow-y-auto p-6 md:p-8 space-y-6 shadow-2xl relative"
        >
          <button
            onClick={onClose}
            className="absolute top-5 left-5 rtl:left-auto rtl:right-5 p-2 text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-xl transition-all cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Modal Header */}
          <div className="flex items-center space-x-3 rtl:space-x-reverse pr-10 rtl:pr-0 rtl:pl-10">
            <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-2xl text-amber-400">
              <Calculator className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl font-black text-white">
                {isRtl ? 'حاسبة التقديرات الهندسية (Back-of-the-Envelope Capacity Planner)' : 'Back-of-the-Envelope Capacity Estimator'}
              </h3>
              <p className="text-xs text-slate-400">
                {isRtl ? 'احسب الأحمال (QPS)، متطلبات الذاكرة (RAM Cache)، التخزين (Storage)، والشبكة (Bandwidth) لمقابلات تصميم النظم.' : 'Calculate QPS, Peak Load, RAM Caching (80/20 rule), Storage, and Bandwidth for System Design interviews.'}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Input Sliders & Controls */}
            <div className="lg:col-span-5 bg-slate-950 border border-slate-800 rounded-2xl p-5 space-y-4 text-xs">
              <h4 className="font-extrabold text-white border-b border-slate-800 pb-2 flex items-center justify-between">
                <span>{isRtl ? 'مدخلات النظام' : 'System Inputs'}</span>
                <span className="text-[10px] text-amber-400 font-mono">Live Sync</span>
              </h4>

              {/* DAU */}
              <div className="space-y-1">
                <div className="flex justify-between font-mono">
                  <span className="text-slate-400">{isRtl ? 'المستخدمين النشطين (DAU):' : 'DAU:'}</span>
                  <span className="text-amber-400 font-bold">{(dau / 1000000).toFixed(1)}M</span>
                </div>
                <input
                  type="range"
                  min="100000"
                  max="100000000"
                  step="500000"
                  value={dau}
                  onChange={e => setDau(Number(e.target.value))}
                  className="w-full accent-amber-500 cursor-pointer"
                />
              </div>

              {/* Read / Write ratio */}
              <div className="grid grid-cols-2 gap-3 pt-1">
                <div className="space-y-1">
                  <label className="text-[11px] text-slate-400 block">{isRtl ? 'قراءات/مستخدم' : 'Reads/User/Day'}</label>
                  <input
                    type="number"
                    value={readsPerUser}
                    onChange={e => setReadsPerUser(Number(e.target.value))}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2 font-mono text-white text-center"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] text-slate-400 block">{isRtl ? 'كتابات/مستخدم' : 'Writes/User/Day'}</label>
                  <input
                    type="number"
                    value={writesPerUser}
                    onChange={e => setWritesPerUser(Number(e.target.value))}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2 font-mono text-white text-center"
                  />
                </div>
              </div>

              {/* Sizes */}
              <div className="grid grid-cols-2 gap-3 pt-1">
                <div className="space-y-1">
                  <label className="text-[11px] text-slate-400 block">{isRtl ? 'حجم القراءة (KB)' : 'Read Payload (KB)'}</label>
                  <input
                    type="number"
                    value={readSizeBytes / 1024}
                    onChange={e => setReadSizeBytes(Number(e.target.value) * 1024)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2 font-mono text-white text-center"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] text-slate-400 block">{isRtl ? 'حجم الكتابة (KB)' : 'Write Payload (KB)'}</label>
                  <input
                    type="number"
                    value={writeSizeBytes / 1024}
                    onChange={e => setWriteSizeBytes(Number(e.target.value) * 1024)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2 font-mono text-white text-center"
                  />
                </div>
              </div>

              {/* Retention & Peak */}
              <div className="grid grid-cols-2 gap-3 pt-1">
                <div className="space-y-1">
                  <label className="text-[11px] text-slate-400 block">{isRtl ? 'الاحتفاظ (سنوات)' : 'Retention (Yrs)'}</label>
                  <input
                    type="number"
                    value={retentionYears}
                    onChange={e => setRetentionYears(Number(e.target.value))}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2 font-mono text-white text-center"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] text-slate-400 block">{isRtl ? 'مضاعف الذروة' : 'Peak Multiplier'}</label>
                  <input
                    type="number"
                    step="0.5"
                    value={peakMultiplier}
                    onChange={e => setPeakMultiplier(Number(e.target.value))}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2 font-mono text-white text-center"
                  />
                </div>
              </div>

            </div>

            {/* Calculated Output Metrics */}
            <div className="lg:col-span-7 space-y-4">
              
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {/* QPS */}
                <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 space-y-1">
                  <span className="text-[10px] font-extrabold uppercase text-slate-500 block">Avg QPS</span>
                  <span className="text-xl font-black font-mono text-amber-400">{averageQps.toLocaleString()}</span>
                  <span className="text-[10px] text-slate-500 block font-mono">req/sec</span>
                </div>

                {/* Peak QPS */}
                <div className="bg-slate-950 border border-amber-500/30 rounded-2xl p-4 space-y-1">
                  <span className="text-[10px] font-extrabold uppercase text-amber-400 block">Peak QPS ({peakMultiplier}x)</span>
                  <span className="text-xl font-black font-mono text-amber-400">{peakQps.toLocaleString()}</span>
                  <span className="text-[10px] text-slate-500 block font-mono">req/sec</span>
                </div>

                {/* RAM Cache */}
                <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 space-y-1 col-span-2 sm:col-span-1">
                  <span className="text-[10px] font-extrabold uppercase text-emerald-400 block">Redis RAM (80/20)</span>
                  <span className="text-xl font-black font-mono text-emerald-400">{cacheRamGb} GB</span>
                  <span className="text-[10px] text-slate-500 block font-mono">20% Hot Cache</span>
                </div>
              </div>

              {/* Storage Breakdown */}
              <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 space-y-3 text-xs">
                <h4 className="font-extrabold text-white flex items-center justify-between">
                  <span className="flex items-center gap-1.5 text-blue-400">
                    <HardDrive className="w-4 h-4" />
                    <span>{isRtl ? 'حجم التخزين والبيانات (Storage Capacity)' : 'Storage Capacity Forecast'}</span>
                  </span>
                  <span className="font-mono text-amber-400 text-sm font-black">{totalStorageTb} TB</span>
                </h4>

                <div className="grid grid-cols-2 gap-3 text-slate-300 font-mono">
                  <div className="bg-slate-900 p-3 rounded-xl border border-slate-800">
                    <span className="text-slate-500 text-[10px] block uppercase">Yearly Growth</span>
                    <span className="text-white font-bold">{yearlyStorageTb} TB / year</span>
                  </div>
                  <div className="bg-slate-900 p-3 rounded-xl border border-slate-800">
                    <span className="text-slate-500 text-[10px] block uppercase">{retentionYears} Year Total</span>
                    <span className="text-amber-400 font-bold">{totalStorageTb} TB</span>
                  </div>
                </div>
              </div>

              {/* Bandwidth & Servers */}
              <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 space-y-3 text-xs">
                <h4 className="font-extrabold text-white flex items-center gap-1.5 text-cyan-400">
                  <Zap className="w-4 h-4" />
                  <span>{isRtl ? 'نطاق التردد وحجم السيرفرات (Bandwidth & Infrastructure)' : 'Bandwidth & Infrastructure Estimates'}</span>
                </h4>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 font-mono text-slate-300">
                  <div className="bg-slate-900 p-2.5 rounded-xl border border-slate-800">
                    <span className="text-slate-500 text-[10px] block">Egress (Out)</span>
                    <span className="text-cyan-300 font-bold">{egressMbSec} MB/s</span>
                  </div>
                  <div className="bg-slate-900 p-2.5 rounded-xl border border-slate-800">
                    <span className="text-slate-500 text-[10px] block">Ingress (In)</span>
                    <span className="text-cyan-300 font-bold">{ingressMbSec} MB/s</span>
                  </div>
                  <div className="bg-slate-900 p-2.5 rounded-xl border border-slate-800">
                    <span className="text-slate-500 text-[10px] block">App Instances</span>
                    <span className="text-emerald-400 font-bold">{webServersNeeded} nodes</span>
                  </div>
                  <div className="bg-slate-900 p-2.5 rounded-xl border border-slate-800">
                    <span className="text-slate-500 text-[10px] block">Redis Nodes</span>
                    <span className="text-emerald-400 font-bold">{redisNodesNeeded} nodes</span>
                  </div>
                </div>
              </div>

            </div>

          </div>

        </motion.div>
      </div>
    </AnimatePresence>
  );
};
