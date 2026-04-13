// TODO
// ─────────────────────────────────────────────
//  HELPERS
//  Pure utility functions. No imports needed.
//  Import whatever you need anywhere:
//    import { calcGrade, formatTime, shuffleArray } from "../lib/helpers";
// ─────────────────────────────────────────────


// ── 1. GRADE CALCULATOR ───────────────────────
// Returns a letter grade A–F from a percentage.
//
// Usage:
//   calcGrade(78)   → "B"
//   calcGrade(45)   → "D"

export function calcGrade(percent) {
  const p = Number(percent);
  if (p >= 80) return "A";
  if (p >= 65) return "B";
  if (p >= 50) return "C";
  if (p >= 40) return "D";
  if (p >= 30) return "E";
  return "F";
}


// ── 2. GRADE LABEL ────────────────────────────
// Returns the human-readable label for a grade.
//
// Usage:
//   gradeLabel("A")  → "Excellent"
//   gradeLabel("F")  → "Needs Improvement"

const GRADE_LABELS = {
  A: "Excellent",
  B: "Very Good",
  C: "Good",
  D: "Pass",
  E: "Below Average",
  F: "Needs Improvement",
};

export function gradeLabel(grade) {
  return GRADE_LABELS[grade] ?? "Unknown";
}


// ── 3. SCORE PERCENT ─────────────────────────
// Calculates percentage from correct / total.
// Returns 0 if total is 0 (avoids divide-by-zero).
//
// Usage:
//   calcPercent(28, 40)  → 70

export function calcPercent(correct, total) {
  if (!total || total === 0) return 0;
  return Math.round((correct / total) * 100);
}


// ── 4. FORMAT TIME ────────────────────────────
// Converts seconds into a readable time string.
//
// Usage:
//   formatTime(125)    → "02:05"
//   formatTime(3725)   → "1h 02m"
//   formatTime(0)      → "00:00"

export function formatTime(totalSeconds) {
  if (totalSeconds === null || totalSeconds === undefined) return "--:--";
  const secs = Math.max(0, Math.round(totalSeconds));
  const h    = Math.floor(secs / 3600);
  const m    = Math.floor((secs % 3600) / 60);
  const s    = secs % 60;

  if (h > 0) {
    return `${h}h ${String(m).padStart(2, "0")}m`;
  }
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}


// ── 5. FORMAT TIME LONG ──────────────────────
// Same as formatTime but always writes out words.
// Good for the results summary sentence.
//
// Usage:
//   formatTimeLong(125)   → "2 min 5 sec"
//   formatTimeLong(3601)  → "1 hr 0 min"

export function formatTimeLong(totalSeconds) {
  if (!totalSeconds) return "0 sec";
  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  const s = totalSeconds % 60;

  if (h > 0) return `${h} hr ${m} min`;
  if (m > 0) return `${m} min ${s} sec`;
  return `${s} sec`;
}


// ── 6. SHUFFLE ARRAY ─────────────────────────
// Returns a NEW shuffled copy of an array.
// Uses the Fisher-Yates algorithm.
// Does NOT mutate the original.
//

// Usage:
//   shuffleArray([1, 2, 3, 4])  → [3, 1, 4, 2] (random)

export function shuffleArray(array) {
  const arr = [...array]; // copy — never mutate source
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}


// ── 7. PICK RANDOM QUESTIONS ─────────────────
// Picks `count` random questions from an array,
// then shuffles the order.
//
// Usage:
//   pickQuestions(allBiologyQs, 40)

export function pickQuestions(questions, count) {
  const shuffled = shuffleArray(questions);
  return shuffled.slice(0, count);
}


// ── 8. BUILD OPTIONS OBJECT ──────────────────
// Converts a flat question row from Supabase
// into the { A, B, C, D } shape QuestionCard expects.
//
// Usage:
//   buildOptions(row)
//   → { A: "...", B: "...", C: "...", D: "..." }

export function buildOptions(question) {
  return {
    A: question.option_a,
    B: question.option_b,
    C: question.option_c,
    D: question.option_d,
  };
}


// ── 9. SCORE SUMMARY ─────────────────────────
// Takes the answers map { questionId: "A"|"B"|"C"|"D" }
// and the questions array, returns a full summary object.
//
// Usage:
//   scoreSummary(answersMap, questions)

export function scoreSummary(answersMap, questions) {
  let correct   = 0;
  let wrong     = 0;
  let attempted = 0;

  questions.forEach((q) => {
    const selected = answersMap[q.id];
    if (!selected) return;
    attempted++;
    if (selected === q.correct_option) {
      correct++;
    } else {
      wrong++;
    }
  });

  const total   = questions.length;
  const percent = calcPercent(correct, total);
  const grade   = calcGrade(percent);

  return { correct, wrong, attempted, total, percent, grade };
}


// ── 10. TRUNCATE TEXT ────────────────────────
// Cuts text to `maxLen` characters with ellipsis.
// Useful for long question previews.
//
// Usage:
//   truncate("Which of the following...", 60)

export function truncate(text = "", maxLen = 80) {
  if (text.length <= maxLen) return text;
  return text.slice(0, maxLen).trimEnd() + "…";
}


// ── 11. CAPITALISE FIRST LETTER ──────────────
export function capitalise(str = "") {
  if (!str) return "";
  return str.charAt(0).toUpperCase() + str.slice(1);
}


// ── 12. GET STREAM SUBJECTS ──────────────────
// Returns the list of subjects available for a stream.
// Matches the subject slugs in your Supabase subjects table.

const STREAM_SUBJECTS = {
  science: [
    { name: "Use of English", slug: "english",   emoji: "📝", count: 40 },
    { name: "Mathematics",    slug: "maths",     emoji: "🔢", count: 40 },
    { name: "Physics",        slug: "physics",   emoji: "⚡", count: 40 },
    { name: "Chemistry",      slug: "chemistry", emoji: "🧪", count: 40 },
    { name: "Biology",        slug: "biology",   emoji: "🌿", count: 40 },
    
  ],
  arts: [
    { name: "Use of English", slug: "english",    emoji: "📝", count: 40 },
    { name: "Government",     slug: "government", emoji: "🏛️", count: 40 },
    { name: "Literature",     slug: "literature", emoji: "📚", count: 40 },
    { name: "CRS",            slug: "crs",        emoji: "✝️", count: 40 },
    
  ],
  commercial: [
    { name: "Use of English", slug: "english",     emoji: "📝", count: 40 },
    { name: "Mathematics",    slug: "maths",       emoji: "🔢", count: 40 },
    { name: "Economics",      slug: "economics",   emoji: "📈", count: 40 },
    { name: "Commerce",       slug: "commerce",    emoji: "🛒", count: 40 },

    { name: "Government",     slug: "government",  emoji: "🏛️", count: 40 },
  ],
};

export function getStreamSubjects(stream) {
  return STREAM_SUBJECTS[stream] ?? [];
}