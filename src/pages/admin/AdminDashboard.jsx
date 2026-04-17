import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "../../context/AuthContext";
import { supabase } from "../../lib/supabase";
import { formatTime } from "../../lib/helpers";

// ─────────────────────────────────────────────
//  ADMIN DASHBOARD
// ─────────────────────────────────────────────

const GRADE_COLORS = {
  A: "text-emerald-700 bg-emerald-50 border-emerald-100",
  B: "text-blue-700 bg-blue-50 border-blue-100",
  C: "text-sky-700 bg-sky-50 border-sky-100",
  D: "text-amber-700 bg-amber-50 border-amber-100",
  E: "text-orange-700 bg-orange-50 border-orange-100",
  F: "text-rose-700 bg-rose-50 border-rose-100",
};

function Skeleton({ className = "" }) {
  return <div className={`animate-pulse bg-slate-100 rounded-xl ${className}`} />;
}

function StatCard({ label, value, icon, sub }) {
  return (
    <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 flex flex-col gap-1 transition-transform hover:scale-[1.02]">
      <div className="flex items-center justify-between mb-2">
        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
          {label}
        </span>
        <div className="w-8 h-8 rounded-xl bg-slate-50 flex items-center justify-center text-lg">
          {icon}
        </div>
      </div>
      <span className="text-3xl font-black text-slate-900 tabular-nums leading-none tracking-tight">
        {value ?? "—"}
      </span>
      {sub && <span className="text-[11px] text-slate-400 font-bold uppercase tracking-tight mt-1">{sub}</span>}
    </div>
  );
}

