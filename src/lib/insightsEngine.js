import { filterTransactionsByMonth, totalsFromTransactions } from './mockData'

function shiftYm(ym, delta) {
  const [y, m] = ym.split('-').map(Number)
  const d = new Date(y, m - 1 + delta, 1)
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
}

function categoryTotals(transactions) {
  const totals = {}
  transactions
    .filter((t) => t.kind === 'expense')
    .forEach((t) => {
      totals[t.category] = (totals[t.category] || 0) + t.amount
    })
  return totals
}

// Compares the selected month's category spending against the previous

function trendInsight(transactions, monthKey, region, formatMoney) {
  const prevKey = shiftYm(monthKey, -1)
  const current = categoryTotals(filterTransactionsByMonth(transactions, monthKey))
  const previous = categoryTotals(filterTransactionsByMonth(transactions, prevKey))

  let biggest = null
  for (const category of Object.keys(current)) {
    const prevAmount = previous[category]
    if (!prevAmount) continue // no baseline to compare against
    const change = ((current[category] - prevAmount) / prevAmount) * 100
    if (Math.abs(change) < 8) continue // not worth mentioning
    if (!biggest || Math.abs(change) > Math.abs(biggest.change)) {
      biggest = { category, change, current: current[category], prevAmount }
    }
  }
  if (!biggest) return null

  const up = biggest.change > 0
  return {
    id: 'trend',
    icon: up ? '📈' : '📉',
    label: 'Spotted a trend',
    text: `Your ${biggest.category} expenses ${up ? 'increased' : 'decreased'} by ${Math.round(Math.abs(biggest.change))}% this month compared to last.`,
    tone: up ? 'down' : 'up',
  }
}

// Projects whether the user is on pace to go over a budget category, based
// on how far through the month they are 
function pacingInsight(byCategory, monthKey, region, formatMoney) {
  const now = new Date()
  const currentYm = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`
  if (monthKey !== currentYm) return null

  const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate()
  const dayOfMonth = now.getDate()
  const fractionElapsed = dayOfMonth / daysInMonth
  if (fractionElapsed < 0.15) return null 
  let worst = null
  for (const b of byCategory) {
    if (b.total <= 0 || b.spent <= 0) continue
    const projected = b.spent / fractionElapsed
    if (projected <= b.total) continue
    const overBy = projected - b.total
    if (!worst || overBy > worst.overBy) worst = { ...b, projected, overBy }
  }
  if (!worst) return null

  return {
    id: 'pacing',
    icon: '🏃',
    label: 'On pace to overspend',
    text: `At your current pace, ${worst.category} will finish the month around ${formatMoney(Math.round(worst.projected), region)} — about ${formatMoney(Math.round(worst.overBy), region)} over budget.`,
    tone: 'down',
  }
}

// Projects time-to-goal from the average of the last 3 months' savings rate
// (income minus expenses).
function goalInsight(transactions, goal, region, formatMoney) {
  if (!goal || !goal.amount) return null

  const now = new Date()
  const months = [0, 1, 2].map((i) => {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
  })
  const savingsPerMonth = months
    .map((ym) => {
      const { income, expenses } = totalsFromTransactions(filterTransactionsByMonth(transactions, ym))
      return income - expenses
    })
    .filter((s) => s !== 0)

  if (savingsPerMonth.length === 0) return null
  const avgSavings = savingsPerMonth.reduce((s, v) => s + v, 0) / savingsPerMonth.length
  if (avgSavings <= 0) return null

  const monthsToGoal = Math.ceil(goal.amount / avgSavings)
  if (monthsToGoal > 240) return null 
  return {
    id: 'goal',
    icon: '💡',
    label: 'Goal projection',
    text: `Saving at your recent average of ${formatMoney(Math.round(avgSavings), region)}/month, you'll reach "${goal.name}" (${formatMoney(goal.amount, region)}) in about ${monthsToGoal} month${monthsToGoal === 1 ? '' : 's'}.`,
    tone: 'up',
  }
}

// Simple recurring-charge detector: same description + category + roughly
// the same amount, appearing in 2+ of the last 3 months.
function recurringInsight(transactions, monthKey, region, formatMoney) {
  const months = [0, 1, 2].map((i) => shiftYm(monthKey, -i))
  const seen = {}
  months.forEach((ym) => {
    filterTransactionsByMonth(transactions, ym)
      .filter((t) => t.kind === 'expense')
      .forEach((t) => {
        const key = `${t.category}::${t.description.toLowerCase().trim()}`
        if (!seen[key]) seen[key] = { count: 0, total: 0, description: t.description, category: t.category }
        seen[key].count += 1
        seen[key].total += t.amount
      })
  })
  const recurring = Object.values(seen).filter((s) => s.count >= 2)
  if (recurring.length === 0) return null

  const monthlyTotal = recurring.reduce((s, r) => s + r.total / r.count, 0)
  return {
    id: 'recurring',
    icon: '🔁',
    label: 'Recurring charges',
    text: `You have ${recurring.length} recurring charge${recurring.length === 1 ? '' : 's'} averaging ${formatMoney(Math.round(monthlyTotal), region)}/month combined.`,
    tone: 'neutral',
  }
}

function topCategoryInsight(filtered, region, formatMoney) {
  const totals = categoryTotals(filtered)
  const entries = Object.entries(totals)
  if (entries.length === 0) return null
  const [category, amount] = entries.sort((a, b) => b[1] - a[1])[0]
  const { expenses } = totalsFromTransactions(filtered)
  const pct = expenses > 0 ? Math.round((amount / expenses) * 100) : 0

  return {
    id: 'top-category',
    icon: '🏆',
    label: 'Biggest expense',
    text: `${category} was your biggest expense this month at ${formatMoney(amount, region)} (${pct}% of total spending).`,
    tone: 'neutral',
  }
}

// Generates a prioritized list of real, computed insights. No external AI
// call — every number here is derived directly from the user's own data.
export function generateInsights({ transactions, filtered, monthKey, byCategory, goal, region, formatMoney }) {
  const candidates = [
    pacingInsight(byCategory, monthKey, region, formatMoney),
    trendInsight(transactions, monthKey, region, formatMoney),
    goalInsight(transactions, goal, region, formatMoney),
    recurringInsight(transactions, monthKey, region, formatMoney),
    topCategoryInsight(filtered, region, formatMoney),
  ].filter(Boolean)

  return candidates
}
