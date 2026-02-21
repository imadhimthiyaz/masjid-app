import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight, Play, ChevronLeft, ChevronRight } from 'lucide-react'
import { api } from '../services/api'
import { getImages } from '../utils/media'
import PageTransition from '../components/PageTransition'
import GlassCard from '../components/GlassCard'

function ProjectCardMedia({ project }) {
  const images = getImages(project)
  const [idx, setIdx] = useState(0)
  const current = images[idx]
  const hasMultiple = images.length > 1

  return (
    <div className="relative aspect-video w-full overflow-hidden rounded-t-2xl">
      {current || project.video ? (
        <>
          {current ? (
            <img src={current} alt={project.title} className="h-full w-full object-cover" />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-slate-800/50">
              <Play className="text-white/40" size={40} />
            </div>
          )}
          {hasMultiple && (
            <>
              <button
                type="button"
                onClick={(e) => { e.preventDefault(); setIdx((i) => (i - 1 + images.length) % images.length) }}
                className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-black/50 p-1.5 text-white hover:bg-black/70"
                aria-label="Previous image"
              >
                <ChevronLeft size={16} />
              </button>
              <button
                type="button"
                onClick={(e) => { e.preventDefault(); setIdx((i) => (i + 1) % images.length) }}
                className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-black/50 p-1.5 text-white hover:bg-black/70"
                aria-label="Next image"
              >
                <ChevronRight size={16} />
              </button>
            </>
          )}
          <span
            className={`absolute right-3 top-3 rounded-full px-2.5 py-1 text-xs font-semibold ${
              project.status === 'completed' ? 'bg-emerald-500/95 text-white' : 'bg-amber-500/95 text-white'
            }`}
          >
            {project.status === 'completed' ? 'Completed' : 'Ongoing'}
          </span>
        </>
      ) : (
        <div className="flex h-full w-full items-center justify-center bg-white/5">
          <span className="text-white/30 text-sm">No media</span>
        </div>
      )}
    </div>
  )
}

export default function Projects() {
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    api.projects
      .getAll()
      .then(setProjects)
      .catch(() => setError('Failed to load projects'))
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <PageTransition className="content-container">
        <header className="pt-2">
          <p className="section-label mb-2">Initiatives</p>
          <h1 className="page-title font-bold text-white">Projects</h1>
        </header>
        <p className="section-spacing text-white/70">Loading...</p>
      </PageTransition>
    )
  }

  if (error) {
    return (
      <PageTransition className="content-container">
        <header className="pt-2">
          <p className="section-label mb-2">Initiatives</p>
          <h1 className="page-title font-bold text-white">Projects</h1>
        </header>
        <p className="section-spacing text-red-300">{error}</p>
      </PageTransition>
    )
  }

  return (
    <PageTransition className="content-container">
      <header className="pt-2">
        <p className="section-label mb-2">Initiatives</p>
        <h1 className="page-title font-bold text-white">Projects</h1>
        <p className="mt-3 max-w-2xl text-white/80">Ongoing and completed initiatives for our masjid and community.</p>
      </header>

      <div className="section-spacing">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((p, i) => {
            const progress = p.targetAmount ? Math.min(100, (p.currentAmount / p.targetAmount) * 100) : 0
            return (
              <motion.div
                key={p.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05, duration: 0.4 }}
              >
                <Link to={`/projects/${p.id}`} className="block h-full">
                  <GlassCard className="flex h-full flex-col overflow-hidden p-0" hover>
                    <ProjectCardMedia project={p} />
                    <div className="flex flex-1 flex-col p-5 sm:p-6">
                      <h2 className="text-lg font-semibold text-white line-clamp-2">{p.title}</h2>
                      <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-white/80">{p.description}</p>
                      <div className="mt-4 flex-1">
                        <div className="flex justify-between text-xs text-white/70">
                          <span>Rs. {Number(p.currentAmount).toLocaleString()} raised</span>
                          <span>Rs. {Number(p.targetAmount).toLocaleString()} goal</span>
                        </div>
                        <div className="mt-1.5 h-2 rounded-full bg-white/10">
                          <div
                            className="h-full rounded-full bg-emerald-400/90 transition-all duration-500"
                            style={{ width: `${progress}%` }}
                          />
                        </div>
                      </div>
                      <span className="btn-secondary mt-4 inline-flex w-full items-center justify-center gap-2 py-2.5 text-sm">
                        View more details <ArrowRight size={16} />
                      </span>
                    </div>
                  </GlassCard>
                </Link>
              </motion.div>
            )
          })}
        </div>
        {projects.length === 0 && (
          <p className="text-center text-white/70">No projects to display yet.</p>
        )}
      </div>
    </PageTransition>
  )
}
