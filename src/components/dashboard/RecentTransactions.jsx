import { Link } from 'react-router-dom'
import { formatMoney } from '../../lib/format'
import { useRegion } from '../../lib/RegionContext'

export default function RecentTransactions({ transactions }) {
  const { region } = useRegion()

  return (
    <div className="rounded-2xl bg-white dark:bg-white/[0.04] border border-line dark:border-white/10 p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-display font-bold text-navy dark:text-white text-sm">Recent transactions</h3>
        <Link to="/transactions" className="text-xs font-medium text-gold hover:underline">
          View all
        </Link>
      </div>
      <div className="space-y-1">
        {transactions.slice(0, 5).map((t) => (
          <div
            key={t.id}
            className="grid grid-cols-[44px_1fr_auto] items-center gap-3 py-2.5 border-b border-line dark:border-white/10 last:border-0"
          >
            <span
              className="h-9 w-9 rounded-full flex items-center justify-center text-[11px] font-semibold"
              style={{ backgroundColor: `color-mix(in oklab, ${t.color} 16%, transparent)`, color: t.color }}
            >
              {t.category.slice(0, 2).toUpperCase()}
            </span>
            <div className="min-w-0">
              <p className="text-[13.5px] text-navy dark:text-white font-medium truncate">{t.description}</p>
              <p className="text-[11.5px] text-slate-light dark:text-white/35">{t.category} · {t.date}</p>
            </div>
            <span
              className={`text-[13.5px] font-tabular font-semibold ${
                t.kind === 'income' ? 'text-emerald' : 'text-navy/80 dark:text-white/80'
              }`}
            >
              {t.kind === 'income' ? '+' : '\u2212'}{formatMoney(t.amount, region)}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
