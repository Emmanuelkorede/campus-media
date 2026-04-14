import { useState } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "../context/AuthContext";
import StreamCard from "../components/StreamCard";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const STREAMS = [
  {
    key: "science",
    title: "Science",
    emoji: "🔬",
    description: "Medicine, Engineering, Pharmacy, Computer Science and other science-based courses.",
    subjects: ["English", "Physics", "Chemistry", "Biology", "Mathematics", "Geography"],
  },
  {
    key: "arts",
    title: "Arts & Humanities",
    emoji: "🎭",
    description: "Law, Languages, Social Sciences and Humanities-based courses.",
    subjects: ["English", "Government", "Literature", "CRS", "IRK", "History"],
  },
  {
    key: "commercial",
    title: "Commercial",
    emoji: "💼",
    description: "Accounting, Business Administration, Economics and Commerce-related courses.",
    subjects: ["English", "Mathematics", "Economics", "Commerce", "Accounting", "Government"],
  },
];

export default function StreamSelect() {
  const { user, setStream, logout } = useAuth();
  const navigate = useNavigate();

  const [selected, setSelected] = useState(user?.stream ?? null);
  const [saving, setSaving] = useState(false);

  async function handleContinue() {
    if (!selected) return;
    setSaving(true);
    await setStream(selected);
    setSaving(false);
    navigate("/setup");
  }

  return (

    <div className="min-h-screen flex flex-col bg-slate-50 font-sans text-slate-900">
      <Navbar
        username={user?.name}
        onLogout={() => { logout(); navigate("/"); }}
      />

      <main className="flex-1 w-full max-w-xl mx-auto px-6 py-12">

        
        <div className="text-center mb-10">
          <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-blue-600 bg-blue-50 px-3 py-1 rounded-md inline-block mb-4 border border-blue-100">
            Step 1: Stream Selection
          </span>
          <h1 className="text-3xl font-extrabold text-slate-900 mb-2">
            Choose your academic stream
          </h1>
          <p className="text-slate-500 text-base font-medium">
            Select the specialization that aligns with your course combination.
          </p>
        </div>


        <div className="space-y-4 mb-10">
          {STREAMS.map((stream) => (
            <StreamCard
              key={stream.key}
              title={stream.title}
              description={stream.description}
              subjects={stream.subjects}
              emoji={stream.emoji}
              
              selected={selected === stream.key}
              onClick={() => setSelected(stream.key)}
            />
          ))}
        </div>


        <div className="sticky bottom-8 sm:relative sm:bottom-0">
          <button
            onClick={handleContinue}
            disabled={!selected || saving}
            className="w-full bg-blue-600 hover:bg-blue-700 active:scale-[0.98] 
                       disabled:opacity-40 disabled:grayscale text-white font-bold 
                       py-4 rounded-xl shadow-xl shadow-blue-200 
                       transition-all duration-200 flex items-center justify-center gap-2"
          >
            {saving ? (
              <>
                <span className="w-5 h-5 rounded-full border-2 border-white/40 border-t-white animate-spin" />
                Updating Profile...
              </>
            ) : (
              "Confirm & Continue"
            )}
          </button>
          
          <p className="text-center text-[11px] text-slate-400 mt-4">
            You can change your stream later in account settings.
          </p>
        </div>
      </main>

      <Footer />
    </div>
  );
}