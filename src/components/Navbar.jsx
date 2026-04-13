import { useState } from "react";
import { Link } from "react-router";

// ─────────────────────────────────────────────
//  NAVBAR COMPONENT
// ─────────────────────────────────────────────

export default function Navbar({ username = null, onLogout, showLogout = true }) {
  const [profileOpen, setProfileOpen] = useState(false);

  const initial = username ? username[0].toUpperCase() : "C";

  return (
    <>
      {/* ── TOP NAVIGATION ────────────────────────── */}
      <nav className="fixed top-0 left-0 right-0 z-[100] h-18
                      bg-white/80 backdrop-blur-2xl
                      border-b border-slate-200/60 shadow-sm shadow-slate-200/20">
        <div className="max-w-5xl mx-auto h-full px-6
                        flex items-center justify-between">

          {/* Logo & Brand */}
          <Link to="/" className="flex items-center gap-3 select-none group">
            {/* LOGO PLACEHOLDER */}
<svg width="80" height="80" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">

  {/* Graduation Cap Base */}

  <path d="M10 45L50 25L90 45L50 65L10 45Z" fill="#2563eb" />

  <path d="M25 53V70C25 70 35 75 50 75C65 75 75 70 75 70V53" stroke="#1d4ed8" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />

  

  {/* Tassel */}

  <path d="M90 45V65M87 65H93V75L90 80L87 75V65Z" stroke="#10b981" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />



  {/* Camera Aperture / Lens (The "Media" Element) */}

  <circle cx="50" cy="45" r="18" fill="white" stroke="#1e293b" strokeWidth="2" />

  <circle cx="50" cy="45" r="12" stroke="#f59e0b" strokeWidth="3" strokeDasharray="6 4" />

  <circle cx="50" cy="45" r="4" fill="#1e293b" />

</svg>

            <div className="flex flex-col">
              <span className="font-black text-lg tracking-tight text-slate-800 leading-none">
                Campus<span className="text-blue-600">Media</span>
              </span>
              <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">
                CBT Solution
              </span>
            </div>
          </Link>

          {/* Actions / Profile Trigger */}
          <div className="flex items-center gap-4">
            {username && (
              <div className="hidden md:flex flex-col items-end">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-tighter leading-none">Student</span>
                <span className="text-sm font-extrabold text-slate-700 leading-tight">{username}</span>
              </div>
            )}

            <button
              onClick={() => setProfileOpen(true)}
              className="w-10 h-10 rounded-full bg-slate-100 border-2 border-white shadow-sm
                         flex items-center justify-center overflow-hidden
                         hover:border-blue-200 hover:bg-blue-50 transition-all 
                         active:scale-95 cursor-pointer"
            >
              <span className="text-blue-600 font-black text-sm">{initial}</span>
            </button>
          </div>
        </div>
      </nav>

      {/* Spacer */}
      <div className="h-18" />

      {/* ── SIDEBAR DRAWER ────────────────────────── */}
      {profileOpen && (
        <div className="fixed inset-0 z-[200] flex justify-end">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-md animate-in fade-in duration-300"
            onClick={() => setProfileOpen(false)}
          />

          {/* Panel */}
          <aside
            className="relative z-10 w-85 max-w-[85vw] h-full
                       bg-white shadow-[-20px_0_50px_rgba(0,0,0,0.1)] 
                       flex flex-col animate-in slide-in-from-right duration-300"
          >
            {/* Header / User Info */}
            <div className="p-8 pb-6 flex flex-col items-center">
              <div className="w-full flex justify-end mb-2">
                <button 
                  onClick={() => setProfileOpen(false)}
                  className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 hover:text-slate-600 transition-colors"
                >
                  ✕
                </button>
              </div>

              {/* LOGO PLACEHOLDER (LARGE) */}
<svg width="80" height="80" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">

  {/* Graduation Cap Base */}

  <path d="M10 45L50 25L90 45L50 65L10 45Z" fill="#2563eb" />

  <path d="M25 53V70C25 70 35 75 50 75C65 75 75 70 75 70V53" stroke="#1d4ed8" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />

  

  {/* Tassel */}

  <path d="M90 45V65M87 65H93V75L90 80L87 75V65Z" stroke="#10b981" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />



  {/* Camera Aperture / Lens (The "Media" Element) */}

  <circle cx="50" cy="45" r="18" fill="white" stroke="#1e293b" strokeWidth="2" />

  <circle cx="50" cy="45" r="12" stroke="#f59e0b" strokeWidth="3" strokeDasharray="6 4" />

  <circle cx="50" cy="45" r="4" fill="#1e293b" />

</svg>

              <h2 className="text-2xl font-black text-slate-800 tracking-tight">
                Campus<span className="text-blue-600">Media</span>
              </h2>
              <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] mt-1">
                Official Exam Client
              </p>
            </div>

            <div className="flex-1 px-8 space-y-6 overflow-y-auto">
              {/* Account Status Card */}
              {username && (
                <div className="bg-slate-50 rounded-3xl p-5 border border-slate-100">
                  <div className="flex items-center gap-3 mb-1">
                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Active Session</span>
                  </div>
                  <p className="text-lg font-black text-slate-700">{username}</p>
                </div>
              )}

              {/* Menu Actions */}
              <div className="space-y-3">
                <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest px-2">Community</p>
                <a
                  href="https://whatsapp.com/channel/0029VbC4wVsFSAtDYpEvzd1N" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center gap-3 bg-emerald-500 hover:bg-emerald-600 
                             text-white font-bold py-4 px-5 rounded-2xl transition-all
                             shadow-lg shadow-emerald-100 active:scale-[0.98]"
                >
                  <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                  </svg>
                  Join Community
                </a>

                {showLogout && onLogout && (
                  <button
                    onClick={() => { onLogout(); setProfileOpen(false); }}
                    className="w-full flex items-center justify-center gap-2 border-2 border-slate-100 text-slate-500
                               hover:bg-rose-50 hover:text-rose-500 hover:border-rose-100 transition-all
                               font-bold py-4 px-5 rounded-2xl active:scale-[0.98]"
                  >
                    Sign Out
                  </button>
                )}
              </div>
            </div>

            {/* Footer */}
            <div className="p-8 pt-0 mt-auto">
              <div className="border-t border-slate-100 pt-6 text-center">
                <p className="text-[9px] text-slate-300 font-black uppercase tracking-[0.3em]">
                  Build 2026.04 — CBT v4
                </p>
              </div>
            </div>
          </aside>
        </div>
      )}
    </>
  );
}