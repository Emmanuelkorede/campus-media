import React, { useState } from 'react';

export default function Calculator({ isOpen, onClose }) {
  const [display, setDisplay] = useState('0');
  const [formula, setFormula] = useState('');

  if (!isOpen) return null;

  const handleClear = () => {
    setDisplay('0');
    setFormula('');
  };

  const handleDel = () => {
    setDisplay(prev => (prev.length > 1 ? prev.slice(0, -1) : '0'));
  };

  const append = (val) => {
    if (display === '0') setDisplay(val);
    else setDisplay(prev => prev + val);
  };

  const calculate = () => {
    try {
      let expr = display;

      // Formatting for JS evaluation
      expr = expr.replace(/×/g, "*").replace(/÷/g, "/");
      expr = expr.replace(/π/g, "Math.PI");
      expr = expr.replace(/\^/g, "**");

      // Math functions (Handles Degrees for Trig)
      expr = expr.replace(/sin\((.*?)\)/g, (_, x) => `Math.sin(${x} * Math.PI/180)`);
      expr = expr.replace(/cos\((.*?)\)/g, (_, x) => `Math.cos(${x} * Math.PI/180)`);
      expr = expr.replace(/tan\((.*?)\)/g, (_, x) => `Math.tan(${x} * Math.PI/180)`);
      expr = expr.replace(/log\((.*?)\)/g, (_, x) => `Math.log10(${x})`);
      expr = expr.replace(/ln\((.*?)\)/g, (_, x) => `Math.log(${x})`);
      expr = expr.replace(/√\((.*?)\)/g, (_, x) => `Math.sqrt(${x})`);

      // Use Function constructor instead of eval for better safety
      const result = new Function(`return ${expr}`)();
      
      setFormula(display + ' =');
      setDisplay(Number.isInteger(result) ? String(result) : result.toFixed(4));
    } catch {
      setDisplay('Error');
    }
  };

  // Button Styles
  const btnBase = "h-12 rounded-xl font-bold text-[13px] transition-all active:scale-95 flex items-center justify-center";
  const numBtn = `${btnBase} bg-slate-100 text-slate-700 hover:bg-slate-200`;
  const opBtn = `${btnBase} bg-blue-50 text-blue-600 hover:bg-blue-100`;
  const sciBtn = `${btnBase} bg-slate-800 text-white hover:bg-slate-700`; // Dark scientific buttons
  const equalBtn = `${btnBase} bg-emerald-600 text-white shadow-lg hover:bg-emerald-700`;

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm" onClick={onClose}>
      <div 
        className="bg-white w-full max-w-[360px] rounded-[2.5rem] shadow-2xl overflow-hidden border border-white"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 pt-6 flex justify-between items-center">
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Scientific Engine</span>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
            <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
              <path d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Display Screen */}
        <div className="px-6 py-6 text-right">
          <div className="text-[11px] font-bold text-blue-500 h-5 truncate uppercase tracking-widest">{formula}</div>
          <div className="text-3xl font-black text-slate-800 truncate tabular-nums leading-none">
            {display}
          </div>
        </div>

        {/* 5-Column Button Grid */}
        <div className="p-4 grid grid-cols-5 gap-2 bg-slate-50/50">
          <button onClick={handleClear} className="h-12 rounded-xl font-bold text-xs bg-rose-50 text-rose-600 hover:bg-rose-100">C</button>
          <button onClick={handleDel} className="h-12 rounded-xl font-bold text-xs bg-slate-200 text-slate-600">⌫</button>
          <button onClick={() => append('(')} className={opBtn}>(</button>
          <button onClick={() => append(')')} className={opBtn}>)</button>
          <button onClick={() => append('÷')} className={opBtn}>÷</button>

          <button onClick={() => append('sin(')} className={sciBtn}>sin</button>
          <button onClick={() => append('cos(')} className={sciBtn}>cos</button>
          <button onClick={() => append('tan(')} className={sciBtn}>tan</button>
          <button onClick={() => append('log(')} className={sciBtn}>log</button>
          <button onClick={() => append('×')} className={opBtn}>×</button>

          <button onClick={() => append('ln(')} className={sciBtn}>ln</button>
          <button onClick={() => append('√(')} className={sciBtn}>√</button>
          <button onClick={() => append('^')} className={sciBtn}>^</button>
          <button onClick={() => append('π')} className={sciBtn}>π</button>
          <button onClick={() => append('-')} className={opBtn}>−</button>

          <button onClick={() => append('7')} className={numBtn}>7</button>
          <button onClick={() => append('8')} className={numBtn}>8</button>
          <button onClick={() => append('9')} className={numBtn}>9</button>
          <button onClick={() => append('%')} className={sciBtn}>%</button>
          <button onClick={() => append('+')} className={opBtn}>+</button>

          <button onClick={() => append('4')} className={numBtn}>4</button>
          <button onClick={() => append('5')} className={numBtn}>5</button>
          <button onClick={() => append('6')} className={numBtn}>6</button>
          <button onClick={calculate} className={`${equalBtn} row-span-2 h-full`}>=</button>
          <button onClick={() => append('.')} className={numBtn}>.</button>

          <button onClick={() => append('1')} className={numBtn}>1</button>
          <button onClick={() => append('2')} className={numBtn}>2</button>
          <button onClick={() => append('3')} className={numBtn}>3</button>
          <button onClick={() => append('0')} className={numBtn}>0</button>
        </div>
      </div>
    </div>
  );
}