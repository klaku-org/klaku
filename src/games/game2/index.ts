import Phaser from 'phaser'
import type { GameModule } from '../../core/game'

// Empty for now.

let game: Phaser.Game | undefined

const game2: GameModule = {
  start(container) {
    game = new Phaser.Game({
      type: Phaser.AUTO,
      parent: container,
      backgroundColor: '#000000',
      scale: { mode: Phaser.Scale.RESIZE },
      scene: class extends Phaser.Scene {},
    })
  },

  stop() {
    game?.destroy(true)
    game = undefined
  },
}

export default game2
