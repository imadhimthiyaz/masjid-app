import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FolderOpen, Calendar, Megaphone, ArrowRight } from 'lucide-react'
import { api } from '../services/api'

export default function AdminDashboard() {
  const [counts, setCounts] = useState({ projects: 0, events: 0, announcements: 0 })

  useEffect(() => {
    Promise.all([api.projects.getAll(), api.events.getAll(), api.announcements.getAll()])
      .then(([p, e, a]) => setCounts({ projects: p.length, events: e.length, announcements: a.length }))
      .catch(() => {})
  }, [])

  const cards = [
    { to: '/admin/projects', label: 'Projects', count: counts.projects, icon: FolderOpen },
    { to: '/admin/events', label: 'Events', count: counts.events, icon: Calendar },
    { to: '/admin/announcements', label: 'Announcements', count: counts.announcements, icon: Megaphone },
  ]

  return (
    <div>
      <h1 className="text-xl font-bold text-white sm:text-2xl">Dashboard</h1>
      <p className="mt-1 text-slate-400">Manage masjid content.</p>
      <div className="mt-8 grid gap-6 sm:grid-cols-3">
        {cards.map((c, i) => (
          <motion.div
            key={c.to}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
          >
            <Link
              to={c.to}
              className="block rounded-2xl border border-slate-600/50 bg-slate-800/50 p-6 transition hover:border-emerald-500/30 hover:bg-slate-800"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-3xl font-bold text-white">{c.count}</p>
                  <p className="mt-1 text-slate-400">{c.label}</p>
                </div>
                <c.icon className="text-slate-500" size={32} />
              </div>
              <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-emerald-400">
                Manage <ArrowRight size={14} />
              </span>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
