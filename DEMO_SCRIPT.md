# DEMO_SCRIPT — Engineering Project Copilot

**Duration**: ~2 minutes  
**Scenario**: A developer opens the Engineering Project Copilot and uses it to understand the current repository.

---

## Scene 1: Open the application (0:00 - 0:15)

[Screen shows the Berozgar application at `http://localhost:3000`]

**Narration**:  
"This is Berozgar, an engineering productivity tool. I'm going to open the Engineering Project Copilot and ask it to analyze this very repository."

[Click the Copilot link in the navbar or navigate to `/copilot`]

---

## Scene 2: Explain this repository (0:15 - 0:45)

[The Copilot workspace loads. The welcome state shows the Engineering Project Copilot heading and six repository-aware suggested prompts.]

**Narration**:  
"Notice the suggested prompts — they're all repository-specific. Let me ask it to explain this repository."

[Click "Explain this repository" or type the prompt and send]

**Expected Response**:  
The agent reads `README.md` and `package.json` from the project root and produces a structured overview covering:
- Project name and purpose
- Key technologies from `package.json`
- Current state and architecture
- Any other details found in the repository files

**Narration**:  
"The agent reads the actual `README.md` and `package.json` files from disk. It's not hallucinating — this is grounded in the real repository."

---

## Scene 3: Generate a README (0:45 - 1:15)

[Send: "Generate a README"]

**Expected Response**:  
The agent reads all available context files (`README.md`, `package.json`, `workflow.md`, etc.) and synthesizes a professional README with sections like Project Overview, Architecture, Features, Tech Stack, Installation, Usage, and Folder Structure.

**Narration**:  
"I asked it to generate a README. It pulled the actual package.json dependencies, the existing folder structure, and the project's own documentation to produce this. This is a real tool connection — not a generic LLM response."

---

## Scene 4: Prepare for interview (1:15 - 1:45)

[Send: "Prepare me for explaining this project in an interview"]

**Expected Response**:  
The agent produces a structured interview brief with:
- Elevator pitch
- Architecture overview
- Key design decisions and tradeoffs
- Tech stack breakdown
- Challenges faced and how they were solved

**Narration**:  
"For my final request, I asked it to prepare me for a software engineering interview about this project. The agent synthesized the architecture, design decisions, and tradeoffs into talking points I can actually use."

---

## Scene 5: Closing (1:45 - 2:00)

[Show the final response]

**Narration**:  
"This is an Engineering Project Copilot — not a chatbot. It reads real files, answers repository-specific questions, and never fabricates details. If information is missing, it tells you. That's the MVP."

---

## Key Points to Highlight

1. **Real Tool Connection**: The agent reads actual files from the project filesystem (`README.md`, `package.json`, etc.).
2. **No Hallucination**: The system prompt explicitly forbids fabricating repository details.
3. **Minimal Changes**: We reused the existing chat infrastructure, streaming, and UI. Only the backend context injection and suggested prompts were changed.
4. **Interview Defensible**: Every decision has a clear rationale — filesystem reads instead of RAG, per-request context for simplicity, existing UI reuse for consistency.
