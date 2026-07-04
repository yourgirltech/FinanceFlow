import Reveal from '../Reveal'

const features = [
  {
    title: 'Budgets that adapt',
    desc: 'Set monthly limits by category and watch progress bars fill in real time — not at month-end, when it\'s too late to act.',
    icon: (
      <path d="M4 20V10M12 20V4M20 20v-7" strokeLinecap="round" strokeLinejoin="round" />
    ),
  },
  {
    title: 'Spending trends',
    desc: 'Every transaction sorted into categories automatically, charted over time so patterns show up before they become problems.',
    icon: (
      <path d="M3 17l5-5 4 4 8-9" strokeLinecap="round" strokeLinejoin="round" />
    ),
  },
  {
    title: 'AI-powered insight',
    desc: '"Food expenses are up 14% this month" — plain-language observations, not dashboards you have to interpret yourself.',
    icon: (
      <path d="M12 3v2M12 19v2M5 5l1.5 1.5M17.5 17.5L19 19M3 12h2M19 12h2M5 19l1.5-1.5M17.5 6.5L19 5M12 8a4 4 0 100 8 4 4 0 000-8z" strokeLinecap="round" strokeLinejoin="round" />
    ),
  },
  {
    title: 'One place for every account',
    desc: 'Connect current accounts, savings, and cards. Balances sync automatically so you\'re never checking five apps.',
    icon: (
      <path d="M3 8l9-5 9 5-9 5-9-5zM3 8v8l9 5 9-5V8" strokeLinecap="round" strokeLinejoin="round" />
    ),
  },
  {
    title: 'Net worth, tracked',
    desc: 'Assets minus what you owe, updated automatically. Watch the number that actually measures progress move.',
    icon: (
      <path d="M4 4v16h16M8 15l3-4 3 3 5-7" strokeLinecap="round" strokeLinejoin="round" />
    ),
  },
  {
    title: 'Bank-level encryption',
    desc: 'Your data is encrypted end to end. We can see spending patterns to help you — never your login credentials.',
    icon: (
      <path d="M12 2l7 4v6c0 5-3.5 8.5-7 10-3.5-1.5-7-5-7-10V6l7-4z" strokeLinecap="round" strokeLinejoin="round" />
    ),
  },
]

export default function Features() {
  return (
    <section id="features" className="py-24 lg:py-32 bg-white dark:bg-navy">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <Reveal className="max-w-xl mb-16">
          <span className="text-xs font-semibold tracking-wide text-gold uppercase mb-3 block">
            Everything, connected
          </span>
          <h2 className="font-display font-extrabold text-navy dark:text-white text-3xl sm:text-4xl tracking-tight mb-4">
            Money management that feels effortless
          </h2>
          <p className="text-slate dark:text-white/60 text-base leading-relaxed">
            Finance Flow is built around one idea: you shouldn't need a spreadsheet
            to understand your own money.
          </p>
        </Reveal>

        <Reveal delay={100} className="grid sm:grid-cols-2 lg:grid-cols-3 gap-px bg-line dark:bg-white/10 rounded-3xl overflow-hidden border border-line dark:border-white/10">
          {features.map((f, i) => (
            <div
              key={f.title}
              className="group bg-white dark:bg-navy p-6 sm:p-8 hover:bg-surface/60 dark:hover:bg-white/[0.04] transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-navy/5 hover:z-10 relative"
            >
              <div className="h-11 w-11 rounded-xl bg-navy dark:bg-white/10 flex items-center justify-center mb-5 transition-transform duration-300 group-hover:scale-105">
                <svg viewBox="0 0 24 24" fill="none" stroke="#C9A24B" strokeWidth="1.8" className="h-5 w-5">
                  {f.icon}
                </svg>
              </div>
              <h3 className="font-display font-bold text-navy dark:text-white text-[17px] mb-2">{f.title}</h3>
              <p className="text-slate dark:text-white/60 text-[14px] leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </Reveal>
      </div>
    </section>
  )
}
