/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useRef, useEffect } from 'react';
import Prism from 'prismjs';

// Import Prism CSS tomorrow theme and languages
import 'prismjs/themes/prism-tomorrow.css';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-css';
import 'prismjs/components/prism-markup'; // Markup covers HTML

interface PrismEditorProps {
  value: string;
  onChange: (value: string) => void;
  language: 'html' | 'css' | 'javascript' | 'react';
}

export const PrismEditor: React.FC<PrismEditorProps> = ({ value, onChange, language }) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const preRef = useRef<HTMLPreElement>(null);
  const codeRef = useRef<HTMLElement>(null);
  const lineNumbersRef = useRef<HTMLDivElement>(null);

  // Map challenge category to Prism language name
  const getPrismLangName = (lang: string): string => {
    switch (lang) {
      case 'html':
        return 'markup';
      case 'css':
        return 'css';
      case 'javascript':
        return 'javascript';
      case 'react':
        return 'javascript'; // or jsx if needed
      default:
        return 'javascript';
    }
  };

  const prismLangName = getPrismLangName(language);
  const prismLang = Prism.languages[prismLangName] || Prism.languages.javascript;

  // Handle syncing scroll from textarea to highlight block & line numbers
  const handleScroll = () => {
    const textarea = textareaRef.current;
    const pre = preRef.current;
    const lineNumbers = lineNumbersRef.current;

    if (textarea) {
      if (pre) {
        pre.scrollTop = textarea.scrollTop;
        pre.scrollLeft = textarea.scrollLeft;
      }
      if (lineNumbers) {
        lineNumbers.scrollTop = textarea.scrollTop;
      }
    }
  };

  // Sync scroll on mount and update
  useEffect(() => {
    handleScroll();
  }, [value]);

  // Handle Tab key press in textarea
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      const textarea = textareaRef.current;
      if (!textarea) return;

      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;

      // Insert 2 spaces for tab
      const newValue = value.substring(0, start) + '  ' + value.substring(end);
      onChange(newValue);

      // Reset selection position
      setTimeout(() => {
        textarea.selectionStart = textarea.selectionEnd = start + 2;
      }, 0);
    }
  };

  // Dynamic lines array based on code
  const lines = value.split('\n');
  const totalLines = Math.max(lines.length, 1);

  // Generate highlighted HTML
  const highlightedHtml = Prism.highlight(value, prismLang, prismLangName);

  // Inline styles to guarantee pixel-perfect overlapping alignment
  const sharedStyles: React.CSSProperties = {
    fontFamily: 'var(--font-mono), ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
    fontSize: '13px',
    lineHeight: '24px',
    padding: '16px',
    margin: 0,
    border: 'none',
    boxSizing: 'border-box',
  };

  return (
    <div className="relative flex-grow flex bg-slate-950 font-mono text-sm leading-relaxed text-slate-200 min-h-[300px]" id="prism-editor-container">
      {/* Dynamic Line Gutter */}
      <div 
        ref={lineNumbersRef}
        className="w-12 bg-slate-950/80 border-r border-slate-800/80 text-slate-600 select-none text-right pr-3 pt-4 font-mono text-xs overflow-hidden h-[350px] space-y-0"
        id="prism-editor-gutter"
        style={{ scrollbarWidth: 'none' }}
      >
        {Array.from({ length: totalLines }).map((_, i) => (
          <div key={i} className="h-6 leading-6 font-mono text-xs text-slate-600">{i + 1}</div>
        ))}
      </div>

      {/* Code Textarea & Highlight pre Container */}
      <div className="relative flex-grow h-[350px] overflow-hidden bg-slate-950" id="prism-editor-fields">
        {/* Underlay highlighted text */}
        <pre
          ref={preRef}
          className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-auto whitespace-pre scrollbar-thin scrollbar-thumb-slate-800 bg-transparent"
          style={sharedStyles}
          id="prism-editor-pre"
        >
          <code 
            ref={codeRef}
            className={`language-${prismLangName} block`}
            style={{
              fontFamily: 'inherit',
              fontSize: 'inherit',
              lineHeight: 'inherit',
              background: 'none',
              padding: 0,
            }}
            dangerouslySetInnerHTML={{ __html: highlightedHtml + '\n' }}
          />
        </pre>

        {/* Overlay transparent typing area */}
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onScroll={handleScroll}
          onKeyDown={handleKeyDown}
          dir="ltr"
          spellCheck={false}
          className="absolute top-0 left-0 w-full h-full bg-transparent focus:outline-none resize-none text-transparent caret-amber-500 selection:bg-amber-500/25 overflow-auto whitespace-pre"
          style={sharedStyles}
          id="prism-editor-textarea"
        />
      </div>
    </div>
  );
};
