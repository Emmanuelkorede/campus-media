
export default function Footer() {
  return (
    <footer className="w-full mt-auto py-8 px-6 border-t border-slate-100 bg-white/40 backdrop-blur-md">
      <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        
        
        <div className="flex items-center gap-3">
          <div className="w-6 h-6 rounded-lg bg-blue-600 flex items-center justify-center shrink-0 shadow-sm shadow-blue-100">
             <span className="text-white font-black text-[8px]">CM</span>
          </div>
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
            Honorable <span className="mx-2 text-slate-200">|</span> 
            <span className="text-slate-600">
              Campus<span className="text-blue-600">Media</span>
            </span>
          </p>
        </div>


        <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
          <p className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">
            © {new Date().getFullYear()} CBT Solution
          </p>
          

          <div className="hidden sm:block h-3 w-px bg-slate-100" />
          
          <div className="flex items-center gap-4">
            <span className="text-[9px] font-black text-blue-500/50 uppercase tracking-tighter bg-blue-50 px-2 py-0.5 rounded-md">
              v4.2.0-stable
            </span>
          </div>
        </div>

      </div>
    </footer>
  );
}