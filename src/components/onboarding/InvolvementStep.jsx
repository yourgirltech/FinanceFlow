import SelectCard from './SelectCard'

const OPTIONS = [
  {
    value: 'simple',
    icon: '🌱',
    title: 'Simple',
    description: "I just want to know where my money goes — keep it quick and light.",
  },
  {
    value: 'planner',
    icon: '📊',
    title: 'Planner',
    description: 'I like budgets and tracking — give me categories, limits, and progress.',
  },
  {
    value: 'power',
    icon: '🚀',
    title: 'Power User',
    description: 'I want detailed analytics and every feature, front and centre.',
  },
]

export default function InvolvementStep({ value, onChange }) {
  return (
    <div className="animate-fade-up">
      <h2 className="font-display font-extrabold text-navy dark:text-white text-2xl tracking-tight mb-2">
        How hands-on do you want to be?
      </h2>
      <p className="text-slate dark:text-white/50 text-sm mb-8">
        This shapes what your dashboard shows first. You can change it later in Settings.
      </p>

      <div className="grid sm:grid-cols-3 gap-4">
        {OPTIONS.map((opt) => (
          <SelectCard
            key={opt.value}
            icon={opt.icon}
            title={opt.title}
            description={opt.description}
            selected={value === opt.value}
            onClick={() => onChange(opt.value)}
          />
        ))}
      </div>
    </div>
  )
}
