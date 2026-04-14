
const STATE_STYLES = {
  idle: {
    wrap:   "border-slate-100 bg-white text-slate-700 hover:border-blue-300 hover:shadow-lg hover:shadow-slate-200/50 hover:bg-blue-50/30",
    badge:  "bg-slate-100 text-slate-500 group-hover:bg-blue-100 group-hover:text-blue-600",
    icon:   null,
  },
  selected: {
    wrap:   "border-blue-600 bg-blue-50 text-blue-900 shadow-xl shadow-blue-100/50 ring-1 ring-blue-600/20",
    badge:  "bg-blue-600 text-white shadow-md shadow-blue-200",
    icon:   null,
  },
  correct: {
    wrap:   "border-emerald-500 bg-emerald-50 text-emerald-900 shadow-sm shadow-emerald-100",
    badge:  "bg-emerald-500 text-white",
    icon:   "check",
  },
  wrong: {
    wrap:   "border-rose-500 bg-rose-50 text-rose-900 shadow-sm shadow-rose-100",
    badge:  "bg-rose-500 text-white",
    icon:   "cross",
  },
  dimmed: {
    wrap:   "border-slate-50 bg-slate-50/50 text-slate-400 opacity-50 grayscale-[0.3]",
    badge:  "bg-slate-200 text-slate-400",
    icon:   null,
  },
};

function CheckIcon() {
  return (
    <div className="w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center ml-auto shrink-0 shadow-sm animate-in zoom-in duration-300">
      <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={4}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
      </svg>
    </div>
  );
}

function CrossIcon() {
  return (
    <div className="w-6 h-6 rounded-full bg-rose-500 flex items-center justify-center ml-auto shrink-0 shadow-sm animate-in zoom-in duration-300">
      <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={4}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
      </svg>
    </div>
  );
}

export default function AnswerOption({
  letter = "A",
  text = "",
  state = "idle",
  onClick,
  disabled = false,
}) {
  const styles = STATE_STYLES[state] ?? STATE_STYLES.idle;

  return (
    <button
      onClick={!disabled ? onClick : undefined}
      disabled={disabled}
      className={`
        group flex items-center gap-4 w-full text-left
        border-2 rounded-[1.25rem] px-5 py-4
        transition-all duration-200
        active:scale-[0.98] outline-none
        ${styles.wrap}
        ${disabled ? "cursor-default" : "cursor-pointer"}
      `}
    >
      
      <span
        className={`
          w-9 h-9 rounded-xl shrink-0
          flex items-center justify-center
          text-sm font-black tracking-tight
          transition-all duration-200
          ${styles.badge}
          ${state === 'selected' ? 'scale-110' : ''}
        `}
      >
        {letter}
      </span>

      
      <span className={`
        flex-1 text-sm sm:text-base font-bold leading-relaxed transition-colors
        ${state === 'idle' ? 'text-slate-700' : ''}
      `}>
        {text}
      </span>

      
      {state === "correct" && <CheckIcon />}
      {state === "wrong"   && <CrossIcon />}
      
      
      {state === "selected" && (
        <div className="w-2 h-2 rounded-full bg-blue-600 animate-pulse ml-auto" />
      )}
    </button>
  );
}