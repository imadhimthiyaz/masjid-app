import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Heart } from 'lucide-react'
import { useSite } from '../contexts/SiteContext'

const container = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.06, delayChildren: 0.08 },
  },
}

const item = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0 },
}

const footerGlassStyle = {
  backdropFilter: 'blur(24px) saturate(180%)',
  WebkitBackdropFilter: 'blur(24px) saturate(180%)',
  backgroundColor: 'rgba(4, 47, 46, 0.25)',
  borderTop: '1px solid rgba(134, 239, 172, 0.12)',
  boxShadow:
    '0 -4px 48px -8px rgba(0, 0, 0, 0.25), inset 0 1px 0 0 rgba(255, 255, 255, 0.04), inset 0 -1px 0 0 rgba(0, 0, 0, 0.1)',
}

export default function Footer() {
  const site = useSite()
  const siteName = site?.siteName || 'Jamiul Azhar Jumma Masjidh'
  const footerTagline = site?.footerTagline || 'Serving the community with faith and compassion.'
  const footerQuote = site?.footerQuote || 'May Allah accept our efforts and your support.'

  return (
    <motion.footer
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-100px 0px 0px 0px', amount: 0.15 }}
      transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="relative mt-auto w-full overflow-hidden"
      style={footerGlassStyle}
    >
      <div
        className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-emerald-400/20 to-transparent"
        aria-hidden
      />

      <div className="content-container py-14 sm:py-16 lg:py-18">
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px', amount: 0.15 }}
        >
          <motion.div variants={item}>
            <Link to="/" className="inline-block">
              <p className="text-xl font-bold tracking-tight text-white sm:text-2xl">{siteName}</p>
            </Link>
            <p className="mt-3 max-w-sm text-sm leading-relaxed text-white/65">{footerTagline}</p>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ delay: 0.25, duration: 0.45 }}
          className="mt-10 flex items-center justify-center gap-2 rounded-2xl border border-white/[0.06] bg-white/[0.03] px-6 py-4"
        >
          <Heart className="h-4 w-4 shrink-0 text-emerald-400/70" size={16} />
          <p className="text-center text-sm text-white/70">{footerQuote}</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, amount: 0.1 }}
          transition={{ delay: 0.35 }}
          className="mt-10 flex flex-col items-center gap-4 border-t border-white/[0.08] pt-8 sm:flex-row sm:justify-between"
        >
          <p className="text-xs text-white/50">
            © {new Date().getFullYear()} {siteName}
          </p>
          <p className="text-xs font-medium text-white/70">
            Design and Developed By{' '}
            <Link to="/admin" className="font-semibold text-emerald-300/95 transition hover:text-emerald-200">
              IMADH IMTHIYAS
            </Link>
          </p>
        </motion.div>
      </div>
    </motion.footer>
  )
}
