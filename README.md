# Living CV

A personal, data-driven resume site built with Svelte 5 + TypeScript + Vite.

## What It Includes

- Public resume page powered by JSON content files
- Theme toggle (light/dark) with persistence
- Theme-aware branding/favicons
- Acronym tooltips from a glossary JSON file
- GitHub Pages deployment workflow (Bun)

## Edit Content

Update these files to keep the CV current:

- `src/data/profile.json`
- `src/data/experience.json`
- `src/data/projects.json`
- `src/data/skills.json`
- `src/data/education.json`
- `src/data/acronyms.json`

Rendering and formatting logic:

- `src/lib/PublicResume.svelte`
- `src/lib/resumeTypes.ts`

## Local Development

Install dependencies:

```bash
bun install
```

Start dev server:

```bash
bun run dev
```

Build for production:

```bash
bun run build
```

Preview production build:

```bash
bun run preview
```

Type and Svelte checks:

```bash
bun run check
```

## Deployment (GitHub Pages)

Deployment is automated via:

- `.github/workflows/deploy-pages.yml`

On every push to `main`, the workflow:

1. Installs dependencies with Bun
2. Builds the site with repo base path support (`BASE_PATH`)
3. Publishes `dist` to GitHub Pages

Vite base path is controlled in:

- `vite.config.ts`

## Notes

- The displayed "Last updated" value is injected at build time from the latest commit date.
- If no commits exist yet, it falls back to `No commits yet`.
