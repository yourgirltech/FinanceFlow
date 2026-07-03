import { Suspense, lazy } from 'react'
import { Routes, Route } from 'react-router-dom'
import { ThemeProvider, useTheme } from './lib/ThemeContext'
import { RegionProvider } from './lib/RegionContext'
import { AuthProvider } from './lib/AuthContext'
import ProtectedRoute from './components/app/ProtectedRoute'
import TierGate from './components/app/TierGate'
import Landing from './pages/Landing'
import Login from './pages/Login'
import Signup from './pages/Signup'
import ForgotPassword from './pages/ForgotPassword'
import ResetPassword from './pages/ResetPassword'
import Onboarding from './pages/Onboarding'

const Dashboard = lazy(() => import('./pages/Dashboard'))
const Transactions = lazy(() => import('./pages/Transactions'))
const Budget = lazy(() => import('./pages/Budget'))
const Analytics = lazy(() => import('./pages/Analytics'))
const Settings = lazy(() => import('./pages/Settings'))
const QuickAdd = lazy(() => import('./pages/QuickAdd'))
const ImportStatement = lazy(() => import('./pages/ImportStatement'))

function PageFallback() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-surface/40 dark:bg-navy">
      <div className="h-8 w-8 rounded-full border-2 border-gold border-t-transparent animate-spin" />
    </div>
  )
}

function AppRoot() {
  const { dark } = useTheme()
  return (
    <div className={dark ? 'dark' : ''}>
      <div className="min-h-screen bg-white dark:bg-navy transition-colors duration-300">
        <Suspense fallback={<PageFallback />}>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/onboarding" element={<ProtectedRoute><Onboarding /></ProtectedRoute>} />
            <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/quick-add" element={<ProtectedRoute><QuickAdd /></ProtectedRoute>} />
            <Route path="/transactions" element={<ProtectedRoute><Transactions /></ProtectedRoute>} />
            <Route path="/import" element={<ProtectedRoute><ImportStatement /></ProtectedRoute>} />
            <Route path="/budget" element={<ProtectedRoute><TierGate requiredTier="planner"><Budget /></TierGate></ProtectedRoute>} />
            <Route path="/analytics" element={<ProtectedRoute><TierGate requiredTier="power"><Analytics /></TierGate></ProtectedRoute>} />
            <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
          </Routes>
        </Suspense>
      </div>
    </div>
  )
}

export default function App() {
  return (
    <ThemeProvider>
      <RegionProvider>
        <AuthProvider>
          <AppRoot />
        </AuthProvider>
      </RegionProvider>
    </ThemeProvider>
  )
}
