import { education } from '../data/education.js'
import { experience } from '../data/experience.js'
import { html, mount } from '../lib/dom.js'

const tagList = (tags) => (tags.length ? html`<ul class="tag-list">${tags.map((t) => html`<li class="tag">${t}</li>`)}</ul>` : '')

const entry = (e) => html`
  <li class="tl-item ${e.current ? 'tl-item--now' : ''}" data-reveal>
    <div class="tl-item__meta">
      <span class="tl-item__period">${e.period}</span>
      <span class="tl-item__type">${e.type}</span>
      ${e.current ? html`<span class="now-badge"><i aria-hidden="true"></i>Current role</span>` : ''}
    </div>
    <span class="tl-item__node" aria-hidden="true"></span>
    <div class="tl-item__body">
      <h3 class="tl-item__title">${e.title}<span class="tl-item__org">${e.org}</span></h3>
      <p class="tl-item__summary">${e.summary}</p>
      ${e.points.length ? html`<ul class="check-list">${e.points.map((p) => html`<li>${p}</li>`)}</ul>` : ''}
      ${e.roles
        ? html`<ul class="roles">${e.roles.map(
            (r, i) => html`<li class="role" style="--i:${i}" data-glow><p class="role__org">${r.org}</p><p class="role__text">${r.text}</p></li>`,
          )}</ul>`
        : ''}
      ${tagList(e.tags)}
    </div>
  </li>`

export function renderExperience(el) {
  mount(
    el,
    html`
      <div class="timeline__rail" aria-hidden="true"><span class="timeline__progress"></span></div>
      <ol class="timeline__list">${experience.map(entry)}</ol>`,
  )
}

export function renderEducation(el) {
  mount(
    el,
    education.map(
      (e) => html`
        <li class="edu" data-reveal>
          <p class="edu__level">${e.level}</p>
          <div class="edu__main">
            <h3 class="edu__institution">${e.institution}</h3>
            <p class="edu__degree">${e.degree}<span> · ${e.place}</span></p>
            ${e.detail ? html`<p class="edu__detail">${e.detail}</p>` : ''}
          </div>
          <p class="edu__result">
            <span class="edu__result-label">${e.result.label}</span>
            <span class="edu__result-value">${e.result.value}<span> / ${e.result.scale}</span></span>
          </p>
        </li>`,
    ),
  )
}
