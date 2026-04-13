
const GRADE_CONFIG = {
  A: { label: "Excellent",        ring: "stroke-green-500",  text: "text-green-500",  bg: "bg-green-50",  border: "border-green-100" },
  B: { label: "Very Good",        ring: "stroke-teal-500",   text: "text-teal-500",   bg: "bg-teal-50",   border: "border-teal-100"  },
  C: { label: "Good",             ring: "stroke-blue-500",   text: "text-blue-500",   bg: "bg-blue-50",   border: "border-blue-100"  },
  D: { label: "Pass",             ring: "stroke-yellow-500", text: "text-yellow-600", bg: "bg-yellow-50", border: "border-yellow-100"},
  E: { label: "Below Average",    ring: "stroke-orange-500", text: "text-orange-500", bg: "bg-orange-50", border: "border-orange-100"},
  F: { label: "Needs Improvement",ring: "stroke-red-500",    text: "text-red-500",    bg: "bg-red-50",    border: "border-red-100"   },
};

// ── Helpers ───────────────────────────────────
function calcGrade(pct) {
  if (pct >= 80) return "A";
  if (pct >= 65) return "B";
  if (pct >= 50) return "C";
  if (pct >= 40) return "D";
  if (pct >= 30) return "E";
  return "F";
}

function formatTime(secs) {
  if (!secs && secs !== 0) return "--:--";
  const h = Math.floor(secs / 3600);
  const m = Math.floor((secs % 3600) / 60);
  const s = secs % 60;
  if (h > 0) return `${h}h ${String(m).padStart(2, "0")}m`;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

// ── Circular score ring ───────────────────────
function ScoreRing({ pct, grade }) {
  const cfg    = GRADE_CONFIG[grade] ?? GRADE_CONFIG.F;
  const radius = 52;
  const circ   = 2 * Math.PI * radius;
  const offset = circ - (pct / 100) * circ;

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width="140" height="140" className="-rotate-90">
        {/* Track */}
        <circle cx="70" cy="70" r={radius}
          fill="none" stroke="#e5e7eb" strokeWidth="9" />
        {/* Progress */}
        <circle cx="70" cy="70" r={radius}
          fill="none"
          strokeWidth="9"
          strokeLinecap="round"
          strokeDasharray={circ}
          strokeDashoffset={offset}
          className={`${cfg.ring} transition-all duration-1000 ease-out`}
        />
      </svg>

      {/* Centre text */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className={`text-3xl font-black leading-none tabular-nums ${cfg.text}`}>
          {Math.round(pct)}%
        </span>
        <span className={`text-xs font-bold mt-0.5 ${cfg.text}`}>
          Grade {grade}
        </span>
      </div>
    </div>
  );
}

// ── Single stat pill ──────────────────────────
function Stat({ label, value, valueClass = "text-gray-700" }) {
  return (
    <div className="flex flex-col items-center gap-0.5">
      <span className={`text-xl font-black tabular-nums leading-tight ${valueClass}`}>
        {value}
      </span>
      <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">
        {label}
      </span>
    </div>
  );
}

// ── Main export ───────────────────────────────
export default function ResultCard({
  username      = "Student",
  scorePercent  = 0,
  correct       = 0,
  wrong         = 0,
  attempted     = 0,
  total         = 40,
  timeTakenSecs = 0,
  subjects      = [],
}) {
  const pct   = Math.min(Math.max(Math.round(scorePercent), 0), 100);
  const grade = calcGrade(pct);
  const cfg   = GRADE_CONFIG[grade];

  return (
    <div className={`
      w-full max-w-sm mx-auto
      bg-white rounded-3xl border-2 ${cfg.border}
      shadow-xl overflow-hidden
    `}>

      {/* ── Top colour band ───────────────── */}
      <div className={`h-2 w-full ${cfg.bg}`} />

      {/* ── Score ring ────────────────────── */}
      <div className={`flex flex-col items-center px-7 pt-7 pb-5 ${cfg.bg}`}>
        <ScoreRing pct={pct} grade={grade} />

        <p className={`mt-2 font-black text-base ${cfg.text}`}>
          {cfg.label}
        </p>
        <p className="text-gray-500 text-sm mt-0.5">
          {correct} / {total} correct
        </p>

        {/* Name */}
        <div className="mt-3 flex items-center gap-2 bg-white/70 px-4 py-2 rounded-full border border-white shadow-sm">
          <div className="w-6 h-6 rounded-full bg-teal-500 flex items-center justify-center text-white text-xs font-black">
            {username[0]?.toUpperCase()}
          </div>
          <span className="text-sm font-bold text-gray-700">{username}</span>
        </div>
      </div>

      {/* ── Stats row ─────────────────────── */}
      <div className="grid grid-cols-4 divide-x divide-gray-100 border-t border-gray-100 bg-white">
        <div className="py-4">
          <Stat label="Time"      value={formatTime(timeTakenSecs)} />
        </div>
        <div className="py-4">
          <Stat label="Attempted" value={attempted} />
        </div>
        <div className="py-4">
          <Stat label="Correct"   value={correct}   valueClass="text-green-500" />
        </div>
        <div className="py-4">
          <Stat label="Wrong"     value={wrong}     valueClass="text-red-500"   />
        </div>
      </div>

      {/* ── Subjects tested ───────────────── */}
      {subjects.length > 0 && (
        <div className="px-5 py-4 border-t border-gray-100 bg-gray-50">
          <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold mb-2">
            Subjects tested
          </p>
          <div className="flex flex-wrap gap-1.5">
            {subjects.map((s) => (
              <span
                key={s}
                className="text-xs font-semibold bg-white border border-gray-200
                           text-gray-600 px-2.5 py-1 rounded-full"
              >
                {s}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}