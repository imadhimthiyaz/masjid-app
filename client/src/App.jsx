import { Routes, Route } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import PublicLayout from './layouts/PublicLayout'
import AdminLayout from './layouts/AdminLayout'
import Home from './pages/Home'
import Projects from './pages/Projects'
import ProjectDetail from './pages/ProjectDetail'
import Events from './pages/Events'
import Announcements from './pages/Announcements'
import About from './pages/About'
import Gallery from './pages/Gallery'
import Contact from './pages/Contact'
import AdminLogin from './admin/AdminLogin'
import AdminDashboard from './admin/AdminDashboard'
import AdminProjects from './admin/AdminProjects'
import AdminEvents from './admin/AdminEvents'
import AdminAnnouncements from './admin/AdminAnnouncements'
import AdminSite from './admin/AdminSite'
import { ThemeProvider } from './components/ThemeContext'
import { ToastProvider } from './components/Toast'

function App() {
  return (
    <ThemeProvider>
      <ToastProvider>
      <AnimatePresence mode="wait">
        <Routes>
          <Route path="/" element={<PublicLayout />}>
            <Route index element={<Home />} />
            <Route path="projects" element={<Projects />} />
            <Route path="projects/:id" element={<ProjectDetail />} />
            <Route path="events" element={<Events />} />
            <Route path="announcements" element={<Announcements />} />
            <Route path="about" element={<About />} />
            <Route path="gallery" element={<Gallery />} />
            <Route path="contact" element={<Contact />} />
          </Route>
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="site" element={<AdminSite />} />
            <Route path="projects" element={<AdminProjects />} />
            <Route path="events" element={<AdminEvents />} />
            <Route path="announcements" element={<AdminAnnouncements />} />
          </Route>
        </Routes>
      </AnimatePresence>
      </ToastProvider>
    </ThemeProvider>
  )
}

export default App
