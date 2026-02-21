import { useState, useEffect, useCallback } from 'react'

/**
 * Generic hook for fetching list data from an API getter.
 * @param {() => Promise<Array>} getter - e.g. () => api.projects.getAll()
 * @param {Array} deps - dependency array for refetch (e.g. [])
 * @returns {{ data: Array, loading: boolean, error: string | null, refetch: function }}
 */
export function useApi(getter, deps = []) {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const refetch = useCallback(() => {
    setLoading(true)
    setError(null)
    getter()
      .then(setData)
      .catch((err) => setError(err.message || 'Failed to load'))
      .finally(() => setLoading(false))
  }, deps)

  useEffect(refetch, deps)

  return { data, loading, error, refetch }
}
