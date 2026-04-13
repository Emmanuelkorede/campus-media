// TODO
import {
  createContext, useContext, useState,
  useEffect, useCallback, useRef,
} from "react";
import { supabase } from "../lib/supabase";
import { shuffleArray, pickQuestions, scoreSummary } from "../lib/helpers";
import { useAuth } from "./AuthContext";

// ─────────────────────────────────────────────
//  QUIZ CONTEXT
//
//  Manages everything about an active test:
//    - fetching & shuffling questions
//    - tracking which answer the user picked
//    - the countdown timer
//    - submitting and saving results to Supabase
//
//  Wrap only the quiz pages in <QuizProvider>
//  (or wrap the whole app — it's stateless when
//  no test is running so either is fine).
//
//  Read state with useQuiz():
//    questions      – array of question objects for this test
//    currentIndex   – 0-based index of the visible question
//    answers        – Map { questionId → "A"|"B"|"C"|"D" }
//    secondsLeft    – live countdown value
//    status         – "idle" | "loading" | "active" | "submitted"
//    result         – summary object after submission (or null)
//    error          – string | null
//
//  Call these:
//    startTest(subjectSlugs, questionCount, durationSecs)
//    selectAnswer(questionId, letter)
//    goToQuestion(index)
//    nextQuestion()
//    prevQuestion()
//    submitTest()
// ─────────────────────────────────────────────

const QuizContext = createContext(null);

