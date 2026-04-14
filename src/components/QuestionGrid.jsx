export default function QuestionGrid({
  questions = [],     
  subjectNames = [],  
  currentIndex = 0,
  answeredSet = new Set(),
  onJump,
  onClose,
  open = false,
}) {
  if (!open) return null;

  const total = questions.length;
  const answered = answeredSet.size;
  const unanswered = total - answered;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6" onClick={onClose}>
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md transition-opacity" />

      <div
        onClick={(e) => e.stopPropagation()}
        className="relative z-10 w-full max-w-md bg-white rounded-3xl shadow-2xl flex flex-col overflow-hidden"
        style={{ 
          maxHeight: '85vh', 
          animation: "panelIn 0.35s cubic-bezier(0.16, 1, 0.3, 1)" 
        }}
      >
        <div className="px-6 pt-6 pb-4 border-b border-slate-100">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-extrabold text-slate-800 text-lg tracking-tight">Exam Navigator</h3>
            <button 
              onClick={onClose} 
              className="w-8 h-8 rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 flex items-center justify-center transition-colors"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <p className="text-[11px] text-slate-400 font-bold uppercase tracking-widest">Jump to any section of the test</p>
        </div>

        <div className="px-6 py-4 bg-slate-50/50 grid grid-cols-3 gap-2 border-b border-slate-100">
          <div className="flex flex-col items-center p-2 rounded-xl bg-white border border-slate-100 shadow-sm">
            <span className="text-blue-600 font-black text-sm">{answered}</span>
            <span className="text-[9px] text-slate-400 font-bold uppercase tracking-tighter">Answered</span>
          </div>
          <div className="flex flex-col items-center p-2 rounded-xl bg-white border border-slate-100 shadow-sm">
            <span className="text-slate-400 font-black text-sm">{unanswered}</span>
            <span className="text-[9px] text-slate-400 font-bold uppercase tracking-tighter">Remaining</span>
          </div>
          <div className="flex flex-col items-center p-2 rounded-xl bg-blue-600 shadow-lg shadow-blue-100">
            <span className="text-white font-black text-sm">{currentIndex + 1}</span>
            <span className="text-[9px] text-blue-100 font-bold uppercase tracking-tighter">Current</span>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6 scrollbar-hide">
          {subjectNames.map((subj) => (
            <div key={subj} className="mb-8 last:mb-0">
              <h4 className="text-[10px] font-black text-blue-600 uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-600"></span>
                {subj}
              </h4>
              
              <div className="grid grid-cols-5 gap-3">
                {questions.map((q, i) => {
                  if (q.subject !== subj) return null;

                  const isCurrent = i === currentIndex;
                  const isAnswered = answeredSet.has(i);

                  return (
                    <button
                      key={i}
                      onClick={() => { 
                        onJump && onJump(i); 
                        onClose && onClose(); 
                      }}
                      className={`
                        h-11 rounded-xl font-bold text-xs 
                        flex items-center justify-center 
                        transition-all duration-200 
                        active:scale-90 
                        ${
                          isCurrent
                            ? "ring-2 ring-blue-600 bg-blue-50 text-blue-700 shadow-inner"
                            : isAnswered
                            ? "bg-slate-800 text-white shadow-md shadow-slate-200"
                            : "border-2 border-slate-100 bg-white text-slate-400 hover:border-blue-200 hover:text-blue-600"
                        }
                      `}
                    >
                      {i + 1}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        <div className="p-4 text-center bg-slate-50 border-t border-slate-100">
          <p className="text-[10px] text-slate-400 font-medium">Review your progress before final submission.</p>
        </div>
      </div>

      <style>{`
        @keyframes panelIn {
          from { transform: scale(0.95) translateY(20px); opacity: 0; }
          to   { transform: scale(1) translateY(0); opacity: 1; }
        }
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
}