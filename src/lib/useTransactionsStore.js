import { useCallback, useEffect, useState } from 'react'
import { buildTransactions } from './mockData'

function storageKey(region) {
  return `finance-flow-transactions-${region.code}`
}

function loadOrSeed(region) {
  const key = storageKey(region)
  try {
    const raw = localStorage.getItem(key)
    if (raw) return JSON.parse(raw)
  } catch {
    // fall through to reseed on corrupt data
  }
  const seeded = buildTransactions(region)
  localStorage.setItem(key, JSON.stringify(seeded))
  return seeded
}

function sortByDateDesc(list) {
  return [...list].sort((a, b) => (a.fullDate < b.fullDate ? 1 : a.fullDate > b.fullDate ? -1 : 0))
}

// Single source of truth for transactions, persisted to localStorage per
// region so switching currency doesn't mix datasets. Transactions, Dashboard,
// Budget, and Analytics all read from this same hook.
export function useTransactionsStore(region) {
  const [transactions, setTransactions] = useState(() => loadOrSeed(region))

  useEffect(() => {
    setTransactions(loadOrSeed(region))
  }, [region.code])

  const persist = useCallback(
    (next) => {
      localStorage.setItem(storageKey(region), JSON.stringify(next))
      setTransactions(next)
    },
    [region]
  )

  const addTransaction = useCallback(
    (data) => {
      const newTxn = { id: `txn-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`, ...data }
      setTransactions((prev) => {
        const next = sortByDateDesc([newTxn, ...prev])
        localStorage.setItem(storageKey(region), JSON.stringify(next))
        return next
      })
    },
    [region]
  )

  const updateTransaction = useCallback(
    (id, data) => {
      setTransactions((prev) => {
        const next = sortByDateDesc(prev.map((t) => (t.id === id ? { ...t, ...data } : t)))
        localStorage.setItem(storageKey(region), JSON.stringify(next))
        return next
      })
    },
    [region]
  )

  const deleteTransaction = useCallback(
    (id) => {
      setTransactions((prev) => {
        const next = prev.filter((t) => t.id !== id)
        localStorage.setItem(storageKey(region), JSON.stringify(next))
        return next
      })
    },
    [region]
  )

  const resetTransactions = useCallback(() => {
    const seeded = buildTransactions(region)
    persist(seeded)
  }, [region, persist])

  return { transactions, addTransaction, updateTransaction, deleteTransaction, resetTransactions }
}
