import fs from 'fs/promises'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const DATA_DIR = path.join(__dirname, '..', 'data')

/**
 * Read and parse a JSON data file.
 * @param {string} filename - e.g. 'projects.json'
 * @returns {Promise<Array>}
 */
export async function readData(filename) {
  const filePath = path.join(DATA_DIR, filename)
  try {
    const raw = await fs.readFile(filePath, 'utf-8')
    return JSON.parse(raw)
  } catch (err) {
    if (err.code === 'ENOENT') return []
    throw err
  }
}

/**
 * Write data array to a JSON file.
 * @param {string} filename
 * @param {Array} data
 */
export async function writeData(filename, data) {
  const filePath = path.join(DATA_DIR, filename)
  await fs.mkdir(path.dirname(filePath), { recursive: true })
  await fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf-8')
}

/**
 * Generate a simple unique id from timestamp + random.
 */
export function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2)
}
