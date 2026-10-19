// The trail's chapters, built from the same data files as the classic site,
// so both stay in sync. `kind` picks the 3D landmark (see stations.js).

import { gallery } from '../data/achievements.js'
import { education } from '../data/education.js'
import { experience } from '../data/experience.js'
import { about, profile } from '../data/profile.js'
import { builds, featured } from '../data/projects.js'
import { skillGroups } from '../data/skills.js'

const build = Object.fromEntries(builds.map((b) => [b.id, b]))
const links = (p) => p.links.map(({ label, href }) => ({ label, href }))
const uni = education[0]
const ysse = experience[0]

export const chapters = [
  {
    id: 'trailhead',
    label: 'Trailhead',
    kind: 'welcome',
    kicker: 'Welcome to the Signal Forest',
    title: profile.name,
    sub: profile.role,
    text: 'A night walk through how I think: the data I start from, the models and systems I build, and the people and places along the way.',
    links: [
      { label: 'Download CV', href: profile.cv, download: true },
      { label: 'Classic site', href: 'index.html' },
    ],
  },
  {
    id: 'roots',
    label: 'Roots',
    kind: 'roots',
    kicker: 'Education',
    title: uni.degree,
    sub: `${uni.institution} · ${uni.place}`,
    text: about.story[0],
    points: education.map((e) => `${e.institution}: ${e.result.label} ${e.result.value} / ${e.result.scale}`),
  },
  {
    id: 'air-quality',
    label: 'Air Quality Grove',
    kind: 'grove',
    kicker: 'Featured research · CSE400C capstone',
    title: featured.shortTitle,
    text: featured.lede,
    points: [
      '62,188 IoT sensor readings from Badda and Aftabnagar, Dhaka',
      '7 features → US EPA AQI; Random Forest compared with LightGBM, KNN and SVM',
      'Time-ordered hold-out: R² 0.9933, RMSE 3.41',
      'The trained forest runs live in the browser as JSON',
    ],
    links: links(featured),
    image: featured.image.src,
  },
  {
    id: 'docusense',
    label: 'DocuSense Tower',
    kind: 'vectors',
    kicker: build.docusense.kicker,
    title: build.docusense.title,
    text: build.docusense.summary,
    points: build.docusense.features.slice(0, 3),
    links: links(build.docusense),
    terminal: build.docusense.terminal,
  },
  {
    id: 'agricycle',
    label: 'AgriCycle Fields',
    kind: 'fields',
    kicker: build.agricycle.kicker,
    title: build.agricycle.title,
    text: build.agricycle.summary,
    points: build.agricycle.features.slice(0, 3),
    links: links(build.agricycle),
    image: build.agricycle.image.src,
  },
  {
    id: 'workshop',
    label: 'The Workshop',
    kind: 'workshop',
    kicker: 'Product prototypes · 2026',
    title: 'CareerPilot AI · EcoBin 2.0 · Pulse',
    text: 'Three browser products I designed and shipped end to end, each with honest, clearly labelled rule-based logic.',
    items: ['careerpilot', 'ecobin', 'pulse'].map((id) => ({
      title: build[id].title,
      text: build[id].summary,
      links: links(build[id]),
    })),
    images: ['careerpilot', 'ecobin', 'pulse'].map((id) => build[id].image.src),
  },
  {
    id: 'basecamp',
    label: 'Basecamp',
    kind: 'camp',
    kicker: `${ysse.type} · ${ysse.period}`,
    title: ysse.title,
    sub: ysse.org,
    text: ysse.summary,
    points: ysse.points.slice(0, 3),
  },
  {
    id: 'toolkit',
    label: 'Toolkit',
    kind: 'toolkit',
    kicker: 'Skills',
    title: 'What I work with',
    text: 'Every orb is a skill family. On the classic site each skill links to the project that proves it.',
    groups: skillGroups.map((g) => ({ title: g.title, skills: g.skills.slice(0, 5).map((s) => s.name) })),
  },
  {
    id: 'memories',
    label: 'Clearing of Memories',
    kind: 'gallery',
    kicker: 'Gallery',
    title: 'Moments beyond the screen',
    text: `Thesis defense day, workshops, club events, runs and football: ${gallery.length} captioned photos in the full gallery.`,
    photos: gallery.slice(0, 8),
    links: [{ label: 'Open the full gallery', href: 'index.html#gallery' }],
  },
  {
    id: 'trail-end',
    label: "Trail's End",
    kind: 'portal',
    kicker: 'Contact',
    title: "Let's build something",
    text: "I'm open to AI/ML roles, data projects and research collaborations. Email is the quickest way to reach me.",
    email: profile.email,
    links: [
      { label: 'LinkedIn', href: profile.links.linkedin },
      { label: 'GitHub', href: profile.links.github },
      { label: 'Download CV', href: profile.cv, download: true },
      { label: 'Classic site', href: 'index.html' },
    ],
  },
]
