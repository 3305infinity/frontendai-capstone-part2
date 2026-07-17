"use client";

import React, { useEffect, useState } from "react";
import { useChat, type UIMessage as Message } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { ChatHeader } from "./ChatHeader";
import { ChatMessage } from "./ChatMessage";
import { ChatInput } from "./ChatInput";
import { StopButton } from "./StopButton";
import { Terminal, Sparkles, MessageSquareCode, Palette, Zap } from "lucide-react";
import { getMessageContent } from "@/lib/utils";

interface ChatWindowProps {
  chatId: string;
  chatTitle: string;
  onRenameChat: (chatId: string, newTitle: string) => void;
  onClearChat: (chatId: string) => void;
}

const STORAGE_KEY_PREFIX = "berozgar:chat:";

// Load messages from localStorage
function getChatMessages(chatId: string): Message[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(`${STORAGE_KEY_PREFIX}${chatId}`);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as Record<string, unknown>[];
    // Migrate old Message structure to new UIMessage structure if needed
    return parsed.map((msg) => {
      if (!msg.parts && typeof msg.content === "string") {
        return {
          id: (msg.id as string) || `msg-${Date.now()}-${Math.random()}`,
          role: (msg.role as "user" | "assistant" | "system") || "user",
          parts: [{ type: "text", text: msg.content }],
          createdAt: msg.createdAt,
        } as unknown as Message;
      }
      return msg as unknown as Message;
    });
  } catch {
    return [];
  }
}

// Save messages to localStorage
function saveChatMessages(chatId: string, messages: Message[]) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(`${STORAGE_KEY_PREFIX}${chatId}`, JSON.stringify(messages));
  } catch (e) {
    console.error("Failed to save chat messages:", e);
  }
}

const suggestedPrompts = [
  {
    title: "Explain this repository",
    prompt: "Explain this repository: what it does, its purpose, and its current state.",
    icon: Terminal,
    color: "text-blue-500 bg-blue-500/10",
  },
  {
    title: "Explain project architecture",
    prompt: "Explain the project architecture: how the codebase is organized, key layers, and data flow.",
    icon: Sparkles,
    color: "text-purple-500 bg-purple-500/10",
  },
  {
    title: "Explain folder structure",
    prompt: "Explain the folder structure of this project and what each major directory contains.",
    icon: MessageSquareCode,
    color: "text-amber-500 bg-amber-500/10",
  },
  {
    title: "Generate README",
    prompt: "Generate a professional README for this repository based on its actual files and configuration.",
    icon: Palette,
    color: "text-pink-500 bg-pink-500/10",
  },
  {
    title: "Prepare me for an interview",
    prompt: "Prepare me for explaining this project in a software engineering interview: key talking points, architecture decisions, and tradeoffs.",
    icon: Zap,
    color: "text-emerald-500 bg-emerald-500/10",
  },
  {
    title: "Summarize technologies used",
    prompt: "Summarize all technologies, frameworks, and tools used in this project based on package.json and configuration files.",
    icon: MessageSquareCode,
    color: "text-cyan-500 bg-cyan-500/10",
  },
];

