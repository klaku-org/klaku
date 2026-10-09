<script lang="ts">
  import type { GameInfo } from '../core/game'
  import Home from './Home.svelte'
  import Menu from './Menu.svelte'
  import Play from './Play.svelte'
  import Settings from './Settings.svelte'
  import Splash from './Splash.svelte'

  let screen = $state<'splash' | 'home' | 'menu' | 'settings' | GameInfo>('splash')
</script>

{#if screen === 'splash'}
  <Splash ondone={() => (screen = 'home')} />
{:else if screen === 'home'}
  <Home onlaunch={(g) => (screen = g)} onmenu={() => (screen = 'menu')} />
{:else if screen === 'menu'}
  <Menu onresume={() => (screen = 'home')} onsettings={() => (screen = 'settings')} />
{:else if screen === 'settings'}
  <Settings ondone={() => (screen = 'home')} />
{:else}
  <Play game={screen} onexit={() => (screen = 'home')} />
{/if}
