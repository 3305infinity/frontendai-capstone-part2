"use client";

import { ArrowDown } from "lucide-react";

interface JumpToLatestProps {
  onClick: () => void;
  className?: string;
}

export function JumpToLatest({ onClick, className = "" }: JumpToLatestProps) {
  return (
    <button
      onClick={onClick}
      className={`inline-flex items-center gap-1.5 rounded-full bg-[var(--color-primary)] px-4 py-2 text-xs font-semibold text-white shadow-lg transition hover:scale-105 hover:bg-[var(--color-primary)]/90 active:scale-95 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/40 ${className}`}
      type="button"
      aria-label="Scroll to latest messages"
    >
      <ArrowDown className="h-3.5 w-3.5" />
      <span>Jump to latest</span>
    </button>
  );
}
