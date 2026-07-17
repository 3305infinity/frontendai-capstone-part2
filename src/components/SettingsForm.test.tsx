import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "vitest-axe";
import { describe, expect, it, vi } from "vitest";
import { SettingsForm } from "@/components/SettingsForm";
import { ToastProvider, ToastViewport } from "@/components/Toast";
import type { SettingsFormValues } from "@/lib/schema";

function renderSettingsForm(options?: {
  onSubmit?: (values: SettingsFormValues) => Promise<void> | void;
  defaultValues?: SettingsFormValues;
}) {
  return render(
    <ToastProvider>
      <SettingsForm
        defaultValues={options?.defaultValues}
        onSubmit={options?.onSubmit}
      />
      <ToastViewport />
    </ToastProvider>,
  );
}

const validValues: SettingsFormValues = {
  fullName: "Jane Doe",
  email: "jane@example.com",
  theme: "dark",
  notifications: false,
  password: "Password1",
  confirmPassword: "Password1",
};

describe("SettingsForm", () => {
  it("renders all required fields with accessible labels", () => {
    renderSettingsForm();

    expect(screen.getByLabelText(/full name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^email$/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^theme$/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email notifications/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^password$/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/confirm password/i)).toBeInTheDocument();
  });

  it("disables submit until the form is valid", async () => {
    const user = userEvent.setup();
    renderSettingsForm();

    const submitButton = screen.getByRole("button", { name: /save settings/i });

    expect(submitButton).toBeDisabled();

    await user.type(screen.getByLabelText(/full name/i), validValues.fullName);
    await user.type(screen.getByLabelText(/^email$/i), validValues.email);
    await user.selectOptions(screen.getByLabelText(/^theme$/i), validValues.theme);
    await user.type(screen.getByLabelText(/^password$/i), validValues.password);
    await user.type(
      screen.getByLabelText(/confirm password/i),
      validValues.confirmPassword,
    );

    await waitFor(() => {
      expect(submitButton).toBeEnabled();
    });
  });

  it("shows inline validation errors", async () => {
    const user = userEvent.setup();
    renderSettingsForm();

    await user.type(screen.getByLabelText(/^email$/i), "invalid-email");
    await user.tab();

    expect(await screen.findByRole("alert")).toHaveTextContent(
      /enter a valid email address/i,
    );
  });

  it("resets dirty fields back to the initial values", async () => {
    const user = userEvent.setup();
    renderSettingsForm({ defaultValues: validValues });

    const fullNameInput = screen.getByLabelText(/full name/i);
    await user.clear(fullNameInput);
    await user.type(fullNameInput, "Updated Name");

    const resetButton = screen.getByRole("button", { name: /reset changes/i });
    expect(resetButton).toBeEnabled();

    await user.click(resetButton);

    expect(fullNameInput).toHaveValue(validValues.fullName);
    expect(resetButton).toBeDisabled();
  });

  it("shows a success toast after submit", async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();

    renderSettingsForm({ onSubmit, defaultValues: validValues });

    const submitButton = screen.getByRole("button", { name: /save settings/i });

    await waitFor(() => {
      expect(submitButton).toBeEnabled();
    });

    await user.click(submitButton);

    expect(onSubmit).toHaveBeenCalledWith(validValues);
    expect(await screen.findByRole("status")).toHaveTextContent(
      /settings saved successfully/i,
    );
  });

  it("supports keyboard navigation between fields", async () => {
    const user = userEvent.setup();
    renderSettingsForm({ defaultValues: validValues });

    const fullNameInput = screen.getByLabelText(/full name/i);
    fullNameInput.focus();

    await user.tab();
    expect(screen.getByLabelText(/^email$/i)).toHaveFocus();

    await user.tab();
    expect(screen.getByLabelText(/^theme$/i)).toHaveFocus();
  });

  it("has no detectable accessibility violations", async () => {
    const { container } = renderSettingsForm({ defaultValues: validValues });

    const results = await axe(container, {
      rules: {
        "color-contrast": { enabled: false },
      },
    });

    expect(results.violations).toEqual([]);
  });
});
