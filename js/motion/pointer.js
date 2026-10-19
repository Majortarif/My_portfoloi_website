import { $, $$ } from '../lib/dom.js'
import { hasFinePointer, lerp, prefersReducedMotion } from '../lib/media.js'

// Pointer-driven effects. All of them are mouse-only and switch off under
// prefers-reduced-motion; touch devices keep the native behaviour.

const enabled = () => hasFinePointer() && !prefersReducedMotion()

/** A soft ring that trails the native cursor and labels some targets. */
export function initCursor() {
  const cursor = $('.cursor')
  if (!cursor || !enabled()) return
  const label = $('.cursor__label', cursor)
  let x = -100
  let y = -100
  let cx = x
  let cy = y
  let raf = 0

  const loop = () => {
    cx = lerp(cx, x, 0.22)
    cy = lerp(cy, y, 0.22)
    cursor.style.transform = `translate3d(${cx}px, ${cy}px, 0)`
    raf = Math.abs(cx - x) + Math.abs(cy - y) > 0.2 ? requestAnimationFrame(loop) : 0
  }

  window.addEventListener(
    'pointermove',
    (e) => {
      if (e.pointerType !== 'mouse') return
      x = e.clientX
      y = e.clientY
      if (!cursor.classList.contains('is-visible')) {
        cx = x
        cy = y
        cursor.classList.add('is-visible')
      }
      if (!raf) raf = requestAnimationFrame(loop)
    },
    { passive: true },
  )
  document.documentElement.addEventListener('pointerleave', () => cursor.classList.remove('is-visible'))

  document.addEventListener('pointerover', (e) => {
    const target = e.target.closest('a, button, [data-cursor], label, input, textarea, .chip')
    const labelled = e.target.closest('[data-cursor]')
    const text = e.target.closest('input, textarea')
    cursor.classList.toggle('is-hover', Boolean(target) && !text)
    cursor.classList.toggle('is-text', Boolean(text))
    cursor.classList.toggle('has-label', Boolean(labelled))
    label.textContent = labelled ? labelled.dataset.cursor : ''
  })
  document.addEventListener('pointerdown', () => cursor.classList.add('is-down'))
  document.addEventListener('pointerup', () => cursor.classList.remove('is-down'))
}

/** Buttons and icons that lean toward the cursor. */
export function initMagnetic() {
  if (!enabled()) return
  $$('[data-magnetic]').forEach((el) => {
    const inner = $('.btn__label', el)
    el.addEventListener('pointermove', (e) => {
      const r = el.getBoundingClientRect()
      const dx = e.clientX - (r.left + r.width / 2)
      const dy = e.clientY - (r.top + r.height / 2)
      el.style.transform = `translate(${dx * 0.22}px, ${dy * 0.3}px)`
      if (inner) inner.style.transform = `translate(${dx * 0.08}px, ${dy * 0.1}px)`
    })
    el.addEventListener('pointerleave', () => {
      el.style.transform = ''
      if (inner) inner.style.transform = ''
    })
  })
}

/** Cursor-following highlight on cards marked [data-glow] (CSS reads --gx/--gy). */
export function initGlow() {
  if (!enabled()) return
  document.addEventListener(
    'pointermove',
    (e) => {
      const card = e.target.closest?.('[data-glow]')
      if (!card) return
      const r = card.getBoundingClientRect()
      card.style.setProperty('--gx', `${e.clientX - r.left}px`)
      card.style.setProperty('--gy', `${e.clientY - r.top}px`)
    },
    { passive: true },
  )
}
