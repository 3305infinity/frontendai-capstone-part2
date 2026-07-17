"use client";

import { useEffect, useState } from "react";
import { type UIMessage as Message } from "@ai-sdk/react";
import { MarkdownRenderer } from "./MarkdownRenderer";
import { Copy, Check, RotateCcw, AlertCircle } from "lucide-react";
import { loadPersistedSettings } from "@/lib/settingsStorage";
import { getMessageContent } from "@/lib/utils";

interface MessageBubbleProps {
  message: Message;
  isLast: boolean;
  onReload?: () => void;
  isError?: boolean;
}

export function MessageBubble({ message, isLast, onReload, isError = false }: MessageBubbleProps) {
  const isUser = message.role === "user";
  const [copied, setCopied] = useState(false);
  const [userInitials, setUserInitials] = useState("U");

  // Load user profile initials on mount
  useEffect(() => {
    try {
      const settings = loadPersistedSettings();
      if (settings.fullName) {
        const parts = settings.fullName.trim().split(/\s+/);
        const initials = parts.map((p) => p[0]).join("").toUpperCase().slice(0, 2);
        if (initials) {
          setUserInitials(initials);
        }
      }
    } catch {
      // Fallback silently
    }
  }, []);

  const handleCopyMessage = async () => {
    try {
      await navigator.clipboard.writeText(getMessageContent(message));
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy message:", err);
    }
  };

  return (
    <div
      className={`group flex w-full gap-4 py-6 px-4 md:px-6 transition-colors ${
        isUser
          ? "flex-row-reverse bg-zinc-50/50 dark:bg-zinc-950/20"
          : "bg-white dark:bg-zinc-900/40 border-y border-[var(--color-border)]/40"
      }`}
    >
      {/* Avatar */}
      <div className="flex shrink-0 select-none items-start">
        {isUser ? (
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-xs font-bold text-white shadow-sm">
            {userInitials}
          </div>
        ) : (
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-teal-400 to-emerald-500 text-xs font-bold text-white shadow-sm">
            AI
          </div>
        )}
      </div>

      {/* Message Content & Actions Container */}
      <div className="flex-1 space-y-2 overflow-hidden">
        {/* Sender Label */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-[var(--color-text)]">
            {isUser ? "You" : "Berozgar Copilot"}
          </span>
          <span className="text-[10px] text-[var(--color-muted)]">
            {(() => {
              const msgRecord = message as unknown as Record<string, unknown>;
              const createdAtValue = msgRecord.createdAt;
              return typeof createdAtValue === "string" ||
                typeof createdAtValue === "number" ||
                createdAtValue instanceof Date
                ? new Date(createdAtValue).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                : "";
            })()}
          </span>
        </div>

        {/* Message Content Bubble */}
        <div className="text-sm">
          {isError ? null : getMessageContent(message) ? (
            <MarkdownRenderer content={getMessageContent(message)} />
          ) : (
            <span className="italic text-[var(--color-muted)]">Empty response</span>
          )}
        </div>

        {/* Action Row */}
        <div className="flex flex-wrap items-center gap-3 pt-2 text-[var(--color-muted)] opacity-0 transition-opacity group-hover:opacity-100 focus-within:opacity-100">
          <button
            onClick={handleCopyMessage}
            className="inline-flex items-center gap-1 text-[11px] font-medium hover:text-[var(--color-text)] focus:outline-none"
            type="button"
            title="Copy message"
          >
            {copied ? (
              <>
                <Check className="h-3 w-3 text-emerald-500" />
                <span className="text-emerald-500 font-semibold">Copied!</span>
              </>
            ) : (
              <>
                <Copy className="h-3 w-3" />
                <span>Copy</span>
              </>
            )}
          </button>

          {!isUser && isLast && onReload && (
            <button
              onClick={onReload}
              className="inline-flex items-center gap-1 text-[11px] font-medium hover:text-[var(--color-text)] focus:outline-none"
              type="button"
              title="Regenerate last response"
            >
              <RotateCcw className="h-3 w-3" />
              <span>Regenerate</span>
            </button>
          )}
        </div>

        {/* Error Alert Box */}
        {isError && (
          <div className="mt-3 flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 dark:border-red-950/40 dark:bg-red-950/20 p-3.5 text-xs text-red-600 dark:text-red-400">
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
            <div className="space-y-2">
              <p className="font-semibold">The request failed.</p>
              <p className="leading-relaxed opacity-90">Please verify your internet connection or check your API key configuration in your environment variables.</p>
              {onReload && (
                <button
                  onClick={onReload}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-red-600 dark:bg-red-500 px-3 py-1.5 font-bold text-white transition hover:bg-red-700 dark:hover:bg-red-600 focus:outline-none"
                  type="button"
                >
                  <RotateCcw className="h-3 w-3" />
                  <span>Retry Request</span>
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
