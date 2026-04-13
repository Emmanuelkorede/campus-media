import { useNavigate } from "react-router";
import { useAuth } from "../context/AuthContext";
import Footer from "../components/Footer";

export default function Landing() {
  const navigate = useNavigate();
  const { user } = useAuth();

  function handleStart() {
    if (user) {
      navigate(user.stream ? "/setup" : "/stream");
    } else {
      navigate("/login");
    }
  }

  return (
    /* h-screen + overflow-hidden prevents scrolling */
    <div className="h-screen flex flex-col bg-slate-50 text-slate-900 overflow-hidden font-sans">
      
      {/* Structural Watermark - Subtle & Professional */}
      <div aria-hidden className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-[0.03]">
        <div className="w-[80vh] h-[80vh] border-[2px] border-blue-900 rounded-full flex items-center justify-center">
          <span className="text-blue-900 font-bold text-[10vw] tracking-tighter">CBT</span>
        </div>
      </div>

      <main className="relative flex-1 flex flex-col items-center justify-center px-6 text-center">
        
        {/* Placeholder SVG Logo */}
        <div className="mb-8">
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
        </div>

        {/* Clean Badge */}
        <span className="inline-block text-[10px] font-bold uppercase tracking-widest text-blue-700 bg-blue-50 border border-blue-100 px-4 py-1.5 rounded-md mb-6">
          Official Examination Portal
        </span>

        {/* Title Section */}
        <div className="space-y-2 mb-8">
          <h1 className="text-5xl font-extrabold tracking-tight text-slate-900">
            Campus<span className="text-blue-600">Media</span>
          </h1>
          <p className="text-xl font-medium text-slate-500">
            Advanced Computer Based Testing
          </p>
        </div>

        {/* Action Area */}
        <div className="w-full max-w-sm space-y-4">
          <button
            onClick={handleStart}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold text-lg py-4 px-8 rounded-xl shadow-md transition-all active:scale-[0.98]"
          >
            Start Practice Session
          </button>
          <p className="text-sm text-slate-400">
            Secure · Verified · Instant Results
          </p>
        </div>

        {/* Professional Minimalist Tag Cloud */}
        <div className="flex flex-wrap justify-center gap-3 mt-12 max-w-2xl opacity-80">
          {[
            "English", "Physics", "Chemistry", "Biology", 
            "Maths", "Economics", "Government", "Literature"
          ].map((tag) => (
            <span
              key={tag}
              className="text-xs font-bold text-slate-600 bg-slate-200/50 border border-slate-300 px-3 py-1 rounded-md"
            >
              {tag.toUpperCase()}
            </span>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
}