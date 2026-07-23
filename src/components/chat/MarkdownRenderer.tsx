"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { CodeBlock } from "./CodeBlock";

interface MarkdownRendererProps {
  content: string;
}

export function MarkdownRenderer({ content }: MarkdownRendererProps) {
  return (
    <div className="prose prose-zinc dark:prose-invert max-w-none text-[15px] leading-8 text-[var(--color-text)]">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          code({ className, children, node, ...props }) {
            const match = /language-(\w+)/.exec(className || "");
            const codeString = String(children).replace(/\n$/, "");

            // Differentiate inline code vs code block
            const isBlock = !!match || codeString.includes("\n");

            if (!isBlock) {
              return (
                <code
                  className="rounded bg-zinc-200 dark:bg-zinc-800 px-1.5 py-0.5 font-mono text-[13px] font-medium text-pink-600 dark:text-pink-400"
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
              <blockquote className="my-6 border-l-4 border-[var(--color-primary)] bg-zinc-100 dark:bg-zinc-900/50 pl-5 py-3 pr-4 rounded-r-lg italic text-zinc-700 dark:text-zinc-300">
                {children}
              </blockquote>
            );
          },
          // Premium table designs
          table({ children }) {
            return (
              <div className="my-6 overflow-x-auto rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm">
                <table className="w-full text-left text-sm text-zinc-900 dark:text-zinc-100 border-collapse">
                  {children}
                </table>
              </div>
            );
          },
          thead({ children }) {
            return (
              <thead className="bg-zinc-100 dark:bg-zinc-800 border-b border-zinc-200 dark:border-zinc-700 text-xs font-bold uppercase tracking-wider text-zinc-600 dark:text-zinc-400">
                {children}
              </thead>
            );
          },
          tbody({ children }) {
            return <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">{children}</tbody>;
          },
          tr({ children }) {
            return <tr className="hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors">{children}</tr>;
          },
          th({ children }) {
            return <th className="px-4 py-3 font-bold text-zinc-900 dark:text-white">{children}</th>;
          },
          td({ children }) {
            return <td className="px-4 py-3 text-zinc-800 dark:text-zinc-200">{children}</td>;
          },
          a({ href, children }) {
            return (
              <a
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 dark:text-blue-400 hover:underline font-semibold break-all"
              >
                {children}
              </a>
            );
          },
          p({ children }) {
            return <p className="mb-5 leading-8 text-zinc-800 dark:text-zinc-200 last:mb-0">{children}</p>;
          },
          h1({ children }) {
            return <h1 className="text-2xl font-extrabold mt-8 mb-4 text-zinc-950 dark:text-white">{children}</h1>;
          },
          h2({ children }) {
            return <h2 className="text-xl font-bold mt-7 mb-4 text-zinc-950 dark:text-white">{children}</h2>;
          },
          h3({ children }) {
            return <h3 className="text-lg font-bold mt-6 mb-3 text-zinc-950 dark:text-white">{children}</h3>;
          },
          ul({ children }) {
            return <ul className="list-disc pl-8 mb-6 space-y-2">{children}</ul>;
          },
          ol({ children }) {
            return <ol className="list-decimal pl-8 mb-6 space-y-2">{children}</ol>;
          },
          li({ children }) {
            return <li className="text-zinc-800 dark:text-zinc-200 leading-8">{children}</li>;
          }
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
