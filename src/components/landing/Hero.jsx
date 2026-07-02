import Button from '../ui/Button'
import HeroPreviewCard from './HeroPreviewCard'

export default function Hero() {
  return (
    <section className="relative overflow-hidden pt-40 pb-28 lg:pt-48 lg:pb-36">
      {/* soft background wash */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-surface/60 to-white" />
      <div className="absolute top-32 left-1/2 -translate-x-1/2 w-[900px] h-[500px] -z-10 bg-emerald/[0.06] blur-[120px] rounded-full" />

      <div className="max-w-7xl mx-auto px-6 lg:px-8 grid lg:grid-cols-2 gap-16 items-center">
        <div className="animate-fade-up">
          <div className="inline-flex items-center gap-2 rounded-full border border-line bg-white px-3.5 py-1.5 mb-7">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald" />
            <span className="text-xs font-medium text-slate">Now tracking accounts across every major Nigerian bank</span>
          </div>

          <h1 className="font-display font-extrabold text-navy text-[40px] leading-[1.08] sm:text-[52px] lg:text-[58px] tracking-tight mb-6">
            See where every
            <br />
            <span className="relative inline-block">
              naira
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

          <p className="text-slate text-lg leading-relaxed max-w-md mb-9">
            Finance Flow turns your spending into clear budgets, honest trends,
            and the kind of insight that actually changes what you do next month.
          </p>

          <div className="flex flex-wrap items-center gap-4 mb-8">
            <Button to="/signup" variant="primary" className="h-12 px-7 text-[15px]">
              Get Started Free
            </Button>
            <Button href="#showcase" variant="secondary" className="h-12 px-7 text-[15px] group">
              <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4 -ml-1">
                <circle cx="12" cy="12" r="9" stroke="#0B1220" strokeWidth="1.6" />
                <path d="M10 8.5l6 3.5-6 3.5v-7z" fill="#0B1220" />
              </svg>
              Watch Demo
            </Button>
          </div>

          <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-slate-light">
            <span>No card required</span>
            <span className="h-1 w-1 rounded-full bg-line" />
            <span>Bank-level encryption</span>
            <span className="h-1 w-1 rounded-full bg-line" />
            <span>Built for ₦ accounts</span>
          </div>
        </div>

        <div className="flex justify-center lg:justify-end">
          <HeroPreviewCard />
        </div>
      </div>
    </section>
  )
}
