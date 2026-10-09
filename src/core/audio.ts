import { getSettings } from './settings'

let ctx: AudioContext | undefined

/** Short synthesized tone; enough until games ship real sound files. */
export function beep(freq: number, ms = 150) {
  const vol = getSettings().volume
  if (vol <= 0) return
  ctx ??= new AudioContext()
  if (ctx.state === 'suspended') ctx.resume()
  const osc = ctx.createOscillator()
  const gain = ctx.createGain()
  osc.frequency.value = freq
  gain.gain.setValueAtTime(vol * 0.3, ctx.currentTime)
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + ms / 1000)
  osc.connect(gain).connect(ctx.destination)
  osc.start()
  osc.stop(ctx.currentTime + ms / 1000)
}
