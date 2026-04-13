
export default function ProgressBar({
  answered = 0,
  total = 40,
  showLabel = true,
}) {
  const pct = total > 0 ? Math.round((answered / total) * 100) : 0;

  // Dynamic color logic: Standard Blue -> Success Emerald
  function barColor() {
    if (pct === 100) return "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)]";
    return "bg-blue-600 shadow-[0_0_8px_rgba(37,99,235,0.3)]";
  }

  return (
    <div className="w-full">
      {/* ── Track Container ─────────────────────── */}
      <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden border border-slate-200/50">
        <div
          className={`h-full rounded-full transition-all duration-700 ease-in-out ${barColor()}`}
          style={{ width: `${pct}%` }}
          role="progressbar"
          aria-valuenow={answered}
          aria-valuemin={0}
          aria-valuemax={total}
        />
      </div>

      {/* ── Label & Percentage ──────────────────── */}
      {showLabel && (
        <div className="flex justify-between items-center mt-2 px-0.5">
          <div className="flex items-center gap-1.5">
            <div className={`w-1.5 h-1.5 rounded-full ${pct === 100 ? 'bg-emerald-500' : 'bg-blue-600'}`} />
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
              Progress
            </p>
          </div>
          
          <p className="text-[11px] font-bold text-slate-500 tabular-nums">
            <span className={pct === 100 ? "text-emerald-600" : "text-blue-700"}>
              {answered}
            </span>
            <span className="mx-1 text-slate-300">/</span>
            {total} <span className="text-slate-400 font-medium">answered</span>
          </p>
        </div>
      )}
    </div>
  );
}