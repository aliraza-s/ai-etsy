# Lottie animations

Drop `.json` files here to upgrade the corresponding inline-SVG illustration
to a full Lottie animation. No code changes required — the
`<LottieOrFallback>` shim in `components/illustrations/lottie-or-fallback.tsx`
fetches each file on mount and swaps the SVG fallback for the Lottie render.

## Expected filenames

| Path                     | Used by                          | Fallback SVG                  |
| ------------------------ | -------------------------------- | ----------------------------- |
| `/lottie/hero.json`      | Landing-page hero illustration   | `<HeroIllustration>`          |
| `/lottie/step-paste.json`    | "How it works" — step 1 (paste)  | `<StepPaste>`                 |
| `/lottie/step-generate.json` | "How it works" — step 2 (AI)     | `<StepGenerate>`              |
| `/lottie/step-rank.json`     | "How it works" — step 3 (rank)   | `<StepRank>`                  |

Files at any other path are ignored. Files that don't parse as JSON silently
fall back to the SVG with no console noise (see the `catch` in
`lottie-or-fallback.tsx`).

## Sourcing animations

Free libraries:

- https://lottiefiles.com/
- https://icons8.com/animated-icons

Choose loops, not one-shots, since the shim leaves `loop=true` by default.

## Brand fit

The inline SVGs use OKLCH brand variables (`oklch(0.585 0.12 191)` for teal,
`oklch(0.77 0.16 70)` for amber). Lottie JSON colors are baked at export
time, so prefer animations exported with these brand colors. The `lottie-web`
runtime supports color overrides at runtime if you need to recolor a third-
party animation; wire that into `<LottieOrFallback>` as a `colorMap` prop if
you need it.
