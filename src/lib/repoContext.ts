import { readFile } from "fs/promises";

const CONTEXT_FILES = [
  "README.md",
  "package.json",
  "workflow.md",
  "ARCHITECTURE.md",
  "BUILD_LOG.md",
];

export interface RepoContext {
  files: Record<string, string>;
  summary: string;
}

export async function buildRepoContext(): Promise<RepoContext> {
  const files: Record<string, string> = {};
  const readPromises = CONTEXT_FILES.map(async (relativePath) => {
    try {
      const fullPath = relativePath;
      const content = await readFile(fullPath, "utf-8");
      files[relativePath] = content;
    } catch {
      files[relativePath] = "";
    }
  });

  await Promise.all(readPromises);

  const availableFiles = Object.entries(files)
    .filter(([, content]) => content.length > 0)
    .map(([name]) => name);

  const summary = availableFiles.length > 0
    ? `Repository context loaded from: ${availableFiles.join(", ")}.`
    : "No repository context files were found.";

  return { files, summary };
}

export function formatRepoContextForPrompt(context: RepoContext): string {
  const sections: string[] = [];

  sections.push("# REPOSITORY CONTEXT");
  sections.push(context.summary);
  sections.push("");

  for (const [fileName, content] of Object.entries(context.files)) {
    if (!content) continue;
    sections.push(`## ${fileName}`);
    sections.push(content);
    sections.push("");
  }

  sections.push("---");
  sections.push("INSTRUCTIONS: Use the above repository context to answer questions accurately. Never fabricate details about this repository. If information is unavailable, explicitly state that it was not found in the repository files.");

  return sections.join("\n");
}
