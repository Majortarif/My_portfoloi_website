import { featured } from '../data/projects.js'
import { $ } from '../lib/dom.js'
import { clamp, onMotionPreferenceChange, prefersReducedMotion } from '../lib/media.js'

// Ambient "air" of drifting particles. Seven of them carry the sensor readings
// of the air-quality model; near the cursor (or a slowly wandering focus point
// on touch screens) nearby particles link up into a network.

const LABELS = featured.pipeline.inputs
const LINK_DIST = 130

export function initHeroField() {
  const canvas = $('[data-hero-field]')
  if (!canvas) return
  const hero = canvas.parentElement
  const ctx = canvas.getContext('2d', { alpha: true })

  let w = 0
  let h = 0
  let particles = []
  let raf = 0
  let last = performance.now()
  let inView = true
  const pointer = { x: 0, y: 0, active: false, releaseTimer: 0 }

  const seed = () => {
    const count = Math.round(clamp((w * h) / 12500, 34, 120))
    particles = Array.from({ length: count }, (_, i) => {
      const labelled = i < LABELS.length
      return {
        x: Math.random() * w,
        // keep labels away from the very top and bottom edges
        y: labelled ? h * (0.12 + Math.random() * 0.76) : Math.random() * h,
        vx: 0.06 + (Math.random() - 0.3) * 0.2,
        vy: (Math.random() - 0.5) * 0.12,
        r: labelled ? 2.2 : 0.6 + Math.random() * 1.3,
        a: 0.25 + Math.random() * 0.45,
        label: labelled ? LABELS[i] : null,
        phase: Math.random() * Math.PI * 2,
      }
    })
  }

  const resize = () => {
    const rect = hero.getBoundingClientRect()
    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    w = rect.width
    h = rect.height
    canvas.width = Math.round(w * dpr)
    canvas.height = Math.round(h * dpr)
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    seed()
  }

  const focusPoint = (t) =>
    pointer.active
      ? [pointer.x, pointer.y]
      : [w * (0.66 + 0.2 * Math.sin(t * 0.21)), h * (0.46 + 0.24 * Math.sin(t * 0.29 + 1.2))]

  const draw = (now, animate) => {
    const dt = animate ? Math.min(now - last, 48) / 16.667 : 0
    last = now
    const t = now / 1000
    const [fx, fy] = focusPoint(t)
    const radius = clamp(w * 0.17, 150, 250)

    ctx.clearRect(0, 0, w, h)

    const near = []
    for (const p of particles) {
      p.x += p.vx * dt
      p.y += (p.vy + Math.sin(t * 0.7 + p.phase) * 0.06) * dt
      const dx = p.x - fx
      const dy = p.y - fy
      const d = Math.hypot(dx, dy) || 1
      if (pointer.active && d < radius * 0.45) {
        // soft push away from the cursor, like air around a hand
        p.x += (dx / d) * 0.7 * dt
        p.y += (dy / d) * 0.7 * dt
      }
      if (p.x > w + 30) p.x = -30
      if (p.x < -30) p.x = w + 30
      if (p.y > h + 30) p.y = -30
      if (p.y < -30) p.y = h + 30
      p.focus = d < radius ? 1 - d / radius : 0
      if (p.focus > 0) near.push(p)
    }

    // links between particles inside the focus radius
    ctx.lineWidth = 1
    for (let i = 0; i < near.length; i++) {
      for (let j = i + 1; j < near.length; j++) {
        const a = near[i]
        const b = near[j]
        const d = Math.hypot(a.x - b.x, a.y - b.y)
        if (d > LINK_DIST) continue
        const alpha = (1 - d / LINK_DIST) * Math.min(a.focus, b.focus) * 0.75
        ctx.strokeStyle = `rgba(62, 224, 255, ${alpha.toFixed(3)})`
        ctx.beginPath()
        ctx.moveTo(a.x, a.y)
        ctx.lineTo(b.x, b.y)
        ctx.stroke()
      }
    }

    ctx.font = '500 11px "Geist Mono", ui-monospace, monospace'
    for (const p of particles) {
      const alpha = Math.min(1, p.a + p.focus * 0.6)
      ctx.fillStyle = p.label ? `rgba(62, 224, 255, ${alpha})` : `rgba(150, 200, 255, ${alpha * 0.8})`
      ctx.beginPath()
      ctx.arc(p.x, p.y, p.r + p.focus * 0.8, 0, Math.PI * 2)
      ctx.fill()
      if (p.label) {
        ctx.fillStyle = `rgba(190, 236, 255, ${0.28 + p.focus * 0.65})`
        ctx.fillText(p.label, p.x + 7, p.y - 7)
      }
    }
  }

  const loop = (now) => {
    draw(now, true)
    raf = requestAnimationFrame(loop)
  }
  const start = () => {
    if (raf || prefersReducedMotion() || !inView || document.hidden) return
    last = performance.now()
    raf = requestAnimationFrame(loop)
  }
  const stop = () => {
    cancelAnimationFrame(raf)
    raf = 0
  }
  const renderStatic = () => draw(performance.now(), false)

  const setPointer = (e) => {
    const rect = hero.getBoundingClientRect()
    pointer.x = e.clientX - rect.left
    pointer.y = e.clientY - rect.top
    pointer.active = true
    clearTimeout(pointer.releaseTimer)
  }
  hero.addEventListener('pointermove', setPointer, { passive: true })
  hero.addEventListener('pointerdown', setPointer, { passive: true })
  hero.addEventListener('pointerleave', () => {
    pointer.active = false
  })
  hero.addEventListener('pointerup', (e) => {
    if (e.pointerType !== 'mouse') pointer.releaseTimer = setTimeout(() => (pointer.active = false), 1200)
  })

  new ResizeObserver(() => {
    resize()
    if (!raf) renderStatic()
  }).observe(hero)

  new IntersectionObserver(([entry]) => {
    inView = entry.isIntersecting
    inView ? start() : stop()
  }).observe(hero)

  document.addEventListener('visibilitychange', () => (document.hidden ? stop() : start()))
  onMotionPreferenceChange(() => {
    stop()
    prefersReducedMotion() ? renderStatic() : start()
  })

  resize()
  renderStatic()
  start()
  // redraw labels once the mono font has arrived
  document.fonts?.ready.then(() => !raf && renderStatic())
}
