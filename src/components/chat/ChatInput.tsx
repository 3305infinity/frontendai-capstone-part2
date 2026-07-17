"use client";

import React, { useRef, useEffect } from "react";
import { Send } from "lucide-react";

interface ChatInputProps {
  input: string;
  handleInputChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  isLoading: boolean;
}

export function ChatInput({
  input,
  handleInputChange,
  handleSubmit,
  isLoading,
}: ChatInputProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize the textarea height based on content
  useEffect(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    textarea.style.height = "auto";
    textarea.style.height = `${Math.min(textarea.scrollHeight, 180)}px`;
  }, [input]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // Send message on Enter key without Shift
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (input.trim() && !isLoading) {
        // Trigger submit
        const form = e.currentTarget.form;
        if (form) {
          form.requestSubmit();
        }
      }
    }
  };

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;
    handleSubmit(e);
    // Reset height of textarea
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
  };

  return (
    <form
      onSubmit={onSubmit}
      className="relative rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] shadow-md transition-all focus-within:border-[var(--color-primary)] focus-within:ring-2 focus-within:ring-[var(--color-primary)]/10"
    >
      <div className="flex items-end gap-2 p-3">
        {/* Multiline input text area */}
        <textarea
          ref={textareaRef}
          value={input}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          placeholder={isLoading ? "Generating response..." : "Ask Berozgar Copilot anything..."}
          rows={1}
          disabled={isLoading}
          className="flex-1 max-h-[180px] min-h-[40px] resize-none overflow-y-auto bg-transparent py-2.5 px-2 text-sm text-[var(--color-text)] placeholder-[var(--color-muted)] outline-none scrollbar-thin scrollbar-thumb-zinc-200 dark:scrollbar-thumb-zinc-800"
          style={{ height: "auto" }}
          aria-label="Ask Copilot a question"
        />

        {/* Submit button */}
        <button
          type="submit"
          disabled={!input.trim() || isLoading}
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[var(--color-primary)] text-white shadow-sm transition hover:scale-105 active:scale-95 disabled:pointer-events-none disabled:bg-[var(--color-border)] disabled:text-[var(--color-muted)] disabled:opacity-40"
          aria-label="Send message"
        >
          <Send className="h-4.5 w-4.5" />
        </button>
      </div>
    </form>
  );
}
