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