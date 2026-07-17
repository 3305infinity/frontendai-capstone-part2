"use client";

import {
  useCallback,
  useEffect,
  useId,
  useRef,
  type ReactNode,
} from "react";
import { createPortal } from "react-dom";
import { getFocusableElements, trapFocus } from "@playground/utils/focusTrap";

export interface ModalDialogProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  triggerRef: React.RefObject<HTMLButtonElement | null>;
}

export function ModalDialog({
  isOpen,
  onClose,
  title,
  children,
  triggerRef,
}: ModalDialogProps) {
  const titleId = useId();
  const dialogRef = useRef<HTMLDivElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (!isOpen || !dialogRef.current) {
        return;
      }

      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
        return;
      }

      trapFocus(dialogRef.current, event);
    },
    [isOpen, onClose],
  );

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    previousFocusRef.current = document.activeElement as HTMLElement | null;
    const triggerElement = triggerRef.current;

    const frame = window.requestAnimationFrame(() => {
      if (!dialogRef.current) {
        return;
      }

      const focusable = getFocusableElements(dialogRef.current);
      (focusable[0] ?? dialogRef.current).focus();
    });

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      window.cancelAnimationFrame(frame);
      document.removeEventListener("keydown", handleKeyDown);

      const returnTarget =
        triggerElement ?? previousFocusRef.current ?? null;
      returnTarget?.focus();
    };
  }, [handleKeyDown, isOpen, triggerRef]);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isOpen]);

  if (!isOpen || typeof document === "undefined") {
    return null;
  }

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <button
        type="button"
        aria-label="Close dialog overlay"
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
      />
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
        className="relative z-10 w-full max-w-md rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6 shadow-xl outline-none"
      >
        <header className="mb-4 flex items-start justify-between gap-4">
          <h2 id={titleId} className="text-lg font-semibold text-[var(--color-text)]">
            {title}
          </h2>
          <button
            type="button"
            aria-label="Close dialog"
            className="rounded-lg border border-[var(--color-border)] px-2 py-1 text-sm text-[var(--color-muted)] transition hover:text-[var(--color-text)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-primary)]"
            onClick={onClose}
          >
            Close
          </button>
        </header>
        <div className="text-sm text-[var(--color-muted)]">{children}</div>
      </div>
    </div>,
    document.body,
  );
}
