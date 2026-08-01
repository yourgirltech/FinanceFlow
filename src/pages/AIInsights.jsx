import { useMemo } from 'react'
import AppShell from '../components/app/AppShell'
import MonthPicker from '../components/app/MonthPicker'
import SpendingAssistant from '../components/insights/SpendingAssistant'
import { useRegion } from '../lib/RegionContext'
import { useAuth } from '../lib/AuthContext'
import { useTransactionsStore } from '../lib/useTransactionsStore'
import { useBudgetTargetsStore } from '../lib/useBudgetTargetsStore'
import { useSelectedMonth } from '../lib/useSelectedMonth'
import { useSavingsGoal } from '../lib/useSavingsGoal'
import { buildFinancialSnapshot } from '../lib/financialSnapshot'

export default function AIInsights() {
  const { region } = useRegion()
  const { user } = useAuth()
  const { transactions } = useTransactionsStore(region, user?.id)
  const { targets } = useBudgetTargetsStore(region, user?.id)
  const { goal } = useSavingsGoal(region, user?.id)
  const { selected, label, goPrev, goNext, canGoNext } = useSelectedMonth(transactions)

  const snapshot = useMemo(
    () => buildFinancialSnapshot({ transactions, targets, goal, region, monthKey: selected }),
    [transactions, targets, goal, region, selected]
  )

  return (
    <AppShell title="AI Assistant" subtitle="Ask Finn about your real spending — powered by Claude.">
      <div className="flex items-center justify-between gap-3 mb-5">
        <p className="text-xs text-slate-light dark:text-white/35 truncate hidden sm:block">Analyzing</p>
        <MonthPicker label={label} onPrev={goPrev} onNext={goNext} canGoNext={canGoNext} />
      </div>
      <SpendingAssistant snapshot={snapshot} />
    </AppShell>
  )
}
