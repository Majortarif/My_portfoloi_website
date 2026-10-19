import { projectIndex } from '../data/projects.js'
import { skillGroups } from '../data/skills.js'
import { $, $$, html, mount } from '../lib/dom.js'

const SOURCES = { ...projectIndex, ysse: 'YSSE internship', cv: 'CV' }

// Project filter buttons, in the order they appear on the page.
const FILTERS = ['air-quality', 'agricycle', 'docusense', 'careerpilot', 'ecobin', 'pulse', 'phonebook', 'ai-ads', 'ysse', 'cv']

const evidenceMarkup = (ids, label = 'Used in') => html`
  <span class="evidence__label">${label}</span>
  ${ids.map((id) =>
    id === 'cv'
      ? html`<span class="evidence__item">Stated on CV</span>`
      : id === 'ysse'
        ? html`<a class="evidence__item" href="#experience">YSSE internship</a>`
        : html`<a class="evidence__item" href="#project-${id}">${SOURCES[id]}</a>`,
  )}`

/** Every source that backs at least one skill in the group, in page order. */
const groupSources = (group) => {
  const ids = new Set(group.skills.flatMap((s) => s.evidence))
  return FILTERS.filter((id) => ids.has(id))
}

const row = (group, gi) => html`
  <div class="skill-row" data-reveal>
    <div class="skill-row__head">
      <span class="skill-row__index">${String(gi + 1).padStart(2, '0')}</span>
      <h3 class="skill-row__title">${group.title}</h3>
      <p class="skill-row__note">${group.note}</p>
    </div>
    <div class="skill-row__body">
      <ul class="chips" role="list">
        ${group.skills.map(
          (s) => html`
            <li><button class="chip" type="button" aria-pressed="false"
              data-evidence="${s.evidence.join(' ')}">${s.name}</button></li>`,
        )}
      </ul>
      <p class="evidence" id="evidence-${group.id}" aria-live="polite">${evidenceMarkup(groupSources(group), 'Sources')}</p>
    </div>
  </div>`

export function renderSkills(el) {
  mount(
    el,
    html`
      <div class="skill-filter" role="group" aria-label="Highlight skills used in a project">
        <span class="skill-filter__label">Show evidence from</span>
        <div class="skill-filter__scroller">
          <button class="filter-btn" type="button" aria-pressed="true" data-filter="all">All</button>
          ${FILTERS.map(
            (id) => html`<button class="filter-btn" type="button" aria-pressed="false" data-filter="${id}">${SOURCES[id]}</button>`,
          )}
        </div>
      </div>
      <div class="skill-rows">${skillGroups.map(row)}</div>`,
  )

  const chips = $$('.chip', el)

  // Show a chip's evidence in its row's panel.
  const showEvidence = (chip) => {
    const panel = $('.evidence', chip.closest('.skill-row'))
    panel.innerHTML = evidenceMarkup(chip.dataset.evidence.split(' ')).value
    panel.classList.add('is-active')
    $$('.chip.is-current', chip.closest('.skill-row')).forEach((c) => c.classList.remove('is-current'))
    chip.classList.add('is-current')
  }

  chips.forEach((chip) => {
    chip.addEventListener('pointerenter', (e) => {
      if (e.pointerType === 'mouse') showEvidence(chip)
    })
    chip.addEventListener('focus', () => showEvidence(chip))
    chip.addEventListener('click', () => {
      const row = chip.closest('.skill-row')
      $$('.chip[aria-pressed="true"]', row).forEach((c) => c !== chip && c.setAttribute('aria-pressed', 'false'))
      chip.setAttribute('aria-pressed', String(chip.getAttribute('aria-pressed') !== 'true'))
      showEvidence(chip)
    })
  })

  // Project filter: dim every skill without evidence from that project.
  const filterBtns = $$('.filter-btn', el)
  filterBtns.forEach((btn) =>
    btn.addEventListener('click', () => {
      const id = btn.dataset.filter
      filterBtns.forEach((b) => b.setAttribute('aria-pressed', String(b === btn)))
      el.classList.toggle('is-filtered', id !== 'all')
      chips.forEach((c) => c.classList.toggle('is-match', id !== 'all' && c.dataset.evidence.split(' ').includes(id)))
    }),
  )
}
