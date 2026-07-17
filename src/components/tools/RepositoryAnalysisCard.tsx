"use client";

import { RepositoryAnalysisResult } from "@/lib/tools";
import { FileText, Package, Code, Layers, CheckCircle, AlertCircle } from "lucide-react";
import { RepositorySummarySection } from "./RepositorySummarySection";

interface RepositoryAnalysisCardProps {
  analysis: RepositoryAnalysisResult;
}

export function RepositoryAnalysisCard({ analysis }: RepositoryAnalysisCardProps) {
  const {
    projectName,
    framework,
    language,
    dependencies,
    scripts,
    architectureSummary,
    documentationStatus,
    recommendations,
  } = analysis;

  return (
    <div className="w-full max-w-3xl rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] shadow-sm overflow-hidden">
      <div className="border-b border-[var(--color-border)]/50 bg-[var(--color-background)]/50 px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-teal-500/10 text-teal-600 dark:bg-teal-500/20 dark:text-teal-400">
            <FileText className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-[var(--color-text)]">{projectName}</h3>
            <p className="text-xs text-[var(--color-muted)]">Repository Analysis</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 p-6 md:grid-cols-2">
        <div className="space-y-4">
          <RepositorySummarySection
            icon={<Package className="h-4 w-4" />}
            title="Tech Stack"
            description={
              <div className="flex flex-wrap gap-2">
                <span className="inline-flex items-center rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-medium text-blue-600 dark:bg-blue-500/20 dark:text-blue-400">
                  {framework}
                </span>
                <span className="inline-flex items-center rounded-full bg-green-50 px-2.5 py-0.5 text-xs font-medium text-green-600 dark:bg-green-500/20 dark:text-green-400">
                  {language}
                </span>
              </div>
            }
          />

          <RepositorySummarySection
            icon={<Layers className="h-4 w-4" />}
            title="Architecture Summary"
            description={<p className="text-sm text-[var(--color-text)]/90">{architectureSummary}</p>}
          />

          <RepositorySummarySection
            icon={<CheckCircle className="h-4 w-4" />}
            title="Documentation Status"
            description={<p className="text-sm text-[var(--color-text)]/90">{documentationStatus}</p>}
          />
        </div>

        <div className="space-y-4">
          <RepositorySummarySection
            icon={<Code className="h-4 w-4" />}
            title="Dependencies"
            description={
              <div className="mt-2 max-h-40 overflow-y-auto">
                {dependencies.length > 0 ? (
                  <ul className="grid grid-cols-1 gap-1.5">
                    {dependencies.slice(0, 10).map((dep) => (
                      <li
                        key={dep}
                        className="flex items-center gap-2 rounded-lg bg-[var(--color-background)]/50 px-2.5 py-1 text-xs text-[var(--color-text)]/80"
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-teal-500/60" />
                        {dep}
                      </li>
                    ))}
                    {dependencies.length > 10 && (
                      <p className="text-xs text-[var(--color-muted)]">
                        +{dependencies.length - 10} more dependencies
                      </p>
                    )}
                  </ul>
                ) : (
                  <p className="text-xs text-[var(--color-muted)]">No dependencies found</p>
                )}
              </div>
            }
          />

          <RepositorySummarySection
            icon={<AlertCircle className="h-4 w-4" />}
            title="Recommendations"
            description={
              <ul className="mt-2 space-y-1.5">
                {recommendations.map((rec, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-xs text-[var(--color-muted)]">
                    <span className="mt-0.5 text-[var(--color-primary)]">·</span>
                    <span>{rec}</span>
                  </li>
                ))}
              </ul>
            }
          />
        </div>
      </div>

      <div className="border-t border-[var(--color-border)]/50 bg-[var(--color-background)]/50 px-6 py-4">
        <h4 className="text-xs font-semibold text-[var(--color-muted)] uppercase tracking-wider">
          npm Scripts
        </h4>
        <div className="mt-2 grid grid-cols-1 gap-1.5 sm:grid-cols-2">
          {Object.entries(scripts).length > 0 ? (
            Object.entries(scripts).map(([name, cmd]) => (
              <div
                key={name}
                className="flex items-center justify-between rounded-lg bg-[var(--color-background)]/50 px-3 py-2"
              >
                <code className="text-xs font-mono text-[var(--color-text)]">{name}</code>
                <code className="text-xs font-mono text-[var(--color-muted)]">{cmd}</code>
              </div>
            ))
          ) : (
            <p className="text-xs text-[var(--color-muted)]">No scripts defined</p>
          )}
        </div>
      </div>
    </div>
  );
}