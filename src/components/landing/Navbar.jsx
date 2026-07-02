import { useEffect, useState } from 'react'
import Logo from './Logo'
import Button from '../ui/Button'

const links = [
  { label: 'Features', href: '#features' },
  { label: 'How it works', href: '#showcase' },
  { label: 'Insights', href: '#insights' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-white/80 backdrop-blur-md border-b border-line' : 'bg-transparent'
      }`}
    >
      <nav className="max-w-7xl mx-auto flex items-center justify-between px-6 lg:px-8 h-[72px]">
        <Logo />
        <div className="hidden md:flex items-center gap-8">
          {links.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="text-sm font-medium text-slate hover:text-navy transition-colors"
            >
              {link.label}
            </a>
          ))}
        </div>
        <div className="flex items-center gap-3">
          <Button to="/login" variant="ghost" className="hidden sm:inline-flex px-4">
            Log in
          </Button>
          <Button to="/signup" variant="primary">
            Get started
          </Button>
        </div>
      </nav>
    </header>
  )
}
