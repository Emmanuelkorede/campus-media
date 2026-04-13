
export default function StreamCard({
  title = "",
  description = "",
  subjects = [],
  emoji = "📚",
  selected = false,
  onClick,
}) {
  return (
    <button
      onClick={onClick}
      className={`
        w-full text-left rounded-3xl p-6
        border-2 transition-all duration-300
        active:scale-[0.97] select-none group
        ${
          selected
            ? "border-blue-500 bg-blue-50 shadow-xl shadow-blue-100/50"
            : "border-slate-100 bg-white hover:border-blue-200 hover:shadow-lg hover:shadow-slate-200/40"
        }
      `}
    >
      <div className="flex items-start gap-5">

        {/* Emoji / Icon Container */}
        <div className={`
          w-14 h-14 rounded-2xl shrink-0
          flex items-center justify-center text-3xl
          transition-all duration-300
          ${selected 
            ? "bg-blue-600 shadow-lg shadow-blue-200 transform scale-105" 
            : "bg-slate-50 group-hover:bg-blue-50"}
        `}>
          <span className={selected ? "brightness-110" : ""}>{emoji}</span>
        </div>

        {/* Text block */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1.5">
            <h3 className={`font-black text-xl tracking-tight leading-none transition-colors ${
              selected ? "text-blue-700" : "text-slate-800"
            }`}>
              {title}
            </h3>

            {/* Selected checkmark badge */}
            {selected && (
              <span className="inline-flex items-center justify-center
                               w-6 h-6 rounded-full bg-blue-600 shrink-0 shadow-sm animate-in zoom-in duration-300">
                <svg className="w-3.5 h-3.5" viewBox="0 0 12 12" fill="none">
                  <path d="M2.5 6L5 8.5L9.5 3.5" stroke="white" strokeWidth="2.5"
                        strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </span>
            )}
          </div>

          <p className={`text-sm mb-4 leading-relaxed font-medium transition-colors ${
            selected ? "text-blue-600/80" : "text-slate-500"
          }`}>
            {description}
          </p>

          {/* Subject tags */}
          <div className="flex flex-wrap gap-2">
            {subjects.map((sub) => (
              <span
                key={sub}
                className={`
                  text-[10px] font-extrabold uppercase tracking-widest px-2.5 py-1 rounded-lg
                  border transition-all
                  ${
                    selected
                      ? "bg-blue-100 text-blue-700 border-blue-200"
                      : "bg-slate-50 text-slate-500 border-slate-100 group-hover:border-blue-100"
                  }
                `}
              >
                {sub}
              </span>
            ))}
          </div>
        </div>
      </div>
    </button>
  );
}