import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import AppShell from '../components/app/AppShell'
import Toggle from '../components/app/Toggle'
import Button from '../components/ui/Button'
import { useTheme } from '../lib/ThemeContext'
import { useRegion } from '../lib/RegionContext'
import { useAuth } from '../lib/AuthContext'
import { getOnboardingState } from '../lib/onboarding'
import { useTransactionsStore } from '../lib/useTransactionsStore'
import { useNotificationPrefs } from '../lib/useNotificationPrefs'
import ConfirmDeleteModal from '../components/app/ConfirmDeleteModal'

function SectionCard({ title, description, children }) {
  return (
    <div className="rounded-2xl bg-white dark:bg-white/[0.04] border border-line dark:border-white/10 p-6 mb-5">
      <h2 className="font-display font-bold text-navy dark:text-white text-[15px] mb-1">{title}</h2>
      {description && <p className="text-xs text-slate dark:text-white/40 mb-5">{description}</p>}
      {children}
    </div>
  )
}

export default function Settings() {
  const navigate = useNavigate()
  const { dark, toggle } = useTheme()
  const { region, setRegionCode, regions } = useRegion()
  const { user, updateProfile, isSupabaseConfigured } = useAuth()
  const onboarding = getOnboardingState(user?.id)
  const { transactions, loadSampleData, clearAllTransactions } = useTransactionsStore(region, user?.id)
  const { prefs, setPref } = useNotificationPrefs(user?.id)
  const [confirmClear, setConfirmClear] = useState(false)

  const [name, setName] = useState(user?.user_metadata?.full_name || '')
  const [email, setEmail] = useState(user?.email || '')
  const [profileSaving, setProfileSaving] = useState(false)
  const [profileMessage, setProfileMessage] = useState(null) // { type: 'success' | 'error' | 'pending', text }

  const involvementLabels = { simple: '🌱 Simple', planner: '📊 Planner', power: '🚀 Power User' }
  const trackingLabels = {
    'quick-add': '⚡ Quick Add',
    manual: '✍️ Manual Tracking',
    import: '📄 Import Statement',
    bank: '🏦 Bank Connection',
  }

  async function handleSaveProfile() {
    setProfileMessage(null)
    if (!isSupabaseConfigured) {
      setProfileMessage({ type: 'error', text: 'Supabase is not configured yet.' })
      return
    }
    if (!name.trim()) {
      setProfileMessage({ type: 'error', text: 'Name cannot be empty.' })
      return
    }
    setProfileSaving(true)
    const { error, emailChangePending } = await updateProfile({ email: email.trim(), fullName: name.trim() })
    setProfileSaving(false)

    if (error) {
      setProfileMessage({ type: 'error', text: error })
      return
    }
    setProfileMessage(
      emailChangePending
        ? { type: 'pending', text: 'Saved. Check your new email inbox to confirm the change.' }
        : { type: 'success', text: 'Profile updated.' }
    )
  }

  return (
    <AppShell title="Settings" subtitle="Manage your profile, appearance, and notifications">
      <div className="max-w-2xl">
        <SectionCard title="Profile" description="This information is shown across your dashboard.">
          <div className="flex items-center gap-4 mb-6">
            <div className="h-16 w-16 rounded-full bg-gold/90 flex items-center justify-center text-navy text-xl font-bold font-display">
              {(name || email || 'F').trim().charAt(0).toUpperCase()}
            </div>
            <Button variant="secondary" className="px-4 h-9 text-xs">
              Change photo
            </Button>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-medium text-slate dark:text-white/50 mb-1.5 block">Full name</label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
                className="w-full h-10 rounded-xl border border-line dark:border-white/15 bg-white dark:bg-white/[0.04] px-3.5 text-sm text-navy dark:text-white focus:outline-none focus:border-gold transition-colors"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-slate dark:text-white/50 mb-1.5 block">Email</label>
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full h-10 rounded-xl border border-line dark:border-white/15 bg-white dark:bg-white/[0.04] px-3.5 text-sm text-navy dark:text-white focus:outline-none focus:border-gold transition-colors"
              />
            </div>
          </div>
          {profileMessage && (
            <p
              className={`text-xs mt-3 rounded-lg px-3 py-2.5 ${
                profileMessage.type === 'error'
                  ? 'text-red bg-red-soft dark:bg-red/10'
                  : profileMessage.type === 'pending'
                  ? 'text-gold bg-gold-soft dark:bg-gold/10'
                  : 'text-emerald bg-emerald-soft dark:bg-emerald/10'
              }`}
            >
              {profileMessage.text}
            </p>
          )}
          <div className="mt-5">
            <Button variant="navGold" onClick={handleSaveProfile} disabled={profileSaving} className="px-5 h-10 text-sm disabled:opacity-60">
              {profileSaving ? 'Saving…' : 'Save changes'}
            </Button>
          </div>
        </SectionCard>

        <SectionCard title="How you track money" description="Set during onboarding — change it anytime.">
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div className="flex items-center gap-4 sm:gap-6 flex-wrap min-w-0">
              <div className="min-w-0">
                <p className="text-[11px] text-slate-light dark:text-white/35 mb-0.5">Involvement level</p>
                <p className="text-sm text-navy dark:text-white font-medium truncate">
                  {onboarding.involvement ? involvementLabels[onboarding.involvement] : 'Not set'}
                </p>
              </div>
              <div className="min-w-0">
                <p className="text-[11px] text-slate-light dark:text-white/35 mb-0.5">Tracking style</p>
                <p className="text-sm text-navy dark:text-white font-medium truncate">
                  {onboarding.trackingStyle ? trackingLabels[onboarding.trackingStyle] : 'Not set'}
                </p>
              </div>
            </div>
            <Button variant="secondary" onClick={() => navigate('/onboarding')} className="h-9 px-4 text-xs shrink-0">
              Retake setup
            </Button>
          </div>
        </SectionCard>

        <SectionCard title="Appearance" description="Choose how Finance Flow looks on your device.">
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => dark && toggle()}
              className={`rounded-xl border-2 p-4 text-left transition-colors ${
                !dark ? 'border-gold' : 'border-line dark:border-white/10'
              }`}
            >
              <div className="h-14 rounded-lg bg-surface border border-line mb-3" />
              <p className="text-sm font-medium text-navy dark:text-white">Light</p>
            </button>
            <button
              onClick={() => !dark && toggle()}
              className={`rounded-xl border-2 p-4 text-left transition-colors ${
                dark ? 'border-gold' : 'border-line dark:border-white/10'
              }`}
            >
              <div className="h-14 rounded-lg bg-navy border border-white/10 mb-3" />
              <p className="text-sm font-medium text-navy dark:text-white">Dark</p>
            </button>
          </div>
        </SectionCard>

        <SectionCard title="Region & currency" description="Sample figures across the app are shown in this currency.">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
            {regions.map((r) => (
              <button
                key={r.code}
                onClick={() => setRegionCode(r.code)}
                className={`flex items-center gap-2 rounded-xl border px-3 py-2.5 text-left transition-colors ${
                  r.code === region.code
                    ? 'border-gold bg-gold-soft/40 dark:bg-gold/10'
                    : 'border-line dark:border-white/10 hover:border-slate-light dark:hover:border-white/25'
                }`}
              >
                <span>{r.flag}</span>
                <span className="text-xs text-navy dark:text-white font-medium truncate">{r.country}</span>
              </button>
            ))}
          </div>
        </SectionCard>

        <SectionCard title="Notifications" description="Choose what you want to hear about.">
          <Toggle
            label="Weekly summary"
            description="A recap of income, spending, and savings every Monday."
            checked={prefs.weeklySummary}
            onChange={(v) => setPref('weeklySummary', v)}
          />
          <Toggle
            label="Budget alerts"
            description="Get notified when a category is close to its limit."
            checked={prefs.budgetAlerts}
            onChange={(v) => setPref('budgetAlerts', v)}
          />
          <Toggle
            label="Large transactions"
            description="Alerts for any transaction above a threshold you set."
            checked={prefs.largeTransactions}
            onChange={(v) => setPref('largeTransactions', v)}
          />
          <Toggle
            label="Product updates"
            description="Occasional news about new Finance Flow features."
            checked={prefs.productUpdates}
            onChange={(v) => setPref('productUpdates', v)}
          />
        </SectionCard>

        <SectionCard title="Data" description="Your account starts empty — these are the only ways to add or remove bulk data.">
          <div className="flex flex-wrap items-center gap-3">
            <Button variant="secondary" onClick={loadSampleData} className="h-9 px-4 text-xs">
              Load sample data
            </Button>
            <button
              onClick={() => setConfirmClear(true)}
              disabled={transactions.length === 0}
              className="h-9 px-4 text-xs rounded-full border border-red/30 text-red hover:bg-red-soft dark:hover:bg-red/10 hover:border-red/50 disabled:opacity-40 disabled:pointer-events-none transition-colors"
            >
              Clear all my data
            </button>
          </div>
          <p className="text-[11px] text-slate-light dark:text-white/35 mt-3">
            "Load sample data" fills your account with example transactions so you can explore the app — useful for a demo, not something a real new account starts with.
          </p>
        </SectionCard>

        <ConfirmDeleteModal
          open={confirmClear}
          onClose={() => setConfirmClear(false)}
          onConfirm={() => { clearAllTransactions(); setConfirmClear(false) }}
          title="Clear all your data?"
          description="all your transactions"
        />
      </div>
    </AppShell>
  )
}
