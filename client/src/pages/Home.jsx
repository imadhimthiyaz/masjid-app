import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight, Heart, Play } from 'lucide-react'
import PageTransition from '../components/PageTransition'
import GlassCard from '../components/GlassCard'
import AnimatedCounter from '../components/AnimatedCounter'
import { useEffect, useState } from 'react'
import { api } from '../services/api'
import { useSite } from '../contexts/SiteContext'
import { getFirstImage } from '../utils/media'

export default function Home() {
  const site = useSite()
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [donationTotal, setDonationTotal] = useState({ current: 0, target: 0 })

  const heroImage = site?.heroImage || ''
  const welcomeSubtitle = site?.welcomeSubtitle ?? 'Welcome to'
  const heroTitleLine1 = site?.heroTitleLine1 ?? 'Jamiul Azhar'
  const heroTitleLine2 = site?.heroTitleLine2 ?? 'Jumma Masjidh'
  const heroTagline = site?.heroTagline ?? 'A house of worship and community at the heart of our neighbourhood.'
  const prayerTimesNote = site?.prayerTimesNote ?? 'Prayer times will be displayed here. Contact the masjid for the current schedule.'
  const footerQuote = site?.footerQuote ?? 'May Allah accept our efforts and your support.'

  useEffect(() => {
    api.projects
      .getAll()
      .then((data) => {
        setProjects(data)
        const current = data.reduce((s, p) => s + (p.currentAmount || 0), 0)
        const target = data.reduce((s, p) => s + (p.targetAmount || 0), 0)
        setDonationTotal({ current, target })
      })
      .catch(() => setProjects([]))
      .finally(() => setLoading(false))
  }, [])

  const featured = projects.filter((p) => p.status === 'ongoing').slice(0, 2)
  const progress = donationTotal.target > 0 ? (donationTotal.current / donationTotal.target) * 100 : 0

  return (
    <PageTransition>
      {/* Hero */}
      <section className="relative flex min-h-[58vh] w-full flex-col items-center justify-center px-4 py-14 sm:min-h-[65vh] sm:py-18 md:min-h-[72vh] md:py-22 lg:min-h-[78vh] xl:min-h-[82vh]">
        <div
          className="absolute inset-0"
          style={{
            backgroundColor: '#064e3b',
            backgroundImage: heroImage
              ? `linear-gradient(to bottom, rgba(4,47,46,0.55) 0%, rgba(6,78,59,0.52) 50%, rgba(4,47,46,0.58) 100%), url(${heroImage})`
              : 'linear-gradient(135deg, #052e22 0%, #065f46 45%, #134e4a 100%)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/25 via-transparent to-black/40" />
        <div className="relative z-10 mx-auto max-w-4xl text-center">
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.4 }}
            className="hero-sub font-medium uppercase tracking-[0.2em] text-emerald-200/90"
          >
            {welcomeSubtitle}
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.4 }}
            className="hero-title mt-2 font-bold tracking-tight text-white drop-shadow-md [&>span]:text-emerald-200/95"
          >
            {heroTitleLine1}
            <br />
            <span>{heroTitleLine2}</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35, duration: 0.4 }}
            className="hero-tagline mt-5 max-w-2xl mx-auto text-white/90"
          >
            {heroTagline}
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.4 }}
            className="mt-8 flex flex-wrap items-center justify-center gap-3 sm:mt-10 sm:gap-4"
          >
            <Link to="/projects" className="btn-primary">
              Support our projects <ArrowRight size={20} className="shrink-0" />
            </Link>
            <Link to="/events" className="btn-secondary">
              View events
            </Link>
          </motion.div>
        </div>
      </section>

      <div className="content-container section-spacing">
        <section className="section-spacing">
          <p className="section-label mb-3">Information</p>
          <h2 className="section-heading mb-5 font-semibold text-white">Prayer times</h2>
          <GlassCard>
            <p className="leading-relaxed text-white/85">{prayerTimesNote}</p>
          </GlassCard>
        </section>

        <section className="section-spacing">
          <p className="section-label mb-3">Community</p>
          <h2 className="section-heading mb-5 font-semibold text-white">Donation progress</h2>
          <GlassCard>
            <div className="flex items-baseline gap-2 text-white">
              <AnimatedCounter value={Math.round(progress)} suffix="%" />
              <span className="text-white/70">of community goal</span>
            </div>
            <div className="mt-3 h-3 overflow-hidden rounded-full bg-white/10">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 1, delay: 0.3 }}
                className="h-full rounded-full bg-emerald-400/90"
              />
            </div>
            <p className="mt-2 text-sm text-white/65">
              <AnimatedCounter prefix="Rs. " value={donationTotal.current} /> / Rs. {donationTotal.target.toLocaleString()} raised
            </p>
          </GlassCard>
        </section>

        <section className="section-spacing">
          <p className="section-label mb-3">Initiatives</p>
          <h2 className="section-heading mb-5 font-semibold text-white">Featured projects</h2>
          {loading ? (
            <p className="text-white/70">Loading...</p>
          ) : featured.length === 0 ? (
            <p className="text-white/70">No ongoing projects at the moment.</p>
          ) : (
            <div className="grid gap-6 sm:gap-8 md:grid-cols-2">
              {featured.map((p, i) => (
                <motion.div
                  key={p.id}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.08, duration: 0.4 }}
                >
                  <GlassCard className="overflow-hidden p-0" hover>
                    <div className="relative h-52 w-full shrink-0 overflow-hidden rounded-t-2xl bg-white/5 sm:h-56">
                      {getFirstImage(p) ? (
                        <img
                          src={getFirstImage(p)}
                          alt={p.title}
                          className="h-full w-full object-cover"
                        />
                      ) : p.video ? (
                        <div className="flex h-full items-center justify-center bg-slate-800/50">
                          <Play className="text-white/50" size={48} />
                        </div>
                      ) : (
                        <div className="h-full w-full bg-gradient-to-br from-emerald-800/30 to-teal-800/30" />
                      )}
                      <span
                        className={`absolute right-3 top-3 rounded-full px-3 py-1 text-xs font-semibold ${
                          p.status === 'completed' ? 'bg-emerald-500/95 text-white' : 'bg-amber-500/95 text-white'
                        }`}
                      >
                        {p.status === 'completed' ? 'Completed' : 'Ongoing'}
                      </span>
                    </div>
                    <div className="p-5 sm:p-6">
                      <h3 className="text-lg font-semibold text-white">{p.title}</h3>
                      <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-white/80">{p.description}</p>
                      <div className="mt-4 h-2 rounded-full bg-white/10">
                        <div
                          className="h-full rounded-full bg-emerald-400/90 transition-all duration-500"
                          style={{ width: `${p.targetAmount ? (p.currentAmount / p.targetAmount) * 100 : 0}%` }}
                        />
                      </div>
                      <Link
                        to="/projects"
                        className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-emerald-300 transition hover:text-emerald-200"
                      >
                        View project <ArrowRight size={14} />
                      </Link>
                    </div>
                  </GlassCard>
                </motion.div>
              ))}
            </div>
          )}
        </section>

        <motion.section
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: '-40px' }}
          className="section-spacing text-center"
        >
          <p className="inline-flex items-center gap-2 text-white/75">
            <Heart size={18} className="text-red-400/80 shrink-0" /> {footerQuote}
          </p>
        </motion.section>
      </div>
    </PageTransition>
  )
}
