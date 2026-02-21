import { motion } from 'framer-motion'
import PageTransition from '../components/PageTransition'
import GlassCard from '../components/GlassCard'
import { useSite } from '../contexts/SiteContext'

const defaultAboutTitle = 'About Us'
const defaultAboutSubtitle = 'Our history and a message from the Imam.'
const defaultHistory = `Jamiul Azhar Jumma Masjidh was established to serve the local Muslim community. Over the years it has grown from a small prayer space into a full masjid with facilities for daily prayers, Jumu'ah, and community events.

We continue to expand our services and facilities with the support of our donors and volunteers. Our goal is to be a welcoming and inclusive place of worship and learning for all.`
const defaultImamMessage = `Assalamu Alaikum wa Rahmatullahi wa Barakatuhu.

Welcome to Jamiul Azhar Jumma Masjidh. Our masjid has been a cornerstone of the community, providing a place for prayer, learning, and fellowship. We strive to serve with sincerity and to uphold the values of Islam in everything we do.

I encourage you to visit, participate in our programs, and support our projects. May Allah guide us all and accept our efforts.

Jazakallah Khair.
— Imam, Jamiul Azhar Jumma Masjidh`

export default function About() {
  const site = useSite()
  const aboutTitle = site?.aboutTitle ?? defaultAboutTitle
  const aboutSubtitle = site?.aboutSubtitle ?? defaultAboutSubtitle
  const history = site?.history ?? defaultHistory
  const imamMessage = site?.imamMessage ?? defaultImamMessage

  return (
    <PageTransition className="content-container">
      <header className="pt-2">
        <p className="section-label mb-2">Who we are</p>
        <h1 className="page-title font-bold text-white">{aboutTitle}</h1>
        <p className="mt-3 max-w-2xl text-white/80">{aboutSubtitle}</p>
      </header>

      <section className="section-spacing">
        <h2 className="section-heading mb-4 font-semibold text-white">History</h2>
        <GlassCard hover={false}>
          <p className="whitespace-pre-wrap leading-relaxed text-white/85">{history}</p>
        </GlassCard>
      </section>

      <section className="section-spacing pb-4">
        <h2 className="section-heading mb-4 font-semibold text-white">Message from the Imam</h2>
        <GlassCard hover={false}>
          <p className="whitespace-pre-wrap leading-relaxed text-white/90">{imamMessage}</p>
        </GlassCard>
      </section>
    </PageTransition>
  )
}
