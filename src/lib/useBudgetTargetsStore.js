import { useCallback, useEffect, useState } from 'react'
import { buildBudgetTargets } from './mockData'

function storageKey(region, userId) {
  return `finance-flow-budget-targets-${userId || 'guest'}-${region.code}`
}

function loadOrSeed(region, userId) {
  const key = storageKey(region, userId)
  try {
    const raw = localStorage.getItem(key)
    if (raw) return JSON.parse(raw)
  } catch {
    // fall through to reseed on corrupt data
  }
  const seeded = buildBudgetTargets(region)
  localStorage.setItem(key, JSON.stringify(seeded))
  return seeded
}

// Lets a user set their own monthly limit per category instead of the
// auto-generated default. Persisted per user + region, same pattern as
// useTransactionsStore.
export function useBudgetTargetsStore(region, userId) {
  const [targets, setTargets] = useState(() => loadOrSeed(region, userId))

  useEffect(() => {
    setTargets(loadOrSeed(region, userId))
  }, [region.code, userId])

  const updateTarget = useCallback(
    (category, total) => {
      setTargets((prev) => {
        const next = prev.map((t) => (t.category === category ? { ...t, total } : t))
        localStorage.setItem(storageKey(region, userId), JSON.stringify(next))
        return next
      })
    },
    [region, userId]
  )

  const resetTargets = useCallback(() => {
    const seeded = buildBudgetTargets(region)
    localStorage.setItem(storageKey(region, userId), JSON.stringify(seeded))
    setTargets(seeded)
  }, [region, userId])

  return { targets, updateTarget, resetTargets }
}
