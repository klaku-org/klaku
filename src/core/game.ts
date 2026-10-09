import type { Settings } from './settings'

export interface GameContext {
  /** Subscribe to switch presses; returns an unsubscribe function. */
  onPress(f: () => void): () => void
  settings: Settings
}

export interface GameModule {
  start(container: HTMLElement, ctx: GameContext): void
  stop(): void
}

export interface GameInfo {
  id: string
  name: string
  /** Flat, single-colour SVG; drawn black on the tile colour. */
  icon: string
  color: string
  /** Lazy so each game (and Phaser) loads only when played. */
  load(): Promise<GameModule>
}
