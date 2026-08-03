# Handover: Local App Replica of Outreachr

Audience: the next agent (or engineer) picking up this work. Read this first, then the plan.

## Task

Build a local replica of [lalalune/outreachr](https://github.com/lalalune/outreachr) — a local-first Electron desktop "fundraising OS". The full implementation plan is in [`docs/plans/local-app-replica-plan.md`](./local-app-replica-plan.md) in this repo. **The plan is the source of truth**; this file only tells you where things stand and how to continue.

## Current state (as of 2026-08-03)

- **Repo**: `ajgonzal/based-zeroxwork`
- **Working branch**: `claude/local-app-replica-plan-mcxjbc` (pushed; do all work here unless told otherwise)
- **Done**: research of the upstream repo + the plan document (commit `da476fb`). No PR has been opened.
- **Not started**: every implementation phase (0–8). No replica code exists yet.
- Note: this repo also contains an unrelated pre-existing project (`frontend/`, `backend/` — a React/Vite + backend app called "zeroxwork"). Do not touch it; the replica work lives alongside it (or ask the owner whether the replica should live in a subdirectory like `outreachr-replica/` or replace the repo contents — this is an open question, see below).

## How to get context fast

1. Read `docs/plans/local-app-replica-plan.md` (sections 1–3 are the core).
2. Clone the upstream reference: `git clone --depth 1 https://github.com/lalalune/outreachr`
   Key files there: `README.md`, `PRODUCT.md`, `docs/architecture.md`, root `package.json`, `apps/desktop/package.json`, `pnpm-workspace.yaml`.
3. Upstream stack in one line: pnpm monorepo, Electron 43 + electron-vite + React 19 + TS, sql.js (WASM SQLite) vault with safety-enforcing triggers, Gmail/Microsoft OAuth-PKCE connectors, proposal-only Claude/Codex agents via a local stdio MCP server.

## Immediate next steps (in order)

1. **Phase 0**: clone upstream, `corepack enable && corepack prepare pnpm@11.18.0 --activate && pnpm install && pnpm dev` (needs Node ≥ 22.12). Confirm `pnpm verify` is green; capture screen references.
2. **Phase 1**: scaffold the pnpm workspace (`apps/desktop`, `packages/{core,connectors,agents,mcp}`) with the Electron security baseline (contextIsolation, sandbox, allowlisted preload bridge) per plan §3.
3. **Phase 2**: the SQLite vault + email-send state machine with failing-closed trigger tests — this is the highest-risk, highest-value piece; do it before any UI.

## Open questions for the user (don't block on these; ask when they're online)

- Where should the replica live: subdirectory of this repo, repo root, or a new repo?
- v0.1 scope confirmation: Gmail-only + Claude-only (as the plan recommends), or full parity with both providers/agents?
- Should a PR be opened for the plan branch, or keep committing to it directly?

## Working conventions in this session

- Commit to `claude/local-app-replica-plan-mcxjbc`, push with `git push -u origin <branch>`.
- Do NOT create a PR unless the user explicitly asks.
- GitHub operations go through the GitHub MCP tools (no `gh` CLI in this environment).
