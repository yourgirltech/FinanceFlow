import { Suspense, lazy } from 'react'
import { Routes, Route } from 'react-router-dom'
import { ThemeProvider, useTheme } from './lib/ThemeContext'
import { RegionProvider } from './lib/RegionContext'
import Landing from './pages/Landing'
import Login from './pages/Login'
import Signup from './pages/Signup'

const Dashboard = lazy(() => import('./pages/Dashboard'))
const Transactions = lazy(() => import('./pages/Transactions'))
const Budget = lazy(() => import('./pages/Budget'))
const Analytics = lazy(() => import('./pages/Analytics'))
const Settings = lazy(() => import('./pages/Settings'))

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
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/transactions" element={<Transactions />} />
            <Route path="/budget" element={<Budget />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/settings" element={<Settings />} />
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
        <AppRoot />
      </RegionProvider>
    </ThemeProvider>
  )
}
