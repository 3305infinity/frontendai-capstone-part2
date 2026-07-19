# Work Till Now

## Project Overview & Current State
A Next.js (React) web application built with TypeScript, featuring a modern UI, real‑time chat, project management, settings, and AI integration. Core functionality is implemented, including navigation, component library, chat interface, and basic state management.

## Core Architecture
- **Tech Stack**: Next.js, React, TypeScript, CSS‑in‑JS (or Tailwind), JavaScript/JSON data handling.
- **Directory Structure**:  
  - `src/components/` – UI primitives (Navbar, Footer, Button, Section, Dialog, Toast, Tabs), layout components (PageHeader, Container), chat components (ChatWindow, ChatMessage, ChatInput, etc.), settings components (SettingsForm, SettingsPage).  
  - `src/app/` – file‑based routing: pages such as `projects`, `settings`, and dynamic routes.  
  - `src/lib/` – utility modules, AI integration (`ai.ts`), type definitions.  
  - `src/types/` – shared TypeScript interfaces and schemas.  
- **Component Interaction**: UI components receive data via props; global state is handled through React Context providers defined in `src/components/Providers.tsx` and `ThemeProvider.tsx`. Routing is managed by Next.js pages under `src/app`.

## Feature Roadmap & Completed Modules
- **Chat Module** – `src/components/chat/*` (ChatWindow, ChatMessage, ChatInput, ThinkingIndicator, StopButton).  
- **Project Management** – `src/components/ui/ProjectCard.tsx`, `src/app/projects/page.tsx`.  
- **Settings Module** – `src/components/SettingsForm.tsx`, `src/app/settings/page.tsx`.  
- **UI Component Library** – Navbar, Footer, PageHeader, Container, Button, Section, Dialog, Toast, Tabs, FormField.  
- **AI Integration** – `src/lib/ai.ts`.  
- **Context & Theme** – `src/components/Providers.tsx`, `src/components/ThemeProvider.tsx`.

## Data Flow & State Management
Data flows from UI components through props to container components; global state is synchronized via React Context providers. Critical data models are defined in TypeScript files under `src/types/` (e.g., chat message interfaces, project schemas) and in `src/lib/ai.ts` for AI‑related payloads.

## Integration Guide for AI Agents
- **Chat Logic**: `src/components/chat/` (ChatWindow, ChatMessage, ChatInput).  
- **Routing & Page Structure**: `src/app/` (e.g., `projects/page.tsx`, `settings/page.tsx`).  
- **AI Interaction**: `src/lib/ai.ts`.  
- **UI Components**: `src/components/ui/` (Navbar, Button, Section, etc.).  
- **Settings**: `src/components/SettingsForm.tsx` and `src/app/settings/page.tsx`.  
- **Context Providers**: `src/components/Providers.tsx`, `src/components/ThemeProvider.tsx`.  
Refer to these directories to understand specific logic and avoid full‑codebase scans.

## Key Entry Points
- `src/app/projects/page.tsx` – Project overview page.  
- `src/components/chat/ChatWindow.tsx` – Main chat UI entry.  
- `src/components/ui/Navbar.tsx` – Navigation entry point.  
- `src/lib/ai.ts` – AI integration logic.  
- `src/app/settings/page.tsx` – Settings page entry.  
- `src/components/Providers.tsx` – Context providers initialization.


