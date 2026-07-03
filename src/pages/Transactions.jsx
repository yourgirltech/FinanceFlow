import { useMemo, useState } from 'react'
import AppShell from '../components/app/AppShell'
import CategoryFilter from '../components/app/CategoryFilter'
import Button from '../components/ui/Button'
import TransactionModal from '../components/app/TransactionModal'
import ConfirmDeleteModal from '../components/app/ConfirmDeleteModal'
import { useRegion } from '../lib/RegionContext'
import { useAuth } from '../lib/AuthContext'
import { formatMoney } from '../lib/format'
import { CATEGORIES } from '../lib/mockData'
import { useTransactionsStore } from '../lib/useTransactionsStore'

function SortIcon({ direction }) {
  return (
    <svg viewBox="0 0 12 12" className={`h-3 w-3 transition-transform ${direction === 'asc' ? 'rotate-180' : ''}`} fill="none">
      <path d="M3 4.5l3 3 3-3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function RowActions({ onEdit, onDelete }) {
  return (
    <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-opacity">
      <button
        onClick={onEdit}
        aria-label="Edit transaction"
        className="h-7 w-7 rounded-lg flex items-center justify-center text-slate-light dark:text-white/40 hover:bg-surface dark:hover:bg-white/[0.08] hover:text-navy dark:hover:text-white transition-colors"
      >
        <svg viewBox="0 0 24 24" fill="none" className="h-3.5 w-3.5">
          <path d="M11 4H4v16h16v-7M17.5 3.5a2.1 2.1 0 013 3L12 15l-4 1 1-4 8.5-8.5z" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
      <button
        onClick={onDelete}
        aria-label="Delete transaction"
        className="h-7 w-7 rounded-lg flex items-center justify-center text-slate-light dark:text-white/40 hover:bg-red-soft dark:hover:bg-red/10 hover:text-red transition-colors"
      >
        <svg viewBox="0 0 24 24" fill="none" className="h-3.5 w-3.5">
          <path d="M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
    </div>
  )
}

export default function Transactions() {
  const { region } = useRegion()
  const { user } = useAuth()
  const { transactions, addTransaction, updateTransaction, deleteTransaction } = useTransactionsStore(region, user?.id)

  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('all')
  const [sortKey, setSortKey] = useState('date')
  const [sortDir, setSortDir] = useState('desc')

  const [modalOpen, setModalOpen] = useState(false)
  const [editingTxn, setEditingTxn] = useState(null)
  const [deletingTxn, setDeletingTxn] = useState(null)

  const filtered = useMemo(() => {
    let rows = transactions
    if (category !== 'all') rows = rows.filter((t) => t.category === category)
    if (query.trim()) {
      const q = query.trim().toLowerCase()
      rows = rows.filter(
        (t) => t.description.toLowerCase().includes(q) || t.category.toLowerCase().includes(q)
      )
    }
    return [...rows].sort((a, b) => {
      let av = sortKey === 'amount' ? a.amount : a.fullDate
      let bv = sortKey === 'amount' ? b.amount : b.fullDate
      if (av < bv) return sortDir === 'asc' ? -1 : 1
      if (av > bv) return sortDir === 'asc' ? 1 : -1
      return 0
    })
  }, [transactions, query, category, sortKey, sortDir])

  function toggleSort(key) {
    if (sortKey === key) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'))
    } else {
      setSortKey(key)
      setSortDir('desc')
    }
  }

  function openAdd() {
    setEditingTxn(null)
    setModalOpen(true)
  }

  function openEdit(txn) {
    setEditingTxn(txn)
    setModalOpen(true)
  }

  function handleSubmit(data) {
    if (editingTxn) {
      updateTransaction(editingTxn.id, data)
    } else {
      addTransaction(data)
    }
    setModalOpen(false)
    setEditingTxn(null)
  }

  function confirmDelete() {
    deleteTransaction(deletingTxn.id)
    setDeletingTxn(null)
  }

  return (
    <AppShell title="Transactions" subtitle={`${filtered.length} of ${transactions.length} transactions`}>
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
        <Button variant="navGold" onClick={openAdd} className="h-10 px-4 sm:ml-auto">
          <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4 -ml-1">
            <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
          Add Transaction
        </Button>
      </div>

      <div className="rounded-2xl bg-white dark:bg-white/[0.04] border border-line dark:border-white/10 overflow-hidden">
        <div className="grid grid-cols-[90px_1fr_130px_110px_64px] sm:grid-cols-[110px_1fr_160px_130px_72px] px-5 py-3 border-b border-line dark:border-white/10 bg-surface/50 dark:bg-white/[0.02]">
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
          <span />
        </div>

        {filtered.length === 0 ? (
          <div className="py-16 text-center">
            <p className="text-slate dark:text-white/50 text-sm">No transactions match your search.</p>
          </div>
        ) : (
          filtered.map((t) => (
            <div
              key={t.id}
              className="group grid grid-cols-[90px_1fr_130px_110px_64px] sm:grid-cols-[110px_1fr_160px_130px_72px] items-center px-5 py-3.5 border-b border-line dark:border-white/10 last:border-0 hover:bg-surface/40 dark:hover:bg-white/[0.03] transition-colors"
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
              <RowActions onEdit={() => openEdit(t)} onDelete={() => setDeletingTxn(t)} />
            </div>
          ))
        )}
      </div>

      <TransactionModal
        open={modalOpen}
        onClose={() => { setModalOpen(false); setEditingTxn(null) }}
        onSubmit={handleSubmit}
        initial={editingTxn}
      />

      <ConfirmDeleteModal
        open={Boolean(deletingTxn)}
        onClose={() => setDeletingTxn(null)}
        onConfirm={confirmDelete}
        description={deletingTxn?.description}
      />
    </AppShell>
  )
}
