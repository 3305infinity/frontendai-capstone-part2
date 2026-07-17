"use client";

import { useRef, useEffect, useState } from "react";
import { type UIMessage as Message } from "@ai-sdk/react";
import { getMessageContent } from "@/lib/utils";
import { MessageBubble } from "./MessageBubble";
import { ThinkingIndicator } from "./ThinkingIndicator";
import { JumpToLatest } from "./JumpToLatest";

interface ChatMessageProps {
  messages: Message[];
  isLoading: boolean;
  onReload: () => void;
  error?: Error;
}

export function ChatMessage({ messages, isLoading, onReload, error }: ChatMessageProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [showScrollButton, setShowScrollButton] = useState(false);

  // Check if scroll position is close to the bottom
  const isAtBottom = () => {
    const container = containerRef.current;
    if (!container) return true;
    
    const threshold = 120; // Tolerance threshold in pixels
    const distanceToBottom = container.scrollHeight - container.scrollTop - container.clientHeight;
    return distanceToBottom <= threshold;
  };

  // Scroll to bottom helper
  const scrollToBottom = (behavior: ScrollBehavior = "smooth") => {
    const container = containerRef.current;
    if (!container) return;
    
    container.scrollTo({
      top: container.scrollHeight,
      behavior,
    });
  };

  // Monitor scroll movements to show/hide "Jump to latest" button
  const handleScroll = () => {
    const container = containerRef.current;
    if (!container) return;

    const isUserAtBottom = isAtBottom();
    const isScrollable = container.scrollHeight > container.clientHeight;
    
    setShowScrollButton(!isUserAtBottom && isScrollable);
  };

  // Auto-scroll logic when messages update
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Scroll automatically only if the user is already at the bottom
    if (isAtBottom()) {
      // Use instant scroll during active stream to keep cursor aligned, smooth scroll for completed items
      scrollToBottom(isLoading ? "auto" : "smooth");
    }
  }, [messages, isLoading]);

  // Initial scroll to bottom when chat loads
  useEffect(() => {
    scrollToBottom("auto");
  }, []);

  // Check if we should display the thinking indicator
  const lastMessage = messages[messages.length - 1];
  const showThinking =
    isLoading &&
    (!lastMessage ||
      lastMessage.role === "user" ||
      (lastMessage.role === "assistant" && getMessageContent(lastMessage) === ""));

  // Check if the request failed with an error
  const hasError = !!error && messages.length > 0 && lastMessage?.role === "user";

  return (
    <div className="relative flex flex-1 flex-col overflow-hidden bg-zinc-50/30 dark:bg-zinc-950/5">
      {/* Messages Scroll Panel */}
      <div
        ref={containerRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto"
      >
        <div className="flex flex-col">
          {messages.map((message, index) => {
            const isLast = index === messages.length - 1;
            // Only show reload triggers on assistant errors or final assistant bubbles
            return (
              <MessageBubble
                key={message.id || index}
                message={message}
                isLast={isLast}
                onReload={onReload}
              />
            );
          })}

          {/* Thinking loading state bubble */}
          {showThinking && (
            <div className="py-6 px-4 md:px-6 bg-white dark:bg-zinc-900/40 border-y border-[var(--color-border)]/40">
              <ThinkingIndicator />
            </div>
          )}

          {/* Error fallback display */}
          {hasError && (
            <div className="py-6 px-4 md:px-6 bg-white dark:bg-zinc-900/40 border-y border-[var(--color-border)]/40">
              <MessageBubble
                message={{
                  id: "error-bubble",
                  role: "assistant",
                  parts: [{ type: "text", text: "" }],
                }}
                isLast={true}
                onReload={onReload}
                isError={true}
              />
            </div>
          )}
        </div>
      </div>

      {/* Floating Jump to Latest Button */}
      {showScrollButton && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10">
          <JumpToLatest onClick={() => scrollToBottom("smooth")} />
        </div>
      )}
    </div>
  );
}
