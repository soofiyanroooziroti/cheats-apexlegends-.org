# cheats-apexlegends-.org

Static Astro site for Apex Legends cheats — forked from the Valorant template; blog and forum seeds cleared for rebranding.

**Maintainers:** soofiyanroooziroti, Cursor Agent

## Local dev

```bash
npm install
npm run dev
```

Copy `.env.example` to `.env` and set `GEMINI_API_KEY` only if you run `npm run translate`.

## Cloudflare deploy

This repo is a **static** Astro site (`dist/`). Use committed `wrangler.toml` — do **not** let Wrangler run `astro add cloudflare` (that breaks CI with a Workers compatibility-date mismatch).

- Build command: `npm run build:i18n-test` (or full `npm run build`)
- Deploy: `npx wrangler deploy` or Cloudflare **Workers/Pages** deploy command `npx wrangler deploy`
