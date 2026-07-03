import { useCallback, useEffect, useState } from 'react'
import { buildTransactions } from './mockData'

function storageKey(region, userId) {
  return `finance-flow-transactions-${userId || 'guest'}-${region.code}`
}

// New accounts (or a first-time switch to a new currency) start completely
// empty — a real user's dashboard should read ₦0 until they've actually
// logged something, not be pre-populated with fake demo data.
function loadOrInit(region, userId) {
  const key = storageKey(region, userId)
  try {
    const raw = localStorage.getItem(key)
    if (raw) return JSON.parse(raw)
  } catch {
    // fall through to empty on corrupt data
  }
  localStorage.setItem(key, JSON.stringify([]))
  return []
}

function sortByDateDesc(list) {
  return [...list].sort((a, b) => (a.fullDate < b.fullDate ? 1 : a.fullDate > b.fullDate ? -1 : 0))
}

// Single source of truth for transactions, persisted to localStorage per
// user + region so different accounts (or currencies) never mix datasets.
// Transactions, Dashboard, Budget, and Analytics all read from this same hook.
export function useTransactionsStore(region, userId) {
  const [transactions, setTransactions] = useState(() => loadOrInit(region, userId))

  useEffect(() => {
    setTransactions(loadOrInit(region, userId))
  }, [region.code, userId])

  const persist = useCallback(
    (next) => {
      localStorage.setItem(storageKey(region, userId), JSON.stringify(next))
      setTransactions(next)
    },
    [region, userId]
  )

  const addTransaction = useCallback(
    (data) => {
      const newTxn = { id: `txn-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`, ...data }
      setTransactions((prev) => {
        const next = sortByDateDesc([newTxn, ...prev])
        localStorage.setItem(storageKey(region, userId), JSON.stringify(next))
        return next
      })
    },
    [region, userId]
  )

  const addManyTransactions = useCallback(
    (rows) => {
      const withIds = rows.map((data, i) => ({
        id: `txn-${Date.now()}-${i}-${Math.random().toString(36).slice(2, 7)}`,
        ...data,
      }))
      setTransactions((prev) => {
        const next = sortByDateDesc([...withIds, ...prev])
        localStorage.setItem(storageKey(region, userId), JSON.stringify(next))
        return next
      })
    },
    [region, userId]
  )

  const updateTransaction = useCallback(
    (id, data) => {
      setTransactions((prev) => {
        const next = sortByDateDesc(prev.map((t) => (t.id === id ? { ...t, ...data } : t)))
        localStorage.setItem(storageKey(region, userId), JSON.stringify(next))
        return next
      })
    },
    [region, userId]
  )

  const deleteTransaction = useCallback(
    (id) => {
      setTransactions((prev) => {
        const next = prev.filter((t) => t.id !== id)
        localStorage.setItem(storageKey(region, userId), JSON.stringify(next))
        return next
      })
    },
    [region, userId]
  )

  const loadSampleData = useCallback(() => {
    const seeded = buildTransactions(region)
    persist(seeded)
  }, [region, persist])

  const clearAllTransactions = useCallback(() => {
    persist([])
  }, [persist])

  return {
    transactions,
    addTransaction,
    addManyTransactions,
    updateTransaction,
    deleteTransaction,
    loadSampleData,
    clearAllTransactions,
  }
}
