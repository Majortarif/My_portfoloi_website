import { gallery, galleryCategories } from '../data/achievements.js'
import { $, $$, html, mount } from '../lib/dom.js'

const catLabel = Object.fromEntries(galleryCategories.map((c) => [c.id, c.label]))
const countIn = (id) => gallery.filter((g) => g.cat === id).length

/** Filterable photo wall with captions, plus a keyboard- and swipe-friendly lightbox. */
export function renderGallery(el) {
  mount(
    el,
    html`
      <div class="gallery-filter" role="group" aria-label="Filter photos by category" data-reveal>
        <button class="filter-btn" type="button" aria-pressed="true" data-cat="all">All<span>${gallery.length}</span></button>
        ${galleryCategories.map(
          (c) => html`<button class="filter-btn" type="button" aria-pressed="false" data-cat="${c.id}">${c.label}<span>${countIn(c.id)}</span></button>`,
        )}
      </div>
      <ul class="gallery-wall" data-gallery-wall aria-label="Photo gallery">
        ${gallery.map(
          (g, i) => html`
            <li class="shot" data-cat="${g.cat}" style="--i:${i % 6}" data-reveal>
              <button class="shot__btn" type="button" data-index="${i}" data-cursor="View" data-glow
                aria-label="${g.caption}: ${g.text} Open photo ${i + 1} of ${gallery.length}">
                <span class="shot__media" style="--ratio:${(g.w / g.h).toFixed(3)}">
                  <img src="${g.thumb}" alt="${g.alt}" width="${g.w}" height="${g.h}" loading="lazy" decoding="async" />
                  <span class="shot__scan" aria-hidden="true"></span>
                  <span class="shot__hud" aria-hidden="true"><i></i><i></i><i></i><i></i></span>
                </span>
                <span class="shot__caption">
                  <span class="shot__cat">${catLabel[g.cat]}</span>
                  <span class="shot__title">${g.caption}</span>
                  <span class="shot__text">${g.text}</span>
                </span>
              </button>
            </li>`,
        )}
      </ul>`,
  )

  initFilter(el)
  initLightbox($$('.shot__btn', el))
}

function initFilter(root) {
  const btns = $$('.gallery-filter .filter-btn', root)
  const shots = $$('.shot', root)
  btns.forEach((btn) =>
    btn.addEventListener('click', () => {
      const cat = btn.dataset.cat
      btns.forEach((b) => b.setAttribute('aria-pressed', String(b === btn)))
      shots.forEach((s) => {
        const show = cat === 'all' || s.dataset.cat === cat
        s.hidden = !show
        if (show) s.classList.add('is-in')
      })
    }),
  )
}

function initLightbox(buttons) {
  const dialog = $('[data-lightbox]')
  const img = $('[data-lightbox-img]', dialog)
  const title = $('[data-lightbox-title]', dialog)
  const text = $('[data-lightbox-text]', dialog)
  const meta = $('[data-lightbox-meta]', dialog)
  let order = gallery.map((_, i) => i)
  let pos = 0
  let opener = null

  const show = (p) => {
    pos = (p + order.length) % order.length
    const g = gallery[order[pos]]
    img.classList.remove('is-ready')
    img.onload = () => img.classList.add('is-ready')
    img.src = g.full
    img.alt = g.alt
    title.textContent = g.caption
    text.textContent = g.text
    meta.textContent = `${catLabel[g.cat]} · ${pos + 1} / ${order.length}`
    // warm the next photo
    new Image().src = gallery[order[(pos + 1) % order.length]].full
  }

  buttons.forEach((btn) =>
    btn.addEventListener('click', () => {
      opener = btn
      // browse only the photos that are currently visible
      order = buttons.filter((b) => !b.closest('.shot').hidden).map((b) => Number(b.dataset.index))
      show(order.indexOf(Number(btn.dataset.index)))
      dialog.showModal()
      document.documentElement.classList.add('is-locked')
    }),
  )

  $('[data-lightbox-prev]', dialog).addEventListener('click', () => show(pos - 1))
  $('[data-lightbox-next]', dialog).addEventListener('click', () => show(pos + 1))
  $('[data-lightbox-close]', dialog).addEventListener('click', () => dialog.close())
  dialog.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') show(pos - 1)
    if (e.key === 'ArrowRight') show(pos + 1)
  })
  // Clicking the backdrop (the dialog element itself) closes it.
  dialog.addEventListener('click', (e) => {
    if (e.target === dialog) dialog.close()
  })
  dialog.addEventListener('close', () => {
    document.documentElement.classList.remove('is-locked')
    opener?.focus()
  })

  // Swipe left/right on touch screens.
  let x0 = null
  dialog.addEventListener('touchstart', (e) => (x0 = e.touches[0].clientX), { passive: true })
  dialog.addEventListener(
    'touchend',
    (e) => {
      if (x0 === null) return
      const dx = e.changedTouches[0].clientX - x0
      if (Math.abs(dx) > 50) show(pos + (dx < 0 ? 1 : -1))
      x0 = null
    },
    { passive: true },
  )
}