export function QuizProvider({ children }) {
  const { user } = useAuth();

  // ── Core state ────────────────────────────
  const [questions,     setQuestions]     = useState([]);
  const [currentIndex,  setCurrentIndex]  = useState(0);
  const [answers,       setAnswers]       = useState({});     // { [questionId]: "A"|"B"|"C"|"D" }
  const [secondsLeft,   setSecondsLeft]   = useState(0);
  const [totalDuration, setTotalDuration] = useState(0);
  const [status,        setStatus]        = useState("idle"); // idle | loading | active | submitted
  const [result,        setResult]        = useState(null);
  const [error,         setError]         = useState(null);
  const [subjectNames,  setSubjectNames]  = useState([]);

  // ── Timer ref ─────────────────────────────
  const timerRef = useRef(null);

  // ── Clear timer on unmount ────────────────
  useEffect(() => {
    return () => clearInterval(timerRef.current);
  }, []);

  // ── START TEST ────────────────────────────
  // subjectSlugs  – e.g. ["english", "biology", "chemistry", "physics"]
  // questionCount – total questions to serve (e.g. 160)
  // durationSecs  – timer seconds (e.g. 2700 = 45 min)
  const startTest = useCallback(async (subjectSlugs, questionCount, durationSecs) => {
    setStatus("loading");
    setError(null);
    setResult(null);
    setAnswers({});
    setCurrentIndex(0);

    // Fetch questions for all selected subjects
    const { data, error: fetchErr } = await supabase
      .from("questions")
      .select("id, subject, question_text, option_a, option_b, option_c, option_d, correct_option, explanation, difficulty")
      .in("subject", subjectSlugs.map((s) => slugToName(s)));

    if (fetchErr || !data?.length) {
      setError("Could not load questions. Please try again.");
      setStatus("idle");
      return;
    }

    // Shuffle and cap at questionCount
    const picked = pickQuestions(data, questionCount);
    setQuestions(picked);
    setSubjectNames([...new Set(picked.map((q) => q.subject))]);

    // Start timer
    setSecondsLeft(durationSecs);
    setTotalDuration(durationSecs);
    clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          // Auto-submit when time runs out
          // We call the ref version to avoid stale closure
          handleAutoSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    setStatus("active");
  }, []); // eslint-disable-line

  // ── SELECT ANSWER ─────────────────────────
  const selectAnswer = useCallback((questionId, letter) => {
    setAnswers((prev) => ({ ...prev, [questionId]: letter }));
  }, []);

  // ── NAVIGATION ────────────────────────────
  const goToQuestion = useCallback((index) => {
    setCurrentIndex(index);
  }, []);

  const nextQuestion = useCallback(() => {
    setCurrentIndex((prev) => Math.min(prev + 1, questions.length - 1));
  }, [questions.length]);

  const prevQuestion = useCallback(() => {
    setCurrentIndex((prev) => Math.max(prev - 1, 0));
  }, []);

  // ── SUBMIT TEST ───────────────────────────
  const submitTest = useCallback(async () => {
    clearInterval(timerRef.current);
    await saveSession();
  }, [answers, questions, secondsLeft, totalDuration, user, subjectNames]); // eslint-disable-line

  // ── AUTO-SUBMIT (called by timer) ─────────
  // Uses a ref so it can be called from inside setInterval
  function handleAutoSubmit() {
    clearInterval(timerRef.current);
    saveSession();
  }

  // ── SAVE SESSION TO SUPABASE ──────────────
  async function saveSession() {
    const summary  = scoreSummary(answers, questions);
    const timeTaken = totalDuration - secondsLeft;

    // 1. Insert session row
    const { data: session, error: sessionErr } = await supabase
      .from("test_sessions")
      .insert({
        user_id:          user?.id ?? null,
        stream:           user?.stream ?? "unknown",
        subjects:         subjectNames,
        total_questions:  summary.total,
        total_correct:    summary.correct,
        total_wrong:      summary.wrong,
        total_attempted:  summary.attempted,
        score_percent:    summary.percent,
        grade:            summary.grade,
        time_taken_seconds: timeTaken,
      })
      .select("id")
      .single();

    if (sessionErr || !session) {
      // Still show results locally even if DB save failed
      setResult({ ...summary, timeTakenSecs: timeTaken, saved: false });
      setStatus("submitted");
      return;
    }

    // 2. Insert individual answer rows (bulk)
    const answerRows = questions.map((q) => ({
      session_id:      session.id,
      question_id:     q.id,
      selected_option: answers[q.id] ?? null,
      is_correct:      answers[q.id] === q.correct_option,
    }));

    await supabase.from("test_answers").insert(answerRows);

    setResult({
      ...summary,
      timeTakenSecs: timeTaken,
      sessionId:     session.id,
      saved:         true,
    });
    setStatus("submitted");
  }

  // ── RESET (for "Take Another Test") ───────
  const resetQuiz = useCallback(() => {
    clearInterval(timerRef.current);
    setQuestions([]);
    setCurrentIndex(0);
    setAnswers({});
    setSecondsLeft(0);
    setResult(null);
    setError(null);
    setStatus("idle");
    setSubjectNames([]);
  }, []);

  // ── Derived helpers ───────────────────────
  const currentQuestion  = questions[currentIndex] ?? null;
  const answeredSet      = new Set(
    questions.map((q, i) => (answers[q.id] ? i : null)).filter((i) => i !== null)
  );
  const answeredCount    = Object.keys(answers).length;

  const value = {
    // State
    questions,
    currentIndex,
    currentQuestion,
    answers,
    answeredSet,
    answeredCount,
    secondsLeft,
    totalDuration,
    status,
    result,
    error,
    subjectNames,
    // Actions
    startTest,
    selectAnswer,
    goToQuestion,
    nextQuestion,
    prevQuestion,
    submitTest,
    resetQuiz,
  };

  return (
    <QuizContext.Provider value={value}>
      {children}
    </QuizContext.Provider>
  );
}

// ── Hook ──────────────────────────────────────
export function useQuiz() {
  const ctx = useContext(QuizContext);
  if (!ctx) {
    throw new Error("useQuiz must be used inside <QuizProvider>");
  }
  return ctx;
}

// ── Internal: map slug → display name ─────────
// Must match the `subject` column values in your DB
function slugToName(slug) {
  const MAP = {
    english:    "Use of English",
    maths:      "Mathematics",
    physics:    "Physics",
    chemistry:  "Chemistry",
    biology:    "Biology",
    geography:  "Geography",
    government: "Government",
    literature: "Literature",
    crs:        "CRS",
    irk:        "IRK",
    history:    "History",
    economics:  "Economics",
    commerce:   "Commerce",
    accounting: "Accounting",
  };
  return MAP[slug] ?? slug;
}