export function ChatWindow({
  chatId,
  chatTitle,
  onRenameChat,
  onClearChat,
}: ChatWindowProps) {
  const [isServerMockMode, setIsServerMockMode] = useState(true);
  const [hasRestoredMessages, setHasRestoredMessages] = useState(false);
  const [input, setInput] = useState("");

  // Fetch status of API keys from the server
  useEffect(() => {
    async function checkApiStatus() {
      try {
        const res = await fetch("/api/chat");
        if (res.ok) {
          const data = (await res.json()) as { isApiKeyConfigured: boolean };
          setIsServerMockMode(!data.isApiKeyConfigured);
        }
      } catch {
        setIsServerMockMode(true);
      }
    }
    checkApiStatus();
  }, []);

  const {
    messages,
    status,
    sendMessage,
    stop,
    regenerate,
    setMessages,
    error,
  } = useChat({
    id: chatId,
    transport: new DefaultChatTransport({ api: "/api/chat" }),
  });

  // Restore persisted messages after mount to avoid SSR hydration mismatch
  useEffect(() => {
    setHasRestoredMessages(false);
    setMessages(getChatMessages(chatId));
    setHasRestoredMessages(true);
  }, [chatId, setMessages]);

  const isLoading = status === "submitted" || status === "streaming";

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;
    sendMessage({ text: input });
    setInput("");
  };

  // Sync messages list changes back to localStorage
  useEffect(() => {
    saveChatMessages(chatId, messages);

    // Auto-rename chat from "New Chat" based on the first prompt
    if (chatTitle === "New Chat" && messages.length > 0) {
      const firstUserMsg = messages.find((m) => m.role === "user");
      const firstUserPrompt = firstUserMsg ? getMessageContent(firstUserMsg) : "";
      if (firstUserPrompt) {
        const cleanTitle =
          firstUserPrompt.trim().slice(0, 30) + (firstUserPrompt.length > 30 ? "..." : "");
        onRenameChat(chatId, cleanTitle);
      }
    }
  }, [messages, chatId, chatTitle, onRenameChat]);

  // Export current conversation to Markdown
  const handleExportMarkdown = () => {
    if (messages.length === 0) return;

    const mdText = messages
      .map((msg) => {
        const roleHeader = msg.role === "user" ? "### 👤 User" : "### 🤖 Berozgar Copilot";
        const msgRecord = msg as unknown as Record<string, unknown>;
        const createdAtValue = msgRecord.createdAt;
        const dateStr =
          typeof createdAtValue === "string" ||
          typeof createdAtValue === "number" ||
          createdAtValue instanceof Date
            ? `\n*Sent at: ${new Date(createdAtValue).toLocaleString()}*\n`
            : "";
        return `${roleHeader}${dateStr}\n${getMessageContent(msg)}\n\n---\n`;
      })
      .join("\n");

    const headerBlock = `# Chat Log: ${chatTitle}\n*Generated by Berozgar AI Workspace*\n\n---\n\n`;
    const fullContent = headerBlock + mdText;

    const blob = new Blob([fullContent], { type: "text/markdown;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const downloadLink = document.createElement("a");
    downloadLink.href = url;
    downloadLink.download = `chat-export-${chatTitle.toLowerCase().replace(/[^a-z0-9]+/g, "-")}.md`;
    downloadLink.click();
    URL.revokeObjectURL(url);
  };

  // Clear messages list
  const handleClearMessages = () => {
    if (window.confirm("Are you sure you want to clear all messages in this conversation?")) {
      setMessages([]);
      if (typeof window !== "undefined") {
        localStorage.removeItem(`${STORAGE_KEY_PREFIX}${chatId}`);
      }
      onClearChat(chatId);
    }
  };

  // Click handler for suggested cards
  const handleSuggestedPromptClick = (promptText: string) => {
    sendMessage({ text: promptText });
  };

  return (
    <div className="flex h-full flex-col overflow-hidden rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] shadow-sm">
      {/* Header Area */}
      <ChatHeader
        title={chatTitle}
        isMockMode={isServerMockMode}
        onClearChat={handleClearMessages}
        onExportMarkdown={handleExportMarkdown}
        hasMessages={messages.length > 0}
      />

      {/* Main content body */}
      <div className="relative flex flex-1 flex-col overflow-hidden">
        {!hasRestoredMessages ? (
          <div className="flex flex-1 items-center justify-center">
            <div className="h-5 w-5 animate-spin rounded-full border-2 border-[var(--color-primary)] border-t-transparent" />
          </div>
        ) : messages.length === 0 ? (
          /* Empty Welcome State */
          <div className="flex flex-1 flex-col items-center justify-center overflow-y-auto px-6 py-12 text-center">
            <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 dark:bg-blue-950/20 text-[var(--color-primary)] animate-pulse">
              <Terminal className="h-7 w-7" />
            </div>

            <h2 className="text-xl font-bold tracking-tight text-[var(--color-text)] sm:text-2xl">
              Engineering Project Copilot
            </h2>
            <p className="mt-2 max-w-md text-sm text-[var(--color-muted)] leading-relaxed">
              I understand this repository. Ask me about its architecture, structure, technologies, or generate project documentation.
            </p>

            {/* Suggested Prompts Grid */}
            <div className="mt-10 grid w-full max-w-3xl gap-4 sm:grid-cols-2">
              {suggestedPrompts.map((item, idx) => {
                const Icon = item.icon;
                return (
                  <button
                    key={idx}
                    onClick={() => handleSuggestedPromptClick(item.prompt)}
                    className="flex flex-col items-start rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5 text-left transition hover:border-[var(--color-primary)] hover:bg-[var(--color-background)] hover:shadow-sm"
                    type="button"
                  >
                    <div className={`rounded-lg p-2 ${item.color}`}>
                      <Icon className="h-4.5 w-4.5" />
                    </div>
                    <h3 className="mt-3 text-sm font-semibold text-[var(--color-text)]">
                      {item.title}
                    </h3>
                    <p className="mt-1 text-xs text-[var(--color-muted)] line-clamp-2 leading-normal">
                      {item.prompt}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>
        ) : (
          /* Message List */
          <ChatMessage
            messages={messages}
            isLoading={isLoading}
            onReload={regenerate}
            error={error}
          />
        )}
      </div>

      {/* Input controls container */}
      <div className="relative border-t border-[var(--color-border)] bg-[var(--color-surface)] px-6 py-5">
        {/* Floating Stop Button above input */}
        {isLoading && (
          <div className="absolute -top-12 left-1/2 -translate-x-1/2 z-10">
            <StopButton onStop={stop} />
          </div>
        )}

        <ChatInput
          input={input}
          handleInputChange={handleInputChange}
          handleSubmit={handleSubmit}
          isLoading={isLoading}
        />
        
        <p className="mt-2 text-center text-[10px] text-[var(--color-muted)]">
          Copilot can make mistakes. Verify code and critical details.
        </p>
      </div>
    </div>
  );
}
