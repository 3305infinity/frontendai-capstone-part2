import { Container } from "@/components/ui/Container";

export function Footer() {
  return (
    <footer className="border-t border-[var(--color-border)] bg-[var(--color-surface)]">
      <Container className="flex flex-col gap-4 py-8 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-medium text-[var(--color-text)]">Berozgar</p>
          <p className="mt-1 text-sm text-[var(--color-muted)]">
            Frontend AI Engineering capstone project.
          </p>
        </div>
        <p className="text-sm text-[var(--color-muted)]">
          © {new Date().getFullYear()} Berozgar. All rights reserved.
        </p>
      </Container>
    </footer>
  );
}
