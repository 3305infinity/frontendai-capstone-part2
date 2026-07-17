"use client";

import { useEffect, type ReactNode } from "react";
import { loadPersistedSettings } from "@/lib/settingsStorage";
import { applyTheme, watchSystemTheme } from "@/lib/theme";

export function ThemeProvider({ children }: { children: ReactNode }) {
  useEffect(() => {
    const syncTheme = () => {
      const settings = loadPersistedSettings();
      applyTheme(settings.theme);
    };

    syncTheme();

    return watchSystemTheme(() => {
      const settings = loadPersistedSettings();
      if (settings.theme === "system") {
        applyTheme("system");
      }
    });
  }, []);

  return children;
}
