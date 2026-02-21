import fs from 'fs/promises'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const SITE_PATH = path.join(__dirname, '..', 'data', 'site.json')

const defaultSite = {
  heroImage: '',
  updatedAt: '',
  // Site identity (Navbar, Footer, Contact, Admin)
  siteName: 'Jamiul Azhar Jumma Masjidh',
  footerTagline: 'Serving the community with faith and compassion.',
  // Home page
  welcomeSubtitle: 'Welcome to',
  heroTitleLine1: 'Jamiul Azhar',
  heroTitleLine2: 'Jumma Masjidh',
  heroTagline: 'A house of worship and community at the heart of our neighbourhood.',
  prayerTimesNote: 'Prayer times will be displayed here. Contact the masjid for the current schedule.',
  footerQuote: 'May Allah accept our efforts and your support.',
  // About page
  aboutTitle: 'About Us',
  aboutSubtitle: 'Our history and a message from the Imam.',
  history: `Jamiul Azhar Jumma Masjidh was established to serve the local Muslim community. Over the years it has grown from a small prayer space into a full masjid with facilities for daily prayers, Jumu'ah, and community events.

We continue to expand our services and facilities with the support of our donors and volunteers. Our goal is to be a welcoming and inclusive place of worship and learning for all.`,
  imamMessage: `Assalamu Alaikum wa Rahmatullahi wa Barakatuhu.

Welcome to Jamiul Azhar Jumma Masjidh. Our masjid has been a cornerstone of the community, providing a place for prayer, learning, and fellowship. We strive to serve with sincerity and to uphold the values of Islam in everything we do.

I encourage you to visit, participate in our programs, and support our projects. May Allah guide us all and accept our efforts.

Jazakallah Khair.
— Imam, Jamiul Azhar Jumma Masjidh`,
  // Contact page
  contactTitle: 'Contact',
  contactSubtitle: 'Get in touch with the masjid.',
  contactVisitTitle: 'Visit us',
  contactDetailsTitle: 'Contact details',
  addressLine1: 'Jamiul Azhar Jumma Masjidh',
  addressLine2: '[Address to be updated]',
  addressLine3: 'Your City, State – PIN',
  phone: '[Phone number to be updated]',
  email: 'contact@jajm.example.org',
  contactFooterNote: 'For donations, volunteer inquiries, or general questions, please visit the masjid office or use the contact details above. Admin login is available for authorised personnel only.',
}

const SITE_KEYS = Object.keys(defaultSite)

function pickSite(body) {
  const out = {}
  for (const key of SITE_KEYS) {
    if (key === 'updatedAt') continue
    if (body[key] !== undefined) {
      out[key] = typeof defaultSite[key] === 'string' ? String(body[key]) : body[key]
    }
  }
  return out
}

async function readSite() {
  try {
    const raw = await fs.readFile(SITE_PATH, 'utf-8')
    const parsed = JSON.parse(raw)
    return { ...defaultSite, ...parsed }
  } catch (err) {
    if (err.code === 'ENOENT') return { ...defaultSite }
    throw err
  }
}

export async function get(_, res) {
  try {
    const site = await readSite()
    res.json(site)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

export async function update(req, res) {
  try {
    const body = req.body || {}
    const current = await readSite()
    const updates = pickSite(body)
    const updated = {
      ...current,
      ...updates,
      updatedAt: new Date().toISOString(),
    }
    await fs.mkdir(path.dirname(SITE_PATH), { recursive: true })
    await fs.writeFile(SITE_PATH, JSON.stringify(updated, null, 2), 'utf-8')
    res.json(updated)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}
