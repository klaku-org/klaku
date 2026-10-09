<script lang="ts">
  import { onMount } from 'svelte'
  import type { GameInfo } from '../core/game'
  import { onPress } from '../core/input'
  import { settings } from '../core/settings'
  import { beep } from '../core/audio'
  import { games } from '../games'

  let { onlaunch, onmenu }: { onlaunch: (g: GameInfo) => void; onmenu: () => void } = $props()

  const visible = $derived(games.filter((g) => !$settings.hiddenGames.includes(g.id)))
  let index = $state(0)

  function step(by: number) {
    const n = visible.length
    if (n === 0) return
    index = (index + by + n) % n
    if ($settings.scanSounds) beep(300 + index * 80, 100)
  }

  // Auto-scan: re-arms on every move, so a manual step gets a full scan period.
  $effect(() => {
    index
    if (!$settings.autoScan) return
    const id = setTimeout(() => step(1), $settings.scanMs)
    return () => clearTimeout(id)
  })

  // Arrow keys step the highlight (staff, or a second switch mapped to an arrow).
  function onkeydown(e: KeyboardEvent) {
    const by = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 }[e.key]
    if (!by) return
    e.preventDefault()
    step(by)
  }

  onMount(() => onPress(() => visible[index] && onlaunch(visible[index])))

</script>

<svelte:window {onkeydown} />

<div class="home">
<!-- Opens the menu. Not focusable, so a switch sending Enter can never activate it. -->
<button class="title" tabindex="-1" onclick={onmenu}>Klaku</button>

<main>
  {#each visible as game, i (game.id)}
    <!-- svelte-ignore a11y_no_static_element_interactions -->
    <!-- Touch users can tap a tile directly: pointerdown selects it, then the global press launches it. -->
    <div
      class="tile"
      class:active={i === index}
      class:still={$settings.reducedMotion}
      style:--c={game.color}
      onpointerdown={() => (index = i)}
    >
      <img src={game.icon} alt="" draggable="false" />
    </div>
  {/each}
  {#if visible.length === 0}
    <p>No games enabled.</p>
  {/if}
</main>
</div>


<style>
  /* Bold flat, tuned for CVI: black background, flat saturated tiles, black icons,
     no gradients/shadows/glow. The active tile gets a thick brand-colour ring with a black
     gap, so it reads clearly whatever the tile colour. */
  .home { height: 100%; display: flex; flex-direction: column; }
  .title {
    margin: 0 auto;
    background: none;
    border: none;
    cursor: pointer;
    font-weight: 700;
    padding-top: 4vmin;
    text-align: center;
    font-family: var(--display);
    font-size: 10vmin;
    color: var(--brand);
  }
  main {
    flex: 1;
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: center;
    gap: 10vmin;
    padding: 8vmin;
  }
  .tile {
    width: 30vmin;
    height: 30vmin;
    border-radius: 2vmin;
    background: var(--c);
    display: grid;
    place-items: center;
    opacity: 0.35;
    transition: transform 0.15s, opacity 0.15s;
  }
  .tile.active {
    opacity: 1;
    outline: 2.5vmin solid var(--brand);
    outline-offset: 2vmin;
    transform: scale(1.1);
  }
  .tile.still { transition: none; }
  .tile.still.active { transform: none; }
  img { width: 75%; height: 75%; pointer-events: none; }
</style>
