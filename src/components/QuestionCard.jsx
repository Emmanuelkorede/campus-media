

const DIFFICULTY_STYLES = {
  easy:   "bg-green-100  text-green-700",
  medium: "bg-yellow-100 text-yellow-700",
  hard:   "bg-red-100    text-red-700",
};

const LETTERS = ["A", "B", "C", "D"];

export default function QuestionCard({
  questionNumber = 1,
  totalQuestions = 40,
  subject = "",
  difficulty = "medium",
  questionText = "",
  options = {},
  selected = null,
  correctOption = null,
  onSelect,
  reviewMode = false,
}) {
  function getOptionStyle(letter) {
    // ── review mode: show green/red ─────────
    if (reviewMode && correctOption) {
      if (letter === correctOption) {
        return "border-green-400 bg-green-50 text-green-800 shadow-sm shadow-green-100";
      }
      if (letter === selected && letter !== correctOption) {
        return "border-red-400 bg-red-50 text-red-800 shadow-sm shadow-red-100";
      }
      return "border-gray-200 bg-white text-gray-500 opacity-60";
    }

    // ── active quiz ─────────────────────────
    if (letter === selected) {
      return "border-teal-400 bg-teal-50 text-teal-800 shadow-md shadow-teal-100";
    }
    return "border-gray-200 bg-white text-gray-700 hover:border-teal-200 hover:shadow-sm";
  }

  function getLetterBadgeStyle(letter) {
    if (reviewMode && correctOption) {
      if (letter === correctOption) return "bg-green-500 text-white";
      if (letter === selected && letter !== correctOption) return "bg-red-500 text-white";
      return "bg-gray-200 text-gray-500";
    }
    if (letter === selected) return "bg-teal-500 text-white";
    return "bg-gray-100 text-gray-500";
  }

  return (
    <div className="w-full max-w-2xl mx-auto">

      {/* ── Badges row ──────────────────────── */}
      <div className="flex items-center gap-2 mb-4">
        {/* Difficulty */}
        <span className={`
          text-[11px] font-bold uppercase tracking-wider
          px-2.5 py-1 rounded-full
          ${DIFFICULTY_STYLES[difficulty] ?? DIFFICULTY_STYLES.medium}
        `}>
          {difficulty}
        </span>

        {/* Subject */}
        <span className="text-[11px] font-bold uppercase tracking-wider
                          px-2.5 py-1 rounded-full bg-blue-100 text-blue-700">
          {subject}
        </span>
      </div>

      {/* ── Question text ───────────────────── */}
      <p className="text-gray-800 font-semibold text-base sm:text-lg leading-snug mb-6">
        <span className="text-teal-500 font-black mr-1.5">Question {questionNumber} of {totalQuestions}.</span>
        {questionText}
      </p>

      {/* ── Options ─────────────────────────── */}
      <div className="flex flex-col gap-3">
        {LETTERS.map((letter) => {
          const text = options[letter];
          if (!text) return null;

          return (
            <button
              key={letter}
              onClick={() => !reviewMode && onSelect && onSelect(letter)}
              disabled={reviewMode}
              className={`
                flex items-center gap-3 w-full text-left
                border-2 rounded-2xl px-4 py-3.5
                transition-all duration-150
                active:scale-[0.99]
                ${getOptionStyle(letter)}
                ${reviewMode ? "cursor-default" : "cursor-pointer"}
              `}
            >
              {/* Letter badge */}
              <span className={`
                w-7 h-7 rounded-xl shrink-0
                flex items-center justify-center
                text-xs font-black transition-colors
                ${getLetterBadgeStyle(letter)}
              `}>
                {letter}
              </span>

              {/* Option text */}
              <span className="text-sm sm:text-base font-medium leading-snug">
                {text}
              </span>

              {/* Correct / Wrong icon in review mode */}
              {reviewMode && correctOption && letter === correctOption && (
                <svg className="w-5 h-5 fill-green-500 ml-auto shrink-0" viewBox="0 0 20 20">
                  <path fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 00-1.414 0L8 12.586l-3.293-3.293a1 1 0 00-1.414 1.414l4 4a1 1 0 001.414 0l8-8a1 1 0 000-1.414z"
                    clipRule="evenodd"/>
                </svg>
              )}
              {reviewMode && selected === letter && letter !== correctOption && (
                <svg className="w-5 h-5 fill-red-500 ml-auto shrink-0" viewBox="0 0 20 20">
                  <path fillRule="evenodd"
                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                    clipRule="evenodd"/>
                </svg>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}