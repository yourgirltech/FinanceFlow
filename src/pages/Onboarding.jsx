import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import OnboardingProgress from '../components/onboarding/OnboardingProgress'
import WelcomeStep from '../components/onboarding/WelcomeStep'
import RegionStep from '../components/onboarding/RegionStep'
import InvolvementStep from '../components/onboarding/InvolvementStep'
import TrackingStyleStep from '../components/onboarding/TrackingStyleStep'
import Button from '../components/ui/Button'
import { useAuth } from '../lib/AuthContext'
import { useRegion } from '../lib/RegionContext'
import { getOnboardingState, saveOnboardingState } from '../lib/onboarding'

const TOTAL_STEPS = 4 // welcome, region, involvement, tracking style

export default function Onboarding() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const { region, regions, setRegionCode } = useRegion()
  const firstName = (user?.user_metadata?.full_name || '').split(' ')[0]

  const [step, setStep] = useState(0)
  const initial = getOnboardingState(user?.id)
  const [involvement, setInvolvement] = useState(initial.involvement)
  const [trackingStyle, setTrackingStyle] = useState(initial.trackingStyle)

  function next() {
    setStep((s) => Math.min(s + 1, TOTAL_STEPS - 1))
  }
  function back() {
    setStep((s) => Math.max(s - 1, 0))
  }

  function finish() {
    saveOnboardingState(user?.id, { complete: true, involvement, trackingStyle })
    navigate('/dashboard')
  }

  const canContinue = step === 2 ? Boolean(involvement) : step === 3 ? Boolean(trackingStyle) : true

  return (
    <div className="min-h-screen bg-white dark:bg-navy flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-2xl">
        {step > 0 && <OnboardingProgress step={step} total={TOTAL_STEPS} />}

        <div key={step}>
          {step === 0 && <WelcomeStep firstName={firstName} onNext={next} />}
          {step === 1 && <RegionStep region={region} regions={regions} setRegionCode={setRegionCode} />}
          {step === 2 && <InvolvementStep value={involvement} onChange={setInvolvement} />}
          {step === 3 && <TrackingStyleStep value={trackingStyle} onChange={setTrackingStyle} />}
        </div>

        {step > 0 && (
          <div className="flex items-center justify-between mt-10">
            <button
              onClick={back}
              className="text-sm font-medium text-slate dark:text-white/50 hover:text-navy dark:hover:text-white transition-colors"
            >
              Back
            </button>
            {step === TOTAL_STEPS - 1 ? (
              <Button variant="navGold" ring onClick={finish} disabled={!canContinue} className="h-11 px-7 disabled:opacity-50">
                Finish setup
              </Button>
            ) : (
              <Button variant="navGold" onClick={next} disabled={!canContinue} className="h-11 px-7 disabled:opacity-50">
                Continue
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
