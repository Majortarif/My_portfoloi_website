import * as THREE from 'three'
import { boardTexture, dotTexture, glowTexture, labelTexture, radarTexture, signTexture, terminalTexture } from './textures.js'
import { CYAN, glow, seeded } from './world.js'

// One landmark per chapter. Every station gets a sonar ring, a light and a
// floating waypoint label; `kind` adds the landmark itself.

const UP = new THREE.Vector3(0, 1, 0)
const tmp = new THREE.Vector3()

const basic = (color, extra = {}) => new THREE.MeshBasicMaterial({ color, ...extra })
const additive = (color, opacity = 1) =>
  basic(color, { transparent: true, opacity, depthWrite: false, blending: THREE.AdditiveBlending, side: THREE.DoubleSide })

/** Turn an object (in a placed group) to face `eye`, staying upright. */
function face(obj, eye) {
  obj.updateWorldMatrix(true, false)
  obj.getWorldPosition(tmp)
  obj.lookAt(eye.x, tmp.y, eye.z)
}

/** A framed picture: cyan border, dark mat, image. */
function frame(map, w, h) {
  const g = new THREE.Group()
  const border = new THREE.Mesh(new THREE.PlaneGeometry(w + 0.22, h + 0.22), basic(glow(CYAN, 1.4)))
  const mat = new THREE.Mesh(new THREE.PlaneGeometry(w + 0.1, h + 0.1), basic(0x04060b))
  mat.position.z = 0.004
  const img = new THREE.Mesh(new THREE.PlaneGeometry(w, h), basic(0xffffff, { map }))
  img.position.z = 0.008
  const back = new THREE.Mesh(new THREE.PlaneGeometry(w + 0.22, h + 0.22), basic(0x0a1420))
  back.rotation.y = Math.PI
  back.position.z = -0.004
  g.add(border, mat, img, back)
  return g
}

/** A post from the ground to `top`. */
const post = (top, r = 0.07) => {
  const m = new THREE.Mesh(new THREE.CylinderGeometry(r, r * 1.3, top, 6), new THREE.MeshLambertMaterial({ color: 0x1b2836 }))
  m.position.y = top / 2
  return m
}

/** Edges of a mesh drawn as glowing lines. */
const edges = (mesh, opacity = 0.6) =>
  new THREE.LineSegments(new THREE.EdgesGeometry(mesh.geometry), new THREE.LineBasicMaterial({ color: glow(CYAN, 1.6), transparent: true, opacity }))

/**
 * @param chapter  one entry of chapters.js
 * @param index    its position on the trail
 * @param stop     { pos, eye, toEye, side } computed in main.js
 * @param loadTex  (url) => THREE.Texture
 */
