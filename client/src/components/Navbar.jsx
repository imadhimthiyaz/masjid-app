import { Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, Sun, Moon } from 'lucide-react'
import { useState } from 'react'
import { useTheme } from './ThemeContext'
import { useSite } from '../contexts/SiteContext'

const links = [
  { to: '/', label: 'Home' },
  { to: '/projects', label: 'Projects' },
  { to: '/events', label: 'Events' },
  { to: '/announcements', label: 'Announcements' },
  { to: '/about', label: 'About' },
  { to: '/gallery', label: 'Gallery' },
  { to: '/contact', label: 'Contact' },
]

/* Water liquid glass: highly transparent, lets background through */
const waterGlassStyle = {
  backdropFilter: 'blur(8px) saturate(200%)',
  WebkitBackdropFilter: 'blur(48px) saturate(200%)',
  backgroundColor: 'rgba(6, 78, 59, 0.06)',
  border: '1px solid rgba(134, 239, 172, 0.12)',
  boxShadow:
    '0 25px 50px -12px rgba(0, 0, 0, 0.35), 0 0 0 1px rgba(52, 211, 153, 0.05) inset, 0 1px 0 0 rgba(167, 243, 208, 0.12) inset',
}

export default function Navbar() {
  const location = useLocation()
  const { dark, toggle } = useTheme()
  const [open, setOpen] = useState(false)
  const site = useSite()
  const siteName = site?.siteName || 'Jamiul Azhar Jumma Masjidh'

  return (
    <motion.header
      initial={{ y: -16, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="fixed left-0 right-0 top-4 z-50 w-full px-4 sm:px-6"
    >
      <nav className="glass glass-dark relative mx-auto flex max-w-6xl items-center justify-between gap-4 rounded-2xl border-white/10 bg-white/[0.06] px-4 py-2.5 shadow-[var(--shadow-glass)] backdrop-blur-xl sm:px-5 sm:py-3">
        <Link
          to="/"
          className="hero-sub min-w-0 truncate font-semibold text-white transition hover:text-emerald-200/90 sm:text-base"
        >
          {siteName}
        </Link>
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={toggle}
            className="rounded-xl p-2.5 text-white/80 transition hover:bg-white/10 hover:text-white focus-visible:ring-2 focus-visible:ring-white/20"
            aria-label="Toggle theme"
          >
            {dark ? <Sun size={20} /> : <Moon size={20} />}
          </button>
          <button
            type="button"
            className={`rounded-xl p-2.5 text-white transition sm:hidden ${open ? 'bg-white/15 text-white' : 'hover:bg-white/10'}`}
            onClick={() => setOpen((o) => !o)}
            aria-label="Menu"
            aria-expanded={open}
          >
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

        {/* Desktop: inline links */}
        <div className="absolute left-4 right-4 top-full mt-2 hidden flex-col gap-0.5 sm:static sm:mt-0 sm:flex sm:flex-row sm:gap-1 sm:rounded-none sm:border-0 sm:bg-transparent sm:py-0 sm:shadow-none">
          {links.map(({ to, label }) => (
            <Link
              key={to}
              to={to}
              className={`min-h-[2.75rem] flex items-center rounded-lg px-3 py-2 text-sm font-medium transition sm:px-4 ${
                location.pathname === to ? 'bg-white/15 text-white' : 'text-white/80 hover:bg-white/10 hover:text-white'
              }`}
            >
              {label}
            </Link>
          ))}
        </div>
      </nav>

      {/* Mobile: iPhone-style liquid glass menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.98 }}
            transition={{ duration: 0.25, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="absolute left-4 right-4 top-full z-50 mt-2 flex flex-col overflow-hidden rounded-[1.25rem] sm:hidden"
            style={waterGlassStyle}
          >
            <div className="overflow-hidden rounded-[1.25rem] p-2">
              {links.map(({ to, label }) => (
                <Link
                  key={to}
                  to={to}
                  onClick={() => setOpen(false)}
                  className={`flex min-h-[2.875rem] items-center rounded-[0.875rem] px-3.5 py-2.5 text-[0.9375rem] font-medium transition active:scale-[0.98] ${
                    location.pathname === to
                      ? 'bg-emerald-500/20 text-white'
                      : 'text-white/95 active:bg-emerald-400/10'
                  }`}
                  style={
                    location.pathname === to
                      ? {
                          boxShadow: 'inset 0 1px 0 0 rgba(167, 243, 208, 0.15)',
                        }
                      : undefined
                  }
                >
                  {label}
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  )
}
