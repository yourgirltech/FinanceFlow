import { useTheme } from '../../lib/ThemeContext'

export default function ThemeToggle() {
  const { dark, toggle } = useTheme()

  return (
    <button
      onClick={toggle}
      aria-label={dark ? 'Switch to light mode' : 'Switch to dark mode'}
      className="relative h-9 w-9 rounded-full flex items-center justify-center border border-line dark:border-white/15 text-slate dark:text-white/70 hover:text-navy dark:hover:text-white transition-colors duration-200"
    >
      <svg
        viewBox="0 0 24 24"
        fill="none"
        className={`h-[18px] w-[18px] absolute transition-all duration-300 ${
          dark ? 'opacity-0 -rotate-90 scale-50' : 'opacity-100 rotate-0 scale-100'
        }`}
      >
        <circle cx="12" cy="12" r="4.5" stroke="currentColor" strokeWidth="1.6" />
        <path
          d="M12 2v2.5M12 19.5V22M4.2 4.2l1.8 1.8M18 18l1.8 1.8M2 12h2.5M19.5 12H22M4.2 19.8L6 18M18 6l1.8-1.8"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
        />
      </svg>
      <svg
        viewBox="0 0 24 24"
        fill="none"
        className={`h-[18px] w-[18px] absolute transition-all duration-300 ${
          dark ? 'opacity-100 rotate-0 scale-100' : 'opacity-0 rotate-90 scale-50'
        }`}
      >
        <path
          d="M20 14.5A8.5 8.5 0 019.5 4a8.5 8.5 0 1010.5 10.5z"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinejoin="round"
        />
      </svg>
    </button>
  )
}
