import { useState } from "react";

export default function HelpSupport({ onBack }) {
  const [feedback, setFeedback] = useState("");
  const [error, setError] = useState(false);
  const MY_NUMBER = "+2349122865246";

  const handleWhatsAppRedirect = () => {
    if (!feedback.trim()) {
      setError(true);
      setTimeout(() => setError(false), 3000);
      return;
    }
    
    const message = encodeURIComponent(`CAMPUS MEDIA CBT/Feedback: \n\n${feedback}`);
    const whatsappUrl = `https://wa.me/${MY_NUMBER}?text=${message}`;
    window.open(whatsappUrl, "_blank");
  };

  return (
    <div className="max-w-2xl mx-auto p-4 animate-in slide-in-from-right duration-300">
      <button onClick={onBack} className="mb-8 text-slate-400 font-bold flex items-center gap-2 hover:text-slate-600 transition-colors">
        <span className="text-lg">←</span> Help & Support
      </button>
      
      <div className="bg-white border border-slate-100 rounded-[2.5rem] p-8 shadow-sm">
        <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center text-3xl mx-auto mb-4">
          🎧
        </div>
        <h2 className="text-xl font-black text-slate-800 text-center">How can we help?</h2>
        <p className="text-slate-400 text-xs text-center mt-2 mb-8 uppercase font-bold tracking-tighter">
          Send a message directly to our team
        </p>
        
        <div className="space-y-4">
          <textarea 
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            placeholder={error ? "Please type your message here first!" : "Describe your issue or give us feedback here..."}
            className={`w-full border rounded-3xl p-6 h-48 outline-none bg-slate-50/50 font-medium text-sm transition-all ${
              error ? "border-rose-400 placeholder-rose-400" : "border-slate-100 focus:border-blue-400"
            }`}
          />
          
          <button 
            onClick={handleWhatsAppRedirect}
            className="w-full bg-emerald-500 text-white font-black py-5 rounded-[1.5rem] flex items-center justify-center gap-3 hover:bg-emerald-600 shadow-lg shadow-emerald-100 transition-all active:scale-95"
          >
            <span>💬</span> SUBMIT TO WHATSAPP
          </button>
        </div>
      </div>
    </div>
  );
}