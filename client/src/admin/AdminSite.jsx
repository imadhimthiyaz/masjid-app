import { useEffect, useState, useRef } from 'react'
import { motion } from 'framer-motion'
import { Image, Upload, Home, FileText, MapPin } from 'lucide-react'
import { api } from '../services/api'
import { useToast } from '../components/Toast'

const defaultSiteState = {
  heroImage: '',
  siteName: 'Jamiul Azhar Jumma Masjidh',
  footerTagline: 'Serving the community with faith and compassion.',
  welcomeSubtitle: 'Welcome to',
  heroTitleLine1: 'Jamiul Azhar',
  heroTitleLine2: 'Jumma Masjidh',
  heroTagline: 'A house of worship and community at the heart of our neighbourhood.',
  prayerTimesNote: 'Prayer times will be displayed here. Contact the masjid for the current schedule.',
  footerQuote: 'May Allah accept our efforts and your support.',
  aboutTitle: 'About Us',
  aboutSubtitle: 'Our history and a message from the Imam.',
  history: '',
  imamMessage: '',
  contactTitle: 'Contact',
  contactSubtitle: 'Get in touch with the masjid.',
  contactVisitTitle: 'Visit us',
  contactDetailsTitle: 'Contact details',
  addressLine1: '',
  addressLine2: '',
  addressLine3: '',
  phone: '',
  email: '',
  contactFooterNote: '',
}

