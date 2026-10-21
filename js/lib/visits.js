// Live portfolio visit counter, backed by the free Abacus counting API
// (no sign-up). Every page load on the live site adds one visit; the number
// on screen then follows the counter live through Abacus's event stream,
// with polling as a fallback. On localhost the count is only read, so local
// testing never inflates it. If the API is unreachable nothing shows.

const API = 'https://abacus.jasoncameron.dev'
const NS = 'tariful-hoque-portfolio'
const KEY = 'visits'
const POLL_MS = 20000

const isLocal = () => location.protocol === 'file:' || /^(localhost|127\.0\.0\.1|\[::1\])$/.test(location.hostname)

async function call(mode) {
  const abort = new AbortController()
  const timer = setTimeout(() => abort.abort(), 6000)
  try {
    const res = await fetch(`${API}/${mode}/${NS}/${KEY}`, { cache: 'no-store', signal: abort.signal })
    if (!res.ok) throw new Error(`Counter returned ${res.status}`)
    const { value } = await res.json()
    return Number(value) || 0
  } finally {
    clearTimeout(timer)
  }
}

/** Add this page load as a visit (read-only on localhost) and resolve to the total. */
export const recordVisit = () => call(isLocal() ? 'get' : 'hit')

/**
 * Call `onValue(total)` whenever the counter changes, for as long as the page
 * is open. Prefers the live event stream; falls back to polling.
 */
function follow(onValue) {
  let timer = 0
  const poll = () => {
    clearInterval(timer)
    timer = setInterval(() => {
      if (!document.hidden) call('get').then(onValue).catch(() => {})
    }, POLL_MS)
  }
  if (!('EventSource' in window)) return poll()

  let failures = 0
  const stream = new EventSource(`${API}/stream/${NS}/${KEY}`)
  stream.onmessage = (e) => {
    failures = 0
    try {
      onValue(Number(JSON.parse(e.data).value) || 0)
    } catch {}
  }
  stream.onerror = () => {
    // the browser retries on its own; after a few failures switch to polling
    if (++failures >= 3) {
      stream.close()
      poll()
    }
  }
}

/** Show the live total in [data-visits]. */
export function initVisits() {
  const box = document.querySelector('[data-visits]')
  if (!box) return
  const out = box.querySelector('[data-visits-count]')
  const word = box.querySelector('[data-visits-word]')
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches
  let shown = 0
  let raf = 0

  const render = (n) => (out.textContent = n.toLocaleString('en-US'))
  const show = (total) => {
    if (!total || total === shown) return
    word.textContent = total === 1 ? 'portfolio visit' : 'portfolio visits'
    const first = box.hidden
    box.hidden = false
    if (!first) {
      // a new visit arrived while this page is open
      box.classList.remove('is-bumped')
      void box.offsetWidth
      box.classList.add('is-bumped')
    }
    const from = shown
    shown = total
    cancelAnimationFrame(raf)
    if (reduced) return render(total)
    const start = performance.now()
    const span = first ? 1400 : 600
    const tick = (now) => {
      const p = Math.min(1, (now - start) / span)
      render(Math.round(from + (total - from) * (1 - (1 - p) ** 3)))
      if (p < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    // background tabs pause animation frames; make sure the final number lands
    setTimeout(() => shown === total && render(total), span + 100)
  }

  recordVisit()
    .then((total) => {
      show(total)
      follow(show)
    })
    .catch(() => {})
}
