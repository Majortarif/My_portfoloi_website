// Shared media-query state, so every motion module makes the same decision.

const reduceQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
const fineQuery = window.matchMedia('(hover: hover) and (pointer: fine)')

export const prefersReducedMotion = () => reduceQuery.matches
export const hasFinePointer = () => fineQuery.matches

/** Run `fn` whenever reduced-motion preference changes. */
export const onMotionPreferenceChange = (fn) => reduceQuery.addEventListener('change', fn)

export const clamp = (v, min, max) => Math.min(max, Math.max(min, v))
export const lerp = (a, b, t) => a + (b - a) * t
