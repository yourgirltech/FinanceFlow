import { useCallback, useEffect, useState } from 'react'
import { buildTransactions } from './mockData'

function storageKey(region, userId) {
  return `finance-flow-transactions-${userId || 'guest'}-${region.code}`
}

function loadOrSeed(region, userId) {
  const key = storageKey(region, userId)
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
// user + region so different accounts (or currencies) never mix datasets.
// Transactions, Dashboard, Budget, and Analytics all read from this same hook.
export function useTransactionsStore(region, userId) {
  const [transactions, setTransactions] = useState(() => loadOrSeed(region, userId))

  useEffect(() => {
    setTransactions(loadOrSeed(region, userId))
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

  const resetTransactions = useCallback(() => {
    const seeded = buildTransactions(region)
    persist(seeded)
  }, [region, persist])

  return { transactions, addTransaction, updateTransaction, deleteTransaction, resetTransactions }
}
