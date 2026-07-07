export default function FlowLine({ className = '', animate = true }) {
  return (
    <svg
      viewBox="0 0 400 120"
      fill="none"
      className={className}
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <path
        d="M0 95 C 40 95, 55 60, 90 65 C 125 70, 130 40, 165 38 C 195 36, 205 75, 240 70 C 270 66, 280 20, 320 18 C 350 17, 365 45, 400 30"
        stroke="var(--color-emerald)"
        strokeWidth="2.5"
        strokeLinecap="round"
        opacity="0.9"
      />
      <path
        d="M0 95 C 40 95, 55 60, 90 65 C 125 70, 130 40, 165 38 C 195 36, 205 75, 240 70 C 270 66, 280 20, 320 18 C 350 17, 365 45, 400 30"
        stroke="var(--color-gold)"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeDasharray="14 190"
        className={animate ? 'animate-flow' : ''}
      />
      <circle cx="320" cy="18" r="4" fill="var(--color-gold)" />
    </svg>
  )
}