export default function AdminSite() {
  const [site, setSite] = useState(defaultSiteState)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const uploadTimeoutRef = useRef(null)
  const toast = useToast()

  const load = () => {
    api.site
      .get()
      .then((data) => setSite((s) => ({ ...defaultSiteState, ...s, ...data })))
      .catch(() => toast.add('Failed to load site settings', 'error'))
      .finally(() => setLoading(false))
  }
  useEffect(load, [])

  const handleHeroUpload = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (uploadTimeoutRef.current) clearTimeout(uploadTimeoutRef.current)
    setUploading(true)
    uploadTimeoutRef.current = setTimeout(() => {
      setUploading(false)
      toast.add('Upload timed out. Start the server with: npm run dev', 'error')
    }, 95000)
    try {
      const url = await api.upload(file)
      setSite((s) => ({ ...s, heroImage: url }))
      toast.add('Hero image uploaded', 'success')
    } catch (err) {
      toast.add(err.message || 'Upload failed', 'error')
    } finally {
      if (uploadTimeoutRef.current) {
        clearTimeout(uploadTimeoutRef.current)
        uploadTimeoutRef.current = null
      }
      setUploading(false)
    }
  }

  const save = async () => {
    setSaving(true)
    try {
      await api.site.update(site)
      toast.add('Site settings saved', 'success')
      load()
    } catch (err) {
      toast.add(err.message || 'Save failed', 'error')
    } finally {
      setSaving(false)
    }
  }

  const update = (key, value) => setSite((s) => ({ ...s, [key]: value }))

  if (loading) return <p className="text-slate-400">Loading...</p>

  return (
    <div>
      <h1 className="text-xl font-bold text-white sm:text-2xl">Site settings</h1>
      <p className="mt-1 text-slate-400">Manage all content shown on the public site.</p>

      <div className="mt-8 flex flex-col gap-8">
        {/* Hero image */}
        <motion.section
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl border border-slate-600/50 bg-slate-800/50 p-4 sm:p-6"
        >
          <h2 className="flex items-center gap-2 text-lg font-semibold text-white">
            <Image size={20} />
            Hero image (homepage)
          </h2>
          <p className="mt-1 text-sm text-slate-400">Shown in the hero section. Recommended: 1920×1080 or similar.</p>
          <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-start">
            <div className="h-40 w-full shrink-0 overflow-hidden rounded-xl bg-slate-700/50 sm:w-64">
              {site.heroImage ? (
                <img src={site.heroImage} alt="Hero preview" className="h-full w-full object-cover" />
              ) : (
                <div className="flex h-full items-center justify-center text-slate-500">
                  <Image size={48} />
                </div>
              )}
            </div>
            <div className="flex flex-1 flex-col gap-2">
              <label className="flex cursor-pointer items-center gap-2 rounded-xl border border-slate-600 bg-slate-700 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-slate-600">
                <Upload size={18} />
                {uploading ? 'Uploading...' : 'Upload new hero image'}
                <input type="file" accept="image/*" className="hidden" onChange={handleHeroUpload} disabled={uploading} />
              </label>
              {site.heroImage && (
                <button type="button" onClick={() => update('heroImage', '')} className="text-sm text-slate-400 hover:text-red-300">
                  Remove hero image
                </button>
              )}
            </div>
          </div>
        </motion.section>

        {/* Site name & footer */}
        <motion.section
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="rounded-2xl border border-slate-600/50 bg-slate-800/50 p-4 sm:p-6"
        >
          <h2 className="text-lg font-semibold text-white">Site name & footer</h2>
          <p className="mt-1 text-sm text-slate-400">Used in the navbar, footer, and contact page.</p>
          <div className="mt-4 space-y-4">
            <div>
              <label className="block text-sm text-slate-400">Site name</label>
              <input
                value={site.siteName || ''}
                onChange={(e) => update('siteName', e.target.value)}
                className="mt-1 w-full rounded-lg border border-slate-600 bg-slate-700 px-3 py-2 text-white"
                placeholder="Jamiul Azhar Jumma Masjidh"
              />
            </div>
            <div>
              <label className="block text-sm text-slate-400">Footer tagline</label>
              <input
                value={site.footerTagline || ''}
                onChange={(e) => update('footerTagline', e.target.value)}
                className="mt-1 w-full rounded-lg border border-slate-600 bg-slate-700 px-3 py-2 text-white"
                placeholder="Serving the community..."
              />
            </div>
          </div>
        </motion.section>

        {/* Home page */}
        <motion.section
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="rounded-2xl border border-slate-600/50 bg-slate-800/50 p-4 sm:p-6"
        >
          <h2 className="flex items-center gap-2 text-lg font-semibold text-white">
            <Home size={20} />
            Home page
          </h2>
          <div className="mt-4 space-y-4">
            <div>
              <label className="block text-sm text-slate-400">Welcome subtitle (above title)</label>
              <input
                value={site.welcomeSubtitle || ''}
                onChange={(e) => update('welcomeSubtitle', e.target.value)}
                className="mt-1 w-full rounded-lg border border-slate-600 bg-slate-700 px-3 py-2 text-white"
              />
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-sm text-slate-400">Hero title line 1</label>
                <input
                  value={site.heroTitleLine1 || ''}
                  onChange={(e) => update('heroTitleLine1', e.target.value)}
                  className="mt-1 w-full rounded-lg border border-slate-600 bg-slate-700 px-3 py-2 text-white"
                />
              </div>
              <div>
                <label className="block text-sm text-slate-400">Hero title line 2</label>
                <input
                  value={site.heroTitleLine2 || ''}
                  onChange={(e) => update('heroTitleLine2', e.target.value)}
                  className="mt-1 w-full rounded-lg border border-slate-600 bg-slate-700 px-3 py-2 text-white"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm text-slate-400">Hero tagline (below main title)</label>
              <input
                value={site.heroTagline || ''}
                onChange={(e) => update('heroTagline', e.target.value)}
                className="mt-1 w-full rounded-lg border border-slate-600 bg-slate-700 px-3 py-2 text-white"
              />
            </div>
            <div>
              <label className="block text-sm text-slate-400">Prayer times section text</label>
              <textarea
                value={site.prayerTimesNote || ''}
                onChange={(e) => update('prayerTimesNote', e.target.value)}
                rows={2}
                className="mt-1 w-full rounded-lg border border-slate-600 bg-slate-700 px-3 py-2 text-white"
              />
            </div>
            <div>
              <label className="block text-sm text-slate-400">Footer quote (bottom of home)</label>
              <input
                value={site.footerQuote || ''}
                onChange={(e) => update('footerQuote', e.target.value)}
                className="mt-1 w-full rounded-lg border border-slate-600 bg-slate-700 px-3 py-2 text-white"
              />
            </div>
          </div>
        </motion.section>

        {/* About page */}
        <motion.section
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="rounded-2xl border border-slate-600/50 bg-slate-800/50 p-4 sm:p-6"
        >
          <h2 className="flex items-center gap-2 text-lg font-semibold text-white">
            <FileText size={20} />
            About page
          </h2>
          <div className="mt-4 space-y-4">
            <div>
              <label className="block text-sm text-slate-400">About page title</label>
              <input
                value={site.aboutTitle || ''}
                onChange={(e) => update('aboutTitle', e.target.value)}
                className="mt-1 w-full rounded-lg border border-slate-600 bg-slate-700 px-3 py-2 text-white"
              />
            </div>
            <div>
              <label className="block text-sm text-slate-400">About page subtitle</label>
              <input
                value={site.aboutSubtitle || ''}
                onChange={(e) => update('aboutSubtitle', e.target.value)}
                className="mt-1 w-full rounded-lg border border-slate-600 bg-slate-700 px-3 py-2 text-white"
              />
            </div>
            <div>
              <label className="block text-sm text-slate-400">History section</label>
              <textarea
                value={site.history || ''}
                onChange={(e) => update('history', e.target.value)}
                rows={5}
                className="mt-1 w-full rounded-lg border border-slate-600 bg-slate-700 px-3 py-2 text-white"
              />
            </div>
            <div>
              <label className="block text-sm text-slate-400">Message from the Imam</label>
              <textarea
                value={site.imamMessage || ''}
                onChange={(e) => update('imamMessage', e.target.value)}
                rows={8}
                className="mt-1 w-full rounded-lg border border-slate-600 bg-slate-700 px-3 py-2 text-white"
              />
            </div>
          </div>
        </motion.section>

        {/* Contact page */}
        <motion.section
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="rounded-2xl border border-slate-600/50 bg-slate-800/50 p-4 sm:p-6"
        >
          <h2 className="flex items-center gap-2 text-lg font-semibold text-white">
            <MapPin size={20} />
            Contact page
          </h2>
          <div className="mt-4 space-y-4">
            <div>
              <label className="block text-sm text-slate-400">Contact page title</label>
              <input
                value={site.contactTitle || ''}
                onChange={(e) => update('contactTitle', e.target.value)}
                className="mt-1 w-full rounded-lg border border-slate-600 bg-slate-700 px-3 py-2 text-white"
              />
            </div>
            <div>
              <label className="block text-sm text-slate-400">Contact page subtitle</label>
              <input
                value={site.contactSubtitle || ''}
                onChange={(e) => update('contactSubtitle', e.target.value)}
                className="mt-1 w-full rounded-lg border border-slate-600 bg-slate-700 px-3 py-2 text-white"
              />
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-sm text-slate-400">Section: Visit us (title)</label>
                <input
                  value={site.contactVisitTitle || ''}
                  onChange={(e) => update('contactVisitTitle', e.target.value)}
                  className="mt-1 w-full rounded-lg border border-slate-600 bg-slate-700 px-3 py-2 text-white"
                />
              </div>
              <div>
                <label className="block text-sm text-slate-400">Section: Contact details (title)</label>
                <input
                  value={site.contactDetailsTitle || ''}
                  onChange={(e) => update('contactDetailsTitle', e.target.value)}
                  className="mt-1 w-full rounded-lg border border-slate-600 bg-slate-700 px-3 py-2 text-white"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm text-slate-400">Address line 1</label>
              <input
                value={site.addressLine1 || ''}
                onChange={(e) => update('addressLine1', e.target.value)}
                className="mt-1 w-full rounded-lg border border-slate-600 bg-slate-700 px-3 py-2 text-white"
              />
            </div>
            <div>
              <label className="block text-sm text-slate-400">Address line 2</label>
              <input
                value={site.addressLine2 || ''}
                onChange={(e) => update('addressLine2', e.target.value)}
                className="mt-1 w-full rounded-lg border border-slate-600 bg-slate-700 px-3 py-2 text-white"
              />
            </div>
            <div>
              <label className="block text-sm text-slate-400">Address line 3 (city, state, PIN)</label>
              <input
                value={site.addressLine3 || ''}
                onChange={(e) => update('addressLine3', e.target.value)}
                className="mt-1 w-full rounded-lg border border-slate-600 bg-slate-700 px-3 py-2 text-white"
              />
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-sm text-slate-400">Phone</label>
                <input
                  value={site.phone || ''}
                  onChange={(e) => update('phone', e.target.value)}
                  className="mt-1 w-full rounded-lg border border-slate-600 bg-slate-700 px-3 py-2 text-white"
                />
              </div>
              <div>
                <label className="block text-sm text-slate-400">Email</label>
                <input
                  type="email"
                  value={site.email || ''}
                  onChange={(e) => update('email', e.target.value)}
                  className="mt-1 w-full rounded-lg border border-slate-600 bg-slate-700 px-3 py-2 text-white"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm text-slate-400">Contact page footer note</label>
              <textarea
                value={site.contactFooterNote || ''}
                onChange={(e) => update('contactFooterNote', e.target.value)}
                rows={3}
                className="mt-1 w-full rounded-lg border border-slate-600 bg-slate-700 px-3 py-2 text-white"
              />
            </div>
          </div>
        </motion.section>

        <div className="flex justify-end">
          <button
            type="button"
            onClick={save}
            disabled={saving}
            className="rounded-xl bg-emerald-600 px-5 py-2.5 font-medium text-white hover:bg-emerald-500 disabled:opacity-50"
          >
            {saving ? 'Saving...' : 'Save all site settings'}
          </button>
        </div>
      </div>
    </div>
  )
}
