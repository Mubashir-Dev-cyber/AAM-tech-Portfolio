import { useRef } from 'react'

const canTilt =
  typeof window !== 'undefined' &&
  window.matchMedia('(hover: hover) and (pointer: fine)').matches &&
  !window.matchMedia('(prefers-reduced-motion: reduce)').matches

// Tilts toward the mouse in 3D and moves a glare highlight with it.
export default function TiltCard({ as: Tag = 'div', className = '', max = 10, children, ...rest }) {
  const ref = useRef(null)

  const onMove = (e) => {
    const el = ref.current
    const rect = el.getBoundingClientRect()
    const x = (e.clientX - rect.left) / rect.width
    const y = (e.clientY - rect.top) / rect.height
    el.style.setProperty('--rx', `${(0.5 - y) * max}deg`)
    el.style.setProperty('--ry', `${(x - 0.5) * max}deg`)
    el.style.setProperty('--gx', `${x * 100}%`)
    el.style.setProperty('--gy', `${y * 100}%`)
  }

  const onLeave = () => {
    const el = ref.current
    el.style.setProperty('--rx', '0deg')
    el.style.setProperty('--ry', '0deg')
  }

  return (
    <Tag
      ref={ref}
      className={`tilt ${className}`}
      onPointerMove={canTilt ? onMove : undefined}
      onPointerLeave={canTilt ? onLeave : undefined}
      {...rest}
    >
      {children}
      <span className="tilt__glare" aria-hidden="true" />
    </Tag>
  )
}
