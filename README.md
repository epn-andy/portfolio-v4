# portfolio-v4

Personal portfolio & engineering blog for [nayreisme.dev](https://nayreisme.dev) — built with **EmDash CMS** (Cloudflare's WordPress successor) on **Astro 7**, with Medium-style reading typography.

## Stack

- **Astro 7** (server output, Node standalone adapter)
- **EmDash 1.2** — CMS with admin UI at `/_emdash/admin`, MCP server, REST API
- **SQLite** for content storage (`.db` file), local disk for media
- **Nginx** reverse proxy → Node server on `127.0.0.1:4321`
- **GitHub Actions** builds and deploys to the VPS over SSH

## Structure

```
seed/seed.json          # Content model + initial content (posts, projects, experience, pages)
src/pages/              # Astro routes
  index.astro           # Homepage: hero, timeline, projects, latest articles
  posts/index.astro     # Article listing
  posts/[slug].astro    # Medium-style article reader
  work/index.astro      # Project listing
  work/[slug].astro     # Project case study
  about.astro           # Bio, experience, CV download
  category/[slug].astro # Category archives
  tag/[slug].astro      # Tag archives
  rss.xml.ts            # RSS feed
src/layouts/Base.astro  # Shell: nav, footer, theme toggle, reading progress
src/styles/             # tokens.css, theme.css, medium.css
public/cv.pdf           # Downloadable CV
.github/workflows/      # Build + deploy workflow
```

## Development

```bash
npm install
npm run dev        # http://localhost:4321
```

The admin panel is at `http://localhost:4321/_emdash/admin` — first visit runs the setup wizard (passkey or password).

## Deployment

Push to `main`. GitHub Actions builds on a 16GB runner and rsyncs `dist/`, `node_modules/` (production only), `seed/`, and metadata to `/var/www/portfolio` on the VPS, then restarts `portfolio-emdash.service` and reloads Nginx.

Required repo secrets: `VPS_HOST`, `VPS_USER`, `VPS_SSH_KEY`.

The `EMDASH_ENCRYPTION_KEY` lives in `/var/www/portfolio/.env` on the server (never committed).

## Content editing

Everything is editable through the admin UI or the CLI:

```bash
npx emdash content list posts
npx emdash content create posts --data '{"title": "Hello", "content": "..."}'
```

The site also exposes an MCP server for agent-driven content management.
