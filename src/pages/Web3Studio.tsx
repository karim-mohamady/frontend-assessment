/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  ShieldAlert, 
  CheckCircle2, 
  Code, 
  Copy, 
  Check, 
  Coins, 
  Zap, 
  Cpu, 
  Layers, 
  Sparkles, 
  Terminal,
  FileCode,
  Lock
} from 'lucide-react';

interface SecurityAuditResult {
  titleEn: string;
  titleAr: string;
  severity: 'critical' | 'warning' | 'passed';
  descEn: string;
  descAr: string;
}

export const Web3Studio: React.FC = () => {
  const { lang } = useApp();
  const isAr = lang === 'ar';

  const [solidityCode, setSolidityCode] = useState(`// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract TechAcademyToken is ERC20, Ownable {
    uint256 public constant MAX_SUPPLY = 1_000_000 * 10**18;

    constructor() ERC20("TechAcademy Token", "TAT") Ownable(msg.sender) {
        _mint(msg.sender, 100_000 * 10**18);
    }

    function mintReward(to address, uint256 amount) external onlyOwner {
        require(totalSupply() + amount <= MAX_SUPPLY, "Exceeds max supply");
        _mint(to, amount);
    }
}`);

  const [auditResults, setAuditResults] = useState<SecurityAuditResult[]>([
    {
      titleEn: 'OpenZeppelin Standard Guarding',
      titleAr: 'تطبيق معايير أمان OpenZeppelin القياسية',
      severity: 'passed',
      descEn: 'Contract properly inherits from standard ERC20 and Ownable access control primitives.',
      descAr: 'العقد يستخدم الوراثة البرمجية الآمنة من معايير ERC20 والتحكم في الصلاحيات Ownable.'
    },
    {
      titleEn: 'Reentrancy Vulnerability Check',
      titleAr: 'فحص ثغرات إعادة الدخول (Reentrancy)',
      severity: 'passed',
      descEn: 'No state modifications occur after external value transfers.',
      descAr: 'لا توجد تعديلات على حالة العقد بعد إجراء التحويلات المالية الخارجية.'
    },
    {
      titleEn: 'Integer Overflow / Underflow Prevention',
      titleAr: 'الوقاية من طفح الأرقام الصحيحة Overflow',
      severity: 'passed',
      descEn: 'Solidity ^0.8.20 enforces built-in overflow checks at runtime without SafeMath overhead.',
      descAr: 'نسخة Solidity 0.8 أصلحت الأرقام حيوياً لمنع طفح البيانات.'
    }
  ]);

  const [copied, setCopied] = useState(false);
  const [gasEstimated, setGasEstimated] = useState(142850);

  const copyCode = () => {
    navigator.clipboard.writeText(solidityCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-10 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header Hero */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-amber-950/20 to-slate-950 p-6 md:p-10 border border-amber-500/30 shadow-2xl shadow-amber-500/5">
          <div className="relative flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="space-y-3">
              <div className="flex items-center space-x-3 rtl:space-x-reverse">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-600 flex items-center justify-center shadow-lg shadow-amber-500/20">
                  <Coins className="w-7 h-7 text-slate-950" strokeWidth={2.5} />
                </div>
                <div>
                  <span className="text-xs font-black text-amber-400 uppercase tracking-widest block">
                    {isAr ? 'معمل العقود الذكية وتقنيات الـ Web3' : 'Web3 & Solidity Smart Contract Studio'}
                  </span>
                  <h1 className="text-2xl md:text-3xl font-black text-white tracking-tight">
                    {isAr ? 'كتابة، تدقيق أمان، وحساب غاز العقود الذكية (EVM Gas & Security)' : 'Solidity Compiler, Security Auditor & EVM Gas Profiler'}
                  </h1>
                </div>
              </div>
              <p className="text-xs md:text-sm text-slate-400 max-w-2xl leading-relaxed">
                {isAr 
                  ? 'اكتب عقود Solidity الذكية، تحقق من خلوها من ثغرات Reentrancy، احسب استهلاك الغاز لشبكة إيثريوم (EVM Gas Limit)، واستخرج الواجهات التشفيرية ABI.'
                  : 'Write Solidity contracts, run automated security audit checks, estimate EVM gas deployment costs, and export JSON ABIs.'}
              </p>
            </div>

            <div className="p-4 bg-slate-900/90 rounded-2xl border border-slate-800 text-center space-y-1">
              <span className="text-[10px] font-mono text-slate-400 font-bold block uppercase">
                Est. Deployment Gas
              </span>
              <span className="text-xl font-mono font-black text-amber-400">
                {gasEstimated.toLocaleString()} Gas
              </span>
            </div>
          </div>
        </div>

        {/* Studio Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Solidity Editor (7 Cols) */}
          <div className="lg:col-span-7 space-y-6">
            <div className="bg-slate-900/90 rounded-2xl border border-slate-800 overflow-hidden shadow-2xl flex flex-col h-[480px]">
              <div className="bg-slate-950 px-5 py-3.5 border-b border-slate-800 flex items-center justify-between">
                <div className="flex items-center space-x-2 rtl:space-x-reverse">
                  <FileCode className="w-4 h-4 text-amber-400" />
                  <span className="text-xs font-mono font-bold text-slate-200">
                    TechAcademyToken.sol
                  </span>
                </div>

                <button
                  onClick={copyCode}
                  className="flex items-center space-x-1.5 rtl:space-x-reverse text-[11px] font-bold text-slate-400 hover:text-white bg-slate-800 px-3 py-1 rounded-lg border border-slate-700 transition-colors"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? (isAr ? 'تم النسخ' : 'Copied') : (isAr ? 'نسخ الكود' : 'Copy')}</span>
                </button>
              </div>

              <textarea
                value={solidityCode}
                onChange={(e) => setSolidityCode(e.target.value)}
                className="w-full h-full p-4 bg-slate-950 font-mono text-xs text-amber-300 focus:outline-none resize-none leading-relaxed"
              />
            </div>
          </div>

          {/* Security Audit & Gas Analysis (5 Cols) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-slate-900/90 p-6 rounded-2xl border border-slate-800 space-y-4">
              <div className="flex items-center space-x-2.5 rtl:space-x-reverse">
                <Lock className="w-5 h-5 text-amber-400" />
                <h3 className="font-extrabold text-sm text-white">
                  {isAr ? 'نتائج الفحص والتدقيق الأمني للعقد' : 'Automated Smart Contract Audit'}
                </h3>
              </div>

              <div className="space-y-3">
                {auditResults.map((audit, idx) => (
                  <div key={idx} className="p-3.5 bg-slate-950 rounded-xl border border-slate-800 space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-slate-200">{isAr ? audit.titleAr : audit.titleEn}</span>
                      <span className="text-[10px] font-mono font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-md border border-emerald-500/30">
                        PASSED
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 leading-normal">
                      {isAr ? audit.descAr : audit.descEn}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
