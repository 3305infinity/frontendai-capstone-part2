import { z } from "zod";

export const themeOptions = ["light", "dark", "system"] as const;

export type ThemeOption = (typeof themeOptions)[number];

export const settingsSchema = z
  .object({
    fullName: z
      .string()
      .trim()
      .min(2, "Full name must be at least 2 characters")
      .max(100, "Full name must be at most 100 characters"),
    email: z
      .string()
      .trim()
      .min(1, "Email is required")
      .email("Enter a valid email address"),
    theme: z.enum(themeOptions, {
      required_error: "Select a theme",
    }),
    notifications: z.boolean(),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "Password must include at least one uppercase letter")
      .regex(/[a-z]/, "Password must include at least one lowercase letter")
      .regex(/[0-9]/, "Password must include at least one number"),
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type SettingsFormValues = z.infer<typeof settingsSchema>;

export const defaultSettingsValues: SettingsFormValues = {
  fullName: "",
  email: "",
  theme: "system",
  notifications: true,
  password: "",
  confirmPassword: "",
};

export const themeLabels: Record<ThemeOption, string> = {
  light: "Light",
  dark: "Dark",
  system: "System",
};
