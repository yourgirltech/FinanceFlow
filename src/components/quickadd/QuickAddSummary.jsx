import { useCountUp } from '../../lib/useCountUp'
import { formatMoney } from '../../lib/format'

export default function QuickAddSummary({ totalIncome, totalBudgeted, balance, anyOverBudget, region }) {
  const animatedBalance = useCountUp(balance, { duration: 700 })

  return (
    <div className="rounded-2xl bg-navy dark:bg-white/[0.04] p-5 mb-4 flex flex-col sm:flex-row sm:items-center gap-5 sm:gap-10">
      <div>
        <p className="text-white/50 text-xs mb-1">{anyOverBudget ? 'Balance (over budget)' : 'Your balance'}</p>
        <p className={`font-tabular text-[26px] font-semibold tracking-tight ${anyOverBudget ? 'text-red' : 'text-white'}`}>
          {formatMoney(animatedBalance, region)}
        </p>
      </div>
      <div className="flex items-center gap-6 sm:ml-auto">
        <div>
          <p className="text-white/40 text-[11px] mb-1">Income</p>
          <p className="font-tabular text-emerald text-[15px] font-semibold">+{formatMoney(totalIncome, region)}</p>
        </div>
        <div className="h-8 w-px bg-white/10" />
        <div>
          <p className="text-white/40 text-[11px] mb-1">Expenses (budgeted)</p>
          <p className="font-tabular text-red text-[15px] font-semibold">{'\u2212'}{formatMoney(totalBudgeted, region)}</p>
        </div>
      </div>
    </div>
  )
}
