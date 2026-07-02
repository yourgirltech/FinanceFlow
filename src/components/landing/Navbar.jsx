import { useEffect, useState } from 'react'
import Logo from './Logo'
import Button from '../ui/Button'
import ThemeToggle from './ThemeToggle'
import { useTheme } from '../../lib/ThemeContext'

const links = [
  { label: 'Features', href: '#features' },
  { label: 'Pricing', href: '#pricing', badge: 'Soon' },
  { label: 'About', href: '#about' },
  { label: 'Contact', href: '#contact' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const { dark } = useTheme()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-white/80 dark:bg-navy/80 backdrop-blur-md border-b border-line dark:border-white/10 shadow-[0_1px_16px_rgba(11,18,32,0.06)]'
          : 'bg-transparent'
      }`}
    >
      <nav className="max-w-7xl mx-auto flex items-center justify-between px-6 lg:px-8 h-[72px]">
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
        <div className="flex items-center gap-3">
          <ThemeToggle />
          <Button to="/login" variant="ghost" className="hidden sm:inline-flex px-4">
            Log in
          </Button>
          <Button to="/signup" variant="navGold">
            Get Started
          </Button>
        </div>
      </nav>
    </header>
  )
}
