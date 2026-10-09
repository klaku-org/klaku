import Phaser from 'phaser'
import type { GameModule } from '../../core/game'
import { beep } from '../../core/audio'

// Top-down frog. Each press: turn and hop. A lilypad waits somewhere; landing
// on it celebrates and the lilypad moves somewhere new.

const GREEN = 0x22c55e
const PAD = 0xb4f0be
const PAD_RIM = 0x7fcf8f
const PETAL = 0xf472b6
const FLOWER_CENTRE = 0xfacc15
/** Share of hops that head for the lilypad; the rest go in a random direction. */
const AIM_CHANCE = 1 / 3

let game: Phaser.Game | undefined
let unsub: (() => void) | undefined

function drawFrog(scene: Phaser.Scene) {
  // Drawn facing up (-y); rotation + PI/2 points it along an angle.
  const leg = (x: number, y: number, w: number, h: number, r: number) =>
    scene.add.ellipse(x, y, w, h, GREEN).setRotation(r)
  return scene.add.container(0, 0, [
    leg(-34, 34, 26, 50, 0.5),
    leg(34, 34, 26, 50, -0.5),
    leg(-36, -14, 18, 36, -0.6),
    leg(36, -14, 18, 36, 0.6),
    scene.add.ellipse(0, 0, 80, 104, GREEN),
    scene.add.circle(-22, -42, 15, 0xffffff),
    scene.add.circle(22, -42, 15, 0xffffff),
    scene.add.circle(-22, -46, 7, 0x000000),
    scene.add.circle(22, -46, 7, 0x000000),
  ])
}

// Drawn at radius 100; notch faces +x, pink flower near the far edge.
function drawPad(scene: Phaser.Scene) {
  const notch = Phaser.Math.DegToRad(25)
  const g = scene.add.graphics()
  for (const [r, c] of [[100, PAD_RIM], [90, PAD]]) {
    g.fillStyle(c).slice(0, 0, r, notch, -notch, false).fillPath()
  }
  const [fx, fy] = [-55, 35]
  const petals = [0, 1, 2, 3, 4, 5].map((i) => {
    const a = (i / 6) * Math.PI * 2
    return scene.add.ellipse(fx + Math.cos(a) * 20, fy + Math.sin(a) * 20, 26, 46, PETAL).setRotation(a + Math.PI / 2)
  })
  return scene.add.container(0, 0, [g, ...petals, scene.add.circle(fx, fy, 13, FLOWER_CENTRE)])
}

const lilypad: GameModule = {
  start(container, ctx) {
    const still = ctx.settings.reducedMotion

    class Main extends Phaser.Scene {
      create() {
        const pad = drawPad(this).setVisible(false)
        const frog = drawFrog(this)
        let jumping = false
        let moved = false
        let padActive = false

        const size = () => Math.min(this.scale.width, this.scale.height)
        const margin = () => size() * 0.2
        const hop = () => size() * 0.3
        const padRadius = () => size() * 0.17
        const inBounds = (x: number, y: number) =>
          x > margin() && x < this.scale.width - margin() && y > margin() && y < this.scale.height - margin()

        const fit = () => {
          frog.setScale(size() / 350)
          pad.setScale(padRadius() / 100)
          const m = margin()
          // Stay centred until the first hop; after that just keep it on screen.
          if (!moved) frog.setPosition(this.scale.width / 2, this.scale.height / 2)
          for (const o of [frog, pad]) {
            o.x = Phaser.Math.Clamp(o.x, m, this.scale.width - m)
            o.y = Phaser.Math.Clamp(o.y, m, this.scale.height - m)
          }
        }

        // New lilypad somewhere on screen, not right under the frog.
        const spawnPad = () => {
          let x = 0
          let y = 0
          for (let i = 0; i < 30; i++) {
            x = Phaser.Math.Between(margin(), this.scale.width - margin())
            y = Phaser.Math.Between(margin(), this.scale.height - margin())
            if (Phaser.Math.Distance.Between(x, y, frog.x, frog.y) > hop() * 1.2) break
          }
          pad.setPosition(x, y).setRotation(Math.random() * Math.PI * 2).setVisible(true)
          padActive = true
          if (!still) {
            pad.setScale(0)
            this.tweens.add({ targets: pad, scale: padRadius() / 100, duration: 300, ease: 'Back.easeOut' })
          }
        }

        fit()
        spawnPad()
        this.scale.on('resize', fit)

        const pickTarget = () => {
          // Head for the lilypad: land on it if in reach, else a full hop towards it.
          if (Math.random() < AIM_CHANCE) {
            const a = Math.atan2(pad.y - frog.y, pad.x - frog.x)
            const d = Math.min(hop(), Phaser.Math.Distance.Between(frog.x, frog.y, pad.x, pad.y))
            return { x: frog.x + Math.cos(a) * d, y: frog.y + Math.sin(a) * d, a }
          }
          // Random direction that keeps the frog on screen; falls back to the centre.
          for (let i = 0; i < 20; i++) {
            const a = Math.random() * Math.PI * 2
            const x = frog.x + Math.cos(a) * hop()
            const y = frog.y + Math.sin(a) * hop()
            if (inBounds(x, y)) return { x, y, a }
          }
          const x = this.scale.width / 2
          const y = this.scale.height / 2
          return { x, y, a: Math.atan2(y - frog.y, x - frog.x) }
        }

        const celebrate = () => {
          padActive = false
          ;[523, 659, 784, 1047].forEach((f, i) => this.time.delayedCall(i * 110, () => beep(f, 160)))
          const respawn = () => this.time.delayedCall(still ? 600 : 0, spawnPad)
          if (still) {
            pad.setVisible(false)
            respawn()
          } else {
            this.tweens.add({ targets: pad, scale: 0, delay: 300, duration: 300, ease: 'Back.easeIn', onComplete: respawn })
          }
        }

        unsub = ctx.onPress(() => {
          if (jumping) return
          jumping = true
          moved = true
          const { x, y, a } = pickTarget()
          const turn = Phaser.Math.Angle.Wrap(a + Math.PI / 2 - frog.rotation)
          const scale = frog.scale

          beep(300, 80)
          this.time.delayedCall(90, () => beep(600, 120))

          this.tweens.chain({
            targets: frog,
            tweens: [
              { rotation: frog.rotation + turn, duration: 120 },
              { x, y, duration: 350, ease: 'Sine.easeInOut' },
            ],
            onComplete: () => {
              jumping = false
              const onPad = padActive && Phaser.Math.Distance.Between(frog.x, frog.y, pad.x, pad.y) < padRadius()
              if (onPad) celebrate()
            },
          })
          // Top-down "height": grow mid-hop, unless reduced motion is on.
          if (!still) {
            this.tweens.add({ targets: frog, scale: scale * 1.3, delay: 120, duration: 175, yoyo: true })
          }
        })
      }
    }

    game = new Phaser.Game({
      type: Phaser.AUTO,
      parent: container,
      backgroundColor: '#06152b', // dark navy pond
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

export default lilypad
