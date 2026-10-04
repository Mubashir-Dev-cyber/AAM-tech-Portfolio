import { useEffect, useMemo, useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { useFBO } from '@react-three/drei'
import {
  HalfFloatType,
  LinearFilter,
  Mesh,
  OrthographicCamera,
  PlaneGeometry,
  Scene,
  ShaderMaterial,
  Vector2,
  Vector3,
  WebGLRenderTarget,
} from 'three'

// Water ripples that bend the 3D background where the mouse passes.
// A tiny wave simulation runs on the GPU at 1/4 resolution; the scene is then
// drawn through it, so shapes and stars wobble as if seen through water.

const SIM_SCALE = 0.25 // Simulation resolution relative to the screen
const DAMPING = 0.975 // How much of each wave survives per frame (lower = dies faster)
const RADIUS = 0.022 // Size of the drop the mouse makes, in screen heights
const REFRACT = 0.12 // How far the background is bent by the waves
const IDLE_MS = 2500 // After this long without moving, ripples are gone; skip the effect

export const rippleEnabled =
  typeof window !== 'undefined' &&
  window.matchMedia('(hover: hover) and (pointer: fine)').matches &&
  !window.matchMedia('(prefers-reduced-motion: reduce)').matches

const vertexShader = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position.xy, 0.0, 1.0);
  }
`

// Classic two-buffer wave equation. r = current height, g = previous height.
const simShader = /* glsl */ `
  uniform sampler2D uState;
  uniform vec2 uTexel;
  uniform vec2 uMouse;
  uniform float uAspect;
  uniform float uDrop;
  varying vec2 vUv;
  void main() {
    vec4 s = texture2D(uState, vUv);
    float sum = texture2D(uState, vUv + vec2(uTexel.x, 0.0)).r
              + texture2D(uState, vUv - vec2(uTexel.x, 0.0)).r
              + texture2D(uState, vUv + vec2(0.0, uTexel.y)).r
              + texture2D(uState, vUv - vec2(0.0, uTexel.y)).r;
    float next = (sum * 0.5 - s.g) * ${DAMPING};
    vec2 d = (vUv - uMouse) * vec2(uAspect, 1.0);
    next += uDrop * smoothstep(${RADIUS}, 0.0, length(d));
    gl_FragColor = vec4(next, s.r, 0.0, 1.0);
  }
`

// Draw the scene bent by the wave slopes, with a faint sheen on the crests
const compositeShader = /* glsl */ `
  uniform sampler2D uScene;
  uniform sampler2D uHeight;
  uniform vec2 uTexel;
  uniform vec3 uSheen;
  uniform float uSheenAlpha;
  varying vec2 vUv;
  void main() {
    float hL = texture2D(uHeight, vUv - vec2(uTexel.x, 0.0)).r;
    float hR = texture2D(uHeight, vUv + vec2(uTexel.x, 0.0)).r;
    float hD = texture2D(uHeight, vUv - vec2(0.0, uTexel.y)).r;
    float hU = texture2D(uHeight, vUv + vec2(0.0, uTexel.y)).r;
    vec2 slope = vec2(hR - hL, hU - hD);

    vec4 color = texture2D(uScene, vUv + slope * ${REFRACT});

    // Light from the top-left catches the wave fronts. Colours are premultiplied,
    // so the sheen is laid over the scene with normal "over" compositing.
    float sheen = clamp(dot(slope, vec2(-0.7, 0.7)) * 2.0, 0.0, 1.0) * uSheenAlpha;
    color = vec4(uSheen * sheen, sheen) + color * (1.0 - sheen);

    gl_FragColor = color;
    #include <tonemapping_fragment>
    #include <colorspace_fragment>
  }
