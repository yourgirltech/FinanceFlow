const banks = ['GTBank', 'Access Bank', 'UBA', 'Zenith Bank', 'First Bank']

export default function TrustLogos() {
  return (
    <section className="py-12 border-y border-line dark:border-white/10 bg-white dark:bg-navy">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <p className="text-center text-xs text-slate-light dark:text-white/35 mb-7 tracking-wide">
          Works with accounts from every major Nigerian bank
        </p>
        <div className="flex flex-wrap items-center justify-center gap-x-12 gap-y-6">
          {banks.map((bank) => (
            <span
              key={bank}
              className="font-display font-bold text-lg text-navy/25 dark:text-white/25 hover:text-navy/50 dark:hover:text-white/50 transition-colors duration-300 select-none"
            >
              {bank}
            </span>
          ))}
        </div>
        <p className="text-center text-[11px] text-slate-light/70 dark:text-white/20 mt-6">
          Illustrative — shown for demonstration purposes
        </p>
      </div>
    </section>
  )
}
