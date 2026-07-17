# BUILD_LOG — Engineering Project Copilot (FL-07)

## Iteration 1

### Goal
Transform the existing generic AI chat copilot into a repository-aware Engineering Project Copilot. The agent must answer questions about the actual codebase using real file reads instead of hallucinating.

### Problem Encountered
The existing `/api/chat` route only passes a static `SYSTEM_PROMPT` to the LLM. There is no mechanism to inject project-specific context. Without reading real files, the model fabricates architecture details, folder structures, and technology choices.

### Solution
Created `src/lib/repoContext.ts` to read key repository files (`README.md`, `package.json`, `workflow.md`, `ARCHITECTURE.md`, `BUILD_LOG.md`) from the project root using `fs/promises`. The context is serialized into a structured markdown string and prepended to the system prompt in the API route.

### Tradeoff
Reading files on every request adds latency (~5-20ms depending on file size). For an MVP this is acceptable. Future work should cache the context and invalidate on file changes.

---

## Iteration 2

### Goal
Add repository-specific suggested prompts so users immediately see the copilot's new capability.

### Problem Encountered
The existing `ChatWindow.tsx` contained four generic coding prompts (Tailwind Dashboard, TypeScript Debounce, RSC vs Client Components, Optimize API Routes). These are not relevant to a repository-aware agent.

### Solution
Replaced the suggested prompts array with six repository-focused prompts:
1. Explain this repository
2. Explain project architecture
3. Explain folder structure
4. Generate README
5. Prepare me for an interview
6. Summarize technologies used

Updated the welcome header text to reflect the new "Engineering Project Copilot" identity.

### Tradeoff
Reduced variety of generic coding examples. This is intentional — the tool's value proposition is repository awareness, not general coding help.

---

## Iteration 3

### Goal
Make the AI explicitly commit to accuracy and avoid hallucination.

### Problem Encountered
LLMs tend to confidently fabricate details when asked about a project's architecture or folder structure, especially if the system prompt is generic.

### Solution
Rewrote `SYSTEM_PROMPT` in `src/lib/prompts.ts` to enforce a "Repository-First" behavior. The new prompt instructs the model to:
- Always reference actual files and configurations from the provided context
- Explicitly state when information is unavailable
- Never assume or fabricate repository details

### Tradeoff
The new prompt is more restrictive. If a user asks a general coding question unrelated to the repo, the model may push back. This is acceptable for the MVP scope.

---

## Iteration 4

### Goal
Update the existing `workflow.md` to reflect the structured-prompt lessons applied to this build.

### Problem Encountered
The existing `workflow.md` contained a reflection on vague vs structured prompts from a previous assignment round. It did not document the actual engineering decisions made during this copilot transformation.

### Solution
Appended a new section to `workflow.md` documenting:
- The decision to use filesystem reads over embeddings (no RAG, no vector DB)
- The choice to modify the existing API route rather than create a new one
- The rationale for replacing generic suggested prompts with repository-specific ones
- The tradeoff of per-request file reads vs caching

### Tradeoff
The file is now longer, but it serves as a genuine engineering artifact rather than a generic reflection.

---

## Future Work

1. **Context Caching**: Cache repository context with a TTL or file-watcher invalidation to reduce per-request latency.
2. **Granular File Selection**: Allow the agent to request specific files on demand rather than loading everything upfront.
3. **Diff Awareness**: Inject git diff or recent file changes to answer "what changed recently" questions.
4. **Multi-turn Context**: Track which files the user has asked about and surface related files proactively.
5. **Confidence Scoring**: Have the model indicate confidence levels when answering from partial context.
