import { useState } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "../../context/AuthContext";
import Footer from "../../components/Footer";

// ─────────────────────────────────────────────
//  ADMIN LOGIN PAGE
// ─────────────────────────────────────────────

export default function AdminLogin() {
  const { adminLogin, user } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (user?.role === "admin") {
    navigate("/admin/dashboard", { replace: true });
    return null;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const { success, error: err } = await adminLogin(name, password);

    setLoading(false);
    if (success) {
      navigate("/admin/dashboard", { replace: true });
    } else {
      setError(err ?? "Invalid administrative credentials.");
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#0f172a] relative overflow-hidden font-sans">
      
      {/* ── Background Ambience ─────────────── */}
      <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-48 -right-48 w-[32rem] h-[32rem] rounded-full bg-blue-900/20 blur-[120px]" />
        <div className="absolute -bottom-48 -left-48 w-[32rem] h-[32rem] rounded-full bg-indigo-900/10 blur-[120px]" />
      </div>

      <main className="relative flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">

          {/* ── Login Card ────────────────────── */}
          <div className="bg-slate-900/50 backdrop-blur-2xl rounded-[2.5rem] border border-slate-800 shadow-2xl overflow-hidden">
            
            {/* Top Indicator */}
            <div className="h-1 bg-gradient-to-r from-blue-600 via-indigo-500 to-blue-400" />

            <div className="px-8 pt-10 pb-12">
              
              {/* Back to Home */}
              <button
                onClick={() => navigate("/")}
                className="group flex items-center gap-2 text-slate-500 hover:text-blue-400 text-xs font-black uppercase tracking-widest mb-10 transition-all"
              >
                <div className="w-6 h-6 rounded-full bg-slate-800 flex items-center justify-center group-hover:bg-blue-950 transition-colors">
                   <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd"/>
                  </svg>
                </div>
                Return to Site
              </button>

              {/* Identity Section */}
              <div className="flex flex-col items-center mb-10">
                <div className="w-16 h-16 rounded-3xl bg-blue-600 shadow-2xl shadow-blue-900/50 flex items-center justify-center mb-6 border-b-4 border-blue-800">
                  <span className="text-white font-black text-2xl tracking-tighter italic">CM</span>
                </div>

                <div className="px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 mb-4">
                  <span className="text-[10px] font-black uppercase tracking-[0.25em] text-blue-400">
                    Control Panel
                  </span>
                </div>

                <h1 className="text-2xl font-black text-white text-center tracking-tight">
                  Admin <span className="text-slate-400 font-medium">Authentication</span>
                </h1>
              </div>

              {/* ── FORM ─────────────────────────── */}
              <form onSubmit={handleSubmit} className="space-y-5" noValidate>
                
                {/* Admin ID */}
                <div className="space-y-2">
                  <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">
                    Administrative ID
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Username"
                    autoComplete="username"
                    required
                    className="w-full bg-slate-800/50 border border-slate-700 text-white placeholder-slate-600 font-bold text-sm px-5 py-4 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all"
                  />
                </div>

                {/* Password */}
                <div className="space-y-2">
                  <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">
                    Passkey
                  </label>
                  <div className="relative">
                    <input
                      type={showPw ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      autoComplete="current-password"
                      required
                      className="w-full bg-slate-800/50 border border-slate-700 text-white placeholder-slate-600 font-bold text-sm px-5 py-4 pr-14 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPw((v) => !v)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-blue-400 transition-colors"
                    >
                      {showPw ? (
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"/></svg>
                      ) : (
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg>
                      )}
                    </button>
                  </div>
                </div>

                {/* Feedback */}
                {error && (
                  <div className="flex items-center gap-3 bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-bold px-5 py-4 rounded-2xl animate-in fade-in slide-in-from-top-2">
                    <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z"/></svg>
                    {error}
                  </div>
                )}

                {/* Login Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-blue-600 hover:bg-blue-500 active:scale-[0.98] disabled:opacity-50 text-white font-black py-4.5 rounded-2xl shadow-xl shadow-blue-900/30 transition-all duration-200 flex items-center justify-center gap-3 mt-4"
                >
                  {loading ? (
                    <div className="w-5 h-5 rounded-full border-3 border-white/20 border-t-white animate-spin" />
                  ) : (
                    <>
                      <span>Sign into Dashboard</span>
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" /></svg>
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>

          <p className="text-center text-[10px] text-slate-600 mt-8 font-black uppercase tracking-[0.4em]">
            Authorized Personnel Only
          </p>
        </div>
      </main>

      <Footer />
    </div>
  );
}