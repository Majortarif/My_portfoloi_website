import * as THREE from 'three'

// Canvas-drawn textures: soft dots, signs, labels, a terminal and a radar face.

const MONO = '"Geist Mono", Consolas, monospace'
const SANS = 'Geist, "Segoe UI", sans-serif'
const SERIF = '"Instrument Serif", Georgia, serif'

/** Draw into a fresh canvas and wrap it as an sRGB texture. */
export function canvasTexture(w, h, draw) {
  const canvas = document.createElement('canvas')
  canvas.width = w
  canvas.height = h
  draw(canvas.getContext('2d'), w, h)
  const tex = new THREE.CanvasTexture(canvas)
  tex.colorSpace = THREE.SRGBColorSpace
  tex.anisotropy = 4
  return tex
}

/** Soft round sprite for fireflies, stars and glows. */
export const dotTexture = () =>
  canvasTexture(64, 64, (ctx) => {
    const g = ctx.createRadialGradient(32, 32, 0, 32, 32, 32)
    g.addColorStop(0, 'rgba(255,255,255,1)')
    g.addColorStop(0.22, 'rgba(255,255,255,0.85)')
    g.addColorStop(0.5, 'rgba(255,255,255,0.2)')
    g.addColorStop(1, 'rgba(255,255,255,0)')
    ctx.fillStyle = g
    ctx.fillRect(0, 0, 64, 64)
  })

const roundRect = (ctx, x, y, w, h, r) => {
  ctx.beginPath()
  ctx.moveTo(x + r, y)
  ctx.arcTo(x + w, y, x + w, y + h, r)
  ctx.arcTo(x + w, y + h, x, y + h, r)
  ctx.arcTo(x, y + h, x, y, r)
  ctx.arcTo(x, y, x + w, y, r)
  ctx.closePath()
}

/** Pill-shaped mono label, e.g. "03 · AIR QUALITY GROVE". Returns { texture, aspect }. */
export function labelTexture(text, { color = '#bff4ff', size = 44 } = {}) {
  const probe = document.createElement('canvas').getContext('2d')
  probe.font = `500 ${size}px ${MONO}`
  const w = Math.ceil(probe.measureText(text).width) + size * 1.6
  const h = Math.ceil(size * 2)
  const texture = canvasTexture(w, h, (ctx) => {
    roundRect(ctx, 3, 3, w - 6, h - 6, h / 2 - 3)
    ctx.fillStyle = 'rgba(4, 10, 18, 0.78)'
    ctx.fill()
    ctx.lineWidth = 3
    ctx.strokeStyle = 'rgba(62, 224, 255, 0.6)'
    ctx.stroke()
    ctx.font = `500 ${size}px ${MONO}`
    ctx.fillStyle = color
    ctx.textBaseline = 'middle'
    ctx.textAlign = 'center'
    ctx.fillText(text, w / 2, h / 2 + 2)
  })
  return { texture, aspect: w / h }
}

/** The trailhead sign: name in sans + serif italic, role line in mono. */
export const signTexture = (role) =>
  canvasTexture(1600, 600, (ctx, w, h) => {
    roundRect(ctx, 6, 6, w - 12, h - 12, 46)
    const bg = ctx.createLinearGradient(0, 0, 0, h)
    bg.addColorStop(0, 'rgba(8, 18, 30, 0.9)')
    bg.addColorStop(1, 'rgba(4, 8, 14, 0.9)')
    ctx.fillStyle = bg
    ctx.fill()
    ctx.lineWidth = 6
    ctx.strokeStyle = 'rgba(62, 224, 255, 0.75)'
    ctx.stroke()
    ctx.textBaseline = 'alphabetic'
    ctx.fillStyle = '#e8eef8'
    ctx.font = `600 190px ${SANS}`
    ctx.fillText('Tariful', 110, 250)
    ctx.fillStyle = '#bfeaff'
    ctx.font = `italic 210px ${SERIF}`
    ctx.fillText('Hoque', 760, 270)
    ctx.fillStyle = '#3ee0ff'
    ctx.font = `500 48px ${MONO}`
    ctx.fillText(role.toUpperCase(), 116, 410)
    ctx.fillStyle = '#7f8ca2'
    ctx.font = `500 40px ${MONO}`
    ctx.fillText('ML · RAG · DATA · IoT · PRODUCT DESIGN', 116, 500)
  })

