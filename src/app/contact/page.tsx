import { Button } from "@/components/ui/button";

import { PageHeader } from "@/components/ui/PageHeader";
import { Section } from "@/components/ui/Section";

export default function ContactPage() {
  return (
    <div className="space-y-8">
      <PageHeader
        title="Contact"
        description="Reach out for collaboration, feedback, or internship opportunities related to this project."
      />

      <Section>
        <form className="mx-auto max-w-2xl space-y-5 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6 shadow-sm sm:p-8">
          <div className="space-y-2">
            <label htmlFor="name" className="text-sm font-medium text-[var(--color-text)]">
              Name
            </label>
            <input
              id="name"
              name="name"
              type="text"
              placeholder="Your name"
              className="w-full rounded-lg border border-[var(--color-border)] px-3 py-2 text-sm text-[var(--color-text)]"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium text-[var(--color-text)]">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              placeholder="you@example.com"
              className="w-full rounded-lg border border-[var(--color-border)] px-3 py-2 text-sm text-[var(--color-text)]"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="message" className="text-sm font-medium text-[var(--color-text)]">
              Message
            </label>
            <textarea
              id="message"
              name="message"
              rows={5}
              placeholder="How can I help?"
              className="w-full rounded-lg border border-[var(--color-border)] px-3 py-2 text-sm text-[var(--color-text)]"
            />
          </div>

          <Button type="submit">Send message</Button>
        </form>
      </Section>
    </div>
  );
}
