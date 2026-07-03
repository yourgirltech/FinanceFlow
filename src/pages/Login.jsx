import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import AuthBrandPanel from '../components/auth/AuthBrandPanel'
import Button from '../components/ui/Button'
import Logo from '../components/landing/Logo'
import { useAuth } from '../lib/AuthContext'

export default function Login() {
  const navigate = useNavigate()
  const { signIn, isSupabaseConfigured } = useAuth()
  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')

    if (!isSupabaseConfigured) {
      setError('Supabase is not configured yet. Add your project credentials to .env to enable real login.')
      return
    }

    setSubmitting(true)
    const { error: signInError } = await signIn(email, password)
    setSubmitting(false)

    if (signInError) {
      setError(signInError)
      return
    }
    navigate('/dashboard')
  }

  return (
    <div className="min-h-screen flex bg-white dark:bg-navy">
      <AuthBrandPanel
        heading="Take control of your money, one flow at a time."
        sub="Log in to see exactly where your money went this month — and what to do about it."
      />

      <div className="flex-1 flex flex-col items-center justify-center px-6 py-12">
        <div className="w-full max-w-sm">
          <div className="lg:hidden mb-10 flex justify-center">
            <Logo />
          </div>

          <h1 className="font-display font-extrabold text-navy dark:text-white text-2xl tracking-tight mb-2">
            Welcome back
          </h1>
          <p className="text-slate dark:text-white/50 text-sm mb-8">
            Log in to your Finance Flow account.
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
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-medium text-slate dark:text-white/50">Password</label>
                <a href="#" className="text-xs text-gold hover:underline">Forgot password?</a>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full h-11 rounded-xl border border-line dark:border-white/15 bg-white dark:bg-white/[0.04] px-4 pr-11 text-sm text-navy dark:text-white placeholder:text-slate-light dark:placeholder:text-white/30 focus:outline-none focus:border-gold transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((s) => !s)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-light dark:text-white/35 hover:text-navy dark:hover:text-white"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4">
                    {showPassword ? (
                      <path d="M3 3l18 18M10.6 10.6a2 2 0 002.8 2.8M9.5 5.2A9.8 9.8 0 0112 5c5 0 9 4 10 7-.4 1.2-1.2 2.6-2.3 3.8M6.5 6.6C4.6 8 3.2 9.9 2 12c1 3 5 7 10 7 1.2 0 2.4-.2 3.5-.6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                    ) : (
                      <>
                        <path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7-10-7-10-7z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
                        <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.6" />
                      </>
                    )}
                  </svg>
                </button>
              </div>
            </div>

            {error && (
              <p className="text-xs text-red bg-red-soft dark:bg-red/10 rounded-lg px-3 py-2.5">{error}</p>
            )}

            <Button type="submit" variant="navGold" disabled={submitting} className="w-full h-11 mt-2 disabled:opacity-60">
              {submitting ? 'Logging in…' : 'Log in'}
            </Button>
          </form>

          <p className="text-center text-sm text-slate dark:text-white/50 mt-8">
            Don't have an account?{' '}
            <Link to="/signup" className="text-gold font-medium hover:underline">
              Sign up free
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
