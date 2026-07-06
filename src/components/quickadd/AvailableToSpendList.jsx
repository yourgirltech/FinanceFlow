import { formatMoney } from '../../lib/format'

export default function AvailableToSpendList({ byCategory, region }) {
  const budgeted = byCategory.filter((b) => b.total > 0)

  if (budgeted.length === 0) {
    return (
      <p className="text-xs text-slate-light dark:text-white/35 mb-6 px-1">
        No budgets set yet — set one on the Budget page to see what's available to spend per category here.
      </p>
    )
  }

  return (
    <div className="rounded-2xl bg-white dark:bg-white/[0.04] border border-line dark:border-white/10 p-4 mb-6">
      <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-light dark:text-white/35 mb-3 px-1">
        Available to spend
      </p>
      <div className="grid sm:grid-cols-2 gap-2">
        {budgeted.map((b) => {
          const over = b.spent > b.total
          return (
            <div
              key={b.category}
              className="flex items-center justify-between gap-2 rounded-xl bg-surface/60 dark:bg-white/[0.03] px-3 py-2"
            >
              <span className="flex items-center gap-2 min-w-0">
                <span className="h-2 w-2 rounded-full shrink-0" style={{ backgroundColor: b.color }} />
                <span className="text-[13px] text-navy dark:text-white truncate">{b.category}</span>
              </span>
              <span className={`text-[12.5px] font-tabular font-semibold shrink-0 ${over ? 'text-red' : 'text-emerald'}`}>
                {over ? `${formatMoney(b.spent - b.total, region)} over` : formatMoney(b.remaining, region)}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
