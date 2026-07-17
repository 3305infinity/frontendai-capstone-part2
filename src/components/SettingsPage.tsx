"use client";

import { useMemo } from "react";
import { SettingsForm } from "@/components/SettingsForm";
import { applyTheme } from "@/lib/theme";
import {
  loadPersistedSettings,
  persistSettings,
} from "@/lib/settingsStorage";

export function SettingsPage() {
  const defaultValues = useMemo(() => loadPersistedSettings(), []);

  return (
    <SettingsForm
      defaultValues={defaultValues}
      onSubmit={(values) => {
        persistSettings(values);
        applyTheme(values.theme);
      }}
    />
  );
}
