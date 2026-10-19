import { featured } from '../data/projects.js'
import { html, iconLink, mount } from '../lib/dom.js'

// ------------------------------------------------------------ pipeline layout
// Two hand-tuned layouts of the same graph: wide (left to right) and narrow
// (top to bottom). Each returns nodes and the edges between them.

function wideLayout(p) {
  const nodes = []
  const edges = []
  const H = 440
  const inGap = 52
  const inTop = (H - (p.inputs.length - 1) * inGap - 32) / 2
  const mGap = 70
  const mTop = (H - (p.models.length - 1) * mGap - 32) / 2
  p.inputs.forEach((label, i) => nodes.push({ id: `in-${i}`, kind: 'input', label, x: 0, y: inTop + i * inGap, w: 104, h: 32, stage: 0 }))
  nodes.push({ id: 'prep', kind: 'prep', label: p.prep, x: 196, y: 198, w: 140, h: 44, stage: 1 })
  p.models.forEach((label, j) => nodes.push({ id: `m-${j}`, kind: 'model', label, x: 400, y: mTop + j * mGap, w: 118, h: 32, stage: 2 }))
  nodes.push({ id: 'xai', kind: 'xai', label: p.explain, x: 574, y: 190, w: 60, h: 60, stage: 3 })
  nodes.push({ id: 'out', kind: 'output', label: p.output, x: 668, y: 202, w: 88, h: 36, stage: 4 })

  const by = Object.fromEntries(nodes.map((n) => [n.id, n]))
  const right = (n) => [n.x + n.w, n.y + n.h / 2]
  const left = (n) => [n.x, n.y + n.h / 2]
  p.inputs.forEach((_, i) => edges.push({ from: `in-${i}`, to: 'prep', a: right(by[`in-${i}`]), b: left(by.prep), stage: 0 }))
  p.models.forEach((_, j) => edges.push({ from: 'prep', to: `m-${j}`, a: right(by.prep), b: left(by[`m-${j}`]), stage: 1 }))
  p.models.forEach((_, j) => edges.push({ from: `m-${j}`, to: 'xai', a: right(by[`m-${j}`]), b: left(by.xai), stage: 2 }))
  edges.push({ from: 'xai', to: 'out', a: right(by.xai), b: left(by.out), stage: 3 })
  return { nodes, edges, width: 760, height: H, dir: 'h' }
}

function narrowLayout(p) {
  const nodes = []
  const edges = []
  const W = 360
  p.inputs.forEach((label, i) => {
    const perRow = 4
    const rowI = Math.floor(i / perRow)
    const inRow = Math.min(perRow, p.inputs.length - rowI * perRow)
    const col = i % perRow
    const x0 = (W - inRow * 88 + 8) / 2
    nodes.push({ id: `in-${i}`, kind: 'input', label, x: x0 + col * 88, y: 4 + rowI * 42, w: 80, h: 30, stage: 0 })
  })
  nodes.push({ id: 'prep', kind: 'prep', label: p.prep, x: 100, y: 150, w: 160, h: 40, stage: 1 })
  const mx0 = (W - p.models.length * 80 + 12) / 2
  p.models.forEach((_, j) => nodes.push({ id: `m-${j}`, kind: 'model', label: p.short[j], x: mx0 + j * 80, y: 262, w: 68, h: 30, stage: 2 }))
  nodes.push({ id: 'xai', kind: 'xai', label: p.explain, x: 150, y: 360, w: 60, h: 60, stage: 3 })
  nodes.push({ id: 'out', kind: 'output', label: p.output, x: 120, y: 476, w: 120, h: 36, stage: 4 })

  const by = Object.fromEntries(nodes.map((n) => [n.id, n]))
  const bottom = (n) => [n.x + n.w / 2, n.y + n.h]
  const top = (n) => [n.x + n.w / 2, n.y]
  // Top-row edges pass behind the second row; node fills are opaque.
  p.inputs.forEach((_, i) => edges.push({ from: `in-${i}`, to: 'prep', a: bottom(by[`in-${i}`]), b: top(by.prep), stage: 0 }))
  p.models.forEach((_, j) => edges.push({ from: 'prep', to: `m-${j}`, a: bottom(by.prep), b: top(by[`m-${j}`]), stage: 1 }))
  p.models.forEach((_, j) => edges.push({ from: `m-${j}`, to: 'xai', a: bottom(by[`m-${j}`]), b: top(by.xai), stage: 2 }))
  edges.push({ from: 'xai', to: 'out', a: bottom(by.xai), b: top(by.out), stage: 3 })
  return { nodes, edges, width: W, height: 516, dir: 'v' }
}

const curve = ({ a: [x1, y1], b: [x2, y2] }, dir) => {
  if (dir === 'h') {
    const mx = (x1 + x2) / 2
    return `M${x1} ${y1} C${mx} ${y1} ${mx} ${y2} ${x2} ${y2}`
  }
  const my = (y1 + y2) / 2
  return `M${x1} ${y1} C${x1} ${my} ${x2} ${my} ${x2} ${y2}`
}

