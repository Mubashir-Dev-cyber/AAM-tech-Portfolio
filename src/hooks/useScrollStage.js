import { useEffect } from 'react'

// Read every frame by the 3D scene. Mutated directly so scrolling never re-renders React.
export const scrollState = { stage: 0, velocity: 0 }

let anchors = [0]
let lastY = 0

// ids are the sections of the current page, in page order. Stage 0 = top of the page.
// The scroll position for each section is when its top is 30% down the viewport.
function measure(ids) {
  const vh = window.innerHeight
  const max = Math.max(0, document.documentElement.scrollHeight - vh)
  anchors = ids.map((id, i) => {
    const el = document.getElementById(id)
    if (i === 0 || !el) return 0
    const top = el.getBoundingClientRect().top + window.scrollY
    return Math.min(max, Math.max(0, top - vh * 0.3))
  })
  // Keep anchors strictly increasing so the maths below never divides by zero
  for (let i = 1; i < anchors.length; i++) anchors[i] = Math.max(anchors[i], anchors[i - 1] + 1)
}

function update() {
  const y = window.scrollY
  scrollState.velocity += y - lastY
  lastY = y

  const last = anchors.length - 1
  if (y >= anchors[last]) {
    scrollState.stage = last
    return
  }
  let i = 0
  while (i < last - 1 && y >= anchors[i + 1]) i++
  scrollState.stage = i + (y - anchors[i]) / (anchors[i + 1] - anchors[i])
}

export default function useScrollStage(ids) {
  // Re-measure whenever the page (and so its section list) changes
  const key = ids.join(',')

  useEffect(() => {
    const sections = key.split(',')
    lastY = window.scrollY
    const onResize = () => {
      measure(sections)
      update()
    }
    onResize()
    window.addEventListener('scroll', update, { passive: true })
    window.addEventListener('resize', onResize)
    const ro = new ResizeObserver(onResize)
    ro.observe(document.body)
    return () => {
      window.removeEventListener('scroll', update)
      window.removeEventListener('resize', onResize)
      ro.disconnect()
    }
  }, [key])
}
