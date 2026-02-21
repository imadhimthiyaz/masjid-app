import { motion } from 'framer-motion'
import { MapPin, Phone, Mail } from 'lucide-react'
import PageTransition from '../components/PageTransition'
import GlassCard from '../components/GlassCard'
import { useSite } from '../contexts/SiteContext'

export default function Contact() {
  const site = useSite()
  const contactTitle = site?.contactTitle ?? 'Contact'
  const contactSubtitle = site?.contactSubtitle ?? 'Get in touch with the masjid.'
  const visitTitle = site?.contactVisitTitle ?? 'Visit us'
  const detailsTitle = site?.contactDetailsTitle ?? 'Contact details'
  const addressLine1 = site?.addressLine1 ?? 'Jamiul Azhar Jumma Masjidh'
  const addressLine2 = site?.addressLine2 ?? '[Address to be updated]'
  const addressLine3 = site?.addressLine3 ?? 'Your City, State – PIN'
  const phone = site?.phone ?? '[Phone number to be updated]'
  const email = site?.email ?? 'contact@jajm.example.org'
  const contactFooterNote = site?.contactFooterNote ?? 'For donations, volunteer inquiries, or general questions, please visit the masjid office or use the contact details above. Admin login is available for authorised personnel only.'

  return (
    <PageTransition className="content-container">
      <header className="pt-2">
        <p className="section-label mb-2">Get in touch</p>
        <h1 className="page-title font-bold text-white">{contactTitle}</h1>
        <p className="mt-3 max-w-2xl text-white/80">{contactSubtitle}</p>
      </header>

      <div className="section-spacing grid gap-6 md:grid-cols-2">
        <GlassCard hover={false}>
          <h2 className="text-lg font-semibold text-white">{visitTitle}</h2>
          <div className="mt-4 flex items-start gap-3 text-white/85">
            <MapPin className="mt-0.5 shrink-0" size={20} />
            <div className="min-w-0">
              <p>{addressLine1}</p>
              <p className="mt-1">{addressLine2}</p>
              <p className="mt-1">{addressLine3}</p>
            </div>
          </div>
        </GlassCard>
        <GlassCard hover={false}>
          <h2 className="text-lg font-semibold text-white">{detailsTitle}</h2>
          <div className="mt-4 space-y-3 text-white/85">
            <div className="flex items-center gap-3">
              <Phone size={18} className="shrink-0" />
              <span>{phone}</span>
            </div>
            <div className="flex items-center gap-3">
              <Mail size={18} className="shrink-0" />
              <span>{email}</span>
            </div>
          </div>
        </GlassCard>
      </div>

      <GlassCard className="section-spacing mb-4" hover={false}>
        <p className="leading-relaxed text-white/85">{contactFooterNote}</p>
      </GlassCard>
    </PageTransition>
  )
}
