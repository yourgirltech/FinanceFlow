import { useRegion } from '../../lib/RegionContext'
import { formatMoney } from '../../lib/format'

const rowTemplates = [
  { date: 'Jun 28', category: 'Salary', desc: 'Monthly payroll', tone: 'up', factor: 0.5 },
  { date: 'Jun 27', category: 'Transport', desc: 'Ride to work', tone: 'down', factor: 0.02 },
  { date: 'Jun 25', category: 'Groceries', desc: 'Weekly grocery run', tone: 'down', factor: 0.08 },
  { date: 'Jun 24', category: 'Subscriptions', desc: 'Streaming service', tone: 'down', factor: 0.01 },
]

export default function ShowcaseSection() {
  const { region } = useRegion()
  const base = region.sample.balance * 0.02
  const rows = rowTemplates.map((r) => ({
    ...r,
    amount: `${r.tone === 'up' ? '+' : '\u2212'}${formatMoney(base * (r.factor / 0.02), region)}`,
  }))

  return (
    <section id="showcase" className="py-24 lg:py-32 bg-surface/50 dark:bg-white/[0.02]">
      <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <span className="text-xs font-semibold tracking-wide text-gold uppercase mb-3 block">
              How it works
            </span>
            <h2 className="font-display font-extrabold text-navy dark:text-white text-3xl sm:text-4xl tracking-tight mb-5">
              Every transaction, sorted the moment it happens
            </h2>
            <p className="text-slate dark:text-white/60 text-base leading-relaxed mb-8 max-w-md">
              Connect an account once. From there, Finance Flow labels, categorises,
              and files every transaction automatically — searchable and filterable
              the second it lands.
            </p>
            <ul className="space-y-4">
              {[
                'Search and filter by category, date, or amount',
                'Automatic categorisation, editable in one tap',
                'Recurring subscriptions flagged for you',
              ].map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <span className="mt-1 h-4 w-4 rounded-full bg-emerald-soft flex items-center justify-center shrink-0">
                    <svg viewBox="0 0 12 12" className="h-2.5 w-2.5" fill="none">
                      <path d="M2 6l2.5 2.5L10 3" stroke="#0FA968" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </span>
                  <span className="text-[15px] text-navy/80 dark:text-white/70">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="relative">
            <div className="absolute -inset-6 bg-gradient-to-br from-navy/5 to-transparent rounded-[32px] -z-10" />
            <div className="rounded-2xl bg-white dark:bg-white/[0.04] border border-line dark:border-white/10 shadow-2xl shadow-navy/10 overflow-hidden transition-transform duration-500 hover:-translate-y-1.5 hover:shadow-navy/15">
              <div className="flex items-center gap-1.5 px-4 py-3 border-b border-line dark:border-white/10 bg-surface/60 dark:bg-white/[0.03] min-w-0">
                <span className="h-2.5 w-2.5 rounded-full bg-red/60 shrink-0" />
                <span className="h-2.5 w-2.5 rounded-full bg-gold/60 shrink-0" />
                <span className="h-2.5 w-2.5 rounded-full bg-emerald/60 shrink-0" />
                <span className="ml-3 text-[11px] text-slate-light dark:text-white/30 font-tabular truncate min-w-0">app.financeflow.ng/transactions</span>
              </div>
              <div className="p-5">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-display font-bold text-navy dark:text-white text-sm">Recent transactions</h3>
                  <span className="text-[11px] text-slate-light dark:text-white/30">Last 7 days</span>
                </div>
                <div className="space-y-1">
                  {rows.map((r) => (
                    <div
                      key={r.desc}
                      className="grid grid-cols-[52px_1fr_auto] items-center gap-3 py-2.5 border-b border-line dark:border-white/10 last:border-0"
                    >
                      <span className="text-[11px] text-slate-light dark:text-white/30 font-tabular">{r.date}</span>
                      <div>
                        <p className="text-[13px] text-navy dark:text-white font-medium leading-tight">{r.desc}</p>
                        <p className="text-[11px] text-slate-light dark:text-white/30">{r.category}</p>
                      </div>
                      <span
                        className={`text-[13px] font-tabular font-semibold ${
                          r.tone === 'up' ? 'text-emerald' : 'text-navy/70 dark:text-white/70'
                        }`}
                      >
                        {r.amount}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
