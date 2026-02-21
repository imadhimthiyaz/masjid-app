import { createContext, useContext, useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const ToastContext = createContext(null)

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])
  const add = useCallback((message, type = 'info') => {
    const id = Date.now()
    setToasts((t) => [...t, { id, message, type }])
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 4000)
  }, [])
  return (
    <ToastContext.Provider value={{ add }}>
      {children}
      <ToastList toasts={toasts} />
    </ToastContext.Provider>
  )
}

function ToastList({ toasts }) {
  return (
    <div className="fixed bottom-4 right-4 z-[100] flex flex-col gap-2">
      <AnimatePresence>
        {toasts.map((t) => (
          <motion.div
            key={t.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, x: 100 }}
            className={`rounded-2xl px-4 py-3 shadow-lg backdrop-blur-xl border ${
              t.type === 'success' ? 'bg-emerald-500/20 border-emerald-400/30 text-emerald-100' :
              t.type === 'error' ? 'bg-red-500/20 border-red-400/30 text-red-100' :
              'bg-white/10 border-white/20 text-white'
            }`}
          >
            {t.message}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}

export function useToast() {
  const ctx = useContext(ToastContext)
  return ctx || { add: () => {} }
}

export function Toaster() {
  return null
}
