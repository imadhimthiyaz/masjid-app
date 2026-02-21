import crypto from 'crypto'
import express from 'express'
import { loadStoredToken, saveToken } from '../utils/tokenStore.js'

const router = express.Router()
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123'

let currentAdminToken = null

export function getAdminToken() {
  return currentAdminToken
}

export function setAdminToken(token) {
  currentAdminToken = token
}

// Load persisted token on startup so auth survives server restarts
loadStoredToken().then((t) => { currentAdminToken = t }).catch(() => {})

router.post('/login', async (req, res) => {
  const { password } = req.body || {}
  if (password !== ADMIN_PASSWORD) {
    return res.status(401).json({ error: 'Invalid password' })
  }
  const token = crypto.randomBytes(32).toString('hex')
  setAdminToken(token)
  await saveToken(token).catch(() => {})
  res.json({ token })
})

router.post('/logout', async (req, res) => {
  setAdminToken(null)
  await saveToken(null).catch(() => {})
  res.json({ ok: true })
})

export default router
