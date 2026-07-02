import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from 'recharts'
import { formatMoney } from '../../lib/format'
import { useRegion } from '../../lib/RegionContext'

export default function IncomeExpenseBars({ data }) {
  const { region } = useRegion()

  return (
    <div className="rounded-2xl bg-white dark:bg-white/[0.04] border border-line dark:border-white/10 p-5">
      <h3 className="font-display font-bold text-navy dark:text-white text-sm mb-4">Income vs expenses by month</h3>
      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 6, right: 6, left: -18, bottom: 0 }} barGap={4}>
            <CartesianGrid vertical={false} stroke="var(--color-line)" strokeDasharray="3 5" />
            <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: 'var(--color-slate-light)', fontSize: 11 }} />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: 'var(--color-slate-light)', fontSize: 11 }}
              tickFormatter={(v) => formatMoney(v, region, { compact: true })}
              width={54}
            />
            <Tooltip
              formatter={(value) => formatMoney(value, region)}
              contentStyle={{ borderRadius: 12, border: '1px solid var(--color-line)', fontSize: 12, fontFamily: 'Inter, sans-serif' }}
            />
            <Legend wrapperStyle={{ fontSize: 12 }} />
            <Bar dataKey="income" name="Income" fill="var(--color-emerald)" radius={[6, 6, 0, 0]} maxBarSize={28} />
            <Bar dataKey="expenses" name="Expenses" fill="var(--color-red)" radius={[6, 6, 0, 0]} maxBarSize={28} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
