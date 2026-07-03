export default function SelectCard({ icon, title, description, badge, selected, disabled, onClick }) {
  return (
    <button
      type="button"
      onClick={disabled ? undefined : onClick}
      disabled={disabled}
      className={`relative text-left rounded-2xl border-2 p-5 transition-all duration-200 ${
        disabled
          ? 'border-line dark:border-white/10 opacity-50 cursor-not-allowed'
          : selected
          ? 'border-gold bg-gold-soft/40 dark:bg-gold/10 -translate-y-0.5 shadow-lg shadow-navy/5'
          : 'border-line dark:border-white/10 hover:border-slate-light dark:hover:border-white/25 hover:-translate-y-0.5'
      }`}
    >
      {badge && (
        <span
          className={`absolute top-4 right-4 text-[10px] font-semibold uppercase tracking-wide rounded-full px-2 py-1 ${
            badge === 'Coming Soon'
              ? 'bg-surface dark:bg-white/10 text-slate-light dark:text-white/40'
              : 'bg-gold-soft dark:bg-gold/15 text-gold'
          }`}
        >
          {badge}
        </span>
      )}
      <div className="text-2xl mb-3">{icon}</div>
      <h3 className="font-display font-bold text-navy dark:text-white text-[15px] mb-1.5">{title}</h3>
      <p className="text-[13px] text-slate dark:text-white/50 leading-relaxed">{description}</p>

      {selected && !disabled && (
        <span className="absolute -top-2 -right-2 h-6 w-6 rounded-full bg-gold flex items-center justify-center shadow-md">
          <svg viewBox="0 0 12 12" className="h-3 w-3" fill="none">
            <path d="M2 6l2.5 2.5L10 3" stroke="var(--color-navy)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
      )}
    </button>
  )
}
