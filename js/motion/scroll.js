import { $, $$ } from '../lib/dom.js'
import { clamp, prefersReducedMotion } from '../lib/media.js'

/**
 * A single rAF-throttled scroll handler for: the progress bar, the header's
 * scrolled/hidden states, parallax layers and the timeline's drawn rail.
 */
export function initScroll() {
  const root = document.documentElement
  const bar = $('.scroll-progress span')
  const header = $('[data-header]')
  const timeline = $('[data-timeline]')
  const parallax = $$('[data-parallax]')
  const visible = new Set()

  const io = new IntersectionObserver((entries) =>
    entries.forEach((e) => (e.isIntersecting ? visible.add(e.target) : visible.delete(e.target))),
  )
  parallax.forEach((el) => io.observe(el))

  let lastY = window.scrollY
  let ticking = false

  const frame = () => {
    ticking = false
    const y = window.scrollY
    const vh = window.innerHeight
    const max = root.scrollHeight - vh
    bar.style.transform = `scaleX(${max > 0 ? y / max : 0})`

    header.classList.toggle('is-scrolled', y > 24)
    const menuOpen = root.classList.contains('menu-open')
    if (!menuOpen && Math.abs(y - lastY) > 4) {
      header.classList.toggle('is-hidden', y > lastY && y > 640)
    }
    lastY = y

    if (timeline) {
      const r = timeline.getBoundingClientRect()
      timeline.style.setProperty('--progress', clamp((vh * 0.62 - r.top) / r.height, 0, 1).toFixed(4))
    }

    if (!prefersReducedMotion()) {
      visible.forEach((el) => {
        const r = el.getBoundingClientRect()
        const offset = r.top + r.height / 2 - vh / 2
        el.style.setProperty('--py', `${(-offset * Number(el.dataset.parallax)).toFixed(2)}px`)
      })
    }
  }

  const request = () => {
    if (ticking) return
    ticking = true
    requestAnimationFrame(frame)
  }
  window.addEventListener('scroll', request, { passive: true })
  window.addEventListener('resize', request)
  // Keyboard users tabbing into a hidden header should see it.
  header.addEventListener('focusin', () => header.classList.remove('is-hidden'))
  frame()
}
