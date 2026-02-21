import { getAdminToken } from '../routes/auth.js'

/**
 * Protect admin routes: require Authorization: Bearer <token>.
 * Token is set on successful login (in-memory).
 */
export function requireAuth(req, res, next) {
  const authHeader = req.headers.authorization
  const token = authHeader && authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null
  const adminToken = getAdminToken()

  if (!adminToken || token !== adminToken) {
    return res.status(401).json({ error: 'Unauthorized' })
  }
  next()
}
