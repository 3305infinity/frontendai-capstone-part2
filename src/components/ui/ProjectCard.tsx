import Link from "next/link";
import { Button } from "@/components/ui/button";
interface ProjectCardProps {
  title: string;
  description: string;
  tags: string[];
  href?: string;
}

export function ProjectCard({
  title,
  description,
  tags,
  href = "#",
}: ProjectCardProps) {
  return (
    <article className="flex h-full flex-col rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      <div className="mb-4 flex flex-wrap gap-2">
        {tags.map((tag) => (
          <span
            key={tag}
            className="rounded-full bg-[var(--color-background)] px-3 py-1 text-xs font-medium text-[var(--color-muted)]"
          >
            {tag}
          </span>
        ))}
      </div>
      <h3 className="text-xl font-semibold text-[var(--color-text)]">{title}</h3>
      <p className="mt-3 flex-1 text-sm leading-6 text-[var(--color-muted)]">
        {description}
      </p>
      <div className="mt-6">
        <Link href={href}>
          <Button variant="secondary">View details</Button>
        </Link>
      </div>
    </article>
  );
}
