// All app pages (Dashboard, Transactions, Budget, Analytics) pull from this
// single mock dataset, scaled relative to the active region's sample income,
// so switching currency in the navbar keeps every page internally consistent.

export const CATEGORIES = [
  { name: 'Salary', color: 'var(--color-emerald)', kind: 'income' },
  { name: 'Freelance', color: 'var(--color-gold)', kind: 'income' },
  { name: 'Food & Dining', color: '#E5484D', kind: 'expense' },
  { name: 'Transport', color: '#C9A24B', kind: 'expense' },
  { name: 'Bills & Utilities', color: '#64748B', kind: 'expense' },
  { name: 'Shopping', color: '#8B5CF6', kind: 'expense' },
  { name: 'Entertainment', color: '#0FA968', kind: 'expense' },
  { name: 'Health', color: '#F59E0B', kind: 'expense' },
]

const TXN_TEMPLATES = [
  { day: 1, category: 'Salary', desc: 'Monthly payroll', kind: 'income', factor: 0.5 },
  { day: 3, category: 'Food & Dining', desc: 'Grocery run', kind: 'expense', factor: 0.032 },
  { day: 4, category: 'Transport', desc: 'Ride to work', kind: 'expense', factor: 0.006 },
  { day: 6, category: 'Bills & Utilities', desc: 'Electricity bill', kind: 'expense', factor: 0.018 },
  { day: 8, category: 'Entertainment', desc: 'Streaming subscription', kind: 'expense', factor: 0.004 },
  { day: 9, category: 'Freelance', desc: 'Design project payment', kind: 'income', factor: 0.14 },
  { day: 11, category: 'Food & Dining', desc: 'Dinner out', kind: 'expense', factor: 0.012 },
  { day: 13, category: 'Shopping', desc: 'New shoes', kind: 'expense', factor: 0.028 },
  { day: 15, category: 'Transport', desc: 'Fuel top-up', kind: 'expense', factor: 0.015 },
  { day: 17, category: 'Health', desc: 'Pharmacy', kind: 'expense', factor: 0.009 },
  { day: 19, category: 'Bills & Utilities', desc: 'Internet bill', kind: 'expense', factor: 0.011 },
  { day: 21, category: 'Food & Dining', desc: 'Weekend groceries', kind: 'expense', factor: 0.026 },
  { day: 23, category: 'Entertainment', desc: 'Cinema night', kind: 'expense', factor: 0.005 },
  { day: 25, category: 'Shopping', desc: 'Home essentials', kind: 'expense', factor: 0.017 },
  { day: 27, category: 'Transport', desc: 'Ride to airport', kind: 'expense', factor: 0.02 },
  { day: 28, category: 'Food & Dining', desc: 'Coffee & lunch', kind: 'expense', factor: 0.007 },
]

export function categoryColor(name) {
  return CATEGORIES.find((c) => c.name === name)?.color ?? 'var(--color-slate)'
}

export function categoryKind(name) {
  return CATEGORIES.find((c) => c.name === name)?.kind ?? 'expense'
}

// Shared by Quick Add and Import Statement — maps a loose keyword found in a
// description to one of our real categories. First match wins.
const KEYWORD_MAP = {
  food: 'Food & Dining', lunch: 'Food & Dining', dinner: 'Food & Dining', breakfast: 'Food & Dining',
  groceries: 'Food & Dining', grocery: 'Food & Dining', restaurant: 'Food & Dining', coffee: 'Food & Dining',
  salary: 'Salary', payroll: 'Salary', wage: 'Salary', wages: 'Salary',
  freelance: 'Freelance', gig: 'Freelance', invoice: 'Freelance', client: 'Freelance',
  fuel: 'Transport', gas: 'Transport', bolt: 'Transport', uber: 'Transport', taxi: 'Transport',
  transport: 'Transport', ride: 'Transport', bus: 'Transport', flight: 'Transport',
  netflix: 'Entertainment', spotify: 'Entertainment', movie: 'Entertainment', cinema: 'Entertainment',
  entertainment: 'Entertainment', games: 'Entertainment', concert: 'Entertainment',
  rent: 'Bills & Utilities', electricity: 'Bills & Utilities', bill: 'Bills & Utilities', bills: 'Bills & Utilities',
  internet: 'Bills & Utilities', utility: 'Bills & Utilities', utilities: 'Bills & Utilities', water: 'Bills & Utilities',
  shopping: 'Shopping', clothes: 'Shopping', shoes: 'Shopping', amazon: 'Shopping', mall: 'Shopping',
  health: 'Health', pharmacy: 'Health', doctor: 'Health', medicine: 'Health', hospital: 'Health', clinic: 'Health',
}

