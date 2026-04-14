import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { useQuiz } from "../context/QuizContext";
import { buildOptions } from "../lib/helpers";
import AnswerOption from "../components/AnswerOption";
import Timer from "../components/Timer";
import ProgressBar from "../components/ProgressBar";
import QuestionGrid from "../components/QuestionGrid";
import SubmitModal from "../components/SubmitModal";
import Calculator from "../components/calculator";

export default function Quiz() {
  const navigate = useNavigate();

  const {
    questions,
    currentIndex,
    currentQuestion,
    answers,
    answeredSet,
    answeredCount,
    secondsLeft,
    status,
    selectAnswer,
    goToQuestion,
    nextQuestion,
    prevQuestion,
    submitTest,
    subjectNames, 
  } = useQuiz();

  const [gridOpen, setGridOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [calcOpen, setCalcOpen] = useState(false);

  useEffect(() => {
    if (status === "idle") navigate("/setup", { replace: true });
    if (status === "submitted") navigate("/results", { replace: true });
  }, [status, navigate]);

  async function handleConfirmSubmit() {
    setSubmitting(true);
    setModalOpen(false);
    await submitTest();
  }

  if (!currentQuestion || status === "loading") {
    return (
      <div className="h-screen flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-full border-[3px] border-slate-200 border-t-blue-600 animate-spin" />
          <p className="text-xs font-bold uppercase tracking-widest text-slate-400">Synchronizing Exam Data</p>
        </div>
      </div>
    );
  }

  const options = buildOptions(currentQuestion);
  const selectedLetter = answers[currentQuestion.id] ?? null;
  const isFirst = currentIndex === 0;
  const isLast = currentIndex === questions.length - 1;

  return (
    <div className="h-screen flex flex-col bg-slate-50 font-sans text-slate-900 overflow-hidden">
      
      <header className="bg-white border-b border-slate-200 shadow-sm z-30">
        <ProgressBar
          answered={answeredCount}
          total={questions.length}
          showLabel={false}
        />
        
        <div className="max-w-3xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Timer totalSeconds={secondsLeft}  />
            <div className="h-6 w-[1px] bg-slate-200 hidden sm:block" />
            <span className="text-xs font-bold text-slate-500 uppercase tracking-widest tabular-nums">
              Question <span className="text-blue-600 text-sm">{currentIndex + 1}</span> of {questions.length}
            </span>
          </div>

          <button
            onClick={() => setGridOpen(true)}
            className="flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-100 text-slate-600 hover:bg-blue-50 hover:text-blue-600 transition-all border border-transparent hover:border-blue-100"
          >
            <span className="text-[10px] font-bold uppercase tracking-wider hidden sm:block">Navigator</span>
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16"/>
            </svg>
          </button>

          <button
  onClick={() => setCalcOpen(true)}
  className="flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-100 text-slate-600 hover:bg-orange-50 hover:text-orange-600 transition-all border border-transparent hover:border-orange-100"
>
  <span className="text-[10px] font-bold uppercase tracking-wider hidden sm:block">Calc</span>
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
  </svg>
</button>
        </div>
      </header>



      <main className="flex-1 overflow-y-auto">
        <div className="max-w-3xl mx-auto px-6 py-10">
          
          <div className="flex items-center gap-2 mb-6">
            <span className={`text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded border ${
              currentQuestion.difficulty === "easy" ? "bg-emerald-50 text-emerald-700 border-emerald-100" :
              currentQuestion.difficulty === "medium" ? "bg-amber-50 text-amber-700 border-amber-100" :
              "bg-rose-50 text-rose-700 border-rose-100"
            }`}>
              {currentQuestion.difficulty}
            </span>
            <span className="text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded bg-slate-100 text-slate-600 border border-slate-200">
              {currentQuestion.subject}
            </span>
          </div>

          <div className="mb-10">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-800 leading-relaxed">
              <span className="text-blue-600 mr-3 font-black select-none opacity-50">{currentIndex + 1}.</span>
              {currentQuestion.question_text}
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-3 mb-12">
            {["A", "B", "C", "D"].map((letter) => {
              if (!options[letter]) return null;
              return (
                <AnswerOption
                  key={letter}
                  letter={letter}
                  text={options[letter]}
                  state={selectedLetter === letter ? "selected" : "idle"}
                  onClick={() => selectAnswer(currentQuestion.id, letter)}
                />
              );
            })}
          </div>
        </div>
      </main>

      <footer className="bg-white border-t border-slate-200 px-6 py-4">
        <div className="max-w-3xl mx-auto flex items-center justify-between gap-4">
          <div className="flex gap-2">
            <button
              onClick={prevQuestion}
              disabled={isFirst}
              className="px-6 py-3 rounded-xl text-xs font-bold uppercase tracking-widest border border-slate-200 text-slate-500 hover:bg-slate-50 disabled:opacity-30 transition-all"
            >
              Back
            </button>
            <button
              onClick={nextQuestion}
              disabled={isLast}
              className="px-6 py-3 rounded-xl text-xs font-bold uppercase tracking-widest border border-slate-200 text-slate-700 hover:bg-slate-50 disabled:opacity-30 transition-all"
            >
              Next
            </button>
          </div>

          <button
            onClick={() => setModalOpen(true)}
            disabled={submitting}
            className="px-8 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-lg shadow-blue-200 transition-all active:scale-[0.98] disabled:opacity-50"
          >
            {submitting ? "Processing..." : `Finish Exam (${answeredCount}/${questions.length})`}
          </button>
        </div>
      </footer>

      <QuestionGrid
        open={gridOpen}
        questions={questions}
    subjectNames={subjectNames} 
        total={questions.length}
        currentIndex={currentIndex}
        answeredSet={answeredSet}
        onJump={goToQuestion}
        onClose={() => setGridOpen(false)}
      />

      <SubmitModal
        open={modalOpen}
        answered={answeredCount}
        total={questions.length}
        onConfirm={handleConfirmSubmit}
        onCancel={() => setModalOpen(false)}
      />

      <Calculator isOpen={calcOpen} onClose={() => setCalcOpen(false)} />
    </div>
  );
}