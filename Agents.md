# Agent Contract — zjseating

All AI agents working in this repo follow these rules. No exceptions.

## Project
- Site: https://zjseating.b2bsourcing.org
- Worker: `zjseating` (Cloudflare Workers, static assets)
- Source lives in `zj-seating-github-source/`
- Build: `npm run build` (Vite) → outputs `dist/`
- Deploy: automatic on merge to `main` via Workers Builds

## Hard rules
1. Never push directly to `main`. All work happens on a branch named `<agent>/<task>`,
   e.g. `kimi/redesign-product-page`.
2. Open a pull request. Do not merge your own PR.
3. Only the integrator agent (Claude) merges to `main`.
4. Never edit files outside your owned paths without asking.
5. Never modify `wrangler.toml`, `package.json`, or `vite.config.js` unless you are
   the integrator.
6. Never commit secrets, API tokens, or `.env` files.
7. Run `npm run build` locally before opening a PR. A PR that fails the build is rejected.

## Path ownership
| Agent   | Owns                                              |
|---------|---------------------------------------------------|
| Kimi    | `src/`, `assets/`, `*.html` (layout & design)     |
| ChatGPT | `content/`, `seo/`, page copy, meta tags          |
| Claude  | `wrangler.toml`, `package.json`, `vite.config.js`, build config, merges |
| Gemini  | `tests/`, `audits/` (reports only, no source edits) |

## Change workflow
1. `git checkout main && git pull`
2. `git checkout -b <agent>/<task>`
3. Make changes within your owned paths
4. `npm run build` — must pass
5. Commit with a clear message, push, open a PR
6. Wait for the preview URL in the PR comment; verify it renders
7. Integrator reviews and merges

## Reporting
If you cannot complete a task within your owned paths, stop and describe what
you need in the PR description. Do not expand scope silently.
