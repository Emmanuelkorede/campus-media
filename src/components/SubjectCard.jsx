

export default function SubjectCard({
  name = "",
  questionCount = 40,
  emoji = "📖",
  selected = false,
  disabled = false,
  onClick,
}) {
  return (
    <button
      onClick={!disabled || selected ? onClick : undefined}
      disabled={disabled && !selected}
      className={`
        relative rounded-2xl p-4 text-left group
        border-2 transition-all duration-300
        active:scale-[0.96] select-none outline-none
        ${
          selected
            ? "border-blue-500 bg-blue-50 shadow-lg shadow-blue-100/50 ring-1 ring-blue-500/20"
            : disabled
            ? "border-slate-100 bg-slate-50/50 opacity-40 cursor-not-allowed grayscale-[0.5]"
            : "border-slate-100 bg-white hover:border-blue-200 hover:shadow-md hover:shadow-slate-200/50 cursor-pointer"
        }
      `}
    >
      {/* Selection Badge */}
      {selected && (
        <span className="absolute -top-2 -right-2
                         w-6 h-6 rounded-full bg-blue-600 
                         flex items-center justify-center shadow-lg
                         animate-in zoom-in duration-200">
          <svg className="w-3.5 h-3.5" viewBox="0 0 12 12" fill="none">
            <path d="M2.5 6L5 8.5L9.5 3.5" stroke="white" strokeWidth="2.5"
                  strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </span>
      )}

      {/* Emoji Icon Container */}
      <div className={`
        w-12 h-12 rounded-xl mb-4
        flex items-center justify-center text-2xl
        transition-all duration-300
        ${selected 
          ? "bg-blue-600 text-white shadow-md shadow-blue-200" 
          : "bg-slate-50 group-hover:bg-blue-50"}
      `}>
        <span className={selected ? "brightness-125" : ""}>{emoji}</span>
      </div>

      {/* Labeling */}
      <div className="space-y-0.5">
        <p className={`
          font-extrabold text-sm tracking-tight leading-tight transition-colors
          ${selected ? "text-blue-700" : "text-slate-800"}
        `}>
          {name}
        </p>

        <p className={`
          text-[10px] font-bold uppercase tracking-widest transition-colors
          ${selected ? "text-blue-500" : "text-slate-400"}
        `}>
          {questionCount} Questions
        </p>
      </div>
    </button>
  );
}