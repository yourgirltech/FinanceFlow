import Navbar from '../components/landing/Navbar'
import Hero from '../components/landing/Hero'
import Features from '../components/landing/Features'
import ShowcaseSection from '../components/landing/ShowcaseSection'
import InsightSection from '../components/landing/InsightSection'
import CTASection from '../components/landing/CTASection'
import Footer from '../components/landing/Footer'

export default function Landing() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <main>
        <Hero />
        <Features />
        <ShowcaseSection />
        <InsightSection />
        <CTASection />
      </main>
      <Footer />
    </div>
  )
}
