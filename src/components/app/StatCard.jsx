import { useCountUp, useInView } from '../../lib/useCountUp'
import { formatMoney } from '../../lib/format'
import { useRegion } from '../../lib/RegionContext'

export default function StatCard({ label, value, isMoney = true, tone, icon, delta }) {
  const [ref, inView] = useInView({ threshold: 0.3 })
  const { region } = useRegion()
  const animated = useCountUp(value, { duration: 1400, start: inView })

  const toneClasses = {
    neutral: 'text-navy dark:text-white',
    up: 'text-emerald',
    down: 'text-red',
  }[tone || 'neutral']

  return (
    <div
      ref={ref}
      className="rounded-2xl bg-white dark:bg-white/[0.04] border border-line dark:border-white/10 p-5 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-navy/5 transition-all duration-300"
    >
      <div className="flex items-center justify-between mb-4 gap-2">
        <span className="text-xs font-medium text-slate dark:text-white/50 truncate">{label}</span>
        {icon && (
          <div className="h-8 w-8 shrink-0 rounded-lg bg-surface dark:bg-white/[0.06] flex items-center justify-center">
            {icon}
          </div>
        )}
      </div>
      <p className={`font-tabular text-2xl font-semibold tracking-tight truncate ${toneClasses}`}>
        {isMoney ? formatMoney(animated, region) : `${Math.round(animated)}%`}
      </p>
      {delta && (
        <p className={`text-xs mt-1.5 font-medium truncate ${delta.up ? 'text-emerald' : 'text-red'}`}>
          {delta.up ? '↑' : '↓'} {delta.text}
        </p>
      )}
    </div>
  )
}
