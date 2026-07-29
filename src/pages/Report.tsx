/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { CertificateView } from '../components/CertificateView';
import { Confetti } from '../components/Confetti';
import { RadarChart } from '../components/RadarChart';
import { generateCertificateId } from '../data/questions';
import { 
  Award, CheckCircle2, XCircle, HelpCircle, ArrowLeft, RefreshCw, LayoutDashboard, Brain, BookOpen, Clock, Target, ShieldCheck, Lightbulb, Share2, Copy, Check, Printer, Download, FileText
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const Report: React.FC = () => {
  const { t, lang, isRtl, progress } = useApp();
  const location = useLocation();
  const navigate = useNavigate();

  const getQuestionText = (q: any) => {
    if (lang === 'ar') return q.questionTextAr;
    if (lang === 'es' && q.questionTextEs) return q.questionTextEs;
    return q.questionText;
  };

  const getQuestionOptions = (q: any) => {
    if (lang === 'ar') return q.optionsAr || [];
    if (lang === 'es' && q.optionsEs) return q.optionsEs;
    return q.options || [];
  };

  const getQuestionExplanation = (q: any) => {
    if (lang === 'ar') return q.explanationAr;
    if (lang === 'es' && q.explanationEs) return q.explanationEs;
    return q.explanation;
  };

  // Selected result data from route state
  const stateData = location.state || {};
  const result = stateData.result;
  const questions = stateData.questions || [];

  const categoriesList: ('html' | 'css' | 'javascript' | 'react' | 'bootstrap' | 'english')[] = [
    'html', 'css', 'javascript', 'react', 'bootstrap', 'english'
  ];

  const categoryNames = {
    html: isRtl ? 'هيكلة الويب HTML5' : 'HTML5 Structure',
    css: isRtl ? 'تنسيق الويب CSS3' : 'CSS3 Styling',
    javascript: isRtl ? 'جافا سكريبت' : 'JS Programming',
    react: isRtl ? 'مكتبة ريأكت' : 'React Framework',
    bootstrap: isRtl ? 'إطار بوتستراب' : 'Bootstrap Layouts',
    english: isRtl ? 'اللغة الإنجليزية' : 'Technical English'
  };

  const categoryColors = {
    html: '#f97316', // Orange
    css: '#3b82f6', // Blue
    javascript: '#f59e0b', // Yellow
    react: '#0ea5e9', // Sky blue
    bootstrap: '#8b5cf6', // Purple
    english: '#10b981' // Green
  };

  // Merge historical assessments and the current result if the current result is not already included
  const allCompleted = [...(progress.completedAssessments || [])];
  if (result && !allCompleted.some(r => r.id === result.id)) {
    allCompleted.push(result);
  }

  const radarData = categoriesList.map((cat) => {
    const matchingTests = allCompleted.filter((t) => t.category === cat);
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

  const [activeTab, setActiveTab] = useState<'summary' | 'review' | 'certificate'>('summary');
  const [confettiKey, setConfettiKey] = useState(0);
  const [copied, setCopied] = useState(false);

  const generateShareSummary = () => {
    const catName = categoryNames[result.category as keyof typeof categoryNames] || result.category.toUpperCase();
    const durationText = `${Math.floor(result.timeSpent / 60)}m ${result.timeSpent % 60}s`;
    
    if (isRtl) {
      return `🏆 لقد أكملت للتو تقييم "${catName}" على CodingSandbox بنجاح!
📊 النتيجة المكتسبة: ${Math.round(result.percentage)}% (التقدير: ${feedback.grade})
⏱️ الوقت المستغرق: ${durationText}
✅ الأسئلة الصحيحة: ${result.correctCount} من أصل ${result.correctCount + result.incorrectCount + result.skippedCount}

اختبر مهاراتك البرمجية والتحق بركب المطورين المتميزين! 💻🚀`;
    } else {
      return `🏆 I just completed the "${catName}" competency assessment on CodingSandbox!
📊 Earned Score: ${Math.round(result.percentage)}% (Grade: ${feedback.grade})
⏱️ Duration: ${durationText}
✅ Accuracy: ${result.correctCount} / ${result.correctCount + result.incorrectCount + result.skippedCount} questions correct

Evaluate your real-world development skills now! 💻🚀`;
    }
  };

  const handleCopySummary = () => {
    navigator.clipboard.writeText(generateShareSummary());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleTwitterShare = () => {
    const text = encodeURIComponent(generateShareSummary());
    window.open(`https://twitter.com/intent/tweet?text=${text}`, '_blank');
  };

  const handleLinkedinShare = () => {
    navigator.clipboard.writeText(generateShareSummary());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.origin)}`, '_blank');
  };

  const triggerConfetti = () => {
    setConfettiKey((prev) => prev + 1);
  };

  const handleExportPDF = () => {
    window.print();
  };

  const handleDownloadTextSummary = () => {
    if (!result) return;
    const catName = categoryNames[result.category as keyof typeof categoryNames] || String(result.category).toUpperCase();
    const durationText = `${Math.floor(result.timeSpent / 60)}m ${result.timeSpent % 60}s`;
    const totalQs = result.correctCount + result.incorrectCount + result.skippedCount;
    const dateStr = new Date().toLocaleString();

    let textContent = `==================================================\n`;
    textContent += `      CODING SANDBOX - PERFORMANCE REPORT         \n`;
    textContent += `==================================================\n\n`;
    textContent += `Developer: ${progress.userName || 'Developer'}\n`;
    textContent += `Assessment Category: ${catName}\n`;
    textContent += `Date Generated: ${dateStr}\n`;
    textContent += `Overall Score: ${Math.round(result.percentage)}% (${feedback.grade})\n`;
    textContent += `Performance Level: ${feedback.rating}\n\n`;

    textContent += `--------------------------------------------------\n`;
    textContent += `1. EXECUTION METRICS\n`;
    textContent += `--------------------------------------------------\n`;
    textContent += `- Total Questions: ${totalQs}\n`;
    textContent += `- Correct Answers: ${result.correctCount}\n`;
    textContent += `- Incorrect Answers: ${result.incorrectCount}\n`;
    textContent += `- Skipped Questions: ${result.skippedCount}\n`;
    textContent += `- Total Time Spent: ${durationText}\n\n`;

    textContent += `--------------------------------------------------\n`;
    textContent += `2. INTELLIGENT AI EVALUATION\n`;
    textContent += `--------------------------------------------------\n`;
    textContent += `English: "${feedback.commentEn}"\n`;
    textContent += `Arabic:  "${feedback.commentAr}"\n\n`;

    textContent += `--------------------------------------------------\n`;
    textContent += `3. CATEGORY SKILLS BREAKDOWN\n`;
    textContent += `--------------------------------------------------\n`;
    radarData.forEach(item => {
      textContent += `- ${item.label}: ${Math.round(item.value)}% (${item.count} assessment(s))\n`;
    });
    textContent += `\n`;

    if (questions && questions.length > 0) {
      textContent += `--------------------------------------------------\n`;
      textContent += `4. DETAILED QUESTION REVIEW\n`;
      textContent += `--------------------------------------------------\n`;
      questions.forEach((q: any, idx: number) => {
        const review = getAnswerReviewDetails(q);
        const status = review.isCorrect ? '[CORRECT]' : (result.answers[q.id] === undefined ? '[SKIPPED]' : '[INCORRECT]');
        const qText = getQuestionText(q);
        const exp = getQuestionExplanation(q);

        textContent += `Q${idx + 1}. ${status} ${qText}\n`;
        textContent += `   Your Answer: ${review.uAnsText}\n`;
        textContent += `   Correct Answer: ${review.correctText}\n`;
        if (exp) {
          textContent += `   Explanation: ${exp}\n`;
        }
        textContent += `\n`;
      });
    }

    textContent += `==================================================\n`;
    textContent += `End of Report - CodingSandbox Competency System\n`;
    textContent += `==================================================\n`;

    const blob = new Blob([textContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    const sanitizedCat = String(result.category).replace(/[^a-z0-9]/gi, '_');
    link.download = `performance_summary_${sanitizedCat}_${new Date().toISOString().slice(0, 10)}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  useEffect(() => {
    if (result) {
      triggerConfetti();
    }
  }, []);

  if (!result) {
    return (
      <div className="max-w-md mx-auto text-center py-16 space-y-4" id="report-empty-state">
        <HelpCircle className="w-12 h-12 text-slate-600 mx-auto" />
        <h2 className="text-xl font-bold text-white">No Assessment Data Found</h2>
        <p className="text-xs text-slate-400">Complete an assessment from the home page to review your performance metrics.</p>
        <button
          onClick={() => navigate('/')}
          className="bg-amber-500 hover:bg-amber-600 text-slate-900 font-bold px-4 py-2 rounded-xl text-xs"
        >
          Return Home
        </button>
      </div>
    );
  }

  // Generate a mock certificate validation ID
  const certId = generateCertificateId(progress.userName, result.category);

  // Personalized Intelligent Feedback based on percentages
  const getPersonalizedFeedback = () => {
    const score = result.percentage;
    if (score >= 90) {
      return {
        rating: 'Outstanding Master',
        grade: 'A+',
        commentEn: `Exceptional mastery! You have demonstrated comprehensive expertise in ${result.category.toUpperCase()}. Your solutions are robust, quick, and structurally sound. You are fully prepared for mid-to-senior technical roles in this domain!`,
        commentAr: `إتقان استثنائي وممتاز! لقد أظهرت خبرة شاملة في ${result.category.toUpperCase()}. حلولك قوية وسريعة ومصاغة بشكل سليم هيكلياً. أنت مؤهل تماماً للأدوار التقنية المتوسطة والمتقدمة في هذا المجال!`,
        color: 'text-emerald-400'
      };
    }
    if (score >= 75) {
      return {
        rating: 'Competent Practitioner',
        grade: 'A',
        commentEn: `Great job! You have strong core foundations in ${result.category.toUpperCase()} and are ready for junior development positions. Review your minor weak topics to maximize accuracy under strict execution logs.`,
        commentAr: `عمل رائع! لديك أسس قوية في ${result.category.toUpperCase()} وأنت جاهز تماماً لوظائف التطوير المبتدئة. راجع الموضوعات الضعيفة الطفيفة لتحقيق أقصى قدر من دقة الكود.`,
        color: 'text-indigo-400'
      };
    }
    if (score >= 60) {
      return {
        rating: 'Developing Programmer',
        grade: 'B',
        commentEn: `Satisfactory baseline. You understand general semantic guidelines and basic properties, but require additional practice with advanced parameters, specificity conflicts, or memory closure scopes.`,
        commentAr: `خط أساس مرضي. أنت تفهم الإرشادات العامة للموضوع والخصائص الأساسية، ولكنك تحتاج لمزيد من الممارسة مع المعاملات المتقدمة، وتعارض الخصوصية، أو نطاقات الـ closures في الذاكرة.`,
        color: 'text-amber-500'
      };
    }
    return {
      rating: 'Apprentice Developer',
      grade: 'C',
      commentEn: `Continuing study recommended. Focus heavily on core terminology, syntax rules, and standard responsive layout builders. Retry incorrect questions in study mode to build core knowledge.`,
      commentAr: `يوصى بمواصلة الدراسة والتدريب. ركز بشكل كبير على المصطلحات الأساسية، قواعد الصياغة، وبناء التخطيطات القياسية المتجاوبة. أعد المحاولة في وضع الدراسة لبناء المعرفة الأساسية.`,
      color: 'text-red-400'
    };
  };

  const feedback = getPersonalizedFeedback();

  // Helper to get matching option letters
  const getOptionLetter = (idx: number) => String.fromCharCode(65 + idx);

  // Format question state displays for user review
  const getAnswerReviewDetails = (q: any) => {
    const uAns = result.answers[q.id];
    let isCorrect = false;
    let uAnsText = 'Skipped / تم التخطي';

    if (uAns !== undefined && uAns !== null) {
      if (q.type === 'multiple-choice' || q.type === 'true-false' || q.type === 'code-output' || q.type === 'bug-fixing') {
        const correctOptIdx = q.correctAnswer[0];
        if (uAns[0] === correctOptIdx) isCorrect = true;
        const opts = getQuestionOptions(q);
        uAnsText = `${getOptionLetter(uAns[0])}. ${opts[uAns[0]] || ''}`;
      } else if (q.type === 'multiple-answer') {
        const correctList = q.correctAnswer;
        const matchAll = correctList.length === uAns.length && correctList.every((val: any) => uAns.includes(val));
        if (matchAll) isCorrect = true;
        uAnsText = uAns.map((idx: number) => getOptionLetter(idx)).join(', ');
      } else if (q.type === 'fill-in-blank') {
        if (String(uAns).trim().toLowerCase() === String(q.correctAnswer).trim().toLowerCase()) isCorrect = true;
        uAnsText = String(uAns);
      } else if (q.type === 'match-columns') {
        let allMatched = true;
        for (let i = 0; i < (q.matchLeft || []).length; i++) {
          if (uAns[i] !== q.correctAnswer[i]) {
            allMatched = false;
            break;
          }
        }
        if (allMatched) isCorrect = true;
        uAnsText = lang === 'ar' ? 'اكتمل الربط' : (lang === 'es' ? 'Conexiones completadas' : 'Completed connections');
      }
    }

    const opts = getQuestionOptions(q);
    const correctText = (q.type === 'multiple-choice' || q.type === 'true-false' || q.type === 'code-output' || q.type === 'bug-fixing')
      ? `${getOptionLetter(q.correctAnswer[0])}. ${opts[q.correctAnswer[0]] || ''}`
      : q.type === 'multiple-answer'
        ? q.correctAnswer.map((idx: number) => getOptionLetter(idx)).join(', ')
        : String(q.correctAnswer);

    return {
      isCorrect,
      uAnsText,
      correctText
    };
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-10" id="report-view-root">
      
      {/* Interactive Confetti Cannon system */}
      <Confetti key={confettiKey} />

      {/* 1. Header & Quick actions */}
      <section className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4" id="report-header">
        <div className="space-y-1">
          <h1 className="text-xl md:text-2xl font-black text-white uppercase tracking-tight">Assessment Report</h1>
          <p className="text-xs text-slate-400">Complete analysis of your performance weights and skills mapping.</p>
        </div>

        <div className="flex flex-wrap items-center gap-2 rtl:space-x-reverse no-print" id="report-header-actions">
          <button
            onClick={handleDownloadTextSummary}
            className="flex items-center space-x-1.5 rtl:space-x-reverse bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-md cursor-pointer"
            title={isRtl ? 'تحميل الملخص كملف نصي' : 'Download Summary as Text File'}
          >
            <Download className="w-4 h-4 text-amber-400" />
            <span>{isRtl ? 'تحميل ملخص (.txt)' : 'Download TXT Summary'}</span>
          </button>

          <button
            onClick={handleExportPDF}
            className="flex items-center space-x-1.5 rtl:space-x-reverse bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-slate-950 px-4 py-2 rounded-xl text-xs font-black transition-all shadow-md shadow-amber-500/10 cursor-pointer"
            title={isRtl ? 'تصدير التقرير كملف PDF أو طباعة' : 'Export Report as PDF or Print'}
          >
            <Printer className="w-4 h-4" />
            <span>{isRtl ? 'تصدير PDF / طباعة' : 'Export Report PDF'}</span>
          </button>

          <button
            onClick={() => navigate(`/assessment?category=${result.category}`)}
            className="flex items-center space-x-1.5 rtl:space-x-reverse bg-slate-900 hover:bg-slate-800 border border-slate-800 px-4 py-2 rounded-xl text-xs font-bold text-slate-300 transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Retake Exam</span>
          </button>
          
          <button
            onClick={() => navigate('/dashboard')}
            className="flex items-center space-x-1.5 rtl:space-x-reverse bg-slate-800 hover:bg-slate-700 text-slate-200 px-4 py-2 rounded-xl text-xs font-extrabold transition-colors border border-slate-700"
          >
            <LayoutDashboard className="w-4 h-4" />
            <span>Go to Dashboard</span>
          </button>
        </div>
      </section>

      {/* 2. Custom Tabs navigation */}
      <nav className="flex space-x-1.5 rtl:space-x-reverse bg-slate-900 p-1.5 rounded-2xl border border-slate-800/80 w-fit mx-auto sm:mx-0 no-print">
        <button
          onClick={() => setActiveTab('summary')}
          className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'summary' 
              ? 'bg-slate-950 text-amber-500 shadow-md border border-slate-800' 
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Performance Summary
        </button>

        <button
          onClick={() => setActiveTab('review')}
          className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'review' 
              ? 'bg-slate-950 text-amber-500 shadow-md border border-slate-800' 
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Review Questions ({questions.length})
        </button>

        {result.percentage >= 70 && (
          <button
            onClick={() => {
              setActiveTab('certificate');
              triggerConfetti();
            }}
            className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'certificate' 
                ? 'bg-slate-950 text-amber-500 shadow-md border border-slate-800' 
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Award Certificate 🎓
          </button>
        )}
      </nav>

      {/* 3. Render tabs content */}
      <AnimatePresence mode="wait">
        
        {/* TAB 1: Summary report */}
        {activeTab === 'summary' && (
          <motion.div
            key="summary-tab"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="space-y-8"
          >
            {/* Scoring & intelligent comments banner */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-slate-900 border border-slate-800/80 p-6 md:p-8 rounded-3xl backdrop-blur-md">
              
              <div className="flex flex-col items-center justify-center text-center space-y-3 md:border-r border-slate-800 rtl:md:border-r-0 rtl:md:border-l py-4">
                <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">Final Weighted Grade</span>
                <motion.div 
                  onClick={triggerConfetti}
                  whileHover={{ scale: 1.1, rotate: [0, -4, 4, -4, 0] }}
                  whileTap={{ scale: 0.95 }}
                  title={isRtl ? "انقر للمفاجأة 🎉" : "Click for magic 🎉"}
                  className="w-24 h-24 rounded-full bg-slate-950 flex flex-col items-center justify-center border-4 border-amber-500 shadow-xl shadow-amber-500/10 cursor-pointer select-none group transition-all duration-300"
                >
                  <span className="text-3xl font-black text-white group-hover:text-amber-400 transition-colors">{feedback.grade}</span>
                </motion.div>
                <div className="space-y-0.5">
                  <p className="text-sm font-black text-amber-500 font-mono">{Math.round(result.percentage)}%</p>
                  <p className="text-[10px] text-slate-500 uppercase">{feedback.rating}</p>
                  <motion.p 
                    animate={{ opacity: [0.4, 1, 0.4] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                    className="text-[9px] text-amber-500/80 font-bold cursor-pointer select-none mt-1 hover:text-amber-400"
                    onClick={triggerConfetti}
                  >
                    {isRtl ? "انقر للاحتفال! ✨" : "Click to celebrate! ✨"}
                  </motion.p>
                </div>
              </div>

              {/* AI intelligent comment box */}
              <div className="md:col-span-2 flex flex-col justify-center space-y-4 py-4 md:px-6">
                <div className="flex items-center space-x-2 rtl:space-x-reverse text-amber-500">
                  <Brain className="w-5 h-5" />
                  <h3 className="font-extrabold text-xs uppercase tracking-wider">Intelligent AI Evaluation Logs</h3>
                </div>
                <p className="text-slate-300 text-xs md:text-sm leading-relaxed italic bg-slate-950/40 p-4 rounded-xl border border-slate-800/50">
                  "{isRtl ? feedback.commentAr : feedback.commentEn}"
                </p>
              </div>

            </div>

            {/* Share & Celebrate Success Card */}
            <div className="bg-slate-900 border border-slate-800/80 p-6 rounded-3xl grid grid-cols-1 md:grid-cols-3 gap-6 items-center no-print" id="share-results-card">
              <div className="md:col-span-2 space-y-3 text-left rtl:text-right">
                <div className="flex items-center gap-2 text-amber-500">
                  <Share2 className="w-4 h-4" />
                  <h3 className="font-extrabold text-xs uppercase tracking-wider">
                    {isRtl ? 'شارك إنجازك ونجاحك' : 'Share Your Achievement'}
                  </h3>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {isRtl 
                    ? 'احصل على ملخص منسق لنتيجتك في التقييم لنسخه ومشاركته عبر شبكات التواصل الاجتماعي لإبراز مهاراتك البرمجية.' 
                    : 'Get a beautifully formatted, copy-ready summary of your assessment score to easily post and showcase on social media.'}
                </p>
                <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800/60 font-mono text-left text-[11px] leading-relaxed text-slate-400 max-h-[100px] overflow-y-auto whitespace-pre-wrap select-all">
                  {generateShareSummary()}
                </div>
              </div>

              <div className="flex flex-col gap-2.5 w-full">
                <button
                  onClick={handleCopySummary}
                  className="w-full flex items-center justify-center space-x-2 bg-amber-500 hover:bg-amber-600 text-slate-900 font-extrabold py-3 rounded-xl text-xs transition-colors cursor-pointer shadow-md shadow-amber-500/5"
                >
                  {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  <span>
                    {copied 
                      ? (isRtl ? 'تم النسخ!' : 'Copied!') 
                      : (isRtl ? 'نسخ التقرير' : 'Copy Formatted Report')}
                  </span>
                </button>

                <button
                  onClick={handleDownloadTextSummary}
                  className="w-full flex items-center justify-center space-x-2 bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-200 font-bold py-2.5 rounded-xl text-xs transition-colors cursor-pointer"
                >
                  <Download className="w-4 h-4 text-amber-400" />
                  <span>{isRtl ? 'تحميل الملخص كملف نصي (.txt)' : 'Download Summary (.txt)'}</span>
                </button>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={handleTwitterShare}
                    className="flex items-center justify-center space-x-1.5 bg-slate-950 hover:bg-slate-850 border border-slate-800/80 px-3 py-2.5 rounded-xl text-xs font-bold text-slate-300 transition-colors cursor-pointer"
                  >
                    <span>Twitter / X</span>
                  </button>
                  <button
                    onClick={handleLinkedinShare}
                    className="flex items-center justify-center space-x-1.5 bg-slate-950 hover:bg-slate-850 border border-slate-800/80 px-3 py-2.5 rounded-xl text-xs font-bold text-slate-300 transition-colors cursor-pointer"
                  >
                    <span>LinkedIn</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Metrics Breakdown Bento Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              
              <div className="p-5 bg-slate-900/50 border border-slate-800 rounded-2xl flex items-center space-x-4 rtl:space-x-reverse">
                <div className="w-10 h-10 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <div className="space-y-0.5">
                  <p className="text-[10px] text-slate-500 uppercase font-semibold">Correct Items</p>
                  <p className="text-lg font-black text-slate-200 font-mono">{result.correctCount} Qs</p>
                </div>
              </div>

              <div className="p-5 bg-slate-900/50 border border-slate-800 rounded-2xl flex items-center space-x-4 rtl:space-x-reverse">
                <div className="w-10 h-10 rounded-lg bg-red-500/10 text-red-400 flex items-center justify-center">
                  <XCircle className="w-5 h-5" />
                </div>
                <div className="space-y-0.5">
                  <p className="text-[10px] text-slate-500 uppercase font-semibold">Incorrect Items</p>
                  <p className="text-lg font-black text-slate-200 font-mono">{result.incorrectCount} Qs</p>
                </div>
              </div>

              <div className="p-5 bg-slate-900/50 border border-slate-800 rounded-2xl flex items-center space-x-4 rtl:space-x-reverse">
                <div className="w-10 h-10 rounded-lg bg-slate-800 text-slate-400 flex items-center justify-center">
                  <HelpCircle className="w-5 h-5" />
                </div>
                <div className="space-y-0.5">
                  <p className="text-[10px] text-slate-500 uppercase font-semibold">Skipped Items</p>
                  <p className="text-lg font-black text-slate-200 font-mono">{result.skippedCount} Qs</p>
                </div>
              </div>

              <div className="p-5 bg-slate-900/50 border border-slate-800 rounded-2xl flex items-center space-x-4 rtl:space-x-reverse">
                <div className="w-10 h-10 rounded-lg bg-sky-500/10 text-sky-400 flex items-center justify-center">
                  <Clock className="w-5 h-5" />
                </div>
                <div className="space-y-0.5">
                  <p className="text-[10px] text-slate-500 uppercase font-semibold">Elapsed Duration</p>
                  <p className="text-lg font-black text-slate-200 font-mono">
                    {Math.floor(result.timeSpent / 60)}m {result.timeSpent % 60}s
                  </p>
                </div>
              </div>

            </div>

            {/* Radar / Spider Chart and Strengths/Weaknesses Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* Left Column: Spider Chart / Radar Chart */}
              <div className="lg:col-span-5 flex flex-col justify-stretch">
                <RadarChart data={radarData} />
              </div>

              {/* Right Column: Strengths & Weaknesses */}
              <div className="lg:col-span-7 flex flex-col gap-6">
                <div className="bg-slate-900 border border-slate-800/80 p-6 rounded-2xl space-y-4 flex-1">
                  <div className="flex items-center space-x-2 rtl:space-x-reverse text-emerald-400 font-extrabold text-sm uppercase tracking-wider">
                    <CheckCircle2 className="w-5 h-5" />
                    <span>{isRtl ? 'نقاط القوة المكتشفة' : 'Demonstrated Strengths'}</span>
                  </div>
                  <ul className="space-y-2.5">
                    {result.strengths.map((str: string, idx: number) => (
                      <li key={idx} className="text-xs md:text-sm text-slate-300 flex items-center space-x-2.5 rtl:space-x-reverse bg-slate-950/60 p-3 rounded-xl border border-slate-800">
                        <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                        <span>{str}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="bg-slate-900 border border-slate-800/80 p-6 rounded-2xl space-y-4 flex-1">
                  <div className="flex items-center space-x-2 rtl:space-x-reverse text-amber-500 font-extrabold text-sm uppercase tracking-wider">
                    <XCircle className="w-5 h-5" />
                    <span>{isRtl ? 'جوانب التطوير المقترحة' : 'Topic Improvement Areas'}</span>
                  </div>
                  <ul className="space-y-2.5">
                    {result.weaknesses.map((weak: string, idx: number) => (
                      <li key={idx} className="text-xs md:text-sm text-slate-300 flex items-center space-x-2.5 rtl:space-x-reverse bg-slate-950/60 p-3 rounded-xl border border-slate-800">
                        <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                        <span>{weak}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

            </div>

            {/* Difficulty Analysis statistics */}
            <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-4" id="difficulty-breakdown-card">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">Difficulty Accuracy Breakdown</h3>
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                {Object.entries(result.difficultyBreakdown).map(([diff, counts]: [string, any]) => {
                  const percentage = counts.total > 0 ? (counts.correct / counts.total) * 100 : 0;
                  return (
                    <div key={diff} className="p-4 bg-slate-950 rounded-xl space-y-2 text-center border border-slate-800/50">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{diff}</p>
                      <p className="text-lg font-black text-white font-mono">{counts.correct} / {counts.total}</p>
                      <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                        <div className="h-full bg-indigo-500" style={{ width: `${percentage}%` }}></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Guided Hints & Assistance Analysis */}
            <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-4" id="hints-usage-analysis-card">
              <div className="flex items-center space-x-2.5 rtl:space-x-reverse text-amber-500 font-extrabold text-sm uppercase tracking-wider">
                <Lightbulb className="w-5 h-5" />
                <span>{isRtl ? 'تحليل مساعدة التلميحات الموجهة' : 'Guided Hints & Assistance Analysis'}</span>
              </div>
              <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800 space-y-3">
                {(!result.hintsUsed || result.hintsUsed.length === 0) ? (
                  <div className="flex flex-col sm:flex-row items-center gap-3 py-2">
                    <div className="w-10 h-10 rounded-full bg-amber-500/10 text-amber-500 flex items-center justify-center shrink-0">
                      <Award className="w-5 h-5 animate-bounce" />
                    </div>
                    <div className="text-center sm:text-left rtl:text-right">
                      <p className="text-xs md:text-sm font-bold text-white">
                        {isRtl 
                          ? 'إنجاز رائع: مستقل تماماً! 🎖️' 
                          : 'Independent Mastery Achievement! 🎖️'}
                      </p>
                      <p className="text-[11px] text-slate-400 mt-0.5 leading-relaxed">
                        {isRtl 
                          ? 'لقد أجبت على جميع الأسئلة وحللت كافة المشاكل البرمجية بشكل مستقل تماماً دون كشف أو استخدام أي تلميحات تذكر.' 
                          : 'You solved all coding challenges and questions entirely on your own without revealing any hints. Fantastic job!'}
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 pb-3 border-b border-slate-900">
                      <div>
                        <p className="text-xs md:text-sm font-bold text-white">
                          {isRtl 
                            ? 'تمت الاستعانة بالتلميحات الموجهة' 
                            : 'Guided Suggestions Accessed'}
                        </p>
                        <p className="text-[11px] text-slate-400 mt-0.5 leading-relaxed">
                          {isRtl 
                            ? 'لقد قمت بعرض تلميحات موجهة لمساعدتك في التفكير البرمجي لبعض الأسئلة.' 
                            : 'You revealed small, guided suggestions to assist your core algorithmic reasoning.'}
                        </p>
                      </div>
                      <span className="bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-bold font-mono px-3 py-1 rounded-full shrink-0">
                        {result.hintsUsed.length} {isRtl ? 'تلميحات' : 'Hint(s) Used'}
                      </span>
                    </div>

                    <div className="space-y-2">
                      <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                        {isRtl ? 'الأسئلة التي تمت مراجعة تلميحاتها:' : 'Questions with revealed hints:'}
                      </p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {questions.filter((q: any) => result.hintsUsed?.includes(q.id)).map((q: any) => (
                          <div key={q.id} className="p-3 bg-slate-900 border border-slate-800 rounded-xl text-left rtl:text-right flex items-center justify-between gap-2">
                            <div className="min-w-0">
                              <p className="text-xs font-bold text-slate-200 truncate">
                                {q.topic}
                              </p>
                              <p className="text-[10px] text-slate-400 truncate mt-0.5">
                                {getQuestionText(q)}
                              </p>
                            </div>
                            <span className="text-[9px] font-mono font-bold uppercase px-2 py-0.5 rounded bg-amber-500/10 text-amber-500 shrink-0">
                              {isRtl ? 'مستعان به' : 'Assisted'}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

          </motion.div>
        )}

        {/* TAB 2: Review Questions Mode */}
        {activeTab === 'review' && (
          <motion.div
            key="review-tab"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="space-y-6"
          >
            {questions.map((q: any, idx: number) => {
              const { isCorrect, uAnsText, correctText } = getAnswerReviewDetails(q);
              return (
                <div 
                  key={q.id}
                  className={`p-6 rounded-2xl border ${
                    isCorrect 
                      ? 'bg-slate-900 border-emerald-500/20' 
                      : 'bg-slate-900 border-red-500/20'
                  } space-y-4`}
                >
                  <div className="flex justify-between items-start gap-4">
                    <div className="space-y-1">
                      <span className="text-[9px] font-mono font-bold uppercase px-2 py-0.5 rounded-full bg-slate-950 text-amber-500">
                        {q.topic}
                      </span>
                      <h3 className="text-xs md:text-sm text-slate-200 font-medium">
                        Q{idx + 1}. {getQuestionText(q)}
                      </h3>
                    </div>

                    <span className={`text-xs font-bold px-3 py-1 rounded-full ${
                      isCorrect ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'
                    }`}>
                      {isCorrect ? 'Correct' : 'Incorrect'}
                    </span>
                  </div>

                  {q.codeSnippet && (
                    <pre className="p-3.5 bg-slate-950 rounded-xl text-xs font-mono text-amber-400/95 overflow-x-auto border border-slate-800/80">
                      <code>{q.codeSnippet}</code>
                    </pre>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs md:text-sm pt-2 border-t border-slate-950">
                    <div className="p-3 bg-slate-950/60 rounded-xl space-y-1">
                      <p className="text-[10px] text-slate-500 font-bold uppercase">Your Selection:</p>
                      <p className={`font-semibold ${isCorrect ? 'text-emerald-400' : 'text-red-400'}`}>{uAnsText}</p>
                    </div>

                    <div className="p-3 bg-slate-950/60 rounded-xl space-y-1">
                      <p className="text-[10px] text-slate-500 font-bold uppercase">Correct Answer:</p>
                      <p className="font-semibold text-slate-200">{correctText}</p>
                    </div>
                  </div>

                  <div className="p-4 bg-slate-950/40 border border-slate-850 rounded-xl text-xs md:text-sm text-slate-400 space-y-1">
                    <p className="font-bold text-slate-300 text-[10px] uppercase">Explanation & Reference logs:</p>
                    <p>{getQuestionExplanation(q)}</p>
                  </div>
                </div>
              );
            })}
          </motion.div>
        )}

        {/* TAB 3: Verifiable Certificate */}
        {activeTab === 'certificate' && result.percentage >= 70 && (
          <motion.div
            key="certificate-tab"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
          >
            <CertificateView
              userName={progress.userName}
              categoryName={result.category.toUpperCase() + " Core Competency evaluation"}
              score={result.percentage}
              date={result.date}
              certId={certId}
            />
          </motion.div>
        )}

      </AnimatePresence>

    </div>
  );
};
