import { useCallback, useEffect, useState } from 'react'

function storageKey(userId) {
  return `finance-flow-notifications-${userId || 'guest'}`
}

const defaults = {
  weeklySummary: true,
  budgetAlerts: true,
  largeTransactions: true,
  productUpdates: false,
}

function load(userId) {
  try {
    const raw = localStorage.getItem(storageKey(userId))
    if (raw) return { ...defaults, ...JSON.parse(raw) }
  } catch {
    // fall through to defaults on corrupt data
  }
  return { ...defaults }
}

export function useNotificationPrefs(userId) {
  const [prefs, setPrefsState] = useState(() => load(userId))

  useEffect(() => {
    setPrefsState(load(userId))
  }, [userId])

  const setPref = useCallback(
    (key, value) => {
      setPrefsState((prev) => {
        const next = { ...prev, [key]: value }
        localStorage.setItem(storageKey(userId), JSON.stringify(next))
        return next
      })
    },
    [userId]
  )

  return { prefs, setPref }
}
