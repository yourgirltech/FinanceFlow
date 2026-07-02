import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts'
import { formatMoney } from '../../lib/format'
import { useRegion } from '../../lib/RegionContext'

export default function SpendingBreakdown({ data }) {
  const { region } = useRegion()
  const total = data.reduce((sum, d) => sum + d.value, 0)

  if (data.length === 0) {
    return (
      <div className="rounded-2xl bg-white dark:bg-white/[0.04] border border-line dark:border-white/10 p-5">
        <h3 className="font-display font-bold text-navy dark:text-white text-sm mb-4">Spending by category</h3>
        <p className="text-sm text-slate-light dark:text-white/35 py-10 text-center">No expenses yet this month.</p>
      </div>
    )
  }

  return (
    <div className="rounded-2xl bg-white dark:bg-white/[0.04] border border-line dark:border-white/10 p-5">
      <h3 className="font-display font-bold text-navy dark:text-white text-sm mb-4">Spending by category</h3>
      <div className="flex items-center gap-5">
        <div className="h-36 w-36 shrink-0">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                dataKey="value"
                nameKey="category"
                innerRadius={42}
                outerRadius={64}
                paddingAngle={3}
                stroke="none"
              >
                {data.map((entry) => (
                  <Cell key={entry.category} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                formatter={(value) => formatMoney(value, region)}
                contentStyle={{
                  borderRadius: 12,
                  border: '1px solid var(--color-line)',
                  fontSize: 12,
                  fontFamily: 'Inter, sans-serif',
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="flex-1 min-w-0 space-y-2">
          {data.slice(0, 5).map((d) => (
            <div key={d.category} className="flex items-center justify-between gap-2">
              <span className="flex items-center gap-2 min-w-0">
                <span className="h-2 w-2 rounded-full shrink-0" style={{ backgroundColor: d.color }} />
                <span className="text-[12.5px] text-slate dark:text-white/60 truncate">{d.category}</span>
              </span>
              <span className="text-[12px] font-tabular text-slate-light dark:text-white/40 shrink-0">
                {Math.round((d.value / total) * 100)}%
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
