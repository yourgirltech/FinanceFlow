import SelectCard from './SelectCard'

const OPTIONS = [
  {
    value: 'quick-add',
    icon: '⚡',
    title: 'Quick Add',
    description: 'Log income and expenses in under 5 seconds — just type "Food 25" and go.',
    badge: 'Recommended',
  },
  {
    value: 'manual',
    icon: '✍️',
    title: 'Manual Tracking',
    description: 'I want full control over every transaction — amount, category, date, notes.',
  },
  {
    value: 'import',
    icon: '📄',
    title: 'Import Statement',
    description: 'Import existing transactions from your bank as a CSV or Excel file.',
  },
  {
    value: 'bank',
    icon: '🏦',
    title: 'Bank Connection',
    description: 'Securely sync your bank account automatically.',
    badge: 'Coming Soon',
    disabled: true,
  },
]

export default function TrackingStyleStep({ value, onChange }) {
  return (
    <div className="animate-fade-up">
      <h2 className="font-display font-extrabold text-navy dark:text-white text-2xl tracking-tight mb-2">
        How do you want to track money?
      </h2>
      <p className="text-slate dark:text-white/50 text-sm mb-8">
        Pick what feels right — you can switch anytime in Settings.
      </p>

      <div className="grid sm:grid-cols-2 gap-4">
        {OPTIONS.map((opt) => (
          <SelectCard
            key={opt.value}
            icon={opt.icon}
            title={opt.title}
            description={opt.description}
            badge={opt.badge}
            disabled={opt.disabled}
            selected={value === opt.value}
            onClick={() => onChange(opt.value)}
          />
        ))}
      </div>
    </div>
  )
}
