# Finance Flow

**Take control of your money.**

A full stack personal finance platform built to feel like a real fintech product — real authentication, real bank statement import, an envelope budgeting model that reserves money the moment you set a budget, a computed insights engine that reads your spending like a financial advisor would without calling any external API, and a genuine Claude-powered assistant for deeper natural-language analysis and free-form Q&A about your real numbers.

**Live demo:** [inandoutfinanceflow.netlify.app](https://inandoutfinanceflow.netlify.app)
**Case study:** [CASE_STUDY.md](./CASE_STUDY.md) — design decisions, technical challenges, and what's next

---

## Table of Contents

 [Overview](#overview)
[Features](#features)
[Tech Stack](#tech-stack)
[Architecture Notes](#architecture-notes)
[Getting Started](#getting-started)
[Environment Variables](#environment-variables)
[Project Structure](#project-structure)
[Key Design Decisions](#key-design-decisions)
[Roadmap](#roadmap)

---

## Overview

Most budgeting apps ask for too much trust too soon — connect your bank immediately, fill out a ten-field form for every coffee, stare at a dashboard clearly built for one kind of user. Finance Flow was built around a different idea: **an app that adapts to how involved you want to be**, works the moment you sign up, and never shows a number it can't back up.

It supports 11 currencies/regions out of the box (Nigeria, US, UK, Kenya, Ghana, South Africa, Australia, Canada, Europe, Finland, Austria), and every account starts genuinely empty — no fake pre-populated demo data pretending to be yours.

---

## Features

### Landing & Onboarding
  Marketing landing page with dark mode and a live currency/region switcher
  Personalized onboarding wizard: pick a region, a "Financial Personality" ( Simple /  Planner /  Power User), and a preferred way to track money (Quick Add / Manual / Import / Bank Connection)
  The involvement level choice actually reshapes the app — Simple users see a lighter dashboard and nav; Power users see everything

### Authentication
  Real Supabase email/password auth — signup, login, logout
  Password reset flow (request link → email → set new password)
  Protected routes that redirect unauthenticated users
  Custom SMTP (via Resend) so auth emails aren't rate limited by Supabase's shared sender

### Money Tracking
  **Quick Add** — type `"Lunch 15"` or `"Salary 2500"` and it parses category, amount, and income/expense automatically, with a live preview before you submit
  **Manual transaction entry** — full CRUD (add/edit/delete), with search, category filter, and month filter
  **Import Statement** — drag and drop CSV or Excel (.xlsx/.xls) bank statements, auto categorized with a review step before committing
  **Custom budget categories** — not limited to a fixed list; name and budget your own categories

### The Envelope Budgeting Model
This is the core mechanic of the app:
  **Balance = Total Income − Total Budgeted.** Setting a category budget reserves that amount from your balance the moment you set it — not only once you've spent it.
  Each category shows **"Available to spend"**, which only drops as real expenses land against it.
  **If you never set a budget for a category**, its real spending deducts from Balance directly instead — so the app is honest whether you use budgets or not.
  Overspending a category flags it (and your overall Balance) red immediately.

### Dashboard & Analytics
  Month aware Dashboard, Budget, and Analytics pages — a month picker drives all three consistently
  Real (not fabricated) income vs expense trend charts, built from actual transaction history
  Category spending breakdown (donut chart)
  **Computed insights** — spending trend alerts, budget pacing projections, savings goal timelines, recurring charge detection — generated entirely from real transaction math, no API call, no cost, no latency

### AI Assistant
  A dedicated **"Ask Finn"** page that reads a compact, privacy-conscious summary of your real transactions/budgets (category totals, month-over-month %, budget vs. actual, recurring charges — never a raw transaction dump) and sends it to **Claude Sonnet 5** for a genuine natural-language read on your spending
  Proactive monthly summary ("you're spending 40% more on dining out this month than your average"), streamed token-by-token, with a one-click **Regenerate**
  Free-form Q&A — ask "where can I cut back?" or "am I on track for my goal?" and get an answer grounded strictly in your own data, never a fabricated number
  Runs through a server-side **Netlify Function** proxy so the Anthropic API key never reaches the browser, gated behind your Supabase session so the endpoint can't be called anonymously

### Settings
  Editable profile (name, email — with real Supabase update + email confirmation handling)
  Light/dark appearance
  Region/currency picker
  Notification preferences (persisted)
  Data management: load sample data for demoing, or clear everything and start fresh

 

## Tech Stack

| Layer | Technology | Role |
|---|---|---|
| Frontend | **React** + **Vite** | UI and build tooling |
| Routing | **React Router** | Client side navigation |
| Styling | **Tailwind CSS v4** | Design system, dark mode via custom variant |
| Auth | **Supabase** | Signup, login, password reset, sessions |
| Data layer | **localStorage** | Transactions, budgets, goals, preferences — behind custom hooks so it can later swap to a real database without touching page components |
| Async/server state | **TanStack Query** | Caching, streaming, and retry state for the AI Assistant's requests |
| AI | **Anthropic Claude API** (Claude Sonnet 5) via a **Netlify Function** | Genuine LLM-powered spending insights and Q&A, called server-side so the API key is never exposed to the browser |
| Charts | **Recharts** | Trend lines, bar charts, donut breakdowns |
| File parsing | **Papaparse** (CSV) + **SheetJS/xlsx** (Excel) | Bank statement import |
| Email | **Resend** (via Supabase custom SMTP) | Real auth emails without Supabase's shared rate limit |
| Testing | **Vitest** + **React Testing Library** | Unit tests on business logic, component tests on the UI |
| Hosting | **Netlify** + **GitHub** | Continuous deployment — every push to `main` auto deploys |

**Two insight systems, on purpose.** The Dashboard's insights panel is still pure computed math — no API call, no cost, no latency, and it works even if Claude is ever unreachable. The AI Assistant is a separate, additive layer for the kind of open-ended, natural-language reasoning that computed rules genuinely can't do (free-form Q&A, nuanced "where can I cut back" advice). Neither replaces the other.

 

## Architecture Notes

**Data stores are hooks, not a database client.** `useTransactionsStore`, `useBudgetTargetsStore`, `useSavingsGoal`, etc. all follow the same pattern: read/write to `localStorage`, scoped per user ID + region, exposed through a small hook API (`{ data, add, update, delete }`). Every page consumes them the same way regardless of what's actually persisting the data — which means swapping `localStorage` for Supabase Postgres later is a change contained entirely to these hooks, not a rewrite of the UI.

**One shared money model calculation.** `computeMoneyModel()` in `lib/budgetSummary.js` is the single source of truth for Balance, Expenses, and per category availability. Budget, Dashboard, and Quick Add all call the same function — they can never disagree with each other because there's only one implementation of the math.

**Region drives everything downstream.** Currency formatting, sample data seeding, and even bank name examples on the landing page all derive from one `RegionContext` — switching currency in the navbar propagates through the whole app instantly.

**The AI Assistant never sees your full transaction history.** `financialSnapshot.js` condenses a month's real data into a compact JSON summary — category totals, month-over-month percentages, budget vs. actual, recurring charges, top expenses — with pre-formatted, correctly-localized currency strings baked in. That snapshot, not a raw data dump, is what gets sent to Claude, which keeps the payload small, cheap in tokens, and privacy-conscious. `netlify/functions/spending-insights.mjs` verifies the caller's Supabase session before spending any API budget, then streams Claude's response straight back through a `ReadableStream` so answers appear token-by-token instead of after a long wait.

 

## Getting Started

```bash
git clone https://github.com/yourgirltech/FinanceFlow.git
cd FinanceFlow
npm install
cp .env.example .env
npm run dev
```

Running just `npm run dev` gives you the full app except the AI Assistant, since that page calls a Netlify Function that Vite alone doesn't serve. To test it locally:

```bash
npm i -g netlify-cli
netlify dev
```

`netlify dev` proxies both the Vite dev server and the function together, so `/api/spending-insights` resolves the same way it does in production.

Run the test suite with:

```bash
npm run test        # one-off run
npm run test:watch  # watch mode
```

## Environment Variables

| Variable | Where it's read | Notes |
|---|---|---|
| `VITE_SUPABASE_URL` / `VITE_SUPABASE_ANON_KEY` | Client (bundled by Vite) | Supabase project URL + public anon key — safe to expose in the browser |
| `ANTHROPIC_API_KEY` | Server only (`netlify/functions/spending-insights.mjs`) | **Deliberately not `VITE_`-prefixed**, so Vite never bundles it into client JS. Set as a real Netlify environment variable for the deployed site; `netlify dev` reads it from a local `.env` for testing |

## Project Structure

```
netlify/
└── functions/
    └── spending-insights.mjs   — server-side Claude proxy: verifies the Supabase
                                  session, streams a Claude Sonnet 5 response back

src/
├── pages/                  — one file per route
│   ├── Landing.jsx
│   ├── Login.jsx / Signup.jsx / ForgotPassword.jsx / ResetPassword.jsx
│   ├── Onboarding.jsx
│   ├── Dashboard.jsx
│   ├── QuickAdd.jsx
│   ├── Transactions.jsx
│   ├── ImportStatement.jsx
│   ├── Budget.jsx
│   ├── Analytics.jsx
│   ├── AIInsights.jsx        — "Ask Finn" AI Assistant page
│   └── Settings.jsx
├── components/
│   ├── landing/             — marketing site components (Navbar, Hero, Footer, etc.)
│   ├── app/                 — shared app shell (Sidebar, Topbar, Modal, TierGate, etc.)
│   ├── dashboard/            — chart cards, insights panel
│   ├── insights/             — SpendingAssistant: the AI summary card + chat UI
│   ├── quickadd/             — Quick Add input bar, feed, available to spend list
│   ├── onboarding/            — onboarding wizard steps
│   ├── auth/                 — branded auth panel shared by Login/Signup
│   └── ui/                   — base components (Button)
├── lib/                     — the actual brains: context providers, data stores, business logic
│   ├── AuthContext.jsx / ThemeContext.jsx / RegionContext.jsx
│   ├── useTransactionsStore.js / useBudgetTargetsStore.js / useSavingsGoal.js
│   ├── budgetSummary.js       — the shared money model calculation
│   ├── insightsEngine.js      — computed, rule-based insights (no API call)
│   ├── financialSnapshot.js   — condenses real data into a compact summary for Claude
│   ├── aiClient.js / useSpendingInsights.js — fetch + TanStack Query hooks for the AI Assistant
│   ├── quickAddParser.js      — natural language transaction parsing
│   ├── importStatement.js     — CSV/Excel parsing and categorization
│   └── mockData.js            — categories, seed data generators, month utilities
└── test/                    — Vitest + RTL setup (jest-dom matchers, cleanup)
```

 

## Key Design Decisions

  **New accounts start at zero.** No fake pre populated data — Dashboard, Budget, and Analytics genuinely read ₦0 until a user adds their own income/expenses. "Load sample data" in Settings exists for demoing, but isn't the default.
  **Insights only appear when there's real signal.** No fabricated observations — if there isn't enough transaction history to compare a trend, the panel says so honestly rather than showing a made up number.
  **Region driven, not Nigeria only with extras bolted on.** All 11 supported currencies get equal treatment in formatting, sample data, and copy.
  **Involvement tiers reshape the actual UI, not just onboarding copy.** Sidebar navigation and Dashboard density genuinely differ between Simple, Planner, and Power User accounts.
  **The AI Assistant is additive, not a replacement.** The free, computed insights panel keeps working exactly as before — the Claude-powered assistant is a separate page for the open-ended reasoning computed rules can't do, and it's held to the same honesty standard: its system prompt explicitly forbids inventing a number that isn't in the data snapshot it was given.

 
 

## License

This project is a personal portfolio piece. Feel free to explore the code for learning purposes.