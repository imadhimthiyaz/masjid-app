import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Pencil, Trash2, X } from 'lucide-react'
import { api } from '../services/api'
import { useToast } from '../components/Toast'

const emptyEvent = { title: '', description: '', date: '', time: '', location: '', images: [], video: '' }

function getImages(item) {
  return Array.isArray(item?.images) ? item.images : (item?.image ? [item.image] : [])
}

export default function AdminEvents() {
  const [list, setList] = useState([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState(emptyEvent)
  const [uploading, setUploading] = useState(false)
  const toast = useToast()

  const load = () => {
    api.events.getAll().then(setList).catch(() => toast.add('Failed to load events', 'error')).finally(() => setLoading(false))
  }
  useEffect(load, [])

  const openCreate = () => { setEditing('new'); setForm(emptyEvent) }
  const openEdit = (e) => {
    setEditing(e.id)
    setForm({
      title: e.title,
      description: e.description || '',
      date: e.date || '',
      time: e.time || '',
      location: e.location || '',
      images: [...getImages(e)],
      video: e.video || '',
    })
  }
  const close = () => { setEditing(null); setForm(emptyEvent) }

  const handleImageAdd = async (e) => {
    const files = Array.from(e.target.files || [])
    if (files.length === 0) return
    setUploading(true)
    try {
      const urls = await Promise.all(files.map((file) => api.upload(file)))
      setForm((f) => ({ ...f, images: [...(f.images || []), ...urls] }))
      toast.add(`${urls.length} image${urls.length > 1 ? 's' : ''} uploaded`, 'success')
    } catch (err) {
      toast.add(err.message || 'Upload failed', 'error')
    } finally {
      setUploading(false)
      e.target.value = ''
    }
  }

  const handleImageRemove = (index) => {
    setForm((f) => ({ ...f, images: f.images.filter((_, i) => i !== index) }))
  }

  const save = async () => {
    const payload = {
      title: form.title.trim(),
      description: form.description.trim(),
      date: form.date,
      time: form.time,
      location: form.location.trim(),
      images: Array.isArray(form.images) ? form.images.filter(Boolean) : [],
      video: form.video || '',
    }
    if (!payload.title) {
      toast.add('Title is required', 'error')
      return
    }
    try {
      if (editing === 'new') {
        await api.events.create(payload)
        toast.add('Event created', 'success')
      } else {
        await api.events.update(editing, payload)
        toast.add('Event updated', 'success')
      }
      close()
      load()
    } catch (err) {
      toast.add(err.message || 'Save failed', 'error')
    }
  }

  const remove = async (id) => {
    if (!confirm('Delete this event?')) return
    try {
      await api.events.delete(id)
      toast.add('Event deleted', 'success')
      load()
      if (editing === id) close()
    } catch (err) {
      toast.add(err.message || 'Delete failed', 'error')
    }
  }

  if (loading) return <p className="text-slate-400">Loading...</p>

  return (
    <div>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-xl font-bold text-white sm:text-2xl">Events</h1>
        <button type="button" onClick={openCreate} className="flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-500">
          <Plus size={18} /> Add event
        </button>
      </div>

      <div className="mt-6 space-y-3">
        {list.map((ev) => (
          <motion.div key={ev.id} layout className="flex flex-col gap-3 rounded-xl border border-slate-600/50 bg-slate-800/50 p-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="min-w-0">
              <p className="font-medium text-white truncate">{ev.title}</p>
              <p className="text-sm text-slate-400">{ev.date} {ev.time && `· ${ev.time}`} {ev.location && `· ${ev.location}`}</p>
            </div>
            <div className="flex shrink-0 gap-2">
              <button type="button" onClick={() => openEdit(ev)} className="rounded-lg p-2 text-slate-400 hover:bg-slate-700 hover:text-white"><Pencil size={18} /></button>
              <button type="button" onClick={() => remove(ev.id)} className="rounded-lg p-2 text-slate-400 hover:bg-red-900/50 hover:text-red-300"><Trash2 size={18} /></button>
            </div>
          </motion.div>
        ))}
      </div>

      <AnimatePresence>
        {editing && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4" onClick={close}>
            <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }} onClick={(e) => e.stopPropagation()} className="w-full max-w-lg max-h-[90vh] flex flex-col rounded-2xl border border-slate-600 bg-slate-800 shadow-xl">
              <div className="flex shrink-0 items-center justify-between p-4 sm:p-6 pb-0">
                <h2 className="text-lg font-semibold text-white">{editing === 'new' ? 'New event' : 'Edit event'}</h2>
                <button type="button" onClick={close} className="rounded-lg p-1 text-slate-400 hover:text-white"><X size={20} /></button>
              </div>
              <div className="mt-4 flex-1 min-h-0 overflow-y-auto space-y-4 px-4 sm:px-6 pb-4 sm:pb-6">
                <div>
                  <label className="block text-sm text-slate-400">Title *</label>
                  <input value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))} className="mt-1 w-full rounded-lg border border-slate-600 bg-slate-700 px-3 py-2 text-white" />
                </div>
                <div>
                  <label className="block text-sm text-slate-400">Description</label>
                  <textarea value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} rows={3} className="mt-1 w-full rounded-lg border border-slate-600 bg-slate-700 px-3 py-2 text-white" />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-slate-400">Date</label>
                    <input type="date" value={form.date} onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))} className="mt-1 w-full rounded-lg border border-slate-600 bg-slate-700 px-3 py-2 text-white" />
                  </div>
                  <div>
                    <label className="block text-sm text-slate-400">Time</label>
                    <input type="time" value={form.time} onChange={(e) => setForm((f) => ({ ...f, time: e.target.value }))} className="mt-1 w-full rounded-lg border border-slate-600 bg-slate-700 px-3 py-2 text-white" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm text-slate-400">Location</label>
                  <input value={form.location} onChange={(e) => setForm((f) => ({ ...f, location: e.target.value }))} className="mt-1 w-full rounded-lg border border-slate-600 bg-slate-700 px-3 py-2 text-white" />
                </div>
                <div>
                  <label className="block text-sm text-slate-400">Images (multiple)</label>
                  <div className="mt-1 flex flex-wrap gap-2">
                    <input type="file" accept="image/*" multiple onChange={handleImageAdd} disabled={uploading} className="rounded-lg border border-slate-600 bg-slate-700 px-3 py-2 text-sm text-slate-300 file:mr-2 file:rounded file:border-0 file:bg-emerald-600 file:px-3 file:py-1 file:text-white" />
                    {uploading && <span className="text-sm text-slate-400">Uploading...</span>}
                  </div>
                  {form.images?.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-2">
                      {form.images.map((url, i) => (
                        <div key={url + i} className="relative group">
                          <img src={url} alt="" className="h-16 w-20 rounded-lg object-cover border border-slate-600" />
                          <button type="button" onClick={() => handleImageRemove(i)} className="absolute -top-1 -right-1 rounded-full bg-red-600 p-0.5 text-white opacity-0 group-hover:opacity-100 transition" aria-label="Remove">
                            <Trash2 size={12} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                <div>
                  <label className="block text-sm text-slate-400">Video (URL or upload)</label>
                  <input type="url" placeholder="YouTube, Vimeo or /uploads/video.mp4" value={form.video} onChange={(e) => setForm((f) => ({ ...f, video: e.target.value }))} className="mt-1 w-full rounded-lg border border-slate-600 bg-slate-700 px-3 py-2 text-white placeholder-slate-500" />
                  <input
                    type="file"
                    accept="video/*"
                    multiple
                    className="mt-2 rounded-lg border border-slate-600 bg-slate-700 px-3 py-2 text-sm text-slate-300 file:mr-2 file:rounded file:border-0 file:bg-emerald-600 file:px-3 file:py-1 file:text-white"
                    onChange={async (e) => {
                      const files = Array.from(e.target.files || [])
                      if (files.length === 0) return
                      setUploading(true)
                      try {
                        const urls = await Promise.all(files.map((f) => api.upload(f)))
                        setForm((x) => ({ ...x, video: urls[0] }))
                        toast.add(urls.length > 1 ? `${urls.length} videos uploaded (first used)` : 'Video uploaded', 'success')
                      } catch (err) {
                        toast.add(err.message || 'Upload failed', 'error')
                      } finally {
                        setUploading(false)
                        e.target.value = ''
                      }
                    }}
                    disabled={uploading}
                  />
                </div>
              </div>
              <div className="mt-6 flex shrink-0 justify-end gap-2 px-4 sm:px-6 pb-4 sm:pb-6">
                <button type="button" onClick={close} className="rounded-lg px-4 py-2 text-slate-400 hover:bg-slate-700 hover:text-white">Cancel</button>
                <button type="button" onClick={save} className="rounded-lg bg-emerald-600 px-4 py-2 text-white hover:bg-emerald-500">Save</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
