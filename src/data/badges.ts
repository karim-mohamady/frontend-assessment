/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { QuestionCategory } from '../types';

export interface Badge {
  id: string;
  category: QuestionCategory;
  titleEn: string;
  titleAr: string;
  titleIt?: string;
  titleEs?: string;
  descEn: string;
  descAr: string;
  descIt?: string;
  descEs?: string;
  icon: string;
  threshold: number;
  color: string; // Tailwind gradient/classes
}

export const BADGES: Badge[] = [
  {
    id: 'badge-html-architect',
    category: 'html',
    titleEn: 'HTML5 Architect',
    titleAr: 'مهندس هيكلة الويب',
    titleIt: 'Architetto HTML5',
    descEn: 'Score 85% or higher on the HTML assessment.',
    descAr: 'احصل على نتيجة 85% أو أعلى في تقييم HTML دلالي.',
    descIt: 'Ottieni l\'85% o più nella valutazione HTML.',
    icon: '🧱',
    threshold: 85,
    color: 'from-orange-500/20 to-red-500/20 text-orange-400 border-orange-500/30'
  },
  {
    id: 'badge-css-wizard',
    category: 'css',
    titleEn: 'CSS Design Wizard',
    titleAr: 'ساحر تصاميم CSS',
    titleIt: 'Mago del Design CSS',
    descEn: 'Score 85% or higher on the CSS assessment.',
    descAr: 'احصل على نتيجة 85% أو أعلى في تقييم تخطيطات CSS.',
    descIt: 'Ottieni l\'85% o più nella valutazione CSS.',
    icon: '🎨',
    threshold: 85,
    color: 'from-blue-500/20 to-cyan-500/20 text-blue-400 border-blue-500/30'
  },
  {
    id: 'badge-js-pro',
    category: 'javascript',
    titleEn: 'JavaScript Pro',
    titleAr: 'محترف جافا سكريبت',
    titleIt: 'Professionista JavaScript',
    descEn: 'Score 85% or higher on the JavaScript assessment.',
    descAr: 'احصل على نتيجة 85% أو أعلى في تقييم جافا سكريبت.',
    descIt: 'Ottieni l\'85% o più nella valutazione JavaScript.',
    icon: '⚡',
    threshold: 85,
    color: 'from-yellow-500/20 to-amber-500/20 text-yellow-400 border-yellow-500/30'
  },
  {
    id: 'badge-react-master',
    category: 'react',
    titleEn: 'React Master',
    titleAr: 'خبير وموجه ريأكت',
    titleIt: 'Maestro React',
    descEn: 'Score 85% or higher on the React assessment.',
    descAr: 'احصل على نتيجة 85% أو أعلى في تقييم ريأكت.',
    descIt: 'Ottieni l\'85% o più nella valutazione React.',
    icon: '⚛️',
    threshold: 85,
    color: 'from-sky-500/20 to-blue-500/20 text-sky-400 border-sky-500/30'
  },
  {
    id: 'badge-bootstrap-expert',
    category: 'bootstrap',
    titleEn: 'Bootstrap Expert',
    titleAr: 'خبير إطار بوتستراب',
    titleIt: 'Esperto Bootstrap',
    descEn: 'Score 85% or higher on the Bootstrap assessment.',
    descAr: 'احصل على نتيجة 85% أو أعلى في تقييم تخطيطات Bootstrap.',
    descIt: 'Ottieni l\'85% o più nella valutazione Bootstrap.',
    icon: '⚙️',
    threshold: 85,
    color: 'from-purple-500/20 to-indigo-500/20 text-purple-400 border-purple-500/30'
  },
  {
    id: 'badge-php-master',
    category: 'php',
    titleEn: 'PHP 8.x Specialist',
    titleAr: 'متخصص PHP 8 والبرمجة الكائنية',
    titleIt: 'Specialista PHP 8.x',
    descEn: 'Score 85% or higher on the PHP assessment.',
    descAr: 'احصل على نتيجة 85% أو أعلى في تقييم لغة PHP.',
    descIt: 'Ottieni l\'85% o più nella valutazione PHP.',
    icon: '🐘',
    threshold: 85,
    color: 'from-indigo-500/20 to-violet-500/20 text-indigo-400 border-indigo-500/30'
  },
  {
    id: 'badge-laravel-architect',
    category: 'laravel',
    titleEn: 'Laravel Artisan Architect',
    titleAr: 'مهندس إطار لارفيل',
    titleIt: 'Architetto Laravel',
    descEn: 'Score 85% or higher on the Laravel assessment.',
    descAr: 'احصل على نتيجة 85% أو أعلى في تقييم Laravel.',
    descIt: 'Ottieni l\'85% o più nella valutazione Laravel.',
    icon: '🔴',
    threshold: 85,
    color: 'from-red-500/20 to-rose-500/20 text-red-400 border-red-500/30'
  },
  {
    id: 'badge-mysql-ninja',
    category: 'mysql',
    titleEn: 'MySQL Database Specialist',
    titleAr: 'خبير قواعد بيانات MySQL',
    titleIt: 'Specialista Database MySQL',
    descEn: 'Score 85% or higher on the MySQL assessment.',
    descAr: 'احصل على نتيجة 85% أو أعلى في تقييم MySQL.',
    descIt: 'Ottieni l\'85% o più nella valutazione MySQL.',
    icon: '🐬',
    threshold: 85,
    color: 'from-blue-600/20 to-teal-500/20 text-blue-300 border-blue-500/30'
  },
  {
    id: 'badge-backend-engineer',
    category: 'backend',
    titleEn: 'Backend & API Engineer',
    titleAr: 'مهندس الباك إند والواجهات البرمجية',
    titleIt: 'Ingegnere Backend & API',
    descEn: 'Score 85% or higher on the Backend Architecture assessment.',
    descAr: 'احصل على نتيجة 85% أو أعلى في تقييم هندسة الباك إند.',
    descIt: 'Ottieni l\'85% o più nella valutazione Backend.',
    icon: '🖥️',
    threshold: 85,
    color: 'from-slate-600/20 to-emerald-600/20 text-emerald-400 border-emerald-500/30'
  },
  {
    id: 'badge-english-ace',
    category: 'english',
    titleEn: 'English Communication Ace',
    titleAr: 'متحدث الإنجليزية المتميز',
    titleIt: 'Asso della Comunicazione Inglese',
    descEn: 'Score 85% or higher on the Technical English assessment.',
    descAr: 'احصل على نتيجة 85% أو أعلى في تقييم الإنجليزية التقنية.',
    descIt: 'Ottieni l\'85% o più nella valutazione Inglese Tecnico.',
    icon: '📝',
    threshold: 85,
    color: 'from-emerald-500/20 to-teal-500/20 text-emerald-400 border-emerald-500/30'
  },
  {
    id: 'badge-uiux-designer',
    category: 'uiux',
    titleEn: 'UI/UX Design Specialist',
    titleAr: 'أخصائي تصميم الواجهات وتجربة المستخدم',
    titleIt: 'Specialista UI/UX Design',
    descEn: 'Score 85% or higher on the UI/UX assessment.',
    descAr: 'احصل على نتيجة 85% أو أعلى في تقييم UI/UX.',
    descIt: 'Ottieni l\'85% o più nella valutazione UI/UX.',
    icon: '🎨',
    threshold: 85,
    color: 'from-pink-500/20 to-rose-500/20 text-pink-400 border-pink-500/30'
  },
  {
    id: 'badge-figma-master',
    category: 'figma',
    titleEn: 'Figma Auto-Layout Master',
    titleAr: 'خبير التخطيط التلقائي بفيجما',
    titleIt: 'Maestro Figma Auto-Layout',
    descEn: 'Score 85% or higher on the Figma assessment.',
    descAr: 'احصل على نتيجة 85% أو أعلى في تقييم Figma.',
    descIt: 'Ottieni l\'85% o più nella valutazione Figma.',
    icon: '📐',
    threshold: 85,
    color: 'from-purple-500/20 to-fuchsia-500/20 text-purple-400 border-purple-500/30'
  },
  {
    id: 'badge-web3-pioneer',
    category: 'web3',
    titleEn: 'Web3 & Blockchain Pioneer',
    titleAr: 'رائد تطبيقات الويب 3 والبلوكشين',
    titleIt: 'Pioniere Web3 & Blockchain',
    descEn: 'Score 85% or higher on the Web3 assessment.',
    descAr: 'احصل على نتيجة 85% أو أعلى في تقييم Web3.',
    descIt: 'Ottieni l\'85% o أكثر في تقييم Web3.',
    icon: '🪙',
    threshold: 85,
    color: 'from-amber-500/20 to-yellow-500/20 text-amber-400 border-amber-500/30'
  },
  {
    id: 'badge-solidity-auditor',
    category: 'solidity',
    titleEn: 'Solidity Smart Contract Auditor',
    titleAr: 'مراقب عقود Solidity الذكية',
    titleIt: 'Auditor Smart Contract Solidity',
    descEn: 'Score 85% or higher on the Solidity assessment.',
    descAr: 'احصل على نتيجة 85% أو أعلى في تقييم Solidity.',
    descIt: 'Ottieni l\'85% o più nella valutazione Solidity.',
    icon: '📜',
    threshold: 85,
    color: 'from-cyan-500/20 to-blue-500/20 text-cyan-400 border-cyan-500/30'
  }
];

