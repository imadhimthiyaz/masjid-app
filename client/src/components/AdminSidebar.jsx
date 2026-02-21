import { NavLink, useNavigate } from 'react-router-dom'
import { LayoutDashboard, FolderOpen, Calendar, Megaphone, Image as ImageIcon, LogOut, X } from 'lucide-react'
import { useAuth } from '../hooks/useAuth'
import { api } from '../services/api'

const items = [
  { to: '/admin', end: true, icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/admin/site', end: false, icon: ImageIcon, label: 'Site images' },
  { to: '/admin/projects', end: false, icon: FolderOpen, label: 'Projects' },
  { to: '/admin/events', end: false, icon: Calendar, label: 'Events' },
  { to: '/admin/announcements', end: false, icon: Megaphone, label: 'Announcements' },
]

export default function AdminSidebar({ open, onClose }) {
  const navigate = useNavigate()
  const { logout } = useAuth()

  const handleLogout = async () => {
    try {
      await api.auth.logout()
    } catch {}
    logout()
    navigate('/admin/login')
    onClose?.()
  }

  const handleNav = () => {
    onClose?.()
  }

  const navLinks = (
    <>
      {items.map(({ to, end, icon: Icon, label }) => (
        <NavLink
          key={to}
          to={to}
          end={end}
          onClick={handleNav}
          className={({ isActive }) =>
            `flex min-h-[2.75rem] touch-manipulation items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${
              isActive ? 'bg-emerald-600/30 text-emerald-300' : 'text-slate-300 hover:bg-slate-700/50 hover:text-white'
            }`
          }
        >
          <Icon size={18} className="shrink-0" />
          <span className="truncate">{label}</span>
        </NavLink>
      ))}
    </>
  )

  return (
    <>
      {/* Desktop: fixed sidebar, not scrollable */}
      <aside className="hidden h-screen w-52 shrink-0 flex-col overflow-hidden border-r border-slate-700/50 bg-slate-800/50 md:w-56 lg:flex">
        <div className="shrink-0 p-4 border-b border-slate-700/50">
          <p className="font-semibold text-white truncate">JAJM Admin</p>
          <p className="text-xs text-slate-400">Masjid Management</p>
        </div>
        <nav className="flex flex-1 min-h-0 flex-col space-y-1 overflow-hidden p-3">
          {items.map(({ to, end, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${
                  isActive ? 'bg-emerald-600/30 text-emerald-300' : 'text-slate-300 hover:bg-slate-700/50 hover:text-white'
                }`
              }
            >
              <Icon size={18} className="shrink-0" />
              <span className="truncate">{label}</span>
            </NavLink>
          ))}
        </nav>
        <div className="shrink-0 border-t border-slate-700/50 p-3">
          <a
            href="/"
            className="mb-2 flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-slate-400 hover:bg-slate-700/50 hover:text-white"
          >
            View site
          </a>
          <button
            type="button"
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-slate-400 hover:bg-slate-700/50 hover:text-red-300"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </aside>

      {/* Mobile: overlay + drawer, not scrollable */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={onClose}
          aria-hidden
        />
      )}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex h-screen w-[min(18rem,85vw)] flex-col overflow-hidden border-r border-slate-700/50 bg-slate-800 shadow-xl transition-transform duration-200 ease-out lg:hidden ${
          open ? 'translate-x-0' : '-translate-x-full'
        }`}
        aria-modal="true"
        aria-label="Navigation menu"
      >
        <div className="flex shrink-0 items-center justify-between border-b border-slate-700/50 p-3">
          <p className="font-semibold text-white">Menu</p>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2.5 text-slate-400 hover:bg-slate-700 hover:text-white touch-manipulation"
            aria-label="Close menu"
          >
            <X size={22} />
          </button>
        </div>
        <div className="flex flex-1 min-h-0 flex-col overflow-hidden">
          <nav className="flex flex-1 min-h-0 flex-col space-y-1 overflow-hidden p-3">
            {navLinks}
          </nav>
          <div className="shrink-0 border-t border-slate-700/50 p-3">
            <a
              href="/"
              onClick={handleNav}
              className="mb-2 flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-slate-400 hover:bg-slate-700/50 hover:text-white min-h-[2.75rem]"
            >
              View site
            </a>
            <button
              type="button"
              onClick={handleLogout}
              className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-slate-400 hover:bg-slate-700/50 hover:text-red-300 min-h-[2.75rem]"
            >
              <LogOut size={18} />
              Logout
            </button>
          </div>
        </div>
      </aside>
    </>
  )
}
