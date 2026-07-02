import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts'
import { formatMoney } from '../../lib/format'
import { useRegion } from '../../lib/RegionContext'

export default function TrendChart({ data }) {
  const { region } = useRegion()

  return (
    <div className="rounded-2xl bg-white dark:bg-white/[0.04] border border-line dark:border-white/10 p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-display font-bold text-navy dark:text-white text-sm">Income vs expenses</h3>
        <div className="flex items-center gap-4 text-[11px]">
          <span className="flex items-center gap-1.5 text-slate dark:text-white/50">
            <span className="h-2 w-2 rounded-full bg-emerald" /> Income
          </span>
          <span className="flex items-center gap-1.5 text-slate dark:text-white/50">
            <span className="h-2 w-2 rounded-full bg-red" /> Expenses
          </span>
        </div>
      </div>
      <div className="h-56">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 6, right: 6, left: -18, bottom: 0 }}>
            <defs>
              <linearGradient id="incomeGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="var(--color-emerald)" stopOpacity={0.28} />
                <stop offset="100%" stopColor="var(--color-emerald)" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="expenseGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="var(--color-red)" stopOpacity={0.22} />
                <stop offset="100%" stopColor="var(--color-red)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} stroke="var(--color-line)" strokeDasharray="3 5" />
            <XAxis
              dataKey="month"
              axisLine={false}
              tickLine={false}
              tick={{ fill: 'var(--color-slate-light)', fontSize: 11 }}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: 'var(--color-slate-light)', fontSize: 11 }}
              tickFormatter={(v) => formatMoney(v, region, { compact: true })}
              width={54}
            />
            <Tooltip
              formatter={(value) => formatMoney(value, region)}
              contentStyle={{
                borderRadius: 12,
                border: '1px solid var(--color-line)',
                fontSize: 12,
                fontFamily: 'Inter, sans-serif',
              }}
            />
            <Area type="monotone" dataKey="income" stroke="var(--color-emerald)" strokeWidth={2} fill="url(#incomeGradient)" />
            <Area type="monotone" dataKey="expenses" stroke="var(--color-red)" strokeWidth={2} fill="url(#expenseGradient)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
