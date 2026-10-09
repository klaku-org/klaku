# Contributing to Klaku

## Setup

Requires Nix with flakes, or Node 22.

```sh
nix develop      # or: direnv allow
npm install
npm run dev      # dev server
npm run check    # typecheck
npm run build    # production build in dist/
npm run preview  # serve the production build
```

Built with Svelte (launcher), Phaser (games), Vite and vite-plugin-pwa.

## Layout

```
src/
  core/       input, settings, audio, game interface (no framework)
  launcher/   Svelte screens: splash, home, menu, settings, play
  games/      one folder per game, plus the registry in index.ts
```

## Input

- Space, Enter, a tap or a click is "the button". Most accessibility switches
  send Space or Enter.
- Holding the button for 5 seconds (configurable) exits a game. This is
  handled by the launcher.
- All other keys, including arrows, are free for games to use. On the home
  screen, arrows move the highlight.

## Adding a game

1. Create `src/games/<name>/index.ts` exporting a `GameModule`
   (`start(container, ctx)` and `stop()`).
2. Add a flat, single-colour `icon.svg`. It is drawn in black on the game's
   tile colour.
3. Add an entry to `src/games/index.ts` with an id, name, icon, tile colour
   and lazy `load()`.

`stop()` must clean up everything `start()` created (call `game.destroy(true)`
for Phaser).

### Game checklist

- [ ] Uses `ctx.onPress` for the button, not its own key or pointer listeners.
- [ ] One main target on a plain black background.
- [ ] Flat, saturated colours; no gradients, glow or busy patterns.
- [ ] Respects `ctx.settings.reducedMotion` and `ctx.settings.volume`.
- [ ] No flashing.
- [ ] Every press gets clear feedback (sound and visual).
- [ ] No failure states, timers that punish, or text the child must read.
- [ ] Works offline: assets are bundled, nothing is fetched at runtime.

## Privacy

Klaku collects nothing. Don't add accounts, analytics, tracking or network
calls that send data about children.

## Commits

Commit messages follow [Conventional Commits](https://www.conventionalcommits.org/)
and are checked by a commit hook, e.g. `feat: add drum game` or
`fix(input): ignore key repeat`.

## License

By contributing, you agree that your contributions are licensed under
[AGPL-3.0-or-later](LICENSE).
