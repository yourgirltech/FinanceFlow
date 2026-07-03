import { useEffect, useState } from 'react'
import { parseQuickAdd } from '../../lib/quickAddParser'
import { formatMoney } from '../../lib/format'

export default function QuickAddBar({ region, onAdd, prefill }) {
  const [value, setValue] = useState('')
  const [error, setError] = useState('')
  const [shake, setShake] = useState(false)

  useEffect(() => {
    if (prefill) setValue(prefill.text)
  }, [prefill])

  const preview = value.trim() ? parseQuickAdd(value) : null
  const isValid = preview && !preview.error

  function handleSubmit(e) {
    e.preventDefault()
    const result = parseQuickAdd(value)
    if (result.error) {
      setError(result.error)
      setShake(true)
      setTimeout(() => setShake(false), 400)
      return
    }
    onAdd(result)
    setValue('')
    setError('')
  }

  return (
    <form onSubmit={handleSubmit} className="relative">
      <div
        className={`flex items-center gap-3 rounded-2xl border-2 bg-white dark:bg-white/[0.04] px-4 h-14 transition-all duration-200 ${
          shake ? 'animate-[shake_0.4s_ease-in-out]' : ''
        } ${isValid ? 'border-emerald/40' : 'border-line dark:border-white/15'} focus-within:border-gold`}
      >
        <span className="text-xl shrink-0">⚡</span>
        <input
          value={value}
          onChange={(e) => { setValue(e.target.value); setError('') }}
          placeholder='Try "Lunch 15" or "Salary 2500"…'
          autoFocus
          className="flex-1 min-w-0 bg-transparent text-[15px] text-navy dark:text-white placeholder:text-slate-light dark:placeholder:text-white/30 focus:outline-none"
        />
        {isValid && (
          <span
            className="hidden sm:flex items-center gap-2 shrink-0 text-xs px-2.5 py-1 rounded-full"
            style={{ backgroundColor: `color-mix(in oklab, ${preview.color} 14%, transparent)`, color: preview.color }}
          >
            {preview.category} · {preview.kind === 'income' ? '+' : '\u2212'}{formatMoney(preview.amount, region)}
          </span>
        )}
        <button
          type="submit"
          disabled={!isValid}
          aria-label="Add transaction"
          className="h-9 w-9 rounded-xl bg-navy dark:bg-white/10 text-gold flex items-center justify-center shrink-0 disabled:opacity-30 transition-opacity"
        >
          <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4">
            <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>
      {error && <p className="text-xs text-red mt-2 px-1">{error}</p>}
    </form>
  )
}
