import { $, html, mount } from '../lib/dom.js'

// The HTML layer over the canvas: chapter card, trail rail, location and hint.
// All text lives here (not in the 3D scene) so it stays readable and accessible.

const pad = (n) => String(n).padStart(2, '0')

const linkRow = (links = []) =>
  links.length
    ? html`<div class="card__links">${links.map(
        (l, i) =>
          html`<a class="chip-link ${i === 0 ? 'chip-link--accent' : ''}" href="${l.href}"${l.download ? html` download` : ''}${/^https?:/.test(l.href) ? html` target="_blank" rel="noopener noreferrer"` : ''}>${l.label}</a>`,
      )}</div>`
    : ''

const cardMarkup = (c, i, total) => html`
  <div class="card__top">
    <span class="card__count">${pad(i + 1)} / ${pad(total)}</span>
    <span class="card__kicker">${c.kicker}</span>
  </div>
  <h2 class="card__title">${c.title}</h2>
  ${c.sub ? html`<p class="card__sub">${c.sub}</p>` : ''}
  <p class="card__text">${c.text}</p>
  ${c.points ? html`<ul class="card__points">${c.points.map((p) => html`<li>${p}</li>`)}</ul>` : ''}
  ${c.items
    ? html`<ul class="card__items">${c.items.map(
        (it) => html`<li><p class="card__item-title">${it.title}</p><p class="card__item-text">${it.text}</p>${linkRow(it.links)}</li>`,
      )}</ul>`
    : ''}
  ${c.groups
    ? html`<ul class="card__groups">${c.groups.map(
        (g) => html`<li><p class="card__group-title">${g.title}</p><p class="card__group-skills">${g.skills.join(' · ')}</p></li>`,
      )}</ul>`
    : ''}
  ${c.email
    ? html`<p class="card__email"><span>${c.email}</span><button type="button" class="card__copy" data-copy="${c.email}">Copy</button></p>`
    : ''}
  ${linkRow(c.links)}
  <div class="card__nav">
    <button type="button" class="nav-btn" data-go="${i - 1}" ${i === 0 ? html`disabled` : ''}>← Back</button>
    <button type="button" class="nav-btn nav-btn--next" data-go="${i + 1}" ${i === total - 1 ? html`disabled` : ''}>${i === total - 1 ? 'End of trail' : 'Next stop →'}</button>
  </div>`

export function initOverlay(chapters, go) {
  const card = $('[data-card]')
  const rail = $('[data-rail]')
  const where = $('[data-where]')
  const hint = $('[data-hint]')
  let shown = -1

  mount(
    rail,
    chapters.map(
      (c, i) => html`<li><button type="button" data-go="${i}" aria-label="Go to ${c.label}"><span class="rail__dot"></span><span class="rail__label">${pad(i + 1)} ${c.label}</span></button></li>`,
    ),
  )

  document.addEventListener('click', (e) => {
    const goBtn = e.target.closest('[data-go]')
    if (goBtn && !goBtn.disabled) go(Number(goBtn.dataset.go))
    const copy = e.target.closest('[data-copy]')
    if (copy) {
      navigator.clipboard?.writeText(copy.dataset.copy).then(
        () => (copy.textContent = 'Copied'),
        () => (copy.textContent = 'Select it'),
      )
      setTimeout(() => (copy.textContent = 'Copy'), 2000)
    }
  })

  return {
    /** Show chapter i's card (visible = the walker has arrived). */
    set(i, visible, side = 'left') {
      if (i !== shown) {
        shown = i
        mount(card, cardMarkup(chapters[i], i, chapters.length))
        card.scrollTop = 0
        where.textContent = `${pad(i + 1)} · ${chapters[i].label}`
        rail.querySelectorAll('button').forEach((b, k) => (k === i ? b.setAttribute('aria-current', 'step') : b.removeAttribute('aria-current')))
      }
      card.classList.toggle('is-visible', visible)
      card.classList.toggle('card--right', side === 'right')
      card.inert = !visible
    },
    walked() {
      hint.classList.add('is-gone')
    },
  }
}
