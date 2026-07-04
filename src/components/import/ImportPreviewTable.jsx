import { formatMoney } from '../../lib/format'
import { CATEGORIES } from '../../lib/mockData'

function CategorySelect({ row, onChangeCategory, className = '' }) {
  return (
    <select
      value={row.category}
      onChange={(e) => onChangeCategory(row.id, e.target.value)}
      disabled={!row.include}
      className={`h-8 rounded-lg border border-line dark:border-white/15 bg-white dark:bg-white/[0.04] px-2 text-[12px] text-navy dark:text-white focus:outline-none focus:border-gold [color-scheme:light] dark:[color-scheme:dark] ${className}`}
    >
      {CATEGORIES.map((c) => (
        <option key={c.name} value={c.name} className="bg-white text-navy dark:bg-navy-2 dark:text-white">
          {c.name}
        </option>
      ))}
    </select>
  )
}

export default function ImportPreviewTable({ rows, region, onToggleRow, onChangeCategory }) {
  const includedCount = rows.filter((r) => r.include).length

  return (
    <div className="rounded-2xl bg-white dark:bg-white/[0.04] border border-line dark:border-white/10 overflow-hidden">
      <div className="flex items-center justify-between px-4 sm:px-5 py-3 border-b border-line dark:border-white/10 bg-surface/50 dark:bg-white/[0.02]">
        <span className="text-[11px] font-semibold uppercase tracking-wide text-slate-light dark:text-white/35">
          {includedCount} of {rows.length} selected
        </span>
      </div>
      <div className="max-h-[420px] overflow-y-auto">
        {rows.map((row) => (
          <div
            key={row.id}
            className={`border-b border-line dark:border-white/10 last:border-0 transition-opacity ${
              row.include ? '' : 'opacity-40'
            }`}
          >
            {/* Mobile: stacked two-line card */}
            <div className="sm:hidden px-4 py-3 space-y-2">
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={row.include}
                  onChange={() => onToggleRow(row.id)}
                  className="h-4 w-4 accent-gold cursor-pointer shrink-0"
                />
                <span className="flex-1 min-w-0 text-[13px] text-navy dark:text-white truncate">{row.description}</span>
                <span
                  className={`shrink-0 text-[12.5px] font-tabular font-semibold ${
                    row.kind === 'income' ? 'text-emerald' : 'text-navy/80 dark:text-white/80'
                  }`}
                >
                  {row.kind === 'income' ? '+' : '\u2212'}{formatMoney(row.amount, region)}
                </span>
              </div>
              <div className="flex items-center gap-2 pl-7">
                <span className="text-[11px] text-slate-light dark:text-white/40 font-tabular shrink-0">{row.date}</span>
                <CategorySelect row={row} onChangeCategory={onChangeCategory} className="flex-1 min-w-0" />
              </div>
            </div>

            {/* Desktop: single-row grid */}
            <div className="hidden sm:grid grid-cols-[28px_90px_1fr_150px_110px] items-center gap-3 px-5 py-2.5">
              <input
                type="checkbox"
                checked={row.include}
                onChange={() => onToggleRow(row.id)}
                className="h-4 w-4 accent-gold cursor-pointer"
              />
              <span className="text-[11.5px] text-slate-light dark:text-white/40 font-tabular">{row.date}</span>
              <span className="text-[13px] text-navy dark:text-white truncate">{row.description}</span>
              <CategorySelect row={row} onChangeCategory={onChangeCategory} />
              <span
                className={`text-[12.5px] font-tabular font-semibold text-right ${
                  row.kind === 'income' ? 'text-emerald' : 'text-navy/80 dark:text-white/80'
                }`}
              >
                {row.kind === 'income' ? '+' : '\u2212'}{formatMoney(row.amount, region)}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
