// Single source of truth for "how much of each budget category has been
// spent, and how much is left" — used by the Budget page, Dashboard, and
// Quick Add's live preview, so all three always agree with each other.
export function computeBudgetSummary(targets, transactions) {
  const byCategory = targets.map((target) => {
    const spent = transactions
      .filter((t) => t.kind === 'expense' && t.category === target.category)
      .reduce((sum, t) => sum + t.amount, 0)
    // "effective" is what actually counts against Balance: whichever is
    // bigger, the budgeted amount or real spending. This is what makes the
    // no-budget-set case fall back to plain pay-as-you-go deduction, and
    // makes an overspent category deduct its real (higher) total instead of
    // silently capping at the budget.
    const effective = Math.max(target.total, spent)
    return { ...target, spent, remaining: target.total - spent, effective }
  })

  const totalBudget = byCategory.reduce((s, b) => s + b.total, 0)
  const totalSpent = byCategory.reduce((s, b) => s + b.spent, 0)
  const totalEffective = byCategory.reduce((s, b) => s + b.effective, 0)
  const remaining = totalBudget - totalSpent
  const overallPct = totalBudget > 0 ? Math.round((totalSpent / totalBudget) * 100) : 0
  const anyOverBudget = byCategory.some((b) => b.total > 0 && b.spent > b.total)

  return { byCategory, totalBudget, totalSpent, totalEffective, remaining, overallPct, anyOverBudget }
}

export function remainingForCategory(byCategory, category) {
  return byCategory.find((b) => b.category === category) || null
}

// The envelope-budgeting money model:
//   Balance = Total Income − Total Expenses, where "Expenses" per category
//   is whichever is bigger: the budgeted amount (earmarked the moment it's
//   set, per the envelope model) or actual spending (so categories with no
//   budget set still deduct real spending normally, and an overspent
//   category deducts its true higher total rather than capping at budget).
// `allTransactions` drives income (all-time, matches the rest of the app's
// "Balance is a real running total" philosophy). `periodTransactions` drives
// per-category spent — pass month-filtered transactions for the Budget page,
// or the real current month for Quick Add's live view.
export function computeMoneyModel(allTransactions, targets, periodTransactions) {
  const totalIncome = allTransactions
    .filter((t) => t.kind === 'income')
    .reduce((sum, t) => sum + t.amount, 0)

  const {
    byCategory,
    totalBudget: totalBudgeted,
    totalSpent,
    totalEffective,
    remaining,
    overallPct,
    anyOverBudget,
  } = computeBudgetSummary(targets, periodTransactions)

  const balance = totalIncome - totalEffective

  return {
    totalIncome,
    totalBudgeted,
    totalExpenses: totalEffective,
    balance,
    byCategory,
    totalSpent,
    remaining,
    overallPct,
    anyOverBudget,
  }
}
