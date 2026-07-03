import { useCallback, useEffect, useState } from 'react'
import { buildBudgetTargets } from './mockData'

function storageKey(region, userId) {
  return `finance-flow-budget-targets-${userId || 'guest'}-${region.code}`
}

// New accounts start with every category at ₦0 — budgets are something the
// user sets deliberately (per their own "full control" model), not a number
// we invent for them. "Reset to defaults" (below) is how they can opt into
// a suggested starting point instead, on demand.
function loadOrInit(region, userId) {
  const key = storageKey(region, userId)
  try {
    const raw = localStorage.getItem(key)
    if (raw) return JSON.parse(raw)
  } catch {
    // fall through to zeroed defaults on corrupt data
  }
  const zeroed = buildBudgetTargets(region).map((t) => ({ ...t, total: 0 }))
  localStorage.setItem(key, JSON.stringify(zeroed))
  return zeroed
}

// Lets a user set their own monthly limit per category instead of the
// auto-generated default. Persisted per user + region, same pattern as
// useTransactionsStore.
export function useBudgetTargetsStore(region, userId) {
  const [targets, setTargets] = useState(() => loadOrInit(region, userId))

  useEffect(() => {
    setTargets(loadOrInit(region, userId))
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
