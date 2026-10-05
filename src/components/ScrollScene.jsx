import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Float, MeshDistortMaterial, Points, PointMaterial } from '@react-three/drei'
import { MathUtils } from 'three'
import useScrollStage, { scrollState } from '../hooks/useScrollStage.js'
import Ripple, { rippleEnabled } from './Ripple.jsx'

const PURPLE = '#6d5dfc'
const BLUE = '#36c2f6'
const STAR_LIGHT = '#3b3f8f'
const CAMERA_Z = 7
const FOV = 50

const reducedMotion =
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches

const isMobile = typeof window !== 'undefined' && window.innerWidth < 720

// Float is a no-op wrapper when the user prefers reduced motion.
function Drift({ children, ...props }) {
  return reducedMotion ? children : <Float {...props}>{children}</Float>
}

/*
 * Scroll choreography. One row per section; one [x, y, z, scale] entry per shape,
 * in shape order: knot (right), blob (left), icosahedron (right), torus (left).
 * x is in "edge" units (1 = right edge of the screen). Every shape stays on
 * its own side so the group drifts down the page together.
 * Row 0 is the hero layout and must stay exactly as designed.
 */
const POSES = [
  [[0.86, 1.9, -1, 1], [-0.85, -1, -0.5, 1], [0.72, -2.2, 0, 1], [-0.7, 2.4, -2, 1]], // hero
  [[0.98, 2.0, -1.2, 1.05], [-0.98, -1.3, -1, 1], [0.95, -2.0, -0.3, 1.2], [-0.95, 2.1, -1.8, 1.1]], // services: out to the edges
  [[0.92, 1.6, -2.5, 0.8], [-0.92, -1.2, -2.5, 0.8], [0.88, -1.8, -2.5, 0.8], [-0.9, 1.9, -2.5, 0.8]], // work: back behind the cards
  // From About onward the shapes sit far back (z -6) as a soft, dimmed backdrop
  // behind the full-width content; the larger scale offsets the extra distance.
  [[0.8, 1.9, -6, 1.5], [-0.8, -2.0, -6, 1.4], [0.8, -2.0, -6, 1.8], [-0.8, 1.9, -6, 1.6]], // about: four corners
  [[0.85, 1.3, -6, 1.5], [-0.85, -1.4, -6, 1.4], [0.75, -2.3, -6, 1.8], [-0.75, 2.2, -6, 1.6]], // process: corners, shifted
  [[0.8, 1.9, -6, 1.5], [-0.85, -1.8, -6, 1.4], [0.85, -1.8, -6, 1.8], [-0.75, 2.0, -6, 1.6]], // contact: corners
]

// Each page has its own sections (ids), and per section: shape poses, camera
// distance, warp-star strength and backdrop dimming. Work and Contact have their
// own pages, so the home layout skips those rows. Work and Contact each get a
// two-stage arrangement: the page header, then the content with the shapes behind it.
const LAYOUTS = {
  home: {
    ids: ['top', 'services', 'about', 'process'],
    poses: [POSES[0], POSES[1], POSES[3], POSES[4]],
    camera: [7, 6.4, 7, 6.6],
    warp: [0, 0.5, 0, 0],
    dim: [0, 0, 1, 1],
  },
  work: {
    ids: ['top', 'work'],
    poses: [POSES[0], POSES[2]],
    camera: [7, 6.8],
    warp: [0, 0.25],
    dim: [0, 1],
  },
  about: {
    ids: ['top', 'team', 'story'],
    poses: [POSES[0], POSES[3], POSES[4]],
    camera: [7, 6.6, 6.6],
    warp: [0, 0, 0],
    dim: [0, 1, 1],
  },
  contact: {
    ids: ['top', 'contact'],
    poses: [POSES[0], POSES[5]],
    camera: [7, 7],
    warp: [0, 0],
    dim: [0, 1],
  },
}

// Radians of [x, y] rotation added per section scrolled. Right-side shapes turn
// one way and left-side shapes the other, like gears.
const SPIN = [[0.5, 1.4], [-0.3, -1.0], [0.9, 1.1], [-0.8, -1.2]]
const SIDE = [1, -1, 1, -1]

