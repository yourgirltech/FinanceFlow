import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import AuthBrandPanel from '../components/auth/AuthBrandPanel'
import Button from '../components/ui/Button'
import Logo from '../components/landing/Logo'
import { useAuth } from '../lib/AuthContext'

export default function ResetPassword() {
  const navigate = useNavigate()
  const { user, loading, updatePassword, isSupabaseConfigured } = useAuth()
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [done, setDone] = useState(false)

  // Supabase's client automatically parses the recovery token from the URL
  // (the link from the email) and establishes a temporary session 
  const linkExpired = isSupabaseConfigured && !loading && !user

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')

    if (password.length < 8) {
      setError('Password must be at least 8 characters.')
      return
    }
    if (password !== confirmPassword) {
      setError("Passwords don't match.")
      return
    }

    setSubmitting(true)
    const { error: updateError } = await updatePassword(password)
    setSubmitting(false)

    if (updateError) {
      setError(updateError)
      return
    }
    setDone(true)
    setTimeout(() => navigate('/login'), 2500)
  }

  return (
    <div className="min-h-screen flex bg-white dark:bg-navy">
      <AuthBrandPanel
        heading="Set a new password."
        sub="Choose something you haven't used before, at least 8 characters."
      />

      <div className="flex-1 flex flex-col items-center justify-center px-6 py-12">
        <div className="w-full max-w-sm">
          <div className="lg:hidden mb-10 flex justify-center">
            <Logo />
          </div>

          {loading ? (
            <div className="flex justify-center py-10">
              <div className="h-8 w-8 rounded-full border-2 border-gold border-t-transparent animate-spin" />
            </div>
          ) : done ? (
            <>
              <h1 className="font-display font-extrabold text-navy dark:text-white text-2xl tracking-tight mb-2">
                Password updated
              </h1>
              <p className="text-slate dark:text-white/50 text-sm">Taking you to log in…</p>
            </>
          ) : linkExpired ? (
            <>
              <h1 className="font-display font-extrabold text-navy dark:text-white text-2xl tracking-tight mb-2">
                This link has expired
              </h1>
              <p className="text-slate dark:text-white/50 text-sm mb-8">
                Password reset links only work once and expire after a short time. Request a new one to continue.
              </p>
              <Link to="/forgot-password">
                <Button variant="navGold" className="w-full h-11">Request a new link</Button>
              </Link>
            </>
          ) : (
            <>
              <h1 className="font-display font-extrabold text-navy dark:text-white text-2xl tracking-tight mb-2">
                Choose a new password
              </h1>
              <p className="text-slate dark:text-white/50 text-sm mb-8">
                Make it something you'll remember.
              </p>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="text-xs font-medium text-slate dark:text-white/50 mb-1.5 block">New password</label>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="At least 8 characters"
                    className="w-full h-11 rounded-xl border border-line dark:border-white/15 bg-white dark:bg-white/[0.04] px-4 text-sm text-navy dark:text-white placeholder:text-slate-light dark:placeholder:text-white/30 focus:outline-none focus:border-gold transition-colors"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-slate dark:text-white/50 mb-1.5 block">Confirm password</label>
                  <input
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Type it again"
                    className="w-full h-11 rounded-xl border border-line dark:border-white/15 bg-white dark:bg-white/[0.04] px-4 text-sm text-navy dark:text-white placeholder:text-slate-light dark:placeholder:text-white/30 focus:outline-none focus:border-gold transition-colors"
                  />
                </div>

                {error && (
                  <p className="text-xs text-red bg-red-soft dark:bg-red/10 rounded-lg px-3 py-2.5">{error}</p>
                )}

                <Button type="submit" variant="navGold" disabled={submitting} className="w-full h-11 mt-2 disabled:opacity-60">
                  {submitting ? 'Updating…' : 'Update password'}
                </Button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
