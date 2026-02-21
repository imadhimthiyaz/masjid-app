import express from 'express'
import multer from 'multer'
import path from 'path'
import { fileURLToPath } from 'url'
import fs from 'fs'
import { requireAuth } from '../middleware/auth.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const uploadsDir = process.env.UPLOADS_PATH || path.join(__dirname, '..', '..', 'client', 'public', 'uploads')

if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true })
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadsDir),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname) || '.jpg'
    const name = `${Date.now()}-${Math.random().toString(36).slice(2)}${ext}`
    cb(null, name)
  },
})
const upload = multer({
  storage,
  limits: { fileSize: 80 * 1024 * 1024 }, // 80MB for video
  fileFilter: (req, file, cb) => {
    const isImage = /image\/(jpeg|jpg|png|gif|webp)/.test(file.mimetype)
    const isVideo = /video\/(mp4|webm|ogg|quicktime)/.test(file.mimetype)
    if (isImage || isVideo) cb(null, true)
    else cb(new Error('Only image or video files are allowed'), false)
  },
})

const router = express.Router()
router.post('/', requireAuth, upload.single('file'), (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No file uploaded' })
  const url = `/uploads/${req.file.filename}`
  res.json({ url })
})
router.use((err, req, res, next) => {
  if (err instanceof multer.MulterError && err.code === 'LIMIT_FILE_SIZE') {
    return res.status(400).json({ error: 'File too large (max 80MB)' })
  }
  if (err) return res.status(400).json({ error: err.message || 'Upload failed' })
  next()
})
export default router
