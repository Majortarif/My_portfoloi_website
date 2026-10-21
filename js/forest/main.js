import * as THREE from 'three'
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js'
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js'
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js'
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js'
import { $, html, mount } from '../lib/dom.js'
import { recordVisit } from '../lib/visits.js'
import { chapters } from './chapters.js'
import { initOverlay } from './overlay.js'
import { buildStation } from './stations.js'
import { buildWorld, makeTrail, sidewaysAt } from './world.js'

// The Signal Forest: walk a night trail; each chapter of the portfolio is a
// landmark beside it. Scroll / swipe / arrow keys move along the trail.

const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches
const coarse = matchMedia('(pointer: coarse)').matches
const lite = coarse || innerWidth < 760
const params = new URLSearchParams(location.search)
const EYE = 2.1
const wait = (ms) => new Promise((r) => setTimeout(r, ms))
const clamp = THREE.MathUtils.clamp

function webglAvailable() {
  try {
    const c = document.createElement('canvas')
    return Boolean(c.getContext('webgl2') || c.getContext('webgl'))
  } catch {
    return false
  }
}

/** No WebGL: show the chapters as a plain page instead. */
function fallback() {
  document.documentElement.classList.add('no-webgl')
  $('[data-loader]')?.remove()
  const box = $('[data-fallback]')
  box.hidden = false
  mount(
    $('[data-fallback-list]', box),
    chapters.map((c, i) => html`<li><p class="fb__kicker">${String(i + 1).padStart(2, '0')} · ${c.label}</p><h2>${c.title}</h2><p>${c.text}</p></li>`),
  )
}

