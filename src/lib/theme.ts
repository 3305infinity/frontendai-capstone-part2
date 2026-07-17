import type { ThemeOption } from "@/lib/schema";

export type ResolvedTheme = "light" | "dark";

export function resolveTheme(theme: ThemeOption): ResolvedTheme {
  if (typeof window === "undefined") {
    return "light";
  }

  if (theme === "system") {
    return window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  }

  return theme;
}

export function applyTheme(theme: ThemeOption): ResolvedTheme {
  const resolved = resolveTheme(theme);

  if (typeof document !== "undefined") {
    document.documentElement.dataset.theme = resolved;
    document.documentElement.style.colorScheme = resolved;
  }

  return resolved;
}

export function watchSystemTheme(onChange: () => void): () => void {
  if (typeof window === "undefined") {
    return () => undefined;
  }

  const media = window.matchMedia("(prefers-color-scheme: dark)");
  const handler = () => onChange();

  media.addEventListener("change", handler);

  return () => {
    media.removeEventListener("change", handler);
  };
}
