import { useState } from "react";
import { useNavigate } from "react-router";
import { useQuiz } from "../context/QuizContext";
import { useAuth } from "../context/AuthContext";
import { buildOptions } from "../lib/helpers";
import ResultCard from "../components/ResultCard";
import AnswerOption from "../components/AnswerOption";
import Footer from "../components/Footer";

export default function Results() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { result, questions, answers, resetQuiz, subjectNames } = useQuiz();

  const [reviewOpen, setReviewOpen] = useState(false);

  if (!result) {
    navigate("/setup", { replace: true });
    return null;
  }

  function handleTakeAnother() {
    resetQuiz();
    navigate("/setup");
  }

  function handleChangeStream() {
    resetQuiz();
    navigate("/stream");
  }

  function handleLogout() {
    resetQuiz();
    logout();
    navigate("/");
  }

  function getOptionState(question, letter) {
    const selected = answers[question.id];
    const correct = question.correct_option;
    if (letter === correct) return "correct";
    if (letter === selected && letter !== correct) return "wrong";
    return "dimmed";
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 font-sans text-slate-900">
      
      
      <header className="w-full bg-white/90 backdrop-blur-md border-b border-slate-200 sticky top-0 z-30">
        <div className="max-w-xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <svg width="80" height="80" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M10 45L50 25L90 45L50 65L10 45Z" fill="#2563eb" />
  <path d="M25 53V70C25 70 35 75 50 75C65 75 75 70 75 70V53" stroke="#1d4ed8" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
  
  <path d="M90 45V65M87 65H93V75L90 80L87 75V65Z" stroke="#10b981" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />

  
  <circle cx="50" cy="45" r="18" fill="white" stroke="#1e293b" strokeWidth="2" />
  <circle cx="50" cy="45" r="12" stroke="#f59e0b" strokeWidth="3" strokeDasharray="6 4" />
  <circle cx="50" cy="45" r="4" fill="#1e293b" />
</svg>
            <span className="font-extrabold text-sm tracking-tight text-slate-800">
              Campus<span className="text-blue-600">Media</span>
            </span>
          </div>
          <div className="px-3 py-1 rounded-full bg-slate-100 border border-slate-200">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
              {user?.name}
            </span>
          </div>
        </div>
      </header>

      <main className="flex-1 w-full max-w-xl mx-auto px-6 py-10 space-y-8">

        
        <ResultCard
          username={user?.name ?? "Student"}
          scorePercent={result.percent}
          correct={result.correct}
          wrong={result.wrong}
          attempted={result.attempted}
          total={result.total}
          timeTakenSecs={result.timeTakenSecs}
          subjects={subjectNames}
        />

        
        <div className="grid grid-cols-1 gap-3">
          <button
            onClick={handleTakeAnother}
            className="w-full bg-blue-600 hover:bg-blue-700 active:scale-[0.98] text-white font-bold py-4 rounded-xl shadow-xl shadow-blue-100 transition-all flex items-center justify-center gap-2"
          >
            Retake or New Test
          </button>

          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={handleChangeStream}
              className="bg-white border border-slate-200 hover:border-blue-200 hover:text-blue-600 text-slate-600 font-bold py-3.5 rounded-xl transition-all text-sm"
            >
              Change Stream
            </button>
            <button
              onClick={handleLogout}
              className="bg-white border border-slate-200 hover:bg-rose-50 hover:text-rose-600 text-slate-500 font-bold py-3.5 rounded-xl transition-all text-sm"
            >
              Sign Out
            </button>
          </div>
        </div>

        
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden transition-all">
          <button
            onClick={() => setReviewOpen((v) => !v)}
            className="w-full flex items-center justify-between px-6 py-5 hover:bg-slate-50 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div className="text-left">
                <p className="font-bold text-slate-800 text-sm">Review Answers</p>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{questions.length} Questions Analyzed</p>
              </div>
            </div>
            <svg
              className={`w-5 h-5 text-slate-400 transition-transform duration-300 ${reviewOpen ? "rotate-180" : ""}`}
              fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7"/>
            </svg>
          </button>

          {reviewOpen && (
            <div className="divide-y divide-slate-100 border-t border-slate-100 bg-white">
              {questions.map((q, i) => {
                const userAnswer = answers[q.id];
                const isCorrect = userAnswer === q.correct_option;
                const wasAttempted = !!userAnswer;
                const opts = buildOptions(q);

                return (
                  <div key={q.id} className="px-6 py-8">
                    <div className="flex items-start gap-4 mb-4">
                      <span className={`w-7 h-7 rounded-lg shrink-0 flex items-center justify-center text-xs font-black shadow-sm ${
                        !wasAttempted ? "bg-slate-100 text-slate-400" :
                        isCorrect ? "bg-emerald-500 text-white" : "bg-rose-500 text-white"
                      }`}>
                        {i + 1}
                      </span>
                      <p className="text-sm font-bold text-slate-800 leading-relaxed pt-0.5">
                        {q.question_text}
                      </p>
                    </div>

                    <div className="space-y-2 ml-11">
                      {["A", "B", "C", "D"].map((letter) => {
                        if (!opts[letter]) return null;
                        return (
                          <AnswerOption
                            key={letter}
                            letter={letter}
                            text={opts[letter]}
                            state={getOptionState(q, letter)}
                            disabled
                          />
                        );
                      })}
                    </div>

                    {q.explanation && (
                      <div className="mt-5 ml-11 p-4 bg-blue-50 rounded-xl border border-blue-100">
                        <p className="text-[10px] font-black uppercase tracking-[0.15em] text-blue-600 mb-1.5">Context & Explanation</p>
                        <p className="text-xs text-blue-800 font-medium leading-normal italic">
                          "{q.explanation}"
                        </p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        

      </main>

      <Footer />
    </div>
  );
}