`

function makeTarget(w, h) {
  return new WebGLRenderTarget(w, h, {
    type: HalfFloatType,
    minFilter: LinearFilter,
    magFilter: LinearFilter,
    depthBuffer: false,
  })
}

export default function Ripple({ light }) {
  const { gl, size } = useThree()
  const sceneTarget = useFBO({ type: HalfFloatType, samples: 4 })

  // Ping-pong pair for the wave simulation, rebuilt when the screen size changes
  const simW = Math.max(32, Math.round(size.width * SIM_SCALE))
  const simH = Math.max(32, Math.round(size.height * SIM_SCALE))
  const targets = useMemo(() => [makeTarget(simW, simH), makeTarget(simW, simH)], [simW, simH])
  useEffect(() => () => targets.forEach((t) => t.dispose()), [targets])

  // Full-screen quads for the simulation step and the final picture
  const passes = useMemo(() => {
    const quad = new PlaneGeometry(2, 2)
    const camera = new OrthographicCamera(-1, 1, 1, -1, 0, 1)

    const sim = new ShaderMaterial({
      vertexShader,
      fragmentShader: simShader,
      uniforms: {
        uState: { value: null },
        uTexel: { value: new Vector2() },
        uMouse: { value: new Vector2(-10, -10) },
        uAspect: { value: 1 },
        uDrop: { value: 0 },
      },
      depthTest: false,
      depthWrite: false,
    })
    const composite = new ShaderMaterial({
      vertexShader,
      fragmentShader: compositeShader,
      uniforms: {
        uScene: { value: null },
        uHeight: { value: null },
        uTexel: { value: new Vector2() },
        uSheen: { value: new Vector3(1, 1, 1) },
        uSheenAlpha: { value: 0.12 },
      },
      depthTest: false,
      depthWrite: false,
      premultipliedAlpha: true,
    })

    const simScene = new Scene()
    const simMesh = new Mesh(quad, sim)
    simMesh.frustumCulled = false
    simScene.add(simMesh)

    const outScene = new Scene()
    const outMesh = new Mesh(quad, composite)
    outMesh.frustumCulled = false
    outScene.add(outMesh)

    return { camera, sim, composite, simScene, outScene, quad }
  }, [])
  useEffect(
    () => () => {
      passes.quad.dispose()
      passes.sim.dispose()
      passes.composite.dispose()
    },
    [passes],
  )

  // Sheen: soft white in dark mode, a faint indigo shadow-light on the pale theme
  useEffect(() => {
    passes.composite.uniforms.uSheen.value.set(...(light ? [0.23, 0.25, 0.56] : [1, 1, 1]))
    passes.composite.uniforms.uSheenAlpha.value = light ? 0.08 : 0.12
  }, [light, passes])

  const state = useRef({ index: 0, lastMove: -Infinity, last: new Vector2(-10, -10), dirty: false })

  // Priority 1 takes over rendering from R3F, so this draws the frame itself
  useFrame(({ scene, camera, pointer, clock }) => {
    const s = state.current
    const now = clock.elapsedTime * 1000

    // Pointer in 0..1 screen space; drop strength follows mouse speed
    const mx = (pointer.x + 1) / 2
    const my = (pointer.y + 1) / 2
    const moved = Math.hypot((mx - s.last.x) * size.width, (my - s.last.y) * size.height)
    const drop = s.last.x < -1 ? 0 : Math.min(moved * 0.004, 0.18)
    s.last.set(mx, my)
    if (drop > 0.002) s.lastMove = now

    // Nothing moving: draw the scene directly, exactly as without the effect
    if (now - s.lastMove > IDLE_MS) {
      if (s.dirty) {
        // Wipe the old waves so they don't reappear next time
        const alpha = gl.getClearAlpha()
        gl.setClearAlpha(0)
        targets.forEach((t) => {
          gl.setRenderTarget(t)
          gl.clear()
        })
        gl.setClearAlpha(alpha)
        s.dirty = false
      }
      gl.setRenderTarget(null)
      gl.render(scene, camera)
      return
    }
    s.dirty = true

    // 1. Step the wave simulation
    const read = targets[s.index]
    const write = targets[1 - s.index]
    const sim = passes.sim.uniforms
    sim.uState.value = read.texture
    sim.uTexel.value.set(1 / simW, 1 / simH)
    sim.uMouse.value.set(mx, my)
    sim.uAspect.value = size.width / size.height
    sim.uDrop.value = drop
    gl.setRenderTarget(write)
    gl.render(passes.simScene, passes.camera)
    s.index = 1 - s.index

    // 2. Draw the 3D scene off-screen
    gl.setRenderTarget(sceneTarget)
    gl.clear()
    gl.render(scene, camera)

    // 3. Draw it to the screen through the waves
    const out = passes.composite.uniforms
    out.uScene.value = sceneTarget.texture
    out.uHeight.value = write.texture
    out.uTexel.value.set(1 / simW, 1 / simH)
    gl.setRenderTarget(null)
    gl.render(passes.outScene, passes.camera)
  }, 1)

  return null
}
