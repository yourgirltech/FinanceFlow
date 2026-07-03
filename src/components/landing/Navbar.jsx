import { useEffect, useState } from 'react'
import Logo from './Logo'
import Button from '../ui/Button'
import ThemeToggle from './ThemeToggle'
import RegionSwitcher from './RegionSwitcher'
import { useTheme } from '../../lib/ThemeContext'

const links = [
  { label: 'Features', href: '#features' },
  { label: 'Pricing', href: '#pricing', badge: 'Soon' },
  { label: 'About', href: '#about' },
  { label: 'Contact', href: '#contact' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const { dark } = useTheme()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
        scrolled || menuOpen
          ? 'bg-white/90 dark:bg-navy/90 backdrop-blur-md border-b border-line dark:border-white/10 shadow-[0_1px_16px_rgba(11,18,32,0.06)]'
          : 'bg-transparent'
      }`}
    >
      <nav className="max-w-7xl mx-auto flex items-center justify-between px-5 sm:px-6 lg:px-8 h-[64px] sm:h-[72px]">
        <Logo dark={dark} />

        <div className="hidden md:flex items-center gap-8">
          {links.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="relative flex items-center gap-1.5 text-sm font-medium text-slate dark:text-white/60 hover:text-navy dark:hover:text-white transition-colors"
            >
              {link.label}
              {link.badge && (
                <span className="text-[9px] font-semibold uppercase tracking-wide text-gold bg-gold-soft dark:bg-gold/15 rounded-full px-1.5 py-0.5">
                  {link.badge}
                </span>
              )}
            </a>
          ))}
        </div>

        {/* Desktop actions */}
        <div className="hidden md:flex items-center gap-2.5">
          <RegionSwitcher />
          <ThemeToggle />
          <Button to="/login" variant="ghost" className="px-4">
            Log in
          </Button>
          <Button to="/signup" variant="navGold">
            Get Started
          </Button>
        </div>

        {/* Mobile: just the essentials + a menu toggle */}
        <div className="flex md:hidden items-center gap-2">
          <ThemeToggle />
          <button
            onClick={() => setMenuOpen((o) => !o)}
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={menuOpen}
            className="h-9 w-9 rounded-lg flex items-center justify-center text-navy dark:text-white hover:bg-surface dark:hover:bg-white/[0.06] transition-colors"
          >
            <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5">
              {menuOpen ? (
                <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
              ) : (
                <path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
              )}
            </svg>
          </button>
        </div>
      </nav>

      {/* Mobile menu panel */}
      <div
        className={`md:hidden overflow-hidden transition-[max-height,opacity] duration-300 ease-in-out ${
          menuOpen ? 'max-h-[420px] opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="px-5 pb-6 pt-2 border-t border-line dark:border-white/10 bg-white dark:bg-navy">
          <div className="flex flex-col gap-1 mb-4">
            {links.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className="flex items-center gap-2 py-2.5 text-sm font-medium text-navy dark:text-white/80"
              >
                {link.label}
                {link.badge && (
                  <span className="text-[9px] font-semibold uppercase tracking-wide text-gold bg-gold-soft dark:bg-gold/15 rounded-full px-1.5 py-0.5">
                    {link.badge}
                  </span>
                )}
              </a>
            ))}
          </div>

          <div className="flex items-center justify-between py-3 border-t border-line dark:border-white/10">
            <span className="text-xs text-slate-light dark:text-white/35">Region &amp; currency</span>
            <RegionSwitcher />
          </div>

          <div className="flex flex-col gap-2.5 pt-3 border-t border-line dark:border-white/10">
            <Button to="/login" variant="secondary" className="w-full">
              Log in
            </Button>
            <Button to="/signup" variant="navGold" className="w-full">
              Get Started
            </Button>
          </div>
        </div>
      </div>
    </header>
  )
}
