import { $, $$ } from '../lib/dom.js'
import { hasFinePointer, prefersReducedMotion } from '../lib/media.js'

// "Ultrasonic" layer: sonar pings, typed terminal lines, a cycling hero line
// and 3D tilt on project frames. Everything settles to a static, fully
// readable state under prefers-reduced-motion.

const wait = (ms) => new Promise((r) => setTimeout(r, ms))

/** A sonar ripple wherever the visitor clicks or taps. */
export function initPing() {
  if (prefersReducedMotion()) return
  document.addEventListener('pointerdown', (e) => {
    if (e.target.closest('input, textarea, dialog')) return
    const ring = document.createElement('span')
    ring.className = 'ping'
    ring.setAttribute('aria-hidden', 'true')
    ring.style.left = `${e.clientX}px`
    ring.style.top = `${e.clientY}px`
    document.body.append(ring)
    ring.addEventListener('animationend', () => ring.remove(), { once: true })
  })
}

/** Types each terminal command, then prints its output, once it scrolls into view. */
export function initTyper() {
  $$('[data-typer]').forEach((list) => {
    const rows = $$('.typer__row', list)
    if (prefersReducedMotion() || !('IntersectionObserver' in window)) {
      rows.forEach((r) => r.classList.add('is-done'))
      return
    }
    const cmds = rows.map((r) => {
      const el = $('[data-type]', r)
      const text = el.textContent
      el.textContent = ''
      return { row: r, el, text }
    })
    const run = async () => {
      for (const c of cmds) {
        c.row.classList.add('is-typing')
        for (let i = 1; i <= c.text.length; i++) {
          c.el.textContent = c.text.slice(0, i)
          await wait(28 + Math.random() * 40)
        }
        await wait(160)
        c.row.classList.remove('is-typing')
        c.row.classList.add('is-done')
        await wait(220)
      }
      list.classList.add('is-finished')
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return
        io.disconnect()
        run()
      },
      { threshold: 0.4 },
    )
    io.observe(list)
  })
}

/** Cycles the hero's "currently building" line like a typewriter. */
export function initCycler() {
  const el = $('[data-cycle]')
  if (!el) return
  const words = el.dataset.cycle.split('|')
  if (prefersReducedMotion()) {
    el.textContent = words[0]
    return
  }
  let w = 0
  const loop = async () => {
    await wait(2600)
    const current = words[w]
    for (let i = current.length; i >= 0; i--) {
      el.textContent = current.slice(0, i)
      await wait(22)
    }
    w = (w + 1) % words.length
    const next = words[w]
    for (let i = 1; i <= next.length; i++) {
      el.textContent = next.slice(0, i)
      await wait(45)
    }
    loop()
  }
  el.textContent = words[0]
  loop()
}

/** Project frames lean toward the cursor in 3D. */
export function initTilt() {
  if (!hasFinePointer() || prefersReducedMotion()) return
  $$('[data-tilt]').forEach((el) => {
    el.addEventListener('pointermove', (e) => {
      const r = el.getBoundingClientRect()
      const x = (e.clientX - r.left) / r.width - 0.5
      const y = (e.clientY - r.top) / r.height - 0.5
      el.style.setProperty('--rx', `${(-y * 6).toFixed(2)}deg`)
      el.style.setProperty('--ry', `${(x * 8).toFixed(2)}deg`)
    })
    el.addEventListener('pointerleave', () => {
      el.style.setProperty('--rx', '0deg')
      el.style.setProperty('--ry', '0deg')
    })
  })
}

/** The radar keeps scanning only while the hero is on screen. */
export function initRadar() {
  const radar = $('.radar')
  if (!radar || !('IntersectionObserver' in window)) return
  new IntersectionObserver(([entry]) => radar.classList.toggle('is-paused', !entry.isIntersecting)).observe(radar)
}
