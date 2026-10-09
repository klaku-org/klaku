import { writable, get } from 'svelte/store'

export interface Settings {
  scanMs: number       // time each tile stays highlighted
  debounceMs: number   // ignore presses closer together than this
  holdExitMs: number   // hold the switch this long to leave a game
  volume: number       // 0..1
  scanSounds: boolean  // play a sound as the highlight moves
  reducedMotion: boolean
  hiddenGames: string[]
}

const defaults: Settings = {
  scanMs: 2500,
  debounceMs: 300,
  holdExitMs: 5000,
  volume: 0.8,
  scanSounds: true,
  reducedMotion: false,
  hiddenGames: [],
}

const KEY = 'klaku.settings'

function load(): Settings {
  try {
    return { ...defaults, ...JSON.parse(localStorage.getItem(KEY) ?? '{}') }
  } catch {
    return defaults
  }
}

export const settings = writable<Settings>(load())

settings.subscribe((s) => {
  try { localStorage.setItem(KEY, JSON.stringify(s)) } catch {}
})

export const getSettings = () => get(settings)
