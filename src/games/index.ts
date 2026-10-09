import type { GameInfo } from '../core/game'
import placeholderIcon from './placeholder/icon.svg'
import lilypadIcon from './lilypad/icon.svg'

/** Only in `npm run dev`; left out of production builds. */
const devGames: GameInfo[] = [
  {
    id: 'placeholder',
    name: 'Placeholder',
    icon: placeholderIcon,
    color: '#facc15',
    load: () => import('./placeholder').then((m) => m.default),
  },
]

export const games: GameInfo[] = [
  {
    id: 'lilypad',
    name: 'Lilypad',
    icon: lilypadIcon,
    color: '#22c55e',
    load: () => import('./lilypad').then((m) => m.default),
  },
  ...(import.meta.env.DEV ? devGames : []),
]
