// Single source of truth for "how much of each budget category has been
// spent, and how much is left" — used by the Budget page, Dashboard, and
// Quick Add's live preview, so all three always agree with each other.
export function computeBudgetSummary(targets, transactions) {
  const byCategory = targets.map((target) => {
    const spent = transactions
      .filter((t) => t.kind === 'expense' && t.category === target.category)
      .reduce((sum, t) => sum + t.amount, 0)
    return { ...target, spent, remaining: target.total - spent }
  })

  const totalBudget = byCategory.reduce((s, b) => s + b.total, 0)
  const totalSpent = byCategory.reduce((s, b) => s + b.spent, 0)
  const remaining = totalBudget - totalSpent
  const overallPct = totalBudget > 0 ? Math.round((totalSpent / totalBudget) * 100) : 0
  const anyOverBudget = byCategory.some((b) => b.total > 0 && b.spent > b.total)

  return { byCategory, totalBudget, totalSpent, remaining, overallPct, anyOverBudget }
}

export function remainingForCategory(byCategory, category) {
  return byCategory.find((b) => b.category === category) || null
}

// The envelope-budgeting money model:
//   Balance = Total Income − Total Budgeted (money you've earmarked to
//   categories counts as "spoken for" the moment you set the budget, not
//   only once you actually spend it)
//   Each category's "Available to spend" only drops as real expenses land
//   against it (that's byCategory[].remaining from computeBudgetSummary)
// `allTransactions` drives income (all-time, matches the rest of the app's
// "Balance is a real running total" philosophy). `periodTransactions` drives
// per-category spent — pass month-filtered transactions for the Budget page,
// or the real current month for Quick Add's live view.
export function computeMoneyModel(allTransactions, targets, periodTransactions) {
  const totalIncome = allTransactions
    .filter((t) => t.kind === 'income')
    .reduce((sum, t) => sum + t.amount, 0)

  const { byCategory, totalBudget: totalBudgeted, totalSpent, remaining, overallPct, anyOverBudget } =
    computeBudgetSummary(targets, periodTransactions)

  const balance = totalIncome - totalBudgeted

  return {
    totalIncome,
    totalBudgeted,
    balance,
    byCategory,
    totalSpent,
    remaining,
    overallPct,
    anyOverBudget,
  }
}
