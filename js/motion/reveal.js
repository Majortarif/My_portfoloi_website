import { $$ } from '../lib/dom.js'
import { prefersReducedMotion } from '../lib/media.js'
import { scramble } from './text.js'

const easeOutExpo = (t) => (t === 1 ? 1 : 1 - 2 ** (-10 * t))

function countUp(el) {
  const target = Number(el.dataset.count)
  const suffix = el.dataset.suffix || ''
  const duration = 1400
  const start = performance.now()
  const tick = (now) => {
    const p = Math.min(1, (now - start) / duration)
    el.textContent = `${Math.round(target * easeOutExpo(p)).toLocaleString('en-US')}${suffix}`
    if (p < 1) requestAnimationFrame(tick)
  }
  requestAnimationFrame(tick)
}

/**
 * One observer drives every scroll reveal: it adds `.is-in` (CSS handles the
 * transition) and starts the scramble and count-up effects inside.
 */
export function initReveal() {
  const targets = $$('[data-reveal], [data-split="words"], .section-head, .timeline, .pipeline')
  const reduced = prefersReducedMotion()

  const counters = $$('[data-count]')
  if (!reduced) counters.forEach((c) => (c.textContent = `0${c.dataset.suffix || ''}`))

  const activate = (el) => {
    el.classList.add('is-in')
    $$('[data-scramble]', el).forEach((s) => scramble(s))
    if (!reduced) $$('[data-count]', el).forEach(countUp)
  }

  if (!('IntersectionObserver' in window)) {
    targets.forEach(activate)
    return
  }

  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return
        activate(entry.target)
        io.unobserve(entry.target)
      })
    },
    { rootMargin: '0px 0px -10% 0px', threshold: 0.12 },
  )
  targets.forEach((t) => io.observe(t))
}

/** Hero load sequence: waits briefly for fonts so letters do not reflow mid-animation. */
export function initIntro() {
  const root = document.documentElement
  const go = () => root.classList.add('is-loaded')
  const fonts = document.fonts?.ready ?? Promise.resolve()
  Promise.race([fonts, new Promise((r) => setTimeout(r, 900))]).then(() => requestAnimationFrame(go))
}
