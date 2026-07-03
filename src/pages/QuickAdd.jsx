import { useState } from 'react'
import AppShell from '../components/app/AppShell'
import QuickAddBar from '../components/quickadd/QuickAddBar'
import QuickAddFeed from '../components/quickadd/QuickAddFeed'
import { useRegion } from '../lib/RegionContext'
import { useAuth } from '../lib/AuthContext'
import { useTransactionsStore } from '../lib/useTransactionsStore'

const EXAMPLES = ['Lunch 15', 'Salary 2500', 'Netflix 18', 'Bolt 20', 'Fuel 80']

export default function QuickAdd() {
  const { region } = useRegion()
  const { user } = useAuth()
  const { addTransaction } = useTransactionsStore(region, user?.id)
  const [sessionEntries, setSessionEntries] = useState([])

  function handleAdd(parsed) {
    addTransaction(parsed)
    setSessionEntries((prev) => [{ ...parsed, id: `${Date.now()}-${Math.random()}` }, ...prev])
  }

  return (
    <AppShell title="Quick Add ⚡" subtitle="Log income and expenses in under 5 seconds.">
      <div className="max-w-2xl mx-auto">
        <QuickAddBar region={region} onAdd={handleAdd} />

        <div className="flex flex-wrap gap-2 mt-4 mb-8">
          <span className="text-xs text-slate-light dark:text-white/35 mr-1">Try:</span>
          {EXAMPLES.map((ex) => (
            <span
              key={ex}
              className="text-xs font-tabular text-slate dark:text-white/50 bg-surface dark:bg-white/[0.06] rounded-full px-2.5 py-1"
            >
              {ex}
            </span>
          ))}
        </div>

        <QuickAddFeed entries={sessionEntries} region={region} />
      </div>
    </AppShell>
  )
}
