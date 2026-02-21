import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Play, X } from 'lucide-react'
import { api } from '../services/api'
import { getImages } from '../utils/media'
import PageTransition from '../components/PageTransition'
import GlassCard from '../components/GlassCard'
import MediaBlock from '../components/MediaBlock'

export default function Gallery() {
  const [projects, setProjects] = useState([])
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [videoModal, setVideoModal] = useState(null)

  useEffect(() => {
    Promise.all([api.projects.getAll(), api.events.getAll()])
      .then(([p, e]) => {
        setProjects(p)
        setEvents(e)
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const images = [
    ...projects.flatMap((x) => getImages(x).map((src) => ({ src, title: x.title, type: 'image' }))),
    ...events.flatMap((x) => getImages(x).map((src) => ({ src, title: x.title, type: 'image' }))),
  ]
  const videos = [
    ...projects.filter((x) => x.video).map((x) => ({ src: x.video, title: x.title })),
    ...events.filter((x) => x.video).map((x) => ({ src: x.video, title: x.title })),
  ]
  const hasMedia = images.length > 0 || videos.length > 0

  if (loading) {
    return (
      <PageTransition className="content-container">
        <header className="pt-2">
          <p className="section-label mb-2">Media</p>
          <h1 className="page-title font-bold text-white">Gallery</h1>
        </header>
        <p className="section-spacing text-white/70">Loading...</p>
      </PageTransition>
    )
  }

  return (
    <PageTransition className="content-container">
      <header className="pt-2">
        <p className="section-label mb-2">Media</p>
        <h1 className="page-title font-bold text-white">Gallery</h1>
        <p className="mt-3 max-w-2xl text-white/80">Photos and videos from our projects and events.</p>
      </header>

      {!hasMedia ? (
        <GlassCard className="section-spacing text-center" hover={false}>
          <p className="text-white/75">No media in the gallery yet. Add images or videos to projects and events in the admin panel.</p>
        </GlassCard>
      ) : (
        <>
          {images.length > 0 && (
            <section className="section-spacing">
              <h2 className="section-heading mb-4 font-semibold text-white">Photos</h2>
              <div className="grid grid-cols-2 gap-4 sm:gap-5 md:grid-cols-3 lg:grid-cols-4">
                {images.map((item, i) => (
                  <motion.div
                    key={`img-${item.src}-${i}`}
                    initial={{ opacity: 0, scale: 0.96 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.04, duration: 0.35 }}
                  >
                    <GlassCard className="overflow-hidden p-0" hover>
                      <img
                        src={item.src.startsWith('http') ? item.src : item.src}
                        alt={item.title}
                        className="h-48 w-full object-cover"
                      />
                      <p className="p-3 text-sm font-medium text-white">{item.title}</p>
                    </GlassCard>
                  </motion.div>
                ))}
              </div>
            </section>
          )}

          {videos.length > 0 && (
            <section className="section-spacing">
              <h2 className="section-heading mb-4 font-semibold text-white">Videos</h2>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {videos.map((item, i) => (
                  <motion.div
                    key={`vid-${item.src}-${i}`}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05, duration: 0.35 }}
                  >
                    <GlassCard
                      className="cursor-pointer overflow-hidden p-0 transition hover:ring-2 hover:ring-emerald-400/40"
                      onClick={() => setVideoModal(item)}
                      hover={false}
                    >
                      <div className="relative flex aspect-video items-center justify-center bg-gradient-to-br from-emerald-900/50 to-teal-900/50">
                        <span className="flex h-14 w-14 items-center justify-center rounded-full bg-white/20 text-white shadow-lg backdrop-blur-sm">
                          <Play size={28} fill="currentColor" className="ml-0.5 shrink-0" />
                        </span>
                      </div>
                      <p className="p-3 text-sm font-medium text-white">{item.title}</p>
                    </GlassCard>
                  </motion.div>
                ))}
              </div>
            </section>
          )}
        </>
      )}

      <AnimatePresence>
        {videoModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4"
            onClick={() => setVideoModal(null)}
          >
            <motion.div
              initial={{ scale: 0.92 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.92 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-4xl"
            >
              <button
                type="button"
                onClick={() => setVideoModal(null)}
                className="absolute -top-12 right-0 rounded-xl p-2 text-white transition hover:bg-white/10"
                aria-label="Close"
              >
                <X size={28} />
              </button>
              <div className="overflow-hidden rounded-2xl bg-black shadow-2xl">
                <MediaBlock
                  video={videoModal.src}
                  title={videoModal.title}
                  videoClassName="aspect-video w-full"
                />
                <p className="p-4 text-center font-medium text-white">{videoModal.title}</p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </PageTransition>
  )
}
