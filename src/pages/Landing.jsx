import { ThemeProvider, useTheme } from '../lib/ThemeContext'
import Navbar from '../components/landing/Navbar'
import Hero from '../components/landing/Hero'
import TrustLogos from '../components/landing/TrustLogos'
import Features from '../components/landing/Features'
import ComparisonSection from '../components/landing/ComparisonSection'
import PricingTeaser from '../components/landing/PricingTeaser'
import ShowcaseSection from '../components/landing/ShowcaseSection'
import InsightSection from '../components/landing/InsightSection'
import CTASection from '../components/landing/CTASection'
import Footer from '../components/landing/Footer'

function LandingContent() {
  const { dark } = useTheme()
  return (
    <div className={dark ? 'dark' : ''}>
      <div className="min-h-screen bg-white dark:bg-navy transition-colors duration-300">
        <Navbar />
        <main>
          <Hero />
          <TrustLogos />
          <Features />
          <ComparisonSection />
          <PricingTeaser />
          <ShowcaseSection />
          <InsightSection />
          <CTASection />
        </main>
        <Footer />
      </div>
    </div>
  )
}

export default function Landing() {
  return (
    <ThemeProvider>
      <LandingContent />
    </ThemeProvider>
  )
}
