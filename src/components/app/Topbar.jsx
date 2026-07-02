import ThemeToggle from '../landing/ThemeToggle'
import RegionSwitcher from '../landing/RegionSwitcher'

export default function Topbar({ title, subtitle, onMenuClick }) {
  return (
    <header className="sticky top-0 z-30 h-[72px] flex items-center justify-between px-5 lg:px-8 border-b border-line dark:border-white/10 bg-white/80 dark:bg-navy/80 backdrop-blur-md">
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          className="lg:hidden h-9 w-9 rounded-lg flex items-center justify-center text-navy dark:text-white hover:bg-surface dark:hover:bg-white/[0.06]"
          aria-label="Open menu"
        >
          <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5">
            <path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
          </svg>
        </button>
        <div>
          <h1 className="font-display font-bold text-navy dark:text-white text-lg leading-tight">{title}</h1>
          {subtitle && <p className="text-xs text-slate dark:text-white/40 mt-0.5">{subtitle}</p>}
        </div>
      </div>

      <div className="flex items-center gap-2.5">
        <RegionSwitcher />
        <ThemeToggle />
        <div className="h-9 w-9 rounded-full bg-gold/90 flex items-center justify-center text-navy text-sm font-bold font-display ml-1">
          F
        </div>
      </div>
    </header>
  )
}
