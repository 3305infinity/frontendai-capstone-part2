import { z } from "zod";
import {
  defaultSettingsValues,
  themeOptions,
  type SettingsFormValues,
} from "@/lib/schema";

const STORAGE_KEY = "berozgar:settings";

const persistedSettingsSchema = z.object({
  fullName: z.string().trim().min(2).max(100),
  email: z.string().trim().email(),
  theme: z.enum(themeOptions),
  notifications: z.boolean(),
});

type PersistedSettings = z.infer<typeof persistedSettingsSchema>;

export function loadPersistedSettings(): SettingsFormValues {
  if (typeof window === "undefined") {
    return defaultSettingsValues;
  }

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return defaultSettingsValues;
    }

    const parsed = JSON.parse(raw) as Partial<PersistedSettings>;
    const result = persistedSettingsSchema.safeParse(parsed);

    if (!result.success) {
      return defaultSettingsValues;
    }

    return {
      ...defaultSettingsValues,
      ...result.data,
    };
  } catch {
    return defaultSettingsValues;
  }
}

export function persistSettings(values: SettingsFormValues): void {
  const payload: PersistedSettings = {
    fullName: values.fullName,
    email: values.email,
    theme: values.theme,
    notifications: values.notifications,
  };

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
}
