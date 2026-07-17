"use client";

import { cn } from "@/lib/utils";

interface RepositorySummarySectionProps {
  icon: React.ReactNode;
  title: string;
  description: React.ReactNode;
  className?: string;
}

export function RepositorySummarySection({
  icon,
  title,
  description,
  className,
}: RepositorySummarySectionProps) {
  return (
    <div className={cn("flex items-start gap-3 rounded-xl border border-[var(--color-border)]/50 bg-[var(--color-background)]/30 p-4", className)}>
      <div className="flex h-8 w-8 items-center justify-center rounded-lg text-[var(--color-primary)]">
        {icon}
      </div>
      <div className="flex-1">
        <h4 className="text-xs font-semibold text-[var(--color-muted)] uppercase tracking-wider">
          {title}
        </h4>
        <div className="mt-1">{description}</div>
      </div>
    </div>
  );
}