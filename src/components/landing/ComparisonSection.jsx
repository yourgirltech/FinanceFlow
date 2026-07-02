import Reveal from '../Reveal'

const rows = [
  { without: 'Guess where your money went', withFF: 'Know exactly where it went' },
  { without: 'Overspend every month', withFF: 'Stay within budget' },
  { without: 'No savings goals', withFF: 'Track progress automatically' },
  { without: 'Five apps, five logins', withFF: 'One place for every account' },
]

function Cross() {
  return (
    <svg viewBox="0 0 16 16" className="h-4 w-4 shrink-0" fill="none">
      <path d="M4 4l8 8M12 4l-8 8" stroke="#E5484D" strokeWidth="1.7" strokeLinecap="round" />
    </svg>
  )
}

function Check() {
  return (
    <svg viewBox="0 0 16 16" className="h-4 w-4 shrink-0" fill="none">
      <path d="M3 8.5l3.2 3.2L13 5" stroke="#0FA968" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export default function ComparisonSection() {
  return (
    <section className="py-24 lg:py-28 bg-white dark:bg-navy">
      <div className="max-w-5xl mx-auto px-6 lg:px-8">
        <div className="text-center max-w-lg mx-auto mb-14">
          <span className="text-xs font-semibold tracking-wide text-gold uppercase mb-3 block">
            Why it matters
          </span>
          <h2 className="font-display font-extrabold text-navy dark:text-white text-3xl sm:text-4xl tracking-tight">
            The difference is what you know
          </h2>
        </div>

        <Reveal delay={100} className="grid sm:grid-cols-2 rounded-3xl overflow-hidden border border-line dark:border-white/10">
          <div className="bg-surface/60 dark:bg-white/[0.02] p-8 sm:p-10">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-light dark:text-white/35 mb-6">
              Without Finance Flow
            </p>
            <ul className="space-y-5">
              {rows.map((r) => (
                <li key={r.without} className="flex items-center gap-3">
                  <Cross />
                  <span className="text-[15px] text-navy/60 dark:text-white/50">{r.without}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="bg-white dark:bg-white/[0.05] p-8 sm:p-10 relative">
            <div className="absolute inset-0 border-l border-line dark:border-white/10 hidden sm:block" />
            <p className="text-xs font-semibold uppercase tracking-wide text-emerald mb-6">
              With Finance Flow
            </p>
            <ul className="space-y-5">
              {rows.map((r) => (
                <li key={r.withFF} className="flex items-center gap-3">
                  <Check />
                  <span className="text-[15px] text-navy dark:text-white font-medium">{r.withFF}</span>
                </li>
              ))}
            </ul>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
