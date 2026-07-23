import Link from "next/link";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/ui/PageHeader";
import { Section } from "@/components/ui/Section";
import { ExternalLink, Sparkles, Code2, Brain, Palette, Server, Database, BookOpen, Mail, FileText, Calendar } from "lucide-react";

const skillCategories = [
  {
    title: "Programming Languages",
    icon: Code2,
    items: ["C++", "Python", "JavaScript", "TypeScript", "SQL"],
  },
  {
    title: "AI & Machine Learning",
    icon: Brain,
    items: ["Gemini AI", "Vercel AI SDK", "Prompt Engineering", "RAG", "LangChain", "Pinecone"],
  },
  {
    title: "Frontend",
    icon: Palette,
    items: ["React", "Next.js", "Tailwind CSS", "HTML", "CSS"],
  },
  {
    title: "Backend",
    icon: Server,
    items: ["Node.js", "Express.js", "REST APIs"],
  },
  {
    title: "Databases & Tools",
    icon: Database,
    items: ["MongoDB", "Git", "GitHub", "Docker", "Postman", "Vercel"],
  },
];

const links = [
  {
    label: "Resume",
    href: "#",
    icon: FileText,
    external: false,
    placeholder: true,
  },
  {
    label: "GitHub",
    href: "https://github.com/3305infinity",
    icon: () => (
      <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden="true">
        <path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836c.85.004 1.705.115 2.504.337 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.16 22 16.416 22 12c0-5.523-4.477-10-10-10z" />
      </svg>
    ),
    external: true,
  },
  {
    label: "LinkedIn",
    href: "#",
    icon: () => (
      <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden="true">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
      </svg>
    ),
    external: true,
    placeholder: true,
  },
  {
    label: "Email",
    href: "#",
    icon: Mail,
    external: false,
    placeholder: true,
  },
  {
    label: "Book a Meeting",
    href: "#",
    icon: Calendar,
    external: false,
    placeholder: true,
  },
];

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

      <Section id="featured">
        <div className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-[var(--color-primary)]" />
          <h2 className="text-2xl font-semibold tracking-tight text-[var(--color-text)]">
            Featured Project
          </h2>
        </div>
        <div className="mt-6 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6 shadow-sm sm:p-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
            <div className="flex-1 space-y-4">
              <div>
                <h3 className="text-xl font-semibold text-[var(--color-text)]">
                  Berozgar AI Engineering Workspace
                </h3>
                <p className="mt-2 text-sm leading-7 text-[var(--color-muted)]">
                  A repository-aware copilot interface that explains codebases, surfaces
                  package metadata, and answers engineering questions grounded in the
                  current project. Built as an AI Engineering capstone with live streaming,
                  error-resilient messaging, and structured repository context.
                </p>
              </div>

              <div>
                <h4 className="text-xs font-semibold uppercase tracking-wider text-[var(--color-muted)]">
                  Technologies
                </h4>
                <div className="mt-2 flex flex-wrap gap-2">
                  {[
                    "Next.js",
                    "TypeScript",
                    "Tailwind CSS",
                    "AI SDK",
                    "React Markdown",
                    "Gemini",
                    "Vercel AI",
                  ].map((tech) => (
                    <span
                      key={tech}
                      className="rounded-lg border border-[var(--color-border)] bg-[var(--color-background)] px-2.5 py-1 text-xs font-medium text-[var(--color-muted)]"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="text-xs font-semibold uppercase tracking-wider text-[var(--color-muted)]">
                  Key Highlights
                </h4>
                <ul className="mt-2 list-disc space-y-1 pl-5 text-sm leading-7 text-[var(--color-text)]">
                  <li>Streaming chat with a custom transport layer</li>
                  <li>Repository-grounded prompt builder with fact verification rules</li>
                  <li>Error-resilient UI with retry and fallback states</li>
                  <li>Conversation persistence with localStorage</li>
                  <li>Markdown-aware rendering with syntax-highlighted code blocks</li>
                </ul>
              </div>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row lg:flex-col">
              <Link href="/copilot">
                <Button className="w-full sm:w-auto">
                  <ExternalLink className="h-4 w-4" />
                  Live Demo
                </Button>
              </Link>
              <Link
                href="https://github.com/3305infinity"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button variant="outline" className="w-full sm:w-auto">
                  GitHub
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </Section>

      <Section id="skills">
        <div className="flex items-center gap-2">
          <BookOpen className="h-5 w-5 text-[var(--color-primary)]" />
          <h2 className="text-2xl font-semibold tracking-tight text-[var(--color-text)]">
            Skills
          </h2>
        </div>
        <p className="mt-2 max-w-3xl text-sm text-[var(--color-muted)]">
          A concise view of the technologies and tools I use regularly across engineering,
          AI, and product work.
        </p>
        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {skillCategories.map(({ title, icon: Icon, items }) => (
            <div
              key={title}
              className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
            >
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--color-background)] text-[var(--color-primary)]">
                  <Icon className="h-4 w-4" />
                </div>
                <h3 className="text-sm font-semibold text-[var(--color-text)]">{title}</h3>
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                {items.map((item) => (
                  <span
                    key={item}
                    className="rounded-lg border border-[var(--color-border)] bg-[var(--color-background)] px-2.5 py-1 text-xs font-medium text-[var(--color-muted)] transition hover:-translate-y-0.5 hover:text-[var(--color-text)]"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </Section>

      <Section id="connect">
        <div className="flex items-center gap-2">
          <ExternalLink className="h-5 w-5 text-[var(--color-primary)]" />
          <h2 className="text-2xl font-semibold tracking-tight text-[var(--color-text)]">
            Connect
          </h2>
        </div>
        <p className="mt-2 max-w-3xl text-sm text-[var(--color-muted)]">
          Reach out for collaboration, roles, or quick questions.
        </p>
        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {links.map(({ label, href, icon: Icon, external, placeholder }) => {
            const Component = Icon;
            return (
              <div
                key={label}
                className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
              >
                {placeholder ? (
                  <div className="flex h-full items-center justify-between gap-3 opacity-75">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--color-background)] text-[var(--color-muted)]">
                        <Component className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-[var(--color-text)]">{label}</p>
                        <p className="text-xs text-[var(--color-muted)]">Coming soon</p>
                      </div>
                    </div>
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-[var(--color-muted)]">
                      Placeholder
                    </span>
                  </div>
                ) : external ? (
                  <Link
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex h-full items-center justify-between gap-3"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--color-background)] text-[var(--color-primary)]">
                        <Component className="h-4 w-4" />
                      </div>
                      <p className="text-sm font-semibold text-[var(--color-text)]">{label}</p>
                    </div>
                    <ExternalLink className="h-4 w-4 text-[var(--color-muted)]" aria-hidden="true" />
                  </Link>
                ) : (
                  <Link href={href} className="flex h-full items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--color-background)] text-[var(--color-primary)]">
                        <Component className="h-4 w-4" />
                      </div>
                      <p className="text-sm font-semibold text-[var(--color-text)]">{label}</p>
                    </div>
                    <ExternalLink className="h-4 w-4 text-[var(--color-muted)]" aria-hidden="true" />
                  </Link>
                )}
              </div>
            );
          })}
        </div>
      </Section>
    </div>
  );
}