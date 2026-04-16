import { useState } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "../context/AuthContext";
import { useQuiz } from "../context/QuizContext";
import { getStreamSubjects } from "../lib/helpers";
import SubjectCard from "../components/SubjectCard";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const MAX_SUBJECTS = 4;

const DURATION_OPTIONS = [
  { label: "30 min",  value: 1800  },
  { label: "45 min",  value: 2700  },
  { label: "1 hour",  value: 3600  },
  { label: "1.5 hrs", value: 5400  },
  { label: "No limit",value: 99999 },
];

export default function TestSetup() {
  const { user, logout }        = useAuth();
  const { startTest, status }   = useQuiz();
  const navigate                = useNavigate();

  const subjects = getStreamSubjects(user?.stream ?? "science");

  const [activeTab,    setActiveTab]    = useState("subjects"); 
  const [selected,     setSelected]     = useState([]);         
  const [timerOn,      setTimerOn]      = useState(true);
  const [durationSecs, setDurationSecs] = useState(2700);       
  const [qPerSubject,  setQPerSubject]  = useState(40);         

  const totalQuestions = selected.length * qPerSubject;
  const canStart       = selected.length > 0;

  function toggleSubject(slug) {
    setSelected((prev) => {
      if (prev.includes(slug)) return prev.filter((s) => s !== slug);
      if (prev.length >= MAX_SUBJECTS) return prev; 
      return [...prev, slug];
    });
  }

  function selectAll() {
    const allSlugs = subjects.map((s) => s.slug);
    setSelected(allSlugs.slice(0, MAX_SUBJECTS));
  }

  function clearAll() { setSelected([]); }

  async function handleStart() {
    if (!canStart) return;
    const duration = timerOn ? durationSecs : 99999;
    await startTest(selected, totalQuestions, duration);
    navigate("/quiz");
  }

  function SettingRow({ label, hint, children }) {
    return (
      <div className="flex items-center justify-between gap-4 py-5 border-b border-slate-100 last:border-0">
        <div>
          <p className="text-sm font-bold text-slate-800">{label}</p>
          {hint && <p className="text-[11px] text-slate-400 font-medium mt-0.5">{hint}</p>}
        </div>
        {children}
      </div>
    );
  }

  function Toggle({ on, onToggle }) {
    return (
      <button
        onClick={onToggle}
        className={`relative w-11 h-6 rounded-full transition-colors duration-200 ${on ? "bg-blue-600" : "bg-slate-300"}`}
      >
        <span className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform duration-200 ${on ? "translate-x-5" : "translate-x-0"}`} />
      </button>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 font-sans text-slate-900">
      <Navbar username={user?.name} onLogout={() => { logout(); navigate("/"); }} />

      <main className="flex-1 w-full max-w-xl mx-auto px-6 py-10">


        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => navigate("/stream")}
            className="w-10 h-10 rounded-xl bg-white border border-slate-200 text-slate-500 hover:text-blue-600 hover:border-blue-100 flex items-center justify-center shrink-0 transition-all shadow-sm"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Examination Setup</h1>
            <p className="text-sm text-slate-500 font-medium">
              Selected: <span className="text-blue-600 font-bold">{selected.length}</span> of {MAX_SUBJECTS} Subjects
            </p>
          </div>
        </div>

        
        <div className="flex bg-slate-200/50 p-1 rounded-xl mb-8 border border-slate-200">
          <button
            onClick={() => setActiveTab("subjects")}
            className={`flex-1 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${activeTab === "subjects" ? "bg-white text-blue-600 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}
          >
            1. Select Subjects
          </button>
          <button
            onClick={() => setActiveTab("settings")}
            className={`flex-1 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${activeTab === "settings" ? "bg-white text-blue-600 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}
          >
            2. Configure Mode
          </button>
        </div>

        {activeTab === "subjects" && (
          <div className="space-y-6">
            <div className="flex gap-3">
              <button onClick={selectAll} className="flex-1 py-3 text-xs font-bold uppercase tracking-widest text-slate-600 bg-white border border-slate-200 rounded-xl hover:border-blue-300 hover:text-blue-600 transition-all">Select All</button>
              <button onClick={clearAll} className="flex-1 py-3 text-xs font-bold uppercase tracking-widest text-slate-600 bg-white border border-slate-200 rounded-xl hover:border-red-200 hover:text-red-500 transition-all">Clear</button>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {subjects.map((sub) => (
                <SubjectCard
                  key={sub.slug}
                  name={sub.name}
                  emoji={sub.emoji}
                  selected={selected.includes(sub.slug)}
                  disabled={selected.length >= MAX_SUBJECTS && !selected.includes(sub.slug)}
                  onClick={() => toggleSubject(sub.slug)}
                />
              ))}
            </div>

            {selected.length > 0 && (
              <div className="bg-blue-600 text-white rounded-2xl p-5 flex items-center justify-between shadow-lg shadow-blue-200">
                <div>
                  <p className="text-[10px] uppercase font-bold tracking-widest opacity-80">Ready to proceed</p>
                  <p className="text-lg font-black">{totalQuestions} Questions Total</p>
                </div>
                <button onClick={() => setActiveTab("settings")} className="bg-white text-blue-600 px-5 py-2.5 rounded-lg font-bold text-sm hover:bg-blue-50 transition-colors">
                  Next →
                </button>
              </div>
            )}
          </div>
        )}

        {activeTab === "settings" && (
          <div className="space-y-6">
            <div className="bg-white border border-slate-200 rounded-2xl px-6 shadow-sm">
              <SettingRow label="Timed Examination" hint="Automatically ends test when duration expires">
                <Toggle on={timerOn} onToggle={() => setTimerOn((v) => !v)} />
              </SettingRow>

              {timerOn && (
                <SettingRow label="Duration" hint="Allocated time for full session">
                  <div className="flex flex-wrap gap-2 justify-end max-w-[200px]">
                    {DURATION_OPTIONS.filter(o => o.value !== 99999).map((opt) => (
                      <button
                        key={opt.value}
                        onClick={() => setDurationSecs(opt.value)}
                        className={`text-[10px] font-bold px-3 py-1.5 rounded-md transition-all ${durationSecs === opt.value ? "bg-blue-600 text-white" : "bg-slate-100 text-slate-500 hover:bg-slate-200"}`}
                      >
                        {opt.label.toUpperCase()}
                      </button>
                    ))}
                  </div>
                </SettingRow>
              )}

              <SettingRow label="Questions / Subject" hint="Adjust volume of questions per course">
                <div className="flex items-center gap-3 bg-slate-100 p-1 rounded-lg">
                  <button onClick={() => setQPerSubject(v => Math.max(10, v - 10))} className="w-8 h-8 rounded-md bg-white text-slate-600 font-bold hover:text-blue-600 transition-all shadow-sm">−</button>
                  <span className="w-6 text-center font-bold text-slate-800 text-sm">{qPerSubject}</span>
                  <button onClick={() => setQPerSubject(v => Math.min(40, v + 10))} className="w-8 h-8 rounded-md bg-white text-slate-600 font-bold hover:text-blue-600 transition-all shadow-sm">+</button>
                </div>
              </SettingRow>
            </div>

            <button
              onClick={handleStart}
              disabled={!canStart || status === "loading"}
              className="w-full bg-blue-600 hover:bg-blue-700 active:scale-[0.98] disabled:opacity-50 text-white font-bold py-4 rounded-xl shadow-xl shadow-blue-200 transition-all flex items-center justify-center gap-2"
            >
              {status === "loading" ? <span className="w-5 h-5 rounded-full border-2 border-white/30 border-t-white animate-spin" /> : "Initiate Test Session"}
            </button>
          </div>
        )}
      </main>
      
    </div>
  );
}