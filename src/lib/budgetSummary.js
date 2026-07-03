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

  return { byCategory, totalBudget, totalSpent, remaining, overallPct }
}

export function remainingForCategory(byCategory, category) {
  return byCategory.find((b) => b.category === category) || null
}