// True while the page is in light mode. The starfield recolours to suit it.
function useLightTheme() {
  const [light, setLight] = useState(() => document.documentElement.dataset.theme === 'light')
  useEffect(() => {
    const observer = new MutationObserver(() => setLight(document.documentElement.dataset.theme === 'light'))
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] })
    return () => observer.disconnect()
  }, [])
  return light
}

const smoothstep = (t) => t * t * (3 - 2 * t)

// Blend a per-section value at the current (fractional) stage of a page with `count` sections
function atStage(stage, count, pick) {
  const i = Math.min(Math.floor(stage), count - 1)
  const j = Math.min(i + 1, count - 1)
  return MathUtils.lerp(pick(i), pick(j), smoothstep(stage - i))
}

function Particles({ count }) {
  const light = useLightTheme()
  const ref = useRef()
  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      // Random points inside a sphere shell around the scene
      const r = 4 + Math.random() * 6
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos(2 * Math.random() - 1)
      arr[i * 3] = r * Math.sin(phi) * Math.cos(theta)
      arr[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta)
      arr[i * 3 + 2] = r * Math.cos(phi)
    }
    return arr
  }, [count])

  useFrame((_, delta) => {
    if (reducedMotion) return
    ref.current.rotation.y += delta * 0.03
    ref.current.rotation.x += delta * 0.01
  })

  return (
    <Points ref={ref} positions={positions} stride={3} frustumCulled={false}>
      <PointMaterial transparent color={light ? STAR_LIGHT : BLUE} size={0.035} sizeAttenuation depthWrite={false} opacity={light ? 0.9 : 0.8} />
    </Points>
  )
}

// Stars that stream toward the camera between sections. Invisible at the hero.
function WarpField({ count, layout }) {
  const light = useLightTheme()
  const points = useRef()
  const material = useRef()
  const warp = useRef(0)
  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      arr[i * 3] = (Math.random() - 0.5) * 20
      arr[i * 3 + 1] = (Math.random() - 0.5) * 12
      arr[i * 3 + 2] = -25 + Math.random() * 30
    }
    return arr
  }, [count])

  useFrame((_, delta) => {
    const target = reducedMotion ? 0 : atStage(scrollState.stage, layout.ids.length, (i) => layout.warp[i])
    warp.current = MathUtils.damp(warp.current, target, 3, delta)
    const visible = warp.current > 0.01
    points.current.visible = visible
    if (!visible) return

    material.current.opacity = warp.current * 0.7
    const attr = points.current.geometry.attributes.position
    const step = delta * 14 * warp.current
    for (let i = 0; i < count; i++) {
      let z = attr.array[i * 3 + 2] + step
      if (z > 5) z -= 30
      attr.array[i * 3 + 2] = z
    }
    attr.needsUpdate = true
  })

  return (
    <points ref={points} frustumCulled={false} visible={false}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial ref={material} color={light ? STAR_LIGHT : "#bcd7ff"} size={0.045} sizeAttenuation transparent opacity={0} depthWrite={false} />
    </points>
  )
}

// Fades and blurs the whole canvas behind the full-width lower sections.
// Fully off (no filter at all) at the hero and upper sections.
// In light mode the dark text needs a calmer background, so every section after
// the hero gets a medium blur, and the full dim is stronger. The hero is always sharp.
function Backdrop({ layout }) {
  const light = useLightTheme()
  const dim = useRef(0)
  const applied = useRef(0)

  useFrame((state, delta) => {
    const target = atStage(scrollState.stage, layout.ids.length, (i) =>
      light ? (i === 0 ? 0 : Math.max(0.45, layout.dim[i]) * 2) : layout.dim[i],
    )
    dim.current = MathUtils.damp(dim.current, target, 4, delta)
    const style = state.gl.domElement.style

    // Snap fully off near zero so the hero never keeps a faint blur
    if (dim.current < 0.01) {
      if (applied.current !== 0) {
        applied.current = 0
        style.opacity = ''
        style.filter = ''
      }
      return
    }
    if (Math.abs(dim.current - applied.current) < 0.005) return
    applied.current = dim.current
    // dim runs to 1 in dark mode (4px blur) and to 2 in light mode (8px blur)
    style.opacity = String(1 - (light ? 0.25 : 0.35) * dim.current)
    style.filter = `blur(${(dim.current * 4).toFixed(2)}px)`
  })

  return null
}

