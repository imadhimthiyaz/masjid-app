import { readData, writeData, generateId } from '../utils/jsonStore.js'
const FILE = 'projects.json'

export async function getAll(_, res) {
  try {
    const data = await readData(FILE)
    res.json(data)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

export async function getById(req, res) {
  try {
    const data = await readData(FILE)
    const project = data.find((p) => p.id === req.params.id)
    if (!project) return res.status(404).json({ error: 'Project not found' })
    res.json(project)
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
    const project = {
      id,
      title: body.title || '',
      description: body.description || '',
      status: body.status || 'ongoing',
      targetAmount: Number(body.targetAmount) || 0,
      currentAmount: Number(body.currentAmount) || 0,
      images,
      video: body.video || '',
      createdAt: now,
      updatedAt: now,
    }
    data.push(project)
    await writeData(FILE, data)
    res.status(201).json(project)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

export async function update(req, res) {
  try {
    const data = await readData(FILE)
    const index = data.findIndex((p) => p.id === req.params.id)
    if (index === -1) return res.status(404).json({ error: 'Project not found' })
    const body = req.body
    const now = new Date().toISOString()
    const images = body.images !== undefined
      ? (Array.isArray(body.images) ? body.images : [])
      : (data[index].images ?? (data[index].image ? [data[index].image] : []))
    data[index] = {
      ...data[index],
      title: body.title !== undefined ? body.title : data[index].title,
      description: body.description !== undefined ? body.description : data[index].description,
      status: body.status !== undefined ? body.status : data[index].status,
      targetAmount: body.targetAmount !== undefined ? Number(body.targetAmount) : data[index].targetAmount,
      currentAmount: body.currentAmount !== undefined ? Number(body.currentAmount) : data[index].currentAmount,
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
    const filtered = data.filter((p) => p.id !== req.params.id)
    if (filtered.length === data.length) return res.status(404).json({ error: 'Project not found' })
    await writeData(FILE, filtered)
    res.status(204).send()
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}
