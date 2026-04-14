import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";


const GRADE_TEXT = {
  A: "text-emerald-600",
  B: "text-blue-600",
  C: "text-indigo-600",
  D: "text-amber-600",
  E: "text-orange-600",
  F: "text-rose-600",
};

function SkeletonRow() {
  return (
    <div className="flex items-center gap-4 px-5 py-4 animate-pulse">
      <div className="w-6 h-6 rounded-full bg-slate-100 shrink-0" />
      <div className="w-10 h-10 rounded-xl bg-slate-100 shrink-0" />
      <div className="flex-1 space-y-2">
        <div className="w-24 h-3 bg-slate-100 rounded-full" />
        <div className="w-12 h-2 bg-slate-50 rounded-full" />
      </div>
      <div className="w-12 h-4 bg-slate-100 rounded-full" />
    </div>
  );
}

export default function Leaderboard({
  currentUserId = null,
  limit = 10,
}) {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchScores() {
      setLoading(true);
      setError(null);

      const { data, error: err } = await supabase
        .from("test_sessions")
        .select(`
          id,
          score_percent,
          grade,
          total_correct,
          total_questions,
          completed_at,
          users ( id, name )
        `)
        .order("score_percent", { ascending: false })
        .limit(limit);

      if (err) {
        setError("Network error. Try again later.");
      } else {
        setRows(data ?? []);
      }
      setLoading(false);
    }

    fetchScores();
  }, [limit]);

  function formatDate(iso) {
    if (!iso) return "";
    const d = new Date(iso);
    return d.toLocaleDateString("en-NG", { day: "numeric", month: "short" });
  }

  return (
    <div className="w-full max-w-md mx-auto bg-white rounded-[2.5rem] border border-slate-100 shadow-2xl shadow-slate-200/50 overflow-hidden">
      
      
      <div className="px-6 pt-7 pb-5 flex items-center justify-between">
        <div>
          <h3 className="font-black text-slate-800 text-xl tracking-tight">
            Leaderboard
          </h3>
          <p className="text-[11px] text-slate-400 font-bold uppercase tracking-widest mt-1">
            Global Rankings
          </p>
        </div>
        <div className="w-10 h-10 rounded-2xl bg-blue-50 flex items-center justify-center text-xl shadow-inner">
          🏆
        </div>
      </div>

      
      <div className="flex flex-col">
        {loading && Array.from({ length: 5 }).map((_, i) => <SkeletonRow key={i} />)}

        {!loading && error && (
          <div className="px-6 py-12 text-center">
            <div className="text-3xl mb-3 opacity-50">📡</div>
            <p className="text-sm text-slate-400 font-bold">{error}</p>
          </div>
        )}

        {!loading && !error && rows.length === 0 && (
          <div className="px-6 py-12 text-center">
            <div className="text-3xl mb-3 opacity-50">🏜️</div>
            <p className="text-sm text-slate-400 font-bold">No data found in this stream.</p>
          </div>
        )}

        {!loading && !error && rows.map((row, i) => {
          const rank = i + 1;
          const isMe = row.users?.id === currentUserId;
          const name = row.users?.name ?? "Candidate";
          const gradeCls = GRADE_TEXT[row.grade] ?? "text-slate-500";
          
          return (
            <div
              key={row.id}
              className={`
                flex items-center gap-4 px-6 py-4 transition-all
                ${isMe ? "bg-blue-600 shadow-lg shadow-blue-200 z-10 relative scale-[1.02] rounded-2xl mx-2 my-1" : "hover:bg-slate-50 border-b border-slate-50"}
              `}
            >

              <div className={`
                w-7 text-center shrink-0 font-black text-xs tabular-nums
                ${isMe ? "text-blue-100" : rank <= 3 ? "text-blue-600" : "text-slate-300"}
              `}>
                #{rank}
              </div>


              <div className={`
                w-10 h-10 rounded-xl shrink-0 flex items-center justify-center font-black text-sm
                transition-transform duration-500
                ${isMe ? "bg-white text-blue-600 rotate-3" : "bg-slate-100 text-slate-400"}
              `}>
                {name[0].toUpperCase()}
              </div>

              
              <div className="flex-1 min-w-0">
                <p className={`text-sm font-extrabold truncate ${isMe ? "text-white" : "text-slate-800"}`}>
                  {name}
                </p>
                <p className={`text-[10px] font-bold uppercase tracking-wider ${isMe ? "text-blue-100/70" : "text-slate-400"}`}>
                  {formatDate(row.completed_at)}
                </p>
              </div>

              
              <div className="text-right shrink-0">
                <p className={`text-sm font-black tabular-nums ${isMe ? "text-white" : gradeCls}`}>
                  {Math.round(row.score_percent)}%
                </p>
                <p className={`text-[9px] font-bold uppercase tracking-tighter ${isMe ? "text-blue-200" : "text-slate-400"}`}>
                  {row.total_correct} / {row.total_questions}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      
      <div className="p-6 bg-slate-50/50">
        <div className="bg-white border border-slate-100 rounded-2xl p-4 flex items-center justify-between shadow-sm">
           <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
            Your Ranking
           </p>
           <p className="text-xs font-black text-slate-800">
             {rows.some(r => r.users?.id === currentUserId) ? "In Top 10" : "Not Ranked"}
           </p>
        </div>
      </div>
    </div>
  );
}