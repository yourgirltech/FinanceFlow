import { Link } from 'react-router-dom'

const variants = {
  primary:
    'bg-navy text-white hover:bg-navy-2 shadow-[0_1px_0_0_rgba(255,255,255,0.08)_inset] dark:bg-white dark:text-navy dark:hover:bg-white/90',
  navGold:
    'bg-navy text-gold hover:bg-navy-2 shadow-[0_1px_0_0_rgba(255,255,255,0.08)_inset] dark:bg-white dark:text-gold dark:hover:bg-white/90',
  gold:
    'bg-gold text-navy hover:brightness-95',
  secondary:
    'bg-white text-navy border border-line hover:border-slate-light dark:bg-white/[0.06] dark:text-white dark:border-white/15 dark:hover:border-white/30',
  ghost:
    'bg-transparent text-navy hover:bg-surface dark:text-white/80 dark:hover:bg-white/[0.06]',
  danger:
    'bg-red text-white hover:bg-red/90',
}

export default function Button({
  children,
  variant = 'primary',
  to,
  href,
  as,
  ring = false,
  className = '',
  ...props
}) {
  const base =
    'inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-semibold font-body transition-all duration-200 active:scale-[0.98]'
  const ringClass = ring ? 'btn-glow-ring' : ''
  const classes = `${base} ${variants[variant]} ${ringClass} ${className}`

  if (to) {
    return (
      <Link to={to} className={classes} {...props}>
        {children}
      </Link>
    )
  }
  if (href) {
    return (
      <a href={href} className={classes} {...props}>
        {children}
      </a>
    )
  }
  return (
    <button className={classes} {...props}>
      {children}
    </button>
  )
}
