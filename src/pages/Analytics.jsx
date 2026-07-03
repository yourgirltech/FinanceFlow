import AppShell from '../components/app/AppShell'
import MonthPicker from '../components/app/MonthPicker'
import TrendChart from '../components/dashboard/TrendChart'
import IncomeExpenseBars from '../components/dashboard/IncomeExpenseBars'
import SpendingBreakdown from '../components/dashboard/SpendingBreakdown'
import { useRegion } from '../lib/RegionContext'
import { useAuth } from '../lib/AuthContext'
import { formatMoney } from '../lib/format'
import { categoryBreakdownFromTransactions, realMonthlyTrend } from '../lib/mockData'
import { useTransactionsStore } from '../lib/useTransactionsStore'
import { useSelectedMonth } from '../lib/useSelectedMonth'

export default function Analytics() {
  const { region } = useRegion()
  const { user } = useAuth()
  const { transactions } = useTransactionsStore(region, user?.id)
  const { filtered, label, goPrev, goNext, canGoNext } = useSelectedMonth(transactions)
  const trend = realMonthlyTrend(transactions)
  const breakdown = categoryBreakdownFromTransactions(filtered)

  const activeMonths = trend.filter((m) => m.income > 0 || m.expenses > 0)
  const avgIncome = activeMonths.length
    ? Math.round(activeMonths.reduce((s, m) => s + m.income, 0) / activeMonths.length)
    : 0
  const avgExpenses = activeMonths.length
    ? Math.round(activeMonths.reduce((s, m) => s + m.expenses, 0) / activeMonths.length)
    : 0
  const topCategory = breakdown[0]

  return (
    <AppShell title="Analytics" subtitle="Spending trends and patterns over the last 6 months">
      <div className="flex items-center justify-end mb-5">
        <MonthPicker label={label} onPrev={goPrev} onNext={goNext} canGoNext={canGoNext} />
      </div>

      <div className="grid sm:grid-cols-3 gap-4 mb-6">
        <div className="rounded-2xl bg-white dark:bg-white/[0.04] border border-line dark:border-white/10 p-5">
          <p className="text-xs text-slate dark:text-white/50 mb-1.5">Average monthly income</p>
          <p className="font-tabular text-xl font-semibold text-emerald">{formatMoney(avgIncome, region)}</p>
        </div>
        <div className="rounded-2xl bg-white dark:bg-white/[0.04] border border-line dark:border-white/10 p-5">
          <p className="text-xs text-slate dark:text-white/50 mb-1.5">Average monthly expenses</p>
          <p className="font-tabular text-xl font-semibold text-red">{formatMoney(avgExpenses, region)}</p>
        </div>
        <div className="rounded-2xl bg-white dark:bg-white/[0.04] border border-line dark:border-white/10 p-5">
          <p className="text-xs text-slate dark:text-white/50 mb-1.5">Top category in {label}</p>
          <p className="flex items-center gap-2 text-navy dark:text-white font-semibold text-[15px] mt-0.5">
            {topCategory ? (
              <>
                <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: topCategory.color }} />
                {topCategory.category}
              </>
            ) : (
              <span className="text-slate-light dark:text-white/35 font-normal text-sm">No expenses yet</span>
            )}
          </p>
        </div>
      </div>

      <div className="mb-5">
        <TrendChart data={trend} />
      </div>

      <div className="grid lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2">
          <IncomeExpenseBars data={trend} />
        </div>
        <SpendingBreakdown data={breakdown} />
      </div>
    </AppShell>
  )
}
