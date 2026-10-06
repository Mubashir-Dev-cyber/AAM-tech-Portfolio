import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

// Route changes start at the top of the page. A #hash scrolls to that section instead.
// `key` changes on every link click, so clicking "Services" again after scrolling away still works.
export default function ScrollToTop() {
  const { pathname, hash, key } = useLocation()

  useEffect(() => {
    const target = hash ? document.getElementById(hash.slice(1)) : null
    if (target) {
      target.scrollIntoView()
    } else {
      // Instant, so a new page doesn't appear mid-way and then glide up (the CSS uses smooth scrolling)
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
    }
  }, [pathname, hash, key])

  return null
}
