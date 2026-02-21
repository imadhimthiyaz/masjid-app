import { Outlet } from 'react-router-dom'
import { SiteProvider } from '../contexts/SiteContext'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import FixedCreditFooter from '../components/FixedCreditFooter'
import { useScrollToBottom } from '../hooks/useScrollToBottom'

function PublicLayoutInner() {
  const atBottom = useScrollToBottom()

  return (
    <>
      <div className="min-h-screen w-full max-w-full flex flex-col overflow-x-hidden bg-[#052e22] dark:bg-[#031c16]">
        {/* Layered background for depth */}
        <div
          className="pointer-events-none fixed inset-0 z-0 bg-gradient-to-br from-emerald-950/98 via-teal-950/95 to-cyan-950/98 dark:from-slate-950 dark:via-emerald-950/90 dark:to-slate-950"
          aria-hidden
        />
        <div
          className="pointer-events-none fixed inset-0 z-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_0%,rgba(16,185,129,0.12)_0%,transparent_50%)]"
          aria-hidden
        />
        <div className="relative z-10 flex min-h-screen flex-col">
          <Navbar />
          <main className="flex-1 w-full pt-[5.5rem] pb-24 sm:pt-24 sm:pb-28">
            <Outlet />
          </main>
          <Footer />
        </div>
      </div>
      <FixedCreditFooter visible={!atBottom} />
    </>
  )
}

export default function PublicLayout() {
  return (
    <SiteProvider>
      <PublicLayoutInner />
    </SiteProvider>
  )
}
