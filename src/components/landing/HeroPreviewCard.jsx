import { useCountUp, useInView } from '../../lib/useCountUp'
import { formatNaira } from '../../lib/format'
import FlowLine from '../FlowLine'

function StatPill({ label, value, tone }) {
  const toneClasses =
    tone === 'up'
      ? 'text-emerald bg-emerald-soft'
      : 'text-red bg-red-soft'
  return (
    <div className="flex items-center justify-between rounded-xl bg-white/70 px-3.5 py-2.5">
      <span className="text-[13px] text-slate">{label}</span>
      <span className={`text-[13px] font-tabular font-medium px-2 py-0.5 rounded-full ${toneClasses}`}>
        {value}
      </span>
    </div>
  )
}

export default function HeroPreviewCard() {
  const [ref, inView] = useInView({ threshold: 0.2 })
  const balance = useCountUp(2450000, { duration: 1600, start: inView })

  return (
    <div ref={ref} className="relative animate-float">
      {/* ambient glow */}
      <div className="absolute -inset-10 bg-gradient-to-tr from-emerald/10 via-gold/10 to-transparent blur-3xl rounded-[40px]" />

      <div className="relative w-[340px] sm:w-[380px] rounded-[28px] bg-navy p-6 shadow-2xl shadow-navy/30 rotate-[3deg] border border-white/10">
        <div className="flex items-center justify-between mb-5">
          <div>
            <p className="text-white/50 text-xs mb-1">Total balance</p>
            <p className="font-tabular text-white text-[28px] font-semibold tracking-tight">
              {formatNaira(balance)}
            </p>
          </div>
          <div className="h-9 w-9 rounded-full bg-gold/90 flex items-center justify-center text-navy text-sm font-bold font-display">
            F
          </div>
        </div>

        <div className="rounded-2xl bg-white/[0.06] p-3 mb-4">
          <FlowLine className="w-full h-16" />
        </div>

        <div className="space-y-2">
          <StatPill label="Income this month" value="+₦840,000" tone="up" />
          <StatPill label="Expenses this month" value="−₦412,300" tone="down" />
          <StatPill label="Savings rate" value="34%" tone="up" />
        </div>
      </div>

      {/* floating secondary card */}
      <div className="absolute -bottom-8 -left-10 w-44 rounded-2xl bg-white shadow-xl border border-line p-4 -rotate-6 hidden sm:block">
        <p className="text-[11px] text-slate mb-1">Food & Dining</p>
        <div className="h-1.5 rounded-full bg-surface overflow-hidden mb-1.5">
          <div className="h-full bg-gold rounded-full" style={{ width: '68%' }} />
        </div>
        <p className="text-[11px] font-tabular text-navy">₦68,000 <span className="text-slate-light">of ₦100,000</span></p>
      </div>
    </div>
  )
}
