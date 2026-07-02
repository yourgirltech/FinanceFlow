import { useEffect, useRef, useState } from 'react'
import { useRegion } from '../../lib/RegionContext'

export default function RegionSwitcher() {
  const { region, setRegionCode, regions } = useRegion()
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
        aria-label="Choose region and currency"
        aria-expanded={open}
        className="flex items-center gap-1.5 h-9 rounded-full border border-line dark:border-white/15 px-3 text-sm text-slate dark:text-white/70 hover:text-navy dark:hover:text-white transition-colors duration-200"
      >
        <span>{region.flag}</span>
        <span className="font-tabular text-xs">{region.currency}</span>
        <svg viewBox="0 0 12 12" className={`h-3 w-3 transition-transform duration-200 ${open ? 'rotate-180' : ''}`} fill="none">
          <path d="M3 4.5l3 3 3-3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-white dark:bg-navy-2 border border-line dark:border-white/10 shadow-xl py-2 z-50">
          <p className="px-3.5 pt-1 pb-2 text-[11px] font-semibold uppercase tracking-wide text-slate-light dark:text-white/35">
            Region &amp; currency
          </p>
          {regions.map((r) => (
            <button
              key={r.code}
              onClick={() => {
                setRegionCode(r.code)
                setOpen(false)
              }}
              className={`w-full flex items-center justify-between px-3.5 py-2 text-left text-sm transition-colors duration-150 ${
                r.code === region.code
                  ? 'text-navy dark:text-white font-semibold'
                  : 'text-slate dark:text-white/60 hover:text-navy dark:hover:text-white'
              } hover:bg-surface dark:hover:bg-white/[0.06]`}
            >
              <span className="flex items-center gap-2.5">
                <span>{r.flag}</span>
                <span>{r.country}</span>
              </span>
              <span className="font-tabular text-xs text-slate-light dark:text-white/35">{r.currency}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
