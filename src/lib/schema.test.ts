import { describe, expect, it } from "vitest";
import { settingsSchema } from "@/lib/schema";

const validPayload = {
  fullName: "Jane Doe",
  email: "jane@example.com",
  theme: "system" as const,
  notifications: true,
  password: "Password1",
  confirmPassword: "Password1",
};

describe("settingsSchema", () => {
  it("accepts valid settings values", () => {
    const result = settingsSchema.safeParse(validPayload);

    expect(result.success).toBe(true);
  });

  it("rejects invalid email addresses", () => {
    const result = settingsSchema.safeParse({
      ...validPayload,
      email: "not-an-email",
    });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.flatten().fieldErrors.email).toContain(
        "Enter a valid email address",
      );
    }
  });

  it("rejects mismatched passwords", () => {
    const result = settingsSchema.safeParse({
      ...validPayload,
      confirmPassword: "Password2",
    });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.flatten().fieldErrors.confirmPassword).toContain(
        "Passwords do not match",
      );
    }
  });

  it("rejects weak passwords", () => {
    const result = settingsSchema.safeParse({
      ...validPayload,
      password: "password",
      confirmPassword: "password",
    });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.flatten().fieldErrors.password?.length).toBeGreaterThan(0);
    }
  });

  it("trims whitespace from text fields", () => {
    const result = settingsSchema.safeParse({
      ...validPayload,
      fullName: "  Jane Doe  ",
      email: "  jane@example.com  ",
    });

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.fullName).toBe("Jane Doe");
      expect(result.data.email).toBe("jane@example.com");
    }
  });
});
