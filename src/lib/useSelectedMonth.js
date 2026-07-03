import { useEffect, useMemo, useState } from 'react'
import { filterTransactionsByMonth, monthLabelFromYm } from './mockData'

function currentYm() {
  const now = new Date()
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`
}

function shiftYm(ym, delta) {
  const [y, m] = ym.split('-').map(Number)
  const d = new Date(y, m - 1 + delta, 1)
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
}

// Scopes a transaction list to a single selected month. Defaults to the most
// recent month present in the data (so seeded demo data, or a freshly
// imported CSV of old statements, both "just work" without landing on an
// empty view) — and re-syncs to that once when data first arrives.
export function useSelectedMonth(transactions) {
  const latestDataYm = useMemo(() => {
    if (transactions.length === 0) return null
    return transactions.reduce((max, t) => (t.fullDate > max ? t.fullDate : max), transactions[0].fullDate).slice(0, 7)
  }, [transactions])

  const [selected, setSelected] = useState(latestDataYm || currentYm())
  const [synced, setSynced] = useState(Boolean(latestDataYm))

  useEffect(() => {
    if (!synced && latestDataYm) {
      setSelected(latestDataYm)
      setSynced(true)
    }
  }, [latestDataYm, synced])

  const maxYm = latestDataYm && latestDataYm > currentYm() ? latestDataYm : currentYm()

  return {
    selected,
    label: monthLabelFromYm(selected),
    filtered: filterTransactionsByMonth(transactions, selected),
    goPrev: () => setSelected((s) => shiftYm(s, -1)),
    goNext: () => setSelected((s) => shiftYm(s, 1)),
    canGoNext: selected < maxYm,
  }
}
