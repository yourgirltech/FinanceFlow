import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../lib/AuthContext'
import { getOnboardingState } from '../../lib/onboarding'
import { meetsTier, TIER_LABELS } from '../../lib/involvement'
import Button from '../ui/Button'

export default function TierGate({ requiredTier, children }) {
  const navigate = useNavigate()
  const { user } = useAuth()
  const involvement = getOnboardingState(user?.id).involvement

  if (meetsTier(involvement, requiredTier)) return children

  return (
    <div className="min-h-screen flex items-center justify-center bg-surface/40 dark:bg-navy px-6">
      <div className="max-w-sm text-center">
        <div className="h-12 w-12 rounded-2xl bg-gold-soft dark:bg-gold/15 flex items-center justify-center mx-auto mb-5">
          <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6">
            <rect x="5" y="11" width="14" height="9" rx="2" stroke="var(--color-gold)" strokeWidth="1.7" />
            <path d="M8 11V8a4 4 0 118 0v3" stroke="var(--color-gold)" strokeWidth="1.7" strokeLinecap="round" />
          </svg>
        </div>
        <h1 className="font-display font-bold text-navy dark:text-white text-lg mb-2">
          Not part of your current setup
        </h1>
        <p className="text-sm text-slate dark:text-white/50 leading-relaxed mb-6">
          This page is available on the <span className="font-medium">{TIER_LABELS[requiredTier]}</span> level. You're
          currently set to <span className="font-medium">{TIER_LABELS[involvement] || TIER_LABELS.power}</span> — you
          can change that anytime.
        </p>
        <div className="flex items-center justify-center gap-3">
          <Button variant="navGold" onClick={() => navigate('/onboarding')} className="h-10 px-5 text-sm">
            Update my setup
          </Button>
          <Button variant="secondary" onClick={() => navigate('/dashboard')} className="h-10 px-5 text-sm">
            Back to Dashboard
          </Button>
        </div>
      </div>
    </div>
  )
}
