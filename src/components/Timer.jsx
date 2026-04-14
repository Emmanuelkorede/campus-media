import React from "react";

export default function Timer({ totalSeconds = 0 }) {
  // ── Format mm:ss ──────────────────────────
  const mins = Math.floor(totalSeconds / 60);
  const secs = totalSeconds % 60;
  const display = `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;

  // ── Urgency levels ────────────────────────
  const isWarning  = totalSeconds <= 300 && totalSeconds > 60;  // ≤ 5 min
  const isCritical = totalSeconds <= 60;                        // ≤ 1 min

  return (
    <div
      className={`
        inline-flex items-center gap-1.5
        font-black text-xl sm:text-2xl tracking-tight tabular-nums
        transition-colors duration-500
        ${isCritical  ? "text-red-500 animate-pulse" : ""}
        ${isWarning && !isCritical ? "text-amber-500" : ""}
        ${!isWarning && !isCritical ? "text-gray-800"  : ""}
      `}
    >
      <svg
        className={`w-5 h-5 shrink-0 ${
          isCritical ? "fill-red-400" : 
          isWarning ? "fill-amber-400" : "fill-gray-400"
        }`}
        viewBox="0 0 20 20"
      >
        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
      </svg>
      {display}
    </div>
  );
}