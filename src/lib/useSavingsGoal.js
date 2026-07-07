import { useCallback, useEffect, useState } from 'react'

function storageKey(region, userId) {
  return `finance-flow-savings-goal-${userId || 'guest'}-${region.code}`
}

function load(region, userId) {
  try {
    const raw = localStorage.getItem(storageKey(region, userId))
    if (raw) return JSON.parse(raw)
  } catch {
    // fall through to null on corrupt data
  }
  return null // no goal set yet
}

// A lightweight, user-set savings goal (name + target amount) 
export function useSavingsGoal(region, userId) {
  const [goal, setGoalState] = useState(() => load(region, userId))

  useEffect(() => {
    setGoalState(load(region, userId))
  }, [region.code, userId])

  const setGoal = useCallback(
    (name, amount) => {
      const next = { name, amount }
      localStorage.setItem(storageKey(region, userId), JSON.stringify(next))
      setGoalState(next)
    },
    [region, userId]
  )

  const clearGoal = useCallback(() => {
    localStorage.removeItem(storageKey(region, userId))
    setGoalState(null)
  }, [region, userId])

  return { goal, setGoal, clearGoal }
}
