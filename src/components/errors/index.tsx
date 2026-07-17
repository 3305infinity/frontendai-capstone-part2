"use client";

import { AlertCircle, RefreshCw, Folder, MessageSquare } from "lucide-react";

interface ErrorCardProps {
  title: string;
  description: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  severity?: "warning" | "destructive";
}

export function ChatErrorCard({ title, description, action, severity = "destructive" }: ErrorCardProps) {
  const isWarning = severity === "warning";
  const borderColor = isWarning ? "border-amber-200 dark:border-amber-950/40" : "border-red-200 dark:border-red-950/40";
  const bgColor = isWarning ? "bg-amber-50 dark:bg-amber-950/20" : "bg-red-50 dark:bg-red-950/20";
  const iconBg = isWarning ? "bg-amber-100 dark:bg-amber-900/30" : "bg-red-100 dark:bg-red-900/30";
  const textColor = isWarning ? "text-amber-600 dark:text-amber-400" : "text-red-600 dark:text-red-400";

  return (
    <div className={"w-full max-w-3xl rounded-2xl border p-6 shadow-sm " + borderColor + " " + bgColor}>
      <div className="flex items-start gap-4">
        <div className={"flex h-10 w-10 items-center justify-center rounded-lg " + iconBg}>
          <AlertCircle className="h-5 w-5" />
        </div>
        
        <div className="flex-1">
          <h3 className={"text-lg font-bold mb-1 " + textColor}>
            {title}
          </h3>
          <p className="text-sm text-muted-foreground mb-3">
            {description}
          </p>
          
          {action && (
            <button
              onClick={action.onClick}
              className="inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold transition"
              type="button"
            >
              <RefreshCw className="h-4 w-4" />
              <span>{action.label}</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export function NetworkErrorCard({ onRetry }: { onRetry: () => void }) {
  return (
    <ChatErrorCard
      title="Network Connection Error"
      description="Unable to connect to the chat service. Please check your internet connection and try again."
      action={{ label: "Retry", onClick: onRetry }}
      severity="warning"
    />
  );
}

export function RepositoryEmptyCard() {
  return (
    <div className="w-full max-w-3xl rounded-2xl border border-[var(--color-border)]/50 bg-[var(--color-surface)]/30 p-8 text-center">
      <div className="flex flex-col items-center gap-4">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-teal-500/10 text-teal-600 dark:bg-teal-500/20 dark:text-teal-400">
          <Folder className="h-8 w-8" />
        </div>
        
        <div>
          <h3 className="text-lg font-semibold text-[var(--color-text)] mb-2">
            Repository Not Analyzed
          </h3>
          <p className="text-sm text-[var(--color-muted)] max-w-md">
            No repository analysis has been performed yet. Ask me to analyze this repository 
            by saying "Analyze this repository" or "Explain the project architecture".
          </p>
        </div>
      </div>
    </div>
  );
}

export function EmptyState({ 
  title = "No messages yet", 
  description = "Start a conversation by typing your first message.",
  icon: Icon = MessageSquare
}: { 
  title?: string; 
  description?: string;
  icon?: React.ComponentType<{ className?: string }>;
}) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center overflow-y-auto px-6 py-12 text-center">
      <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 dark:bg-blue-950/20 text-[var(--color-primary)] animate-pulse">
        <Icon className="h-7 w-7" />
      </div>

      <h2 className="text-xl font-bold tracking-tight text-[var(--color-text)] sm:text-2xl">
        {title}
      </h2>
      
      <p className="mt-2 max-w-md text-sm text-[var(--color-muted)] leading-relaxed">
        {description}
      </p>
    </div>
  );
}

export function LoadingSkeleton() {
  return (
    <div className="flex w-full gap-4 py-6 px-4 md:px-6">
      <div className="flex shrink-0 select-none items-start">
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-teal-400 to-emerald-500 text-xs font-bold text-white shadow-sm animate-pulse">
          AI
        </div>
      </div>

      <div className="flex-1 space-y-2">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-[var(--color-text)]">Berozgar Copilot</span>
          <span className="text-[10px] text-[var(--color-muted)]">
            <div className="h-2 w-8 rounded-full bg-[var(--color-muted)]/30 animate-pulse" />
          </span>
        </div>

        <div className="text-sm space-y-2">
          <div className="h-4 w-full max-w-xs rounded bg-[var(--color-muted)]/20 animate-pulse" />
          <div className="h-4 w-3/4 rounded bg-[var(--color-muted)]/20 animate-pulse" />
          <div className="h-4 w-1/2 rounded bg-[var(--color-muted)]/20 animate-pulse" />
        </div>
      </div>
    </div>
  );
}

export function RetryButton({ 
  onClick, 
  disabled = false,
  children = "Retry"
}: { 
  onClick: () => void; 
  disabled?: boolean;
  children?: React.ReactNode;
}) {
  const btnClasses = "inline-flex items-center gap-2 rounded-lg bg-[var(--color-primary)] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[var(--color-primary)]/90 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:ring-offset-2" + (disabled ? " disabled:cursor-not-allowed disabled:opacity-50" : "");

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={btnClasses}
      type="button"
    >
      <RefreshCw className={"h-4 w-4" + (disabled ? " animate-spin" : "")} />
      <span>{children}</span>
    </button>
  );
}