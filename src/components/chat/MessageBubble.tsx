"use client";

import { useEffect, useState } from "react";
import { type UIMessage } from "@ai-sdk/react";
import { MarkdownRenderer } from "./MarkdownRenderer";
import { Copy, Check, RotateCcw, AlertCircle } from "lucide-react";
import { loadPersistedSettings } from "@/lib/settingsStorage";
import { getMessageContent } from "@/lib/utils";
import { RepositoryAnalysisCard } from "@/components/tools/RepositoryAnalysisCard";
import { RepositoryErrorCard } from "@/components/tools/RepositoryErrorCard";
import type { RepositoryAnalysisResult } from "@/lib/tools";

interface MessageBubbleProps {
  message: Message;
  isLast: boolean;
  onReload?: () => void;
  isError?: boolean;
}

type Message = UIMessage;

export function MessageBubble({ message, isLast, onReload, isError = false }: MessageBubbleProps) {
  const isUser = message.role === "user";
  const [copied, setCopied] = useState(false);
  const [userInitials, setUserInitials] = useState("U");

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
      // Silently fail
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

  const hasToolResult = (): boolean => {
    if (!message.parts) return false;
    return message.parts.some((part) => {
      if (typeof part === "object" && part !== null) {
        const p = part as Record<string, unknown>;
        return p.type === "tool-output-available" && p.output !== undefined;
      }
      return false;
    });
  };

  const getToolResultFromMessage = (): RepositoryAnalysisResult | null => {
    if (!message.parts) return null;
    
    for (const part of message.parts) {
      if (typeof part === "object" && part !== null) {
        const p = part as Record<string, unknown>;
        if (p.type === "tool-output-available" && p.output) {
          return p.output as RepositoryAnalysisResult;
        }
      }
    }
    return null;
  };

  const content = getMessageContent(message);
  const isRepositoryAnalysis = hasToolResult() || (content?.includes("## Repository Analysis Complete") ?? false);

  const renderContent = () => {
    if (isError) {
      return (
        <div className="space-y-3">
          <RepositoryErrorCard
            error={{
              title: "Repository Analysis Failed",
              reason: "Unable to read repository files or parse package.json.",
              suggestedFix: "Ensure README.md and package.json exist in the repository root.",
            }}
            onRetry={onReload}
          />
        </div>
      );
    }

    if (isRepositoryAnalysis) {
      const toolResult = getToolResultFromMessage();
      if (toolResult) {
        return <RepositoryAnalysisCard analysis={toolResult} />;
      }
      
      if (content) {
        const analysis = parseRepositoryAnalysis(content);
        if (analysis) {
          return <RepositoryAnalysisCard analysis={analysis} />;
        }
      }
    }

    if (!content) {
      return <span className="italic text-[var(--color-muted)]">Empty response</span>;
    }

    return <MarkdownRenderer content={content} />;
  };

  return (
      <div
        className={`group flex w-full gap-4 py-6 px-4 md:px-6 transition-colors ${
          isUser
            ? "flex-row-reverse bg-white dark:bg-zinc-950"
            : "bg-zinc-50 dark:bg-zinc-900/50 border-y border-zinc-200 dark:border-zinc-800"
        }`}
      >
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

      <div className="flex-1 space-y-2 overflow-hidden">
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

        <div className="text-sm">
          {renderContent()}
        </div>

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

        {isError && (
          <div className="mt-3 flex items-start gap-2 rounded-xl border border-red-200 dark:border-red-950/40 dark:bg-red-950/20 p-3.5 text-xs text-red-600 dark:text-red-400">
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

function parseRepositoryAnalysis(text: string): RepositoryAnalysisResult | null {
  try {
    const extractValue = (label: string): string => {
      const regex = new RegExp(`\\*\\*${label}\\*\\*\\s*-\\s*(.+?)(?=\\n\\*\\*|$)`, 'm');
      const match = text.match(regex);
      return match ? match[1].trim() : "";
    };

    const extractList = (label: string): string[] => {
      const regex = new RegExp(`\\*\\*${label}\\*\\*\\s*\n(.+?)(?=\\n\\*\\*|$)`, 'm');
      const match = text.match(regex);
      if (!match) return [];
      return match[1].split('\n').map((l) => l.replace(/^-\s*/, '').trim()).filter(Boolean);
    };

    const extractObject = (label: string): Record<string, string> => {
      const regex = new RegExp(`\\*\\*${label}\\*\\*\\s*\n(.+?)(?=\\n\\*\\*|$)`, 'm');
      const match = text.match(regex);
      if (!match) return {};
      const result: Record<string, string> = {};
      match[1].split('\n').forEach((line) => {
        const itemMatch = line.match(/^-\s*\*\*([^:]+)\*\*:\s*(.+)$/);
        if (itemMatch) {
          result[itemMatch[1].trim()] = itemMatch[2].trim();
        }
      });
      return result;
    };

    const projectName = extractValue("Project Name");
    const framework = extractValue("Framework");
    const language = extractValue("Language");
    const dependencies = extractList("Dependencies");
    const scripts = extractObject("Scripts");
    const architectureSummary = extractValue("Architecture Summary");
    const documentationStatus = extractValue("Documentation Status");
    const recommendations = extractList("Recommendations");

    if (!projectName) return null;

    return {
      projectName,
      framework,
      language,
      dependencies,
      scripts,
      architectureSummary,
      documentationStatus,
      recommendations,
    };
  } catch {
    return null;
  }
}