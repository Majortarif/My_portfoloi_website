import { activities, certifications, milestones } from '../data/achievements.js'
import { html, icon, iconLink, mount } from '../lib/dom.js'

const certificationBlock = () =>
  certifications.length
    ? html`
        <div class="achv-block" data-reveal>
          <p class="card-label">Certifications</p>
          <ul class="activity-list">
            ${certifications.map(
              (c) => html`
                <li class="activity">
                  ${icon('award')}
                  <div><p class="activity__title">${c.title}</p><p class="activity__meta">${c.issuer} · ${c.year}</p></div>
                  ${c.href ? iconLink({ label: 'View', href: c.href, icon: 'arrow-up-right' }) : ''}
                </li>`,
            )}
          </ul>
        </div>`
    : ''

export function renderAchievements(el) {
  mount(
    el,
    html`
      <ul class="milestones">
        ${milestones.map(
          (m, i) => html`
            <li class="milestone" data-reveal style="--i:${i}" data-glow>
              <span class="milestone__icon">${icon(m.icon)}</span>
              <p class="milestone__value">${m.value}</p>
              <h3 class="milestone__title">${m.title}</h3>
              <p class="milestone__text">${m.text}</p>
            </li>`,
        )}
      </ul>

      <div class="achv-block" data-reveal>
        <p class="card-label">Workshops, seminars &amp; events</p>
        <ul class="activity-list">
          ${activities.map(
            (a) => html`
              <li class="activity">
                ${icon(a.icon)}
                <div><p class="activity__title">${a.title}</p><p class="activity__meta">${a.meta}</p></div>
              </li>`,
          )}
        </ul>
      </div>
      ${certificationBlock()}`,
  )
}
