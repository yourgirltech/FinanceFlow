export function computeBudgetSummary(targets, transactions) {
  const byCategory = targets.map((target) => {
    const spent = transactions
      .filter((t) => t.kind === 'expense' && t.category === target.category)
      .reduce((sum, t) => sum + t.amount, 0)
    
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
