"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { AlertCircle, RefreshCw, Home, Shield, Wifi } from "lucide-react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const sabotageMode = searchParams?.get("sabotage") === "true";
  const sabotageType = searchParams?.get("sabotage_type");

  const handleRetry = () => {
    reset();
  };

  const handleHome = () => {
    router.push("/");
  };

  if (sabotageMode && sabotageType === "network") {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-[var(--color-background)] p-4">
        <div className="w-full max-w-md rounded-2xl border border-[var(--color-border)]/50 bg-[var(--color-surface)]/30 p-8 text-center">
          <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-600 dark:bg-amber-500/20 dark:text-amber-400 animate-pulse">
            <Wifi className="h-8 w-8" />
          </div>
          
          <h1 className="text-2xl font-bold text-[var(--color-text)] mb-4">
            Network Error
          </h1>
          
          <p className="text-sm text-[var(--color-muted)] mb-6">
            Simulated network failure for testing purposes.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={handleRetry}
              className="flex-1 inline-flex items-center justify-center gap-2 rounded-lg bg-[var(--color-primary)] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[var(--color-primary)]/90"
              type="button"
            >
              <RefreshCw className="h-4 w-4" />
              Retry
            </button>
            
            <button
              onClick={handleHome}
              className="flex-1 inline-flex items-center justify-center gap-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-2 text-sm font-semibold text-[var(--color-text)] transition hover:bg-[var(--color-background)]"
              type="button"
            >
              <Home className="h-4 w-4" />
              Go Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (sabotageMode && sabotageType === "500") {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-[var(--color-background)] p-4">
        <div className="w-full max-w-md rounded-2xl border border-[var(--color-border)]/50 bg-[var(--color-surface)]/30 p-8 text-center">
          <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-red-500/10 text-red-600 dark:bg-red-500/20 dark:text-red-400">
            <AlertCircle className="h-8 w-8" />
          </div>
          
          <h1 className="text-2xl font-bold text-[var(--color-text)] mb-4">
            Server Error
          </h1>
          
          <p className="text-sm text-[var(--color-muted)] mb-6">
            {error.message || "Something went wrong on our end."}
          </p>
          
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={handleRetry}
              className="flex-1 inline-flex items-center justify-center gap-2 rounded-lg bg-[var(--color-primary)] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[var(--color-primary)]/90"
              type="button"
            >
              <RefreshCw className="h-4 w-4" />
              Try Again
            </button>
            
            <button
              onClick={handleHome}
              className="flex-1 inline-flex items-center justify-center gap-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-2 text-sm font-semibold text-[var(--color-text)] transition hover:bg-[var(--color-background)]"
              type="button"
            >
              <Home className="h-4 w-4" />
              Go Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (sabotageMode && sabotageType === "rate_limit") {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-[var(--color-background)] p-4">
        <div className="w-full max-w-md rounded-2xl border border-[var(--color-border)]/50 bg-[var(--color-surface)]/30 p-8 text-center">
          <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-600 dark:bg-amber-500/20 dark:text-amber-400">
            <Shield className="h-8 w-8" />
          </div>
          
          <h1 className="text-2xl font-bold text-[var(--color-text)] mb-4">
            Rate Limited
          </h1>
          
          <p className="text-sm text-[var(--color-muted)] mb-6">
            Too many requests. Please wait a moment before trying again.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={handleRetry}
              className="flex-1 inline-flex items-center justify-center gap-2 rounded-lg bg-[var(--color-primary)] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[var(--color-primary)]/90"
              type="button"
            >
              <RefreshCw className="h-4 w-4" />
              Retry
            </button>
            
            <button
              onClick={handleHome}
              className="flex-1 inline-flex items-center justify-center gap-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-2 text-sm font-semibold text-[var(--color-text)] transition hover:bg-[var(--color-background)]"
              type="button"
            >
              <Home className="h-4 w-4" />
              Go Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[var(--color-background)] p-4">
      <div className="w-full max-w-md rounded-2xl border border-[var(--color-border)]/50 bg-[var(--color-surface)]/30 p-8 text-center">
        <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-red-500/10 text-red-600 dark:bg-red-500/20 dark:text-red-400">
          <AlertCircle className="h-8 w-8" />
        </div>
        
        <h1 className="text-2xl font-bold text-[var(--color-text)] mb-4">
          Something Went Wrong
        </h1>
        
        <p className="text-sm text-[var(--color-muted)] mb-6">
          {error.message || "An unexpected error occurred."}
        </p>
        
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={handleRetry}
            className="flex-1 inline-flex items-center justify-center gap-2 rounded-lg bg-[var(--color-primary)] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[var(--color-primary)]/90"
            type="button"
          >
            <RefreshCw className="h-4 w-4" />
            Try Again
          </button>
          
          <button
            onClick={handleHome}
            className="flex-1 inline-flex items-center justify-center gap-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-2 text-sm font-semibold text-[var(--color-text)] transition hover:bg-[var(--color-background)]"
            type="button"
          >
            <Home className="h-4 w-4" />
            Go Home
          </button>
        </div>
      </div>
    </div>
  );
}