import { motion } from 'framer-motion'

export default function GlassCard({ children, className = '', hover = true, ...props }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] }}
      className={`glass glass-dark rounded-2xl border border-white/10 p-6 shadow-glass backdrop-blur-xl ${hover ? 'transition hover:border-white/15 hover:bg-white/[0.08] hover:shadow-glass-lg' : ''} ${className}`}
      {...props}
    >
      {children}
    </motion.div>
  )
}
