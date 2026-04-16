import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { supabase } from "../lib/supabase";

export default function EditProfile({ onBack }) {
  const { user } = useAuth();
  const [name, setName] = useState(user?.name || "");
  const [password, setPassword] = useState("");
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState({ type: "", msg: "" }); // Professional notification state

  const handleUpdate = async () => {
    setSaving(true);
    setStatus({ type: "", msg: "" });

    try {
      // 1. Update Name in the Database
      const { error: dbError } = await supabase
        .from("users")
        .update({ name })
        .eq("id", user.id);

      if (dbError) throw dbError;

      // 2. Update Password via Supabase Auth (if provided)
      if (password) {
        const { error: authError } = await supabase.auth.updateUser({ password });
        if (authError) throw authError;
      }

      setStatus({ type: "success", msg: "Profile updated successfully!" });
      setTimeout(() => onBack(), 1500);
    } catch (error) {
      setStatus({ type: "error", msg: error.message });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4 animate-in slide-in-from-right duration-300">
      <button onClick={onBack} className="mb-8 text-slate-400 font-bold flex items-center gap-2 hover:text-slate-600 transition-colors">
        <span className="text-lg">←</span> Edit Profile
      </button>
      
      <div className="space-y-6">
        {/* Inline Notification */}
        {status.msg && (
          <div className={`p-4 rounded-2xl text-xs font-bold uppercase tracking-wider text-center animate-bounce ${
            status.type === "success" ? "bg-emerald-50 text-emerald-600" : "bg-rose-50 text-rose-600"
          }`}>
            {status.msg}
          </div>
        )}

        <div className="relative border border-slate-200 rounded-2xl p-5 bg-white">
          <label className="absolute -top-2 left-4 bg-white px-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">Full Name</label>
          <input 
            type="text" value={name} onChange={e => setName(e.target.value)}
            className="w-full bg-transparent outline-none text-sm font-bold text-slate-800 pt-1"
          />
        </div>

        <div className="relative border border-slate-200 rounded-2xl p-5 bg-white">
          <label className="absolute -top-2 left-4 bg-white px-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">New Password</label>
          <input 
            type="password" placeholder="Leave blank to keep current" 
            value={password} onChange={e => setPassword(e.target.value)}
            className="w-full bg-transparent outline-none text-sm font-bold text-slate-800 pt-1"
          />
        </div>
        
        <button 
          onClick={handleUpdate}
          disabled={saving}
          className="w-full bg-blue-700 text-white font-black py-5 rounded-[1.5rem] mt-4 shadow-lg shadow-blue-200 disabled:bg-slate-300 transition-all active:scale-95"
        >
          {saving ? "SAVING CHANGES..." : "SAVE CHANGES"}
        </button>
      </div>
    </div>
  );
}