# AI Workflow Drill – Reflection

## Round 1 – Vague Prompt

For the first implementation, I intentionally used a very simple prompt: **"Create a settings form in React."** I provided no project context, libraries, validation requirements, accessibility expectations, or file structure.

The generated application was functional but very basic. It relied on local React state (`useState`) for form management and did not include proper validation, automated tests, or persistent storage. Although the UI looked acceptable, several production-quality aspects were missing. There was no schema validation, no disabled submit state, and no automated verification. I also had to manually review almost every part of the generated code to ensure it behaved correctly.

## Round 2 – Structured Prompt

For the second implementation, I used a detailed prompt describing the required technologies, project structure, validation rules, accessibility requirements, expected behavior, and a verification step. The prompt explicitly requested React Hook Form, Zod validation, reusable components, accessibility improvements, unit tests, and final verification.

The quality of the generated code improved significantly. The form used React Hook Form with Zod for validation, disabled submission until the form became valid, displayed inline validation errors, persisted non-sensitive settings using local storage, showed success toast notifications, and included accessibility attributes. The AI also generated unit tests and accessibility tests, reducing the amount of manual verification required.

## Biggest AI Mistake

Even during the structured workflow, I still reviewed every generated file manually. I verified validation logic, accessibility behavior, and test coverage instead of assuming the generated output was correct. This reinforced that AI-generated code should always be treated as a draft that requires developer review before production use.

## Workflow Comparison

Although the structured prompt took longer to write (around 10 minutes), it reduced the review and debugging effort considerably. The vague prompt was faster to generate (around 2 minutes) but required much more manual inspection and corrections. Overall, the structured workflow produced cleaner, more maintainable, and production-ready code with significantly less total effort, making it the more efficient approach for real-world development.

## Round 3 – Repository-Aware Copilot (FL-07)

For this implementation, I applied the structured-prompt discipline to a system-level change: converting a generic AI chat copilot into a repository-aware Engineering Project Copilot.

### Structured Prompt Applied

The implementation prompt specified:
- One complete end-to-end workflow (repository Q&A)
- One real tool connection (filesystem reads)
- Build log, demo script, and working MVP
- Specific agent behaviors (read files first, never hallucinate)
- Exact suggested prompts to add
- Clear do-not-implement list (no auth, no DB, no RAG, no GitHub integration)

### Key Engineering Decisions

| Decision | Reasoning |
|----------|-----------|
| Filesystem reads over embeddings/RAG | Simpler, deterministic, zero infrastructure. Adequate for a single-repo MVP. |
| Per-request file reads | Avoids cache invalidation complexity. ~5-20ms overhead is acceptable for an interactive chat tool. |
| Modified existing `/api/chat` route | Minimal diff, preserves streaming and mock-mode behavior, no new endpoints needed. |
| Reused existing chat UI | No need to rebuild sidebar, markdown renderer, or streaming logic. Changed only suggested prompts and welcome text. |
| Repository context as system prompt | Cleanest injection point; model sees context before any user message. |

### Outcome

The structured prompt produced a focused, minimal change set:
- 1 new file (`src/lib/repoContext.ts`)
- 3 modified files (`route.ts`, `prompts.ts`, `ChatWindow.tsx`)
- 3 new artifacts (`BUILD_LOG.md`, `DEMO_SCRIPT.md`, updated `README.md`)
- 1 updated reflection (`workflow.md`)

No unnecessary features were added. The result is an interview-defensible engineering productivity tool that solves a real problem: developers wasting time context-switching to understand unfamiliar or forgotten codebases.