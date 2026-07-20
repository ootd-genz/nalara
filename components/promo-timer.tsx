"use client";

import { useEffect, useState } from "react";
import { Clock3 } from "lucide-react";

const PROMO_DURATION = 60 * 60 * 1_000;
const PAUSE_DURATION = 10 * 60 * 1_000;
const CYCLE_DURATION = PROMO_DURATION + PAUSE_DURATION;
const STORAGE_KEY = "nalara-promo-cycle-start-v1";

export type TimerState = {
  phase: "promo" | "pause";
  remaining: number;
};

function readTimerState(now: number, startedAt: number): TimerState {
  const elapsed = Math.max(0, now - startedAt) % CYCLE_DURATION;
  if (elapsed < PROMO_DURATION) {
    return { phase: "promo", remaining: PROMO_DURATION - elapsed };
  }
  return { phase: "pause", remaining: CYCLE_DURATION - elapsed };
}

function formatTime(milliseconds: number) {
  const totalSeconds = Math.max(0, Math.ceil(milliseconds / 1_000));
  const hours = Math.floor(totalSeconds / 3_600);
  const minutes = Math.floor((totalSeconds % 3_600) / 60);
  const seconds = totalSeconds % 60;
  return [hours, minutes, seconds].map((value) => String(value).padStart(2, "0")).join(":");
}

export function usePromoTimer() {
  const [timer, setTimer] = useState<TimerState | null>(null);

  useEffect(() => {
    const now = Date.now();
    const storedValue = Number(window.localStorage.getItem(STORAGE_KEY));
    const startedAt = Number.isFinite(storedValue) && storedValue > 0 && storedValue <= now
      ? storedValue
      : now;

    if (startedAt === now) window.localStorage.setItem(STORAGE_KEY, String(startedAt));

    const update = () => setTimer(readTimerState(Date.now(), startedAt));
    update();
    const interval = window.setInterval(update, 1_000);
    return () => window.clearInterval(interval);
  }, []);

  return timer;
}

export function PromoTimer() {
  const timer = usePromoTimer();

  if (!timer || timer.phase === "pause") return null;

  const time = formatTime(timer.remaining);
  const label = "Promo berakhir dalam";

  return (
    <span
      className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-[var(--accent)]/25 bg-[var(--accent)]/10 px-2.5 py-1 font-mono text-[11px] font-bold tabular-nums text-[var(--accent)] motion-safe:animate-pulse sm:text-xs"
      role="timer"
      aria-label={`${label} ${time}`}
    >
      <Clock3 className="size-3.5" aria-hidden="true" />
      <span>{label}</span>
      <span>{time}</span>
    </span>
  );
}
