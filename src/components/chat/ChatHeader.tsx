"use client";

import { Trash2, Download, Terminal } from "lucide-react";

interface ChatHeaderProps {
  title: string;
  isMockMode: boolean;
  onClearChat: () => void;
  onExportMarkdown: () => void;
  hasMessages: boolean;
}

export function ChatHeader({
  title,
  isMockMode,
  onClearChat,
  onExportMarkdown,
  hasMessages,
}: ChatHeaderProps) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[var(--color-border)] bg-[var(--color-surface)] px-6 py-4 shadow-sm">
      {/* Title & Status */}
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 dark:bg-blue-950/30 text-[var(--color-primary)]">
          <Terminal className="h-5 w-5" />
        </div>
        <div>
          <h1 className="text-base font-bold text-[var(--color-text)] leading-tight">
            {title}
          </h1>
          <div className="mt-1 flex items-center gap-1.5">
            <span
              className={`h-2 w-2 rounded-full ${
                isMockMode ? "bg-amber-500 animate-pulse" : "bg-emerald-500"
              }`}
            />
            <span className="text-xs font-medium text-[var(--color-muted)]">
              {isMockMode
                ? "Gemini 1.5 Flash • Mock Mode"
                : "Gemini 3.1 Flash-Lite • Live"}
            </span>
          </div>
        </div>
      </div>

      {/* Utility Actions */}
      <div className="flex items-center gap-2">
        <button
          onClick={onExportMarkdown}
          disabled={!hasMessages}
          className="inline-flex items-center gap-1.5 rounded-lg border border-[var(--color-border)] px-3 py-2 text-xs font-semibold text-[var(--color-muted)] transition hover:text-[var(--color-text)] disabled:cursor-not-allowed disabled:opacity-40"
          type="button"
          title="Export chat as Markdown"
        >
          <Download className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">Export</span>
        </button>

        <button
          onClick={onClearChat}
          disabled={!hasMessages}
          className="inline-flex items-center gap-1.5 rounded-lg border border-red-200 dark:border-red-950/40 px-3 py-2 text-xs font-semibold text-red-600 dark:text-red-400 transition hover:bg-red-50 dark:hover:bg-red-950/20 disabled:cursor-not-allowed disabled:opacity-40"
          type="button"
          title="Delete current conversation"
        >
          <Trash2 className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">Clear Chat</span>
        </button>
      </div>
    </div>
  );
}
