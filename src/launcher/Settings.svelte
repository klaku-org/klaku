<script lang="ts">
  import { settings } from '../core/settings'
  import { games } from '../games'

  let { ondone }: { ondone: () => void } = $props()

  function toggleGame(id: string, shown: boolean) {
    $settings.hiddenGames = shown
      ? $settings.hiddenGames.filter((g) => g !== id)
      : [...$settings.hiddenGames, id]
  }
</script>

<div class="settings">
  <h1>Staff settings</h1>

  <label class="check"><input type="checkbox" bind:checked={$settings.autoScan} /> Auto-scan</label>
  <label>Scan speed: {($settings.scanMs / 1000).toFixed(1)}s
    <input type="range" min="1000" max="8000" step="250" bind:value={$settings.scanMs} disabled={!$settings.autoScan} />
  </label>
  <label>Ignore repeat presses within: {$settings.debounceMs}ms
    <input type="range" min="0" max="2000" step="50" bind:value={$settings.debounceMs} />
  </label>
  <label>Hold to exit a game: {($settings.holdExitMs / 1000).toFixed(1)}s
    <input type="range" min="2000" max="15000" step="500" bind:value={$settings.holdExitMs} />
  </label>
  <label>Volume: {Math.round($settings.volume * 100)}%
    <input type="range" min="0" max="1" step="0.05" bind:value={$settings.volume} />
  </label>
  <label class="check"><input type="checkbox" bind:checked={$settings.scanSounds} /> Sounds while scanning</label>
  <label class="check"><input type="checkbox" bind:checked={$settings.reducedMotion} /> Reduced motion</label>

  <h2>Games</h2>
  {#each games as g (g.id)}
    <label class="check">
      <input
        type="checkbox"
        checked={!$settings.hiddenGames.includes(g.id)}
        onchange={(e) => toggleGame(g.id, e.currentTarget.checked)}
      />
      {g.name}
    </label>
  {/each}

  <button onclick={ondone}>Done</button>
  <p class="version">Version {__APP_VERSION__}</p>
</div>

<style>
  .settings {
    height: 100%;
    overflow-y: auto;
    max-width: 640px;
    margin: 0 auto;
    padding: 24px 16px;
    font-size: 1.2rem;
    touch-action: pan-y;
    user-select: text;
  }
  h1, h2 { font-family: var(--display); }
  label { display: block; margin: 16px 0; }
  input[type='range'] { display: block; width: 100%; }
  .check input { width: 24px; height: 24px; vertical-align: middle; }
  button { font-size: 1.4rem; padding: 12px 32px; margin-top: 24px; }
  .version { opacity: 0.5; font-size: 0.9rem; }
</style>
