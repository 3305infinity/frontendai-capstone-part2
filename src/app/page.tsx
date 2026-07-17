import Link from "next/link";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/ui/PageHeader";
import { Section } from "@/components/ui/Section";

export default function HomePage() {
  return (
    <div className="space-y-10">
      <PageHeader
        title="Frontend AI Engineering Capstone"
        description="A production-minded portfolio application built with Next.js, TypeScript, and Tailwind CSS."
      />

      <Section>
        <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-8 shadow-sm sm:p-10">
          <p className="max-w-3xl text-base leading-7 text-[var(--color-muted)]">
            Explore the project routes to review placeholder pages, account settings,
            and a server-rendered health check powered by an external API.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link href="/projects">
              <Button>View projects</Button>
            </Link>
            <Link href="/settings">
              <Button variant="secondary">Open settings</Button>
            </Link>
          </div>
        </div>
      </Section>
    </div>
  );
}
