import { useState, useRef, useEffect } from 'react'

export default function CategoryFilter({ categories, value, onChange }) {
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
          <path d="M4 6h16M7 12h10M10 18h4" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
        </svg>
        {value === 'all' ? 'All categories' : value}
        <svg viewBox="0 0 12 12" className={`h-3 w-3 transition-transform ${open ? 'rotate-180' : ''}`} fill="none">
          <path d="M3 4.5l3 3 3-3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
      {open && (
        <div className="absolute left-0 mt-2 w-52 max-h-72 overflow-y-auto rounded-2xl bg-white dark:bg-navy-2 border border-line dark:border-white/10 shadow-xl py-2 z-40">
          <button
            onClick={() => { onChange('all'); setOpen(false) }}
            className={`w-full text-left px-3.5 py-2 text-sm transition-colors ${value === 'all' ? 'text-navy dark:text-white font-semibold' : 'text-slate dark:text-white/60'} hover:bg-surface dark:hover:bg-white/[0.06]`}
          >
            All categories
          </button>
          {categories.map((c) => (
            <button
              key={c.name}
              onClick={() => { onChange(c.name); setOpen(false) }}
              className={`w-full flex items-center gap-2.5 text-left px-3.5 py-2 text-sm transition-colors ${value === c.name ? 'text-navy dark:text-white font-semibold' : 'text-slate dark:text-white/60'} hover:bg-surface dark:hover:bg-white/[0.06]`}
            >
              <span className="h-2 w-2 rounded-full shrink-0" style={{ backgroundColor: c.color }} />
              {c.name}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
