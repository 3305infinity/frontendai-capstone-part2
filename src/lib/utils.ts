import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getMessageContent(message: unknown): string {
  if (!message || typeof message !== "object") return "";
  const msgRecord = message as Record<string, unknown>;
  if (typeof msgRecord.content === "string" && msgRecord.content) {
    return msgRecord.content;
  }
  const parts = msgRecord.parts;
  if (!parts || !Array.isArray(parts)) {
    return "";
  }
  return parts
    .filter((part): part is Record<string, unknown> => typeof part === "object" && part !== null && part.type === "text")
    .map((part) => (part.text as string) || "")
    .join("");
}

export function getToolResult(message: unknown, toolName: string): unknown | null {
  if (!message || typeof message !== "object") return null;
  const msgRecord = message as Record<string, unknown>;
  const parts = msgRecord.parts;
  if (!parts || !Array.isArray(parts)) return null;
  
  for (const part of parts) {
    if (typeof part === "object" && part !== null && "type" in part) {
      const partRecord = part as Record<string, unknown>;
      if (partRecord.type === "tool-result" && partRecord.toolName === toolName) {
        return partRecord.result;
      }
    }
  }
  return null;
}