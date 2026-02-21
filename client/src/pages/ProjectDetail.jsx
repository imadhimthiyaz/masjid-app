import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, Play, ChevronLeft, ChevronRight } from 'lucide-react'
import { api } from '../services/api'
import { getImages } from '../utils/media'
import PageTransition from '../components/PageTransition'
import GlassCard from '../components/GlassCard'
import MediaBlock from '../components/MediaBlock'

function ProjectMediaGallery({ project }) {
  const images = getImages(project)
  const [idx, setIdx] = useState(0)
  const current = images[idx]
  const hasMultiple = images.length > 1

  if (!current && !project.video) {
    return (
      <div className="flex min-h-[300px] items-center justify-center rounded-2xl bg-white/5">
        <span className="text-white/30">No media</span>
      </div>
    )
  }

  return (
    <div className="relative overflow-hidden rounded-2xl bg-slate-900/50">
      {current ? (
        <>
          <img src={current} alt={project.title} className="aspect-video w-full object-cover md:aspect-[21/9]" />
          {hasMultiple && (
            <>
              <button
                type="button"
                onClick={() => setIdx((i) => (i - 1 + images.length) % images.length)}
                className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-black/60 p-2.5 text-white transition hover:bg-black/80"
                aria-label="Previous image"
              >
                <ChevronLeft size={24} />
              </button>
              <button
                type="button"
                onClick={() => setIdx((i) => (i + 1) % images.length)}
                className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-black/60 p-2.5 text-white transition hover:bg-black/80"
                aria-label="Next image"
              >
                <ChevronRight size={24} />
              </button>
              <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-2">
                {images.map((_, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setIdx(i)}
                    className={`h-2 w-2 rounded-full transition ${i === idx ? 'bg-white' : 'bg-white/50 hover:bg-white/70'}`}
                    aria-label={`Image ${i + 1}`}
                  />
                ))}
              </div>
            </>
          )}
        </>
      ) : project.video ? (
        <div className="flex aspect-video items-center justify-center bg-slate-800/50">
          <Play className="text-white/40" size={64} />
        </div>
      ) : null}
      <span
        className={`absolute right-6 top-6 rounded-full px-4 py-2 text-sm font-semibold ${
          project.status === 'completed' ? 'bg-emerald-500/95 text-white' : 'bg-amber-500/95 text-white'
        }`}
      >
        {project.status === 'completed' ? 'Completed' : 'Ongoing'}
      </span>
    </div>
  )
}

export default function ProjectDetail() {
  const { id } = useParams()
  const [project, setProject] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!id) return
    api.projects
      .getById(id)
      .then(setProject)
      .catch(() => setError('Project not found'))
      .finally(() => setLoading(false))
  }, [id])

  if (loading) {
    return (
      <PageTransition className="content-container">
        <p className="section-spacing text-white/70">Loading...</p>
      </PageTransition>
    )
  }

  if (error || !project) {
    return (
      <PageTransition className="content-container">
        <header className="pt-2">
          <Link to="/projects" className="btn-secondary inline-flex items-center gap-2">
            <ArrowLeft size={18} /> Back to projects
          </Link>
        </header>
        <p className="section-spacing text-red-300">{error || 'Project not found.'}</p>
        <Link to="/projects" className="btn-primary inline-flex items-center gap-2">
          View all projects
        </Link>
      </PageTransition>
    )
  }

  const progress = project.targetAmount ? Math.min(100, (project.currentAmount / project.targetAmount) * 100) : 0

  return (
    <PageTransition className="content-container">
      <header className="pt-2">
        <Link
          to="/projects"
          className="btn-secondary inline-flex items-center gap-2"
        >
          <ArrowLeft size={18} /> Back to projects
        </Link>
      </header>

      <article className="section-spacing">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="space-y-8"
        >
          <ProjectMediaGallery project={project} />

          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-bold text-white sm:text-3xl md:text-4xl">{project.title}</h1>
              <p className="mt-4 max-w-3xl leading-relaxed text-white/85">{project.description}</p>
            </div>

            <GlassCard hover={false}>
              <h2 className="mb-4 text-lg font-semibold text-white">Donation progress</h2>
              <div className="flex items-baseline justify-between text-white">
                <span>Rs. {Number(project.currentAmount).toLocaleString()} raised</span>
                <span className="text-white/70">Rs. {Number(project.targetAmount).toLocaleString()} goal</span>
              </div>
              <div className="mt-3 h-3 overflow-hidden rounded-full bg-white/10">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 1, delay: 0.2 }}
                  className="h-full rounded-full bg-emerald-400/90"
                />
              </div>
              <p className="mt-2 text-sm text-white/65">
                {progress.toFixed(1)}% of target reached
              </p>
            </GlassCard>

            {project.video && (
              <GlassCard hover={false}>
                <h2 className="mb-4 text-lg font-semibold text-white">Project video</h2>
                <MediaBlock
                  video={project.video}
                  title={project.title}
                  className="max-w-4xl w-full"
                />
              </GlassCard>
            )}
          </div>
        </motion.div>
      </article>
    </PageTransition>
  )
}
