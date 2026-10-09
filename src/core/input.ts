import { writable } from 'svelte/store'
import { getSettings } from './settings'

// Space, Enter, click or touch is "the button". Switches present as keyboards and
// usually send Space or Enter. Other keys (arrows etc.) are left for games and menus.
const PRESS_KEYS = new Set(['Space', 'Enter', 'NumpadEnter'])

type Listener = () => void
const pressListeners = new Set<Listener>()
const holdListeners = new Set<Listener>()

/** 0..1 while the switch is held; drives the exit ring. */
export const holdProgress = writable(0)

let down = false
let downAt = 0
let lastPress = 0
let holdFired = false
let raf = 0

function start() {
  if (down) return
  down = true
  downAt = performance.now()
  holdFired = false

  if (downAt - lastPress >= getSettings().debounceMs) {
    lastPress = downAt
    pressListeners.forEach((f) => f())
  }
  tick()
}

function end() {
  down = false
  cancelAnimationFrame(raf)
  holdProgress.set(0)
}

function tick() {
  if (!down || holdListeners.size === 0) return holdProgress.set(0)
  const p = Math.min(1, (performance.now() - downAt) / getSettings().holdExitMs)
  holdProgress.set(p)
  if (p >= 1 && !holdFired) {
    holdFired = true
    holdListeners.forEach((f) => f())
    return end()
  }
  raf = requestAnimationFrame(tick)
}

window.addEventListener('keydown', (e) => {
  if (e.repeat || !PRESS_KEYS.has(e.code) || isFormField(e.target)) return
  e.preventDefault()
  start()
})
window.addEventListener('keyup', (e) => PRESS_KEYS.has(e.code) && end())
window.addEventListener('pointerdown', (e) => {
  if (isFormField(e.target)) return
  start()
})
window.addEventListener('pointerup', end)
window.addEventListener('pointercancel', end)
window.addEventListener('blur', end)
window.addEventListener('contextmenu', (e) => e.preventDefault())

function isFormField(t: EventTarget | null) {
  return t instanceof Element && !!t.closest('input, button, select, label, .no-press')
}

export function onPress(f: Listener) {
  pressListeners.add(f)
  return () => pressListeners.delete(f)
}

export function onHold(f: Listener) {
  holdListeners.add(f)
  return () => holdListeners.delete(f)
}
