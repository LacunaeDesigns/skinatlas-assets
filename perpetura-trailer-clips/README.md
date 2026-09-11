# Perpetūra trailer source clips — BACKUP, NOT A SERVING SURFACE

These are the raw Kling image-to-video clips the story and book trailers are cut
from. **Nothing here is served to anyone.** The finished cuts live in
`../perpetura-reels/` and those are the files Buffer posts resolve.

## Why they are here

They cannot be regenerated. Kling's result URLs expire 24 hours after generation,
the source files are gitignored in `lacunae-perpetura` (large binaries), and a
re-run of the same prompt returns **different motion**, not the approved take. So
until 2026-09-11 roughly **575 credits** of accepted footage existed on exactly one
laptop, one disk failure from gone.

| Folder | Clips | Credits | Cut from them |
|---|---|---|---|
| `reine/` | 6 | 150 | `reine-trailer.mp4`, `reine-teaser.mp4` |
| `hyunjae/` | 10 | 300 | `hyunjae-trailer.mp4`, and the Book One cuts derived from it |
| `book-two/` | 5 | 125 | `book-two-trailer.mp4`, `book-two-teaser.mp4` |

`reine/02-lucien-v1-stiff.mp4` is a **rejected** take, kept deliberately: the author
called it stiff, and it is the evidence for the prompt lesson recorded in
`lacunae-perpetura/marketing/trailers/reine/MANIFEST.md` — guard anatomy by
describing it, never by immobilising an expressive limb.

## Rules

- **Do not delete these to reclaim space.** Every byte here costs real credits to
  replace, and the replacement would not match what already shipped.
- **Do not point a Buffer post or any public link at this folder.** Use
  `../perpetura-reels/`. These are unlabelled raw shots with no captions, no music
  and no end card.
- The recipe for reassembling each trailer lives beside its clips in the main repo,
  in that trailer folder's `MANIFEST.md` and `render-trailer.py`.

## What is still NOT backed up anywhere

The Hyunjae trailer's `scrim.png` (its caption gradient) and `endcard-bg2.png` (a
Playwright capture of a title screen since redesigned) were never committed and are
gone. That is why re-rendering that trailer is a reconstruction rather than a re-run
— see its `captions.json` `shippedDeviation` block.
