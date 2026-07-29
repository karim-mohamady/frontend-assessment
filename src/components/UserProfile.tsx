/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { getQuestionsByCategory } from '../data/questions';
import { BADGES } from '../data/badges';
import { 
  Camera, Video, RefreshCw, Edit2, User, Award, Trophy, ShieldCheck, 
  AlertCircle, Upload, Image, Trash2, CheckCircle, ChevronRight, X, Lock, Unlock 
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const UserProfile: React.FC = () => {
  const { t, lang, isRtl, progress, setUserName, setUserAvatar } = useApp();
  const navigate = useNavigate();

  const [isEditingName, setIsEditingName] = useState(false);
  const [tempName, setTempName] = useState(progress.userName);
  const [showWebcam, setShowWebcam] = useState(false);
  const [isInitializingCam, setIsInitializingCam] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Synchronize local input state with context userName
  useEffect(() => {
    setTempName(progress.userName);
  }, [progress.userName]);

  // Clean up camera stream on unmount
  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  const handleSaveName = () => {
    const trimmed = tempName.trim();
    if (trimmed) {
      setUserName(trimmed);
      setIsEditingName(false);
    }
  };

  const startWebcam = async () => {
    setCameraError(null);
    setIsInitializingCam(true);
    setShowWebcam(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: 300, height: 300, facingMode: 'user' }
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
    } catch (err: any) {
      console.error('Camera access failed:', err);
      setCameraError(
        err.name === 'NotAllowedError'
          ? (isRtl ? 'تم رفض إذن الوصول للكاميرا. يرجى تفعيل الصلاحيات.' : 'Camera permission denied. Please grant frame permissions.')
          : (isRtl ? 'فشل تشغيل الكاميرا. تحقق من توصيلها بالجهاز.' : 'Could not access camera. Please check your connections.')
      );
      setShowWebcam(false);
    } finally {
      setIsInitializingCam(false);
    }
  };

  const stopWebcam = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setShowWebcam(false);
    setCameraError(null);
  };

  const capturePhoto = () => {
    if (videoRef.current) {
      try {
        const canvas = document.createElement('canvas');
        canvas.width = 180;
        canvas.height = 180;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          const videoWidth = videoRef.current.videoWidth || 300;
          const videoHeight = videoRef.current.videoHeight || 300;
          const minSize = Math.min(videoWidth, videoHeight);
          const sx = (videoWidth - minSize) / 2;
          const sy = (videoHeight - minSize) / 2;

          ctx.drawImage(
            videoRef.current,
            sx, sy, minSize, minSize, // source crop
            0, 0, 180, 180            // destination size
          );

          const base64Jpg = canvas.toDataURL('image/jpeg', 0.85);
          setUserAvatar(base64Jpg);
          stopWebcam();
        }
      } catch (err) {
        console.error('Snapshot capture failed:', err);
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processImageFile(file);
    }
  };

  const processImageFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert(isRtl ? 'يرجى تحميل ملف صورة صالح.' : 'Please select a valid image file.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = 180;
        canvas.height = 180;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          const minSize = Math.min(img.width, img.height);
          const sx = (img.width - minSize) / 2;
          const sy = (img.height - minSize) / 2;

          ctx.drawImage(
            img,
            sx, sy, minSize, minSize,
            0, 0, 180, 180
          );

          const base64Jpg = canvas.toDataURL('image/jpeg', 0.85);
          setUserAvatar(base64Jpg);
        }
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      processImageFile(file);
    }
  };

  const deleteAvatar = () => {
    setUserAvatar('');
  };

  // Certifications list with their local names
  const categoriesList = [
    { id: 'html', key: 'catHtml', nameEn: 'HTML5 & Semantics', nameAr: 'HTML5 والهياكل الدلالية', nameEs: 'HTML5 y Semántica', color: 'border-orange-500/20 text-orange-400 bg-orange-500/5 hover:border-orange-500/40' },
    { id: 'css', key: 'catCss', nameEn: 'CSS3, Grid & Flexbox', nameAr: 'CSS3 والشبكات والتجاوب', nameEs: 'CSS3, Grid y Flexbox', color: 'border-blue-500/20 text-blue-400 bg-blue-500/5 hover:border-blue-500/40' },
    { id: 'javascript', key: 'catJs', nameEn: 'JavaScript & Async ES6+', nameAr: 'جافا سكريبت والمزامنة وES6+', nameEs: 'JavaScript y ES6+ Asíncrono', color: 'border-amber-500/20 text-amber-400 bg-amber-500/5 hover:border-amber-500/40' },
    { id: 'react', key: 'catReact', nameEn: 'React, Hooks & Architecture', nameAr: 'ريأكت والخطافات والبنية البرمجية', nameEs: 'React, Hooks y Arquitectura', color: 'border-sky-500/20 text-sky-400 bg-sky-500/5 hover:border-sky-500/40' },
    { id: 'bootstrap', key: 'catBs', nameEn: 'Bootstrap 5 & Layouts', nameAr: 'بوتستراب 5 والتخطيطات', nameEs: 'Bootstrap 5 y Diseños', color: 'border-purple-500/20 text-purple-400 bg-purple-500/5 hover:border-purple-500/40' },
    { id: 'english', key: 'catEng', nameEn: 'Technical English for Devs', nameAr: 'اللغة الإنجليزية للمطورين', nameEs: 'Inglés Técnico para Desarrolladores', color: 'border-emerald-500/20 text-emerald-400 bg-emerald-500/5 hover:border-emerald-500/40' }
  ] as const;

  // Process cert summaries based on passed (>70%) assessment history
  const certifications = categoriesList.map((cat) => {
    const completedList = progress.completedAssessments || [];
    const catAttempts = completedList.filter((a) => a.category === cat.id);
    
    if (catAttempts.length === 0) {
      return { ...cat, earned: false, score: 0, date: '', attempt: null };
    }

    // Identify the maximum score attempt
    const sorted = [...catAttempts].sort((a, b) => b.percentage - a.percentage);
    const bestAttempt = sorted[0];
    const earned = bestAttempt.percentage >= 70;

    return {
      ...cat,
      earned,
      score: bestAttempt.percentage,
      date: bestAttempt.date,
      attempt: bestAttempt
    };
  });

  const totalCertificatesCount = certifications.filter((c) => c.earned).length;

  const handleViewCertificate = (attempt: any) => {
    if (!attempt) return;
    const categoryQuestions = getQuestionsByCategory(attempt.category, 10);
    navigate('/report', {
      state: {
        result: attempt,
        questions: categoryQuestions
      }
    });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8" id="profile-section-block">
      
      {/* COLUMN 1: Avatar webcam capture & Upload panel */}
      <div className="lg:col-span-1 bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 flex flex-col items-center justify-between text-center space-y-6 shadow-xl relative overflow-hidden" id="profile-avatar-card">
        
        {/* Glow detail */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-48 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="space-y-4 w-full flex flex-col items-center">
          <h3 className="text-sm font-extrabold uppercase tracking-widest text-slate-400 font-mono">
            {isRtl ? 'الصورة الشخصية للمرشح' : 'Candidate Digital Avatar'}
          </h3>

          {/* Avatar View Container */}
          <div className="relative w-40 h-40 rounded-full border-4 border-slate-800 overflow-hidden shadow-2xl flex items-center justify-center bg-slate-950 group">
            
            <AnimatePresence mode="wait">
              {showWebcam ? (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 w-full h-full"
                >
                  <video 
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    className="w-full h-full object-cover scale-x-[-1]"
                  />
                  {isInitializingCam && (
                    <div className="absolute inset-0 bg-slate-950/80 flex items-center justify-center text-xs text-slate-400 font-mono">
                      <RefreshCw className="w-5 h-5 animate-spin text-amber-500 mr-2" />
                      <span>{isRtl ? 'جاري التشغيل...' : 'Initializing...'}</span>
                    </div>
                  )}
                </motion.div>
              ) : progress.customAvatar ? (
                <motion.img 
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  src={progress.customAvatar}
                  alt="Candidate avatar"
                  className="w-full h-full object-cover"
                />
              ) : (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-slate-700 flex flex-col items-center"
                >
                  <User className="w-16 h-16 stroke-[1.5]" />
                </motion.div>
              )}
            </AnimatePresence>

            {/* Drag and Drop Hover overlay */}
            {isDragOver && (
              <div className="absolute inset-0 bg-amber-500/20 backdrop-blur-sm flex items-center justify-center border-4 border-dashed border-amber-500 rounded-full animate-pulse">
                <Upload className="w-8 h-8 text-amber-500" />
              </div>
            )}
          </div>

          {/* Error notice if webcam fails */}
          {cameraError && (
            <div className="text-xs text-red-400 flex items-center gap-1.5 justify-center bg-red-500/10 border border-red-500/20 px-3 py-1.5 rounded-xl max-w-xs">
              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
              <span className="leading-snug">{cameraError}</span>
            </div>
          )}

          {/* Drag & Drop trigger text */}
          {!showWebcam && (
            <p className="text-[11px] text-slate-500 max-w-xs leading-relaxed">
              {isRtl 
                ? 'اسحب وأسقط صورتك هنا، أو التقط صورة مباشرة بالويبكام'
                : 'Drag & drop image here, or snap a direct selfie using your webcam'
              }
            </p>
          )}
        </div>

        {/* Buttons / Interactions area */}
        <div className="w-full space-y-3 pt-4">
          <div className="flex flex-col sm:flex-row gap-2 justify-center">
            
            {showWebcam ? (
              <>
                <motion.button
                  whileTap={{ scale: 0.98 }}
                  onClick={capturePhoto}
                  disabled={isInitializingCam}
                  className="flex-1 bg-amber-500 hover:bg-amber-600 disabled:opacity-50 text-slate-950 text-xs font-black py-2.5 px-4 rounded-xl flex items-center justify-center gap-1.5 shadow-md shadow-amber-500/10 transition-colors"
                >
                  <Camera className="w-4 h-4" />
                  <span>{isRtl ? 'التقاط الصورة' : 'Take Snapshot'}</span>
                </motion.button>
                <button
                  onClick={stopWebcam}
                  className="bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold py-2.5 px-4 rounded-xl transition-colors"
                >
                  {isRtl ? 'إلغاء' : 'Cancel'}
                </button>
              </>
            ) : (
              <>
                {/* Webcam capture trigger */}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={startWebcam}
                  className="flex-1 bg-slate-950 border border-slate-800 hover:border-slate-700 text-amber-500 text-xs font-extrabold py-2.5 px-4 rounded-xl flex items-center justify-center gap-1.5 transition-all shadow"
                >
                  <Video className="w-4 h-4" />
                  <span>{isRtl ? 'تشغيل الكاميرا' : 'Use Webcam'}</span>
                </motion.button>

                {/* Local file uploader overlay */}
                <label className="flex-1 bg-slate-950 border border-slate-800 hover:border-slate-700 text-slate-300 text-xs font-bold py-2.5 px-4 rounded-xl flex items-center justify-center gap-1.5 cursor-pointer transition-all shadow">
                  <Upload className="w-4 h-4" />
                  <span>{isRtl ? 'تحميل صورة' : 'Upload File'}</span>
                  <input 
                    type="file" 
                    accept="image/*" 
                    onChange={handleFileChange}
                    className="hidden" 
                  />
                </label>
              </>
            )}
          </div>

          {progress.customAvatar && !showWebcam && (
            <button
              onClick={deleteAvatar}
              className="text-[11px] font-bold text-rose-400 hover:text-rose-300 transition-colors flex items-center gap-1 justify-center mx-auto"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>{isRtl ? 'إزالة الصورة الحالية' : 'Delete photo'}</span>
            </button>
          )}

          {/* Invisible drag container backing */}
          {!showWebcam && (
            <div 
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className="absolute inset-0 w-full h-full opacity-0 z-0 pointer-events-none"
            />
          )}
        </div>
      </div>

      {/* COLUMN 2 & 3: Name configuration and Certifications view summary */}
      <div className="lg:col-span-2 space-y-6 flex flex-col justify-between" id="profile-credentials-details">
        
        {/* Name Config Block */}
        <section className="bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 space-y-4 shadow-xl">
          <h3 className="text-sm font-extrabold uppercase tracking-widest text-slate-400 font-mono">
            {isRtl ? 'معلومات الهوية المهنية' : 'Professional Identity'}
          </h3>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <p className="text-xs text-slate-500">{isRtl ? 'اسم المرشح المعتمد للشهادات' : 'Candidate Name on Certifications'}</p>
              
              <AnimatePresence mode="wait">
                {isEditingName ? (
                  <motion.div 
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                    className="flex items-center gap-2 max-w-md pt-1"
                  >
                    <input
                      type="text"
                      value={tempName}
                      onChange={(e) => setTempName(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleSaveName()}
                      className="bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-amber-500/80 w-full font-sans"
                      maxLength={40}
                      autoFocus
                    />
                    <button
                      onClick={handleSaveName}
                      className="bg-amber-500 hover:bg-amber-600 text-slate-950 p-2 rounded-xl text-xs font-black transition-colors shrink-0"
                      title="Save name"
                    >
                      <CheckCircle className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => {
                        setTempName(progress.userName);
                        setIsEditingName(false);
                      }}
                      className="bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white p-2 rounded-xl text-xs transition-colors shrink-0"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </motion.div>
                ) : (
                  <motion.div 
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center gap-3"
                  >
                    <h2 className="text-2xl font-black text-white leading-none font-sans">
                      {progress.userName}
                    </h2>
                    <button
                      onClick={() => setIsEditingName(true)}
                      className="p-1.5 text-slate-500 hover:text-amber-500 transition-colors bg-slate-950/40 border border-slate-800/80 hover:border-amber-500/20 rounded-lg"
                      title="Edit username"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="p-4 bg-slate-950/40 border border-slate-800/60 rounded-2xl flex items-center gap-3 sm:max-w-xs shrink-0">
              <Trophy className="w-8 h-8 text-amber-500 shrink-0" />
              <div className="space-y-0.5">
                <p className="text-[10px] text-slate-500 font-mono uppercase tracking-wider">
                  {lang === 'ar' ? 'إجمالي الشهادات المكتسبة' : (lang === 'es' ? 'Certificaciones Obtenidas' : 'Certifications Earned')}
                </p>
                <p className="text-lg font-black text-white font-mono leading-none">
                  {totalCertificatesCount} / {categoriesList.length}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Certifications Grid Summary */}
        <section className="bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 space-y-4 shadow-xl flex-1 flex flex-col justify-between">
          <div className="space-y-1">
            <h3 className="text-sm font-extrabold uppercase tracking-widest text-slate-400 font-mono">
              {lang === 'ar' ? 'الملخص التفصيلي للاعتمادات' : (lang === 'es' ? 'Resumen de Credenciales' : 'Credentials & Certification Summary')}
            </h3>
            <p className="text-xs text-slate-500">
              {lang === 'ar' 
                ? 'اجتز أي اختبار بنسبة 70% أو أكثر لتصبح معتمداً مهنياً.' 
                : lang === 'es'
                ? 'Aprobar cualquier evaluación con un 70% o más desbloquea una certificación profesional verificada.'
                : 'Scoring 70% or higher on any core framework assessment unlocks a verified professional badge.'
              }
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            {certifications.map((cert) => (
              <div 
                key={cert.id}
                className={`p-3.5 border rounded-2xl flex items-center justify-between transition-all relative group overflow-hidden ${
                  cert.earned 
                    ? 'border-emerald-500/25 bg-emerald-500/5 hover:border-emerald-500/45' 
                    : 'border-slate-800 bg-slate-950/30'
                }`}
              >
                {/* Background glowing medal effect on earned certifications */}
                {cert.earned && (
                  <div className="absolute -right-3 -bottom-3 w-12 h-12 opacity-[0.03] text-emerald-500 font-bold group-hover:scale-125 transition-transform">
                    <ShieldCheck className="w-full h-full" />
                  </div>
                )}

                <div className="flex items-center gap-3 z-10">
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center text-xs font-bold shrink-0 ${
                    cert.earned 
                      ? 'bg-emerald-500/10 text-emerald-400' 
                      : 'bg-slate-900 text-slate-600'
                  }`}>
                    {cert.earned ? <Award className="w-4 h-4" /> : <ShieldCheck className="w-4 h-4 opacity-30" />}
                  </div>

                  <div className="space-y-0.5">
                    <h4 className="text-xs font-black text-slate-200 truncate max-w-[130px] sm:max-w-[160px]">
                      {lang === 'ar' ? cert.nameAr : (lang === 'es' ? cert.nameEs : cert.nameEn)}
                    </h4>
                    <p className="text-[10px] font-mono leading-none">
                      {cert.earned ? (
                        <span className="text-emerald-400 font-extrabold">
                          {lang === 'ar' ? 'معتمد' : (lang === 'es' ? 'Certificado' : 'Certified')} • {Math.round(cert.score)}%
                        </span>
                      ) : (
                        <span className="text-slate-500">{lang === 'ar' ? 'غير مكتمل' : (lang === 'es' ? 'Incompleto' : 'Incomplete')}</span>
                      )}
                    </p>
                  </div>
                </div>

                {cert.earned ? (
                  <motion.button
                    whileHover={{ x: isRtl ? -3 : 3 }}
                    onClick={() => handleViewCertificate(cert.attempt)}
                    className="p-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/25 text-emerald-400 hover:text-white transition-colors shrink-0 z-10"
                    title={lang === 'ar' ? 'عرض الشهادة المعتمدة' : (lang === 'es' ? 'Ver Certificado Verificado' : 'View Verified Certificate')}
                  >
                    <ChevronRight className="w-4 h-4 rtl:rotate-180" />
                  </motion.button>
                ) : (
                  <span className="text-[9px] font-mono font-bold text-slate-600 px-2 py-0.5 rounded-md bg-slate-900 border border-slate-800/40 z-10">
                    &gt; 70%
                  </span>
                )}
              </div>
            ))}
          </div>

          {totalCertificatesCount === 0 && (
            <p className="text-center text-xs text-slate-500 italic py-4">
              {lang === 'ar' 
                ? 'لم تكتسب أي اعتمادات معتمدة بعد. ابدأ أول تقييم لك الآن!'
                : lang === 'es'
                ? 'Aún no has obtenido certificados verificados. ¡Completa una evaluación para obtener tu primera certificación!'
                : 'No verified certificates earned yet. Navigate to Assessments to earn your first certification!'
              }
            </p>
          )}
        </section>

        {/* Unlocked Skill Badges Section */}
        <section className="bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 space-y-4 shadow-xl" id="profile-badges-module">
          <div className="space-y-1">
            <h3 className="text-sm font-extrabold uppercase tracking-widest text-slate-400 font-mono flex items-center gap-2">
              <Trophy className="w-4 h-4 text-amber-500 animate-pulse" />
              <span>
                {lang === 'ar' ? 'الأوسمة الشرفية للمطور' : lang === 'es' ? 'Insignias de Habilidad Desbloqueadas' : 'Unlocked Developer Skill Badges'}
              </span>
            </h3>
            <p className="text-xs text-slate-500">
              {lang === 'ar' 
                ? 'احصل على درجة 85% أو أكثر في أي فئة تقييم للحصول على وسام شرفي يعكس خبرتك.' 
                : lang === 'es'
                ? 'Obtén un 85% o más en cualquier evaluación para desbloquear y reclamar automáticamente tu insignia profesional.'
                : 'Score 85% or higher on any core framework assessment to automatically unlock and claim its professional badge.'}
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-2">
            {BADGES.map((badge) => {
              const isUnlocked = progress.achievements.includes(badge.id);
              
              // Get high score for category
              const catAttempts = progress.completedAssessments.filter((a) => a.category === badge.category);
              const bestScore = catAttempts.length > 0 
                ? Math.max(...catAttempts.map((a) => a.percentage)) 
                : 0;

              return (
                <div 
                  key={badge.id}
                  className={`p-4 rounded-2xl border transition-all relative overflow-hidden flex flex-col items-center text-center justify-between space-y-3 ${
                    isUnlocked 
                      ? 'bg-slate-950/95 border-amber-500/20 shadow-lg shadow-amber-500/5 hover:border-amber-500/40' 
                      : 'bg-slate-950/25 border-slate-800/60 opacity-65'
                  }`}
                  title={`${lang === 'ar' ? badge.titleAr : (lang === 'it' ? (badge.titleIt || badge.titleEn) : badge.titleEn)}: ${lang === 'ar' ? badge.descAr : (lang === 'it' ? (badge.descIt || badge.descEn) : badge.descEn)}`}
                >
                  {/* Glowing background gradient for unlocked badges */}
                  {isUnlocked && (
                    <div className="absolute inset-0 bg-gradient-to-b from-amber-500/5 to-transparent pointer-events-none" />
                  )}

                  {/* Icon and status badge */}
                  <div className="relative">
                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-3xl shadow-inner ${
                      isUnlocked 
                        ? 'bg-amber-500/10 scale-105 transition-transform duration-300' 
                        : 'bg-slate-900/60 scale-95'
                    }`}>
                      {badge.icon}
                    </div>
                    {/* Lock/Unlock mini indicator */}
                    <div className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center border ${
                      isUnlocked 
                        ? 'bg-emerald-500 border-emerald-400 text-slate-950' 
                        : 'bg-slate-900 border-slate-800 text-slate-500'
                    }`}>
                      {isUnlocked ? (
                        <Unlock className="w-2.5 h-2.5 stroke-[3]" />
                      ) : (
                        <Lock className="w-2.5 h-2.5 stroke-[2.5]" />
                      )}
                    </div>
                  </div>

                  {/* Badge Text */}
                  <div className="space-y-1">
                    <h4 className={`text-xs font-black truncate max-w-[120px] ${
                      isUnlocked ? 'text-amber-500' : 'text-slate-400'
                    }`}>
                      {lang === 'ar' ? badge.titleAr : (lang === 'it' ? (badge.titleIt || badge.titleEn) : badge.titleEn)}
                    </h4>
                    <p className="text-[10px] text-slate-500 font-mono">
                      {isUnlocked ? (
                        <span className="text-emerald-400 font-bold">
                          {lang === 'ar' ? `درجة: ${Math.round(bestScore)}%` : lang === 'it' ? `Punteggio: ${Math.round(bestScore)}%` : `Score: ${Math.round(bestScore)}%`}
                        </span>
                      ) : (
                        <span>
                          {lang === 'ar' ? `المطلوب: >= ${badge.threshold}%` : lang === 'it' ? `Req: >= ${badge.threshold}%` : `Req: >= ${badge.threshold}%`}
                        </span>
                      )}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </div>

    </div>
  );
};
