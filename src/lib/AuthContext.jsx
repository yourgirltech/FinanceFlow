import { createContext, useContext, useEffect, useState } from 'react'
import { supabase, isSupabaseConfigured } from './supabaseClient'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(isSupabaseConfigured)

  useEffect(() => {
    if (!isSupabaseConfigured) {
      setLoading(false)
      return
    }

    supabase.auth.getSession().then(({ data }) => {
      setUser(data.session?.user ?? null)
      setLoading(false)
    })

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    return () => listener.subscription.unsubscribe()
  }, [])

  async function signIn(email, password) {
    if (!isSupabaseConfigured) return { error: 'Supabase is not configured yet.' }
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) return { error: error.message }
    setUser(data.user)
    return { user: data.user }
  }

  async function signUp(email, password, fullName) {
    if (!isSupabaseConfigured) return { error: 'Supabase is not configured yet.' }
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: fullName } },
    })
    if (error) return { error: error.message }
    // If email confirmation is enabled in your Supabase project, data.session
    // will be null here until the user clicks the confirmation link.
    setUser(data.user)
    return { user: data.user, needsEmailConfirmation: !data.session }
  }

  async function signOut() {
    if (!isSupabaseConfigured) return
    await supabase.auth.signOut()
    setUser(null)
  }

  async function resetPasswordForEmail(email) {
    if (!isSupabaseConfigured) return { error: 'Supabase is not configured yet.' }
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    })
    if (error) return { error: error.message }
    return { success: true }
  }

  async function updatePassword(newPassword) {
    if (!isSupabaseConfigured) return { error: 'Supabase is not configured yet.' }
    const { error } = await supabase.auth.updateUser({ password: newPassword })
    if (error) return { error: error.message }
    return { success: true }
  }

  async function updateProfile({ email, fullName }) {
    if (!isSupabaseConfigured) return { error: 'Supabase is not configured yet.' }
    const payload = { data: { full_name: fullName } }
    const emailChanged = Boolean(email) && email !== user?.email
    if (emailChanged) payload.email = email

    const { data, error } = await supabase.auth.updateUser(payload)
    if (error) return { error: error.message }
    setUser(data.user)
    return { user: data.user, emailChangePending: emailChanged }
  }

  return (
    <AuthContext.Provider
      value={{ user, loading, signIn, signUp, signOut, resetPasswordForEmail, updatePassword, updateProfile, isSupabaseConfigured }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
