import { createContext, useContext, useEffect, useState } from 'react'
import { api } from '../services/api'

const SiteContext = createContext(null)

export function SiteProvider({ children }) {
  const [site, setSite] = useState(null)

  useEffect(() => {
    api.site
      .get()
      .then(setSite)
      .catch(() => setSite({}))
  }, [])

  return <SiteContext.Provider value={site}>{children}</SiteContext.Provider>
}

export function useSite() {
  return useContext(SiteContext)
}