function nodeMarkup(n) {
  const cx = n.x + n.w / 2
  const cy = n.y + n.h / 2
  const shape =
    n.kind === 'xai'
      ? html`<circle class="pipe-node__shape" cx="${cx}" cy="${cy}" r="${n.w / 2}" /><circle class="pipe-node__pulse" cx="${cx}" cy="${cy}" r="${n.w / 2}" />`
      : html`<rect class="pipe-node__shape" x="${n.x}" y="${n.y}" width="${n.w}" height="${n.h}" rx="${n.h / 2}" />`
  return html`
    <g class="pipe-node pipe-node--${n.kind}" data-node="${n.id}" style="--stage:${n.stage}">
      ${shape}
      <text class="pipe-node__label" x="${cx}" y="${cy}" dy="0.35em" text-anchor="middle">${n.label}</text>
    </g>`
}

/** Build the animated model-pipeline SVG for the given orientation. */
export function pipelineSVG(p, narrow) {
  const layout = narrow ? narrowLayout(p) : wideLayout(p)
  const edges = layout.edges.map((e) => {
    const d = curve(e, layout.dir)
    return html`
      <g class="pipe-edge" data-from="${e.from}" data-to="${e.to}" style="--stage:${e.stage}">
        <path class="pipe-edge__base" d="${d}" pathLength="1" />
        <path class="pipe-edge__flow" d="${d}" pathLength="1" />
      </g>`
  })
  return html`
    <svg class="pipeline__svg" viewBox="0 0 ${layout.width} ${layout.height}" role="img"
      aria-label="Model pipeline: seven sensor readings are labelled with the US EPA AQI, used to train and compare Random Forest, LightGBM, KNN and SVM, and the forest is exported to JSON for the live web app.">
      <g class="pipe-edges">${edges}</g>
      <g class="pipe-nodes">${layout.nodes.map(nodeMarkup)}</g>
    </svg>`
}

// ------------------------------------------------------------ case study

export function renderFeatured(el) {
  const f = featured
  mount(
    el,
    html`
      <article class="case" id="project-${f.id}" data-glow>
        <div class="case__top">
          <p class="case__kicker" data-reveal><span class="case__badge">01</span>${f.kicker}</p>
          <h3 class="case__title" data-split="words">${f.title}</h3>
          <p class="case__lede" data-reveal>${f.lede}</p>
        </div>

        <div class="case__grid">
          <figure class="case__visual" data-reveal>
            <div class="pipeline" data-pipeline>${pipelineSVG(f.pipeline, false)}</div>
            <figcaption class="case__caption">
              <span class="case__caption-dot" aria-hidden="true"></span>
              Pipeline from the capstone: 7 sensor readings → EPA AQI labels → 4 models compared → forest exported to JSON → live app. Hover a node to trace it.
            </figcaption>
          </figure>

          <dl class="case__facts">
            ${f.facts.map(
              (fact, i) => html`
                <div class="case__fact" data-reveal style="--i:${i}">
                  <dt>${fact.label}</dt>
                  <dd>${fact.text}</dd>
                </div>`,
            )}
          </dl>
        </div>

        <a class="case__shot" href="${f.links[0].href}" target="_blank" rel="noopener noreferrer" tabindex="-1" data-cursor="Open" data-reveal data-tilt>
          <div class="browser">
            <div class="browser__bar" aria-hidden="true">
              <span class="browser__dots"><i></i><i></i><i></i></span>
              <span class="browser__url">${f.url}</span>
              <span class="browser__live"><i></i>Live</span>
            </div>
            <div class="browser__view"><img src="${f.image.src}" alt="${f.image.alt}" width="${f.image.width}" height="${f.image.height}" loading="lazy" decoding="async" /></div>
          </div>
        </a>

        <div class="case__foot" data-reveal>
          <p class="case__role">${f.role}</p>
          <ul class="tag-list">${f.tags.map((t) => html`<li class="tag">${t}</li>`)}</ul>
          <div class="link-row">${f.links.map((l) => iconLink(l, 'link-chip link-chip--accent'))}</div>
        </div>
      </article>`,
  )

  initPipeline(el.querySelector('[data-pipeline]'), f.pipeline)
}

/** Swap layouts at narrow widths and trace connected edges on hover. */
function initPipeline(wrap, pipeline) {
  let narrow = null

  const bindHover = () => {
    const svg = wrap.querySelector('svg')
    const edges = [...svg.querySelectorAll('.pipe-edge')]
    svg.querySelectorAll('.pipe-node').forEach((node) => {
      const id = node.dataset.node
      node.addEventListener('pointerenter', () => {
        svg.classList.add('is-tracing')
        node.classList.add('is-hot')
        edges.forEach((e) => e.classList.toggle('is-hot', e.dataset.from === id || e.dataset.to === id))
      })
      node.addEventListener('pointerleave', () => {
        svg.classList.remove('is-tracing')
        node.classList.remove('is-hot')
        edges.forEach((e) => e.classList.remove('is-hot'))
      })
    })
  }

  const update = (width) => {
    const next = width < 560
    if (next === narrow) return
    narrow = next
    wrap.innerHTML = pipelineSVG(pipeline, narrow).value
    wrap.classList.toggle('pipeline--narrow', narrow)
    bindHover()
  }

  update(wrap.clientWidth || window.innerWidth)
  new ResizeObserver(([entry]) => update(entry.contentRect.width)).observe(wrap)
}
