import { builds, moreWork } from '../data/projects.js'
import { html, icon, iconLink, mount } from '../lib/dom.js'

const browserFrame = (p) => {
  const live = p.links.find((l) => l.label === 'Live demo')
  return html`
    <a class="build__media" href="${live.href}" target="_blank" rel="noopener noreferrer" tabindex="-1"
      data-cursor="Open" data-glow data-tilt>
      <div class="browser">
        <div class="browser__bar" aria-hidden="true">
          <span class="browser__dots"><i></i><i></i><i></i></span>
          <span class="browser__url">${p.url}</span>
        </div>
        <div class="browser__view">
          <img src="${p.image.src}" alt="${p.image.alt}" width="${p.image.width}" height="${p.image.height}"
            loading="lazy" decoding="async" />
        </div>
      </div>
    </a>`
}

const codeFrame = (p) => html`
  <a class="build__media build__media--code" href="${p.links[0].href}" target="_blank" rel="noopener noreferrer" tabindex="-1"
    data-cursor="Source" data-glow data-tilt>
    ${terminal(p.terminal, p.terminalTitle, 'terminal--api')}
  </a>`

const build = (p, i) => html`
  <article class="build ${i % 2 ? 'build--flip' : ''}" id="project-${p.id}">
    <div class="build__visual" data-reveal>${p.visual === 'terminal' ? codeFrame(p) : browserFrame(p)}</div>
    <div class="build__body" data-reveal>
      <p class="build__kicker"><span class="build__index">${p.index}</span>${p.kicker}</p>
      <h3 class="build__title">${p.title}</h3>
      <p class="build__summary">${p.summary}</p>
      <ul class="check-list">${p.features.map((f) => html`<li>${f}</li>`)}</ul>
      <ul class="tag-list">${p.tags.map((t) => html`<li class="tag">${t}</li>`)}</ul>
      <div class="link-row">${p.links.map((l, li) => iconLink(l, li === 0 ? 'link-chip link-chip--accent' : 'link-chip'))}</div>
    </div>
  </article>`

export function renderBuilds(el) {
  mount(el, builds.map(build))
}

// ------------------------------------------------------------ smaller work

function terminal(lines, title, cls = '') {
  return html`
  <div class="terminal ${cls}" aria-hidden="true">
    <div class="terminal__bar"><span class="browser__dots"><i></i><i></i><i></i></span><span>${title}</span></div>
    <pre class="terminal__body">${lines.map(
      (l, i) =>
        html`<span class="terminal__line" style="--i:${i}">${l || ' '}${i === lines.length - 1 ? html`<span class="terminal__caret"></span>` : ''}</span>`,
    )}</pre>
  </div>`
}

const flow = (steps) => html`
  <ol class="flow" aria-label="Workflow">
    ${steps.map((s, i) => html`<li class="flow__step" style="--i:${i}"><span>${String(i + 1).padStart(2, '0')}</span>${s}</li>`)}
  </ol>`

const mini = (p) => html`
  <article class="mini" id="project-${p.id}" data-reveal data-glow>
    <div class="mini__visual">${p.visual === 'terminal' ? terminal(p.terminal, p.terminalTitle) : flow(p.flow)}</div>
    <div class="mini__body">
      <p class="build__kicker">${icon(p.visual === 'terminal' ? 'terminal' : 'play')}${p.kicker}</p>
      <h3 class="mini__title">${p.title}</h3>
      <p class="mini__summary">${p.summary}</p>
      <ul class="tag-list">${p.tags.map((t) => html`<li class="tag">${t}</li>`)}</ul>
      <div class="link-row">${p.links.map((l) => iconLink(l))}</div>
    </div>
  </article>`

export function renderMoreWork(el) {
  mount(
    el,
    html`
      <div class="more-work__head" data-reveal>
        <p class="card-label">More work</p>
        <p class="more-work__note">Earlier and smaller projects that show range.</p>
      </div>
      <div class="more-work__grid">${moreWork.map(mini)}</div>`,
  )
}
