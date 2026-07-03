export default function InsightsPanel({ insights, goal, onEditGoal, maxCount = 3, compact = false }) {
  const shown = insights.slice(0, maxCount)

  return (
    <div className="rounded-2xl bg-navy p-6 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-64 h-64 bg-emerald/10 blur-[100px] rounded-full pointer-events-none" />
      <div className="relative flex items-center justify-between mb-5">
        <span className="text-xs font-semibold tracking-wide text-gold uppercase">Insights</span>
        <button onClick={onEditGoal} className="text-xs text-white/40 hover:text-white/70 transition-colors">
          {goal ? `🎯 ${goal.name}` : '+ Set a savings goal'}
        </button>
      </div>

      {shown.length === 0 ? (
        <p className="relative text-sm text-white/40 py-4">
          Add a few transactions and check back — insights show up once there's enough to compare.
        </p>
      ) : (
        <div className={`relative grid gap-3 ${compact ? '' : 'sm:grid-cols-3'}`}>
          {shown.map((insight) => (
            <div
              key={insight.id}
              className="rounded-xl bg-white/[0.05] border border-white/10 p-4"
            >
              <span className="text-lg mb-2 block">{insight.icon}</span>
              <p className="text-[13px] text-white/85 leading-relaxed">{insight.text}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
