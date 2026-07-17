"use client";

import { FileText, Package, Workflow, Database, AlertCircle, CheckCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface RepositoryInputCardProps {
  files: {
    name: string;
    content: string;
    exists: boolean;
  }[];
  onAnalyze: () => void;
  disabled?: boolean;
}

const FILE_ICONS: Record<string, React.ElementType> = {
  "README.md": FileText,
  "package.json": Package,
  "workflow.md": Workflow,
  "BUILD_LOG.md": Database,
  "ARCHITECTURE.md": Database,
};

const FILE_COLORS: Record<string, string> = {
  "README.md": "bg-blue-500/10 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400",
  "package.json": "bg-cyan-500/10 text-cyan-600 dark:bg-cyan-500/20 dark:text-cyan-400",
  "workflow.md": "bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400",
  "BUILD_LOG.md": "bg-amber-500/10 text-amber-600 dark:bg-amber-500/20 dark:text-amber-400",
  "ARCHITECTURE.md": "bg-purple-500/10 text-purple-600 dark:bg-purple-500/20 dark:text-purple-400",
};

const PREVIEW_LINES = 3;

export function RepositoryInputCard({ files, onAnalyze, disabled }: RepositoryInputCardProps) {
  const hasRequiredFiles = files.some((f) => f.name === "README.md" && f.exists);
  const hasPackageJson = files.some((f) => f.name === "package.json" && f.exists);
  const allDetected = files.filter((f) => f.exists);

  const getPreview = (content: string): string => {
    if (!content) return "";
    const lines = content.split("\n").slice(0, PREVIEW_LINES).join("\n");
    return lines.length > 150 ? lines.slice(0, 150) + "..." : lines;
  };

  return (
    <div className="w-full max-w-3xl rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] shadow-sm">
      <div className="border-b border-[var(--color-border)]/50 bg-[var(--color-background)]/50 px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-teal-500/10 text-teal-600 dark:bg-teal-500/20 dark:text-teal-400">
            <FileText className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-[var(--color-text)]">Repository Analyzer</h3>
            <p className="text-xs text-[var(--color-muted)]">Analyze project structure and dependencies</p>
          </div>
        </div>
      </div>

      <div className="p-6">
        <div className="mb-4">
          <h4 className="text-xs font-semibold text-[var(--color-muted)] uppercase tracking-wider mb-2">
            Repository Files Detected
          </h4>
          <div className="flex flex-wrap gap-2">
            {allDetected.map((file) => {
              const Icon = FILE_ICONS[file.name] || FileText;
              const colorClass = FILE_COLORS[file.name] || "bg-gray-500/10 text-gray-600";
              return (
                <span
                  key={file.name}
                  className={cn(
                    "inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium",
                    colorClass
                  )}
                >
                  <Icon className="h-3 w-3" />
                  {file.name}
                </span>
              );
            })}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-3 mb-6">
          {files.map((file) => {
            const Icon = FILE_ICONS[file.name] || FileText;
            const iconColorClass = FILE_COLORS[file.name] || "bg-gray-500/10 text-gray-500";
            
            return (
              <div
                key={file.name}
                className={cn(
                  "border rounded-xl p-3 text-sm",
                  file.exists
                    ? "border-[var(--color-border)]/50 bg-[var(--color-background)]/30"
                    : "border-dashed border-[var(--color-border)]/30 bg-[var(--color-background)]/20"
                )}
              >
                <div className="flex items-start gap-3">
                  <div
                    className={cn(
                      "flex h-8 w-8 items-center justify-center rounded-lg",
                      file.exists
                        ? iconColorClass
                        : "bg-gray-500/10 text-gray-500 dark:bg-gray-500/20 dark:text-gray-400"
                    )}
                  >
                    <Icon className="h-4 w-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-medium text-[var(--color-text)]">{file.name}</span>
                      {file.exists ? (
                        <CheckCircle className="h-3 w-3 text-emerald-500" />
                      ) : (
                        <AlertCircle className="h-3 w-3 text-gray-400" />
                      )}
                    </div>
                    {file.exists && file.content && (
                      <pre className="text-xs text-[var(--color-muted)]/80 font-mono whitespace-pre-wrap break-all">
                        {getPreview(file.content)}
                      </pre>
                    )}
                    {!file.exists && (
                      <p className="text-xs text-[var(--color-muted)]">Not found in repository</p>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-[var(--color-border)]/50">
          <div className="text-xs text-[var(--color-muted)]">
            {hasRequiredFiles && hasPackageJson ? (
              <span className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400">
                <CheckCircle className="h-3 w-3" />
                Ready for analysis
              </span>
            ) : (
              <span className="flex items-center gap-1.5 text-amber-600 dark:text-amber-400">
                <AlertCircle className="h-3 w-3" />
                Missing required files
              </span>
            )}
          </div>
          <button
            onClick={onAnalyze}
            disabled={disabled || !hasRequiredFiles}
            className={cn(
              "inline-flex items-center gap-1.5 rounded-lg px-4 py-2 text-sm font-semibold transition",
              disabled || !hasRequiredFiles
                ? "cursor-not-allowed bg-gray-100 text-gray-400 dark:bg-gray-800 dark:text-gray-500"
                : "bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary)]/90 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:ring-offset-2"
            )}
            type="button"
          >
            Analyze Repository
          </button>
        </div>
      </div>
    </div>
  );
}