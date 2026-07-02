import { useMemo, useState } from 'react'
import AppShell from '../components/app/AppShell'
import CategoryFilter from '../components/app/CategoryFilter'
import { useRegion } from '../lib/RegionContext'
import { formatMoney } from '../lib/format'
import { buildTransactions, CATEGORIES } from '../lib/mockData'

function SortIcon({ direction }) {
  return (
    <svg viewBox="0 0 12 12" className={`h-3 w-3 transition-transform ${direction === 'asc' ? 'rotate-180' : ''}`} fill="none">
      <path d="M3 4.5l3 3 3-3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export default function Transactions() {
  const { region } = useRegion()
  const allTransactions = useMemo(() => buildTransactions(region), [region])

  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('all')
  const [sortKey, setSortKey] = useState('date')
  const [sortDir, setSortDir] = useState('desc')

  const filtered = useMemo(() => {
    let rows = allTransactions
    if (category !== 'all') rows = rows.filter((t) => t.category === category)
    if (query.trim()) {
      const q = query.trim().toLowerCase()
      rows = rows.filter(
        (t) => t.description.toLowerCase().includes(q) || t.category.toLowerCase().includes(q)
      )
    }
    const sorted = [...rows].sort((a, b) => {
      let av = sortKey === 'amount' ? a.amount : a.fullDate
      let bv = sortKey === 'amount' ? b.amount : b.fullDate
      if (av < bv) return sortDir === 'asc' ? -1 : 1
      if (av > bv) return sortDir === 'asc' ? 1 : -1
      return 0
    })
    return sorted
  }, [allTransactions, query, category, sortKey, sortDir])

  function toggleSort(key) {
    if (sortKey === key) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'))
    } else {
      setSortKey(key)
      setSortDir('desc')
    }
  }

  return (
    <AppShell title="Transactions" subtitle={`${filtered.length} of ${allTransactions.length} transactions`}>
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-5">
        <div className="relative flex-1 max-w-sm">
          <svg viewBox="0 0 24 24" fill="none" className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-light dark:text-white/35">
            <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="1.7" />
            <path d="M21 21l-3.5-3.5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
          </svg>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search description or category…"
            className="w-full h-10 rounded-xl border border-line dark:border-white/15 bg-white dark:bg-white/[0.04] pl-10 pr-3.5 text-sm text-navy dark:text-white placeholder:text-slate-light dark:placeholder:text-white/30 focus:outline-none focus:border-gold transition-colors"
          />
        </div>
        <CategoryFilter categories={CATEGORIES} value={category} onChange={setCategory} />
        <span className="text-xs text-slate-light dark:text-white/30 hidden sm:inline-block ml-auto">
          Add / edit / delete lands in Phase 2
        </span>
      </div>

      <div className="rounded-2xl bg-white dark:bg-white/[0.04] border border-line dark:border-white/10 overflow-hidden">
        <div className="grid grid-cols-[100px_1fr_140px_120px] sm:grid-cols-[110px_1fr_160px_140px] px-5 py-3 border-b border-line dark:border-white/10 bg-surface/50 dark:bg-white/[0.02]">
          <button
            onClick={() => toggleSort('date')}
            className="flex items-center gap-1 text-[11px] font-semibold uppercase tracking-wide text-slate-light dark:text-white/35 hover:text-navy dark:hover:text-white transition-colors text-left"
          >
            Date {sortKey === 'date' && <SortIcon direction={sortDir} />}
          </button>
          <span className="text-[11px] font-semibold uppercase tracking-wide text-slate-light dark:text-white/35">
            Description
          </span>
          <span className="text-[11px] font-semibold uppercase tracking-wide text-slate-light dark:text-white/35 hidden sm:block">
            Category
          </span>
          <button
            onClick={() => toggleSort('amount')}
            className="flex items-center justify-end gap-1 text-[11px] font-semibold uppercase tracking-wide text-slate-light dark:text-white/35 hover:text-navy dark:hover:text-white transition-colors text-right ml-auto"
          >
            Amount {sortKey === 'amount' && <SortIcon direction={sortDir} />}
          </button>
        </div>

        {filtered.length === 0 ? (
          <div className="py-16 text-center">
            <p className="text-slate dark:text-white/50 text-sm">No transactions match your search.</p>
          </div>
        ) : (
          filtered.map((t) => (
            <div
              key={t.id}
              className="grid grid-cols-[100px_1fr_140px_120px] sm:grid-cols-[110px_1fr_160px_140px] items-center px-5 py-3.5 border-b border-line dark:border-white/10 last:border-0 hover:bg-surface/40 dark:hover:bg-white/[0.03] transition-colors"
            >
              <span className="text-[12.5px] text-slate-light dark:text-white/40 font-tabular">{t.date}</span>
              <div className="min-w-0 pr-3">
                <p className="text-[13.5px] text-navy dark:text-white font-medium truncate">{t.description}</p>
                <p className="text-[11.5px] text-slate-light dark:text-white/35 sm:hidden">{t.category}</p>
              </div>
              <span className="hidden sm:flex items-center gap-2 text-[13px] text-slate dark:text-white/60">
                <span className="h-2 w-2 rounded-full shrink-0" style={{ backgroundColor: t.color }} />
                {t.category}
              </span>
              <span
                className={`text-[13.5px] font-tabular font-semibold text-right ${
                  t.kind === 'income' ? 'text-emerald' : 'text-navy/80 dark:text-white/80'
                }`}
              >
                {t.kind === 'income' ? '+' : '\u2212'}{formatMoney(t.amount, region)}
              </span>
            </div>
          ))
        )}
      </div>
    </AppShell>
  )
}