function Shapes({ layout }) {
  const group = useRef()
  const offsets = useRef([])
  const meshes = useRef([])
  const kick = useRef(0)

  // Same maths as viewport.width at the starting camera distance, but stable
  // while the camera moves with the scroll.
  const aspect = useThree((state) => state.size.width / state.size.height)
  const vw = 2 * CAMERA_Z * Math.tan(MathUtils.degToRad(FOV / 2)) * aspect

  // Place shapes relative to the visible width so they hug the edges
  // instead of covering the headline, and shrink them on narrow screens.
  // On phones the text fills the width, so shapes peek in from off-screen.
  const edge = (vw / 2) * (vw < 6 ? 1.05 : 1)
  const size = Math.max(0.6, Math.min(1, vw / 11))

  const base = [
    { pos: [edge * 0.86, 1.9, -1], rot: [0, 0, 0], scale: 0.9 * size },
    { pos: [-edge * 0.85, -1, -0.5], rot: [0, 0, 0], scale: 1.1 * size },
    { pos: [edge * 0.72, -2.2, 0], rot: [0, 0, 0], scale: 0.6 * size },
    { pos: [-edge * 0.7, 2.4, -2], rot: [1, 0.4, 0], scale: 0.7 * size },
  ]

  useFrame((state, delta) => {
    const stage = scrollState.stage
    const count = layout.ids.length
    const g = group.current

    // Fast scrolling whips the shapes around; the kick decays back to zero
    if (!reducedMotion) {
      kick.current = MathUtils.clamp(kick.current + scrollState.velocity * 0.004, -4, 4)
      kick.current = MathUtils.damp(kick.current, 0, 2.5, delta)
    }
    scrollState.velocity = 0

    // Ease the whole group toward the mouse for a parallax feel
    if (!reducedMotion) {
      g.rotation.y = MathUtils.lerp(g.rotation.y, state.pointer.x * 0.35, 0.05)
      g.rotation.x = MathUtils.lerp(g.rotation.x, -state.pointer.y * 0.25, 0.05)
    }

    const ease = reducedMotion ? 30 : 5
    const cam = atStage(stage, count, (i) => layout.camera[i])
    state.camera.position.z = MathUtils.damp(state.camera.position.z, cam, ease, delta)

    base.forEach((b, s) => {
      const offset = offsets.current[s]
      const mesh = meshes.current[s]
      if (!offset || !mesh) return

      // Position: blend the section poses, stored as an offset from the hero spot
      // Shapes further back look closer to the centre (perspective), so spread
      // x by depth to keep them at the same spot on screen. Exactly 1 at the hero.
      const z = atStage(stage, count, (i) => layout.poses[i][s][2])
      const depth = (cam - z) / (CAMERA_Z - layout.poses[0][s][2])
      const x = atStage(stage, count, (i) => layout.poses[i][s][0]) * edge * depth
      const y = atStage(stage, count, (i) => layout.poses[i][s][1]) * depth
      const k = atStage(stage, count, (i) => layout.poses[i][s][3])
      offset.position.x = MathUtils.damp(offset.position.x, x - b.pos[0], ease, delta)
      offset.position.y = MathUtils.damp(offset.position.y, y - b.pos[1], ease, delta)
      offset.position.z = MathUtils.damp(offset.position.z, z - b.pos[2], ease, delta)
      mesh.scale.setScalar(MathUtils.damp(mesh.scale.x, b.scale * k, ease, delta))

      // Rotation grows steadily with scroll — zero at the hero, reverses when scrolling up
      if (!reducedMotion) {
        mesh.rotation.x = b.rot[0] + stage * SPIN[s][0]
        mesh.rotation.y = b.rot[1] + stage * SPIN[s][1] + kick.current * SIDE[s]
      }
    })
  })

  const ref = (s, kind) => (el) => { (kind === 'mesh' ? meshes : offsets).current[s] = el }

  return (
    <group ref={group}>
      <group ref={ref(0)}>
        <Drift speed={1.6} rotationIntensity={1.2} floatIntensity={1.5}>
          <mesh ref={ref(0, 'mesh')} position={base[0].pos} scale={base[0].scale}>
            <torusKnotGeometry args={[0.7, 0.24, 160, 32]} />
            <meshPhysicalMaterial color={PURPLE} metalness={0.6} roughness={0.15} clearcoat={1} clearcoatRoughness={0.1} />
          </mesh>
        </Drift>
      </group>

      <group ref={ref(1)}>
        <Drift speed={1.2} rotationIntensity={0.8} floatIntensity={2}>
          <mesh ref={ref(1, 'mesh')} position={base[1].pos} scale={base[1].scale}>
            <sphereGeometry args={[1, 64, 64]} />
            <MeshDistortMaterial color={BLUE} distort={0.4} speed={reducedMotion ? 0 : 2} roughness={0.1} metalness={0.4} />
          </mesh>
        </Drift>
      </group>

      <group ref={ref(2)}>
        <Drift speed={2} rotationIntensity={2} floatIntensity={1}>
          <mesh ref={ref(2, 'mesh')} position={base[2].pos} scale={base[2].scale}>
            <icosahedronGeometry args={[1, 0]} />
            <meshPhysicalMaterial color="#8b5cf6" metalness={0.5} roughness={0.2} flatShading clearcoat={1} />
          </mesh>
        </Drift>
      </group>

      <group ref={ref(3)}>
        <Drift speed={1.4} rotationIntensity={1.5} floatIntensity={1.2}>
          <mesh ref={ref(3, 'mesh')} position={base[3].pos} rotation={base[3].rot} scale={base[3].scale}>
            <torusGeometry args={[0.8, 0.22, 32, 96]} />
            <meshPhysicalMaterial color={BLUE} metalness={0.7} roughness={0.15} clearcoat={1} />
          </mesh>
        </Drift>
      </group>
    </group>
  )
}

