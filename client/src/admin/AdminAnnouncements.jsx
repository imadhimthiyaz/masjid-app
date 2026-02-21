import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Pencil, Trash2, X } from 'lucide-react'
import { api } from '../services/api'
import { useToast } from '../components/Toast'

const emptyAnn = { title: '', content: '' }

export default function AdminAnnouncements() {
  const [list, setList] = useState([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState(emptyAnn)
  const toast = useToast()

  const load = () => {
    api.announcements.getAll().then(setList).catch(() => toast.add('Failed to load announcements', 'error')).finally(() => setLoading(false))
  }
  useEffect(load, [])

  const openCreate = () => { setEditing('new'); setForm(emptyAnn) }
  const openEdit = (a) => {
    setEditing(a.id)
    setForm({ title: a.title, content: a.content || '' })
  }
  const close = () => { setEditing(null); setForm(emptyAnn) }

  const save = async () => {
    const payload = { title: form.title.trim(), content: form.content.trim() }
    if (!payload.title) {
      toast.add('Title is required', 'error')
      return
    }
    try {
      if (editing === 'new') {
        await api.announcements.create(payload)
        toast.add('Announcement created', 'success')
      } else {
        await api.announcements.update(editing, payload)
        toast.add('Announcement updated', 'success')
      }
      close()
      load()
    } catch (err) {
      toast.add(err.message || 'Save failed', 'error')
    }
  }

  const remove = async (id) => {
    if (!confirm('Delete this announcement?')) return
    try {
      await api.announcements.delete(id)
      toast.add('Announcement deleted', 'success')
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
        <h1 className="text-xl font-bold text-white sm:text-2xl">Announcements</h1>
        <button type="button" onClick={openCreate} className="flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-500">
          <Plus size={18} /> Add announcement
        </button>
      </div>

      <div className="mt-6 space-y-3">
        {list.map((a) => (
          <motion.div key={a.id} layout className="flex flex-col gap-3 rounded-xl border border-slate-600/50 bg-slate-800/50 p-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="min-w-0">
              <p className="font-medium text-white truncate">{a.title}</p>
              <p className="text-sm text-slate-400 line-clamp-1">{a.content}</p>
            </div>
            <div className="flex shrink-0 gap-2">
              <button type="button" onClick={() => openEdit(a)} className="rounded-lg p-2 text-slate-400 hover:bg-slate-700 hover:text-white"><Pencil size={18} /></button>
              <button type="button" onClick={() => remove(a.id)} className="rounded-lg p-2 text-slate-400 hover:bg-red-900/50 hover:text-red-300"><Trash2 size={18} /></button>
            </div>
          </motion.div>
        ))}
      </div>

      <AnimatePresence>
        {editing && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4" onClick={close}>
            <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }} onClick={(e) => e.stopPropagation()} className="w-full max-w-lg max-h-[90vh] flex flex-col rounded-2xl border border-slate-600 bg-slate-800 shadow-xl">
              <div className="flex shrink-0 items-center justify-between p-4 sm:p-6 pb-0">
                <h2 className="text-lg font-semibold text-white">{editing === 'new' ? 'New announcement' : 'Edit announcement'}</h2>
                <button type="button" onClick={close} className="rounded-lg p-1 text-slate-400 hover:text-white"><X size={20} /></button>
              </div>
              <div className="mt-4 flex-1 min-h-0 overflow-y-auto space-y-4 px-4 sm:px-6 pb-4 sm:pb-6">
                <div>
                  <label className="block text-sm text-slate-400">Title *</label>
                  <input value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))} className="mt-1 w-full rounded-lg border border-slate-600 bg-slate-700 px-3 py-2 text-white" />
                </div>
                <div>
                  <label className="block text-sm text-slate-400">Content</label>
                  <textarea value={form.content} onChange={(e) => setForm((f) => ({ ...f, content: e.target.value }))} rows={5} className="mt-1 w-full rounded-lg border border-slate-600 bg-slate-700 px-3 py-2 text-white" />
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
