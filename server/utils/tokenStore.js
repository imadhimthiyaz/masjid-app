import fs from 'fs/promises'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const TOKEN_FILE = path.join(__dirname, '..', 'data', '.admin-token')

export async function loadStoredToken() {
  try {
    const raw = await fs.readFile(TOKEN_FILE, 'utf-8')
    return (raw && raw.trim()) || null
  } catch (err) {
    if (err.code === 'ENOENT') return null
    throw err
  }
}

export async function saveToken(token) {
  await fs.mkdir(path.dirname(TOKEN_FILE), { recursive: true })
  if (token) {
    await fs.writeFile(TOKEN_FILE, token, 'utf-8')
  } else {
    try {
      await fs.unlink(TOKEN_FILE)
    } catch (err) {
      if (err.code !== 'ENOENT') throw err
    }
  }
}
