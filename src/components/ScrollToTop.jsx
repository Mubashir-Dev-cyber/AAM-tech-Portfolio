import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

// Route changes start at the top of the page. A #hash scrolls to that section instead.
export default function ScrollToTop() {
  const { pathname, hash } = useLocation()

  useEffect(() => {
    const target = hash ? document.getElementById(hash.slice(1)) : null
    if (target) {
      target.scrollIntoView()
    } else {
      window.scrollTo(0, 0)
    }
  }, [pathname, hash])

  return null
}
