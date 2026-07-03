import AppShell from '../components/app/AppShell'
import StatCard from '../components/app/StatCard'
import MonthPicker from '../components/app/MonthPicker'
import RecentTransactions from '../components/dashboard/RecentTransactions'
import SpendingBreakdown from '../components/dashboard/SpendingBreakdown'
import TrendChart from '../components/dashboard/TrendChart'
import { useRegion } from '../lib/RegionContext'
import { useAuth } from '../lib/AuthContext'
import { useTransactionsStore } from '../lib/useTransactionsStore'
import { useSelectedMonth } from '../lib/useSelectedMonth'
import { getOnboardingState } from '../lib/onboarding'
import { formatMoney } from '../lib/format'
import { categoryBreakdownFromTransactions, realMonthlyTrend, totalsFromTransactions } from '../lib/mockData'

const icons = {
  balance: <path d="M3 8l9-5 9 5-9 5-9-5zM3 8v8l9 5 9-5V8" strokeLinecap="round" strokeLinejoin="round" />,
  income: <path d="M6 15l6-6 4 4 6-8" strokeLinecap="round" strokeLinejoin="round" />,
  expenses: <path d="M6 9l6 6 4-4 6 8" strokeLinecap="round" strokeLinejoin="round" />,
  savings: <path d="M12 3v2M12 19v2M5 5l1.5 1.5M17.5 17.5L19 19M3 12h2M19 12h2M5 19l1.5-1.5M17.5 6.5L19 5M12 8a4 4 0 100 8 4 4 0 000-8z" strokeLinecap="round" strokeLinejoin="round" />,
  netWorth: <path d="M4 4v16h16M8 15l3-4 3 3 5-7" strokeLinecap="round" strokeLinejoin="round" />,
}

function Icon({ path }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="var(--color-gold)" strokeWidth="1.8" className="h-4 w-4">
      {path}
    </svg>
  )
}

export default function Dashboard() {
  const { region } = useRegion()
  const { user } = useAuth()
  const { transactions } = useTransactionsStore(region, user?.id)
  const involvement = getOnboardingState(user?.id).involvement || 'power'

  const firstName = (user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'there').split(' ')[0]

  // Balance is cumulative — every transaction ever, like a real running
  // balance. Income/Expenses/Savings Rate/breakdown are scoped to whichever
  // month is selected, so they mean what their label says even after a big
  // CSV import spanning many months.
  const { income: allTimeIncome, expenses: allTimeExpenses } = totalsFromTransactions(transactions)
  const balance = allTimeIncome - allTimeExpenses
  const netWorth = Math.round(balance * 4.4)

  const { filtered, label, goPrev, goNext, canGoNext } = useSelectedMonth(transactions)
  const { income, expenses } = totalsFromTransactions(filtered)
  const savingsRate = income > 0 ? Math.round(((income - expenses) / income) * 100) : 0
  const breakdown = categoryBreakdownFromTransactions(filtered)
  const trend = realMonthlyTrend(transactions)

  return (
    <AppShell title={`Welcome back, ${firstName} 👋`} subtitle="Here's what's happening with your money.">
      <div className="flex items-center justify-between mb-5">
        <p className="text-xs text-slate-light dark:text-white/35">Showing income, expenses, and spending for</p>
        <MonthPicker label={label} onPrev={goPrev} onNext={goNext} canGoNext={canGoNext} />
      </div>

      {involvement === 'simple' ? (
        <>
          <div className="grid sm:grid-cols-2 gap-4 mb-6">
            <StatCard label="Total Balance" value={balance} icon={<Icon path={icons.balance} />} />
            <div className="rounded-2xl bg-navy dark:bg-white/[0.04] p-5 flex items-center gap-4">
              <span className="text-2xl shrink-0">
                {expenses <= income * 0.7 ? '🌱' : expenses <= income ? '👍' : '⚠️'}
              </span>
              <p className="text-[13.5px] text-white/80 leading-relaxed">
                You've spent <span className="text-white font-semibold font-tabular">{formatMoney(expenses, region)}</span> of{' '}
                <span className="text-white font-semibold font-tabular">{formatMoney(income, region)}</span> in {label} —{' '}
                <span className="text-gold font-semibold">{savingsRate}% saved</span>.
              </p>
            </div>
          </div>
          <RecentTransactions transactions={transactions} />
        </>
      ) : involvement === 'planner' ? (
        <>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <StatCard label="Total Balance" value={balance} icon={<Icon path={icons.balance} />} />
            <StatCard label="Income" value={income} tone="up" icon={<Icon path={icons.income} />} />
            <StatCard label="Expenses" value={expenses} tone="down" icon={<Icon path={icons.expenses} />} />
            <StatCard label="Savings Rate" value={savingsRate} isMoney={false} tone="up" icon={<Icon path={icons.savings} />} />
          </div>
          <div className="mb-5">
            <TrendChart data={trend} />
          </div>
          <RecentTransactions transactions={transactions} />
        </>
      ) : (
        <>
          <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
            <div className="sm:col-span-2 lg:col-span-1">
              <StatCard label="Total Balance" value={balance} icon={<Icon path={icons.balance} />} />
            </div>
            <StatCard label="Income" value={income} tone="up" icon={<Icon path={icons.income} />} />
            <StatCard label="Expenses" value={expenses} tone="down" icon={<Icon path={icons.expenses} />} />
            <StatCard label="Savings Rate" value={savingsRate} isMoney={false} tone="up" icon={<Icon path={icons.savings} />} />
            <StatCard label="Net Worth" value={netWorth} icon={<Icon path={icons.netWorth} />} />
          </div>
          <div className="grid lg:grid-cols-3 gap-5 mb-5">
            <div className="lg:col-span-2">
              <TrendChart data={trend} />
            </div>
            <SpendingBreakdown data={breakdown} />
          </div>
          <RecentTransactions transactions={transactions} />
        </>
      )}
    </AppShell>
  )
}
