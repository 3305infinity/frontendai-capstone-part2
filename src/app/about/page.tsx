import { PageHeader } from "@/components/ui/PageHeader";
import { Section } from "@/components/ui/Section";

export default function AboutPage() {
  return (
    <div className="space-y-8">
      <PageHeader
        title="About"
        description="Learn more about the goals, stack, and development approach behind this capstone project."
      />

      <Section>
        <div className="grid gap-6 md:grid-cols-2">
          <article className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-[var(--color-text)]">Mission</h2>
            <p className="mt-3 text-sm leading-6 text-[var(--color-muted)]">
              Build a maintainable frontend application that demonstrates modern
              engineering practices, accessible UI patterns, and AI-assisted workflows.
            </p>
          </article>
          <article className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-[var(--color-text)]">Stack</h2>
            <p className="mt-3 text-sm leading-6 text-[var(--color-muted)]">
              Next.js App Router, TypeScript, Tailwind CSS, React Hook Form, and Zod
              validation for reliable form handling.
            </p>
          </article>
        </div>
      </Section>
    </div>
  );
}
