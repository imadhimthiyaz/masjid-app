import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Calendar, MapPin, Clock, ChevronLeft, ChevronRight } from 'lucide-react'
import { api } from '../services/api'
import { getImages } from '../utils/media'
import PageTransition from '../components/PageTransition'
import GlassCard from '../components/GlassCard'
import MediaBlock from '../components/MediaBlock'

function EventMedia({ event }) {
  const images = getImages(event)
  const [idx, setIdx] = useState(0)
  const current = images[idx]
  const hasMultiple = images.length > 1

  return (
    <div className="relative h-44 w-full shrink-0 overflow-hidden rounded-xl md:h-52 md:w-56">
      {current ? (
        <>
          <img src={current} alt={event.title} className="h-full w-full object-cover" />
          {hasMultiple && (
            <>
              <button type="button" onClick={() => setIdx((i) => (i - 1 + images.length) % images.length)} className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-black/50 p-1.5 text-white hover:bg-black/70">
                <ChevronLeft size={18} />
              </button>
              <button type="button" onClick={() => setIdx((i) => (i + 1) % images.length)} className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-black/50 p-1.5 text-white hover:bg-black/70">
                <ChevronRight size={18} />
              </button>
              <div className="absolute bottom-2 left-1/2 flex -translate-x-1/2 gap-1">
                {images.map((_, i) => (
                  <button key={i} type="button" onClick={() => setIdx(i)} className={`h-1.5 w-1.5 rounded-full transition ${i === idx ? 'bg-white' : 'bg-white/50'}`} aria-label={`Image ${i + 1}`} />
                ))}
              </div>
            </>
          )}
        </>
      ) : (
        <div className="flex h-full w-full items-center justify-center bg-white/5">
          <Calendar className="text-white/30" size={48} />
        </div>
      )}
    </div>
  )
}

function formatDate(str) {
  if (!str) return ''
  const d = new Date(str)
  return d.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })
}

export default function Events() {
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    api.events
      .getAll()
      .then((data) => setEvents(data.sort((a, b) => new Date(a.date) - new Date(b.date))))
      .catch(() => setError('Failed to load events'))
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <PageTransition className="content-container">
        <header className="pt-2">
          <p className="section-label mb-2">What's on</p>
          <h1 className="page-title font-bold text-white">Events</h1>
        </header>
        <p className="section-spacing text-white/70">Loading...</p>
      </PageTransition>
    )
  }

  if (error) {
    return (
      <PageTransition className="content-container">
        <header className="pt-2">
          <p className="section-label mb-2">What's on</p>
          <h1 className="page-title font-bold text-white">Events</h1>
        </header>
        <p className="section-spacing text-red-300">{error}</p>
      </PageTransition>
    )
  }

  return (
    <PageTransition className="content-container">
      <header className="pt-2">
        <p className="section-label mb-2">What's on</p>
        <h1 className="page-title font-bold text-white">Events</h1>
        <p className="mt-3 max-w-2xl text-white/80">Upcoming and ongoing events at the masjid.</p>
      </header>

      <div className="section-spacing space-y-6">
        {events.map((ev, i) => (
          <motion.div
            key={ev.id}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06, duration: 0.4 }}
          >
            <GlassCard className="flex flex-col gap-4 md:flex-row md:items-start md:gap-6" hover={false}>
              <EventMedia event={ev} />
              <div className="min-w-0 flex-1">
                <h2 className="text-xl font-semibold text-white">{ev.title}</h2>
                <div className="mt-2 flex flex-wrap gap-3 text-sm text-white/70">
                  <span className="flex items-center gap-1.5">
                    <Calendar size={14} className="shrink-0" /> {formatDate(ev.date)}
                  </span>
                  {ev.time && (
                    <span className="flex items-center gap-1.5">
                      <Clock size={14} className="shrink-0" /> {ev.time}
                    </span>
                  )}
                  {ev.location && (
                    <span className="flex items-center gap-1.5">
                      <MapPin size={14} className="shrink-0" /> {ev.location}
                    </span>
                  )}
                </div>
                <p className="mt-3 leading-relaxed text-white/85">{ev.description}</p>
                {ev.video && (
                  <div className="mt-4 max-w-xl">
                    <MediaBlock video={ev.video} title={ev.title} videoClassName="overflow-hidden rounded-xl bg-black aspect-video" />
                  </div>
                )}
              </div>
            </GlassCard>
          </motion.div>
        ))}
      </div>
      {events.length === 0 && (
        <p className="section-spacing text-center text-white/70">No events scheduled at the moment.</p>
      )}
    </PageTransition>
  )
}
