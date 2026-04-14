
import { useState } from "react";
import { useNavigate, useLocation } from "react-router";
import { useAuth } from "../context/AuthContext";
import Footer from "../components/Footer";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const from = location.state?.from?.pathname ?? "/stream";

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const { success, error: err } = await login(name, password);

    setLoading(false);
    if (success) {
      navigate(from, { replace: true });
    } else {
      setError(err ?? "Something went wrong.");
    }
  }

  return (
    
    <div className="h-screen flex flex-col bg-slate-50 relative overflow-hidden font-sans">
      

      <div aria-hidden className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-[0.02]">
        <div className="w-[70vh] h-[70vh] border-[1px] border-blue-900 rounded-full flex items-center justify-center" />
      </div>

      <main className="relative flex-1 flex items-center justify-center px-4">
        <div className="w-full max-w-sm">

          <div className="bg-white rounded-2xl border border-slate-200 shadow-xl shadow-slate-200/50 overflow-hidden">
            
            
            <div className="h-1.5 bg-blue-600" />

            <div className="px-8 pt-6 pb-8">
              
              <button
                onClick={() => navigate("/")}
                className="w-8 h-8 rounded-lg bg-slate-100 text-slate-500 hover:bg-blue-50 hover:text-blue-600 flex items-center justify-center mb-6 transition-all"
              >
                <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd"/>
                </svg>
              </button>

              
              <div className="flex flex-col items-center mb-6">
                <div className="mb-4">

                   <svg width="80" height="80" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M10 45L50 25L90 45L50 65L10 45Z" fill="#2563eb" />
  <path d="M25 53V70C25 70 35 75 50 75C65 75 75 70 75 70V53" stroke="#1d4ed8" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
  
  <path d="M90 45V65M87 65H93V75L90 80L87 75V65Z" stroke="#10b981" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />

  <circle cx="50" cy="45" r="18" fill="white" stroke="#1e293b" strokeWidth="2" />
  <circle cx="50" cy="45" r="12" stroke="#f59e0b" strokeWidth="3" strokeDasharray="6 4" />
  <circle cx="50" cy="45" r="4" fill="#1e293b" />
</svg>
                </div>

                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-blue-600 bg-blue-50 px-3 py-1 rounded-md mb-2">
                  Secure Access
                </span>
                <h1 className="text-xl font-extrabold text-slate-900">Sign in to Practice</h1>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4" noValidate>
                
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-1.5 ml-1">
                    Username
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your full name"
                    className="w-full bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 font-medium text-sm px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                  />
                </div>

                
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-1.5 ml-1">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPw ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 font-medium text-sm px-4 py-3 pr-12 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPw((v) => !v)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-blue-600 transition-colors"
                    >
                      {showPw ? (
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" /></svg>
                      ) : (
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                      )}
                    </button>
                  </div>
                </div>

                {error && (
                  <div className="flex items-center gap-2 bg-red-50 border border-red-100 text-red-600 text-[13px] font-semibold px-4 py-3 rounded-xl">
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-blue-600 hover:bg-blue-700 active:scale-[0.99] disabled:opacity-70 text-white font-bold py-4 rounded-xl shadow-lg shadow-blue-200 transition-all flex items-center justify-center gap-2"
                >
                  {loading ? <span className="w-5 h-5 rounded-full border-2 border-white/30 border-t-white animate-spin" /> : "Start Practice"}
                </button>
              </form>

              <p className="text-center text-[11px] text-slate-400 font-medium mt-6">
                JAMB 2026 Examination Preparation Portal
              </p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}