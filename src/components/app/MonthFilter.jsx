import { useEffect, useRef, useState } from 'react'
import { monthLabelFromYm } from '../../lib/mockData'

export default function MonthFilter({ months, value, onChange }) {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    function onClick(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', onClick)
    return () => document.removeEventListener('mousedown', onClick)
  }, [])

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-2 h-10 rounded-xl border border-line dark:border-white/15 px-3.5 text-sm text-navy dark:text-white bg-white dark:bg-white/[0.04] hover:border-slate-light dark:hover:border-white/30 transition-colors"
      >
        <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4 text-slate dark:text-white/50">
          <rect x="3" y="4" width="18" height="17" rx="2" stroke="currentColor" strokeWidth="1.7" />
          <path d="M3 9h18M8 2v4M16 2v4" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
        </svg>
        {value === 'all' ? 'All months' : monthLabelFromYm(value)}
        <svg viewBox="0 0 12 12" className={`h-3 w-3 transition-transform ${open ? 'rotate-180' : ''}`} fill="none">
          <path d="M3 4.5l3 3 3-3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
      {open && (
        <div className="absolute left-0 mt-2 w-48 max-h-72 overflow-y-auto rounded-2xl bg-white dark:bg-navy-2 border border-line dark:border-white/10 shadow-xl py-2 z-40">
          <button
            onClick={() => { onChange('all'); setOpen(false) }}
            className={`w-full text-left px-3.5 py-2 text-sm transition-colors ${value === 'all' ? 'text-navy dark:text-white font-semibold' : 'text-slate dark:text-white/60'} hover:bg-surface dark:hover:bg-white/[0.06]`}
          >
            All months
          </button>
          {months.map((ym) => (
            <button
              key={ym}
              onClick={() => { onChange(ym); setOpen(false) }}
              className={`w-full text-left px-3.5 py-2 text-sm transition-colors ${value === ym ? 'text-navy dark:text-white font-semibold' : 'text-slate dark:text-white/60'} hover:bg-surface dark:hover:bg-white/[0.06]`}
            >
              {monthLabelFromYm(ym)}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
