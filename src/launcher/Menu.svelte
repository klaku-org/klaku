<script lang="ts">
  import { onMount } from 'svelte'
  import { onPress } from '../core/input'

  let { onresume, onsettings }: { onresume: () => void; onsettings: () => void } = $props()

  // A child who opens this by accident gets straight back out with the switch.
  onMount(() => onPress(onresume))
</script>

<div class="menu">
  <h1>Klaku</h1>
  <button class="primary" onclick={onresume}>Resume</button>
  <button onclick={onsettings}>Settings</button>
</div>

<style>
  .menu {
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 4vmin;
  }
  h1 {
    margin: 0 0 4vmin;
    font-family: var(--display);
    font-size: 10vmin;
    color: var(--brand);
  }
  button {
    width: min(80vw, 420px);
    padding: 2.5vmin;
    font-family: var(--display);
    font-size: max(24px, 5vmin);
    font-weight: 700;
    color: var(--brand);
    background: #000;
    border: 1vmin solid var(--brand);
    border-radius: 2vmin;
    cursor: pointer;
  }
  button.primary { color: #000; background: var(--brand); }
</style>
