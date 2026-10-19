import * as THREE from 'three'
import { canvasTexture, dotTexture } from './textures.js'

// The forest itself: ground, the glowing trail, instanced trees, fireflies,
// stars and the moon. Layout is seeded, so every visit plants the same forest.

export const CYAN = 0x3ee0ff

/** Deterministic random numbers (mulberry32). */
export function seeded(seed) {
  let a = seed
  return () => {
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

/** A colour pushed above 1 so the bloom pass picks it up. */
export const glow = (hex, k = 2.2) => new THREE.Color(hex).multiplyScalar(k)

/** The winding trail the camera walks along. */
export function makeTrail() {
  const points = []
  for (let i = 0; i <= 12; i++) points.push(new THREE.Vector3(Math.sin(i * 0.85) * 11, 0, 24 - i * 32))
  return new THREE.CatmullRomCurve3(points, false, 'catmullrom', 0.5)
}

/** Unit vector pointing to the trail's left at arc-length position u. */
export function sidewaysAt(curve, u) {
  const t = curve.getTangentAt(u)
  return new THREE.Vector3(-t.z, 0, t.x).normalize()
}

/** A flat strip that follows the trail. */
function ribbon(samples, width, color, opacity, y) {
  const pos = []
  const index = []
  samples.forEach((p, i) => {
    const a = samples[Math.max(0, i - 1)]
    const b = samples[Math.min(samples.length - 1, i + 1)]
    const side = new THREE.Vector3(-(b.z - a.z), 0, b.x - a.x).normalize().multiplyScalar(width / 2)
    pos.push(p.x + side.x, y, p.z + side.z, p.x - side.x, y, p.z - side.z)
    if (i < samples.length - 1) {
      const k = i * 2
      index.push(k, k + 1, k + 2, k + 1, k + 3, k + 2)
    }
  })
  const geo = new THREE.BufferGeometry()
  geo.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3))
  geo.setIndex(index)
  geo.computeVertexNormals()
  return new THREE.Mesh(
    geo,
    new THREE.MeshBasicMaterial({ color, transparent: true, opacity, depthWrite: false, side: THREE.DoubleSide }),
  )
}

/** Low-poly pine: trunk + three cone tiers, each an InstancedMesh sharing transforms. */
function forest(scene, transforms, colors) {
  const parts = [
    { geo: new THREE.CylinderGeometry(0.2, 0.32, 2.6, 6).translate(0, 1.3, 0), color: 0x1b1510, tint: false },
    { geo: new THREE.ConeGeometry(2.2, 3.6, 7).translate(0, 3.3, 0), tint: true },
    { geo: new THREE.ConeGeometry(1.7, 3.0, 7).translate(0, 5.0, 0), tint: true },
    { geo: new THREE.ConeGeometry(1.1, 2.4, 7).translate(0, 6.5, 0), tint: true },
  ]
  parts.forEach(({ geo, color, tint }) => {
    const mat = new THREE.MeshLambertMaterial({ color: tint ? 0xffffff : color, flatShading: true })
    const mesh = new THREE.InstancedMesh(geo, mat, transforms.length)
    transforms.forEach((m, i) => {
      mesh.setMatrixAt(i, m)
      if (tint) mesh.setColorAt(i, colors[i])
    })
    mesh.instanceMatrix.needsUpdate = true
    scene.add(mesh)
  })
}

/**
 * Build everything except the chapter landmarks.
 * `clearings` are positions that must stay free of trees.
 */
