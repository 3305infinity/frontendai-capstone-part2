# Berozgar — Frontend AI Capstone

A Frontend AI Engineering capstone project built with Next.js App Router, TypeScript, and Tailwind CSS.

## About

This repository demonstrates modern frontend development practices with AI-assisted engineering workflows. It includes placeholder portfolio routes, a validated settings form, and a server-rendered health check page.

## Tech Stack

| Category        | Technology        |
| ---------------- | ----------------- |
| Framework        | Next.js (App Router) |
| Language         | TypeScript        |
| Styling          | Tailwind CSS v4   |
| Forms            | React Hook Form   |
| Validation       | Zod               |
| Testing          | Vitest + Testing Library |
| Deployment       | Vercel            |

## Prerequisites

- **Node.js** 18 or later
- **npm** (or pnpm / yarn)

## Getting Started

```bash
git clone https://github.com/<your-username>/berozgar.git
cd berozgar
npm install
cp .env.example .env.local
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Available Scripts

| Command            | Description                          |
| ------------------ | ------------------------------------ |
| `npm run dev`      | Start the Next.js development server |
| `npm run build`    | Create a production build            |
| `npm run start`    | Run the production server locally    |
| `npm run lint`     | Run ESLint                           |
| `npm run test`     | Run Vitest test suite                |
| `npm run test:watch` | Run tests in watch mode            |

## Routes

| Route       | Description                              |
| ----------- | ---------------------------------------- |
| `/`         | Home page                                |
| `/about`    | About page                               |
| `/projects` | Projects showcase                        |
| `/contact`  | Contact placeholder                      |
| `/settings` | Account settings form                    |
| `/health`   | Server-rendered health check (DummyJSON) |
| `/playground` | FE-05 accessible components demo       |

## Project Structure

```
berozgar/
├── src/
│   ├── app/                 # Next.js App Router pages
│   ├── components/
│   │   ├── layout/          # Navbar, Footer
│   │   └── ui/              # Reusable UI primitives
│   ├── lib/                 # Schemas and utilities
│   └── components/          # Settings form, providers, and field primitives
├── .env.example             # Environment variable template
├── next.config.ts
├── vercel.json
└── vitest.config.ts
```

## Design Tokens

CSS variables are defined in `src/app/globals.css`:

- Primary: `#2563EB`
- Background: `#F9FAFB`
- Text: `#111827`
- Accent: `#14B8A6`

Fonts: **Space Grotesk** (headings) and **Inter** (body) via `next/font`.

## Deployment (Vercel)

1. Push the repository to GitHub.
2. Import the project in [Vercel](https://vercel.com).
3. Set environment variables from `.env.example` as needed.
4. Deploy — Vercel auto-detects Next.js via `vercel.json`.

## Development Guidelines

- Use Server Components by default.
- Add `"use client"` only when browser APIs or interactivity are required.
- Keep components small, modular, and composable.
- Validate forms with Zod and React Hook Form.

## Acknowledgments

Built as part of the FlyRank Frontend AI Engineering internship program.
