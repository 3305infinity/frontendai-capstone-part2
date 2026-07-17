import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Extracts text content from a message object, supporting both modern parts-based
 * and legacy content-based AI SDK message structures.
 */
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
