/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Badge {
  id: string;
  category: 'html' | 'css' | 'javascript' | 'react' | 'bootstrap' | 'english';
  titleEn: string;
  titleAr: string;
  titleEs?: string;
  descEn: string;
  descAr: string;
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
    titleEs: 'Arquitecto HTML5',
    descEn: 'Score 85% or higher on the HTML assessment.',
    descAr: 'احصل على نتيجة 85% أو أعلى في تقييم HTML دلالي.',
    descEs: 'Obtén un 85% o más en la evaluación de HTML.',
    icon: '🧱',
    threshold: 85,
    color: 'from-orange-500/20 to-red-500/20 text-orange-400 border-orange-500/30'
  },
  {
    id: 'badge-css-wizard',
    category: 'css',
    titleEn: 'CSS Design Wizard',
    titleAr: 'ساحر تصاميم CSS',
    titleEs: 'Mago de Diseño CSS',
    descEn: 'Score 85% or higher on the CSS assessment.',
    descAr: 'احصل على نتيجة 85% أو أعلى في تقييم تخطيطات CSS.',
    descEs: 'Obtén un 85% o más en la evaluación de CSS.',
    icon: '🎨',
    threshold: 85,
    color: 'from-blue-500/20 to-cyan-500/20 text-blue-400 border-blue-500/30'
  },
  {
    id: 'badge-js-pro',
    category: 'javascript',
    titleEn: 'JavaScript Pro',
    titleAr: 'محترف جافا سكريبت',
    titleEs: 'Profesional de JavaScript',
    descEn: 'Score 85% or higher on the JavaScript assessment.',
    descAr: 'احصل على نتيجة 85% أو أعلى في تقييم جافا سكريبت.',
    descEs: 'Obtén un 85% o más en la evaluación de JavaScript.',
    icon: '⚡',
    threshold: 85,
    color: 'from-yellow-500/20 to-amber-500/20 text-yellow-400 border-yellow-500/30'
  },
  {
    id: 'badge-react-master',
    category: 'react',
    titleEn: 'React Master',
    titleAr: 'خبير وموجه ريأكت',
    titleEs: 'Maestro de React',
    descEn: 'Score 85% or higher on the React assessment.',
    descAr: 'احصل على نتيجة 85% أو أعلى في تقييم ريأكت.',
    descEs: 'Obtén un 85% o más en la evaluación de React.',
    icon: '⚛️',
    threshold: 85,
    color: 'from-sky-500/20 to-blue-500/20 text-sky-400 border-sky-500/30'
  },
  {
    id: 'badge-bootstrap-expert',
    category: 'bootstrap',
    titleEn: 'Bootstrap Expert',
    titleAr: 'خبير إطار بوتستراب',
    titleEs: 'Experto en Bootstrap',
    descEn: 'Score 85% or higher on the Bootstrap assessment.',
    descAr: 'احصل على نتيجة 85% أو أعلى في تقييم تخطيطات Bootstrap.',
    descEs: 'Obtén un 85% o más en la evaluación de Bootstrap.',
    icon: '⚙️',
    threshold: 85,
    color: 'from-purple-500/20 to-indigo-500/20 text-purple-400 border-purple-500/30'
  },
  {
    id: 'badge-english-ace',
    category: 'english',
    titleEn: 'English Communication Ace',
    titleAr: 'متحدث الإنجليزية المتميز',
    titleEs: 'As de la Comunicación en Inglés',
    descEn: 'Score 85% or higher on the Technical English assessment.',
    descAr: 'احصل على نتيجة 85% أو أعلى في تقييم الإنجليزية التقنية.',
    descEs: 'Obtén un 85% o más en la evaluación de Inglés Técnico.',
    icon: '📝',
    threshold: 85,
    color: 'from-emerald-500/20 to-teal-500/20 text-emerald-400 border-emerald-500/30'
  }
];
