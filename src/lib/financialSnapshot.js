import { filterTransactionsByMonth, totalsFromTransactions, monthLabelFromYm } from './mockData'
import { formatMoney } from './format'
import { shiftYm } from './insightsEngine'

function categoryTotals(transactions) {
  const totals = {}
  transactions
    .filter((t) => t.kind === 'expense')
    .forEach((t) => {
      totals[t.category] = (totals[t.category] || 0) + t.amount
    })
  return totals
}

// Cheap non-cryptographic hash — just needs to change when the underlying
// numbers change, so TanStack Query can key on "did the data actually move"
// rather than refetching the AI summary on every render.
function hashString(str) {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    hash = (hash * 31 + str.charCodeAt(i)) | 0
  }
  return hash.toString(36)
}

// Recurring-charge detector: same description + category appearing in 2+ of
// the last 3 months. Mirrors the heuristic in insightsEngine.js's
// recurringInsight, but returns structured data for the AI snapshot instead
// of a rendered sentence.
function detectRecurring(transactions, monthKey) {
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
  return Object.values(seen)
    .filter((s) => s.count >= 2)
    .map((s) => ({
      description: s.description,
      category: s.category,
      monthsSeen: s.count,
      averageAmount: Math.round(s.total / s.count),
    }))
    .sort((a, b) => b.averageAmount - a.averageAmount)
}

// Builds a compact, privacy-conscious summary of one month's finances for
// the AI assistant: numeric aggregates and pre-formatted currency strings,
// never the user's full raw transaction history. Keeps the payload small
// and cheap in tokens, and gives Claude correctly localized money strings
// instead of asking it to reformat raw numbers itself.
export function buildFinancialSnapshot({ transactions, targets, goal, region, monthKey }) {
  const monthLabel = monthLabelFromYm(monthKey)
  const money = (n) => formatMoney(n, region)

  const current = filterTransactionsByMonth(transactions, monthKey)
  const previousKey = shiftYm(monthKey, -1)
  const previous = filterTransactionsByMonth(transactions, previousKey)

  const currentTotals = totalsFromTransactions(current)
  const previousTotals = totalsFromTransactions(previous)

  const currentCategoryTotals = categoryTotals(current)
  const previousCategoryTotals = categoryTotals(previous)

  // 3-month rolling average per category, excluding the current month
  const priorMonths = [1, 2, 3].map((i) => shiftYm(monthKey, -i))
  const priorTotalsPerMonth = priorMonths.map((ym) => categoryTotals(filterTransactionsByMonth(transactions, ym)))
  const allCategories = new Set([
    ...Object.keys(currentCategoryTotals),
    ...priorTotalsPerMonth.flatMap((m) => Object.keys(m)),
  ])

  const categoryBreakdown = Array.from(allCategories)
    .map((category) => {
      const amount = currentCategoryTotals[category] || 0
      const previousAmount = previousCategoryTotals[category] || 0
      const average3mo =
        priorTotalsPerMonth.reduce((sum, m) => sum + (m[category] || 0), 0) / priorTotalsPerMonth.length
      const pctVsPrevious = previousAmount > 0 ? Math.round(((amount - previousAmount) / previousAmount) * 100) : null
      const pctVsAverage = average3mo > 0 ? Math.round(((amount - average3mo) / average3mo) * 100) : null
      return {
        category,
        amount,
        amountFormatted: money(amount),
        previousMonthAmount: previousAmount,
        previousMonthAmountFormatted: money(previousAmount),
        threeMonthAverage: Math.round(average3mo),
        threeMonthAverageFormatted: money(Math.round(average3mo)),
        pctVsPrevious,
        pctVsAverage,
      }
    })
    .sort((a, b) => b.amount - a.amount)

  const budget = targets.map((t) => {
    const spent = current
      .filter((tx) => tx.kind === 'expense' && tx.category === t.category)
      .reduce((s, tx) => s + tx.amount, 0)
    return {
      category: t.category,
      budgeted: t.total,
      budgetedFormatted: money(t.total),
      spent,
      spentFormatted: money(spent),
      remaining: t.total - spent,
      remainingFormatted: money(t.total - spent),
      overBudget: t.total > 0 && spent > t.total,
    }
  })

  const topExpenses = [...current]
    .filter((t) => t.kind === 'expense')
    .sort((a, b) => b.amount - a.amount)
    .slice(0, 10)
    .map((t) => ({
      description: t.description,
      category: t.category,
      date: t.date,
      amount: t.amount,
      amountFormatted: money(t.amount),
    }))

  const snapshot = {
    monthKey,
    monthLabel,
    currency: region.currency,
    income: { total: currentTotals.income, formatted: money(currentTotals.income) },
    expenses: { total: currentTotals.expenses, formatted: money(currentTotals.expenses) },
    balance: {
      total: currentTotals.income - currentTotals.expenses,
      formatted: money(currentTotals.income - currentTotals.expenses),
    },
    previousMonth: {
      monthLabel: monthLabelFromYm(previousKey),
      income: previousTotals.income,
      incomeFormatted: money(previousTotals.income),
      expenses: previousTotals.expenses,
      expensesFormatted: money(previousTotals.expenses),
    },
    categoryBreakdown,
    budget,
    savingsGoal: goal ? { name: goal.name, target: goal.amount, targetFormatted: money(goal.amount) } : null,
    recurringCharges: detectRecurring(transactions, monthKey),
    topExpenses,
    transactionCount: current.length,
  }

  snapshot.fingerprint = hashString(JSON.stringify(snapshot))
  return snapshot
}
