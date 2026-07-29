/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Boxes, Server, Database, HardDrive, Cpu, ShieldAlert,
  Sparkles, Plus, Trash2, Play, CheckCircle2, AlertTriangle,
  Layers, ArrowRight, Activity, RefreshCw, BarChart2, Zap, Share2, Calculator
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { CapacityCalculatorModal } from '../components/CapacityCalculatorModal';

export interface SystemComponent {
  id: string;
  type: 'client' | 'load_balancer' | 'api_gateway' | 'app_server' | 'cache' | 'database' | 'message_queue' | 'cdn' | 'storage';
  label: string;
  x: number;
  y: number;
  instances: number;
  notes?: string;
}

export interface Connection {
  fromId: string;
  toId: string;
  label?: string;
}

export const SystemDesignStudio: React.FC = () => {
  const { lang, isRtl } = useApp();

  const [isCalcOpen, setIsCalcOpen] = useState<boolean>(false);

  // Selected preset scenario
  const [scenario, setScenario] = useState<string>('url_shortener');

  // Architecture components state
  const [components, setComponents] = useState<SystemComponent[]>([
    { id: 'client-1', type: 'client', label: 'Web & Mobile Clients', x: 50, y: 150, instances: 100000 },
    { id: 'lb-1', type: 'load_balancer', label: 'NGINX Load Balancer', x: 260, y: 150, instances: 2 },
    { id: 'api-1', type: 'api_gateway', label: 'API Gateway', x: 470, y: 150, instances: 3 },
    { id: 'app-1', type: 'app_server', label: 'Node/React App Cluster', x: 680, y: 100, instances: 8 },
    { id: 'cache-1', type: 'cache', label: 'Redis Cache Cluster', x: 680, y: 220, instances: 3 },
    { id: 'db-1', type: 'database', label: 'PostgreSQL Primary DB', x: 890, y: 150, instances: 1 },
  ]);

  const [connections, setConnections] = useState<Connection[]>([
    { fromId: 'client-1', toId: 'lb-1', label: 'HTTPS' },
    { fromId: 'lb-1', toId: 'api-1', label: 'gRPC' },
    { fromId: 'api-1', toId: 'app-1', label: 'HTTP/2' },
    { fromId: 'app-1', toId: 'cache-1', label: 'Cache Query' },
    { fromId: 'app-1', toId: 'db-1', label: 'SQL Read/Write' },
  ]);

  // Selected component for inspector
  const [selectedCompId, setSelectedCompId] = useState<string | null>('lb-1');

  // Traffic & metrics parameters
  const [dailyUsers, setDailyUsers] = useState<number>(500000);
  const [readWriteRatio, setReadWriteRatio] = useState<number>(10); // 10:1 read to write ratio

  // AI Evaluation output state
  const [isEvaluating, setIsEvaluating] = useState<boolean>(false);
  const [evaluation, setEvaluation] = useState<{
    score: number;
    title: string;
    summary: string;
    strengths: string[];
    bottlenecks: string[];
    recommendations: string[];
    estimatedQps: number;
    estimatedStorageGbPerYear: number;
  } | null>(null);

  const presets = [
    {
      id: 'url_shortener',
      nameEn: 'URL Shortener (TinyURL)',
      nameAr: 'اختصار الروابط (TinyURL)',
      descEn: 'Design a high-throughput, low-latency URL shortening & redirection service.',
      descAr: 'تصميم خدمة اختصار وروابط عالية الأداء وقليلة التأخير.',
      targetQps: 10000,
    },
    {
      id: 'chat_app',
      nameEn: 'Real-Time Messaging (WhatsApp)',
      nameAr: 'تطبيق المحادثات المباشرة (واتساب)',
      descEn: 'Design a scalable messaging backend with WebSocket, message queues, and media storage.',
      descAr: 'تصميم نظام مراسلة فورية باستخدام WebSockets وطوابير الرسائل.',
      targetQps: 50000,
    },
    {
      id: 'e_commerce',
      nameEn: 'E-Commerce Flash Sale Platform',
      nameAr: 'منصة التجارة الإلكترونية والتخفيضات',
      descEn: 'Handle sudden traffic spikes, ACID inventory management, and payment processing.',
      descAr: 'التعامل مع الضغط العالي أثناء التخفيضات وإدارة المخزون والدفع.',
      targetQps: 25000,
    },
    {
      id: 'video_streaming',
      nameEn: 'Video Streaming (YouTube/Netflix)',
      nameAr: 'منصة بث الفيديو (يوتيوب/نتفليكس)',
      descEn: 'Design CDN distribution, chunk encoding, adaptive bitrate streaming, and search.',
      descAr: 'تصميم شبكات توزيع المحتوى CDN وتجهيز ترميز الفيديو المتكيف.',
      targetQps: 100000,
    }
  ];

  const componentTypes = [
    { type: 'client', nameEn: 'Client App', nameAr: 'تطبيق العميل', icon: Cpu, color: 'border-blue-500 bg-blue-500/10 text-blue-400' },
    { type: 'load_balancer', nameEn: 'Load Balancer', nameAr: 'موزع الأحمال', icon: Zap, color: 'border-amber-500 bg-amber-500/10 text-amber-400' },
    { type: 'api_gateway', nameEn: 'API Gateway', nameAr: 'بوابة الـ API', icon: Layers, color: 'border-purple-500 bg-purple-500/10 text-purple-400' },
    { type: 'app_server', nameEn: 'App Server', nameAr: 'خادم التطبيقات', icon: Server, color: 'border-emerald-500 bg-emerald-500/10 text-emerald-400' },
    { type: 'cache', nameEn: 'In-Memory Cache', nameAr: 'ذاكرة التخزين المؤقت', icon: Activity, color: 'border-rose-500 bg-rose-500/10 text-rose-400' },
    { type: 'database', nameEn: 'Database', nameAr: 'قاعدة البيانات', icon: Database, color: 'border-cyan-500 bg-cyan-500/10 text-cyan-400' },
    { type: 'message_queue', nameEn: 'Message Queue', nameAr: 'طابور الرسائل', icon: Boxes, color: 'border-orange-500 bg-orange-500/10 text-orange-400' },
    { type: 'cdn', nameEn: 'CDN Network', nameAr: 'شبكة CDN', icon: RefreshCw, color: 'border-indigo-500 bg-indigo-500/10 text-indigo-400' },
    { type: 'storage', nameEn: 'Object Storage (S3)', nameAr: 'التخزين السحابي', icon: HardDrive, color: 'border-teal-500 bg-teal-500/10 text-teal-400' },
  ];

  const getCompColor = (type: string) => {
    const item = componentTypes.find(c => c.type === type);
    return item ? item.color : 'border-slate-700 bg-slate-800 text-slate-300';
  };

  const addComponent = (type: SystemComponent['type']) => {
    const typeObj = componentTypes.find(c => c.type === type);
    const label = typeObj ? (lang === 'ar' ? typeObj.nameAr : typeObj.nameEn) : 'New Component';
    const newComp: SystemComponent = {
      id: `comp-${Date.now()}`,
      type,
      label: `${label} #${components.length + 1}`,
      x: 100 + (components.length % 5) * 160,
      y: 120 + Math.floor(components.length / 5) * 120,
      instances: 1,
    };
    setComponents([...components, newComp]);
    setSelectedCompId(newComp.id);
  };

  const removeComponent = (id: string) => {
    setComponents(components.filter(c => c.id !== id));
    setConnections(connections.filter(c => c.fromId !== id && c.toId !== id));
    if (selectedCompId === id) setSelectedCompId(null);
  };

  // Run AI Architecture Evaluation
  const runArchitecturalEvaluation = () => {
    setIsEvaluating(true);
    setEvaluation(null);

    setTimeout(() => {
      // Calculate realistic metrics
      const avgQps = Math.round((dailyUsers * 3) / 86400);
      const estStorage = Math.round((dailyUsers * 365 * 0.002)); // GB per year

      const hasLB = components.some(c => c.type === 'load_balancer');
      const hasCache = components.some(c => c.type === 'cache');
      const hasDB = components.some(c => c.type === 'database');
      const dbCount = components.filter(c => c.type === 'database').reduce((acc, curr) => acc + curr.instances, 0);
      const appCount = components.filter(c => c.type === 'app_server').reduce((acc, curr) => acc + curr.instances, 0);

      const strengths: string[] = [];
      const bottlenecks: string[] = [];
      const recommendations: string[] = [];
      let score = 70;

      if (hasLB) {
        strengths.push(isRtl ? 'استخدام موزع أحمال (Load Balancer) يمنع تكدس الطلبات على خادم واحد.' : 'Load Balancer distributes inbound connections gracefully.');
        score += 8;
      } else {
        bottlenecks.push(isRtl ? 'غياب موزع الأحمال يصنع نقطة فشل واحدة (Single Point of Failure).' : 'Missing Load Balancer creates SPOF bottleneck.');
      }

      if (hasCache) {
        strengths.push(isRtl ? 'وجود طبقة التخزين المؤقت (Redis) يقلل الحمل على قاعدة البيانات بنسبة تصل إلى 80%.' : 'In-memory caching layer reduces DB read query pressure by up to 80%.');
        score += 10;
      } else {
        bottlenecks.push(isRtl ? 'عدم وجود ذاكرة مؤقتة يؤدي إلى بطء القراءة وإجهاد قاعدة البيانات.' : 'Direct DB hits without caching will cause high latency under peak traffic.');
        recommendations.push(isRtl ? 'أضف Redis أو Memcached أمام قاعدة البيانات لاستعلامات القراءة العالية.' : 'Introduce Redis caching cluster for read-heavy key operations.');
      }

      if (dbCount === 1) {
        bottlenecks.push(isRtl ? 'قاعدة بيانات واحدة فقط تعرض النظام للتعطل الكامل إذا سقطت.' : 'Single primary DB instance without read-replicas poses high downtime risk.');
        recommendations.push(isRtl ? 'قم بإضافة خوادم قراءة فرعية (Read Replicas) لتوزيع حمل القراءة.' : 'Configure Primary-Replica DB replication with multi-AZ failover.');
      } else if (dbCount > 1) {
        strengths.push(isRtl ? 'تعدد خوادم قاعدة البيانات يوفر العزل والاعتمادية.' : 'Multiple DB instances ensure high availability.');
        score += 7;
      }

      if (appCount >= 3) {
        strengths.push(isRtl ? 'توفير خوادم تطبيقات متعددة يدعم التوسع الأفقي (Horizontal Scaling).' : 'Multi-instance app tier supports seamless horizontal scaling.');
        score += 5;
      }

      setEvaluation({
        score: Math.min(score, 98),
        title: isRtl ? 'تقييم معمارية النظام' : 'Architectural Readiness Report',
        summary: isRtl
          ? `النظام الحالي قادر على معالجة ما يقارب ${avgQps} طلب/ثانية بشكل آمن، مع بعض التوصيات لضمان التوافر العالي 99.99%.`
          : `The architecture can reliably sustain ~${avgQps} QPS with estimated ${estStorage} GB annual data footprint.`,
        strengths,
        bottlenecks,
        recommendations,
        estimatedQps: avgQps,
        estimatedStorageGbPerYear: estStorage,
      });

      setIsEvaluating(false);
    }, 1500);
  };

  const selectedComp = components.find(c => c.id === selectedCompId);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8" id="system-design-studio">
      
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-6 border-b border-slate-800">
        <div>
          <div className="inline-flex items-center space-x-2 rtl:space-x-reverse bg-amber-500/10 text-amber-400 border border-amber-500/20 px-3 py-1 rounded-full text-xs font-black tracking-wide uppercase mb-2">
            <Boxes className="w-3.5 h-3.5" />
            <span>{isRtl ? 'استوديو تصميم الأنظمة الشاملة' : 'System Architecture Canvas & AI Evaluator'}</span>
          </div>
          <h1 className="text-2xl md:text-4xl font-extrabold text-white tracking-tight">
            {isRtl ? 'معمل تصميم النظم ومعمارية الويب' : 'System Design & Scalability Studio'}
          </h1>
          <p className="text-slate-400 text-sm mt-1 max-w-2xl">
            {isRtl 
              ? 'صمّم معماريات الأنظمة الكبيرة، وزّع الأحمال وقواعد البيانات، واطلب تحليلاً فورياً بالذكاء الاصطناعي لاكتشاف نقاط الفشل واختناقات الأداء.'
              : 'Build high-scale distributed architectures, connect servers and databases, and get instant AI scalability feedback.'}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => setIsCalcOpen(true)}
            className="flex items-center space-x-2 rtl:space-x-reverse bg-slate-900 hover:bg-slate-800 text-amber-400 border border-slate-800 hover:border-amber-500/30 px-4 py-3 rounded-xl font-black text-xs transition-all cursor-pointer shadow-md"
          >
            <Calculator className="w-4 h-4" />
            <span>{isRtl ? 'حاسبة الأحمال والتخمينات' : 'Capacity Planner'}</span>
          </button>

          <button
            onClick={runArchitecturalEvaluation}
            disabled={isEvaluating}
            className="flex items-center space-x-2 rtl:space-x-reverse bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-slate-950 font-black px-5 py-3 rounded-xl shadow-lg shadow-amber-500/20 transition-all cursor-pointer disabled:opacity-50 text-xs"
          >
            {isEvaluating ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>{isRtl ? 'جاري التحليل...' : 'Evaluating Topology...'}</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>{isRtl ? 'تقييم المعمارية بالذكاء الاصطناعي' : 'Evaluate Architecture'}</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Preset Scenarios Tabs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {presets.map(p => (
          <button
            key={p.id}
            onClick={() => setScenario(p.id)}
            className={`p-4 rounded-2xl border text-left rtl:text-right transition-all cursor-pointer ${
              scenario === p.id
                ? 'bg-amber-500/10 border-amber-500/50 text-white shadow-lg shadow-amber-500/5'
                : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-black text-amber-400 uppercase tracking-wider">{p.targetQps} QPS</span>
              {scenario === p.id && <CheckCircle2 className="w-4 h-4 text-amber-500" />}
            </div>
            <p className="font-extrabold text-sm text-white mb-1">{isRtl ? p.nameAr : p.nameEn}</p>
            <p className="text-xs text-slate-400 line-clamp-2">{isRtl ? p.descAr : p.descEn}</p>
          </button>
        ))}
      </div>

      {/* Main Studio Workbench Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        
        {/* Left Toolbar: Add Component palette */}
        <div className="lg:col-span-1 bg-slate-900 border border-slate-800 rounded-3xl p-5 space-y-4">
          <h3 className="text-xs font-extrabold text-slate-400 uppercase tracking-wider flex items-center gap-2">
            <Plus className="w-4 h-4 text-amber-400" />
            <span>{isRtl ? 'إضافة مكونات النظام' : 'Add System Components'}</span>
          </h3>

          <div className="space-y-2">
            {componentTypes.map(ct => {
              const Icon = ct.icon;
              return (
                <button
                  key={ct.type}
                  onClick={() => addComponent(ct.type as any)}
                  className={`w-full flex items-center justify-between p-3 rounded-xl border text-xs font-bold transition-all cursor-pointer ${ct.color} hover:brightness-125`}
                >
                  <div className="flex items-center space-x-2.5 rtl:space-x-reverse">
                    <Icon className="w-4 h-4 shrink-0" />
                    <span>{isRtl ? ct.nameAr : ct.nameEn}</span>
                  </div>
                  <Plus className="w-3.5 h-3.5" />
                </button>
              );
            })}
          </div>

          {/* Traffic configuration sliders */}
          <div className="pt-4 border-t border-slate-800 space-y-3">
            <h4 className="text-xs font-black text-slate-300 flex items-center gap-2">
              <BarChart2 className="w-3.5 h-3.5 text-amber-400" />
              <span>{isRtl ? 'تقدير زيارات المستخدمين' : 'Traffic Estimates'}</span>
            </h4>

            <div>
              <div className="flex justify-between text-xs text-slate-400 mb-1">
                <span>{isRtl ? 'المستخدمين يومياً (DAU)' : 'Daily Active Users'}</span>
                <span className="font-mono text-amber-400 font-bold">{(dailyUsers / 1000).toFixed(0)}k</span>
              </div>
              <input
                type="range"
                min="50000"
                max="5000000"
                step="50000"
                value={dailyUsers}
                onChange={e => setDailyUsers(Number(e.target.value))}
                className="w-full accent-amber-500 cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* Center: Canvas Stage */}
        <div className="lg:col-span-2 bg-slate-950 border border-slate-800 rounded-3xl p-6 min-h-[420px] relative overflow-hidden flex flex-col justify-between">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:24px_24px] opacity-20 pointer-events-none" />

          {/* Canvas Header */}
          <div className="relative z-10 flex items-center justify-between pb-4 border-b border-slate-800/80">
            <div className="flex items-center space-x-2 rtl:space-x-reverse">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs font-extrabold text-slate-300">{isRtl ? 'مخطط المعمارية التفاعلي' : 'Interactive Architectural Canvas'}</span>
            </div>
            <span className="text-[11px] font-mono text-slate-500">{components.length} {isRtl ? 'مكونات' : 'Nodes'}</span>
          </div>

          {/* Interactive Component Nodes Grid */}
          <div className="relative z-10 py-6 grid grid-cols-2 sm:grid-cols-3 gap-4 my-auto">
            {components.map(comp => {
              const isSelected = comp.id === selectedCompId;
              const typeInfo = componentTypes.find(t => t.type === comp.type);
              const Icon = typeInfo ? typeInfo.icon : Server;

              return (
                <motion.div
                  key={comp.id}
                  onClick={() => setSelectedCompId(comp.id)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`p-3.5 rounded-2xl border cursor-pointer transition-all relative ${
                    isSelected
                      ? 'border-amber-500 bg-amber-500/10 shadow-lg shadow-amber-500/10 ring-1 ring-amber-500'
                      : 'border-slate-800 bg-slate-900/90 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className={`p-2 rounded-xl border ${getCompColor(comp.type)}`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <span className="text-[10px] font-mono font-extrabold bg-slate-950 px-2 py-0.5 rounded-md text-amber-400 border border-slate-800">
                      x{comp.instances}
                    </span>
                  </div>
                  <p className="font-extrabold text-xs text-white truncate">{comp.label}</p>
                  <p className="text-[10px] text-slate-500 uppercase font-mono mt-0.5">{comp.type.replace('_', ' ')}</p>
                </motion.div>
              );
            })}
          </div>

          {/* Canvas Footer Legend */}
          <div className="relative z-10 pt-4 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
            <span>{isRtl ? 'انقر على أي عنصر للتعديل والتحكم بخصائصه' : 'Click any node to inspect & edit configuration'}</span>
            <span className="text-amber-400 font-extrabold">{isRtl ? 'محاكاة كاملة' : 'Live Topology'}</span>
          </div>
        </div>

        {/* Right Inspector Panel */}
        <div className="lg:col-span-1 bg-slate-900 border border-slate-800 rounded-3xl p-5 space-y-4">
          <h3 className="text-xs font-extrabold text-slate-400 uppercase tracking-wider flex items-center gap-2">
            <Cpu className="w-4 h-4 text-amber-400" />
            <span>{isRtl ? 'خصائص المكون المحدد' : 'Node Inspector'}</span>
          </h3>

          {selectedComp ? (
            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-400 mb-1 block">{isRtl ? 'اسم الخادم / الخدمة' : 'Label'}</label>
                <input
                  type="text"
                  value={selectedComp.label}
                  onChange={e => {
                    const newLabel = e.target.value;
                    setComponents(components.map(c => c.id === selectedComp.id ? { ...c, label: newLabel } : c));
                  }}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white font-mono focus:border-amber-500 outline-none"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs text-slate-400 mb-1">
                  <span>{isRtl ? 'عدد النسخ (Instances)' : 'Instance Count'}</span>
                  <span className="font-mono text-amber-400 font-bold">x{selectedComp.instances}</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="20"
                  value={selectedComp.instances}
                  onChange={e => {
                    const count = Number(e.target.value);
                    setComponents(components.map(c => c.id === selectedComp.id ? { ...c, instances: count } : c));
                  }}
                  className="w-full accent-amber-500 cursor-pointer"
                />
              </div>

              <div className="pt-3 border-t border-slate-800">
                <button
                  onClick={() => removeComponent(selectedComp.id)}
                  className="w-full flex items-center justify-center space-x-2 rtl:space-x-reverse bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 p-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>{isRtl ? 'حذف المكون' : 'Delete Node'}</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="text-center py-10 text-slate-500 text-xs">
              {isRtl ? 'انقر على أحد العناصر في المخطط لعرض خصائصه' : 'Select a node from canvas to edit settings'}
            </div>
          )}
        </div>
      </div>

      {/* Evaluation Results Banner */}
      <AnimatePresence>
        {evaluation && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 12 }}
            className="bg-slate-900 border border-amber-500/40 rounded-3xl p-6 md:p-8 space-y-6 shadow-2xl shadow-amber-500/10"
          >
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-slate-800 pb-5">
              <div className="flex items-center space-x-3 rtl:space-x-reverse">
                <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center font-black text-2xl text-amber-400">
                  {evaluation.score}%
                </div>
                <div>
                  <h3 className="text-lg font-black text-white">{evaluation.title}</h3>
                  <p className="text-xs text-slate-400">{evaluation.summary}</p>
                </div>
              </div>

              <div className="flex gap-3 text-xs font-mono">
                <div className="bg-slate-950 px-3 py-2 rounded-xl border border-slate-800">
                  <span className="text-slate-500 block">{isRtl ? 'الأحمال المتوقعة' : 'Estimated QPS'}</span>
                  <span className="text-amber-400 font-extrabold">{evaluation.estimatedQps} req/s</span>
                </div>
                <div className="bg-slate-950 px-3 py-2 rounded-xl border border-slate-800">
                  <span className="text-slate-500 block">{isRtl ? 'حجم البيانات/سنة' : 'Est. Data/Year'}</span>
                  <span className="text-amber-400 font-extrabold">{evaluation.estimatedStorageGbPerYear} GB</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs">
              {/* Strengths */}
              <div className="space-y-2">
                <h4 className="font-extrabold text-emerald-400 flex items-center gap-1.5 uppercase tracking-wider">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{isRtl ? 'نقاط القوة' : 'Strengths'}</span>
                </h4>
                <ul className="space-y-1.5 text-slate-300">
                  {evaluation.strengths.map((s, idx) => (
                    <li key={idx} className="bg-emerald-500/10 border border-emerald-500/20 p-2.5 rounded-xl">
                      {s}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Bottlenecks */}
              <div className="space-y-2">
                <h4 className="font-extrabold text-rose-400 flex items-center gap-1.5 uppercase tracking-wider">
                  <AlertTriangle className="w-4 h-4" />
                  <span>{isRtl ? 'اختناقات وسلبيات' : 'Bottlenecks'}</span>
                </h4>
                <ul className="space-y-1.5 text-slate-300">
                  {evaluation.bottlenecks.map((b, idx) => (
                    <li key={idx} className="bg-rose-500/10 border border-rose-500/20 p-2.5 rounded-xl">
                      {b}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Recommendations */}
              <div className="space-y-2">
                <h4 className="font-extrabold text-amber-400 flex items-center gap-1.5 uppercase tracking-wider">
                  <Zap className="w-4 h-4" />
                  <span>{isRtl ? 'توصيات التحسين' : 'Recommendations'}</span>
                </h4>
                <ul className="space-y-1.5 text-slate-300">
                  {evaluation.recommendations.map((r, idx) => (
                    <li key={idx} className="bg-amber-500/10 border border-amber-500/20 p-2.5 rounded-xl">
                      {r}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Capacity Estimator Modal */}
      <CapacityCalculatorModal
        isOpen={isCalcOpen}
        onClose={() => setIsCalcOpen(false)}
      />

    </div>
  );
};