export function buildWorld(scene, curve, clearings, { lite }) {
  const rand = seeded(2026)
  const samples = curve.getSpacedPoints(420)
  const box = new THREE.Box3().setFromPoints(samples)
  const dot = dotTexture()

  // ground
  const ground = new THREE.Mesh(new THREE.PlaneGeometry(900, 1100), new THREE.MeshLambertMaterial({ color: 0x06101a }))
  ground.rotation.x = -Math.PI / 2
  ground.position.set(0, 0, (box.min.z + box.max.z) / 2)
  scene.add(ground)

  // trail: dark path, a faint centre line and breadcrumb lights along both edges
  scene.add(ribbon(samples, 3.0, 0x0b1d2b, 0.95, 0.012))
  scene.add(ribbon(samples, 0.07, glow(CYAN, 1.2), 0.5, 0.02))
  const length = curve.getLength()
  const crumbs = Math.floor(length / 1.9)
  const crumbMesh = new THREE.InstancedMesh(
    new THREE.SphereGeometry(0.05, 8, 6),
    new THREE.MeshBasicMaterial({ color: glow(0x6ff0ff, 1.25) }),
    crumbs * 2,
  )
  const m = new THREE.Matrix4()
  for (let i = 0; i < crumbs; i++) {
    const u = i / crumbs
    const p = curve.getPointAt(u)
    const s = sidewaysAt(curve, u)
    ;[1, -1].forEach((side, k) => {
      m.makeTranslation(p.x + s.x * 1.7 * side, 0.08, p.z + s.z * 1.7 * side)
      crumbMesh.setMatrixAt(i * 2 + k, m)
    })
  }
  scene.add(crumbMesh)

  // trees, kept off the trail and out of the clearings
  const near = samples.filter((_, i) => i % 3 === 0)
  const transforms = []
  const colors = []
  const want = lite ? 650 : 1400
  let guard = 0
  while (transforms.length < want && guard++ < want * 12) {
    const x = (rand() - 0.5) * 170
    const z = box.min.z - 60 + rand() * (box.max.z - box.min.z + 100)
    const dPath = Math.min(...near.map((p) => Math.hypot(p.x - x, p.z - z)))
    if (dPath < 5) continue
    if (clearings.some((c) => Math.hypot(c.x - x, c.z - z) < 9)) continue
    const s = 0.75 + rand() * 0.95
    const mat = new THREE.Matrix4().compose(
      new THREE.Vector3(x, 0, z),
      new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), rand() * Math.PI * 2),
      new THREE.Vector3(s, s * (0.9 + rand() * 0.4), s),
    )
    transforms.push(mat)
    colors.push(new THREE.Color().setHSL(0.45 + rand() * 0.08, 0.35 + rand() * 0.2, 0.08 + rand() * 0.09))
  }
  forest(scene, transforms, colors)

  // fireflies
  const flyCount = lite ? 220 : 460
  const base = new Float32Array(flyCount * 3)
  const phase = new Float32Array(flyCount)
  for (let i = 0; i < flyCount; i++) {
    const u = rand()
    const p = curve.getPointAt(u)
    const s = sidewaysAt(curve, u)
    const off = (2 + rand() * 22) * (rand() < 0.5 ? -1 : 1)
    base.set([p.x + s.x * off, 0.5 + rand() * 5, p.z + s.z * off], i * 3)
    phase[i] = rand() * Math.PI * 2
  }
  const flyGeo = new THREE.BufferGeometry()
  flyGeo.setAttribute('position', new THREE.BufferAttribute(base.slice(), 3))
  const flies = new THREE.Points(
    flyGeo,
    new THREE.PointsMaterial({
      size: 0.34,
      map: dot,
      color: glow(0xd8ff9a, 1.8),
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    }),
  )
  scene.add(flies)

  // stars on a dome
  const starCount = 1600
  const stars = new Float32Array(starCount * 3)
  for (let i = 0; i < starCount; i++) {
    const th = rand() * Math.PI * 2
    const ph = Math.acos(0.15 + rand() * 0.85)
    const r = 520
    stars.set([Math.cos(th) * Math.sin(ph) * r, Math.cos(ph) * r, box.min.z / 2 + Math.sin(th) * Math.sin(ph) * r], i * 3)
  }
  const starGeo = new THREE.BufferGeometry()
  starGeo.setAttribute('position', new THREE.BufferAttribute(stars, 3))
  scene.add(
    new THREE.Points(
      starGeo,
      new THREE.PointsMaterial({ size: 1.6, sizeAttenuation: false, map: dot, color: 0xbfd8ff, transparent: true, depthWrite: false, fog: false }),
    ),
  )

  // the moon, with a halo
  const moonTex = canvasTexture(256, 256, (ctx) => {
    const g = ctx.createRadialGradient(128, 128, 0, 128, 128, 128)
    g.addColorStop(0, 'rgba(240,248,255,1)')
    g.addColorStop(0.42, 'rgba(214,236,255,1)')
    g.addColorStop(0.47, 'rgba(160,220,255,0.35)')
    g.addColorStop(1, 'rgba(62,224,255,0)')
    ctx.fillStyle = g
    ctx.fillRect(0, 0, 256, 256)
  })
  const moon = new THREE.Sprite(new THREE.SpriteMaterial({ map: moonTex, fog: false, depthWrite: false, transparent: true }))
  moon.scale.setScalar(70)
  moon.position.set(-120, 120, box.min.z - 160)
  scene.add(moon)

  const pos = flyGeo.attributes.position
  return {
    update(time) {
      for (let i = 0; i < flyCount; i++) {
        const ph = phase[i]
        pos.array[i * 3] = base[i * 3] + Math.sin(time * 0.45 + ph) * 0.7
        pos.array[i * 3 + 1] = base[i * 3 + 1] + Math.sin(time * 0.9 + ph * 1.7) * 0.45
        pos.array[i * 3 + 2] = base[i * 3 + 2] + Math.cos(time * 0.4 + ph) * 0.7
      }
      pos.needsUpdate = true
      flies.material.opacity = 0.75 + Math.sin(time * 2.1) * 0.15
    },
  }
}
