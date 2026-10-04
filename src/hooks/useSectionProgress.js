import { useEffect, useRef } from 'react'

// Writes --progress (0 → 1) onto the element as an imaginary reading line,
// `line` of the way down the screen, passes from its top to its bottom.
// Scrolling back reverses it. Updates a CSS variable only — no re-renders.
export default function useSectionProgress(line = 0.7) {
  const ref = useRef(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    let frame = 0

    const update = () => {
      frame = 0
      const rect = el.getBoundingClientRect()
      const p = Math.min(1, Math.max(0, (window.innerHeight * line - rect.top) / rect.height))
      el.style.setProperty('--progress', p.toFixed(3))
    }
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update)
    }

    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [line])

  return ref
}
