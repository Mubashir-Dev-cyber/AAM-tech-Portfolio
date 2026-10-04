import { useEffect, useRef } from 'react'

const POINTS = 22
const FOLLOW = 0.42 // Share of the gap to the point ahead closed per 60 Hz frame
const MAX_WIDTH = 7
const PURPLE = [109, 93, 252]
const BLUE = [54, 194, 246]

const enabled =
  typeof window !== 'undefined' &&
  window.matchMedia('(hover: hover) and (pointer: fine)').matches &&
  !window.matchMedia('(prefers-reduced-motion: reduce)').matches

const mix = (a, b, t) => a.map((v, i) => Math.round(v + (b[i] - v) * t))

// A soft purple → blue ribbon that trails the mouse and shrinks back into
// the cursor when it stops. Drawn on one canvas that never blocks clicks.
export default function CursorTrail() {
  const canvas = useRef(null)

  useEffect(() => {
    if (!enabled) return
    const el = canvas.current
    const ctx = el.getContext('2d')
    const points = []
    const mouse = { x: 0, y: 0 }
    let fade = 0 // 0 = hidden, 1 = fully shown
    let inside = false
    let frame = 0
    let last = 0
    let light = document.documentElement.dataset.theme === 'light'

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      el.width = window.innerWidth * dpr
      el.height = window.innerHeight * dpr
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }

    const draw = (now) => {
      // Time-based easing: same trail length at 60 or 120 Hz, and it still collapses if frames are throttled
      const steps = last ? Math.min((now - last) / 16.67, 30) : 1
      last = now
      const follow = 1 - Math.pow(1 - FOLLOW, steps)
      frame = 0
      fade += ((inside ? 1 : 0) - fade) * (1 - Math.pow(0.85, steps))

      // Head sits on the cursor; every other point eases toward the one ahead
      points[0].x = mouse.x
      points[0].y = mouse.y
      let length = 0
      for (let i = 1; i < POINTS; i++) {
        const p = points[i]
        const prev = points[i - 1]
        p.x += (prev.x - p.x) * follow
        p.y += (prev.y - p.y) * follow
        length += Math.abs(prev.x - p.x) + Math.abs(prev.y - p.y)
      }

      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight)
      ctx.globalCompositeOperation = light ? 'source-over' : 'lighter'
      ctx.lineCap = 'round'
      ctx.shadowBlur = light ? 6 : 14

      const strength = fade * (light ? 0.55 : 0.9)
      for (let i = 1; i < POINTS; i++) {
        const t = i / POINTS // 0 at the cursor, 1 at the tail
        const [r, g, b] = mix(PURPLE, BLUE, t)
        ctx.strokeStyle = `rgba(${r}, ${g}, ${b}, ${(1 - t) * strength})`
        ctx.shadowColor = `rgba(${r}, ${g}, ${b}, ${strength})`
        ctx.lineWidth = MAX_WIDTH * (1 - t) + 0.5
        ctx.beginPath()
        ctx.moveTo(points[i - 1].x, points[i - 1].y)
        ctx.lineTo(points[i].x, points[i].y)
        ctx.stroke()
      }

      // Keep animating until the trail has collapsed into the cursor (or faded out)
      const settled = length < 0.5 && Math.abs((inside ? 1 : 0) - fade) < 0.01
      if (!settled) frame = requestAnimationFrame(draw)
      else {
        last = 0
        ctx.clearRect(0, 0, window.innerWidth, window.innerHeight)
      }
    }

    const start = () => {
      if (!frame) frame = requestAnimationFrame(draw)
    }

    const onMove = (e) => {
      // First move: start the whole trail at the cursor so it doesn't fly in from 0,0
      if (!points.length) {
        for (let i = 0; i < POINTS; i++) points.push({ x: e.clientX, y: e.clientY })
      }
      mouse.x = e.clientX
      mouse.y = e.clientY
      inside = true
      start()
    }
    const onLeave = () => {
      inside = false
      if (points.length) start()
    }

    const observer = new MutationObserver(() => {
      light = document.documentElement.dataset.theme === 'light'
    })
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] })

    resize()
    window.addEventListener('resize', resize)
    window.addEventListener('pointermove', onMove, { passive: true })
    document.documentElement.addEventListener('mouseleave', onLeave)
    return () => {
      cancelAnimationFrame(frame)
      observer.disconnect()
      window.removeEventListener('resize', resize)
      window.removeEventListener('pointermove', onMove)
      document.documentElement.removeEventListener('mouseleave', onLeave)
    }
  }, [])

  if (!enabled) return null
  return <canvas ref={canvas} className="cursor-trail" aria-hidden="true" />
}
