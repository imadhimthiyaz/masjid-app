import { readData, writeData, generateId } from '../utils/jsonStore.js'
const FILE = 'events.json'

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
    const images = Array.isArray(body.images) ? body.images : (body.image ? [body.image] : [])
    const event = {
      id,
      title: body.title || '',
      description: body.description || '',
      date: body.date || '',
      time: body.time || '',
      location: body.location || '',
      images,
      video: body.video || '',
      createdAt: now,
      updatedAt: now,
    }
    data.push(event)
    await writeData(FILE, data)
    res.status(201).json(event)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

export async function update(req, res) {
  try {
    const data = await readData(FILE)
    const index = data.findIndex((e) => e.id === req.params.id)
    if (index === -1) return res.status(404).json({ error: 'Event not found' })
    const body = req.body
    const now = new Date().toISOString()
    const images = body.images !== undefined
      ? (Array.isArray(body.images) ? body.images : [])
      : (data[index].images ?? (data[index].image ? [data[index].image] : []))
    data[index] = {
      ...data[index],
      title: body.title !== undefined ? body.title : data[index].title,
      description: body.description !== undefined ? body.description : data[index].description,
      date: body.date !== undefined ? body.date : data[index].date,
      time: body.time !== undefined ? body.time : data[index].time,
      location: body.location !== undefined ? body.location : data[index].location,
      images,
      video: body.video !== undefined ? body.video : (data[index].video || ''),
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
    const filtered = data.filter((e) => e.id !== req.params.id)
    if (filtered.length === data.length) return res.status(404).json({ error: 'Event not found' })
    await writeData(FILE, filtered)
    res.status(204).send()
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}
