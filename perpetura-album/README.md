# Perpetūra Original Soundtracks — source masters, BACKUP

The eight WAVs the album was built from. **Nothing here is served to anyone.**
Streaming lives on Spotify, Apple and the rest via DistroKid; the public link is
`perpetura.lacunaedesigns.com/listen`.

## Why they are here

They lived in exactly one place. `marketing/album/` and `marketing/album-matched/`
are both gitignored in `lacunae-perpetura` (`.gitignore:90-91`) because they are
524 MB between them, so until 2026-09-22 the only copies of the album's sources
were on one laptop, plus a second copy in that laptop's Downloads folder — the
same disk.

That is the failure that had already happened once to the Kling trailer plates,
which were gone by the time anyone looked for them. See
`../perpetura-trailer-clips/README.md`.

DistroKid holds what was delivered, so the **release** is not at risk. The
sources are a different matter: a store does not give masters back, and if the
Suno downloads have expired these are unrecoverable in the way a re-run returns
different music rather than the same track.

## What is and is not here

- **Here:** the eight source WAVs, as downloaded, before loudness matching.
- **Not here:** `marketing/album-matched/` — the −14.0 LUFS copies. Those are
  derivable: `python marketing/album-loudness.py` regenerates them from these.
  Backing up a derivative alongside its source buys nothing.

## Rules

- **Do not delete these to reclaim space.** They are the album's negatives.
- **Do not point a public link here.** Send people to `/listen`. These are
  lossless masters, which is not what a listener wants or what the stores carry.
- The track-to-story mapping, the credits and the filed lyrics are in
  `lacunae-perpetura/docs/distrokid-ost-submission.md`.

## Also consumed by

`marketing/loop/` — the long-form ambient video opens each story segment on that
story's vocal, read from `marketing/album-matched/`. If a fresh clone ever needs
to rebuild that video, it starts here and runs `album-loudness.py` first.
