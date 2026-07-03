export default function OnboardingProgress({ step, total }) {
  return (
    <div className="flex items-center gap-2 mb-10">
      {Array.from({ length: total }).map((_, i) => (
        <div
          key={i}
          className={`h-1.5 rounded-full transition-all duration-500 ${
            i <= step ? 'bg-gold flex-1' : 'bg-line dark:bg-white/10 flex-1'
          }`}
        />
      ))}
    </div>
  )
}
