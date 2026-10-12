# Exedria landing page

React + Vite + Tailwind v4, with two live Remotion compositions (`@remotion/player`).

## Run it

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # static output in dist/
```

## Deploy on Vercel

1. In Vercel, **Add New → Project** and import this GitHub repository.
2. Vercel reads `vercel.json` (Vite, `npm ci`, `npm run build`, output `dist/`); no settings to change.
3. Every push to `main` deploys to production; other branches get preview URLs.

Node 20 or newer is required (`engines` in `package.json`).

## Pages

| Route | File | What it is |
| --- | --- | --- |
| `/` | `src/pages/Home.tsx` | Hero, featured work, services, lab, process, call to action |
| `/lucrari` | `src/pages/Portfolio.tsx` | Portfolio grid with hover-scrub cards; empty "slot" cards link to /contact |
| `/lucrari/:slug` | `src/pages/CaseStudy.tsx` | One project: facts, short write-up, player |
| `/contact` | `src/pages/ContactPage.tsx` | Brief form + direct email |
| `/termeni`, `/confidentialitate` | `src/pages/Terms.tsx`, `src/pages/Privacy.tsx` | Legal pages (Romanian) |

Routing is `react-router`; `vercel.json` rewrites every non-`/api` path to `index.html`.

To add a project, copy the Marina Park entry in `src/data/projects.ts`, put its media in `public/media/`, and drop one entry from `OPEN_SLOTS`.

## What's on the home page

| Section | Inspired by (screen recording) | Exedria version |
| --- | --- | --- |
| Hero | Purple dot-matrix wave behind "Software in motion." | Dot-matrix ribbon rendered as a Remotion composition (`src/compositions/HeroField.tsx`), scrubbable ruler with keyframes, timecode, title-safe guides |
| Work | Halftone case-study images that reveal on hover | Real Marina Park ad (`Exedria/Ad-example.mp4`) in a custom 9:16 player: hover-scrub thumbnails, clickable scene track, text + audio tracks, `<Sequence>` snippet per scene |
| Services | 2x2 grid with animated dot illustrations, mono tags | 2x2 grid with hover micro-renders: video scrub tied to cursor X, wireframe fill, booking grid, deploy log |
| Lab | (new) | Spring physics lab: damping / mass / stiffness faders, 16:9 · 9:16 · 1:1, 24/30/60 fps, editable business + offer text, all driving a Remotion composition (`src/compositions/SpringCard.tsx`) |
| Process | 4 steps with a progress line | NLE-style track view, scroll-linked playhead, clickable clips with deliverables |
| Contact | Contact form | Brief form (services, timeline, message) with a render-progress submit, sent through `api/contact.ts` + Resend |
| Footer | Giant dot-matrix "onda" reacting to cursor | Dot-matrix "exedria" wordmark reacting to cursor; scroll timecode HUD |

RO is the default language; the RO/EN toggle sits in the nav (`src/i18n.tsx` holds all copy).

## Placeholders to confirm

- The legal pages are templates: have them reviewed before launch,. Update the privacy policy before adding analytics or cookies.

- Contact email `hello@exedria.tech` (`src/components/Contact.tsx`).
- Process claims: fixed-price proposals, week ranges, preview link per iteration (`src/i18n.tsx`).
- Marina Park copy describes it as Exedria work; scene timings were read off the video.
- The contact form posts to `api/contact.ts` (Vercel Function), which emails the brief to hello@exedria.tech via Resend. Needs `RESEND_API_KEY` in Vercel and a verified exedria.tech sender (see `.env.example`). `npm run dev` does not serve `/api`; use `vercel dev` to test it locally.

## Media

`public/media/` holds a re-encoded copy of the ad (5.4 MB, faststart), a poster frame and a 40-frame thumbnail strip used for hover-scrubbing. Regenerate with:

```bash
ffmpeg -i Ad-example.mp4 -c:v libx264 -crf 27 -preset slow -g 30 -c:a aac -b:a 96k -movflags +faststart public/media/marina-park.mp4
ffmpeg -i Ad-example.mp4 -vf "fps=1,scale=180:320,tile=40x1" -frames:v 1 -q:v 5 public/media/marina-park-strip.jpg
```

Remotion requires a company license for teams above 3 people: https://remotion.dev/license
