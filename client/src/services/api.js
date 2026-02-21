const BASE = import.meta.env.VITE_API_URL || ''
const STATIC_MODE = !BASE
const TOKEN_KEY = 'jajm_admin_token'

function getToken() {
  try {
    return (typeof window !== 'undefined' && localStorage.getItem(TOKEN_KEY)) || null
  } catch {
    return null
  }
}

function clearToken() {
  try {
    if (typeof window !== 'undefined') localStorage.removeItem(TOKEN_KEY)
  } catch {}
}

function getAuthHeaders() {
  const token = getToken()
  const headers = { 'Content-Type': 'application/json' }
  if (token) headers.Authorization = `Bearer ${token}`
  return headers
}

function staticError() {
  return Promise.reject(new Error('Static deployment: Admin panel is read-only. Edit data in client/public/data/ and redeploy.'))
}

async function staticFetch(path) {
  const res = await fetch(path)
  if (!res.ok) throw new Error(res.statusText || 'Failed to fetch')
  return res.json()
}

export async function fetchJson(url, options = {}) {
  if (STATIC_MODE) {
    if (options.method && options.method !== 'GET') return staticError()
    const path = url.replace(/^\/api\//, '/data/').replace(/\/api$/, '') + '.json'
    return staticFetch(path)
  }
  const res = await fetch(`${BASE}${url}`, {
    ...options,
    headers: { ...getAuthHeaders(), ...options.headers },
  })
  if (!res.ok) {
    if (res.status === 401) {
      clearToken()
      if (typeof window !== 'undefined') {
        window.location.replace('/admin/login?session=expired')
      }
      const err = new Error('Session expired. Please log in again.')
      err.status = 401
      throw err
    }
    const err = new Error(res.statusText || 'Request failed')
    err.status = res.status
    let body
    try {
      body = await res.json()
      err.message = body.error || err.message
    } catch {
      err.message = await res.text() || err.message
    }
    throw err
  }
  if (res.status === 204) return null
  return res.json()
}

export const api = {
  projects: {
    getAll: () => (STATIC_MODE ? staticFetch('/data/projects.json') : fetchJson('/api/projects')),
    getById: (id) =>
      STATIC_MODE
        ? staticFetch('/data/projects.json').then((arr) => {
            const p = arr.find((x) => x.id === id)
            if (!p) throw new Error('Project not found')
            return p
          })
        : fetchJson(`/api/projects/${id}`),
    create: (body) => (STATIC_MODE ? staticError() : fetchJson('/api/projects', { method: 'POST', body: JSON.stringify(body) })),
    update: (id, body) => (STATIC_MODE ? staticError() : fetchJson(`/api/projects/${id}`, { method: 'PUT', body: JSON.stringify(body) })),
    delete: (id) => (STATIC_MODE ? staticError() : fetchJson(`/api/projects/${id}`, { method: 'DELETE' })),
  },
  events: {
    getAll: () => (STATIC_MODE ? staticFetch('/data/events.json') : fetchJson('/api/events')),
    create: (body) => (STATIC_MODE ? staticError() : fetchJson('/api/events', { method: 'POST', body: JSON.stringify(body) })),
    update: (id, body) => (STATIC_MODE ? staticError() : fetchJson(`/api/events/${id}`, { method: 'PUT', body: JSON.stringify(body) })),
    delete: (id) => (STATIC_MODE ? staticError() : fetchJson(`/api/events/${id}`, { method: 'DELETE' })),
  },
  announcements: {
    getAll: () => (STATIC_MODE ? staticFetch('/data/announcements.json') : fetchJson('/api/announcements')),
    create: (body) => (STATIC_MODE ? staticError() : fetchJson('/api/announcements', { method: 'POST', body: JSON.stringify(body) })),
    update: (id, body) => (STATIC_MODE ? staticError() : fetchJson(`/api/announcements/${id}`, { method: 'PUT', body: JSON.stringify(body) })),
    delete: (id) => (STATIC_MODE ? staticError() : fetchJson(`/api/announcements/${id}`, { method: 'DELETE' })),
  },
  auth: {
    login: (password) => (STATIC_MODE ? staticError() : fetchJson('/api/auth/login', { method: 'POST', body: JSON.stringify({ password }) })),
    logout: () => (STATIC_MODE ? Promise.resolve() : fetchJson('/api/auth/logout', { method: 'POST' })),
  },
  site: {
    get: () => (STATIC_MODE ? staticFetch('/data/site.json') : fetchJson('/api/site')),
    update: (body) => (STATIC_MODE ? staticError() : fetchJson('/api/site', { method: 'PUT', body: JSON.stringify(body) })),
  },
  upload: async (file) => {
    if (STATIC_MODE) throw new Error('Uploads not available in static deployment. Add images to client/public/uploads/ and reference them in data JSON.')
    const token = getToken()
    const form = new FormData()
    form.append('file', file)
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 90000)
    let res
    try {
      res = await fetch(`${BASE}/api/upload`, {
        method: 'POST',
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        body: form,
        signal: controller.signal,
      })
    } catch (err) {
      clearTimeout(timeoutId)
      if (err.name === 'AbortError') {
        throw new Error('Upload timed out. Is the server running? Start it with: npm run dev')
      }
      if (err.name === 'TypeError' && err.message.includes('fetch')) {
        throw new Error('Upload failed. Is the server running on port 3000?')
      }
      throw err
    }
    clearTimeout(timeoutId)
    if (!res.ok) {
      if (res.status === 401) {
        clearToken()
        if (typeof window !== 'undefined') {
          window.location.replace('/admin/login?session=expired')
        }
        throw new Error('Session expired. Please log in again.')
      }
      const data = await res.json().catch(() => ({}))
      throw new Error(data.error || res.statusText)
    }
    const data = await res.json()
    return data.url
  },
}