async function start() {
  recordVisit().catch(() => {}) // the forest counts as a portfolio visit too
  const setLoad = (p, text) => {
    $('[data-loader-bar]').style.transform = `scaleX(${p})`
    if (text) $('[data-loader-text]').textContent = text
  }
  setLoad(0.1, 'Waiting for the fonts…')
  // canvas text needs the web fonts first
  await Promise.race([
    Promise.all(['600 100px Geist', 'italic 100px "Instrument Serif"', '500 40px "Geist Mono"'].map((f) => document.fonts.load(f))),
    wait(3500),
  ]).catch(() => {})

  setLoad(0.25, 'Planting the forest…')
  await wait(30)

  const canvas = $('[data-scene]')
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: !lite, powerPreference: 'high-performance' })
  renderer.setPixelRatio(Math.min(devicePixelRatio, lite ? 1.5 : 1.75))
  renderer.setSize(innerWidth, innerHeight)

  const scene = new THREE.Scene()
  scene.background = new THREE.Color(0x04070d)
  scene.fog = new THREE.FogExp2(0x04070d, 0.024)
  const camera = new THREE.PerspectiveCamera(lite ? 66 : 56, innerWidth / innerHeight, 0.1, 1200)

  scene.add(new THREE.HemisphereLight(0x3b6a96, 0x04070c, 1.3))
  const moonLight = new THREE.DirectionalLight(0xa8dcff, 1.5)
  moonLight.position.set(-60, 90, -60)
  scene.add(moonLight)

  // trail + stops
  const curve = makeTrail()
  const length = curve.getLength()
  const N = chapters.length
  const stops = chapters.map((c, i) => {
    const u = 0.045 + i * (0.925 / (N - 1))
    const camU = i === 0 ? 0 : Math.max(0, u - 9.5 / length)
    const onPath = c.kind === 'welcome' || c.kind === 'portal'
    const side = onPath ? 0 : i % 2 ? -1 : 1
    const pos = curve.getPointAt(u).addScaledVector(sidewaysAt(curve, u), side * 7)
    const eye = curve.getPointAt(camU).setY(EYE)
    return { u, camU, pos, eye }
  })

  // textures from files go through one manager so the loader can wait for them
  const manager = new THREE.LoadingManager()
  const loaded = new Promise((resolve) => {
    manager.onLoad = resolve
    manager.onError = () => {}
  })
  manager.onProgress = (_, done, total) => setLoad(0.4 + (done / total) * 0.5, `Hanging the pictures… ${done}/${total}`)
  const texLoader = new THREE.TextureLoader(manager)
  const loadTex = (url) => {
    const t = texLoader.load(url)
    t.colorSpace = THREE.SRGBColorSpace
    t.anisotropy = 4
    return t
  }

  const world = buildWorld(scene, curve, stops.map((s) => s.pos), { lite })
  const stations = chapters.map((c, i) => buildStation(c, i, stops[i], loadTex, { lite }))
  stations.forEach((s) => scene.add(s.group))
  setLoad(0.4, 'Hanging the pictures…')
  await Promise.race([loaded, wait(9000)])
  setLoad(1, 'Ready')

  // post-processing: a soft bloom on desktop
  let composer = null
  if (!lite && !reduced && !params.has('nobloom')) {
    composer = new EffectComposer(renderer)
    composer.addPass(new RenderPass(scene, camera))
    composer.addPass(new UnrealBloomPass(new THREE.Vector2(innerWidth, innerHeight), 0.75, 0.5, 0.92))
    composer.addPass(new OutputPass())
  }

  // ------------------------------------------------------------ walking
  const minU = stops[0].camU
  const maxU = stops[N - 1].camU
  const startIndex = Math.max(0, chapters.findIndex((c) => `#${c.id}` === location.hash))
  let u = stops[startIndex].camU
  let target = u
  let lastInput = 0
  let current = -1
  let walked = false

  const nearest = (x) => stops.reduce((best, s, i) => (Math.abs(s.camU - x) < Math.abs(stops[best].camU - x) ? i : best), 0)
  const go = (i) => {
    target = stops[clamp(i, 0, N - 1)].camU
    lastInput = 0
    markWalked()
  }
  const overlay = initOverlay(chapters, go)
  const markWalked = () => {
    if (!walked) {
      walked = true
      overlay.walked()
    }
  }
  const nudge = (d) => {
    target = clamp(target + d, minU, maxU)
    lastInput = performance.now()
    markWalked()
  }

  addEventListener(
    'wheel',
    (e) => {
      const cardEl = e.target instanceof Element ? e.target.closest('[data-card]') : null
      if (cardEl && cardEl.scrollHeight > cardEl.clientHeight) return
      e.preventDefault()
      nudge((e.deltaMode === 1 ? e.deltaY * 16 : e.deltaY) * 0.00016)
    },
    { passive: false },
  )
  let touchY = null
  addEventListener('touchstart', (e) => (touchY = e.target instanceof Element && e.target.closest('[data-card], .rail, a, button') ? null : e.touches[0].clientY), { passive: true })
  addEventListener(
    'touchmove',
    (e) => {
      if (touchY === null) return
      const y = e.touches[0].clientY
      nudge((touchY - y) * 0.0008)
      touchY = y
      e.preventDefault()
    },
    { passive: false },
  )
  addEventListener('touchend', () => (touchY = null))
  addEventListener('keydown', (e) => {
    const el = e.target instanceof Element ? e.target : null
    if (el?.closest('input, textarea')) return
    if (e.key === ' ' && el?.closest('button, a')) return
    const i = nearest(target)
    if (['ArrowDown', 'ArrowRight', 'PageDown', ' '].includes(e.key)) go(i + 1)
    else if (['ArrowUp', 'ArrowLeft', 'PageUp'].includes(e.key)) go(i - 1)
    else if (e.key === 'Home') go(0)
    else if (e.key === 'End') go(N - 1)
    else return
    e.preventDefault()
  })

  const mouse = new THREE.Vector2()
  const mouseS = new THREE.Vector2()
  if (!coarse) addEventListener('pointermove', (e) => mouse.set((e.clientX / innerWidth) * 2 - 1, (e.clientY / innerHeight) * 2 - 1))

  addEventListener('resize', () => {
    camera.aspect = innerWidth / innerHeight
    camera.updateProjectionMatrix()
    renderer.setSize(innerWidth, innerHeight)
    composer?.setSize(innerWidth, innerHeight)
  })

  // ------------------------------------------------------------ frame loop
  const clock = new THREE.Clock()
  const look = new THREE.Vector3()
  const ahead = new THREE.Vector3()
  const proj = new THREE.Vector3()
  let time = 0

  function frame() {
    const dt = Math.min(clock.getDelta(), 0.05)
    if (!reduced) time += dt
    // settle on the nearest chapter after the visitor stops scrolling
    if (lastInput && performance.now() - lastInput > 650) {
      target = stops[nearest(target)].camU
      lastInput = 0
    }
    u = reduced ? target : u + (target - u) * (1 - Math.exp(-dt * 2.3))

    const p = curve.getPointAt(clamp(u, 0, 1))
    curve.getPointAt(Math.min(1, u + 0.04), ahead)
    const i = nearest(u)
    const near = clamp(1 - Math.abs(u - stops[i].camU) / 0.045, 0, 1)
    const w = near * near * (3 - 2 * near)
    look.set(ahead.x, EYE * 0.95, ahead.z).lerp(stations[i].focus, w * 0.85)

    const moving = Math.min(1, Math.abs(target - u) * 80)
    mouseS.lerp(mouse, 0.06)
    camera.position.set(p.x, EYE + Math.sin(time * 6.5) * 0.035 * moving, p.z)
    camera.lookAt(look.x + mouseS.x * 1.4, look.y - mouseS.y * 0.8, look.z)

    // keep the card on the opposite side of the screen from the landmark
    const sx = proj.copy(stations[i].focus).project(camera).x
    overlay.set(i, w > 0.4, sx < -0.05 ? 'right' : 'left')
    if (i !== current) {
      current = i
      history.replaceState(null, '', `#${chapters[i].id}`)
    }

    world.update(time)
    stations.forEach((s) => s.update(time, dt, camera.position))
    composer ? composer.render() : renderer.render(scene, camera)
    requestAnimationFrame(frame)
  }

  overlay.set(startIndex, true, 'left')
  requestAnimationFrame(frame)
  await wait(250)
  document.documentElement.classList.add('is-ready')
  setTimeout(() => $('[data-loader]')?.remove(), 1200)
}

if (webglAvailable()) {
  start().catch((err) => {
    console.error(err)
    fallback()
  })
} else {
  fallback()
}
