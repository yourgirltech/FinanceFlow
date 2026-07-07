import { useNavigate } from 'react-router-dom'
import Logo from '../landing/Logo'
import ThemeToggle from '../landing/ThemeToggle'
import RegionSwitcher from '../landing/RegionSwitcher'
import { useTheme } from '../../lib/ThemeContext'
import { useAuth } from '../../lib/AuthContext'


export default function Topbar({ onMenuClick }) {
  const { dark } = useTheme()
  const { user } = useAuth()
  const navigate = useNavigate()
  const displayName = user?.user_metadata?.full_name || user?.email || 'F'
  const initial = displayName.trim().charAt(0).toUpperCase() || 'F'

  return (
    <header className="sticky top-0 z-30 h-14 sm:h-16 flex items-center justify-between gap-3 px-4 sm:px-5 lg:px-8 border-b border-line dark:border-white/10 bg-white/80 dark:bg-navy/80 backdrop-blur-md">
      <div className="flex items-center gap-3 min-w-0">
        <button
          onClick={onMenuClick}
          className="lg:hidden h-9 w-9 shrink-0 rounded-lg flex items-center justify-center text-navy dark:text-white hover:bg-surface dark:hover:bg-white/[0.06]"
          aria-label="Open menu"
        >
          <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5">
            <path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
          </svg>
        </button>
        <div className="lg:hidden">
          <Logo dark={dark} />
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
        <div className="hidden sm:block">
          <RegionSwitcher />
        </div>
        <ThemeToggle />
        <button
          onClick={() => navigate('/settings')}
          aria-label="Go to Settings"
          title="Settings"
          className="h-8 w-8 sm:h-9 sm:w-9 shrink-0 rounded-full bg-gold/90 hover:bg-gold flex items-center justify-center text-navy text-xs sm:text-sm font-bold font-display transition-colors"
        >
          {initial}
        </button>
      </div>
    </header>
  )
}
