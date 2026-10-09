import Phaser from 'phaser'
import type { GameModule } from '../../core/game'
import { beep } from '../../core/audio'

// Stand-in Phaser game: each press pops a circle. Proves the plumbing only.

let game: Phaser.Game | undefined
let unsub: (() => void) | undefined

const placeholder: GameModule = {
  start(container, ctx) {
    class Main extends Phaser.Scene {
      create() {
        const { width, height } = this.scale
        const circle = this.add.circle(width / 2, height / 2, 120, 0xfacc15)
        unsub = ctx.onPress(() => {
          beep(440 + Math.random() * 440)
          circle.setFillStyle(Phaser.Display.Color.RandomRGB(100, 255).color)
          if (!ctx.settings.reducedMotion) {
            this.tweens.add({ targets: circle, scale: 1.4, duration: 120, yoyo: true })
          }
        })
      }
    }

    game = new Phaser.Game({
      type: Phaser.AUTO,
      parent: container,
      backgroundColor: '#000000',
      scale: { mode: Phaser.Scale.RESIZE },
      scene: Main,
    })
  },

  stop() {
    unsub?.()
    game?.destroy(true)
    game = undefined
  },
}

export default placeholder
