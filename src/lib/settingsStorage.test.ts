import { afterEach, describe, expect, it } from "vitest";
import {
  loadPersistedSettings,
  persistSettings,
} from "@/lib/settingsStorage";
import { defaultSettingsValues } from "@/lib/schema";

describe("settingsStorage", () => {
  afterEach(() => {
    window.localStorage.clear();
  });

  it("returns defaults when nothing is stored", () => {
    expect(loadPersistedSettings()).toEqual(defaultSettingsValues);
  });

  it("persists and reloads non-sensitive fields", () => {
    persistSettings({
      fullName: "Jane Doe",
      email: "jane@example.com",
      theme: "dark",
      notifications: false,
      password: "Password1",
      confirmPassword: "Password1",
    });

    expect(loadPersistedSettings()).toEqual({
      ...defaultSettingsValues,
      fullName: "Jane Doe",
      email: "jane@example.com",
      theme: "dark",
      notifications: false,
    });
  });

  it("does not store passwords in localStorage", () => {
    persistSettings({
      fullName: "Jane Doe",
      email: "jane@example.com",
      theme: "dark",
      notifications: false,
      password: "Password1",
      confirmPassword: "Password1",
    });

    const stored = window.localStorage.getItem("berozgar:settings");
    expect(stored).not.toBeNull();
    expect(stored).not.toContain("Password1");
  });

  it("falls back to defaults for invalid stored data", () => {
    window.localStorage.setItem("berozgar:settings", "{not-json");

    expect(loadPersistedSettings()).toEqual(defaultSettingsValues);
  });
});
