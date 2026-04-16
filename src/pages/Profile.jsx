import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import EditProfile from "../components/Editprofile"; 
import HelpSupport from "../components/helpsupport";

export default function Profile() {
  const { user, logout } = useAuth();
  const [view, setView] = useState("menu"); 

  const goBack = () => setView("menu");

  if (view === "edit") return <EditProfile onBack={goBack} />;
  if (view === "help") return <HelpSupport onBack={goBack} />;

  return (
    <div className="max-w-2xl mx-auto p-4 pb-24 animate-in fade-in duration-500">
      <div className="bg-blue-700 rounded-[2.5rem] p-10 text-white text-center shadow-xl mb-6 relative overflow-hidden">
        <div className="relative z-10">
          <div className="w-20 h-20 bg-white/20 backdrop-blur-md rounded-3xl flex items-center justify-center text-3xl font-black mx-auto mb-4 border border-white/30">
            {user?.name?.[0].toUpperCase()}
          </div>
          <h1 className="text-2xl font-black mb-1">{user?.name}</h1>
          <p className="text-blue-200 text-xs font-bold uppercase tracking-widest opacity-70">
            {user?.stream || 'N/A'} Student
          </p>
        </div>
        {/* Aesthetic background glow */}
        <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/10 rounded-full blur-3xl"></div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-8">
        <StatBox label="CBTs Taken" value="0" icon="📝" />
        <StatBox label="Avg Score" value="0.0%" icon="📈" />
      </div>

      <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden mb-6">
        <MenuItem icon="👤" label="Edit Profile" onClick={() => setView("edit")} />
        <MenuItem icon="❓" label="Help & Support" onClick={() => setView("help")} />
        <div className="p-5 bg-slate-50/50 flex items-center gap-4 border-t border-slate-50">
          <span className="text-xl">🚀</span>
          <span className="text-sm font-bold text-slate-400 italic">More features coming soon...</span>
        </div>
      </div>

      <button 
        onClick={logout}
        className="w-full bg-white border border-slate-100 p-5 rounded-[1.5rem] flex items-center gap-4 text-rose-500 font-bold hover:bg-rose-50 transition-colors shadow-sm active:scale-95"
      >
        <span className="text-xl">🚪</span> Sign Out
      </button>

      <p className="text-center text-[10px] text-slate-300 font-bold uppercase tracking-widest mt-10">
        CAMPUS MEDIA CBT • v4.2.0-stable
      </p>
    </div>
  );
}

function StatBox({ label, value, icon }) {
  return (
    <div className="bg-white p-6 rounded-[2rem] border border-slate-100 flex flex-col items-center gap-2 shadow-sm">
      <div className="text-2xl mb-1">{icon}</div>
      <p className="text-2xl font-black text-slate-900 leading-none">{value}</p>
      <p className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">{label}</p>
    </div>
  );
}

function MenuItem({ icon, label, onClick }) {
  return (
    <button onClick={onClick} className="w-full p-5 flex items-center justify-between hover:bg-slate-50 border-b border-slate-50 last:border-0 transition-colors text-left">
      <div className="flex items-center gap-4">
        <span className="text-xl">{icon}</span>
        <span className="text-sm font-bold text-slate-700">{label}</span>
      </div>
      <span className="text-slate-300">❯</span>
    </button>
  );
}