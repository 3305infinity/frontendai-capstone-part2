#  Engineering Project Copilot

An AI-powered developer productivity tool that understands your software repository and answers repository-specific questions. Built with Next.js 16, React 19, TypeScript, and Tailwind CSS v4.

## Project Overview
Berozgar transforms a generic AI chat interface into an **Engineering Project Copilot**. Instead of acting as a general-purpose chatbot, it reads actual project files — `README.md`, `package.json`, `workflow.md`, and others — to ground its responses in real repository data.

The copilot can explain the repository's architecture, summarize its folder structure, generate professional documentation, and prepare engineers for project interviews — all without hallucinating details.

## Architecture

```
┌─────────────────┐     ┌──────────────────┐     ┌─────────────────┐
│   Client UI     │────▶│  /api/chat Route  │────▶│  AI Model       │
│ (Next.js SPA)  │     │  (Server Action)  │     │ (Gemini Flash)  │
└─────────────────┘     └──────────────────┘     └─────────────────┘
                               │
                               ▼
                       ┌──────────────────┐
                       │  repoContext.ts  │
                       │ (Filesystem Read)│
                       └──────────────────┘
```

### Request Flow

1. **User asks a repository question** via the chat interface.
2. **API route reads context**: `repoContext.ts` loads `README.md`, `package.json`, and other project files from the filesystem.
3. **Context injection**: The file contents are formatted into a markdown prompt and prepended to the system message.
4. **AI generates response**: The model answers using only the provided repository context. If information is missing, it states so explicitly.
5. **Streaming response**: The answer streams back to the client via the Vercel AI SDK.

### Design Decisions

| Decision | Rationale |
|----------|-----------|
| Filesystem reads instead of embeddings | Simpler, deterministic, no vector DB or RAG pipeline required for MVP |
| Per-request context loading | Avoids cache invalidation complexity; acceptable latency (~5-20ms) for MVP |
| Modified existing `/api/chat` route | Minimal code change; preserves existing streaming and mock-mode behavior |
| Reused existing chat UI components | No need to rebuild sidebar, input, markdown renderer, or streaming logic |

## Features

- **Repository-aware chat**: Answers grounded in actual project files, not hallucinations.
- **Streaming responses**: Real-time token streaming via Vercel AI SDK.
- **Persistent chat sessions**: Multiple conversations stored in `localStorage`.
- **Markdown rendering**: Full GitHub-Flavored Markdown support with syntax highlighting.
- **Theme support**: Light and dark mode with CSS custom properties.
- **Suggested prompts**: Six repository-specific prompts for quick exploration.
- **Export conversations**: Download chat history as Markdown.
- **Mock mode**: Works offline without an API key using simulated streaming.
- **AI SDK Tool Calling**: `repositoryAnalyzer` tool inspects repository files and returns structured metadata rendered as professional UI components.

## Tech Stack

| Category | Technology |
|----------|-----------|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript 5.8 |
| Styling | Tailwind CSS v4 |
| AI SDK | Vercel AI SDK (`ai` v7, `@ai-sdk/react`, `@ai-sdk/google`) |
| AI Model | Google Gemini 1.5 Flash |
| Forms | React Hook Form + Zod |
| UI Primitives | `@base-ui/react`, shadcn/ui (base-nova) |
| Icons | Lucide React |
| Testing | Vitest + Testing Library |

## Installation

