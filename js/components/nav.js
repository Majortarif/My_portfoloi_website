import { $, $$ } from '../lib/dom.js'

/** Mobile menu: toggle, focus trap, Escape to close, scroll lock. */
export function initMobileMenu() {
  const toggle = $('[data-menu-toggle]')
  const menu = $('[data-mobile-menu]')
  if (!toggle || !menu) return
  const label = $('.sr-only', toggle)
  const focusables = () => $$('a, button', menu).concat(toggle)

  const setOpen = (open) => {
    toggle.setAttribute('aria-expanded', String(open))
    label.textContent = open ? 'Close menu' : 'Open menu'
    document.documentElement.classList.toggle('is-locked', open)
    document.documentElement.classList.toggle('menu-open', open)
    if (open) {
      menu.hidden = false
      requestAnimationFrame(() => menu.classList.add('is-open'))
      $('a', menu)?.focus({ preventScroll: true })
    } else {
      menu.classList.remove('is-open')
      // wait for the exit transition before hiding from assistive tech
      const done = () => {
        if (!menu.classList.contains('is-open')) menu.hidden = true
      }
      menu.addEventListener('transitionend', done, { once: true })
      setTimeout(done, 600)
    }
  }

  toggle.addEventListener('click', () => setOpen(toggle.getAttribute('aria-expanded') !== 'true'))
  $$('a', menu).forEach((a) => a.addEventListener('click', () => setOpen(false)))

  document.addEventListener('keydown', (e) => {
    if (toggle.getAttribute('aria-expanded') !== 'true') return
    if (e.key === 'Escape') {
      setOpen(false)
      toggle.focus()
    }
    if (e.key === 'Tab') {
      const items = focusables()
      const first = items[0]
      const last = items[items.length - 1]
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault()
        last.focus()
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault()
        first.focus()
      }
    }
  })

  // Close if the viewport grows past the mobile breakpoint.
  window.matchMedia('(min-width: 1024px)').addEventListener('change', (e) => {
    if (e.matches) setOpen(false)
  })
}

/**
 * Marks the nav link for the section in view (aria-current) and slides the
 * indicator pill under it.
 */
export function initActiveSection() {
  const list = $('[data-nav]')
  const indicator = $('.nav__indicator')
  if (!list) return
  const links = $$('a', list)
  const mobileLinks = $$('.mobile-menu__list a')
  const sections = links.map((a) => $(a.getAttribute('href'))).filter(Boolean)

  const moveIndicator = (link) => {
    if (!link) {
      indicator.style.opacity = '0'
      return
    }
    const navBox = list.getBoundingClientRect()
    const box = link.getBoundingClientRect()
    indicator.style.opacity = '1'
    indicator.style.width = `${box.width}px`
    indicator.style.transform = `translateX(${box.left - navBox.left}px)`
  }

  let current = null
  const setCurrent = (id) => {
    if (id === current) return
    current = id
    ;[...links, ...mobileLinks].forEach((a) => {
      if (a.getAttribute('href') === `#${id}`) a.setAttribute('aria-current', 'true')
      else a.removeAttribute('aria-current')
    })
    moveIndicator(links.find((a) => a.getAttribute('href') === `#${id}`))
  }

  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) setCurrent(e.target.id)
      })
    },
    { rootMargin: '-45% 0px -50% 0px' },
  )
  sections.forEach((s) => io.observe(s))

  // Above the first section nothing is current.
  const hero = $('#top')
  if (hero) {
    new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting && e.intersectionRatio > 0.5) setCurrent(null)
      },
      { threshold: [0.5] },
    ).observe(hero)
  }

  window.addEventListener('resize', () => moveIndicator(links.find((a) => a.hasAttribute('aria-current'))))
}
