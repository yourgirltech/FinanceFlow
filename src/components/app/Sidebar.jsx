import { NavLink } from 'react-router-dom'
import Logo from '../landing/Logo'
import { useTheme } from '../../lib/ThemeContext'

const navItems = [
  {
    to: '/dashboard',
    label: 'Dashboard',
    icon: (
      <path d="M4 13h6V4H4v9zm0 7h6v-5H4v5zm10 0h6V11h-6v9zm0-16v5h6V4h-6z" strokeLinecap="round" strokeLinejoin="round" />
    ),
  },
  {
    to: '/transactions',
    label: 'Transactions',
    icon: (
      <path d="M7 8h10M7 8l3-3M7 8l3 3M17 16H7M17 16l-3-3M17 16l-3 3" strokeLinecap="round" strokeLinejoin="round" />
    ),
  },
  {
    to: '/budget',
    label: 'Budget',
    icon: (
      <path d="M12 3a9 9 0 100 18 9 9 0 000-18zM12 3v9l6.5 3.5" strokeLinecap="round" strokeLinejoin="round" />
    ),
  },
  {
    to: '/analytics',
    label: 'Analytics',
    icon: (
      <path d="M4 19V9M11 19V4M18 19v-7" strokeLinecap="round" strokeLinejoin="round" />
    ),
  },
  {
    to: '/settings',
    label: 'Settings',
    icon: (
      <>
        <circle cx="12" cy="12" r="3" strokeLinecap="round" strokeLinejoin="round" />
        <path
          d="M19.4 15a1.7 1.7 0 00.34 1.87l.06.06a2 2 0 11-2.83 2.83l-.06-.06a1.7 1.7 0 00-1.87-.34 1.7 1.7 0 00-1 1.55V21a2 2 0 11-4 0v-.09a1.7 1.7 0 00-1-1.55 1.7 1.7 0 00-1.87.34l-.06.06a2 2 0 11-2.83-2.83l.06-.06a1.7 1.7 0 00.34-1.87 1.7 1.7 0 00-1.55-1H3a2 2 0 110-4h.09a1.7 1.7 0 001.55-1 1.7 1.7 0 00-.34-1.87l-.06-.06a2 2 0 112.83-2.83l.06.06a1.7 1.7 0 001.87.34H9a1.7 1.7 0 001-1.55V3a2 2 0 114 0v.09a1.7 1.7 0 001 1.55 1.7 1.7 0 001.87-.34l.06-.06a2 2 0 112.83 2.83l-.06.06a1.7 1.7 0 00-.34 1.87V9a1.7 1.7 0 001.55 1H21a2 2 0 110 4h-.09a1.7 1.7 0 00-1.55 1z"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </>
    ),
  },
]

export default function Sidebar({ open, onClose }) {
  const { dark } = useTheme()

  return (
    <>
      {open && (
        <div
          className="fixed inset-0 bg-navy/40 backdrop-blur-sm z-40 lg:hidden"
          onClick={onClose}
        />
      )}
      <aside
        className={`fixed lg:sticky top-0 left-0 h-screen w-64 shrink-0 bg-white dark:bg-navy border-r border-line dark:border-white/10 flex flex-col z-50 transition-transform duration-300 ${
          open ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="h-[72px] flex items-center px-6 border-b border-line dark:border-white/10">
          <Logo dark={dark} />
        </div>

        <nav className="flex-1 px-3 py-6 space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-colors duration-200 ${
                  isActive
                    ? 'bg-navy text-gold dark:bg-white/10 dark:text-gold'
                    : 'text-slate dark:text-white/60 hover:bg-surface dark:hover:bg-white/[0.06] hover:text-navy dark:hover:text-white'
                }`
              }
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-[18px] w-[18px] shrink-0">
                {item.icon}
              </svg>
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="p-3 border-t border-line dark:border-white/10">
          <NavLink
            to="/"
            className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium text-slate dark:text-white/60 hover:bg-surface dark:hover:bg-white/[0.06] hover:text-navy dark:hover:text-white transition-colors duration-200"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-[18px] w-[18px]">
              <path d="M15 3H5a2 2 0 00-2 2v14a2 2 0 002 2h10M10 17l5-5-5-5M15 12H3" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Log out
          </NavLink>
        </div>
      </aside>
    </>
  )
}
