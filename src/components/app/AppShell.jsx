import { useState } from 'react'
import Sidebar from './Sidebar'
import Topbar from './Topbar'

export default function AppShell({ title, subtitle, children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="flex min-h-screen bg-surface/40 dark:bg-navy">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex-1 min-w-0">
        <Topbar onMenuClick={() => setSidebarOpen(true)} />
        <main className="p-4 sm:p-5 lg:p-8">
          {(title || subtitle) && (
            <div className="mb-5 sm:mb-6">
              {title && (
                <h1 className="font-display font-semibold text-navy dark:text-white text-lg sm:text-xl leading-snug break-words">
                  {title}
                </h1>
              )}
              {subtitle && (
                <p className="text-xs sm:text-sm text-slate dark:text-white/50 mt-1 leading-relaxed">{subtitle}</p>
              )}
            </div>
          )}
          {children}
        </main>
      </div>
    </div>
  )
}
