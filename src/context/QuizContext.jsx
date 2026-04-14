import {
  createContext, useContext, useState,
  useEffect, useCallback, useRef,
} from "react";
import { supabase } from "../lib/supabase";
import { pickQuestions, scoreSummary } from "../lib/helpers";
import { useAuth } from "./AuthContext";

const QuizContext = createContext(null);

export function QuizProvider({ children }) {
  const { user } = useAuth();

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

  const startTest = useCallback(async (subjectSlugs, questionCount, durationSecs) => {
    setStatus("loading");
    setError(null);
    setResult(null);
    setAnswers({});
    setCurrentIndex(0);

    const { data, error: fetchErr } = await supabase
      .from("questions")
      .select("id, subject, question_text, option_a, option_b, option_c, option_d, correct_option, explanation, difficulty")
      .in("subject", subjectSlugs.map((s) => slugToName(s)));

    if (fetchErr || !data?.length) {
      setError("Could not load questions. Please try again.");
      setStatus("idle");
      return;
    }

    // 1. Shuffle and pick the total count
    const picked = pickQuestions(data, questionCount);

    // 2. NEW: Group by subject (Sorting)
    const sortedQuestions = [...picked].sort((a, b) => {
      return a.subject.localeCompare(b.subject);
    });

    setQuestions(sortedQuestions);

    // 3. Set the subject names in the order they appear
    const uniqueSubjects = [...new Set(sortedQuestions.map((q) => q.subject))];
    setSubjectNames(uniqueSubjects);

    // ── Timer logic ──
    setSecondsLeft(durationSecs);
    setTotalDuration(durationSecs);
    clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
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
  function handleAutoSubmit() {
    clearInterval(timerRef.current);
    saveSession();
  }

  // ── SAVE SESSION TO SUPABASE ──────────────
  async function saveSession() {
    const summary  = scoreSummary(answers, questions);
    const timeTaken = totalDuration - secondsLeft;

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
      setResult({ ...summary, timeTakenSecs: timeTaken, saved: false });
      setStatus("submitted");
      return;
    }

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

export function useQuiz() {
  const ctx = useContext(QuizContext);
  if (!ctx) {
    throw new Error("useQuiz must be used inside <QuizProvider>");
  }
  return ctx;
}

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