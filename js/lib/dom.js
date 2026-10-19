// Tiny, safe templating: every interpolated value is HTML-escaped unless it
// is itself the result of `html` (so templates can be nested).

class SafeHTML {
  constructor(value) {
    this.value = value
  }
  toString() {
    return this.value
  }
}

const ESCAPES = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }

/** Escape a string for safe insertion into HTML text or attributes. */
export const escapeHTML = (s) => String(s).replace(/[&<>"']/g, (c) => ESCAPES[c])

const render = (v) => {
  if (v == null || v === false) return ''
  if (Array.isArray(v)) return v.map(render).join('')
  if (v instanceof SafeHTML) return v.value
  return escapeHTML(v)
}

/**
 * Tagged template that escapes interpolations.
 * @example html`<p>${userText}</p>`
 */
export function html(strings, ...values) {
  let out = strings[0]
  values.forEach((v, i) => {
    out += render(v) + strings[i + 1]
  })
  return new SafeHTML(out)
}

/** Replace an element's children with a rendered template. */
export function mount(el, template) {
  if (el) el.innerHTML = render(template)
  return el
}

/** Inline sprite icon. */
export const icon = (name, cls = '') =>
  html`<svg class="icon ${cls}" aria-hidden="true" focusable="false"><use href="#i-${name}"/></svg>`

/** True for absolute http(s) URLs, which open in a new tab. */
export const isExternal = (href) => /^https?:\/\//.test(href)

/**
 * Link with an icon. External links open in a new tab and say so to
 * screen readers.
 */
export function iconLink({ label, href, icon: iconName }, cls = 'link-chip') {
  const external = isExternal(href)
  return html`<a class="${cls}" href="${href}"${external ? html` target="_blank" rel="noopener noreferrer"` : ''}>${icon(iconName)}<span>${label}</span>${external ? html`<span class="sr-only"> (opens in a new tab)</span>` : ''}</a>`
}

export const $ = (sel, root = document) => root.querySelector(sel)
export const $$ = (sel, root = document) => [...root.querySelectorAll(sel)]
