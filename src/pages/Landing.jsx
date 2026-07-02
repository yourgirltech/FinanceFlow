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

export default function Landing() {
  return (
    <>
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
    </>
  )
}
