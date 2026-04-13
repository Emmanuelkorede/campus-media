

export default function SubmitModal({
  open = false,
  answered = 0,
  total = 40,
  onConfirm,
  onCancel,
}) {
  if (!open) return null;

  const unanswered = total - answered;
  const allAnswered = unanswered === 0;
  const pct = total > 0 ? Math.round((answered / total) * 100) : 0;

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center px-4"
      onClick={onCancel}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md transition-opacity animate-in fade-in duration-300" />

      {/* Modal Card */}
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative z-10 w-full max-w-sm bg-white rounded-[2rem] shadow-2xl overflow-hidden"
        style={{ 
            animation: "modalSpring 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275) both" 
        }}
      >
        {/* Progress Indicator Band */}
        <div className={`h-1.5 w-full transition-colors duration-500 ${allAnswered ? "bg-emerald-500" : "bg-blue-600"}`} />

        <div className="px-8 pt-8 pb-8">
          {/* Status Icon */}
          <div className={`
            w-16 h-16 rounded-2xl mx-auto mb-6
            flex items-center justify-center
            ${allAnswered ? "bg-emerald-50 text-emerald-600" : "bg-blue-50 text-blue-600"}
          `}>
            {allAnswered ? (
              <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            ) : (
              <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
              </svg>
            )}
          </div>

          <div className="text-center mb-6">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-2">
              Final Submission
            </p>
            <h2 className="font-extrabold text-2xl text-slate-800 tracking-tight">
              Ready to submit?
            </h2>
          </div>

          {/* Stats Summary Panel */}
          <div className="bg-slate-50 rounded-[1.5rem] p-5 mb-6 border border-slate-100">
            <div className="flex justify-between items-end mb-3">
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Completion</p>
                <p className="text-sm font-black text-slate-700">
                  {answered} <span className="text-slate-400 font-medium">/ {total} Questions</span>
                </p>
              </div>
              <p className={`text-xl font-black ${allAnswered ? "text-emerald-600" : "text-blue-600"}`}>
                {pct}%
              </p>
            </div>

            {/* Micro Progress Bar */}
            <div className="w-full h-2.5 bg-slate-200 rounded-full overflow-hidden mb-4">
              <div
                className={`h-full rounded-full transition-all duration-700 ease-out ${
                  allAnswered ? "bg-emerald-500" : "bg-blue-600"
                }`}
                style={{ width: `${pct}%` }}
              />
            </div>

            {/* Contextual Warning */}
            <div className={`
              text-[11px] font-bold py-2.5 px-3 rounded-xl border flex items-center justify-center gap-2
              ${allAnswered 
                ? "bg-emerald-50 text-emerald-700 border-emerald-100" 
                : "bg-blue-50 text-blue-700 border-blue-100"}
            `}>
              {allAnswered ? (
                <span>Excellent! You've tackled every question.</span>
              ) : (
                <span>Note: {unanswered} questions are still empty.</span>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="space-y-3">
            <button
              onClick={onConfirm}
              className={`w-full py-4 rounded-2xl text-white font-bold transition-all active:scale-[0.97] shadow-xl ${
                allAnswered 
                  ? "bg-emerald-500 hover:bg-emerald-600 shadow-emerald-100" 
                  : "bg-blue-600 hover:bg-blue-700 shadow-blue-100"
              }`}
            >
              Confirm Submission
            </button>

            <button
              onClick={onCancel}
              className="w-full py-3.5 rounded-2xl text-slate-500 font-bold hover:bg-slate-100 transition-colors"
            >
              Keep Reviewing
            </button>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes modalSpring {
          0% { transform: scale(0.9) translateY(30px); opacity: 0; }
          100% { transform: scale(1) translateY(0); opacity: 1; }
        }
      `}</style>
    </div>
  );
}