export default function Toggle({ checked, onChange, label, description }) {
  return (
    <div className="flex items-center justify-between py-3.5 border-b border-line dark:border-white/10 last:border-0">
      <div className="pr-4">
        <p className="text-sm font-medium text-navy dark:text-white">{label}</p>
        {description && <p className="text-xs text-slate dark:text-white/40 mt-0.5">{description}</p>}
      </div>
      <button
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`relative h-6 w-11 rounded-full shrink-0 transition-colors duration-200 ${
          checked ? 'bg-emerald' : 'bg-line dark:bg-white/15'
        }`}
      >
        <span
          className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow-sm transition-transform duration-200 ${
            checked ? 'translate-x-[22px]' : 'translate-x-0.5'
          }`}
        />
      </button>
    </div>
  )
}