// Guess a category from free text. Checks whole-word matches against the
// keyword map first, falls back to a sensible default based on kind.
export function guessCategory(text, fallbackKind = 'expense') {
  const words = text.toLowerCase().match(/[a-z]+/g) || []
  for (const word of words) {
    if (KEYWORD_MAP[word]) return KEYWORD_MAP[word]
  }
  return fallbackKind === 'income' ? 'Salary' : 'Shopping'
}

export function buildTransactions(region, monthLabel = 'Jun 2026') {
  const [monthName, year] = monthLabel.split(' ')
  const base = region.sample.income
  return TXN_TEMPLATES.map((t, i) => ({
    id: `${monthLabel}-${i}`,
    date: `${monthName} ${String(t.day).padStart(2, '0')}`,
    fullDate: `${year}-${String(new Date(`${monthName} 1, ${year}`).getMonth() + 1).padStart(2, '0')}-${String(t.day).padStart(2, '0')}`,
    category: t.category,
    description: t.desc,
    kind: t.kind,
    color: categoryColor(t.category),
    amount: Math.round(base * t.factor),
  })).sort((a, b) => (a.fullDate < b.fullDate ? 1 : -1))
}

// Budget targets only — "spent" is now computed live from the actual
// transactions store, so editing/adding/deleting a transaction on the
// Transactions page immediately moves the Budget page's progress bars too.
export function buildBudgetTargets(region) {
  const base = region.sample.income
  const plan = [
    { category: 'Food & Dining', factor: 0.12 },
    { category: 'Transport', factor: 0.06 },
    { category: 'Bills & Utilities', factor: 0.08 },
    { category: 'Shopping', factor: 0.07 },
    { category: 'Entertainment', factor: 0.03 },
    { category: 'Health', factor: 0.025 },
  ]
  return plan.map((p) => ({
    category: p.category,
    color: categoryColor(p.category),
    total: Math.round(base * p.factor),
  }))
}

// Real income-vs-expenses history, built from actual transactions (including
// anything brought in via CSV import) rather than fabricated variance curves.
// Pads backward to `monthsCount` consecutive months ending at whichever month
// has the most recent activity, so months with no data honestly show zero
// instead of a fake number.
export function realMonthlyTrend(transactions, monthsCount = 6) {
  const grouped = {}
  transactions.forEach((t) => {
    const key = t.fullDate.slice(0, 7)
    if (!grouped[key]) grouped[key] = { income: 0, expenses: 0 }
    if (t.kind === 'income') grouped[key].income += t.amount
    else grouped[key].expenses += t.amount
  })

  const latestKey =
    transactions.length === 0
      ? (() => {
          const d = new Date()
          return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
        })()
      : transactions.reduce((max, t) => (t.fullDate.slice(0, 7) > max ? t.fullDate.slice(0, 7) : max), transactions[0].fullDate.slice(0, 7))

  const result = []
  for (let i = monthsCount - 1; i >= 0; i--) {
    const [y, m] = latestKey.split('-').map(Number)
    const d = new Date(y, m - 1 - i, 1)
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
    const g = grouped[key] || { income: 0, expenses: 0 }
    result.push({
      month: d.toLocaleDateString('en-US', { month: 'short' }),
      income: g.income,
      expenses: g.expenses,
    })
  }
  return result
}

// Live derivations — operate on whatever transaction list is passed in
// (i.e. the localStorage-backed store), not a freshly generated mock set.
export function categoryBreakdownFromTransactions(transactions) {
  const totals = {}
  transactions
    .filter((t) => t.kind === 'expense')
    .forEach((t) => {
      totals[t.category] = (totals[t.category] || 0) + t.amount
    })
  return Object.entries(totals)
    .map(([category, value]) => ({ category, value, color: categoryColor(category) }))
    .sort((a, b) => b.value - a.value)
}


// Month-scoping helpers — used so "this month" labels actually mean what
// they say, even after importing a CSV spanning many months of history.
export function getAvailableMonths(transactions) {
  const set = new Set(transactions.map((t) => t.fullDate.slice(0, 7)))
  return Array.from(set).sort().reverse() // 'YYYY-MM', most recent first
}

export function monthLabelFromYm(ym) {
  const [y, m] = ym.split('-').map(Number)
  return new Date(y, m - 1, 1).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
}

export function filterTransactionsByMonth(transactions, ym) {
  return transactions.filter((t) => t.fullDate.slice(0, 7) === ym)
}

// Today's real calendar month, as a 'YYYY-MM' key — used where "current"
// genuinely means right now (e.g. Quick Add's live available-to-spend view),
// as distinct from "whichever month has the most recent activity" that
// Dashboard/Budget/Analytics default to.
export function currentRealMonthYm() {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
}

export function totalsFromTransactions(transactions) {
  const income = transactions.filter((t) => t.kind === 'income').reduce((s, t) => s + t.amount, 0)
  const expenses = transactions.filter((t) => t.kind === 'expense').reduce((s, t) => s + t.amount, 0)
  return { income, expenses }
}
