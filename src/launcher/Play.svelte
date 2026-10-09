<script lang="ts">
  import { onMount } from 'svelte'
  import type { GameInfo } from '../core/game'
  import { onHold, onPress, holdProgress } from '../core/input'
  import { getSettings } from '../core/settings'

  let { game, onexit }: { game: GameInfo; onexit: () => void } = $props()
  let container: HTMLElement

  onMount(() => {
    let stopped = false
    let mod: Awaited<ReturnType<GameInfo['load']>> | undefined
    game.load().then((m) => {
      if (stopped) return
      mod = m
      m.start(container, { onPress, settings: getSettings() })
    })
    const offHold = onHold(onexit)
    return () => {
      stopped = true
      offHold()
      mod?.stop()
    }
  })
</script>

<div class="game" bind:this={container}></div>

{#if $holdProgress > 0.1}
  <svg class="ring" viewBox="0 0 100 100">
    <circle cx="50" cy="50" r="40" pathLength="1" stroke-dasharray="1" stroke-dashoffset={1 - $holdProgress} />
  </svg>
{/if}

<style>
  .game { position: fixed; inset: 0; }
  .ring {
    position: fixed;
    top: 50%;
    left: 50%;
    width: 30vmin;
    translate: -50% -50%;
    rotate: -90deg;
    pointer-events: none;
  }
  circle { fill: none; stroke: #fff; stroke-width: 8; stroke-linecap: round; }
</style>
