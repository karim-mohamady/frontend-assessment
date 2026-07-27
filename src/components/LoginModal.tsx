/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { X, Mail, User, Shield, AlertCircle, Sparkles, CheckCircle, Lock, Eye, EyeOff } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { isFirebaseConfigured } from '../lib/firebase';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose }) => {
  const { lang, t, loginWithGoogle, loginWithEmail, registerWithEmail } = useApp();
  
  // Tab/Screen states
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin');
  
  // Fields state
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  // Visual helper states
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const hasFirebase = isFirebaseConfigured();

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError(null);
    try {
      await loginWithGoogle();
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        onClose();
      }, 1500);
    } catch (err: any) {
      setError(err?.message || 'Failed to sign in with Google');
    } finally {
      setLoading(false);
    }
  };

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validation
    if (!email.trim() || !password) {
      setError(lang === 'ar' ? 'يرجى ملء جميع الحقول المطلوبة' : (lang === 'es' ? 'Por favor complete todos los campos requeridos' : 'Please fill out all required fields'));
      return;
    }

    if (password.length < 6) {
      setError(lang === 'ar' ? 'يجب أن تكون كلمة المرور 6 أحرف على الأقل' : (lang === 'es' ? 'La contraseña debe tener al menos 6 caracteres' : 'Password must be at least 6 characters'));
      return;
    }

    setLoading(true);

    try {
      if (authMode === 'signup') {
        if (!name.trim()) {
          setError(lang === 'ar' ? 'يرجى إدخال اسم المطور' : (lang === 'es' ? 'Por favor ingrese el nombre del desarrollador' : 'Please enter Developer Name'));
          setLoading(false);
          return;
        }
        if (password !== confirmPassword) {
          setError(lang === 'ar' ? 'كلمات المرور غير متطابقة' : (lang === 'es' ? 'Las contraseñas no coinciden' : 'Passwords do not match'));
          setLoading(false);
          return;
        }
        await registerWithEmail(email, password, name);
      } else {
        await loginWithEmail(email, password);
      }

      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        onClose();
        // Reset states
        setEmail('');
        setName('');
        setPassword('');
        setConfirmPassword('');
      }, 1500);

    } catch (err: any) {
      let friendlyError = err?.message || 'Authentication failed';
      // Firebase standard errors translation
      if (err?.code === 'auth/wrong-password' || friendlyError.includes('wrong-password') || friendlyError.includes('Incorrect password')) {
        friendlyError = lang === 'ar' ? 'كلمة المرور غير صحيحة' : (lang === 'es' ? 'Contraseña incorrecta' : 'Incorrect password');
      } else if (err?.code === 'auth/user-not-found' || friendlyError.includes('user-not-found') || friendlyError.includes('No account found')) {
        friendlyError = lang === 'ar' ? 'لم يتم العثور على حساب بهذا البريد الإلكتروني' : (lang === 'es' ? 'No se encontró ninguna cuenta con este correo' : 'No account found with this email');
      } else if (err?.code === 'auth/email-already-in-use' || friendlyError.includes('email-already-in-use')) {
        friendlyError = lang === 'ar' ? 'هذا البريد الإلكتروني مستخدم بالفعل' : (lang === 'es' ? 'Este correo electrónico ya está en uso' : 'This email is already in use');
      } else if (err?.code === 'auth/invalid-email' || friendlyError.includes('invalid-email')) {
        friendlyError = lang === 'ar' ? 'صيغة البريد الإلكتروني غير صحيحة' : (lang === 'es' ? 'Formato de correo electrónico inválido' : 'Invalid email address format');
      }
      setError(friendlyError);
    } finally {
      setLoading(false);
    }
  };

  const toggleMode = () => {
    setError(null);
    setAuthMode(authMode === 'signin' ? 'signup' : 'signin');
  };

  if (!isOpen) return null;

  const labels = {
    signinTitle: lang === 'ar' ? 'تسجيل الدخول' : (lang === 'es' ? 'Iniciar Sesión' : 'Sign In'),
    signupTitle: lang === 'ar' ? 'إنشاء حساب جديد' : (lang === 'es' ? 'Crear Cuenta' : 'Create Account'),
    signinDesc: lang === 'ar' ? 'مرحباً بك مجدداً! ادخل بياناتك لمتابعة تحدياتك.' : (lang === 'es' ? '¡Bienvenido de nuevo! Ingresa tus datos para acceder a tus desafíos.' : 'Welcome back! Enter your details to access your dashboard.'),
    signupDesc: lang === 'ar' ? 'انضم إلى نخبة مطوري الويب ووثّق مهاراتك البرمجية.' : (lang === 'es' ? 'Únete a los mejores desarrolladores web y certifica tus habilidades.' : 'Join elite web developers and certify your coding skills.'),
    nameLabel: lang === 'ar' ? 'اسم المطور' : (lang === 'es' ? 'Nombre del Desarrollador' : 'Developer Name'),
    emailLabel: lang === 'ar' ? 'البريد الإلكتروني' : (lang === 'es' ? 'Correo Electrónico' : 'Email Address'),
    passLabel: lang === 'ar' ? 'كلمة المرور' : (lang === 'es' ? 'Contraseña' : 'Password'),
    confirmPassLabel: lang === 'ar' ? 'تأكيد كلمة المرور' : (lang === 'es' ? 'Confirmar Contraseña' : 'Confirm Password'),
    googleBtn: lang === 'ar' ? 'متابعة باستخدام Google' : (lang === 'es' ? 'Continuar con Google' : 'Continue with Google'),
    noAccountLink: lang === 'ar' ? 'ليس لديك حساب؟ سجل كعضو جديد' : (lang === 'es' ? '¿No tienes una cuenta? Regístrate aquí' : "Don't have an account? Sign up here"),
    haveAccountLink: lang === 'ar' ? 'لديك حساب بالفعل؟ سجل دخولك' : (lang === 'es' ? '¿Ya tienes una cuenta? Inicia sesión' : 'Already have an account? Sign in here'),
    submitSignin: lang === 'ar' ? 'تسجيل الدخول الآمن' : (lang === 'es' ? 'Inicio de Sesión Seguro' : 'Secure Sign In'),
    submitSignup: lang === 'ar' ? 'إنشاء الحساب الآمن' : (lang === 'es' ? 'Registrar Cuenta Segura' : 'Register Account'),
    firebaseBadge: lang === 'ar' ? 'المزامنة السحابية (Firebase)' : (lang === 'es' ? 'Sincronización en la Nube (Firebase)' : 'Cloud Sync (Firebase Auth)'),
    localBadge: lang === 'ar' ? 'جلسة محلية مشفرة' : (lang === 'es' ? 'Modo Local Cifrado' : 'Encrypted Local Mode'),
    successTitle: lang === 'ar' ? 'تمت العملية بنجاح!' : (lang === 'es' ? '¡Operación Exitosa!' : 'Success!'),
    successSub: lang === 'ar' ? 'جاري توجيهك إلى لوحة التحكم الشخصية...' : (lang === 'es' ? 'Preparando tu panel personalizado...' : 'Preparing your personalized dashboard...')
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4" id="login-modal-overlay">
        {/* Backdrop overlay */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-slate-950/80 backdrop-blur-md"
        />

        {/* Modal Content */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ type: 'spring', duration: 0.5 }}
          className="relative w-full max-w-md bg-slate-900 border border-slate-800/80 rounded-3xl shadow-2xl p-6 sm:p-8 overflow-hidden z-10"
          id="login-modal-box"
        >
          {/* Subtle glowing ambient light behind */}
          <div className="absolute top-0 left-1/4 w-1/2 h-1/2 bg-amber-500/10 blur-[80px] rounded-full pointer-events-none" />

          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-full transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Success screen */}
          {success ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center justify-center py-8 text-center space-y-4"
            >
              <div className="w-16 h-16 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-full flex items-center justify-center">
                <CheckCircle className="w-10 h-10 animate-bounce" />
              </div>
              <h3 className="text-xl font-bold text-white">
                {labels.successTitle}
              </h3>
              <p className="text-sm text-slate-400">
                {labels.successSub}
              </p>
            </motion.div>
          ) : (
            <div className="space-y-6">
              {/* Heading */}
              <div className="text-center relative">
                <div className="w-12 h-12 rounded-2xl bg-amber-500/10 flex items-center justify-center mx-auto mb-3 border border-amber-500/20">
                  <Shield className="w-6 h-6 text-amber-500" />
                </div>
                <h2 className="text-2xl font-black text-white tracking-tight">
                  {authMode === 'signin' ? labels.signinTitle : labels.signupTitle}
                </h2>
                <p className="text-xs text-slate-400 mt-2 px-4 leading-relaxed">
                  {authMode === 'signin' ? labels.signinDesc : labels.signupDesc}
                </p>
              </div>

              {/* Form */}
              <form onSubmit={handleAuthSubmit} className="space-y-4">
                
                {/* Developer Name Field (only in register) */}
                {authMode === 'signup' && (
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-400 block">
                      {labels.nameLabel} <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                        <User className="w-4 h-4" />
                      </div>
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="e.g. John Doe"
                        className="w-full bg-slate-950/60 border border-slate-800 text-white rounded-xl py-2.5 pl-10 pr-4 text-sm focus:outline-none focus:ring-1 focus:ring-amber-500 focus:border-amber-500 transition-all"
                      />
                    </div>
                  </div>
                )}

                {/* Email Field */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-400 block">
                    {labels.emailLabel} <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                      <Mail className="w-4 h-4" />
                    </div>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="developer@example.com"
                      className="w-full bg-slate-950/60 border border-slate-800 text-white rounded-xl py-2.5 pl-10 pr-4 text-sm focus:outline-none focus:ring-1 focus:ring-amber-500 focus:border-amber-500 transition-all"
                    />
                  </div>
                </div>

                {/* Password Field */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-400 block">
                    {labels.passLabel} <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                      <Lock className="w-4 h-4" />
                    </div>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full bg-slate-950/60 border border-slate-800 text-white rounded-xl py-2.5 pl-10 pr-10 text-sm focus:outline-none focus:ring-1 focus:ring-amber-500 focus:border-amber-500 transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-500 hover:text-slate-300 transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Confirm Password Field (only in register) */}
                {authMode === 'signup' && (
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-400 block">
                      {labels.confirmPassLabel} <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                        <Lock className="w-4 h-4" />
                      </div>
                      <input
                        type={showPassword ? 'text' : 'password'}
                        required
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full bg-slate-950/60 border border-slate-800 text-white rounded-xl py-2.5 pl-10 pr-10 text-sm focus:outline-none focus:ring-1 focus:ring-amber-500 focus:border-amber-500 transition-all"
                      />
                    </div>
                  </div>
                )}

                {/* Submit button */}
                <motion.button
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  disabled={loading}
                  type="submit"
                  className="w-full bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-slate-950 font-black py-3 px-4 rounded-xl shadow-lg transition-all text-sm flex items-center justify-center space-x-2 rtl:space-x-reverse disabled:opacity-50"
                >
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      <span>{authMode === 'signin' ? labels.submitSignin : labels.submitSignup}</span>
                    </>
                  )}
                </motion.button>
              </form>

              {/* Switch Mode Link */}
              <div className="text-center">
                <button
                  onClick={toggleMode}
                  className="text-xs text-amber-500 hover:text-amber-400 font-bold underline underline-offset-4 transition-colors"
                >
                  {authMode === 'signin' ? labels.noAccountLink : labels.haveAccountLink}
                </button>
              </div>

              {/* Divider */}
              <div className="relative flex items-center justify-center">
                <div className="border-t border-slate-800 w-full" />
                <span className="absolute bg-slate-900 px-3 text-[10px] uppercase font-bold text-slate-500 tracking-wider">
                  {lang === 'ar' ? 'أو عبر جوجل' : (lang === 'es' ? 'O mediante Google' : 'Or via Google')}
                </span>
              </div>

              {/* Google login */}
              <motion.button
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                disabled={loading}
                onClick={handleGoogleLogin}
                className="w-full flex items-center justify-center space-x-3 rtl:space-x-reverse bg-slate-800 hover:bg-slate-750 text-white border border-slate-700/50 font-bold py-2.5 px-4 rounded-xl shadow-md transition-colors disabled:opacity-50"
              >
                {/* SVG Google Icon */}
                <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                  <path
                    fill="#EA4335"
                    d="M12 5.04c1.61 0 3.05.56 4.19 1.64l3.13-3.13C17.43 1.79 14.93 1 12 1 7.37 1 3.4 3.66 1.45 7.55l3.77 2.92C6.14 7.23 8.84 5.04 12 5.04z"
                  />
                  <path
                    fill="#4285F4"
                    d="M23.49 12.27c0-.81-.07-1.59-.2-2.36H12v4.51h6.46c-.28 1.48-1.12 2.73-2.38 3.58l3.71 2.88c2.17-2 3.7-4.94 3.7-8.61z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.22 14.77c-.24-.73-.38-1.5-.38-2.3s.14-1.57.38-2.3L1.45 7.25C.52 9.1.01 11.18.01 13.37s.51 4.27 1.44 6.12l3.77-2.72z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c3.24 0 5.97-1.07 7.96-2.91l-3.71-2.88c-1.03.69-2.35 1.1-4.25 1.1-3.16 0-5.86-2.19-6.78-5.43L1.45 15.6C3.4 19.49 7.37 23 12 23z"
                  />
                </svg>
                <span className="text-xs">{labels.googleBtn}</span>
              </motion.button>

              {/* Status and Errors */}
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-3.5 bg-rose-500/10 border border-rose-500/20 text-rose-400 rounded-xl flex items-start space-x-2 rtl:space-x-reverse text-xs"
                >
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{error}</span>
                </motion.div>
              )}

              {/* Firebase connection status badge */}
              <div className="pt-4 border-t border-slate-800/60 flex items-center justify-center space-x-2 rtl:space-x-reverse">
                <div className={`w-2 h-2 rounded-full ${hasFirebase ? 'bg-emerald-500 animate-pulse' : 'bg-slate-600'}`} />
                <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">
                  {hasFirebase ? labels.firebaseBadge : labels.localBadge}
                </span>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
