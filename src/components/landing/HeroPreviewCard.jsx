import { useCountUp, useInView } from '../../lib/useCountUp'
import { formatMoney } from '../../lib/format'
import { useRegion } from '../../lib/RegionContext'
import FlowLine from '../FlowLine'

function StatPill({ label, value, tone }) {
  const toneClasses = tone === 'up' ? 'text-emerald bg-emerald-soft' : 'text-red bg-red-soft'
  return (
    <div className="flex items-center justify-between rounded-xl bg-white/70 px-3.5 py-2.5">
      <span className="text-[13px] text-slate">{label}</span>
      <span className={`text-[13px] font-tabular font-medium px-2 py-0.5 rounded-full ${toneClasses}`}>
        {value}
      </span>
    </div>
  )
}

function MiniDonut() {
  const segments = [
    { color: 'var(--color-emerald)', pct: 38 },
    { color: 'var(--color-gold)', pct: 27 },
    { color: 'var(--color-red)', pct: 20 },
    { color: 'rgba(255,255,255,0.25)', pct: 15 },
  ]
  const r = 15.5
  const circumference = 2 * Math.PI * r
  let offset = 0
  return (
    <svg viewBox="0 0 36 36" className="h-[52px] w-[52px] -rotate-90 shrink-0">
      {segments.map((seg, i) => {
        const dash = (seg.pct / 100) * circumference
        const el = (
          <circle
            key={i}
            cx="18"
            cy="18"
            r={r}
            fill="none"
            stroke={seg.color}
            strokeWidth="4.5"
            strokeDasharray={`${dash} ${circumference - dash}`}
            strokeDashoffset={-offset}
            strokeLinecap="butt"
          />
        )
        offset += dash
        return el
      })}
    </svg>
  )
}

export default function HeroPreviewCard() {
  const [ref, inView] = useInView({ threshold: 0.2 })
  const { region } = useRegion()
  const { sample } = region
  const balance = useCountUp(sample.balance, { duration: 1600, start: inView })
  const budgetPct = Math.round((sample.budgetSpent / sample.budgetTotal) * 100)
  const firstBank = region.banks[0]
  const bankInitials = firstBank
    .split(' ')
    .map((w) => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()

  return (
    <div ref={ref} className="relative animate-float w-full max-w-[350px] sm:max-w-[400px] mx-auto">
      <div className="absolute -inset-6 sm:-inset-10 bg-gradient-to-tr from-emerald/10 via-gold/10 to-transparent blur-3xl rounded-[40px]" />

      <div className="relative w-full rounded-[28px] bg-navy p-5 sm:p-6 shadow-2xl shadow-navy/30 rotate-[3deg] border border-white/10">
        <div className="flex items-center justify-between mb-5 gap-2">
          <div className="min-w-0">
            <p className="text-white/50 text-xs mb-1">Total balance</p>
            <p className="font-tabular text-white text-[22px] sm:text-[26px] font-semibold tracking-tight truncate">
              {formatMoney(balance, region)}
            </p>
          </div>
          <div className="flex items-center gap-2.5 shrink-0">
            <div className="relative h-8 w-8 rounded-full bg-white/[0.08] flex items-center justify-center">
              <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4">
                <path
                  d="M12 4a5 5 0 00-5 5v3.2c0 .6-.2 1.2-.6 1.6L5 15.5h14l-1.4-1.7c-.4-.4-.6-1-.6-1.6V9a5 5 0 00-5-5z"
                  stroke="rgba(255,255,255,0.6)"
                  strokeWidth="1.5"
                  strokeLinejoin="round"
                />
                <path d="M9.5 18a2.5 2.5 0 005 0" stroke="rgba(255,255,255,0.6)" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
              <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-red border border-navy" />
            </div>
            <div className="h-9 w-9 rounded-full bg-gold/90 flex items-center justify-center text-navy text-sm font-bold font-display">
              F
            </div>
          </div>
        </div>

        <div className="rounded-2xl bg-white/[0.06] p-3 mb-3">
          <FlowLine className="w-full h-14" />
        </div>

        <div className="flex items-center gap-3 mb-3 rounded-2xl bg-white/[0.06] p-3">
          <MiniDonut />
          <div className="flex-1 grid grid-cols-2 gap-x-3 gap-y-1.5">
            {[
              { label: 'Food', color: 'bg-emerald' },
              { label: 'Bills', color: 'bg-gold' },
              { label: 'Transport', color: 'bg-red' },
              { label: 'Other', color: 'bg-white/30' },
            ].map((c) => (
              <div key={c.label} className="flex items-center gap-1.5">
                <span className={`h-1.5 w-1.5 rounded-full ${c.color}`} />
                <span className="text-[10.5px] text-white/60">{c.label}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-2 mb-3">
          <StatPill label="Income this month" value={`+${formatMoney(sample.income, region)}`} tone="up" />
          <StatPill label="Expenses this month" value={`\u2212${formatMoney(sample.expenses, region)}`} tone="down" />
        </div>

        <div className="flex items-center justify-between rounded-xl bg-white/[0.06] px-3.5 py-2.5 mb-3">
          <div className="flex items-center gap-2.5">
            <div className="h-7 w-7 rounded-full bg-emerald-soft/20 flex items-center justify-center">
              <span className="text-[11px]">💳</span>
            </div>
            <div>
              <p className="text-[12.5px] text-white leading-tight">{firstBank} purchase</p>
              <p className="text-[10.5px] text-white/40">2 hours ago</p>
            </div>
          </div>
          <span className="text-[12.5px] font-tabular text-white/80">{`\u2212${formatMoney(sample.txn, region)}`}</span>
        </div>

        <div>
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[11px] text-white/50">Emergency fund goal</span>
            <span className="text-[11px] font-tabular text-white/70">72%</span>
          </div>
          <div className="h-1.5 rounded-full bg-white/10 overflow-hidden">
            <div className="h-full bg-gradient-to-r from-emerald to-gold rounded-full" style={{ width: '72%' }} />
          </div>
        </div>
      </div>

      <div className="absolute -bottom-8 -left-10 w-44 rounded-2xl bg-white shadow-xl border border-line p-4 -rotate-6 hidden sm:block">
        <p className="text-[11px] text-slate mb-1">Food & Dining</p>
        <div className="h-1.5 rounded-full bg-surface overflow-hidden mb-1.5">
          <div className="h-full bg-gold rounded-full" style={{ width: `${budgetPct}%` }} />
        </div>
        <p className="text-[11px] font-tabular text-navy">
          {formatMoney(sample.budgetSpent, region)} <span className="text-slate-light">of {formatMoney(sample.budgetTotal, region)}</span>
        </p>
      </div>

      <div className="absolute -top-7 -right-6 w-40 rounded-2xl bg-white shadow-xl border border-line p-3.5 rotate-6 hidden sm:block">
        <div className="flex items-center gap-2 mb-2">
          <div className="h-6 w-6 rounded-full bg-navy flex items-center justify-center text-white text-[9px] font-bold font-display">
            {bankInitials}
          </div>
          <p className="text-[10.5px] text-slate">•••• 4432</p>
        </div>
        <p className="text-[13px] font-tabular font-semibold text-navy">{formatMoney(sample.balance * 0.18, region)}</p>
      </div>
    </div>
  )
}
