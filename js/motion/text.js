import { $$ } from '../lib/dom.js'
import { prefersReducedMotion } from '../lib/media.js'

// Text effects. Every effect keeps an untouched, screen-reader-only copy of
// the text and hides the animated copy from assistive tech.

const srCopy = (text) => {
  const s = document.createElement('span')
  s.className = 'sr-only'
  s.textContent = text
  return s
}

/** Wrap each word (recursing into inline elements such as <em>) in masks. */
function splitWords(node, counter) {
  const frag = document.createDocumentFragment()
  node.childNodes.forEach((child) => {
    if (child.nodeType === Node.TEXT_NODE) {
      child.textContent.split(/(\s+)/).forEach((part) => {
        if (!part) return
        if (/^\s+$/.test(part)) {
          frag.append(document.createTextNode(' '))
          return
        }
        const outer = document.createElement('span')
        outer.className = 'w'
        const inner = document.createElement('span')
        inner.className = 'w__i'
        inner.style.setProperty('--wi', counter.i++)
        inner.textContent = part
        outer.append(inner)
        frag.append(outer)
      })
    } else if (child.nodeType === Node.ELEMENT_NODE) {
      const clone = child.cloneNode(false)
      clone.append(splitWords(child, counter))
      frag.append(clone)
    }
  })
  return frag
}

function splitChars(el) {
  const text = el.textContent
  const visual = document.createElement('span')
  visual.setAttribute('aria-hidden', 'true')
  visual.className = 'split'
  ;[...text].forEach((ch, i) => {
    const outer = document.createElement('span')
    outer.className = 'c'
    const inner = document.createElement('span')
    inner.className = 'c__i'
    inner.style.setProperty('--ci', i)
    inner.textContent = ch
    outer.append(inner)
    visual.append(outer)
  })
  el.replaceChildren(srCopy(text), visual)
}

/** Split [data-split="chars"|"words"] elements for the reveal animations. */
export function initSplitText() {
  $$('[data-split]').forEach((el) => {
    if (el.dataset.split === 'chars') {
      splitChars(el)
      return
    }
    const text = el.textContent.replace(/\s+/g, ' ').trim()
    const visual = document.createElement('span')
    visual.setAttribute('aria-hidden', 'true')
    visual.className = 'split'
    visual.append(splitWords(el, { i: 0 }))
    el.replaceChildren(srCopy(text), visual)
  })
}

// ------------------------------------------------------------ scramble

const GLYPHS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789/<>_#'

/** "Decode" text into place; used on section labels as they appear. */
export function scramble(el, duration = 700) {
  const final = el.dataset.text
  if (prefersReducedMotion()) {
    el.textContent = final
    return
  }
  const start = performance.now()
  const tick = (now) => {
    const progress = Math.min(1, (now - start) / duration)
    const settled = Math.floor(progress * final.length)
    let out = final.slice(0, settled)
    for (let i = settled; i < final.length; i++) {
      out += final[i] === ' ' ? ' ' : GLYPHS[(Math.random() * GLYPHS.length) | 0]
    }
    el.textContent = out
    if (progress < 1) requestAnimationFrame(tick)
  }
  requestAnimationFrame(tick)
}

/** Prepare [data-scramble] labels (accessible copy + stored final text). */
export function initScramble() {
  $$('[data-scramble]').forEach((el) => {
    el.dataset.text = el.textContent
    el.setAttribute('aria-hidden', 'true')
    el.before(srCopy(el.textContent))
  })
}