```bash
git clone https://github.com/<your-username>/berozgar.git
cd berozgar
npm install
cp .env.example .env.local
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Environment Variables

| Variable | Description |
|----------|-------------|
| `GEMINI_API_KEY` | Google Generative AI API key for live mode |
| `GOOGLE_GENERATIVE_AI_API_KEY` | Alternative env var name supported |

Without an API key, the application runs in **Mock Mode** with simulated streaming responses.

## AI SDK Tool: repositoryAnalyzer

The `repositoryAnalyzer` tool provides production-quality AI SDK Tool Calling that inspects repository files and returns structured metadata.

### Purpose

Analyze the current repository and return structured metadata about the project including project name, framework, language, dependencies, scripts, architecture summary, documentation status, and recommendations.

### Input Schema

```typescript
{
  analysisType: "overview" | "architecture" | "tech-stack" | "documentation"
}
```

### Output Shape

```typescript
{
  projectName: string;
  framework: string;
  language: string;
  dependencies: string[];
  scripts: Record<string, string>;
  architectureSummary: string;
  documentationStatus: string;
  recommendations: string[];
}
```

### Example Response

```json
{
  "projectName": "Berozgar",
  "framework": "Next.js",
  "language": "TypeScript",
  "dependencies": ["@ai-sdk/google", "next", "react", "tailwindcss"],
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "test": "vitest run"
  },
  "architectureSummary": "Repository context loaded from: README.md, package.json",
  "documentationStatus": "README.md, package.json",
  "recommendations": [
    "Add ARCHITECTURE.md to document system design",
    "Add workflow.md for development process documentation"
  ]
}
```

### Tool States

1. **Input Streaming**: Animated card with "Analyzing repository..." message and spinner
2. **Input Available**: Repository files detected with small previews
3. **Output Available**: `RepositoryAnalysisCard` component renders structured data with icons
4. **Output Error**: `RepositoryErrorCard` displays error with suggested fix and retry button

### Usage

The tool is automatically available to the AI model. Users can trigger it by asking questions like:

- "Analyze this repository"
- "What is this project about?"
- "Show me the tech stack"

The LLM can decide to call the tool based on the user's query, and the result is rendered as a beautiful React component instead of raw JSON.

### Components

- `RepositoryAnalysisCard`: Renders the analysis result with professional SaaS design
- `RepositoryLoadingCard`: Shows loading state with animated progress
- `RepositoryInputCard`: Displays detected files and preview
- `RepositoryErrorCard`: Error handling with retry capability
- `RepositorySummarySection`: Reusable section component for displaying metadata

## Usage

1. Navigate to `/copilot`.
2. Choose a suggested prompt or type your own repository question.
3. The agent reads project files and streams a grounded response.
4. Use the sidebar to manage multiple chat sessions.
5. Export conversations as Markdown using the header button.

### Example Prompts

- "Explain this repository"
- "Explain project architecture"
- "Explain folder structure"
- "Generate a professional README"
- "Prepare me for explaining this project in an interview"
- "Summarize technologies used"

## Folder Structure

```
src/
├── app/
│   ├── api/
│   │   └── chat/
│   │       └── route.ts        # AI streaming endpoint + repo context injection + tool support
│   ├── copilot/
│   │   └── page.tsx            # Main chat workspace (sidebar + sessions)
│   ├── layout.tsx              # Root layout (fonts, providers, navbar, footer)
│   ├── page.tsx                # Homepage
│   └── globals.css             # Tailwind v4 + CSS custom properties
├── components/
│   ├── chat/
│   │   ├── ChatWindow.tsx      # Chat orchestrator + suggested prompts
│   │   ├── ChatInput.tsx       # Auto-resize textarea
│   │   ├── ChatHeader.tsx      # Title, status, export/clear actions
│   │   ├── ChatMessage.tsx     # Message list + auto-scroll + tool result handling
│   │   ├── MessageBubble.tsx   # Per-message rendering + tool cards
│   │   ├── MarkdownRenderer.tsx # react-markdown + custom renderers
│   │   ├── CodeBlock.tsx       # Syntax-highlighted code blocks
│   │   ├── StopButton.tsx      # Stop generation control
│   │   ├── ThinkingIndicator.tsx # Loading animation
│   │   └── JumpToLatest.tsx    # Scroll-to-bottom button
│   ├── layout/
│   │   ├── Navbar.tsx          # Sticky navigation
│   │   └── Footer.tsx          # Site footer
│   ├── tools/
│   │   ├── index.ts            # Component exports
│   │   ├── RepositoryAnalysisCard.tsx   # Analysis result card
│   │   ├── RepositoryLoadingCard.tsx   # Loading state animation
│   │   ├── RepositoryInputCard.tsx     # File detection preview
│   │   ├── RepositoryErrorCard.tsx     # Error display with retry
│   │   └── RepositorySummarySection.tsx # Reusable section component
│   └── ui/
│       ├── Container.tsx       # Max-width wrapper
│       ├── Section.tsx         # Vertical spacing
│       ├── PageHeader.tsx      # Title + description
│       └── button.tsx          # CVA-based button primitive
├── lib/
│   ├── ai.ts                   # Google provider setup
│   ├── prompts.ts              # System prompt (repository-aware)
│   ├── repoContext.ts          # Filesystem reader for project files
│   ├── tools.ts                # Tool schema + implementation
│   ├── schema.ts               # Zod schemas
│   ├── settingsStorage.ts      # localStorage persistence
│   ├── theme.ts                # Theme resolution + application
│   └── utils.ts                # cn(), getMessageContent(), getToolResult()
└── test/
    └── setup.ts                # Test environment setup
```

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start the Next.js development server |
| `npm run build` | Create a production build |
| `npm run start` | Run the production server locally |
| `npm run lint` | Run ESLint |
| `npm run test` | Run Vitest test suite |
| `npm run test:watch` | Run tests in watch mode |

## Design Tokens

CSS variables defined in `src/app/globals.css`:

- Primary: `#2563EB` (light) / `#3B82F6` (dark)
- Background: `#F9FAFB` (light) / `#0F172A` (dark)
- Text: `#111827` (light) / `#F8FAFC` (dark)
- Accent: `#14B8A6` (light) / `#2DD4BF` (dark)
- Border: `#E5E7EB` (light) / `#334155` (dark)
- Surface: `#FFFFFF` (light) / `#1E293B` (dark)

Fonts: **Space Grotesk** (headings), **Inter** (body), **Geist** (UI) via `next/font`.

## Future Improvements

- Cache repository context with file-watcher invalidation to reduce per-request latency.
- Allow the agent to request specific files on demand rather than loading everything upfront.
- Inject git diff or recent file changes to answer "what changed recently" questions.
- Track which files the user has asked about and surface related files proactively.
- Add confidence scoring so the model indicates when it is answering from partial context.
