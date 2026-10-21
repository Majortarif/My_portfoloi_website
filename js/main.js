import { renderAbout } from './components/about.js'
import { renderAchievements } from './components/achievements.js'
import { renderBuilds, renderMoreWork } from './components/builds.js'
import { initContactForm, initCopy } from './components/contact.js'
import { renderFeatured } from './components/featured.js'
import { renderGallery } from './components/gallery.js'
import { initActiveSection, initMobileMenu } from './components/nav.js'
import { renderSkills } from './components/skills.js'
import { renderEducation, renderExperience } from './components/timeline.js'
import { $$ } from './lib/dom.js'
import { initHeroField } from './motion/hero-field.js'
import { initCursor, initGlow, initMagnetic } from './motion/pointer.js'
import { initIntro, initReveal } from './motion/reveal.js'
import { initScroll } from './motion/scroll.js'
import { initScramble, initSplitText } from './motion/text.js'
import { initCycler, initPing, initRadar, initTilt, initTyper } from './motion/sonar.js'
import { initVisits } from './lib/visits.js'

const sections = {
  about: renderAbout,
  skills: renderSkills,
  featured: renderFeatured,
  builds: renderBuilds,
  'more-work': renderMoreWork,
  experience: renderExperience,
  education: renderEducation,
  achievements: renderAchievements,
  gallery: renderGallery,
}

// 1. Content
$$('[data-mount]').forEach((el) => sections[el.dataset.mount]?.(el))
$$('[data-year]').forEach((el) => (el.textContent = new Date().getFullYear()))

// 2. Behaviour
initMobileMenu()
initActiveSection()
initContactForm()
initCopy()
initVisits()

// 3. Motion (text is split before reveals are observed)
initSplitText()
initScramble()
initIntro()
initReveal()
initScroll()
initHeroField()
initCursor()
initMagnetic()
initGlow()
initPing()
initTyper()
initCycler()
initTilt()
initRadar()
