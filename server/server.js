import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import path from 'path'
import { fileURLToPath } from 'url'
import projectRoutes from './routes/projects.js'
import eventRoutes from './routes/events.js'
import announcementRoutes from './routes/announcements.js'
import authRoutes from './routes/auth.js'
import uploadRoutes from './routes/upload.js'
import siteRoutes from './routes/site.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const app = express()
const PORT = process.env.PORT || 3000

// Resolve uploads directory (client/public/uploads for local dev, server/uploads for production)
const uploadsPath = process.env.UPLOADS_PATH || path.join(__dirname, 'uploads')
app.use('/uploads', express.static(uploadsPath))

app.use(cors({ origin: true, credentials: true }))
app.use(express.json())

app.use('/api/auth', authRoutes)
app.use('/api/upload', uploadRoutes)
app.use('/api/projects', projectRoutes)
app.use('/api/events', eventRoutes)
app.use('/api/announcements', announcementRoutes)
app.use('/api/site', siteRoutes)

app.get('/api/health', (req, res) => res.json({ ok: true }))

// Root route: avoid 404 when someone opens http://localhost:3000 in browser
app.get('/', (req, res) => {
  res.json({
    name: 'Jamiul Azhar Jumma Masjidh API',
    message: 'Use the frontend at http://localhost:5173',
    api: '/api/projects, /api/events, /api/announcements, /api/auth, /api/upload',
  })
})

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`)
})
