# Oluwabunmi & Anuoluwapo

The website for the engagement ceremony of Oluwabunmi Adedayo and Anuoluwapo
Akintoye — Saturday, 5 December 2026, 12 noon, Luxury Party Event Centre,
M.K.O Abiola Gardens Road, Ikeja, Lagos.

> This is one of several sites in this repository, each in its own folder.
> See the [README at the root](../README.md) for the others.

## Running it

This project uses **pnpm**. If you do not have it: `npm install -g pnpm`.

```bash
pnpm install
pnpm dev             # http://localhost:3000
pnpm build           # production build
pnpm typecheck       # types only
pnpm start -p 3100   # serve the production build
pnpm images          # prepare the photographs (see below)
```

> **Two notes on this folder's name.**
>
> The `&` in `A&O` breaks the Windows command shims that **npm** and **npx** use —
> `npm run build` fails here with a confusing "not recognized as an internal or
> external command" error. **pnpm handles it correctly**, which is one practical
> reason to stay on pnpm in this folder. If you ever need to fall back to npm,
> call the tools through node directly instead:
>
> ```bash
> node ./node_modules/next/dist/bin/next build
> node ./node_modules/typescript/bin/tsc --noEmit
> ```
>
> Also note pnpm passes extra arguments straight through, so **do not use `--`**:
> write `pnpm start -p 3100`, not `pnpm start -- -p 3100` (the latter passes a
> literal `--` to Next and it exits with "Invalid project directory").

## Editing the content

**Everything the site says lives in [`data/wedding.ts`](data/wedding.ts).** Names,
date, venue, phone numbers, bank details, the story, the hotels, and the FAQ.
You should never need to open a component to change a word.

Anything still marked `TODO(couple)` needs real information:

| What | Where |
|---|---|
| The couple's portrait and photographs | `portrait`, `gallery` |
| Exact Google Maps pin for the hall | `venue.mapsUrl` |
| Confirm both WhatsApp numbers | `whatsapp`, `bank.contact` |
| Confirm the hotel list, and any reserved rooms | `hotels` |
| Google Apps Script URL for RSVP | `.env.local` — see [docs/APPS-SCRIPT.md](docs/APPS-SCRIPT.md) |

The site works today with all of these unset. The "bless the couple" sheet shows
a "details coming soon" notice with the RSVP numbers instead of broken
placeholders, and the RSVP form tells guests to call rather than pretending a
submission was saved.

> **RSVPs need their own sheet.** `RSVP_ENDPOINT` in `.env.local` (and on the
> host) must point at a Google Sheet made for this couple. If it still holds the
> previous site's URL, these guests land in the previous couple's sheet.

## The photographs

They have not arrived yet, and the site is built so that nobody can tell:

- **The hero arch** holds the card's flowers, opening one by one around the
  date on a deep plum ground ([components/ui/ArchBloom.tsx](components/ui/ArchBloom.tsx)).
  Set `portrait` in `data/wedding.ts` and the arch shows the photograph instead.
- **The gallery** is hidden while `gallery` is empty, and appears between the
  details and the hotels as soon as it has entries.

When they do arrive, drop the originals in [images/](images/), list them in
`TARGETS` in [scripts/prepare-images.cjs](scripts/prepare-images.cjs), and run
`pnpm images`. It trims any white matting, downscales to 1600px on the long
edge, and prints each file's final width and height — those numbers go into the
`gallery` entries.

> **If you re-run it and the site still shows the old picture:** Next caches
> optimised images by URL, and the filename has not changed. Delete
> `.next/cache/images` and restart.

## How it is put together

- **Next.js 16** (App Router) + TypeScript + Tailwind 4 + Framer Motion
- **No database, no payment processor, no accounts.** Blessing the couple is a
  bank transfer with one-tap copy. RSVPs go to a Google Sheet through
  `/api/rsvp`.
- **`app/opengraph-image.tsx`** draws the WhatsApp link preview at 1200×630. This
  link will be shared on WhatsApp far more than anywhere else, so the preview
  card is drawn properly rather than left to a chat client's cropping.

## The design

Onion pink and lilac, taken from the printed invitation card
([images/O&A Invitation Card.jpg](images/O%26A%20Invitation%20Card.jpg)) — a
pink-white ground, deep plum headings, orchid hairlines. The ambient motion is
drifting bokeh with watercolour "bloom" reveals, and the type is Gilda Display
for the names and headings, Italianno for a handful of script flourishes, and
Jost for everything functional. Gilda has no italic, so the few italic lines
borrow Cormorant Garamond's.

The colour tokens in `app/globals.css` keep the role names of the first build
(`blush`, `champagne`, `gold`, `wine`); the comment at the top of that file says
what each one is now.

## Deploying

Push to Vercel. It detects pnpm from `pnpm-lock.yaml` and from the
`packageManager` field in `package.json`, so no build-command override is needed
— **commit the lockfile.**

Set two environment variables:

- `RSVP_ENDPOINT` — the Apps Script web app URL for this couple's sheet
- `NEXT_PUBLIC_SITE_URL` — the final public URL, so link previews resolve

## Licences

The bundled Cormorant Garamond used by the link-preview image is under the SIL
Open Font License — see [assets/fonts/OFL.txt](assets/fonts/OFL.txt).
