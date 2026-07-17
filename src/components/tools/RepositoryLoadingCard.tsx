"use client";

import { useState, useEffect } from "react";
import { FileText, Package, Workflow, Database } from "lucide-react";

interface RepositoryLoadingCardProps {
  onComplete?: () => void;
}

export function RepositoryLoadingCard({ onComplete }: RepositoryLoadingCardProps) {
  const [progress, setProgress] = useState(0);
  const [showAnalysis, setShowAnalysis] = useState(false);

  useEffect(() => {
    let animationFrame: number;

    const animateProgress = () => {
      setProgress((prev) => {
        if (prev >= 100) {
          setShowAnalysis(true);
          if (onComplete) onComplete();
          return 100;
        }
        return prev + Math.random() * 15 + 5;
      });
      animationFrame = requestAnimationFrame(animateProgress);
    };

    animationFrame = requestAnimationFrame(animateProgress);

    const timeout = setTimeout(() => {
      setShowAnalysis(true);
      if (onComplete) onComplete();
    }, 2500);

    return () => {
      if (animationFrame) cancelAnimationFrame(animationFrame);
      clearTimeout(timeout);
    };
  }, [onComplete]);

  if (showAnalysis && onComplete) {
    return null;
  }

  return (
    <div className="w-full max-w-3xl rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] shadow-sm p-6">
      <div className="mb-6">
        <h3 className="text-lg font-bold text-[var(--color-text)] mb-2">
          Analyzing Repository
        </h3>
        <p className="text-sm text-[var(--color-muted)]">
          {showAnalysis ? "Analysis complete" : "Reading project files..."}
        </p>
      </div>

      {!showAnalysis && (
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="h-2 w-2 rounded-full bg-teal-500 animate-pulse" />
            <span className="text-xs text-[var(--color-muted)]">
              Analyzing {progress < 30 ? "README.md" : progress < 60 ? "package.json" : "project structure"}
            </span>
          </div>

          <div className="border-2 border-dashed border-[var(--color-border)]/50 rounded-xl p-4">
            <div className="flex items-center gap-3 mb-3">
              <div className="h-8 w-8 rounded-lg bg-teal-500/10 flex items-center justify-center text-teal-600 dark:text-teal-400">
                <FileText className="h-4 w-4" />
              </div>
              <div className="flex-1">
                <p className="text-xs font-medium text-[var(--color-text)]">README.md</p>
                <div className="mt-1 h-1.5 w-full rounded-full bg-[var(--color-background)] overflow-hidden">
                  <div 
                    className="h-full bg-teal-500/60 transition-all duration-300"
                    style={{ width: progress < 30 ? `${Math.min(progress / 30 * 100, 100)}%` : "100%" }}
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-600 dark:text-blue-400">
                <Package className="h-4 w-4" />
              </div>
              <div className="flex-1">
                <p className="text-xs font-medium text-[var(--color-text)]">package.json</p>
                <div className="mt-1 h-1.5 w-full rounded-full bg-[var(--color-background)] overflow-hidden">
                  <div 
                    className="h-full bg-blue-500/60 transition-all duration-300"
                    style={{ width: progress < 60 ? `${Math.min(progress / 60 * 100, 100)}%` : "100%" }}
                  />
                </div>
              </div>
            </div>

            {progress > 50 && (
              <>
                <div className="flex items-center gap-3 mt-2">
                  <div className="h-8 w-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                    <Workflow className="h-4 w-4" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs font-medium text-[var(--color-text)]">workflow.md</p>
                  </div>
                </div>
              </>
            )}

            {progress > 80 && (
              <>
                <div className="flex items-center gap-3 mt-2">
                  <div className="h-8 w-8 rounded-lg bg-purple-500/10 flex items-center justify-center text-purple-600 dark:text-purple-400">
                    <Database className="h-4 w-4" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs font-medium text-[var(--color-text)]">BUILD_LOG.md, ARCHITECTURE.md</p>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      <div className="mt-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="h-1.5 w-8 rounded-full bg-[var(--color-background)] overflow-hidden">
            <div 
              className="h-full rounded-full transition-all duration-300 bg-teal-500"
              style={{ width: `${Math.min(progress, 100)}%` }}
            />
          </div>
          <span className="text-xs text-[var(--color-muted)]">
            {Math.round(Math.min(progress, 100))}%
          </span>
        </div>
      </div>
    </div>
  );
}