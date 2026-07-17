"use client";

export function ThinkingIndicator() {
  return (
    <div className="flex items-center gap-3 p-4 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl max-w-[240px] shadow-sm animate-pulse">
      {/* Three bouncing loading dots */}
      <div className="flex items-center gap-1.5">
        <div className="h-2 w-2 rounded-full bg-[var(--color-primary)] animate-bounce [animation-delay:-0.3s]"></div>
        <div className="h-2 w-2 rounded-full bg-[var(--color-primary)] animate-bounce [animation-delay:-0.15s]"></div>
        <div className="h-2 w-2 rounded-full bg-[var(--color-primary)] animate-bounce"></div>
      </div>
      <span className="text-xs font-semibold text-[var(--color-muted)]">Copilot is thinking...</span>
    </div>
  );
}