/** A small wooden-sign style board with two lines of text. */
export const boardTexture = (top, bottom) =>
  canvasTexture(1024, 400, (ctx, w, h) => {
    roundRect(ctx, 6, 6, w - 12, h - 12, 30)
    ctx.fillStyle = 'rgba(6, 12, 20, 0.92)'
    ctx.fill()
    ctx.lineWidth = 5
    ctx.strokeStyle = 'rgba(62, 224, 255, 0.7)'
    ctx.stroke()
    ctx.fillStyle = '#3ee0ff'
    ctx.font = `500 46px ${MONO}`
    ctx.fillText(top.toUpperCase(), 60, 120)
    ctx.fillStyle = '#e8eef8'
    ctx.font = `600 92px ${SANS}`
    ctx.fillText(bottom, 60, 260)
  })

/** A terminal window, used for the DocuSense API call. */
export const terminalTexture = (lines, title) =>
  canvasTexture(1280, 800, (ctx, w, h) => {
    roundRect(ctx, 4, 4, w - 8, h - 8, 26)
    ctx.fillStyle = '#050910'
    ctx.fill()
    ctx.lineWidth = 4
    ctx.strokeStyle = 'rgba(148, 170, 210, 0.35)'
    ctx.stroke()
    ctx.fillStyle = 'rgba(12, 18, 32, 1)'
    ctx.fillRect(6, 6, w - 12, 64)
    ;['#ff5f57', '#febc2e', '#28c840'].forEach((c, i) => {
      ctx.fillStyle = c
      ctx.beginPath()
      ctx.arc(46 + i * 34, 38, 10, 0, Math.PI * 2)
      ctx.fill()
    })
    ctx.fillStyle = '#7f8ca2'
    ctx.font = `500 30px ${MONO}`
    ctx.fillText(title, 170, 48)
    ctx.font = `500 33px ${MONO}`
    lines.forEach((line, i) => {
      ctx.fillStyle = i < 3 ? '#3ee0ff' : /"[a-z_]+":/.test(line) ? '#bfeaff' : '#a9dcf4'
      ctx.fillText(line, 44, 132 + i * 46)
    })
  })

/** Radar face: rings, cross-hair and tick marks on transparent. */
export const radarTexture = () =>
  canvasTexture(1024, 1024, (ctx, w) => {
    const c = w / 2
    ctx.strokeStyle = 'rgba(62, 224, 255, 0.55)'
    ctx.lineWidth = 4
    ;[0.98, 0.74, 0.5, 0.26].forEach((r) => {
      ctx.beginPath()
      ctx.arc(c, c, r * c, 0, Math.PI * 2)
      ctx.stroke()
    })
    ctx.lineWidth = 2
    ctx.beginPath()
    ctx.moveTo(c, 8)
    ctx.lineTo(c, w - 8)
    ctx.moveTo(8, c)
    ctx.lineTo(w - 8, c)
    ctx.stroke()
    for (let a = 0; a < 360; a += 10) {
      const t = (a * Math.PI) / 180
      const r1 = c * (a % 30 === 0 ? 0.9 : 0.94)
      ctx.beginPath()
      ctx.moveTo(c + Math.cos(t) * r1, c + Math.sin(t) * r1)
      ctx.lineTo(c + Math.cos(t) * c * 0.98, c + Math.sin(t) * c * 0.98)
      ctx.stroke()
    }
  })

/** Radial glow used inside the portal and under the moon. */
export const glowTexture = (inner = 'rgba(160, 245, 255, 0.9)', outer = 'rgba(62, 224, 255, 0)') =>
  canvasTexture(512, 512, (ctx) => {
    const g = ctx.createRadialGradient(256, 256, 0, 256, 256, 256)
    g.addColorStop(0, inner)
    g.addColorStop(0.35, 'rgba(62, 224, 255, 0.35)')
    g.addColorStop(1, outer)
    ctx.fillStyle = g
    ctx.fillRect(0, 0, 512, 512)
  })
