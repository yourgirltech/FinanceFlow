export default function PricingTeaser() {
  return (
    <section id="pricing" className="py-20 bg-surface/50 dark:bg-white/[0.02] border-y border-line dark:border-white/10">
      <div className="max-w-2xl mx-auto px-5 sm:px-6 text-center">
        <span className="inline-block text-[11px] font-semibold uppercase tracking-wide text-gold bg-gold-soft dark:bg-gold/15 rounded-full px-3 py-1 mb-5">
          Coming soon
        </span>
        <h2 className="font-display font-extrabold text-navy dark:text-white text-2xl sm:text-3xl tracking-tight mb-3">
          Pricing plans are on the way
        </h2>
        <p className="text-slate dark:text-white/60 text-[15px] max-w-md mx-auto">
          Finance Flow is free while we're in early access. We'll announce simple,
          transparent pricing here as soon as it's ready — no surprises.
        </p>
      </div>
    </section>
  )
}
