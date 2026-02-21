import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { api } from '../services/api'
import PageTransition from '../components/PageTransition'
import GlassCard from '../components/GlassCard'

function formatDate(str) {
  if (!str) return ''
  return new Date(str).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
}

export default function Announcements() {
  const [announcements, setAnnouncements] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    api.announcements
      .getAll()
      .then((data) => setAnnouncements(data.sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt))))
      .catch(() => setError('Failed to load announcements'))
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <PageTransition className="content-container">
        <header className="pt-2">
          <p className="section-label mb-2">Updates</p>
          <h1 className="page-title font-bold text-white">Announcements</h1>
        </header>
        <p className="section-spacing text-white/70">Loading...</p>
      </PageTransition>
    )
  }

  if (error) {
    return (
      <PageTransition className="content-container">
        <header className="pt-2">
          <p className="section-label mb-2">Updates</p>
          <h1 className="page-title font-bold text-white">Announcements</h1>
        </header>
        <p className="section-spacing text-red-300">{error}</p>
      </PageTransition>
    )
  }

  return (
    <PageTransition className="content-container">
      <header className="pt-2">
        <p className="section-label mb-2">Updates</p>
        <h1 className="page-title font-bold text-white">Announcements</h1>
        <p className="mt-3 max-w-2xl text-white/80">Latest updates and notices from the masjid.</p>
      </header>

      <ul className="section-spacing space-y-4">
        {announcements.map((a, i) => (
          <motion.li
            key={a.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05, duration: 0.35 }}
          >
            <GlassCard hover={false}>
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h2 className="text-lg font-semibold text-white">{a.title}</h2>
                <span className="text-sm text-white/55">{formatDate(a.publishedAt)}</span>
              </div>
              <p className="mt-3 whitespace-pre-wrap leading-relaxed text-white/85">{a.content}</p>
            </GlassCard>
          </motion.li>
        ))}
      </ul>
      {announcements.length === 0 && (
        <p className="section-spacing text-center text-white/70">No announcements at the moment.</p>
      )}
    </PageTransition>
  )
}
