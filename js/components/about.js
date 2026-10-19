import { about, profile } from '../data/profile.js'
import { html, icon, mount } from '../lib/dom.js'

const formatNumber = (n) => n.toLocaleString('en-US')

const portraitCard = () => html`
  <article class="bento__card bento__portrait" data-reveal data-glow>
    <div class="portrait">
      <div class="portrait__halo" aria-hidden="true"></div>
      <img class="portrait__img" src="${profile.portrait}" alt="Portrait of Tariful Hoque in a dark blazer"
        width="760" height="927" loading="lazy" decoding="async" data-parallax="0.06" />
    </div>
    <div class="portrait__caption">
      <p class="portrait__name">${profile.name}</p>
      <ul class="meta-list">
        <li>${icon('graduation')}<span>${profile.degree}, ${profile.university}</span></li>
        <li>${icon('map-pin')}<span>${profile.location}</span></li>
        <li>${icon('globe')}<span>${profile.languages.map((l) => `${l.name} (${l.level.toLowerCase()})`).join(' · ')}</span></li>
      </ul>
    </div>
  </article>`

const storyCard = () => html`
  <article class="bento__card bento__story" data-reveal>
    <p class="card-label">Profile</p>
    <div class="prose">${about.story.map((p, i) => html`<p class="${i === 0 ? 'prose__lead' : ''}">${p}</p>`)}</div>
  </article>`

const numbersCard = () => html`
  <article class="bento__card bento__numbers" data-reveal>
    <p class="card-label">By the numbers</p>
    <ul class="numbers">
      ${about.numbers.map(
        (n) => html`
          <li class="numbers__item">
            <span class="numbers__value" data-count="${n.value}" data-suffix="${n.suffix}">${formatNumber(n.value)}${n.suffix}</span>
            <span class="numbers__label">${n.label}</span>
          </li>`,
      )}
    </ul>
  </article>`

const processCard = () => html`
  <article class="bento__card bento__process" data-reveal>
    <div class="bento__process-head">
      <p class="card-label">How I work</p>
      <p class="bento__process-note">Problem to prototype, the same way every time.</p>
    </div>
    <ol class="process" data-process>
      ${about.process.map(
        (s, i) => html`
          <li class="process__step" style="--i:${i}">
            <span class="process__num">${String(i + 1).padStart(2, '0')}</span>
            <span class="process__title">${s.title}</span>
            <span class="process__text">${s.text}</span>
          </li>`,
      )}
    </ol>
  </article>`

const terminalCard = () => html`
  <article class="bento__card bento__terminal" data-reveal data-glow>
    <p class="card-label">Status</p>
    <div class="terminal terminal--live">
      <div class="terminal__bar"><span class="browser__dots"><i></i><i></i><i></i></span><span>tariful@dhaka: ~</span></div>
      <ol class="terminal__body typer" data-typer>
        ${about.terminal.map(
          (t) => html`<li class="typer__row"><span class="typer__cmd"><b>$</b> <span data-type>${t.cmd}</span></span><span class="typer__out">${t.out}</span></li>`,
        )}
      </ol>
    </div>
  </article>`

const listCard = (cls, label, items) => html`
  <article class="bento__card ${cls}" data-reveal>
    <p class="card-label">${label}</p>
    <ul class="bullet-list">${items}</ul>
  </article>`

export function renderAbout(el) {
  mount(
    el,
    html`
      ${portraitCard()}
      ${storyCard()}
      ${numbersCard()}
      ${processCard()}
      ${terminalCard()}
      ${listCard('bento__focus', 'Core interests', about.focus.map((f) => html`<li>${f}</li>`))}
      ${listCard(
        'bento__beyond',
        'Beyond the model',
        about.beyond.map((b) => html`<li><strong>${b.title}</strong><span>${b.text}</span></li>`),
      )}
    `,
  )
}
