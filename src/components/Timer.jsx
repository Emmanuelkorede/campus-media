import { useState, useEffect, useRef } from "react";

// ─────────────────────────────────────────────
//  TIMER
//  Counts down from `totalSeconds`. Calls
//  `onExpire` when it hits zero.
//  Turns amber at 5 min remaining, red at 1 min.
//
//  Props:
//    totalSeconds  – starting seconds (e.g. 2700 = 45 min)
//    onExpire      – fn() called when time runs out
//    paused        – bool, freezes the countdown
//    onTick        – optional fn(secondsLeft) called every second
// ─────────────────────────────────────────────

export default function Timer({
  totalSeconds = 2700,
  onExpire,
  paused = false,
  onTick,
}) {
  const [secondsLeft, setSecondsLeft] = useState(totalSeconds);
  const intervalRef = useRef(null);

  // ── Countdown engine ──────────────────────
  useEffect(() => {
    if (paused) {
      clearInterval(intervalRef.current);
      return;
    }

    intervalRef.current = setInterval(() => {
      setSecondsLeft((prev) => {
        const next = prev - 1;
        if (onTick) onTick(next);
        if (next <= 0) {
          clearInterval(intervalRef.current);
          if (onExpire) onExpire();
          return 0;
        }
        return next;
      });
    }, 1000);

    return () => clearInterval(intervalRef.current);
  }, [paused, onExpire, onTick]);

  // ── Format mm:ss ──────────────────────────
  const mins = Math.floor(secondsLeft / 60);
  const secs = secondsLeft % 60;
  const display = `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;

  // ── Urgency levels ────────────────────────
  const isWarning  = secondsLeft <= 300 && secondsLeft > 60;  // ≤ 5 min → amber
  const isCritical = secondsLeft <= 60;                        // ≤ 1 min → red + pulse

  return (
    <div
      className={`
        inline-flex items-center gap-1.5
        font-black text-xl sm:text-2xl tracking-tight tabular-nums
        transition-colors duration-500
        ${isCritical  ? "text-red-500"    : ""}
        ${isWarning && !isCritical ? "text-amber-500" : ""}
        ${!isWarning && !isCritical ? "text-gray-800"  : ""}
        ${isCritical ? "animate-pulse" : ""}
      `}
      aria-live="polite"
      aria-label={`Time remaining: ${mins} minutes ${secs} seconds`}
    >
      {/* Clock icon – changes colour with the number */}
      <svg
        className={`
          w-5 h-5 shrink-0
          ${isCritical ? "fill-red-400"    : ""}
          ${isWarning && !isCritical ? "fill-amber-400" : ""}
          ${!isWarning && !isCritical ? "fill-gray-400"  : ""}
        `}
        viewBox="0 0 20 20"
      >
        <path
          fillRule="evenodd"
          d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
          clipRule="evenodd"
        />
      </svg>

      {display}
    </div>
  );
}