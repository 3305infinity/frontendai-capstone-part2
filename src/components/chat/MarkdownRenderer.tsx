"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { CodeBlock } from "./CodeBlock";

interface MarkdownRendererProps {
  content: string;
}

export function MarkdownRenderer({ content }: MarkdownRendererProps) {
  return (
    <div className="prose prose-zinc dark:prose-invert max-w-none text-sm leading-relaxed text-[var(--color-text)]">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          code({ className, children, ...props }) {
            const match = /language-(\w+)/.exec(className || "");
            const codeString = String(children).replace(/\n$/, "");

            // Differentiate inline code vs code block
            const isBlock = !!match || codeString.includes("\n");

            if (!isBlock) {
              return (
                <code
                  className="rounded bg-zinc-800/10 dark:bg-zinc-200/10 px-1.5 py-0.5 font-mono text-xs font-semibold text-[var(--color-primary)]"
                  {...props}
                >
                  {children}
                </code>
              );
            }

            return (
              <CodeBlock
                language={match ? match[1] : "text"}
                code={codeString}
              />
            );
          },
          // Format Callouts/Blockquotes styled nicely
          blockquote({ children }) {
            return (
              <blockquote className="my-4 border-l-4 border-[var(--color-primary)] bg-[var(--color-primary)]/5 pl-4 py-2 pr-2 rounded-r-lg italic text-[var(--color-muted)] text-sm">
                {children}
              </blockquote>
            );
          },
          // Premium table designs
          table({ children }) {
            return (
              <div className="my-4 overflow-x-auto rounded-xl border border-[var(--color-border)] shadow-sm">
                <table className="w-full text-left text-sm text-[var(--color-text)] border-collapse">
                  {children}
                </table>
              </div>
            );
          },
          thead({ children }) {
            return (
              <thead className="bg-[var(--color-background)] border-b border-[var(--color-border)] text-xs font-semibold uppercase tracking-wider text-[var(--color-muted)]">
                {children}
              </thead>
            );
          },
          tbody({ children }) {
            return <tbody className="divide-y divide-[var(--color-border)]">{children}</tbody>;
          },
          tr({ children }) {
            return <tr className="hover:bg-[var(--color-background)]/50 transition-colors">{children}</tr>;
          },
          th({ children }) {
            return <th className="px-4 py-3 font-semibold text-[var(--color-text)]">{children}</th>;
          },
          td({ children }) {
            return <td className="px-4 py-3 text-[var(--color-text)]/90">{children}</td>;
          },
          a({ href, children }) {
            return (
              <a
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[var(--color-primary)] hover:underline font-medium break-all"
              >
                {children}
              </a>
            );
          },
          p({ children }) {
            return <p className="mb-3 leading-7 text-[var(--color-text)] last:mb-0">{children}</p>;
          },
          h1({ children }) {
            return <h1 className="text-xl font-bold mt-6 mb-3 text-[var(--color-text)]">{children}</h1>;
          },
          h2({ children }) {
            return <h2 className="text-lg font-bold mt-5 mb-3 text-[var(--color-text)]">{children}</h2>;
          },
          h3({ children }) {
            return <h3 className="text-base font-semibold mt-4 mb-2 text-[var(--color-text)]">{children}</h3>;
          },
          ul({ children }) {
            return <ul className="list-disc pl-6 mb-4 space-y-1.5">{children}</ul>;
          },
          ol({ children }) {
            return <ol className="list-decimal pl-6 mb-4 space-y-1.5">{children}</ol>;
          },
          li({ children }) {
            return <li className="text-[var(--color-text)] leading-relaxed">{children}</li>;
          }
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
