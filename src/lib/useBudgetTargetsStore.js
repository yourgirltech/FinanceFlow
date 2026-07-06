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

// Rotating palette for user-created categories — distinct from the fixed
// category colors already used (red/gold/slate/violet/emerald/amber).
const CUSTOM_COLORS = ['#EC4899', '#06B6D4', '#F97316', '#84CC16', '#6366F1', '#14B8A6']

// Lets a user set their own monthly limit per category instead of the
// auto-generated default, and add entirely new categories of their own
// naming — not limited to the fixed default list. Persisted per user +
// region, same pattern as useTransactionsStore.
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

  const addCategory = useCallback(
    (name, total) => {
      const trimmed = name.trim()
      if (!trimmed) return
      setTargets((prev) => {
        const existing = prev.find((t) => t.category.toLowerCase() === trimmed.toLowerCase())
        let next
        if (existing) {
          // Already exists (including a fixed default category) — just update its total.
          next = prev.map((t) => (t === existing ? { ...t, total } : t))
        } else {
          const customCount = prev.filter((t) => t.custom).length
          const color = CUSTOM_COLORS[customCount % CUSTOM_COLORS.length]
          next = [...prev, { category: trimmed, color, total, custom: true }]
        }
        localStorage.setItem(storageKey(region, userId), JSON.stringify(next))
        return next
      })
    },
    [region, userId]
  )

  const removeCategory = useCallback(
    (category) => {
      setTargets((prev) => {
        const next = prev.filter((t) => t.category !== category)
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

  return { targets, updateTarget, addCategory, removeCategory, resetTargets }
}
