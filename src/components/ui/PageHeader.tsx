interface PageHeaderProps {
  title: string;
  description: string;
}

export function PageHeader({ title, description }: PageHeaderProps) {
  return (
    <header className="space-y-3">
      <h1 className="text-3xl font-semibold tracking-tight text-[var(--color-text)] sm:text-4xl">
        {title}
      </h1>
      <p className="max-w-2xl text-base text-[var(--color-muted)] sm:text-lg">
        {description}
      </p>
    </header>
  );
}
