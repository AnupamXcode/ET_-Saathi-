# ET Saathi – Financial Intelligence Engine

## Overview

A production-ready AI-powered financial decision and scenario simulation engine. Premium deep-midnight blue UI with violet-to-cyan gradient accents and gold highlights. Features live market data (Yahoo Finance proxy, refreshes every 30s), AI-powered news analysis, what-if scenario simulation, Buy/Hold/Avoid decision engine, wealth simulation, and portfolio management — all powered by Gemini 2.5 Flash.

## Stack

- **Monorepo tool**: pnpm workspaces
- **Node.js version**: 24
- **Package manager**: pnpm
- **TypeScript version**: 5.9
- **API framework**: Express 5
- **Database**: PostgreSQL + Drizzle ORM
- **Validation**: Zod (`zod/v4`), `drizzle-zod`
- **API codegen**: Orval (from OpenAPI spec)
- **Build**: esbuild
- **AI**: Google Gemini 2.5 Flash (via Replit AI Integrations)
- **Auth**: JWT (bcryptjs + jsonwebtoken)
- **Frontend**: React + Vite + Tailwind CSS + Recharts + Framer Motion

## Structure

```text
artifacts-monorepo/
├── artifacts/
│   ├── api-server/         # Express API server
│   └── et-saathi/          # React frontend (at preview path /)
├── lib/
│   ├── api-spec/           # OpenAPI spec + Orval codegen config
│   ├── api-client-react/   # Generated React Query hooks
│   ├── api-zod/            # Generated Zod schemas
│   ├── db/                 # Drizzle ORM schema + DB connection
│   └── integrations-gemini-ai/ # Gemini AI integration
├── scripts/
├── pnpm-workspace.yaml
├── tsconfig.base.json
├── tsconfig.json
└── package.json
```

## Features

1. **Auth**: JWT signup/login, stored in localStorage
2. **News Intelligence**: AI extracts events, sectors, sentiment from news text
3. **Scenario Engine**: "What if Reliance falls 10%?" → ripple effects simulation
4. **Decision Engine**: Buy/Hold/Avoid with confidence scores and explanations
5. **Simulation Engine**: Project investment value over time vs savings
6. **Portfolio**: Manage holdings, risk level, goals; pie chart visualization
7. **History**: Timeline of all past analyses

## AI Agents (Backend)

- `newsAgent.ts` — Analyzes financial news text
- `scenarioAgent.ts` — Simulates what-if market scenarios
- `decisionAgent.ts` — Provides investment recommendations
- `simulationAgent.ts` — Projects future portfolio value
- `gemini.ts` — Shared Gemini client + JSON generation helper

## API Routes

- `POST /api/auth/signup` — Register
- `POST /api/auth/login` — Login (returns JWT)
- `GET /api/auth/me` — Current user
- `GET/PUT /api/profile` — User profile + portfolio
- `POST /api/analyze-news` — News analysis
- `POST /api/scenario` — Scenario simulation
- `POST /api/decision` — Investment decision
- `POST /api/simulate` — Investment simulation
- `GET /api/history` — Analysis history

## Database Schema

- `users` — email, passwordHash, name
- `profiles` — riskLevel, investmentGoal, portfolio (JSON), totalInvested
- `analysis_history` — type, query, result (JSON), userId

## Environment Variables

- `DATABASE_URL` — PostgreSQL connection string (auto-provisioned)
- `AI_INTEGRATIONS_GEMINI_BASE_URL` — Gemini proxy URL (auto-provisioned)
- `AI_INTEGRATIONS_GEMINI_API_KEY` — Gemini API key (auto-provisioned)
- `JWT_SECRET` — JWT signing secret (defaults to built-in value)
- `PORT` — Service port (auto-assigned)

## Theme

- Background: #0D0D0D (near-black)
- Accent: Muted gold/amber
- Text: Warm off-white/beige
- Cards: Glassmorphism with soft dark panels
