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

export function buildMonthlyTrend(region) {
  const base = region.sample
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun']
  const incomeVariance = [0.9, 0.95, 1.0, 0.92, 1.05, 1.0]
  const expenseVariance = [0.82, 0.88, 0.95, 1.02, 0.9, 1.0]
  return months.map((m, i) => ({
    month: m,
    income: Math.round(base.income * incomeVariance[i]),
    expenses: Math.round(base.expenses * expenseVariance[i]),
  }))
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

export function totalsFromTransactions(transactions) {
  const income = transactions.filter((t) => t.kind === 'income').reduce((s, t) => s + t.amount, 0)
  const expenses = transactions.filter((t) => t.kind === 'expense').reduce((s, t) => s + t.amount, 0)
  return { income, expenses }
}
