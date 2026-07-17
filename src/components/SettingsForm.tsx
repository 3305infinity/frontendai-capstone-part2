"use client";

import { useId } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
  CheckboxField,
  FormField,
  SelectInput,
  TextInput,
} from "@/components/FormField";
import { useToast } from "@/components/Toast";
import {
  defaultSettingsValues,
  settingsSchema,
  themeLabels,
  themeOptions,
  type SettingsFormValues,
} from "@/lib/schema";

export interface SettingsFormProps {
  defaultValues?: SettingsFormValues;
  onSubmit?: (values: SettingsFormValues) => Promise<void> | void;
}

export function SettingsForm({
  defaultValues = defaultSettingsValues,
  onSubmit,
}: SettingsFormProps) {
  const formId = useId();
  const { showToast } = useToast();

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors, isValid, isSubmitting, isDirty },
  } = useForm<SettingsFormValues>({
    resolver: zodResolver(settingsSchema),
    defaultValues,
    mode: "onChange",
    reValidateMode: "onChange",
  });

  const notifications = watch("notifications");

  const submitHandler = handleSubmit(async (values) => {
    if (onSubmit) {
      await onSubmit(values);
    }

    showToast("Settings saved successfully.", "success");
  });

  return (
    <form
      id={formId}
      noValidate
      onSubmit={submitHandler}
      className="mx-auto w-full max-w-2xl space-y-6 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-4 shadow-sm sm:p-6"
    >
      <header className="space-y-1 border-b border-[var(--color-border)] pb-4">
        <h2 className="text-xl font-semibold text-[var(--color-text)]">Account settings</h2>
        <p className="text-sm text-[var(--color-muted)]">
          Update your profile, preferences, and security details.
        </p>
      </header>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <FormField
          label="Full name"
          htmlFor={`${formId}-fullName`}
          error={errors.fullName?.message}
        >
          <TextInput
            autoComplete="name"
            hasError={Boolean(errors.fullName)}
            placeholder="Jane Doe"
            {...register("fullName")}
          />
        </FormField>

        <FormField
          label="Email"
          htmlFor={`${formId}-email`}
          error={errors.email?.message}
        >
          <TextInput
            type="email"
            autoComplete="email"
            inputMode="email"
            hasError={Boolean(errors.email)}
            placeholder="jane@example.com"
            {...register("email")}
          />
        </FormField>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <FormField
          label="Theme"
          htmlFor={`${formId}-theme`}
          error={errors.theme?.message}
          hint="Choose how the app should appear."
        >
          <SelectInput
            hasError={Boolean(errors.theme)}
            {...register("theme")}
          >
            {themeOptions.map((theme) => (
              <option key={theme} value={theme}>
                {themeLabels[theme]}
              </option>
            ))}
          </SelectInput>
        </FormField>

        <div className="flex items-end">
          <CheckboxField
            id={`${formId}-notifications`}
            label="Email notifications"
            hint="Receive product updates and account alerts."
            checked={notifications}
            onChange={(checked) =>
              setValue("notifications", checked, {
                shouldDirty: true,
                shouldValidate: true,
              })
            }
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <FormField
          label="Password"
          htmlFor={`${formId}-password`}
          error={errors.password?.message}
          hint="At least 8 characters with upper, lower, and number."
        >
          <TextInput
            type="password"
            autoComplete="new-password"
            hasError={Boolean(errors.password)}
            {...register("password")}
          />
        </FormField>

        <FormField
          label="Confirm password"
          htmlFor={`${formId}-confirmPassword`}
          error={errors.confirmPassword?.message}
        >
          <TextInput
            type="password"
            autoComplete="new-password"
            hasError={Boolean(errors.confirmPassword)}
            {...register("confirmPassword")}
          />
        </FormField>
      </div>

      <div className="flex flex-col-reverse gap-3 border-t border-[var(--color-border)] pt-4 sm:flex-row sm:justify-end">
        <Button
          type="button"
          variant="secondary"
          disabled={!isDirty || isSubmitting}
          onClick={() => reset(defaultValues)}
        >
          Reset changes
        </Button>
        <Button type="submit" disabled={!isValid || isSubmitting}>
          {isSubmitting ? "Saving..." : "Save settings"}
        </Button>
      </div>
    </form>
  );
}
