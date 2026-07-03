# Finance Flow

**Take control of your money.**

A personal finance platform with real Supabase authentication, a shared live data layer across every page, CSV/Excel statement import, and computed AI-style insights — no external AI API required.

📄 Read the full [case study](./CASE_STUDY.md) for the design decisions, technical challenges, and what's next.

## Features

- **Landing page** — Stripe-style marketing site with dark mode and an 11-region currency switcher (Nigeria, US, UK, Kenya, Ghana, South Africa, Australia, Canada, Europe, Finland, Austria)
- **Real authentication** — Supabase email/password, password reset, protected routes
- **Onboarding** — personalizes the app to how "hands-on" a user wants to be (Simple / Planner / Power User), reshaping the Dashboard and navigation accordingly
- **Transactions** — full CRUD, search, sort, category and month filtering
- **Quick Add** — type `"Lunch 15"` and it parses category, amount, and kind automatically, with live budget feedback as you type
- **Import Statement** — drag-and-drop CSV or Excel bank statements, auto-categorized, with a review step before import
- **Budget** — user-set monthly limits per category, computed live from real transactions, not static mock data
- **Analytics & Dashboard** — real month-over-month trends, category breakdowns, and a computed insights panel (spending trend alerts, budget pacing projections, savings goal timelines, recurring charge detection)
- **Settings** — profile, appearance, region, notifications, and full data management (load sample data / clear everything)

## Tech Stack

React · Vite · Tailwind CSS v4 · React Router · Supabase (Auth) · Recharts · Papaparse · SheetJS · localStorage

## Getting Started

```bash
npm install
cp .env.example .env   # then fill in your Supabase project URL + anon key
npm run dev
```

See `.env.example` for where to find your Supabase credentials.

## Project Structure

```
src/
├── pages/          — one file per route
├── components/
│   ├── landing/    — marketing site components
│   ├── app/        — shared app shell (sidebar, topbar, modals)
│   ├── dashboard/  — chart cards, insights panel
│   ├── auth/       — login/signup branded panel
│   ├── onboarding/ — onboarding wizard steps
│   └── ui/         — base components (Button)
└── lib/            — context providers, data stores, and business logic
```

Every data store (`useTransactionsStore`, `useBudgetTargetsStore`, `useSavingsGoal`) follows the same pattern: `localStorage`-backed, scoped per user + region, with a hook interface designed so the storage backend can be swapped for a real database without touching any page component.
