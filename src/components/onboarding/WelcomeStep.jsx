import Logo from '../landing/Logo'
import FlowLine from '../FlowLine'
import Button from '../ui/Button'
import { useTheme } from '../../lib/ThemeContext'

export default function WelcomeStep({ firstName, onNext }) {
  const { dark } = useTheme()
  return (
    <div className="flex flex-col items-center text-center animate-fade-up">
      <Logo dark={dark} className="mb-10" />
      <div className="h-16 w-16 rounded-2xl bg-gold-soft dark:bg-gold/15 flex items-center justify-center mb-7">
        <span className="text-2xl">👋</span>
      </div>
      <h1 className="font-display font-extrabold text-navy dark:text-white text-3xl sm:text-[34px] tracking-tight mb-4 max-w-md">
        Welcome to Finance Flow{firstName ? `, ${firstName}` : ''}.
      </h1>
      <p className="text-slate dark:text-white/50 text-[15px] leading-relaxed max-w-sm mb-10">
        Let's personalise your financial experience. It'll only take a minute.
      </p>

      <div className="w-full max-w-xs rounded-2xl bg-surface dark:bg-white/[0.04] border border-line dark:border-white/10 p-3 mb-10">
        <FlowLine className="w-full h-14" />
      </div>

      <Button variant="navGold" ring onClick={onNext} className="h-11 px-8">
        Let's get started
      </Button>
    </div>
  )
}
