import { useState } from 'react'
import { Link } from 'react-router-dom'
import AuthBrandPanel from '../components/auth/AuthBrandPanel'
import Button from '../components/ui/Button'
import Logo from '../components/landing/Logo'
import { useAuth } from '../lib/AuthContext'

export default function ForgotPassword() {
  const { resetPasswordForEmail, isSupabaseConfigured } = useAuth()
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [sent, setSent] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')

    if (!isSupabaseConfigured) {
      setError('Supabase is not configured yet. Add your project credentials to .env first.')
      return
    }

    setSubmitting(true)
    const { error: resetError } = await resetPasswordForEmail(email)
    setSubmitting(false)

    if (resetError) {
      setError(resetError)
      return
    }
    setSent(true)
  }

  return (
    <div className="min-h-screen flex bg-white dark:bg-navy">
      <AuthBrandPanel
        heading="Forgot your password?"
        sub="No problem — we'll email you a secure link to set a new one."
      />

      <div className="flex-1 flex flex-col items-center justify-center px-6 py-12">
        <div className="w-full max-w-sm">
          <div className="lg:hidden mb-10 flex justify-center">
            <Logo />
          </div>

          {sent ? (
            <>
              <h1 className="font-display font-extrabold text-navy dark:text-white text-2xl tracking-tight mb-2">
                Check your inbox
              </h1>
              <p className="text-slate dark:text-white/50 text-sm mb-8 leading-relaxed">
                If an account exists for <span className="text-navy dark:text-white font-medium">{email}</span>, we've
                sent a link to reset your password. It may take a minute to arrive — check spam too.
              </p>
              <Link to="/login">
                <Button variant="secondary" className="w-full h-11">Back to log in</Button>
              </Link>
            </>
          ) : (
            <>
              <h1 className="font-display font-extrabold text-navy dark:text-white text-2xl tracking-tight mb-2">
                Reset your password
              </h1>
              <p className="text-slate dark:text-white/50 text-sm mb-8">
                Enter the email on your account and we'll send you a reset link.
              </p>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="text-xs font-medium text-slate dark:text-white/50 mb-1.5 block">Email</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="w-full h-11 rounded-xl border border-line dark:border-white/15 bg-white dark:bg-white/[0.04] px-4 text-sm text-navy dark:text-white placeholder:text-slate-light dark:placeholder:text-white/30 focus:outline-none focus:border-gold transition-colors"
                  />
                </div>

                {error && (
                  <p className="text-xs text-red bg-red-soft dark:bg-red/10 rounded-lg px-3 py-2.5">{error}</p>
                )}

                <Button type="submit" variant="navGold" disabled={submitting} className="w-full h-11 mt-2 disabled:opacity-60">
                  {submitting ? 'Sending…' : 'Send reset link'}
                </Button>
              </form>
            </>
          )}

          <p className="text-center text-sm text-slate dark:text-white/50 mt-8">
            Remembered it?{' '}
            <Link to="/login" className="text-gold font-medium hover:underline">
              Log in
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
