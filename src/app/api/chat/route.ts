import {
  streamText,
  convertToModelMessages,
  createUIMessageStream,
  createUIMessageStreamResponse,
  tool,
  generateId,
  type UIMessage,
  type UIMessageChunk,
} from "ai";
import { getGoogleProvider, isApiKeyConfigured } from "@/lib/ai";
import { SYSTEM_PROMPT } from "@/lib/prompts";
import { buildRepoContext, formatRepoContextForPrompt } from "@/lib/repoContext";
import { analyzeRepository } from "@/lib/tools";
import { z } from "zod";

export const maxDuration = 30;

const repositoryAnalyzerTool = tool({
  description: "Analyze the current repository and return structured metadata about the project including project name, framework, language, dependencies, scripts, architecture summary, documentation status, and recommendations.",
  inputSchema: z.object({
    analysisType: z.enum(["overview", "architecture", "tech-stack", "documentation"]),
  }),
  execute: async (input) => {
    const analysis = await analyzeRepository({
      analysisType: input.analysisType,
    });
    return analysis;
  },
});

export async function GET() {
  return new Response(JSON.stringify({ isApiKeyConfigured: isApiKeyConfigured() }), {
    headers: { "Content-Type": "application/json" },
  });
}

export async function POST(req: Request) {
  try {
    const { messages } = (await req.json()) as { messages: UIMessage[] };

    if (!messages || !Array.isArray(messages)) {
      return new Response(JSON.stringify({ error: "Messages array is required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const repoContext = await buildRepoContext();
    const repoContextPrompt = formatRepoContextForPrompt(repoContext);

    const enhancedSystemPrompt = `${SYSTEM_PROMPT}\n\n${repoContextPrompt}`;

    if (isApiKeyConfigured()) {
      const provider = getGoogleProvider();
      if (provider) {
        const result = streamText({
          model: provider("gemini-1.5-flash"),
          messages: await convertToModelMessages(messages),
          system: enhancedSystemPrompt,
          tools: {
            repositoryAnalyzer: repositoryAnalyzerTool,
          },
          toolChoice: "auto",
        });

        return result.toUIMessageStreamResponse();
      }
    }

    const lastMessage = messages[messages.length - 1];
    const lastContent = getUIMessageText(lastMessage);

    const repositoryAnalysisTriggers = [
      /analyze\s+repository/i,
      /repository\s+analyzer/i,
      /analyze\s+this\s+repo/i,
      /explain\s+this\s+repository/i,
      /summarize\s+technologies/i,
      /tech\s+stack/i,
      /generate\s+a\s+professional\s+readme/i,
      /readme\s+md/i,
      /project\s+(overview|architecture|structure)/i,
      /what\s+is\s+this\s+project/i,
      /dependencies\s+list/i,
      /package\.json/i,
    ];

    const shouldCallRepositoryAnalyzer = repositoryAnalysisTriggers.some(
      (regex) => lastContent?.match(regex)
    );

    if (shouldCallRepositoryAnalyzer) {
      const input = { analysisType: "overview" } as const;
      const analysisResult = await analyzeRepository(input);

      const mockToolResult = {
        id: generateId(),
        role: "assistant" as const,
        parts: [
          {
            type: "tool-repositoryAnalyzer" as const,
            toolCallId: generateId(),
            state: "output-available" as const,
            input,
            output: analysisResult,
          },
          {
            type: "text" as const,
            text: `## Repository Analysis Complete

I've analyzed the repository and found the following:

**Project Overview**
- **Project Name:** ${analysisResult.projectName}
- **Framework:** ${analysisResult.framework}
- **Language:** ${analysisResult.language}

**Dependencies**
${analysisResult.dependencies.length > 0 
  ? analysisResult.dependencies.map((d) => `- ${d}`).join("\n")
  : "- No dependencies found"}

**Scripts**
${Object.entries(analysisResult.scripts).length > 0
  ? Object.entries(analysisResult.scripts).map(([k, v]) => `- **${k}**: ${v}`).join("\n")
  : "- No scripts defined"}

**Architecture Summary**
${analysisResult.architectureSummary}

**Documentation Status**
${analysisResult.documentationStatus}

**Recommendations**
${analysisResult.recommendations.map((r) => `- ${r}`).join("\n")}`
          }
        ] as const,
      } as UIMessage;

      const stream = createUIMessageStream({
        async execute({ writer }) {
          const parts = mockToolResult.parts;
          for (const part of parts) {
            if (part.type === "text") {
              const messageId = generateId();
              writer.write({ type: "text-start", id: messageId });
              
              const tokens = tokenize(part.text);
              for (const token of tokens) {
                writer.write({ type: "text-delta", id: messageId, delta: token });
                await delay(15);
              }
              
              writer.write({ type: "text-end", id: messageId });
            } else {
              writer.write(part as unknown as UIMessageChunk);
            }
          }
        },
      });

      return createUIMessageStreamResponse({ stream });
    }

    const lastMessageCheck = messages[messages.length - 1];
    const lastContentCheck = getUIMessageText(lastMessageCheck);
    const mockResponseText = getMockResponse(lastContentCheck);

    const stream = createUIMessageStream({
      async execute({ writer }) {
        const messageId = generateId();
        writer.write({ type: "text-start", id: messageId });

        const tokens = tokenize(mockResponseText);
        for (const token of tokens) {
          writer.write({ type: "text-delta", id: messageId, delta: token });
          await delay(35);
        }

        writer.write({ type: "text-end", id: messageId });
      },
    });

    return createUIMessageStreamResponse({ stream });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Internal Server Error";
    console.error("Error in AI Copilot chat route:", error);
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

function getUIMessageText(message: UIMessage): string {
  if (!message) return "";
  const msg = message as unknown as Record<string, unknown>;
  if (typeof msg.content === "string" && msg.content) return msg.content;
  if (Array.isArray(message.parts)) {
    return message.parts
      .filter((p): p is { type: "text"; text: string } => p.type === "text")
      .map((p) => p.text)
      .join("");
  }
  return "";
}

function tokenize(text: string): string[] {
  const tokens: string[] = [];
  const regex = /\s+|\S+/g;
  let match;
  while ((match = regex.exec(text)) !== null) {
    tokens.push(match[0]);
  }
  return tokens;
}

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function getMockResponse(userMessage: string): string {
  const query = userMessage.toLowerCase();

  const setupInstruction = `\n\n> [!NOTE]\n> **How to set up your API Key:**\n> Create a \`.env.local\` file in the project root directory and add:\n> \`\`\`env\n> GEMINI_API_KEY=your_api_key_here\n> \`\`\``;

  if (query.includes("code") || query.includes("function") || query.includes("program")) {
    return `Here is a production-grade TypeScript debounce function to help you build smooth UI interactions:

\`\`\`typescript
/**
 * Debounces a function call by a specified delay in milliseconds.
 * Useful for search inputs, resize events, or window scroll handlers.
 */
export function debounce<T extends (...args: any[]) => void>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeoutId: ReturnType<typeof setTimeout> | null = null;

  return function (...args: Parameters<T>): void {
    if (timeoutId !== null) {
      clearTimeout(timeoutId);
    }
    
    timeoutId = setTimeout(() => {
      func(...args);
    }, wait);
  };
}
\`\`\`

You can copy this function directly using the copy button on the top right of the code block.${setupInstruction}`;
  }

  if (query.includes("react") || query.includes("next")) {
    return `### React 19 & Next.js 16 Highlights

Here is a summary of the core concepts of React Server Components (RSC) vs Client Components:

| Feature | React Server Components (RSC) | Client Components ("use client") |
| :--- | :--- | :--- |
| **Execution** | Runs exclusively on the server | Runs on the server during SSR, then hydrates in browser |
| **Bundle Size** | 0KB javascript shipped to browser | Included in client bundle size |
| **Data Fetching** | Can fetch data directly from databases/APIs | Fetches data via API routes or hooks |
| **Interactivity** | No hooks (\`useState\`, \`useEffect\`) or event listeners | Full support for state, effects, and events |

Would you like to see how to implement data loading inside a Next.js Server Component?${setupInstruction}`;
  }

  if (query.includes("help") || query.includes("setup") || query.includes("config")) {
    return `### Welcome to Berozgar Copilot!

I am currently running in **Mock Mode** (Offline) because no API key was found in your environment.

To configure a live Gemini model:
1. Obtain an API Key from [Google AI Studio](https://aistudio.google.com).
2. Create a \`.env.local\` file in your project root.
3. Save the key in that file:
   \`\`\`env
   GEMINI_API_KEY=AIzaSyYourKeyGoesHere
   \`\`\`
4. Restart your development server.

Once configured, the system will automatically connect to **Gemini 1.5 Flash** for live streaming. Let me know if you need help with anything else!`;
  }

  return `Hello! I am Berozgar Copilot. 

I received your prompt: 
> "${userMessage}"

*Note: I am operating in **Mock Mode (Offline)** since there is no active Gemini API key configured. This allows you to test the complete UI workspace and all component states immediately.*

How can I assist you with your frontend AI capstone project today?${setupInstruction}`;
}