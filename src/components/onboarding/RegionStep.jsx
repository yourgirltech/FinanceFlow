export default function RegionStep({ region, regions, setRegionCode }) {
  return (
    <div className="animate-fade-up">
      <h2 className="font-display font-extrabold text-navy dark:text-white text-2xl tracking-tight mb-2">
        Where are you based?
      </h2>
      <p className="text-slate dark:text-white/50 text-sm mb-8">
        This sets your currency and formats numbers the way you're used to seeing them. You can change it anytime.
      </p>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {regions.map((r) => (
          <button
            key={r.code}
            onClick={() => setRegionCode(r.code)}
            className={`flex items-center gap-2.5 rounded-xl border-2 px-3.5 py-3 text-left transition-all duration-200 ${
              r.code === region.code
                ? 'border-gold bg-gold-soft/40 dark:bg-gold/10'
                : 'border-line dark:border-white/10 hover:border-slate-light dark:hover:border-white/25'
            }`}
          >
            <span className="text-lg">{r.flag}</span>
            <span className="min-w-0">
              <span className="block text-[13px] text-navy dark:text-white font-medium truncate">{r.country}</span>
              <span className="block text-[11px] text-slate-light dark:text-white/35 font-tabular">{r.currency}</span>
            </span>
          </button>
        ))}
      </div>
    </div>
  )
}
