# Finance Flow — Case Study

**A personal finance platform built to feel like a real fintech product, not a portfolio demo.**


---

## The Problem

Most budgeting apps ask you to trust them with too much, too soon — connect your bank, fill out a ten-field form for every coffee, stare at a dashboard clearly built for one kind of user. I wanted to build something that respected three different realities at once:

- Someone who just wants to glance at a number and know if they're okay this month.
- Someone who wants real budgets, categories, and a sense of control.
- Someone who wants the full picture — trends, projections, every stat.

And I wanted it to work for people managing money in Naira, Dollars, Pounds, Cedis, Shillings, Rand, or Euros — not a Nigeria-only tool with everyone else bolted on as an afterthought.

The goal: **a finance app that adapts to how involved you want to be, works the moment you sign up, and never shows you a number it can't back up.**

---

## Design Decisions

### Visual identity
Deep navy, white, soft gray, with emerald for income and soft red for expenses — a deliberately restrained palette, gold reserved for accents and calls to action rather than decoration. Manrope for display type, Inter for body copy, and — the detail I'm proudest of — **IBM Plex Mono with tabular numerals for every money figure on the site.** Financial data in a monospaced, ledger-style font is a small choice that does a lot of work toward making the product feel precise rather than decorative.

### The onboarding decision
Early on, a reviewer suggested adding a "Financial Personality" question — not just *how* someone wants to enter data (Quick Add, manual, import), but *how involved* they want to be. That became the core UX decision of the whole app: **Simple**, **Planner**, and **Power User** aren't just onboarding flavor text — they actually reshape the sidebar navigation and the Dashboard layout. A Simple user sees a balance and one plain-English sentence. A Power User sees five stat cards, two charts, and a full insights panel. Same data, same codebase, genuinely different product depending on who's using it.

### Closing the loop
The single decision that made this feel like a real app rather than five disconnected screens: **Transactions, Dashboard, Budget, and Quick Add all read from one shared data source.** There's no "Dashboard's copy of the numbers" and "Budget's copy of the numbers" — there's one array of transactions, and every page does live math over it. Set a ₦100,000 Food & Dining budget, log an expense through Quick Add, and watch the same number update on the Budget page and the Dashboard simultaneously, because it's the same number.

### Honesty as a design principle
New accounts start at **exactly zero** — no fake pre-populated demo data pretending to be yours. Insights only appear when there's real signal behind them (an actual month-over-month comparison, an actual goal you set) rather than always showing something. The trend chart shows real gaps as zero rather than a smoothed fake curve. This cost some "wow, it's already populated" polish on first login, but I'd rather the product tell the truth.

---

## Technology

- **React + Vite** for the frontend, **React Router** for navigation
- **Tailwind CSS v4** for styling — including its newer `@theme` token system for the design system and a custom `dark` variant for class-based dark mode
- **Supabase** for authentication (email/password, password reset, session management) — chosen specifically so the auth layer could be swapped in later without redesigning any UI
- **Recharts** for the trend, bar, and donut charts
- **Papaparse** and **SheetJS (xlsx)** for CSV and Excel statement import, sharing one column-detection and categorization pipeline regardless of file format
- **localStorage** as the data layer for everything else (transactions, budgets, goals, preferences) — deliberately architected behind hooks (`useTransactionsStore`, `useBudgetTargetsStore`) so the storage backend can be swapped for a real database without touching a single page component
- **No external AI API.** The "AI insights" panel — trend detection, budget pacing projections, savings-goal timelines, recurring-charge detection — is entirely computed from the user's real data in the browser. It reads like AI-generated insight without the cost, latency, or API key management of an LLM call, and every number in it is independently verifiable against the user's own transactions.

---

## Challenges I Ran Into

**Tailwind v4's dark mode isn't automatic.** Getting class-based dark mode working required understanding the new `@custom-variant` syntax rather than the old `darkMode: 'class'` config option — a small thing that cost real debugging time because most existing tutorials assume Tailwind v3.

**Native `<select>` elements ignore your dark theme.** The category dropdown in the transaction form looked fine closed, but opened to white-text-on-white in dark mode — because browsers render the options list using system colors, not your CSS, unless you explicitly style the `<option>` elements and set `color-scheme`. An easy bug to miss because it only shows up when you actually click the dropdown.

**"This month" isn't a given — it's a decision.** Once CSV import could bring in transactions spanning many months, every "this month" label needed to actually mean something. That meant building real month-scoping across the whole app, and deciding that a fresh account should default to whichever month has real activity, not blindly to today's calendar date — otherwise a demo account seeded with old data would load looking empty.

**Free email sending has real limits.** Supabase's built-in email service is meant for testing, not production — repeated signup and password-reset testing hit its rate limit within a normal afternoon of development, which is the kind of infrastructure lesson you only learn by actually building the auth flow rather than reading about it.

**Making "AI" honest.** The temptation with a feature like this is to always show *something* — but a fabricated insight is worse than no insight. The hardest part wasn't the math, it was deciding when an insight generator should simply stay silent because there isn't enough real signal yet.

---

## What I'd Improve Next

- **Deploy it** — right now this lives on localhost; a live Netlify link is the obvious next step.
- **Real bank connection.** The "Bank Connection" option in onboarding is intentionally a disabled "Coming Soon" card. Wiring up a real aggregator (Plaid, Mono, or Okra depending on region) is the natural evolution once there's a backend database to store synced data against.
- **A real Net Worth model.** Right now it's a simplified multiplier off the running balance — a genuine assets-minus-liabilities model (savings, investments, debts) is the honest next version.
- **Move storage from localStorage to Supabase Postgres.** The architecture was deliberately built to make this swap contained — but it hasn't happened yet, which means data doesn't currently follow a user across devices.
- **Hard access control**, not just hidden navigation, for every involvement-gated feature (partially done for Budget/Analytics; worth auditing everywhere).

---

## One Promise

If you give Finance Flow real numbers, it will never show you a number it made up to fill space. Every balance, every trend, every insight traces back to something you actually entered — and when there isn't enough data to say something true, it says nothing, rather than something plausible.
