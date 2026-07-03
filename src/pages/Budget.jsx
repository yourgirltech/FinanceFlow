import { useState } from 'react'
import AppShell from '../components/app/AppShell'
import MonthPicker from '../components/app/MonthPicker'
import BudgetTargetModal from '../components/app/BudgetTargetModal'
import { useRegion } from '../lib/RegionContext'
import { useAuth } from '../lib/AuthContext'
import { formatMoney } from '../lib/format'
import { useTransactionsStore } from '../lib/useTransactionsStore'
import { useBudgetTargetsStore } from '../lib/useBudgetTargetsStore'
import { useSelectedMonth } from '../lib/useSelectedMonth'
import { computeBudgetSummary } from '../lib/budgetSummary'

function BudgetCard({ budget, region, onEdit }) {
  const pct = budget.total > 0 ? Math.round((budget.spent / budget.total) * 100) : 0
  const over = budget.spent > budget.total
  const barColor = over ? 'var(--color-red)' : budget.color

  return (
    <div className="group rounded-2xl bg-white dark:bg-white/[0.04] border border-line dark:border-white/10 p-5 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-navy/5 transition-all duration-300">
      <div className="flex items-center justify-between mb-3">
        <span className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: budget.color }} />
          <span className="text-sm font-semibold text-navy dark:text-white">{budget.category}</span>
        </span>
        <span className="flex items-center gap-2">
          <span className={`text-xs font-tabular font-semibold ${over ? 'text-red' : 'text-slate-light dark:text-white/40'}`}>
            {pct}%
          </span>
          <button
            onClick={onEdit}
            aria-label={`Edit ${budget.category} budget`}
            className="h-6 w-6 rounded-lg flex items-center justify-center text-slate-light dark:text-white/40 opacity-0 group-hover:opacity-100 focus:opacity-100 hover:bg-surface dark:hover:bg-white/[0.08] hover:text-navy dark:hover:text-white transition-all"
          >
            <svg viewBox="0 0 24 24" fill="none" className="h-3.5 w-3.5">
              <path d="M11 4H4v16h16v-7M17.5 3.5a2.1 2.1 0 013 3L12 15l-4 1 1-4 8.5-8.5z" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
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
        <button
          onClick={onEdit}
          className="text-slate-light dark:text-white/35 hover:text-gold hover:underline transition-colors"
        >
          of {formatMoney(budget.total, region)}
        </button>
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
  const { user } = useAuth()
  const { transactions } = useTransactionsStore(region, user?.id)
  const { targets, updateTarget, resetTargets } = useBudgetTargetsStore(region, user?.id)
  const { filtered, label, goPrev, goNext, canGoNext } = useSelectedMonth(transactions)

  const [editingBudget, setEditingBudget] = useState(null)

  const { byCategory: budgets, totalBudget, totalSpent, remaining, overallPct } = computeBudgetSummary(targets, filtered)

  function handleSaveTarget(newTotal) {
    updateTarget(editingBudget.category, newTotal)
    setEditingBudget(null)
  }

  return (
    <AppShell title="Budget" subtitle="Monthly budgets by category — hover a card to edit its limit">
      <div className="flex items-center justify-end mb-5">
        <MonthPicker label={label} onPrev={goPrev} onNext={goNext} canGoNext={canGoNext} />
      </div>

      {totalBudget === 0 ? (
        <div className="rounded-2xl bg-navy dark:bg-white/[0.04] p-6 mb-6 flex flex-col sm:flex-row sm:items-center gap-5">
          <div className="h-11 w-11 rounded-xl bg-white/10 flex items-center justify-center shrink-0">
            <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5">
              <path d="M12 3a9 9 0 100 18 9 9 0 000-18zM12 3v9l6.5 3.5" stroke="var(--color-gold)" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <div className="flex-1">
            <p className="text-white text-sm font-medium mb-1">No budgets set yet</p>
            <p className="text-white/50 text-xs leading-relaxed">
              Every category below is at ₦0 — click one to set a monthly limit, or start from suggested amounts.
            </p>
          </div>
          <button
            onClick={resetTargets}
            className="text-xs font-medium text-gold hover:underline shrink-0 whitespace-nowrap"
          >
            Use suggested budgets
          </button>
        </div>
      ) : (
        <div className="rounded-2xl bg-navy dark:bg-white/[0.04] p-6 mb-6 flex flex-col sm:flex-row sm:items-center gap-6 sm:gap-10">
          <div>
            <p className="text-white/50 text-xs mb-1">Total spent in {label}</p>
            <p className="font-tabular text-white text-2xl font-semibold">{formatMoney(totalSpent, region)}</p>
            <p className="text-white/40 text-xs mt-1">of {formatMoney(totalBudget, region)} budgeted</p>
          </div>
          <div>
            <p className="text-white/50 text-xs mb-1">{remaining >= 0 ? 'Remaining' : 'Over budget'}</p>
            <p className={`font-tabular text-2xl font-semibold ${remaining >= 0 ? 'text-emerald' : 'text-red'}`}>
              {formatMoney(Math.abs(remaining), region)}
            </p>
            <p className="text-white/40 text-xs mt-1">{remaining >= 0 ? 'left to spend' : 'over your budget'}</p>
          </div>
          <div className="flex-1 max-w-sm">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-white/50 text-xs">Overall usage</span>
              <span className={`font-tabular text-xs ${overallPct > 100 ? 'text-red' : 'text-white/80'}`}>{overallPct}%</span>
            </div>
            <div className="h-2 rounded-full bg-white/10 overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-700 ${
                  overallPct > 100 ? 'bg-red' : 'bg-gradient-to-r from-emerald to-gold'
                }`}
                style={{ width: `${Math.min(overallPct, 100)}%` }}
              />
            </div>
          </div>
          <button
            onClick={resetTargets}
            className="text-xs text-white/40 hover:text-white/70 transition-colors sm:ml-auto shrink-0"
          >
            Use suggested budgets
          </button>
        </div>
      )}

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {budgets.map((b) => (
          <BudgetCard key={b.category} budget={b} region={region} onEdit={() => setEditingBudget(b)} />
        ))}
      </div>

      <BudgetTargetModal
        open={Boolean(editingBudget)}
        onClose={() => setEditingBudget(null)}
        onSubmit={handleSaveTarget}
        budget={editingBudget}
      />
    </AppShell>
  )
}
