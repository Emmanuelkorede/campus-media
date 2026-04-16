import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { useQuiz } from "../context/QuizContext";
import { useNavigate } from "react-router";
import Navbar from "../components/Navbar";

// ── Skeleton Loader ───────────────────────────
function PackSkeleton() {
  return (
    <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm animate-pulse">
      <div className="flex justify-between items-center">
        <div className="space-y-3 w-2/3">
          <div className="h-2 w-16 bg-slate-100 rounded" />
          <div className="h-4 w-48 bg-slate-200 rounded" />
          <div className="h-2 w-32 bg-slate-100 rounded" />
        </div>
        <div className="h-10 w-24 bg-slate-100 rounded-xl" />
      </div>
    </div>
  );
}

export default function CBTList() {
  const [packs, setPacks] = useState([]);
  const [fetching, setFetching] = useState(true);
  const [loadingId, setLoadingId] = useState(null);
  // Added a state to track errors per pack
  const [statusMsg, setStatusMsg] = useState({ id: null, text: "" }); 
  const { startPackTest } = useQuiz();
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchPacks() {
      try {
        const { data } = await supabase
          .from("exam_packs")
          .select("*")
          .order('created_at', { ascending: false });
        setPacks(data || []);
      } catch (err) {
        console.error("Failed to fetch packs", err);
      } finally {
        setFetching(false);
      }
    }
    fetchPacks();
  }, []);

  const handleTakeTest = async (pack) => {
    setLoadingId(pack.id);
    setStatusMsg({ id: null, text: "" }); // Clear previous messages
    
    const { data: questionData, error } = await supabase
      .from("questions")
      .select("*")
      .eq("subject", pack.subject_tag); 

    if (error || !questionData || questionData.length === 0) {
      // Instead of alert, set a status message for this specific pack
      setStatusMsg({ 
        id: pack.id, 
        text: "Questions are being uploaded. Check back soon!" 
      });
      setLoadingId(null);
      return;
    }

    startPackTest(questionData, 3600); 
    navigate("/quiz");
  };

  return (
    <> 
    <Navbar />

    <div className="min-h-screen bg-slate-50/50 px-6 py-12">
      <div className="max-w-4xl mx-auto">
        
        {/* Header Section */}
        <div className="mb-10">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-2 h-6 bg-blue-600 rounded-full" />
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">Exam Intelligence</h1>
          </div>
          <p className="text-slate-500 font-medium">
            Practice with real questions from recent JAMB sessions and past repeats.
          </p>
        </div>

        {/* List Grid */}
        <div className="grid gap-5">
          {fetching ? (
            <>
              <PackSkeleton />
              <PackSkeleton />
              <PackSkeleton />
            </>
          ) : packs.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-[2.5rem] border border-dashed border-slate-200">
              <span className="text-4xl mb-4 block">📡</span>
              <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Waiting for new question drops...</p>
            </div>
          ) : (
            packs.map((pack) => (
              <div 
                key={pack.id} 
                className="group bg-white p-6 sm:p-8 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-md hover:border-blue-100 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-6"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="px-2 py-0.5 rounded-md bg-blue-50 border border-blue-100 text-[10px] font-black text-blue-600 uppercase tracking-widest">
                      {pack.subject}
                    </span>
                    <span className="flex items-center gap-1.5 text-[10px] font-bold text-emerald-500 uppercase tracking-widest">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      Live Questions
                    </span>
                  </div>
                  <h3 className="font-black text-slate-800 text-xl mb-1 group-hover:text-blue-600 transition-colors">
                    {pack.title}
                  </h3>
                  <p className="text-slate-400 text-sm leading-relaxed max-w-md">
                    {pack.description || "Freshly extracted questions based on recent student feedback."}
                  </p>
                </div>

                <div className="flex flex-col items-end gap-2">
                  {/* Subtle error message shown only for the clicked pack if it fails */}
                  {statusMsg.id === pack.id && (
                    <p className="text-[10px] font-bold text-rose-500 uppercase tracking-tight animate-bounce">
                      {statusMsg.text}
                    </p>
                  )}
                  
                  <button 
                    onClick={() => handleTakeTest(pack)}
                    disabled={loadingId !== null}
                    className={`
                      relative overflow-hidden px-8 py-4 rounded-2xl text-xs font-black uppercase tracking-[0.15em] transition-all
                      ${loadingId === pack.id 
                        ? "bg-slate-100 text-slate-400 cursor-not-allowed" 
                        : "bg-slate-900 text-white hover:bg-blue-600 hover:shadow-lg hover:shadow-blue-200 active:scale-95"}
                    `}
                  >
                    {loadingId === pack.id ? (
                      <span className="flex items-center gap-2">
                        <svg className="animate-spin h-4 w-4 text-slate-400" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        Loading
                      </span>
                    ) : (
                      "Start Practice"
                    )}
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Updated Footer Section */}
        <div className="mt-12 text-center space-y-2">
          <p className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">
            Keep checking back. We'll drop more questions as they come in.
          </p>
          <div className="flex justify-center gap-2">
            <div className="h-1 w-8 bg-slate-200 rounded-full" />
            <div className="h-1 w-2 bg-slate-200 rounded-full" />
            <div className="h-1 w-2 bg-slate-200 rounded-full" />
          </div>
        </div>
      </div>
    </div>
    </>
  );
}