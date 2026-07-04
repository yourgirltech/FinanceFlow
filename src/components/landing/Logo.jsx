export default function Logo({ dark = false, className = '' }) {
  const textColor = dark ? 'text-white' : 'text-navy'
  return (
    <div className={`flex items-center gap-1.5 sm:gap-2 ${className}`}>
      <svg width="24" height="24" viewBox="0 0 32 32" fill="none" className="sm:w-7 sm:h-7 shrink-0">
        <rect width="32" height="32" rx="9" fill={dark ? '#FFFFFF' : '#0B1220'} />
        <path
          d="M6 20 L12 14 L17 18 L26 8"
          stroke="#C9A24B"
          strokeWidth="2.4"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <circle cx="26" cy="8" r="2.2" fill="#0FA968" />
      </svg>
      <span className={`font-display font-bold text-[15px] sm:text-[17px] tracking-tight whitespace-nowrap ${textColor}`}>
        Finance Flow
      </span>
    </div>
  )
}
