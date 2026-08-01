import { describe, it, expect } from 'vitest'
import { buildFinancialSnapshot } from './financialSnapshot'

const region = { code: 'US', currency: 'USD', locale: 'en-US' }

const transactions = [
  { id: 't1', fullDate: '2026-06-01', date: 'Jun 01', category: 'Salary', description: 'Monthly payroll', kind: 'income', amount: 3000 },
  { id: 't2', fullDate: '2026-06-05', date: 'Jun 05', category: 'Food & Dining', description: 'Groceries', kind: 'expense', amount: 400 },
  { id: 't3', fullDate: '2026-06-10', date: 'Jun 10', category: 'Food & Dining', description: 'Dinner out', kind: 'expense', amount: 100 },
  { id: 't4', fullDate: '2026-06-12', date: 'Jun 12', category: 'Transport', description: 'Ride to work', kind: 'expense', amount: 50 },
  { id: 't5', fullDate: '2026-06-08', date: 'Jun 08', category: 'Entertainment', description: 'Netflix', kind: 'expense', amount: 15 },

  { id: 't6', fullDate: '2026-05-05', date: 'May 05', category: 'Food & Dining', description: 'Groceries', kind: 'expense', amount: 300 },
  { id: 't7', fullDate: '2026-05-15', date: 'May 15', category: 'Entertainment', description: 'Netflix', kind: 'expense', amount: 15 },

  { id: 't8', fullDate: '2026-04-05', date: 'Apr 05', category: 'Food & Dining', description: 'Groceries', kind: 'expense', amount: 250 },
  { id: 't9', fullDate: '2026-04-15', date: 'Apr 15', category: 'Entertainment', description: 'Netflix', kind: 'expense', amount: 15 },

  { id: 't10', fullDate: '2026-03-05', date: 'Mar 05', category: 'Food & Dining', description: 'Groceries', kind: 'expense', amount: 200 },
  { id: 't11', fullDate: '2026-03-15', date: 'Mar 15', category: 'Entertainment', description: 'Netflix', kind: 'expense', amount: 15 },
]

const targets = [
  { category: 'Food & Dining', total: 450 },
  { category: 'Transport', total: 100 },
]

const goal = { name: 'Emergency Fund', amount: 5000 }

describe('buildFinancialSnapshot', () => {
  it('computes current-month totals', () => {
    const snapshot = buildFinancialSnapshot({ transactions, targets, goal, region, monthKey: '2026-06' })

    expect(snapshot.monthKey).toBe('2026-06')
    expect(snapshot.income.total).toBe(3000)
    expect(snapshot.expenses.total).toBe(400 + 100 + 50 + 15)
    expect(snapshot.balance.total).toBe(3000 - (400 + 100 + 50 + 15))
    expect(snapshot.previousMonth.monthLabel).toBe('May 2026')
    expect(snapshot.transactionCount).toBe(5) // 1 income + 4 expenses in June
  })

  it('compares each category against the previous month and the 3-month average', () => {
    const snapshot = buildFinancialSnapshot({ transactions, targets, goal, region, monthKey: '2026-06' })
    const dining = snapshot.categoryBreakdown.find((c) => c.category === 'Food & Dining')

    expect(dining.amount).toBe(500)
    expect(dining.previousMonthAmount).toBe(300)
    expect(dining.threeMonthAverage).toBe(250) // (300 + 250 + 200) / 3
    expect(dining.pctVsPrevious).toBe(67) // (500 - 300) / 300
    expect(dining.pctVsAverage).toBe(100) // (500 - 250) / 250
  })

  it('computes budget vs. actual spend per category', () => {
    const snapshot = buildFinancialSnapshot({ transactions, targets, goal, region, monthKey: '2026-06' })
    const dining = snapshot.budget.find((b) => b.category === 'Food & Dining')
    const transport = snapshot.budget.find((b) => b.category === 'Transport')

    expect(dining.spent).toBe(500)
    expect(dining.overBudget).toBe(true)
    expect(dining.remaining).toBe(-50)

    expect(transport.spent).toBe(50)
    expect(transport.overBudget).toBe(false)
    expect(transport.remaining).toBe(50)
  })

  it('detects recurring charges seen in 2+ of the last 3 months', () => {
    const snapshot = buildFinancialSnapshot({ transactions, targets, goal, region, monthKey: '2026-06' })
    const netflix = snapshot.recurringCharges.find((r) => r.description === 'Netflix')

    expect(netflix).toBeDefined()
    expect(netflix.monthsSeen).toBe(3)
    expect(netflix.averageAmount).toBe(15)

    // "Dinner out" only appears once, so it should never be flagged as recurring
    expect(snapshot.recurringCharges.find((r) => r.description === 'Dinner out')).toBeUndefined()
  })

  it('ranks top expenses by amount, largest first', () => {
    const snapshot = buildFinancialSnapshot({ transactions, targets, goal, region, monthKey: '2026-06' })

    expect(snapshot.topExpenses[0]).toMatchObject({ description: 'Groceries', amount: 400 })
    expect(snapshot.topExpenses[1]).toMatchObject({ description: 'Dinner out', amount: 100 })
  })

  it('includes the savings goal when set, and null when not', () => {
    const withGoal = buildFinancialSnapshot({ transactions, targets, goal, region, monthKey: '2026-06' })
    expect(withGoal.savingsGoal).toMatchObject({ name: 'Emergency Fund', target: 5000 })

    const withoutGoal = buildFinancialSnapshot({ transactions, targets, goal: null, region, monthKey: '2026-06' })
    expect(withoutGoal.savingsGoal).toBeNull()
  })

  it('produces a deterministic fingerprint that changes when the data changes', () => {
    const a = buildFinancialSnapshot({ transactions, targets, goal, region, monthKey: '2026-06' })
    const b = buildFinancialSnapshot({ transactions, targets, goal, region, monthKey: '2026-06' })
    expect(a.fingerprint).toBe(b.fingerprint)

    const changed = [...transactions, { id: 't99', fullDate: '2026-06-20', date: 'Jun 20', category: 'Shopping', description: 'New shoes', kind: 'expense', amount: 80 }]
    const c = buildFinancialSnapshot({ transactions: changed, targets, goal, region, monthKey: '2026-06' })
    expect(c.fingerprint).not.toBe(a.fingerprint)
  })

  it('handles an account with no transactions yet', () => {
    const snapshot = buildFinancialSnapshot({ transactions: [], targets, goal: null, region, monthKey: '2026-06' })

    expect(snapshot.transactionCount).toBe(0)
    expect(snapshot.income.total).toBe(0)
    expect(snapshot.expenses.total).toBe(0)
    expect(snapshot.recurringCharges).toEqual([])
    expect(snapshot.topExpenses).toEqual([])
  })
})