export function buildStation(chapter, index, stop, loadTex, { lite }) {
  const { pos, eye } = stop
  const group = new THREE.Group()
  group.position.copy(pos)
  const toEye = new THREE.Vector3(eye.x - pos.x, 0, eye.z - pos.z).normalize() // towards the viewer
  const across = new THREE.Vector3().crossVectors(UP, toEye).normalize() // viewer's left → right axis
  const at = (forward, sideways, y) => new THREE.Vector3().addScaledVector(toEye, forward).addScaledVector(across, sideways).setY(y)
  const anim = [] // per-frame callbacks (time, dt)
  const bob = (obj, amp = 0.14, speed = 0.8) => {
    const y0 = obj.position.y
    const ph = index * 1.7
    anim.push((t) => (obj.position.y = y0 + Math.sin(t * speed + ph) * amp))
  }
  const onPath = chapter.kind === 'welcome' || chapter.kind === 'portal'
  const rand = seeded(100 + index)

  // sonar ring + pulses
  const ringR = onPath ? 4.4 : 3.4
  const ring = new THREE.Mesh(new THREE.RingGeometry(ringR - 0.12, ringR, 96), additive(glow(CYAN, 1.6), 0.7))
  ring.rotation.x = -Math.PI / 2
  ring.position.y = 0.04
  group.add(ring)
  ;[0, 0.5].forEach((ph) => {
    const p = new THREE.Mesh(new THREE.RingGeometry(0.97, 1, 96), additive(glow(CYAN, 1.4), 0))
    p.rotation.x = -Math.PI / 2
    p.position.y = 0.05
    group.add(p)
    anim.push((t) => {
      const s = (t * 0.32 + ph) % 1
      p.scale.setScalar(ringR * (0.25 + s * 1.6))
      p.material.opacity = (1 - s) * 0.55
    })
  })

  // light
  const warm = chapter.kind === 'camp'
  const light = new THREE.PointLight(warm ? 0xff9a4a : CYAN, warm ? 60 : 38, 24, 1.5)
  light.position.y = 3.2
  group.add(light)

  // waypoint label
  const { texture, aspect } = labelTexture(`${String(index + 1).padStart(2, '0')} · ${chapter.label.toUpperCase()}`)
  const label = new THREE.Sprite(new THREE.SpriteMaterial({ map: texture, transparent: true, depthWrite: false, fog: false }))
  label.scale.set(aspect * 0.62, 0.62, 1)
  label.position.y = onPath ? 9.2 : 7.4
  group.add(label)

  let focusY = 3.2
  const kind = {
    welcome() {
      const gate = new THREE.Group()
      const sign = new THREE.Mesh(new THREE.PlaneGeometry(12.8, 4.8), basic(0xffffff, { map: signTexture(chapter.sub), transparent: true }))
      sign.position.y = 5.6
      const l = post(8.2, 0.14)
      const r = post(8.2, 0.14)
      l.position.x = -6.9
      r.position.x = 6.9
      gate.add(sign, l, r)
      ;[-6.9, 6.9].forEach((x) => {
        const lamp = new THREE.Mesh(new THREE.SphereGeometry(0.28, 16, 12), basic(glow(CYAN, 2.6)))
        lamp.position.set(x, 8.45, 0)
        gate.add(lamp)
      })
      group.add(gate)
      face(gate, eye)
      label.visible = false
      focusY = 4.9
    },

    roots() {
      const tree = new THREE.Group()
      ;[
        [3.4, 5.0, 4.4],
        [2.6, 4.2, 6.8],
        [1.7, 3.4, 9.0],
      ].forEach(([r, h, y]) => {
        const cone = new THREE.Mesh(new THREE.ConeGeometry(r, h, 8), new THREE.MeshLambertMaterial({ color: 0x0c2a2e, flatShading: true }))
        cone.position.y = y
        const e = edges(cone, 0.75)
        e.position.copy(cone.position)
        tree.add(cone, e)
      })
      const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.4, 0.62, 3.2, 8), new THREE.MeshLambertMaterial({ color: 0x1d1611 }))
      trunk.position.y = 1.6
      tree.add(trunk)
      // glowing roots spreading over the ground
      const rootMat = new THREE.LineBasicMaterial({ color: glow(CYAN, 1.8), transparent: true, opacity: 0.7 })
      for (let i = 0; i < 9; i++) {
        const a = (i / 9) * Math.PI * 2 + rand() * 0.3
        const pts = [new THREE.Vector3(0, 0.05, 0)]
        for (let k = 1; k <= 4; k++) pts.push(new THREE.Vector3(Math.cos(a + k * 0.12) * k * 0.9, 0.05, Math.sin(a + k * 0.12) * k * 0.9))
        tree.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts), rootMat))
      }
      group.add(tree)
      const board = new THREE.Mesh(new THREE.PlaneGeometry(4.4, 1.72), basic(0xffffff, { map: boardTexture('Roots · Education', 'EWU · CSE · 2026'), transparent: true }))
      const bp = new THREE.Group().add(board, post(1.4))
      board.position.y = 2.25
      bp.position.copy(at(3.6, 1.2, 0))
      group.add(bp)
      face(bp, eye)
      focusY = 5.4
    },

    grove() {
      const disc = new THREE.Mesh(new THREE.CircleGeometry(3.3, 64), additive(glow(CYAN, 1.2), 0.75))
      disc.material.map = radarTexture()
      disc.rotation.x = -Math.PI / 2
      disc.position.y = 0.06
      const sweep = new THREE.Mesh(new THREE.CircleGeometry(3.3, 32, 0, Math.PI / 2.4), additive(glow(CYAN, 1.3), 0.28))
      sweep.rotation.x = -Math.PI / 2
      sweep.position.y = 0.07
      group.add(disc, sweep)
      anim.push((t) => (sweep.rotation.z = -t * 1.1))
      // sensor pillars
      ;['PM2.5', 'PM10', 'NO₂', 'O₃', 'CO', 'Temp', 'Hum.'].forEach((name, i) => {
        const a = (i / 7) * Math.PI * 2
        const h = 1.1 + rand() * 1.4
        const p = post(h, 0.05)
        const tip = new THREE.Mesh(new THREE.SphereGeometry(0.13, 12, 8), basic(glow(CYAN, 2.6)))
        tip.position.y = h + 0.1
        const lab = labelTexture(name, { size: 40 })
        const s = new THREE.Sprite(new THREE.SpriteMaterial({ map: lab.texture, transparent: true, depthWrite: false }))
        s.scale.set(lab.aspect * 0.3, 0.3, 1)
        s.position.y = h + 0.55
        const g = new THREE.Group().add(p, tip, s)
        g.position.set(Math.cos(a) * 4.0, 0, Math.sin(a) * 4.0)
        group.add(g)
      })
      // readings rising like particles
      const count = lite ? 90 : 170
      const pts = new Float32Array(count * 3)
      const speed = new Float32Array(count)
      for (let i = 0; i < count; i++) {
        const a = rand() * Math.PI * 2
        const r = Math.sqrt(rand()) * 2.9
        pts.set([Math.cos(a) * r, rand() * 7, Math.sin(a) * r], i * 3)
        speed[i] = 0.5 + rand() * 0.9
      }
      const geo = new THREE.BufferGeometry()
      geo.setAttribute('position', new THREE.BufferAttribute(pts, 3))
      const rise = new THREE.Points(
        geo,
        new THREE.PointsMaterial({ size: 0.16, map: dotTexture(), color: glow(CYAN, 2), transparent: true, depthWrite: false, blending: THREE.AdditiveBlending }),
      )
      group.add(rise)
      anim.push((t, dt) => {
        for (let i = 0; i < count; i++) {
          pts[i * 3 + 1] += speed[i] * dt
          if (pts[i * 3 + 1] > 7.5) pts[i * 3 + 1] = 0
        }
        geo.attributes.position.needsUpdate = true
      })
      const shot = frame(loadTex(chapter.image), 5.0, 3.125)
      shot.position.copy(at(-1.6, 0, 4.4))
      group.add(shot)
      face(shot, eye)
      bob(shot)
      focusY = 3.6
    },

    vectors() {
      const term = frame(terminalTexture(chapter.terminal, 'POST /api/query'), 5.0, 3.125)
      term.position.copy(at(0.6, -1.4, 3.6))
      group.add(term)
      face(term, eye)
      bob(term, 0.12)
      // an embedding cloud: nodes linked to their nearest neighbours
      const cloud = new THREE.Group()
      const nodes = []
      for (let i = 0; i < 46; i++) {
        const v = new THREE.Vector3(rand() - 0.5, rand() - 0.5, rand() - 0.5).normalize().multiplyScalar(0.6 + rand() * 1.9)
        nodes.push(v)
        const n = new THREE.Mesh(new THREE.SphereGeometry(0.07 + rand() * 0.07, 10, 8), basic(glow(i % 7 ? CYAN : 0xbfeaff, 2.4)))
        n.position.copy(v)
        cloud.add(n)
      }
      const seg = []
      nodes.forEach((a) => {
        nodes
          .map((b) => [b, a.distanceTo(b)])
          .filter(([, d]) => d > 0)
          .sort((x, y) => x[1] - y[1])
          .slice(0, 2)
          .forEach(([b]) => seg.push(a, b))
      })
      cloud.add(
        new THREE.LineSegments(
          new THREE.BufferGeometry().setFromPoints(seg),
          new THREE.LineBasicMaterial({ color: glow(CYAN, 1.5), transparent: true, opacity: 0.4 }),
        ),
      )
      cloud.position.copy(at(-1.6, 3.4, 4.6))
      group.add(cloud)
      anim.push((t) => (cloud.rotation.y = t * 0.25))
      focusY = 3.7
    },

    fields() {
      const shot = frame(loadTex(chapter.image), 5.0, 3.125)
      shot.position.copy(at(-0.6, 0, 3.9))
      group.add(shot)
      face(shot, eye)
      bob(shot, 0.12)
      // rows of young crops in front of the screen
      const n = lite ? 40 : 70
      const crop = new THREE.InstancedMesh(
        new THREE.ConeGeometry(0.16, 0.6, 5).translate(0, 0.3, 0),
        new THREE.MeshLambertMaterial({ color: 0x3f9a5a, flatShading: true }),
        n,
      )
      const m = new THREE.Matrix4()
      for (let i = 0; i < n; i++) {
        const row = i % 7
        const col = Math.floor(i / 7)
        const p = at(-2.6 + row * 0.62, -3.2 + col * 0.66, 0)
        const s = 0.7 + rand() * 0.7
        m.compose(p, new THREE.Quaternion(), new THREE.Vector3(s, s, s))
        crop.setMatrixAt(i, m)
      }
      group.add(crop)
      focusY = 3.2
    },

    workshop() {
      chapter.images.forEach((src, i) => {
        const f = frame(loadTex(src), 3.3, 2.06)
        const x = (i - 1) * 3.6 - 1.4
        f.position.copy(at(i === 1 ? -1.2 : 0, x, 3.2))
        group.add(f)
        face(f, eye)
        bob(f, 0.1, 0.7 + i * 0.15)
        const bulb = new THREE.Mesh(new THREE.SphereGeometry(0.16, 14, 10), basic(glow(0xffe2a8, 2.2)))
        bulb.position.copy(f.position).setY(5.0)
        const wire = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.012, 2.4, 4), basic(0x2a3a4a))
        wire.position.copy(bulb.position).setY(6.25)
        group.add(bulb, wire)
      })
      focusY = 3.2
    },

    camp() {
      const fire = new THREE.Group()
      const flames = [
        [0.55, 1.7, 0xff7a2e],
        [0.42, 1.3, 0xffb347],
        [0.3, 1.0, 0xffe08a],
      ].map(([r, h, c], i) => {
        const f = new THREE.Mesh(new THREE.ConeGeometry(r, h, 7).translate(0, h / 2, 0), additive(glow(c, 1.8), 0.85))
        f.position.set((i - 1) * 0.12, 0.25, 0)
        fire.add(f)
        return f
      })
      for (let i = 0; i < 3; i++) {
        const log = new THREE.Mesh(new THREE.CylinderGeometry(0.11, 0.11, 1.4, 6), new THREE.MeshLambertMaterial({ color: 0x3a2618 }))
        log.rotation.set(Math.PI / 2, 0, (i / 3) * Math.PI)
        log.position.y = 0.14
        fire.add(log)
      }
      for (let i = 0; i < 8; i++) {
        const a = (i / 8) * Math.PI * 2
        const st = new THREE.Mesh(new THREE.DodecahedronGeometry(0.22 + rand() * 0.1), new THREE.MeshLambertMaterial({ color: 0x3b4654, flatShading: true }))
        st.position.set(Math.cos(a) * 0.95, 0.12, Math.sin(a) * 0.95)
        fire.add(st)
      }
      group.add(fire)
      light.position.y = 1.6
      anim.push((t) => {
        flames.forEach((f, i) => f.scale.set(1, 0.85 + Math.sin(t * (9 + i * 3) + i) * 0.15, 1))
        light.intensity = 55 + Math.sin(t * 13) * 10 + Math.sin(t * 7.3) * 8
      })
      const tent = new THREE.Mesh(new THREE.ConeGeometry(2.0, 2.6, 4).translate(0, 1.3, 0), new THREE.MeshLambertMaterial({ color: 0x10202c, flatShading: true }))
      tent.position.copy(at(-2.4, -2.8, 0))
      tent.rotation.y = Math.PI / 4
      const tentEdges = edges(tent, 0.65)
      tentEdges.position.copy(tent.position)
      tentEdges.rotation.copy(tent.rotation)
      group.add(tent, tentEdges)
      const board = new THREE.Mesh(new THREE.PlaneGeometry(4.4, 1.72), basic(0xffffff, { map: boardTexture('Basecamp · Now', 'YSSE Internship'), transparent: true }))
      const bp = new THREE.Group().add(board, post(1.4))
      board.position.y = 2.25
      bp.position.copy(at(1.6, 3.2, 0))
      group.add(bp)
      face(bp, eye)
      focusY = 2.2
    },

    toolkit() {
      const core = new THREE.Mesh(new THREE.OctahedronGeometry(1.0), basic(glow(CYAN, 1.8), { wireframe: true }))
      const inner = new THREE.Mesh(new THREE.OctahedronGeometry(0.55), additive(glow(0xbfeaff, 1.8), 0.9))
      core.position.y = inner.position.y = 3.6
      group.add(core, inner)
      const hues = [0x3ee0ff, 0x4f8bff, 0x4ade80, 0xa78bfa, 0xffd36e, 0xff8fb1]
      const orbs = (chapter.groups || []).map((g, i) => {
        const o = new THREE.Group()
        o.add(new THREE.Mesh(new THREE.SphereGeometry(0.3, 18, 12), basic(glow(hues[i % hues.length], 2))))
        const lab = labelTexture(g.title, { size: 40 })
        const s = new THREE.Sprite(new THREE.SpriteMaterial({ map: lab.texture, transparent: true, depthWrite: false }))
        s.scale.set(lab.aspect * 0.34, 0.34, 1)
        s.position.y = 0.62
        o.add(s)
        group.add(o)
        return { o, r: 2.7 + (i % 2) * 0.7, y: 2.4 + (i % 3) * 1.05, ph: (i / chapter.groups.length) * Math.PI * 2 }
      })
      anim.push((t) => {
        core.rotation.y = t * 0.5
        inner.rotation.y = -t * 0.8
        orbs.forEach(({ o, r, y, ph }) => o.position.set(Math.cos(t * 0.22 + ph) * r, y + Math.sin(t + ph) * 0.15, Math.sin(t * 0.22 + ph) * r))
      })
      focusY = 3.6
    },

    gallery() {
      const photos = chapter.photos
      photos.forEach((p, i) => {
        const a = (i / (photos.length - 1) - 0.5) * Math.PI * 0.95
        const h = 2.1
        const w = h * (p.w / p.h)
        const f = frame(loadTex(p.thumb), w, h)
        const spot = at(-1.0 - Math.cos(a) * 4.6, Math.sin(a) * 6.2, 2.6)
        f.position.copy(spot)
        const stand = post(1.5, 0.05)
        stand.position.set(spot.x, 0.75, spot.z)
        const lamp = new THREE.Mesh(new THREE.SphereGeometry(0.12, 12, 8), basic(glow(0xffe2a8, 2.4)))
        lamp.position.set(spot.x, 4.0, spot.z)
        group.add(f, stand, lamp)
        face(f, eye)
        bob(lamp, 0.08, 1.2 + i * 0.1)
      })
      focusY = 2.6
    },

    portal() {
      const gate = new THREE.Group()
      const torus = new THREE.Mesh(new THREE.TorusGeometry(3.2, 0.13, 16, 140), basic(glow(CYAN, 2.4)))
      const torus2 = new THREE.Mesh(new THREE.TorusGeometry(3.55, 0.03, 8, 140), additive(glow(0xbfeaff, 1.6), 0.7))
      const fill = new THREE.Mesh(new THREE.CircleGeometry(3.1, 64), additive(0xffffff, 0.55))
      fill.material.map = glowTexture()
      ;[torus, torus2, fill].forEach((m) => (m.position.y = 3.6))
      gate.add(torus, torus2, fill)
      const sign = labelTexture("LET'S TALK", { size: 64 })
      const s = new THREE.Sprite(new THREE.SpriteMaterial({ map: sign.texture, transparent: true, depthWrite: false }))
      s.scale.set(sign.aspect * 0.9, 0.9, 1)
      s.position.y = 7.6
      gate.add(s)
      group.add(gate)
      face(gate, eye)
      anim.push((t) => {
        torus2.rotation.z = t * 0.4
        fill.rotation.z = -t * 0.2
        fill.material.opacity = 0.45 + Math.sin(t * 1.4) * 0.12
      })
      label.visible = false
      focusY = 3.8
    },
  }
  kind[chapter.kind]?.()

  const focus = new THREE.Vector3(pos.x, focusY, pos.z)
  return {
    group,
    focus,
    update(t, dt, camPos) {
      anim.forEach((fn) => fn(t, dt))
      label.getWorldPosition(tmp)
      const d = tmp.distanceTo(camPos)
      label.material.opacity = THREE.MathUtils.clamp((d - 11) / 7, 0, 1) * THREE.MathUtils.clamp(1 - (d - 30) / 50, 0, 1)
    },
  }
}
