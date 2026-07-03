import { formatMoney } from '../../lib/format'

export default function QuickAddFeed({ entries, region, onClear }) {
  if (entries.length === 0) {
    return (
      <div className="text-center py-16">
        <p className="text-3xl mb-3">💬</p>
        <p className="text-sm text-slate dark:text-white/40">
          Nothing added yet — type something above, like "Netflix 18".
        </p>
      </div>
    )
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-3 px-1">
        <span className="text-xs text-slate-light dark:text-white/35">
          {entries.length} added just now
        </span>
        <button
          onClick={onClear}
          className="text-xs text-slate-light dark:text-white/35 hover:text-navy dark:hover:text-white transition-colors"
        >
          Clear feed
        </button>
      </div>

      <div className="space-y-2.5">
        {entries.map((t) => (
          <div
            key={t.id}
            className="flex items-center gap-3 rounded-xl bg-white dark:bg-white/[0.04] border border-line dark:border-white/10 px-4 py-3 animate-fade-up"
            style={{ animationDuration: '0.4s' }}
          >
            <span
              className="h-9 w-9 rounded-full flex items-center justify-center text-[11px] font-semibold shrink-0"
              style={{ backgroundColor: `color-mix(in oklab, ${t.color} 16%, transparent)`, color: t.color }}
            >
              {t.category.slice(0, 2).toUpperCase()}
            </span>
            <div className="flex-1 min-w-0">
              <p className="text-[13.5px] text-navy dark:text-white font-medium truncate">{t.description}</p>
              <p className="text-[11.5px] text-slate-light dark:text-white/35">{t.category} · just now</p>
            </div>
            <span
              className={`text-[13.5px] font-tabular font-semibold shrink-0 ${
                t.kind === 'income' ? 'text-emerald' : 'text-navy/80 dark:text-white/80'
              }`}
            >
              {t.kind === 'income' ? '+' : '\u2212'}{formatMoney(t.amount, region)}
            </span>
            <svg viewBox="0 0 16 16" className="h-4 w-4 text-emerald shrink-0" fill="none">
              <circle cx="8" cy="8" r="7" fill="var(--color-emerald-soft)" />
              <path d="M5 8.5l2 2 4-4.5" stroke="var(--color-emerald)" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        ))}
      </div>
    </div>
  )
}
