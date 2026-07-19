# Finance Flow — Case Study

**A personal finance platform built to feel like a real fintech product, not a portfolio demo.**

Live: [inandoutfinanceflow.netlify.app](https://inandoutfinanceflow.netlify.app)
 Repo: [github.com/yourgirltech/FinanceFlow](https://github.com/yourgirltech/FinanceFlow)

---

## The Problem

Most budgeting apps ask you to trust them with too much, too soon — connect your bank on day one, fill out a ten-field form for every coffee, stare at a dashboard clearly built for one kind of user. I wanted to build something that respected three different realities at once:

 Someone who just wants to glance at a number and know if they're okay this month.
 Someone who wants real budgets, categories, and a sense of control.
 Someone who wants the full picture — trends, projections, every stat.

And I wanted it to work for people managing money in Naira, Dollars, Pounds, Cedis, Shillings, Rand, or Euros — not a Nigeriaonly tool with everyone else bolted on as an afterthought.

The goal: **a finance app that adapts to how involved you want to be, tells the truth about your money even when that's inconvenient, and never shows you a number it can't back up.**



## Design Decisions

### Visual identity
Deep navy, white, soft gray, with emerald for income and soft red for expenses — a restrained palette, gold reserved for accents and calls to action rather than decoration. Manrope for display type, Inter for body copy, and IBM Plex Mono with tabular numerals for every money figure on the site — a small choice that does a lot of work toward making the product feel precise rather than decorative.

### Personalized onboarding, not a settings form
Early on, I added a "Financial Personality" question to onboarding — not just *how* someone wants to enter data (Quick Add, manual entry, import), but *how involved* they want to be: **Simple**, **Planner**, or **Power User**. That choice isn't cosmetic — it actually reshapes the sidebar navigation and the Dashboard layout. A Simple user sees a balance and one plainEnglish sentence about their month. A Power User sees five stat cards, two charts, and a full insights panel. Same codebase, genuinely different product depending on who's using it.

### The envelopebudgeting model
The core money mechanic went through real iteration based on how I actually wanted to use the app myself. The final model: **Balance = Total Income − Total Budgeted.** Setting a ₦100,000 limit on Food & Dining reserves that money from your balance the instant you set it — not only once you've actually spent it. Each category shows an "Available to spend" figure that only drops as real expenses land against it, and overspending flags the category (and your overall Balance) red immediately.

The trickier design decision was the fallback case: **what happens if someone never opens the Budget page at all, and just logs income and expenses?** The model had to stay honest in that case too — so any category with no budget set simply deducts its real spending from Balance directly, no envelope, no earmarking. The two behaviors coexist percategory, which means a user can budget some things and not others, and the math still holds together correctly either way.

### Closing the loop
Transactions, Dashboard, Budget, and Quick Add all read from **one shared calculation** (`computeMoneyModel()`), not four separate copies of similar logic. Set a budget, log an expense through Quick Add, and watch the same number update on the Budget page and the Dashboard simultaneously — because it's the same number, computed once.

### Honesty as a design principle
New accounts start at **exactly zero** — no fake prepopulated demo data pretending to be yours. The AI insights panel only shows an observation when there's real signal behind it (an actual monthovermonth comparison, an actual savings goal you set); otherwise it says so plainly rather than showing something plausiblebutinvented. The 6month trend chart shows real gaps as zero rather than a smoothed fake curve. This cost some "wow, it's already populated" polish on first login, but I'd rather the product tell the truth.



## Technology

 **React + Vite** for the frontend, **React Router** for navigation
 **Tailwind CSS v4** for styling, including its `@theme` token system for the design system and a custom `dark` variant for classbased dark mode
 **Supabase** for real authentication — signup, login, password reset, session management — wired through custom SMTP (Resend) once Supabase's own shared email sender proved too ratelimited for real testing
 **Recharts** for the trend, bar, and donut charts
 **Papaparse** and **SheetJS (xlsx)** for CSV and Excel statement import, sharing one columndetection and categorization pipeline regardless of file format
 **localStorage** as the data layer for everything else — deliberately architected behind hooks (`useTransactionsStore`, `useBudgetTargetsStore`, `useSavingsGoal`) so the storage backend can be swapped for a real database later without touching a single page component
 **No external AI API.** The insights panel — trend detection, budget pacing projections, savingsgoal timelines, recurringcharge detection — is entirely computed from the user's real data in the browser. It reads like AIgenerated insight without the cost, latency, or key management of an LLM call, and every number in it is independently verifiable against the user's own transactions.
 **Netlify + GitHub** for hosting, with continuous deployment on every push to `main`



## Challenges I Ran Into

**Tailwind v4's dark mode isn't automatic.** Getting classbased dark mode working required the newer `@customvariant` syntax rather than the old `darkMode: 'class'` config option — a small thing that cost real debugging time because most existing tutorials assume Tailwind v3.

**Native `<select>` elements ignore your dark theme.** The category dropdown looked fine closed, but opened to whitetextonwhite in dark mode, because browsers render the options list using system colors unless you explicitly style the `<option>` elements and set `colorscheme` — an easy bug to miss because it only shows up when you actually open the dropdown.

**"This month" isn't a given — it's a decision.** Once CSV import could bring in transactions spanning many months, every "this month" label needed to actually mean something. That meant building real monthscoping across the app, and choosing to default to whichever month has real activity rather than blindly trusting today's calendar date — otherwise a freshlyimported account with older data would load looking empty.

**Free email sending has real limits.** Supabase's builtin email service is meant for testing, not production — repeated signup and passwordreset testing hit its rate limit within a normal afternoon. Fixing it properly meant wiring up custom SMTP through Resend, which came with its own lesson: Resend's free sandbox address can only send to the email you signed up with, until you verify an owned domain — a real constraint I had to design around for a portfolio project with no domain budget yet, by disabling mandatory email confirmation for demo purposes instead.

**A silent deployment mismatch.** After pushing what I thought was updated code, the live site didn't change — no error, just nothing happening. The cause: my local repository's default branch was `master`, while Netlify was configured to build from `main`. Git happily pushed to a branch nobody was watching. Diagnosing it meant checking Netlify's actual build configuration rather than assuming the problem was in my code at all — a good reminder that "it's not deploying" and "it's not working" are different bugs with different places to look.

**Making "AI" honest.** The temptation with a feature like this is to always show *something*. The hardest part wasn't the math — it was deciding when an insight generator should simply stay silent because there isn't enough real signal yet, rather than manufacture a plausiblesounding observation to fill the space.

**Designing for a fallback, not just the happy path.** The envelopebudgeting model looked complete until I asked: what about someone who never sets a budget at all? Rather than bolt on a special case, the cleaner fix was a percategory rule that made both behaviors — budgeted and unbudgeted — fall out of the same formula naturally.



## What I'd Improve Next

 **Real bank connection.** The "Bank Connection" option in onboarding is intentionally a disabled "Coming Soon" card. Wiring up a real aggregator (Plaid, Mono, or Okra depending on region) is the natural next step once there's a real database to sync against.
 **A genuine Net Worth model.** Right now it's a simplified multiplier off Balance — an honest assetsminusliabilities model (savings, investments, debts) is the real next version.
 **Hard access control everywhere.** Involvement tier gating is enforced for Budget and Analytics specifically; worth auditing the rest of the app the same way.
 **Buy a domain and verify it with Resend**, so real signup emails work for any user, not just accounts tied to my own sending address.



## One Promise

If you give Finance Flow real numbers, it will never show you a number it made up to fill space. Every balance, every trend, every insight traces back to something you actually entered — and when there isn't enough data to say something true, it says nothing, rather than something plausible.