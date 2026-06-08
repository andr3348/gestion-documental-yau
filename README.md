# Gestión Documental Yau

An automated document management system for a Peruvian municipality. Citizens submit PDF requests, which are **automatically classified to the correct municipal department** using an LLM (Gemma 4 31B via OpenRouter). Secretaries review, resolve, or reject requests, and citizens receive **real-time email notifications**.

Built as a monorepo with Turborepo (pnpm).

## Architecture

```
apps/
├── api/   — NestJS 11 backend (Clean Architecture / DDD)
│            Modules: Auth, User, Tramite, Department, Notification
│            Layers: domain/ → application/ → infrastructure/ → presentation/
└── web/   — Next.js 16 frontend (FSD Lite)
             Features: auth, tramite, secretary, departments

packages/
└── database/ — Prisma schema + generated client
```

**Key dependencies:**
- OpenRouter API (Gemma 4 31B) for document classification
- Resend API for email notifications
- PostgreSQL + Prisma ORM
- JWT auth with httpOnly cookies
- Tailwind CSS v4 + shadcn/ui (base-nova)

## Prerequisites

- **Node.js** >= 22
- **pnpm** >= 10 (`corepack enable && corepack prepare pnpm@latest --activate`)
- **PostgreSQL** 16 running locally
- **OpenRouter** API key (free tier works)
- **Resend** API key (free tier: ~100 emails/day)

## Setup

### 1. Clone and install

```sh
git clone <repo-url>
cd gestion-documental-yau
pnpm install
```

### 2. Configure environment

```sh
cp apps/api/.env.example apps/api/.env
cp apps/web/.env.example apps/web/.env
```

Edit `apps/api/.env`:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/gesdocyau"
JWT_SECRET="your-secret-key"
OPENROUTER_API_KEY="sk-or-v1-..."
RESEND_API_KEY="re_..."
RESEND_FROM_EMAIL="onboarding@resend.dev"
FRONTEND_URL="http://localhost:3000"
PORT=3001
```

### 3. Create database

```sh
createdb gesdocyau
pnpm --filter @yau/database db:deploy
```

### 4. Seed departments

```sh
pnpm --filter @yau/api seed
```

### 5. Start dev servers

```sh
pnpm dev
```

- API: `http://localhost:3001/api`
- Web: `http://localhost:3000`

## Usage

1. **Register** as CITIZEN or SECRETARY
2. **Citizen** — upload a PDF request from the dashboard
3. **AI** automatically classifies it to the correct department
4. **Secretary** — review, update status, add comments
5. **Citizen** receives an email when the request is resolved or rejected

## Project info

- Course: Taller de Desarrollo de Aplicaciones con Machine Learning — SENATI
- Student: Diego Valencia
