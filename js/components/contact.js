import { profile } from '../data/profile.js'
import { $, $$ } from '../lib/dom.js'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

const MESSAGES = {
  name: 'Please tell me your name.',
  email: 'Please enter a valid email address.',
  message: 'Please write a message of at least 10 characters.',
}

function validate(field) {
  const value = field.value.trim()
  let ok = value.length > 0
  if (field.name === 'email') ok = EMAIL_RE.test(value)
  if (field.name === 'message') ok = value.length >= 10
  const error = $(`#${field.id}-error`)
  field.setAttribute('aria-invalid', String(!ok))
  if (ok) field.removeAttribute('aria-describedby')
  else field.setAttribute('aria-describedby', error.id)
  error.textContent = ok ? '' : MESSAGES[field.name]
  return ok
}

/** Opens the visitor's mail app with the message pre-filled. */
function mailtoFallback(data) {
  const subject = encodeURIComponent(`Portfolio enquiry from ${data.get('name')}`)
  const body = encodeURIComponent(`${data.get('message')}\n\n${data.get('name')}\n${data.get('email')}`)
  window.location.href = `mailto:${profile.email}?subject=${subject}&body=${body}`
}

/**
 * With `profile.formEndpoint` set (a Formspree form URL, for example) the
 * message is posted there. Without it, or if the request fails, the
 * visitor's mail app opens with the message pre-filled.
 */
export function initContactForm() {
  const form = $('[data-contact-form]')
  if (!form) return
  const status = $('[data-form-status]', form)
  const button = $('button[type="submit"]', form)
  const fields = $$('input:not([name="_gotcha"]), textarea', form)

  fields.forEach((f) =>
    f.addEventListener('blur', () => {
      if (f.value) validate(f)
    }),
  )

  form.addEventListener('submit', async (e) => {
    e.preventDefault()
    const results = fields.map(validate)
    if (results.includes(false)) {
      fields[results.indexOf(false)].focus()
      status.textContent = ''
      return
    }

    const data = new FormData(form)
    if (!profile.formEndpoint) {
      status.dataset.state = 'fallback'
      status.textContent = 'Opening your email app so you can send the message directly.'
      mailtoFallback(data)
      return
    }

    button.disabled = true
    form.classList.add('is-sending')
    status.dataset.state = 'sending'
    status.textContent = 'Sending…'

    try {
      const res = await fetch(profile.formEndpoint, {
        method: 'POST',
        headers: { Accept: 'application/json' },
        body: data,
      })
      if (!res.ok) throw new Error(`Form endpoint returned ${res.status}`)
      form.reset()
      fields.forEach((f) => f.removeAttribute('aria-invalid'))
      status.dataset.state = 'success'
      status.textContent = 'Thanks! Your message has been sent. I will get back to you by email.'
    } catch {
      status.dataset.state = 'fallback'
      status.textContent = 'Opening your email app so you can send the message directly.'
      mailtoFallback(data)
    } finally {
      button.disabled = false
      form.classList.remove('is-sending')
    }
  })
}

/** "Copy" buttons for the email address. */
export function initCopy() {
  $$('[data-copy]').forEach((btn) => {
    const label = $('[data-copy-label]', btn)
    btn.addEventListener('click', async () => {
      try {
        await navigator.clipboard.writeText(btn.dataset.copy)
        label.textContent = 'Copied'
        btn.classList.add('is-copied')
      } catch {
        label.textContent = 'Press Ctrl+C'
        const range = document.createRange()
        range.selectNodeContents(btn.previousElementSibling)
        getSelection().removeAllRanges()
        getSelection().addRange(range)
      }
      setTimeout(() => {
        label.textContent = 'Copy'
        btn.classList.remove('is-copied')
      }, 2200)
    })
  })
}