export default function ScrollScene() {
  // About, Work and Contact have their own choreography; every other route uses the home one
  const { pathname } = useLocation()
  const layout = pathname.startsWith('/about') ? LAYOUTS.about
    : pathname.startsWith('/work') ? LAYOUTS.work
    : pathname.startsWith('/contact') ? LAYOUTS.contact
    : LAYOUTS.home
  useScrollStage(layout.ids)
  const light = useLightTheme()

  // Match the old hero-sized canvas so the hero is framed exactly as before,
  // but never shorter than the screen so the 3D fills every section.
  const [height, setHeight] = useState(() => window.innerHeight)
  useLayoutEffect(() => {
    const hero = document.getElementById('top')
    const measure = () => setHeight(Math.max(hero?.offsetHeight ?? 0, window.innerHeight))
    measure()
    window.addEventListener('resize', measure)
    return () => window.removeEventListener('resize', measure)
  }, [pathname])

  return (
    <div className="scroll-canvas" style={{ height }} aria-hidden="true">
      <Canvas
        camera={{ position: [0, 0, CAMERA_Z], fov: FOV }}
        dpr={[1, 2]}
        gl={{ alpha: true, antialias: true }}
        eventSource={document.getElementById('root')}
        eventPrefix="client"
      >
        <ambientLight intensity={0.5} />
        <directionalLight position={[5, 5, 5]} intensity={1.2} />
        <pointLight position={[-5, 2, 3]} color={PURPLE} intensity={40} />
        <pointLight position={[5, -3, 3]} color={BLUE} intensity={30} />
        <Shapes layout={layout} />
        <Particles count={isMobile ? 600 : 1500} />
        <WarpField count={isMobile ? 250 : 600} layout={layout} />
        <Backdrop layout={layout} />
        {rippleEnabled && <Ripple light={light} />}
      </Canvas>
    </div>
  )
}
