import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'

const liquidGlassStyle = {
  backdropFilter: 'blur(16px) saturate(180%)',
  WebkitBackdropFilter: 'blur(16px) saturate(180%)',
  backgroundColor: 'rgba(6, 78, 59, 0.08)',
  borderTop: '1px solid rgba(134, 239, 172, 0.15)',
  boxShadow: '0 -8px 32px rgba(0, 0, 0, 0.2), 0 1px 0 0 rgba(167, 243, 208, 0.08) inset',
}

export default function FixedCreditFooter({ visible }) {
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: 0, opacity: 1 }}
          exit={{ y: 60, opacity: 0 }}
          transition={{ duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="fixed bottom-0 left-0 right-0 z-40 py-2.5 sm:py-3"
          style={liquidGlassStyle}
        >
          <p className="text-center text-xs font-medium text-white/80 sm:text-sm">
            Design and Developed By{' '}
            <Link to="/admin" className="font-semibold text-emerald-200/95 transition hover:text-emerald-100">
              IMADH IMTHIYAS
            </Link>
          </p>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
