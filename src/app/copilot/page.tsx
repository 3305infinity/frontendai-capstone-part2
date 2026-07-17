"use client";

import React, { useState, useEffect } from "react";
import { ChatWindow } from "@/components/chat/ChatWindow";
import { Plus, MessageSquare, Trash2, Edit2, Check, X, Menu } from "lucide-react";
import { Section } from "@/components/ui/Section";

interface ChatSession {
  id: string;
  title: string;
  createdAt: number;
}

const CHATS_LIST_KEY = "berozgar:chats";
const STORAGE_KEY_PREFIX = "berozgar:chat:";

export default function CopilotPage() {
  const [chats, setChats] = useState<ChatSession[]>([]);
  const [activeChatId, setActiveChatId] = useState<string>("");
  const [editingChatId, setEditingChatId] = useState<string>("");
  const [editTitle, setEditTitle] = useState<string>("");
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);
  const [isMounted, setIsMounted] = useState<boolean>(false);

  // Load chat sessions from localStorage on mount
  useEffect(() => {
    setIsMounted(true);
    try {
      const raw = localStorage.getItem(CHATS_LIST_KEY);
      const savedChats: ChatSession[] = raw ? JSON.parse(raw) : [];
      
      if (savedChats.length > 0) {
        setChats(savedChats);
        setActiveChatId(savedChats[0].id);
      } else {
        // Create an initial default chat session if list is empty
        const initialChat: ChatSession = {
          id: `chat-${Date.now()}`,
          title: "New Chat",
          createdAt: Date.now(),
        };
        const newList = [initialChat];
        setChats(newList);
        setActiveChatId(initialChat.id);
        localStorage.setItem(CHATS_LIST_KEY, JSON.stringify(newList));
      }
    } catch (e) {
      console.error("Failed to load chat history:", e);
    }
  }, []);

  // Save chat list whenever it changes
  const saveChatsList = (updatedChats: ChatSession[]) => {
    setChats(updatedChats);
    try {
      localStorage.setItem(CHATS_LIST_KEY, JSON.stringify(updatedChats));
    } catch (e) {
      console.error("Failed to save chat sessions:", e);
    }
  };

  // Create a new chat session
  const handleNewChat = () => {
    const newChat: ChatSession = {
      id: `chat-${Date.now()}`,
      title: "New Chat",
      createdAt: Date.now(),
    };
    const newList = [newChat, ...chats];
    saveChatsList(newList);
    setActiveChatId(newChat.id);
    setIsSidebarOpen(false); // Close sidebar on mobile
  };

  // Delete a chat session
  const handleDeleteChat = (id: string, e: React.MouseEvent) => {
    e.stopPropagation(); // Avoid selecting the deleted chat
    if (chats.length <= 1) {
      alert("You must keep at least one conversation session active.");
      return;
    }

    if (window.confirm("Are you sure you want to delete this conversation?")) {
      const updatedChats = chats.filter((c) => c.id !== id);
      saveChatsList(updatedChats);
      
      // Clean up messages from localStorage
      try {
        localStorage.removeItem(`${STORAGE_KEY_PREFIX}${id}`);
      } catch {
        // Ignore removal error
      }

      // If active chat was deleted, switch to another
      if (activeChatId === id) {
        setActiveChatId(updatedChats[0].id);
      }
    }
  };

  // Rename session trigger
  const startEditing = (id: string, currentTitle: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingChatId(id);
    setEditTitle(currentTitle);
  };

  const cancelEditing = (e: React.SyntheticEvent) => {
    e.stopPropagation();
    setEditingChatId("");
    setEditTitle("");
  };

  const handleSaveRename = (id: string, e: React.SyntheticEvent) => {
    e.stopPropagation();
    if (!editTitle.trim()) return;

    const updatedChats = chats.map((c) =>
      c.id === id ? { ...c, title: editTitle.trim() } : c
    );
    saveChatsList(updatedChats);
    setEditingChatId("");
    setEditTitle("");
  };

  // Automatic rename from ChatWindow when first user prompt goes through
  const handleAutoRename = (id: string, newTitle: string) => {
    const updatedChats = chats.map((c) =>
      c.id === id ? { ...c, title: newTitle } : c
    );
    saveChatsList(updatedChats);
  };

  // Clear messages within ChatWindow
  const handleClearChatContent = (id: string) => {
    // We can reset title back to "New Chat" when cleared
    const updatedChats = chats.map((c) =>
      c.id === id ? { ...c, title: "New Chat" } : c
    );
    saveChatsList(updatedChats);
  };

  if (!isMounted) {
    return (
      <div className="flex h-[600px] items-center justify-center rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)]">
        <div className="flex items-center gap-3">
          <div className="h-5 w-5 animate-spin rounded-full border-2 border-[var(--color-primary)] border-t-transparent" />
          <span className="text-sm font-semibold text-[var(--color-muted)]">Loading Workspace...</span>
        </div>
      </div>
    );
  }

  const activeChat = chats.find((c) => c.id === activeChatId) || chats[0];

  return (
    <Section className="relative flex h-[700px] overflow-hidden rounded-2xl border border-[var(--color-border)] bg-[var(--color-background)] shadow-sm">
      {/* Mobile Sidebar Hamburger Toggle */}
      <button
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        className="absolute top-4 left-4 z-40 flex h-10 w-10 items-center justify-center rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text)] md:hidden shadow-sm hover:bg-[var(--color-background)]"
        type="button"
        aria-label="Toggle chat sidebar"
      >
        <Menu className="h-5 w-5" />
      </button>

      {/* Sidebar Panel */}
      <aside
        className={`absolute inset-y-0 left-0 z-30 flex w-72 shrink-0 flex-col border-r border-[var(--color-border)] bg-[var(--color-surface)] transition-transform duration-300 md:static md:translate-x-0 ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Sidebar Header with New Chat Button */}
        <div className="p-4 border-b border-[var(--color-border)] flex items-center justify-between gap-2 mt-12 md:mt-0">
          <button
            onClick={handleNewChat}
            className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-[var(--color-primary)] px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[var(--color-primary)]/90 active:scale-[0.98]"
            type="button"
          >
            <Plus className="h-4 w-4" />
            <span>New Chat</span>
          </button>
        </div>

        {/* Sidebar Navigation - Recent Chats */}
        <div className="flex-1 overflow-y-auto p-3 space-y-1">
          <span className="px-3 py-2 text-[10px] font-bold uppercase tracking-wider text-[var(--color-muted)] block">
            Recent Chats
          </span>

          {chats.map((c) => {
            const isActive = c.id === activeChatId;
            const isEditing = c.id === editingChatId;

            return (
              <div
                key={c.id}
                onClick={() => {
                  setActiveChatId(c.id);
                  setIsSidebarOpen(false); // Close mobile sidebar
                }}
                className={`group flex items-center justify-between rounded-xl px-3 py-2.5 text-sm font-medium transition cursor-pointer ${
                  isActive
                    ? "bg-[var(--color-background)] text-[var(--color-primary)]"
                    : "text-[var(--color-muted)] hover:bg-[var(--color-background)]/60 hover:text-[var(--color-text)]"
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0 flex-1">
                  <MessageSquare className={`h-4.5 w-4.5 shrink-0 ${isActive ? "text-[var(--color-primary)]" : "text-[var(--color-muted)]"}`} />
                  
                  {isEditing ? (
                    <input
                      type="text"
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                      onClick={(e) => e.stopPropagation()}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") handleSaveRename(c.id, e);
                        if (e.key === "Escape") cancelEditing(e);
                      }}
                      className="bg-transparent text-sm text-[var(--color-text)] border-b border-[var(--color-primary)] outline-none w-full py-0.5"
                      autoFocus
                    />
                  ) : (
                    <span className="truncate text-xs font-semibold">{c.title}</span>
                  )}
                </div>

                {/* Edit & Delete Action Panel */}
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  {isEditing ? (
                    <>
                      <button
                        onClick={(e) => handleSaveRename(c.id, e)}
                        className="rounded p-1 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-emerald-600 dark:text-emerald-400"
                        type="button"
                      >
                        <Check className="h-3.5 w-3.5" />
                      </button>
                      <button
                        onClick={cancelEditing}
                        className="rounded p-1 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-500"
                        type="button"
                      >
                        <X className="h-3.5 w-3.5" />
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={(e) => startEditing(c.id, c.title, e)}
                        className="rounded p-1 hover:bg-zinc-200/50 dark:hover:bg-zinc-800/80 text-[var(--color-muted)] hover:text-[var(--color-text)]"
                        type="button"
                        title="Rename Chat"
                      >
                        <Edit2 className="h-3 w-3" />
                      </button>
                      <button
                        onClick={(e) => handleDeleteChat(c.id, e)}
                        className="rounded p-1 hover:bg-red-50 dark:hover:bg-red-950/20 text-[var(--color-muted)] hover:text-red-600 dark:hover:text-red-400"
                        type="button"
                        title="Delete Chat"
                      >
                        <Trash2 className="h-3 w-3" />
                      </button>
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </aside>

      {/* Backdrop overlay for Mobile Sidebar */}
      {isSidebarOpen && (
        <div
          onClick={() => setIsSidebarOpen(false)}
          className="fixed inset-0 z-20 bg-black/35 backdrop-blur-sm md:hidden"
        />
      )}

      {/* Main Chat Workspace */}
      <main className="flex flex-1 flex-col overflow-hidden bg-white dark:bg-zinc-950/20">
        {activeChat ? (
          <ChatWindow
            key={activeChat.id}
            chatId={activeChat.id}
            chatTitle={activeChat.title}
            onRenameChat={handleAutoRename}
            onClearChat={handleClearChatContent}
          />
        ) : (
          <div className="flex flex-1 items-center justify-center text-sm text-[var(--color-muted)] font-medium">
            Select or create a conversation to begin.
          </div>
        )}
      </main>
    </Section>
  );
}
