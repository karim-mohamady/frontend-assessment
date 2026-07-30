/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Box, 
  Terminal, 
  Layers, 
  Cpu, 
  Server, 
  ShieldCheck, 
  Code, 
  Copy, 
  Check, 
  Zap, 
  Activity, 
  Network,
  RefreshCw,
  HardDrive
} from 'lucide-react';

interface ContainerService {
  id: string;
  name: string;
  image: string;
  port: number;
  envVars: { key: string; val: string }[];
  replicas: number;
}

export const DevOpsStudio: React.FC = () => {
  const { lang } = useApp();
  const isAr = lang === 'ar';

  const [services, setServices] = useState<ContainerService[]>([
    {
      id: 'srv-1',
      name: 'api-gateway',
      image: 'nginx:alpine',
      port: 8080,
      envVars: [{ key: 'UPSTREAM_URL', val: 'http://backend-service:3000' }],
      replicas: 2
    },
    {
      id: 'srv-2',
      name: 'backend-service',
      image: 'node:20-alpine',
      port: 3000,
      envVars: [
        { key: 'NODE_ENV', val: 'production' },
        { key: 'DATABASE_URL', val: 'postgres://db:5432/app' }
      ],
      replicas: 3
    },
    {
      id: 'srv-3',
      name: 'redis-cache',
      image: 'redis:7-alpine',
      port: 6379,
      envVars: [{ key: 'MAXMEMORY', val: '256mb' }],
      replicas: 1
    }
  ]);

  const [activeTab, setActiveTab] = useState<'docker-compose' | 'k8s-manifest' | 'dockerfile'>('docker-compose');
  const [copied, setCopied] = useState(false);

  // Generates Docker Compose YAML
  const generateDockerCompose = () => {
    let yaml = `version: '3.8'\n\nservices:\n`;
    services.forEach(s => {
      yaml += `  ${s.name}:\n`;
      yaml += `    image: ${s.image}\n`;
      yaml += `    ports:\n      - "${s.port}:${s.port}"\n`;
      if (s.envVars.length > 0) {
        yaml += `    environment:\n`;
        s.envVars.forEach(e => {
          yaml += `      - ${e.key}=${e.val}\n`;
        });
      }
      yaml += `    restart: always\n\n`;
    });
    return yaml;
  };

  // Generates Kubernetes Manifest
  const generateK8sManifest = () => {
    return services.map(s => `apiVersion: apps/v1
kind: Deployment
metadata:
  name: ${s.name}-deployment
spec:
  replicas: ${s.replicas}
  selector:
    matchLabels:
      app: ${s.name}
  template:
    metadata:
      labels:
        app: ${s.name}
    spec:
      containers:
      - name: ${s.name}
        image: ${s.image}
        ports:
        - containerPort: ${s.port}
---
apiVersion: v1
kind: Service
metadata:
  name: ${s.name}-svc
spec:
  type: ClusterIP
  ports:
  - port: ${s.port}
    targetPort: ${s.port}
  selector:
    app: ${s.name}`).join('\n---\n');
  };

  // Generates Dockerfile
  const generateDockerfile = () => {
    return `# Multi-stage Production Dockerfile
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build

FROM nginx:alpine AS runner
COPY --from=builder /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]`;
  };

  const getActiveCode = () => {
    if (activeTab === 'docker-compose') return generateDockerCompose();
    if (activeTab === 'k8s-manifest') return generateK8sManifest();
    return generateDockerfile();
  };

  const copyCode = () => {
    navigator.clipboard.writeText(getActiveCode());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-10 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Hero Section */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-sky-950/20 to-slate-950 p-6 md:p-10 border border-sky-500/30 shadow-2xl shadow-sky-500/5">
          <div className="relative flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="space-y-3">
              <div className="flex items-center space-x-3 rtl:space-x-reverse">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-sky-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-sky-500/20">
                  <Box className="w-7 h-7 text-slate-950" strokeWidth={2.5} />
                </div>
                <div>
                  <span className="text-xs font-black text-sky-400 uppercase tracking-widest block">
                    {isAr ? 'معمل الحوسبة السحابية وأتمتة DevOps & Kubernetes' : 'DevOps & Cloud Architecture Studio'}
                  </span>
                  <h1 className="text-2xl md:text-3xl font-black text-white tracking-tight">
                    {isAr ? 'تصميم الحاويات والشبكات واستخراج ملفات Docker & K8s' : 'Interactive Microservices, Docker & Kubernetes Lab'}
                  </h1>
                </div>
              </div>
              <p className="text-xs md:text-sm text-slate-400 max-w-2xl leading-relaxed">
                {isAr 
                  ? 'صمم بنية الخدمات المصغرة (Microservices Architecture)، اضبط متطلبات Docker Compose و Kubernetes Deployments، وشاهد خريطة التوزيع التفاعلية واستخرج ملفات YAML الجاهزة للإنتاج.'
                  : 'Architect multi-container Docker services, configure Kubernetes replicas, visualize cluster topologies, and generate ready-to-deploy YAML manifests.'}
              </p>
            </div>

            <div className="flex items-center space-x-2 rtl:space-x-reverse bg-slate-900/80 p-2 rounded-2xl border border-slate-800">
              {(['docker-compose', 'k8s-manifest', 'dockerfile'] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-3 py-2 rounded-xl text-xs font-mono font-bold transition-all ${
                    activeTab === tab 
                      ? 'bg-sky-500 text-slate-950 shadow-md shadow-sky-500/20' 
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Main Workbench */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Services Configuration (7 Cols) */}
          <div className="lg:col-span-7 space-y-6">
            <div className="bg-slate-900/90 p-6 rounded-2xl border border-slate-800 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2.5 rtl:space-x-reverse">
                  <Server className="w-5 h-5 text-sky-400" />
                  <h2 className="font-extrabold text-sm text-white">
                    {isAr ? 'الخدمات والحاويات النشطة (Cluster Pods)' : 'Cluster Microservices & Containers'}
                  </h2>
                </div>
                <span className="text-xs font-mono font-bold text-sky-400 bg-sky-500/10 px-2.5 py-1 rounded-lg border border-sky-500/30">
                  {services.length} {isAr ? 'خدمات معرّفة' : 'Services Defined'}
                </span>
              </div>

              <div className="space-y-3">
                {services.map((s, idx) => (
                  <div key={s.id} className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3 rtl:space-x-reverse">
                        <div className="w-8 h-8 rounded-lg bg-sky-500/20 text-sky-400 flex items-center justify-center font-bold text-xs font-mono">
                          #{idx + 1}
                        </div>
                        <div>
                          <span className="font-bold text-sm text-white font-mono block">{s.name}</span>
                          <span className="text-[10px] text-slate-400 font-mono">Image: {s.image}</span>
                        </div>
                      </div>

                      <div className="flex items-center space-x-3 rtl:space-x-reverse text-xs font-mono">
                        <div className="bg-slate-900 px-2.5 py-1 rounded-md border border-slate-800 text-slate-300">
                          Port: <span className="text-sky-400 font-bold">{s.port}</span>
                        </div>
                        <div className="bg-slate-900 px-2.5 py-1 rounded-md border border-slate-800 text-slate-300">
                          Replicas: <span className="text-emerald-400 font-bold">{s.replicas}</span>
                        </div>
                      </div>
                    </div>

                    {/* Environment variables list */}
                    <div className="bg-slate-900/60 p-2.5 rounded-lg border border-slate-800/80 space-y-1">
                      <span className="text-[10px] font-mono text-slate-500 font-bold block">ENV VARIABLES:</span>
                      {s.envVars.map((env, eIdx) => (
                        <div key={eIdx} className="text-[10px] font-mono text-sky-300 flex justify-between">
                          <span>{env.key}</span>
                          <span className="text-slate-400">{env.val}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Code Manifest Export (5 Cols) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-slate-900/90 rounded-2xl border border-slate-800 overflow-hidden shadow-2xl flex flex-col h-[520px]">
              <div className="bg-slate-950 px-5 py-3.5 border-b border-slate-800 flex items-center justify-between">
                <div className="flex items-center space-x-2 rtl:space-x-reverse">
                  <Code className="w-4 h-4 text-sky-400" />
                  <span className="text-xs font-mono font-bold text-slate-200">
                    {activeTab.toUpperCase()}
                  </span>
                </div>

                <button
                  onClick={copyCode}
                  className="flex items-center space-x-1.5 rtl:space-x-reverse text-[11px] font-bold text-slate-400 hover:text-white bg-slate-800 px-3 py-1 rounded-lg border border-slate-700 transition-colors"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? (isAr ? 'تم النسخ' : 'Copied') : (isAr ? 'نسخ' : 'Copy')}</span>
                </button>
              </div>

              <div className="p-4 bg-slate-950 font-mono text-xs text-sky-300 overflow-y-auto flex-1 leading-relaxed">
                <pre>{getActiveCode()}</pre>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
