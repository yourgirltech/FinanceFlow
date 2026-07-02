import Button from '../ui/Button'

export default function CTASection() {
  return (
    <section className="py-24 lg:py-32 bg-white dark:bg-navy">
      <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center">
        <h2 className="font-display font-extrabold text-navy dark:text-white text-3xl sm:text-[44px] tracking-tight mb-5">
          Take control of your money,
          <br /> starting today.
        </h2>
        <p className="text-slate dark:text-white/60 text-base mb-9 max-w-md mx-auto">
          Free to start. No card required. Set up your first budget in under two minutes.
        </p>
        <Button to="/signup" variant="navGold" className="h-12 px-8 text-[15px]">
          Get Started Free
        </Button>
      </div>
    </section>
  )
}
