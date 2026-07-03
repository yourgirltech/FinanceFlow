import Button from '../ui/Button'
import HeroPreviewCard from './HeroPreviewCard'
import { useRegion } from '../../lib/RegionContext'

export default function Hero() {
  const { region } = useRegion()
  return (
    <section className="relative overflow-hidden pt-40 pb-28 lg:pt-48 lg:pb-36">
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-surface/60 to-white dark:from-white/[0.03] dark:to-navy" />
      <div className="absolute top-32 left-1/2 -translate-x-1/2 w-[900px] h-[500px] -z-10 bg-emerald/[0.06] blur-[120px] rounded-full" />

      <div className="max-w-7xl mx-auto px-6 lg:px-8 grid lg:grid-cols-2 gap-16 items-center">
        <div className="animate-fade-up min-w-0">
          <div className="inline-flex items-center gap-2 rounded-full border border-line dark:border-white/10 bg-white dark:bg-white/[0.04] px-3.5 py-1.5 mb-7 max-w-full">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald shrink-0" />
            <span className="text-xs font-medium text-slate dark:text-white/60 truncate">
              <span className="sm:hidden">Trusted in {region.country}</span>
              <span className="hidden sm:inline">Now tracking accounts across every major {region.country} bank</span>
            </span>
          </div>

          <h1 className="font-display font-extrabold text-navy dark:text-white text-[40px] leading-[1.08] sm:text-[52px] lg:text-[58px] tracking-tight mb-6">
            See where every
            <br />
            <span className="relative inline-block">
              {region.currencyWord}
              <svg
                className="absolute -bottom-1 left-0 w-full"
                viewBox="0 0 200 12"
                preserveAspectRatio="none"
                aria-hidden="true"
              >
                <path d="M2 9 C 50 3, 150 3, 198 9" stroke="#C9A24B" strokeWidth="4" fill="none" strokeLinecap="round" />
              </svg>
            </span>{' '}
            goes.
          </h1>

          <p className="text-slate dark:text-white/60 text-lg leading-relaxed max-w-md mb-9">
            Finance Flow turns your spending into clear budgets, honest trends,
            and the kind of insight that actually changes what you do next month.
          </p>

          <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 mb-8">
            <Button to="/signup" variant="navGold" ring className="h-12 px-7 text-[15px] w-full sm:w-auto">
              Get Started Free
            </Button>
            <Button href="#showcase" variant="secondary" className="h-12 px-7 text-[15px] w-full sm:w-auto">
              <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4 -ml-1">
                <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.6" />
                <path d="M10 8.5l6 3.5-6 3.5v-7z" fill="currentColor" />
              </svg>
              Watch Demo
            </Button>
          </div>

          <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-slate-light dark:text-white/35">
            <span>No card required</span>
            <span className="h-1 w-1 rounded-full bg-line dark:bg-white/20" />
            <span>Bank-level encryption</span>
            <span className="h-1 w-1 rounded-full bg-line dark:bg-white/20" />
            <span>Built for {region.symbol} accounts</span>
          </div>
        </div>

        <div className="flex justify-center lg:justify-end">
          <HeroPreviewCard />
        </div>
      </div>
    </section>
  )
}
