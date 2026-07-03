import { Navigate } from 'react-router-dom'
import { useAuth } from '../../lib/AuthContext'

function SetupNotice() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-surface dark:bg-navy px-6">
      <div className="max-w-md text-center">
        <div className="h-12 w-12 rounded-2xl bg-gold-soft dark:bg-gold/15 flex items-center justify-center mx-auto mb-5">
          <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6">
            <path d="M12 9v4M12 17h.01M10.3 3.9L1.8 18a2 2 0 001.7 3h17a2 2 0 001.7-3L13.7 3.9a2 2 0 00-3.4 0z" stroke="var(--color-gold)" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <h1 className="font-display font-bold text-navy dark:text-white text-lg mb-2">Supabase isn't configured yet</h1>
        <p className="text-sm text-slate dark:text-white/50 leading-relaxed">
          Copy <code className="font-tabular text-[13px] bg-surface dark:bg-white/10 px-1.5 py-0.5 rounded">.env.example</code> to{' '}
          <code className="font-tabular text-[13px] bg-surface dark:bg-white/10 px-1.5 py-0.5 rounded">.env</code>, add your project URL
          and anon key, then restart <code className="font-tabular text-[13px] bg-surface dark:bg-white/10 px-1.5 py-0.5 rounded">npm run dev</code>.
        </p>
      </div>
    </div>
  )
}

export default function ProtectedRoute({ children }) {
  const { user, loading, isSupabaseConfigured } = useAuth()

  if (!isSupabaseConfigured) return <SetupNotice />

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface/40 dark:bg-navy">
        <div className="h-8 w-8 rounded-full border-2 border-gold border-t-transparent animate-spin" />
      </div>
    )
  }

  if (!user) return <Navigate to="/login" replace />

  return children
}
