const insights = [
  {
    label: 'Spotted a trend',
    text: 'Your food expenses increased by 14% this month, mostly on weekends.',
  },
  {
    label: 'Goal projection',
    text: 'Save ₦20,000 more each month and you\'ll reach your goal in 6 months.',
  },
  {
    label: 'Heads up',
    text: 'You have 3 subscriptions totalling ₦12,600/month you haven\'t opened in 60 days.',
  },
]

export default function InsightSection() {
  return (
    <section id="insights" className="py-24 lg:py-32 bg-navy relative overflow-hidden">
      <div className="absolute inset-0 -z-10 opacity-[0.07]" style={{
        backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)',
        backgroundSize: '28px 28px',
      }} />
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-emerald/10 blur-[140px] rounded-full -z-10" />

      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="max-w-xl mb-14">
          <span className="text-xs font-semibold tracking-wide text-gold uppercase mb-3 block">
            Beyond the numbers
          </span>
          <h2 className="font-display font-extrabold text-white text-3xl sm:text-4xl tracking-tight mb-4">
            Insight that reads like a friend, not a report
          </h2>
          <p className="text-white/60 text-base leading-relaxed">
            Finance Flow doesn't just show you charts. It tells you, in plain
            language, what's changed and what to do about it.
          </p>
        </div>

        <div className="grid sm:grid-cols-3 gap-5">
          {insights.map((insight) => (
            <div
              key={insight.label}
              className="rounded-2xl bg-white/[0.04] border border-white/10 p-6 hover:bg-white/[0.07] transition-colors duration-300"
            >
              <span className="text-[11px] font-medium text-gold uppercase tracking-wide mb-4 block">
                {insight.label}
              </span>
              <p className="text-white text-[15px] leading-relaxed">{insight.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
