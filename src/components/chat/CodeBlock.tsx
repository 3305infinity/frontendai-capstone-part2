"use client";

import { useState } from "react";
import { Copy, Check } from "lucide-react";

interface CodeBlockProps {
  language?: string;
  code: string;
}

export function CodeBlock({ language = "typescript", code }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  const cleanCode = code.trim();

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(cleanCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

  // Simple, performant custom regex-based syntax highlighter for common languages
  const highlightCode = (rawCode: string) => {
    // Escape HTML first
    let html = rawCode
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");



    // 1. Comments: green
    html = html.replace(/(\/\/.*|\/\*[\s\S]*?\*\/)/g, '<span class="text-green-500 font-mono">$1</span>');

    // 2. Strings: amber/yellow
    html = html.replace(/(["'`])(.*?)\1/g, '<span class="text-amber-400 font-mono">$1$2$1</span>');

    // 3. Keywords: pink/purple
    const keywords = /\b(const|let|var|function|return|import|export|from|as|default|class|extends|interface|type|public|private|protected|readonly|implements|new|if|else|for|while|do|switch|case|break|continue|async|await|try|catch|finally|throw|typeof|instanceof|in|of|keyof|namespace|get|set)\b/g;
    html = html.replace(keywords, '<span class="text-pink-400 font-medium">$1</span>');

    // 4. Common Types/Builtins: blue/cyan
    const types = /\b(string|number|boolean|any|void|unknown|never|undefined|null|true|false|Promise|Record|Partial|Omit|Pick|Required|Readonly|Map|Set|Array|Object|Function|Error|HTMLElement|Response|Request|Headers|URL|console|process|window|document)\b/g;
    html = html.replace(types, '<span class="text-cyan-400">$1</span>');

    // 5. Function calls: blue
    html = html.replace(/\b(\w+)(?=\s*\()/g, '<span class="text-sky-300">$1</span>');

    // 6. Numbers: orange
    html = html.replace(/\b(\d+)\b/g, '<span class="text-orange-400">$1</span>');

    return html;
  };

  const highlightedHtml = highlightCode(cleanCode);

  return (
    <div className="my-4 overflow-hidden rounded-xl border border-zinc-800 bg-zinc-950 font-mono text-sm text-zinc-200 shadow-md">
      {/* Codeblock Header */}
      <div className="flex items-center justify-between border-b border-zinc-800 bg-zinc-900/60 px-4 py-2 text-xs font-semibold text-zinc-400">
        <span className="uppercase tracking-wider">{language}</span>
        <button
          onClick={handleCopy}
          className="inline-flex items-center gap-1.5 rounded-md px-2.5 py-1 text-zinc-400 transition hover:bg-zinc-800 hover:text-zinc-200 focus:outline-none focus:ring-1 focus:ring-zinc-700"
          type="button"
          aria-label={copied ? "Copied" : "Copy code"}
        >
          {copied ? (
            <>
              <Check className="h-3.5 w-3.5 text-emerald-400" />
              <span className="text-emerald-400 font-medium">Copied!</span>
            </>
          ) : (
            <>
              <Copy className="h-3.5 w-3.5" />
              <span>Copy</span>
            </>
          )}
        </button>
      </div>

      {/* Code Content */}
      <div className="max-h-[500px] overflow-auto p-4 leading-relaxed scrollbar-thin scrollbar-thumb-zinc-800 scrollbar-track-transparent">
        <pre className="font-mono">
          <code
            className={`language-${language} font-mono`}
            dangerouslySetInnerHTML={{ __html: highlightedHtml }}
          />
        </pre>
      </div>
    </div>
  );
}
