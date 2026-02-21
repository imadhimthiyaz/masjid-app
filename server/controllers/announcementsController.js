import { readData, writeData, generateId } from '../utils/jsonStore.js'
const FILE = 'announcements.json'

export async function getAll(_, res) {
  try {
    const data = await readData(FILE)
    res.json(data)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

export async function create(req, res) {
  try {
    const data = await readData(FILE)
    const body = req.body
    const id = generateId()
    const now = new Date().toISOString()
    const announcement = {
      id,
      title: body.title || '',
      content: body.content || '',
      publishedAt: body.publishedAt || now,
      createdAt: now,
      updatedAt: now,
    }
    data.push(announcement)
    await writeData(FILE, data)
    res.status(201).json(announcement)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

export async function update(req, res) {
  try {
    const data = await readData(FILE)
    const index = data.findIndex((a) => a.id === req.params.id)
    if (index === -1) return res.status(404).json({ error: 'Announcement not found' })
    const body = req.body
    const now = new Date().toISOString()
    data[index] = {
      ...data[index],
      title: body.title !== undefined ? body.title : data[index].title,
      content: body.content !== undefined ? body.content : data[index].content,
      publishedAt: body.publishedAt !== undefined ? body.publishedAt : data[index].publishedAt,
      updatedAt: now,
    }
    await writeData(FILE, data)
    res.json(data[index])
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

export async function remove(req, res) {
  try {
    const data = await readData(FILE)
    const filtered = data.filter((a) => a.id !== req.params.id)
    if (filtered.length === data.length) return res.status(404).json({ error: 'Announcement not found' })
    await writeData(FILE, filtered)
    res.status(204).send()
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}
