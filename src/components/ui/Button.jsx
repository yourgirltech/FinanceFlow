import { Link } from 'react-router-dom'

const variants = {
  primary:
    'bg-navy text-white hover:bg-navy-2 shadow-[0_1px_0_0_rgba(255,255,255,0.08)_inset]',
  gold:
    'bg-gold text-navy hover:brightness-95',
  secondary:
    'bg-white text-navy border border-line hover:border-slate-light',
  ghost:
    'bg-transparent text-navy hover:bg-surface',
}

export default function Button({
  children,
  variant = 'primary',
  to,
  href,
  as,
  className = '',
  ...props
}) {
  const base =
    'inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-semibold font-body transition-all duration-200 active:scale-[0.98]'
  const classes = `${base} ${variants[variant]} ${className}`

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
