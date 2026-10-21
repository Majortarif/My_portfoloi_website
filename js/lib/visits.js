// Portfolio visit counter, backed by the free Abacus counting API (no sign-up).
// A browser counts once per day; on localhost the count is only read, so
// local testing never inflates it. If the API is unreachable nothing shows.

const API = 'https://abacus.jasoncameron.dev'
const NS = 'tariful-hoque-portfolio'
const KEY = 'visits'
const MARK = 'th:visit-day'

const today = () => new Date().toISOString().slice(0, 10)
const isLocal = () => location.protocol === 'file:' || /^(localhost|127\.0\.0\.1|\[::1\])$/.test(location.hostname)

/** Count this visit (once a day per browser) and resolve to the total. */
export async function recordVisit() {
  let seen = false
  try {
    seen = localStorage.getItem(MARK) === today()
  } catch {}
  const mode = seen || isLocal() ? 'get' : 'hit'
  const abort = new AbortController()
  const timer = setTimeout(() => abort.abort(), 6000)
  try {
    const res = await fetch(`${API}/${mode}/${NS}/${KEY}`, { cache: 'no-store', signal: abort.signal })
    if (!res.ok) throw new Error(`Counter returned ${res.status}`)
    const { value } = await res.json()
    if (mode === 'hit') {
      try {
        localStorage.setItem(MARK, today())
      } catch {}
    }
    return Number(value) || 0
  } finally {
    clearTimeout(timer)
  }
}

/** Show the total in [data-visits] with a short count-up. */
export function initVisits() {
  const box = document.querySelector('[data-visits]')
  if (!box) return
  const out = box.querySelector('[data-visits-count]')
  const word = box.querySelector('[data-visits-word]')
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches

  recordVisit()
    .then((total) => {
      if (!total) return
      word.textContent = total === 1 ? 'portfolio visit' : 'portfolio visits'
      box.hidden = false
      if (reduced) {
        out.textContent = total.toLocaleString('en-US')
        return
      }
      const start = performance.now()
      const tick = (now) => {
        const p = Math.min(1, (now - start) / 1400)
        out.textContent = Math.round(total * (1 - (1 - p) ** 3)).toLocaleString('en-US')
        if (p < 1) requestAnimationFrame(tick)
      }
      requestAnimationFrame(tick)
      // background tabs pause animation frames; make sure the final number lands
      setTimeout(() => (out.textContent = total.toLocaleString('en-US')), 1500)
    })
    .catch(() => {})
}
