export default function MonthPicker({ label, onPrev, onNext, canGoNext = true }) {
  return (
    <div className="inline-flex items-center gap-0.5 rounded-xl border border-line dark:border-white/15 bg-white dark:bg-white/[0.04] px-1.5 py-1.5">
      <button
        onClick={onPrev}
        aria-label="Previous month"
        className="h-7 w-7 rounded-lg flex items-center justify-center text-slate dark:text-white/50 hover:bg-surface dark:hover:bg-white/[0.08] hover:text-navy dark:hover:text-white transition-colors"
      >
        <svg viewBox="0 0 12 12" className="h-3.5 w-3.5" fill="none">
          <path d="M7.5 3L4.5 6l3 3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
      <span className="text-xs font-medium text-navy dark:text-white font-tabular px-2 min-w-[112px] text-center">
        {label}
      </span>
      <button
        onClick={onNext}
        disabled={!canGoNext}
        aria-label="Next month"
        className="h-7 w-7 rounded-lg flex items-center justify-center text-slate dark:text-white/50 hover:bg-surface dark:hover:bg-white/[0.08] hover:text-navy dark:hover:text-white disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
      >
        <svg viewBox="0 0 12 12" className="h-3.5 w-3.5" fill="none">
          <path d="M4.5 3l3 3-3 3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
    </div>
  )
}
