/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { useApp } from '../context/AppContext';
import { Award, ShieldCheck, Printer, Calendar, Download, RefreshCw } from 'lucide-react';

interface CertificateProps {
  userName: string;
  categoryName: string;
  score: number;
  date: string;
  certId: string;
}

export const CertificateView: React.FC<CertificateProps> = ({
  userName,
  categoryName,
  score,
  date,
  certId
}) => {
  const { t, isRtl } = useApp();

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="flex flex-col items-center space-y-6 max-w-4xl mx-auto p-4" id="certificate-wrapper-container">
      
      {/* Printable Certificate Frame */}
      <div 
        id="printable-certificate-card"
        className="relative w-full max-w-3xl aspect-[1.414/1] bg-slate-950 text-slate-100 border-8 border-double border-amber-500/80 rounded-2xl p-8 md:p-12 shadow-2xl overflow-hidden flex flex-col justify-between print:border-amber-600 print:bg-white print:text-slate-900 print:shadow-none print:m-0"
      >
        {/* Decorative corner accents */}
        <div className="absolute top-4 left-4 w-12 h-12 border-t-4 border-l-4 border-amber-500/40 print:border-amber-600 print:opacity-15"></div>
        <div className="absolute top-4 right-4 w-12 h-12 border-t-4 border-r-4 border-amber-500/40 print:border-amber-600 print:opacity-15"></div>
        <div className="absolute bottom-4 left-4 w-12 h-12 border-b-4 border-l-4 border-amber-500/40 print:border-amber-600 print:opacity-15"></div>
        <div className="absolute bottom-4 right-4 w-12 h-12 border-b-4 border-r-4 border-amber-500/40 print:border-amber-600 print:opacity-15"></div>

        {/* Ambient background watermark icon */}
        <div className="absolute inset-0 flex items-center justify-center opacity-5 pointer-events-none print:opacity-[0.03]">
          <Award className="w-80 h-80 text-amber-500" />
        </div>

        {/* Header Header */}
        <div className="text-center space-y-3 z-10">
          <div className="flex items-center justify-center space-x-2 rtl:space-x-reverse">
            <Award className="w-10 h-10 text-amber-400 print:text-amber-600" />
            <h1 className="text-xl md:text-2xl font-black uppercase tracking-widest text-amber-400 font-sans print:text-amber-600">
              {t('verifiedCert')}
            </h1>
          </div>
          <div className="h-[2px] w-48 bg-gradient-to-r from-transparent via-amber-500 to-transparent mx-auto print:bg-amber-600"></div>
          <p className="text-[10px] md:text-xs font-mono tracking-widest text-slate-400 uppercase print:text-slate-500">
            PROUDLY PRESENTED BY THE FRONT-END EVALUATION PLATFORM
          </p>
        </div>

        {/* Body Text Content */}
        <div className="text-center my-6 space-y-4 z-10">
          <p className="text-xs md:text-sm italic text-slate-300 print:text-slate-600">
            This certifies that the candidate listed below has successfully completed rigorous evaluation in
          </p>
          <h2 className="text-lg md:text-2xl font-extrabold text-white tracking-wide uppercase print:text-slate-900">
            {categoryName}
          </h2>
          <p className="text-[10px] md:text-xs text-slate-400 uppercase print:text-slate-500">
            AND IS DECLARED REQUISITE SKILLS COMPLIANT AT PROFESSIONAL LEVEL
          </p>

          <div className="py-4">
            <h3 className="text-2xl md:text-4xl font-black font-sans bg-gradient-to-r from-amber-400 via-orange-400 to-amber-300 bg-clip-text text-transparent print:text-amber-700 tracking-wide">
              {userName}
            </h3>
            <div className="h-[1px] w-72 bg-slate-800 mx-auto mt-2 print:bg-slate-300"></div>
          </div>

          <div className="flex justify-center items-center space-x-8 rtl:space-x-reverse text-xs">
            <div className="flex items-center space-x-1.5 rtl:space-x-reverse">
              <Calendar className="w-4 h-4 text-amber-500" />
              <span className="text-slate-300 print:text-slate-600">{date}</span>
            </div>
            <div className="flex items-center space-x-1.5 rtl:space-x-reverse">
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              <span className="font-bold text-emerald-400 print:text-emerald-700">
                Grade: {score >= 90 ? 'A+' : score >= 80 ? 'A' : 'B'} ({Math.round(score)}%)
              </span>
            </div>
          </div>
        </div>

        {/* Footer & QR block */}
        <div className="border-t border-slate-900 pt-4 flex items-end justify-between text-left z-10 print:border-slate-200">
          <div className="space-y-1">
            <p className="text-[9px] font-mono text-slate-500 uppercase">
              Verification ID:
            </p>
            <p className="text-xs font-mono font-bold text-amber-500 uppercase print:text-slate-800">
              {certId}
            </p>
          </div>

          {/* Micro QR Code mockup */}
          <div className="flex items-center space-x-3 rtl:space-x-reverse">
            <div className="bg-white p-1 rounded border border-slate-200 shadow-sm print:border-slate-300">
              {/* Generated dynamic QR code block via inline-svg coordinates */}
              <svg className="w-12 h-12 text-slate-900" viewBox="0 0 25 25" shapeRendering="crispEdges">
                <rect width="25" height="25" fill="#ffffff" />
                {/* Outlines of a QR */}
                <rect x="0" y="0" width="7" height="7" fill="#0f172a" />
                <rect x="1" y="1" width="5" height="5" fill="#ffffff" />
                <rect x="2" y="2" width="3" height="3" fill="#0f172a" />

                <rect x="18" y="0" width="7" height="7" fill="#0f172a" />
                <rect x="19" y="1" width="5" height="5" fill="#ffffff" />
                <rect x="20" y="2" width="3" height="3" fill="#0f172a" />

                <rect x="0" y="18" width="7" height="7" fill="#0f172a" />
                <rect x="1" y="19" width="5" height="5" fill="#ffffff" />
                <rect x="2" y="20" width="3" height="3" fill="#0f172a" />

                {/* Random blocks */}
                <rect x="9" y="2" width="2" height="2" fill="#0f172a" />
                <rect x="13" y="1" width="2" height="3" fill="#0f172a" />
                <rect x="10" y="8" width="4" height="2" fill="#0f172a" />
                <rect x="15" y="11" width="2" height="4" fill="#0f172a" />
                <rect x="9" y="15" width="5" height="2" fill="#0f172a" />
                <rect x="20" y="12" width="3" height="3" fill="#0f172a" />
                <rect x="16" y="19" width="4" height="2" fill="#0f172a" />
                <rect x="21" y="21" width="3" height="3" fill="#0f172a" />
              </svg>
            </div>
            <div className="hidden sm:block text-[9px] text-slate-500 max-w-[120px] font-mono leading-tight uppercase">
              Scan barcode to verify status on official certification records.
            </div>
          </div>
        </div>

      </div>

      {/* Action buttons */}
      <div className="flex space-x-3 rtl:space-x-reverse print:hidden" id="cert-view-actions">
        <button
          onClick={handlePrint}
          className="flex items-center space-x-2 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-slate-900 font-bold px-5 py-2.5 rounded-xl shadow-lg shadow-amber-500/10 transition-all transform hover:-translate-y-0.5"
        >
          <Printer className="w-4 h-4" />
          <span>{t('printCert')}</span>
        </button>
      </div>

    </div>
  );
};
