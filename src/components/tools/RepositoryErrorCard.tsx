"use client";

import { AlertCircle, FileText, Package, RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";

interface RepositoryErrorCardProps {
  error: {
    title: string;
    reason: string;
    suggestedFix?: string;
  };
  onRetry?: () => void;
  disabled?: boolean;
}

export function RepositoryErrorCard({ error, onRetry, disabled }: RepositoryErrorCardProps) {
  return (
    <div className="w-full max-w-3xl rounded-2xl border border-red-200 dark:border-red-950/40 bg-red-50 dark:bg-red-950/20 shadow-sm">
      <div className="p-6">
        <div className="flex items-start gap-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400">
            <AlertCircle className="h-5 w-5" />
          </div>
          
          <div className="flex-1">
            <h3 className="text-lg font-bold text-red-700 dark:text-red-300 mb-1">
              {error.title}
            </h3>
            
            <p className="text-sm text-red-600 dark:text-red-400 mb-3">
              {error.reason}
            </p>
            
            {error.suggestedFix && (
              <div className="mb-4">
                <h4 className="text-xs font-semibold text-red-700 dark:text-red-300 mb-1.5">
                  Suggested Fix:
                </h4>
                <div className="flex items-start gap-2">
                  {getFixIcon(error.suggestedFix)}
                  <p className="text-xs text-red-600 dark:text-red-400 leading-relaxed">
                    {error.suggestedFix}
                  </p>
                </div>
              </div>
            )}
            
            {onRetry && (
              <button
                onClick={onRetry}
                disabled={disabled}
                className={cn(
                  "inline-flex items-center gap-1.5 rounded-lg px-3.5 py-2 text-xs font-semibold transition",
                  disabled
                    ? "cursor-not-allowed bg-red-100 text-red-400 dark:bg-red-900/30 dark:text-red-500"
                    : "bg-red-600 text-white hover:bg-red-700 dark:bg-red-500 hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                )}
                type="button"
              >
                <RefreshCw className={cn("h-3 w-3", disabled && "animate-spin")} />
                <span>Retry Analysis</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function getFixIcon(fix: string): ReturnType<typeof AlertCircle> {
  const fixLower = fix.toLowerCase();
  
  if (fixLower.includes("readme")) {
    return <FileText className="h-3 w-3 text-red-500 mt-0.5" />;
  }
  
  if (fixLower.includes("package.json") || fixLower.includes("dependency")) {
    return <Package className="h-3 w-3 text-red-500 mt-0.5" />;
  }
  
  return <AlertCircle className="h-3 w-3 text-red-500 mt-0.5" />;
}