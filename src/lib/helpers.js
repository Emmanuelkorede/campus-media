

export function calcGrade(percent) {
  const p = Number(percent);
  if (p >= 80) return "A";
  if (p >= 65) return "B";
  if (p >= 50) return "C";
  if (p >= 40) return "D";
  if (p >= 30) return "E";
  return "F";
}




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



export function calcPercent(correct, total) {
  if (!total || total === 0) return 0;
  return Math.round((correct / total) * 100);
}




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




export function formatTimeLong(totalSeconds) {
  if (!totalSeconds) return "0 sec";
  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  const s = totalSeconds % 60;

  if (h > 0) return `${h} hr ${m} min`;
  if (m > 0) return `${m} min ${s} sec`;
  return `${s} sec`;
}




export function shuffleArray(array) {
  const arr = [...array]; 
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}



export function pickQuestions(questions, count) {
  const shuffled = shuffleArray(questions);
  return shuffled.slice(0, count);
}




export function buildOptions(question) {
  return {
    A: question.option_a,
    B: question.option_b,
    C: question.option_c,
    D: question.option_d,
  };
}



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




export function truncate(text = "", maxLen = 80) {
  if (text.length <= maxLen) return text;
  return text.slice(0, maxLen).trimEnd() + "…";
}


export function capitalise(str = "") {
  if (!str) return "";
  return str.charAt(0).toUpperCase() + str.slice(1);
}




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