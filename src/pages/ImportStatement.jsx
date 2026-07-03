import { useState } from 'react'
import { Link } from 'react-router-dom'
import AppShell from '../components/app/AppShell'
import UploadArea from '../components/import/UploadArea'
import ImportPreviewTable from '../components/import/ImportPreviewTable'
import Button from '../components/ui/Button'
import { useRegion } from '../lib/RegionContext'
import { useAuth } from '../lib/AuthContext'
import { useTransactionsStore } from '../lib/useTransactionsStore'
import { parseStatementCSV } from '../lib/importStatement'
import { categoryKind, categoryColor } from '../lib/mockData'

export default function ImportStatement() {
  const { region } = useRegion()
  const { user } = useAuth()
  const { addManyTransactions } = useTransactionsStore(region, user?.id)

  const [loading, setLoading] = useState(false)
  const [rows, setRows] = useState(null)
  const [warning, setWarning] = useState('')
  const [fileError, setFileError] = useState('')
  const [summary, setSummary] = useState(null)

  async function handleFile(file) {
    setLoading(true)
    setFileError('')
    try {
      const { rows: parsed, warning: w } = await parseStatementCSV(file)
      if (parsed.length === 0) {
        setFileError("Couldn't find any usable rows in that file. Check it has date, description, and amount columns.")
        setLoading(false)
        return
      }
      setRows(parsed)
      setWarning(w || '')
    } catch (err) {
      setFileError('Something went wrong reading that file. Make sure it\'s a valid CSV.')
    }
    setLoading(false)
  }

  function toggleRow(id) {
    setRows((prev) => prev.map((r) => (r.id === id ? { ...r, include: !r.include } : r)))
  }

  function changeCategory(id, category) {
    setRows((prev) =>
      prev.map((r) =>
        r.id === id ? { ...r, category, kind: categoryKind(category), color: categoryColor(category) } : r
      )
    )
  }

  function handleImport() {
    const included = rows.filter((r) => r.include)
    const counts = {}
    included.forEach((r) => { counts[r.category] = (counts[r.category] || 0) + 1 })

    addManyTransactions(
      included.map(({ id, include, ...rest }) => rest)
    )
    setSummary({ count: included.length, counts })
    setRows(null)
  }

  function startOver() {
    setRows(null)
    setSummary(null)
    setWarning('')
    setFileError('')
  }

  return (
    <AppShell title="Import Statement 📄" subtitle="Bring in transactions from your bank's exported CSV.">
      <div className="max-w-2xl mx-auto">
        {summary ? (
          <div className="text-center py-10 animate-fade-up">
            <div className="h-14 w-14 rounded-2xl bg-emerald-soft dark:bg-emerald/10 flex items-center justify-center mx-auto mb-5">
              <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6">
                <path d="M5 13l4 4L19 7" stroke="var(--color-emerald)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <h2 className="font-display font-extrabold text-navy dark:text-white text-2xl tracking-tight mb-2">
              Imported {summary.count} transaction{summary.count === 1 ? '' : 's'}
            </h2>
            <div className="flex flex-wrap justify-center gap-2 mt-4 mb-8">
              {Object.entries(summary.counts).map(([cat, count]) => (
                <span
                  key={cat}
                  className="text-xs text-slate dark:text-white/60 bg-surface dark:bg-white/[0.06] rounded-full px-3 py-1.5"
                >
                  {cat} · {count}
                </span>
              ))}
            </div>
            <div className="flex items-center justify-center gap-3">
              <Button variant="navGold" onClick={startOver} className="h-10 px-5">Import another file</Button>
              <Link to="/transactions">
                <Button variant="secondary" className="h-10 px-5">View transactions</Button>
              </Link>
            </div>
          </div>
        ) : rows ? (
          <>
            {warning && (
              <p className="text-xs text-gold bg-gold-soft dark:bg-gold/10 rounded-lg px-3 py-2.5 mb-4">{warning}</p>
            )}
            <ImportPreviewTable rows={rows} region={region} onToggleRow={toggleRow} onChangeCategory={changeCategory} />
            <div className="flex items-center justify-between mt-5">
              <button
                onClick={startOver}
                className="text-sm font-medium text-slate dark:text-white/50 hover:text-navy dark:hover:text-white transition-colors"
              >
                Choose a different file
              </button>
              <Button
                variant="navGold"
                onClick={handleImport}
                disabled={!rows.some((r) => r.include)}
                className="h-10 px-6 disabled:opacity-50"
              >
                Import {rows.filter((r) => r.include).length} transactions
              </Button>
            </div>
          </>
        ) : (
          <>
            <UploadArea onFile={handleFile} loading={loading} />
            {fileError && <p className="text-xs text-red mt-4 text-center">{fileError}</p>}
          </>
        )}
      </div>
    </AppShell>
  )
}