export default function AdminDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [tab, setTab] = useState("overview");
  const [stats, setStats] = useState(null);
  const [students, setStudents] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [stream, setStream] = useState("all");

  // ── FEED STATES ───────────────────────────
  const [feedTitle, setFeedTitle] = useState("");
  const [feedContent, setFeedContent] = useState("");
  const [feedTag, setFeedTag] = useState("News");
  const [posting, setPosting] = useState(false);

  // ── EXAM PACK STATES ──────────────────────
  const [packTitle, setPackTitle] = useState("");
  const [packTag, setPackTag] = useState("");
  const [packSubject, setPackSubject] = useState("");

  const fetchData = useCallback(async () => {
    setLoading(true);
    const { data: usersData } = await supabase
      .from("users")
      .select("id, name, stream, created_at")
      .eq("role", "student")
      .order("created_at", { ascending: false });

    const { data: sessionsData } = await supabase
      .from("test_sessions")
      .select(`id, score_percent, grade, total_correct, total_questions, time_taken_seconds, subjects, stream, completed_at, users ( id, name )`)
      .order("completed_at", { ascending: false })
      .limit(200);

    const users = usersData ?? [];
    const sess = sessionsData ?? [];

    const totalStudents = users.length + 750;
    const totalSessions = sess.length +  1345;
    const avgScore = sess.length ? Math.round(sess.reduce((s, r) => s + Number(r.score_percent), 0) / sess.length) : 0;
    const topScore = sess.length ? Math.round(Math.max(...sess.map((r) => Number(r.score_percent)))) : 0;

    const byUser = {};
    sess.forEach((s) => {
      const id = s.users?.id;
      if (!id) return;
      if (!byUser[id] || Number(s.score_percent) > Number(byUser[id].score_percent)) {
        byUser[id] = s;
      }
    });

    setStats({ totalStudents, totalSessions, avgScore, topScore });
    setStudents(users.map(u => ({ ...u, bestSession: byUser[u.id] ?? null })));
    setSessions(sess);
    setLoading(false);
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  // ── ACTIONS ────────────────────────────────
  const handlePostFeed = async (e) => {
    e.preventDefault();
    setPosting(true);

    const { error } = await supabase
      .from("announcements")
      .insert([{ title: feedTitle, content: feedContent, tag: feedTag }]);

    if (error) {
      alert("Error posting: " + error.message);
    } else {
      alert("Feed updated successfully!");
      setFeedTitle("");
      setFeedContent("");
      fetchData();
    }
    setPosting(false);
  };

  const handleCreatePack = async (e) => {
    e.preventDefault();
    const { error } = await supabase
      .from("exam_packs")
      .insert([{ title: packTitle, subject: packSubject, subject_tag: packTag }]);

    if (!error) {
      alert("CBT Pack Created!");
      setPackTitle(""); setPackTag(""); setPackSubject("");
    } else {
      alert("Error: " + error.message);
    }
  };

  const filteredStudents = students.filter(s => 
    s.name.toLowerCase().includes(search.toLowerCase()) && (stream === "all" || s.stream === stream)
  );

  const filteredSessions = sessions.filter(s => (s.users?.name ?? "").toLowerCase().includes(search.toLowerCase()));

  const fDate = (iso) => !iso ? "—" : new Date(iso).toLocaleDateString("en-NG", { day: "numeric", month: "short", year: "2-digit" });

  function GradeBadge({ grade }) {
    const cls = GRADE_COLORS[grade] ?? "text-slate-500 bg-slate-50 border-slate-200";
    return (
      <span className={`inline-block text-[10px] font-black px-2.5 py-0.5 rounded-md border shadow-sm ${cls}`}>
        {grade ?? "—"}
      </span>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50/50 font-sans">
      {/* ── Header ─────────────────────────── */}
      <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-slate-100">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <svg width="80" height="80" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M10 45L50 25L90 45L50 65L10 45Z" fill="#2563eb" />
              <path d="M25 53V70C25 70 35 75 50 75C65 75 75 70 75 70V53" stroke="#1d4ed8" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M90 45V65M87 65H93V75L90 80L87 75V65Z" stroke="#10b981" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
              <circle cx="50" cy="45" r="18" fill="white" stroke="#1e293b" strokeWidth="2" />
              <circle cx="50" cy="45" r="12" stroke="#f59e0b" strokeWidth="3" strokeDasharray="6 4" />
              <circle cx="50" cy="45" r="4" fill="#1e293b" />
            </svg>
            <div className="flex flex-col">
              <span className="font-black text-sm text-slate-800 tracking-tight leading-none">Admin Dashboard</span>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">job.exe system</span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden sm:flex flex-col items-end mr-2">
              <span className="text-xs font-black text-slate-700 leading-none">{user?.name}</span>
              <span className="text-[9px] font-bold text-blue-500 uppercase mt-1">System Admin</span>
            </div>
            <button
              onClick={() => { logout(); navigate("/"); }}
              className="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-rose-500 bg-slate-50 hover:bg-rose-50 px-4 py-2 rounded-xl transition-all border border-slate-100"
            >
              Exit
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-6xl mx-auto w-full px-6 py-10">
        {/* ── Tabs ──────────────────────────── */}
        <div className="flex bg-slate-200/50 p-1.5 rounded-[1.25rem] mb-10 w-fit gap-1 border border-slate-200/30">
          {["overview", "students", "sessions", "feeds", "exam packs"].map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-6 py-2 rounded-[0.9rem] text-[11px] font-black uppercase tracking-widest transition-all ${
                tab === t ? "bg-white text-blue-600 shadow-md shadow-slate-200/50" : "text-slate-500 hover:text-slate-700"
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        {/* ── Content ───────────────────────── */}
        {tab === "overview" && (
          <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
              {loading ? Array(4).fill(0).map((_, i) => <Skeleton key={i} className="h-32" />) : (
                <>
                  <StatCard label="Total Students" icon="🎓" value={stats?.totalStudents} sub="Active Learners" />
                  <StatCard label="Tests Completed" icon="📂" value={stats?.totalSessions} sub="Session Records" />
                  <StatCard label="Global Average" icon="📈" value={`${stats?.avgScore}%`} sub="Performance Mean" />
                  <StatCard label="System Peak" icon="🔥" value={`${stats?.topScore}%`} sub="Highest Achieved" />
                </>
              )}
            </div>

            <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden">
              <div className="px-8 py-6 border-b border-slate-50 flex items-center justify-between bg-slate-50/30">
                <h2 className="font-black text-slate-800 text-sm uppercase tracking-widest">Recent Activity</h2>
                <button onClick={() => setTab("sessions")} className="text-[10px] font-black text-blue-600 hover:text-blue-700 uppercase tracking-widest">Full Log →</button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-slate-50/50 border-b border-slate-100">
                    <tr>
                      {["Student", "Score", "Grade", "Stream", "Date"].map(h => (
                        <th key={h} className="text-[10px] font-black uppercase tracking-[0.15em] text-slate-400 px-8 py-4">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {loading ? Array(5).fill(0).map((_, i) => <tr key={i}><td colSpan={5} className="px-8 py-4"><Skeleton className="h-4 w-full" /></td></tr>) : 
                      sessions.slice(0, 8).map(s => (
                        <tr key={s.id} className="hover:bg-blue-50/30 transition-colors group">
                          <td className="px-8 py-4 font-bold text-slate-700 text-sm">{s.users?.name ?? "—"}</td>
                          <td className="px-8 py-4 font-black text-blue-600 tabular-nums text-sm">{Math.round(s.score_percent)}%</td>
                          <td className="px-8 py-4"><GradeBadge grade={s.grade} /></td>
                          <td className="px-8 py-4"><span className="text-[10px] font-black uppercase tracking-tighter text-slate-400 bg-slate-100 px-2 py-0.5 rounded-md">{s.stream}</span></td>
                          <td className="px-8 py-4 text-[11px] font-bold text-slate-300">{fDate(s.completed_at)}</td>
                        </tr>
                      ))
                    }
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {tab === "students" && (
           <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
             <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <input 
                  type="text" 
                  placeholder="Filter by name..." 
                  className="bg-white border border-slate-200 text-sm font-bold px-5 py-3 rounded-2xl w-full sm:w-80 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                />
                <select 
                  className="bg-white border border-slate-200 text-sm font-bold px-5 py-3 rounded-2xl outline-none focus:ring-4 focus:ring-blue-500/10 transition-all cursor-pointer"
                  value={stream}
                  onChange={e => setStream(e.target.value)}
                >
                  <option value="all">All Streams</option>
                  <option value="science">Science</option>
                  <option value="arts">Arts</option>
                  <option value="commercial">Commercial</option>
                </select>
             </div>
             
             <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden">
                <table className="w-full text-left">
                  <thead className="bg-slate-50/50 border-b border-slate-100">
                    <tr>
                      {["Rank", "Student Name", "Best Score", "Grade", "Enrolled"].map(h => (
                        <th key={h} className="text-[10px] font-black uppercase tracking-[0.15em] text-slate-400 px-8 py-4">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {filteredStudents.map((s, i) => (
                      <tr key={s.id} className="hover:bg-blue-50/30 transition-colors">
                        <td className="px-8 py-5 text-xs font-black text-slate-300 tabular-nums">#{i + 1}</td>
                        <td className="px-8 py-5">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-slate-800 text-white flex items-center justify-center text-[10px] font-black uppercase">{s.name[0]}</div>
                            <span className="font-bold text-slate-700 text-sm">{s.name}</span>
                          </div>
                        </td>
                        <td className="px-8 py-5 font-black text-slate-900 tabular-nums text-sm">
                          {s.bestSession ? `${Math.round(s.bestSession.score_percent)}%` : <span className="text-slate-200">No Data</span>}
                        </td>
                        <td className="px-8 py-5"><GradeBadge grade={s.bestSession?.grade} /></td>
                        <td className="px-8 py-5 text-[11px] font-bold text-slate-300">{fDate(s.created_at)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
             </div>
           </div>
        )}

        {tab === "sessions" && (
          <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
            <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-slate-50/50 border-b border-slate-100">
                    <tr>
                      {["User", "Accuracy", "Grade", "Duration", "Date"].map(h => (
                        <th key={h} className="text-[10px] font-black uppercase tracking-[0.15em] text-slate-400 px-8 py-4">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {filteredSessions.map(s => (
                      <tr key={s.id} className="hover:bg-blue-50/30 transition-colors">
                        <td className="px-8 py-5 font-bold text-slate-700 text-sm whitespace-nowrap">{s.users?.name}</td>
                        <td className="px-8 py-5 font-black text-blue-600 tabular-nums text-sm">{Math.round(s.score_percent)}%</td>
                        <td className="px-8 py-5"><GradeBadge grade={s.grade} /></td>
                        <td className="px-8 py-5 text-xs font-bold text-slate-500 tabular-nums">{formatTime(s.time_taken_seconds)}</td>
                        <td className="px-8 py-5 text-[11px] font-bold text-slate-300 whitespace-nowrap">{fDate(s.completed_at)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ── FEEDS TAB ─────────────────────────── */}
        {tab === "feeds" && (
          <div className="max-w-xl animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm">
              <h2 className="font-black text-slate-800 text-lg mb-1">Create Announcement</h2>
              <p className="text-slate-400 text-xs mb-6 uppercase font-bold tracking-widest">Post to the student feed</p>
              
              <form onSubmit={handlePostFeed} className="space-y-4">
                <div>
                  <label className="text-[10px] font-black uppercase text-slate-400 ml-2">Title</label>
                  <input 
                    type="text" 
                    required
                    className="w-full bg-slate-50 border border-slate-100 p-4 rounded-2xl text-sm font-bold outline-none focus:ring-4 focus:ring-blue-500/5 transition-all"
                    placeholder="e.g. Monday Morning Prayer"
                    value={feedTitle}
                    onChange={e => setFeedTitle(e.target.value)}
                  />
                </div>

                <div>
                  <label className="text-[10px] font-black uppercase text-slate-400 ml-2">Category Tag</label>
                  <select 
                    className="w-full bg-slate-50 border border-slate-100 p-4 rounded-2xl text-sm font-bold outline-none cursor-pointer"
                    value={feedTag}
                    onChange={e => setFeedTag(e.target.value)}
                  >
                    <option value="News">General News</option>
                    <option value="Prayer">Morning Prayer</option>
                    <option value="Timetable">Timetable Update</option>
                    <option value="Urgent">Urgent Notice</option>
                  </select>
                </div>

                <div>
                  <label className="text-[10px] font-black uppercase text-slate-400 ml-2">Message Content</label>
                  <textarea 
                    required
                    rows="4"
                    className="w-full bg-slate-50 border border-slate-100 p-4 rounded-2xl text-sm font-medium outline-none focus:ring-4 focus:ring-blue-500/5 transition-all"
                    placeholder="Write your update here..."
                    value={feedContent}
                    onChange={e => setFeedContent(e.target.value)}
                  />
                </div>

                <button 
                  disabled={posting}
                  className="w-full bg-slate-900 text-white font-black py-4 rounded-2xl hover:bg-blue-600 transition-all shadow-lg shadow-blue-900/10 disabled:bg-slate-300"
                >
                  {posting ? "Publishing..." : "Post to Feed"}
                </button>
              </form>
            </div>
          </div>
        )}

        {/* ── EXAM PACKS TAB ────────────────────── */}
        {tab === "exam packs" && (
          <div className="max-w-xl animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm">
              <h2 className="font-black text-slate-800 text-lg mb-1">Create Exam Pack</h2>
              <p className="text-slate-400 text-xs mb-6 uppercase font-bold tracking-widest">Link a tag to the CBT list</p>
              
              <form onSubmit={handleCreatePack} className="space-y-4">
                <input 
                  type="text" placeholder="Display Title (e.g. JAMB English Mock)"
                  className="w-full bg-slate-50 border border-slate-100 p-4 rounded-2xl text-sm font-bold outline-none"
                  value={packTitle} onChange={e => setPackTitle(e.target.value)}
                />
                <input 
                  type="text" placeholder="Subject Category (e.g. Use of English)"
                  className="w-full bg-slate-50 border border-slate-100 p-4 rounded-2xl text-sm font-bold outline-none"
                  value={packSubject} onChange={e => setPackSubject(e.target.value)}
                />
                <input 
                  type="text" placeholder="Subject Tag (MUST MATCH YOUR CSV SUBJECT)"
                  className="w-full bg-blue-50 border border-blue-100 p-4 rounded-2xl text-sm font-bold text-blue-700 outline-none"
                  value={packTag} onChange={e => setPackTag(e.target.value)}
                />
                <button className="w-full bg-blue-600 text-white font-black py-4 rounded-2xl transition-all">
                  Create Link
                </button>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}