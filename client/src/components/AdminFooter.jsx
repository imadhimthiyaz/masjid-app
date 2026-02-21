import { Link } from 'react-router-dom'

export default function AdminFooter() {
  return (
    <footer className="shrink-0 border-t border-slate-700/50 bg-slate-800/60 py-3 px-4 sm:px-6">
      <div className="flex flex-col items-center justify-between gap-2 sm:flex-row">
        <p className="text-xs text-slate-500">
          © {new Date().getFullYear()} Jamiul Azhar Jumma Masjidh
        </p>
        <p className="text-xs text-slate-400">
          Design and Developed By{' '}
          <Link
            to="/"
            className="font-semibold text-emerald-400/90 transition hover:text-emerald-300"
          >
            Imadh Imthiyas
          </Link>
        </p>
      </div>
    </footer>
  )
}
