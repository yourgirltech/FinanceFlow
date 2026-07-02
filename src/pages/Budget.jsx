import AppShell from '../components/app/AppShell'
import { useRegion } from '../lib/RegionContext'
import { formatMoney } from '../lib/format'
import { buildBudgetTargets } from '../lib/mockData'
import { useTransactionsStore } from '../lib/useTransactionsStore'

function BudgetCard({ budget, region }) {
  const pct = budget.total > 0 ? Math.round((budget.spent / budget.total) * 100) : 0
  const over = budget.spent > budget.total
  const barColor = over ? 'var(--color-red)' : budget.color

  return (
    <div className="rounded-2xl bg-white dark:bg-white/[0.04] border border-line dark:border-white/10 p-5 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-navy/5 transition-all duration-300">
      <div className="flex items-center justify-between mb-3">
        <span className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: budget.color }} />
          <span className="text-sm font-semibold text-navy dark:text-white">{budget.category}</span>
        </span>
        <span className={`text-xs font-tabular font-semibold ${over ? 'text-red' : 'text-slate-light dark:text-white/40'}`}>
          {pct}%
        </span>
      </div>

      <div className="h-2 rounded-full bg-surface dark:bg-white/10 overflow-hidden mb-3">
        <div
          className="h-full rounded-full transition-all duration-700"
          style={{ width: `${Math.min(pct, 100)}%`, backgroundColor: barColor }}
        />
      </div>

      <div className="flex items-center justify-between text-[12.5px]">
        <span className="font-tabular text-navy dark:text-white font-medium">{formatMoney(budget.spent, region)}</span>
        <span className="text-slate-light dark:text-white/35">of {formatMoney(budget.total, region)}</span>
      </div>

      {over && (
        <p className="text-[11.5px] text-red mt-2 font-medium">
          Over budget by {formatMoney(budget.spent - budget.total, region)}
        </p>
      )}
    </div>
  )
}

export default function Budget() {
  const { region } = useRegion()
  const { transactions } = useTransactionsStore(region)
  const targets = buildBudgetTargets(region)

  const budgets = targets.map((target) => {
    const spent = transactions
      .filter((t) => t.kind === 'expense' && t.category === target.category)
      .reduce((sum, t) => sum + t.amount, 0)
    return { ...target, spent }
  })

  const totalBudget = budgets.reduce((s, b) => s + b.total, 0)
  const totalSpent = budgets.reduce((s, b) => s + b.spent, 0)
  const overallPct = totalBudget > 0 ? Math.round((totalSpent / totalBudget) * 100) : 0

  return (
    <AppShell title="Budget" subtitle="Monthly budgets by category">
      <div className="rounded-2xl bg-navy dark:bg-white/[0.04] p-6 mb-6 flex flex-col sm:flex-row sm:items-center gap-6 sm:gap-10">
        <div>
          <p className="text-white/50 text-xs mb-1">Total spent this month</p>
          <p className="font-tabular text-white text-2xl font-semibold">{formatMoney(totalSpent, region)}</p>
          <p className="text-white/40 text-xs mt-1">of {formatMoney(totalBudget, region)} budgeted</p>
        </div>
        <div className="flex-1 max-w-sm">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-white/50 text-xs">Overall usage</span>
            <span className="font-tabular text-white/80 text-xs">{overallPct}%</span>
          </div>
          <div className="h-2 rounded-full bg-white/10 overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-emerald to-gold transition-all duration-700"
              style={{ width: `${Math.min(overallPct, 100)}%` }}
            />
          </div>
        </div>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {budgets.map((b) => (
          <BudgetCard key={b.category} budget={b} region={region} />
        ))}
      </div>
    </AppShell>
  )
}
