"use client";

import { Square } from "lucide-react";

interface StopButtonProps {
  onStop: () => void;
  className?: string;
}

export function StopButton({ onStop, className = "" }: StopButtonProps) {
  return (
    <button
      onClick={onStop}
      className={`inline-flex items-center gap-2 rounded-xl border border-rose-200 bg-rose-50 dark:border-rose-950 dark:bg-rose-950/20 px-4 py-2 text-xs font-semibold text-rose-600 dark:text-rose-400 shadow-sm transition hover:bg-rose-100 dark:hover:bg-rose-950/40 focus:outline-none focus:ring-2 focus:ring-rose-500/20 ${className}`}
      type="button"
      aria-label="Stop generating response"
    >
      <Square className="h-3 w-3 fill-current" />
      <span>Stop Generation</span>
    </button>
  );
}
