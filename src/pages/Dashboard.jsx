import { useState } from 'react'
import AppShell from '../components/app/AppShell'
import StatCard from '../components/app/StatCard'
import MonthPicker from '../components/app/MonthPicker'
import RecentTransactions from '../components/dashboard/RecentTransactions'
import SpendingBreakdown from '../components/dashboard/SpendingBreakdown'
import TrendChart from '../components/dashboard/TrendChart'
import InsightsPanel from '../components/dashboard/InsightsPanel'
import GoalModal from '../components/dashboard/GoalModal'
import { useRegion } from '../lib/RegionContext'
import { useAuth } from '../lib/AuthContext'
import { useTransactionsStore } from '../lib/useTransactionsStore'
import { useBudgetTargetsStore } from '../lib/useBudgetTargetsStore'
import { useSelectedMonth } from '../lib/useSelectedMonth'
import { useSavingsGoal } from '../lib/useSavingsGoal'
import { computeMoneyModel } from '../lib/budgetSummary'
import { generateInsights } from '../lib/insightsEngine'
import { getOnboardingState } from '../lib/onboarding'
import { formatMoney } from '../lib/format'
import { categoryBreakdownFromTransactions, realMonthlyTrend } from '../lib/mockData'

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
  const { targets } = useBudgetTargetsStore(region, user?.id)
  const { goal, setGoal, clearGoal } = useSavingsGoal(region, user?.id)
  const involvement = getOnboardingState(user?.id).involvement || 'power'
  const [goalModalOpen, setGoalModalOpen] = useState(false)

  const firstName = (user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'there').split(' ')[0]

  const { selected, filtered, label, goPrev, goNext, canGoNext } = useSelectedMonth(transactions)

  // The envelope-budgeting model, shared with Budget.jsx and Quick Add:
  // Balance = Total Income (all-time) − Total Budgeted (what you've set
  // aside across categories, counted the moment it's budgeted, not only
  // once spent). Each category's own "available to spend" only drops as
  // real expenses land against it.
  const { totalIncome, totalExpenses, balance, byCategory, anyOverBudget } =
    computeMoneyModel(transactions, targets, filtered)

  const netWorth = Math.round(balance * 4.4)
  const savingsRate = totalIncome > 0 ? Math.round((balance / totalIncome) * 100) : 0
  const breakdown = categoryBreakdownFromTransactions(filtered)
  const trend = realMonthlyTrend(transactions)

  const insights = generateInsights({
    transactions,
    filtered,
    monthKey: selected,
    byCategory,
    goal,
    region,
    formatMoney,
  })

  function handleSaveGoal(name, amount) {
    setGoal(name, amount)
    setGoalModalOpen(false)
  }

  function handleClearGoal() {
    clearGoal()
    setGoalModalOpen(false)
  }

  return (
    <AppShell
      title={
        <>
          <span className="sm:hidden">Hi, {firstName} 👋</span>
          <span className="hidden sm:inline">Welcome back, {firstName} 👋</span>
        </>
      }
      subtitle="Here's what's happening with your money."
    >
      <div className="flex items-center justify-between gap-3 mb-5">
        <p className="text-xs text-slate-light dark:text-white/35 truncate hidden sm:block">Showing budgets and spending for</p>
        <p className="text-xs text-slate-light dark:text-white/35 sm:hidden">Viewing</p>
        <MonthPicker label={label} onPrev={goPrev} onNext={goNext} canGoNext={canGoNext} />
      </div>

      {involvement === 'simple' ? (
        <>
          <div className="grid sm:grid-cols-2 gap-4 mb-6">
            <StatCard label="Total Balance" value={balance} tone={anyOverBudget ? 'down' : 'neutral'} icon={<Icon path={icons.balance} />} />
            <div className="rounded-2xl bg-navy dark:bg-white/[0.04] p-5 flex items-center gap-4">
              <span className="text-2xl shrink-0">
                {anyOverBudget ? '⚠️' : balance >= 0 ? '🌱' : '👍'}
              </span>
              <p className="text-[13.5px] text-white/80 leading-relaxed">
                You've spent or allocated <span className="text-white font-semibold font-tabular">{formatMoney(totalExpenses, region)}</span> of{' '}
                <span className="text-white font-semibold font-tabular">{formatMoney(totalIncome, region)}</span> income in {label}.{' '}
                {anyOverBudget ? (
                  <>A category is <span className="text-red font-semibold">over its limit</span> — check Budget.</>
                ) : (
                  <>You have <span className="text-emerald font-semibold font-tabular">{formatMoney(balance, region)}</span> left unbudgeted.</>
                )}
              </p>
            </div>
          </div>
          <div className="mb-6">
            <InsightsPanel insights={insights} goal={goal} onEditGoal={() => setGoalModalOpen(true)} maxCount={1} compact />
          </div>
          <RecentTransactions transactions={transactions} />
        </>
      ) : involvement === 'planner' ? (
        <>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <StatCard label="Total Balance" value={balance} tone={anyOverBudget ? 'down' : 'neutral'} icon={<Icon path={icons.balance} />} />
            <StatCard label="Income" value={totalIncome} tone="up" icon={<Icon path={icons.income} />} />
            <StatCard label="Expenses" value={totalExpenses} tone="down" icon={<Icon path={icons.expenses} />} />
            <StatCard label="Savings Rate" value={savingsRate} isMoney={false} tone={anyOverBudget ? 'down' : 'up'} icon={<Icon path={icons.savings} />} />
          </div>
          <div className="mb-5">
            <InsightsPanel insights={insights} goal={goal} onEditGoal={() => setGoalModalOpen(true)} maxCount={2} />
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
              <StatCard label="Total Balance" value={balance} tone={anyOverBudget ? 'down' : 'neutral'} icon={<Icon path={icons.balance} />} />
            </div>
            <StatCard label="Income" value={totalIncome} tone="up" icon={<Icon path={icons.income} />} />
            <StatCard label="Expenses" value={totalExpenses} tone="down" icon={<Icon path={icons.expenses} />} />
            <StatCard label="Savings Rate" value={savingsRate} isMoney={false} tone={anyOverBudget ? 'down' : 'up'} icon={<Icon path={icons.savings} />} />
            <StatCard label="Net Worth" value={netWorth} icon={<Icon path={icons.netWorth} />} />
          </div>
          <div className="mb-5">
            <InsightsPanel insights={insights} goal={goal} onEditGoal={() => setGoalModalOpen(true)} maxCount={3} />
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

      <GoalModal
        open={goalModalOpen}
        onClose={() => setGoalModalOpen(false)}
        onSubmit={handleSaveGoal}
        onClear={handleClearGoal}
        initial={goal}
      />
    </AppShell>
  )
}
