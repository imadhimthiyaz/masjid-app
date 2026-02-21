import { useState, useEffect } from 'react'

const TOKEN_KEY = 'jajm_admin_token'

export function getStoredToken() {
  try {
    return localStorage.getItem(TOKEN_KEY)
  } catch {
    return null
  }
}

export function setStoredToken(token) {
  try {
    if (token) localStorage.setItem(TOKEN_KEY, token)
    else localStorage.removeItem(TOKEN_KEY)
  } catch {}
}

export function useAuth() {
  const [token, setToken] = useState(getStoredToken)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(false)
  }, [])

  const login = (newToken) => {
    setStoredToken(newToken)
    setToken(newToken)
  }

  const logout = () => {
    setStoredToken(null)
    setToken(null)
  }

  return {
    isAuthenticated: !!token,
    token,
    loading,
    login,
    logout,
  }
}
