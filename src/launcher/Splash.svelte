<script lang="ts">
  import { onMount } from 'svelte'

  let { ondone }: { ondone: () => void } = $props()

  // Presses are ignored while this shows, so an early press can't launch a game.
  // Fallback in case animations are disabled and animationend never fires.
  onMount(() => {
    const id = setTimeout(ondone, 3000)
    return () => clearTimeout(id)
  })
</script>

<div class="splash" onanimationend={ondone}>Klaku</div>

<style>
  .splash {
    height: 100%;
    display: grid;
    place-items: center;
    color: var(--brand);
    font-size: 22vmin;
    font-family: var(--display);
    font-weight: 700;
    letter-spacing: -0.02em;
    animation: splash 2.2s ease-in-out both;
  }
  /* fade in 0.5s, hold 1.2s, fade out 0.5s */
  @keyframes splash {
    0% { opacity: 0; }
    23% { opacity: 1; }
    77% { opacity: 1; }
    100% { opacity: 0; }
  }
</style>
