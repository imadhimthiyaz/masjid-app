import { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { api } from '../services/api'
import { useAuth } from '../hooks/useAuth'

export default function AdminLogin() {
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  const { login, isAuthenticated } = useAuth()

  useEffect(() => {
    if (searchParams.get('session') === 'expired') {
      setError('Session expired. Please log in again.')
      setSearchParams({}, { replace: true })
    }
  }, [searchParams, setSearchParams])

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/admin', { replace: true })
    }
  }, [isAuthenticated, navigate])

  if (isAuthenticated) return null

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const { token } = await api.auth.login(password)
      login(token)
      navigate('/admin', { replace: true })
    } catch (err) {
      setError(err.message || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#0f172a] p-4">
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-950/30 via-transparent to-teal-950/20" aria-hidden />
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="relative w-full max-w-md rounded-2xl border border-white/10 bg-white/[0.06] p-8 shadow-glass backdrop-blur-xl"
      >
        <h1 className="text-xl font-semibold tracking-tight text-white sm:text-2xl">Admin Login</h1>
        <p className="mt-1.5 text-sm text-white/65">Jamiul Azhar Jumma Masjidh</p>
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-white/80">Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 w-full rounded-xl border border-white/20 bg-white/10 px-4 py-2.5 text-white placeholder-white/40 focus:border-emerald-400/50 focus:outline-none focus:ring-2 focus:ring-emerald-400/30 focus-visible:ring-2 focus-visible:ring-emerald-400/30"
              placeholder="Enter admin password"
              required
              autoFocus
            />
          </div>
          {error && <p className="text-sm text-red-300">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-emerald-600 px-4 py-2.5 font-medium text-white transition hover:bg-emerald-500 disabled:opacity-50"
          >
            {loading ? 'Signing in...' : 'Sign in'}
          </button>
        </form>
        <a href="/" className="mt-4 block text-center text-sm text-white/60 hover:text-white">Back to site</a>
      </motion.div>
    </div>
  )
}
