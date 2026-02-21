import { useState } from 'react'
import { Outlet, Navigate } from 'react-router-dom'
import { Menu } from 'lucide-react'
import AdminSidebar from '../components/AdminSidebar'
import AdminFooter from '../components/AdminFooter'
import { useAuth } from '../hooks/useAuth'

export default function AdminLayout() {
  const { isAuthenticated, loading } = useAuth()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900">
        <div className="text-white">Loading...</div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />
  }

  return (
    <div className="flex h-screen min-h-screen max-h-screen overflow-hidden bg-slate-900">
      <AdminSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
        <header className="flex shrink-0 items-center gap-3 border-b border-slate-700/50 bg-slate-800/80 px-4 py-3 lg:hidden">
          <button
            type="button"
            onClick={() => setSidebarOpen(true)}
            className="rounded-lg p-2.5 text-slate-300 hover:bg-slate-700 hover:text-white touch-manipulation"
            aria-label="Open menu"
          >
            <Menu size={24} />
          </button>
          <span className="font-semibold text-white truncate">JAJM Admin</span>
        </header>
        <main className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden p-4 sm:p-6">
          <Outlet />
        </main>
        <AdminFooter />
      </div>
    </div>
  )
}
