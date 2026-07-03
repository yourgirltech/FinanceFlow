import { useState } from 'react'
import AppShell from '../components/app/AppShell'
import QuickAddBar from '../components/quickadd/QuickAddBar'
import QuickAddFeed from '../components/quickadd/QuickAddFeed'
import QuickAddSummary from '../components/quickadd/QuickAddSummary'
import { useRegion } from '../lib/RegionContext'
import { useAuth } from '../lib/AuthContext'
import { useTransactionsStore } from '../lib/useTransactionsStore'
import { useBudgetTargetsStore } from '../lib/useBudgetTargetsStore'
import { useSelectedMonth } from '../lib/useSelectedMonth'
import { computeBudgetSummary } from '../lib/budgetSummary'
import { totalsFromTransactions } from '../lib/mockData'

const EXAMPLES = ['Lunch 15', 'Salary 2500', 'Netflix 18', 'Bolt 20', 'Fuel 80']

export default function QuickAdd() {
  const { region } = useRegion()
  const { user } = useAuth()
  const { transactions, addTransaction } = useTransactionsStore(region, user?.id)
  const { targets } = useBudgetTargetsStore(region, user?.id)
  const { filtered } = useSelectedMonth(transactions)
  const [sessionEntries, setSessionEntries] = useState([])
  const [prefill, setPrefill] = useState(undefined)

  const { income, expenses } = totalsFromTransactions(transactions)
  const { byCategory: budgetByCategory } = computeBudgetSummary(targets, filtered)

  function handleAdd(parsed) {
    addTransaction(parsed)
    setSessionEntries((prev) => [{ ...parsed, id: `${Date.now()}-${Math.random()}` }, ...prev])
    setPrefill(undefined)
  }

  function clearFeed() {
    setSessionEntries([])
  }

  return (
    <AppShell title="Quick Add ⚡" subtitle="Log income and expenses in under 5 seconds.">
      <div className="max-w-2xl mx-auto">
        <QuickAddSummary income={income} expenses={expenses} region={region} />
        <QuickAddBar region={region} onAdd={handleAdd} prefill={prefill} budgetByCategory={budgetByCategory} />

        <p className="flex flex-wrap items-center gap-x-1.5 gap-y-1 mt-4 mb-8 text-xs text-slate-light dark:text-white/35">
          <span className="mr-0.5">Try:</span>
          {EXAMPLES.map((ex, i) => (
            <span key={ex} className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => setPrefill({ text: ex, key: Date.now() })}
                className="font-tabular text-slate dark:text-white/50 hover:text-gold transition-colors"
              >
                {ex}
              </button>
              {i < EXAMPLES.length - 1 && <span className="text-line dark:text-white/15">·</span>}
            </span>
          ))}
        </p>

        <QuickAddFeed entries={sessionEntries} region={region} onClear={clearFeed} />
      </div>
    </AppShell>
  )
}
