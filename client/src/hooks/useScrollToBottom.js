import { useState, useEffect } from 'react'

const THRESHOLD = 80

export function useScrollToBottom() {
  const [atBottom, setAtBottom] = useState(false)

  useEffect(() => {
    const check = () => {
      const { scrollTop, scrollHeight, clientHeight } = document.documentElement
      const distanceFromBottom = scrollHeight - scrollTop - clientHeight
      setAtBottom(distanceFromBottom < THRESHOLD)
    }

    check()
    window.addEventListener('scroll', check, { passive: true })
    window.addEventListener('resize', check)
    return () => {
      window.removeEventListener('scroll', check)
      window.removeEventListener('resize', check)
    }
  }, [])

  return atBottom
}
