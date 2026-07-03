import AppShell from '../components/app/AppShell'
import TrendChart from '../components/dashboard/TrendChart'
import IncomeExpenseBars from '../components/dashboard/IncomeExpenseBars'
import SpendingBreakdown from '../components/dashboard/SpendingBreakdown'
import { useRegion } from '../lib/RegionContext'
import { useAuth } from '../lib/AuthContext'
import { formatMoney } from '../lib/format'
import { buildMonthlyTrend, categoryBreakdownFromTransactions } from '../lib/mockData'
import { useTransactionsStore } from '../lib/useTransactionsStore'

export default function Analytics() {
  const { region } = useRegion()
  const { user } = useAuth()
  const { transactions } = useTransactionsStore(region, user?.id)
  const trend = buildMonthlyTrend(region)
  const breakdown = categoryBreakdownFromTransactions(transactions)

  const avgIncome = Math.round(trend.reduce((s, m) => s + m.income, 0) / trend.length)
  const avgExpenses = Math.round(trend.reduce((s, m) => s + m.expenses, 0) / trend.length)
  const topCategory = breakdown[0]

  return (
    <AppShell title="Analytics" subtitle="Spending trends and patterns over the last 6 months">
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
          <p className="text-xs text-slate dark:text-white/50 mb-1.5">Top spending category</p>
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
