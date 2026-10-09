import type { GameInfo } from '../core/game'
import placeholderIcon from './placeholder/icon.svg'
import game2Icon from './game2/icon.svg'

export const games: GameInfo[] = [
  {
    id: 'placeholder',
    name: 'Placeholder',
    icon: placeholderIcon,
    color: '#facc15',
    load: () => import('./placeholder').then((m) => m.default),
  },
  {
    id: 'game2',
    name: 'Game 2',
    icon: game2Icon,
    color: '#3b82f6',
    load: () => import('./game2').then((m) => m.default),
  },
]
