# Plan: Local App Replica of Outreachr

Target: [github.com/lalalune/outreachr](https://github.com/lalalune/outreachr) — a free, Apache-2.0, **local-first Electron desktop app** described as a "fundraising operating system" for founders. This document is the implementation plan for building a working local replica of that app.

---

## 1. What we are replicating

Outreachr combines an evidence-backed investor database with a founder-controlled CRM, approval-bound email outreach, calendar/meeting coordination, and AI-agent assistance — all running locally with no hosted backend.

### Key product guarantees (these drive the architecture)

- All canonical user/product data lives in **one founder-owned SQLite vault** (`outreachr.sqlite` in the per-user app-data directory).
- Secrets (OAuth tokens) are encrypted with the **OS credential facility** (Keychain / DPAPI / libsecret), never plaintext in SQLite.
- Gmail/Google Calendar and Outlook/Microsoft Graph via **founder-created desktop OAuth (PKCE)** credentials — no shared app secrets.
- **Send-safety invariants enforced in SQLite itself** (triggers), before any provider I/O: no duplicate initial outreach to the same person, pause switch, daily/hourly hard limits, per-domain pacing/cooldowns, mandatory visible sender-address + opt-out footer, and layered suppressions (global/email/domain/person/firm).
- Append-only, **SHA-256 hash-chained audit log**.
- AI agents (Codex / Claude Agent SDK) are **proposal-only**: they read serialized context and propose actions; they never execute external actions themselves.

### Tech stack of the original

| Layer | Technology |
|---|---|
| Shell | Electron 43, `electron-vite`, `electron-builder` |
| UI | React 19 + TypeScript, `lucide-react`, Inter/IBM Plex Mono |
| Storage | **sql.js (WASM SQLite)** — no native compiler needed; atomic persist via temp-file + rename |
| Validation | Zod 4 |
| Mail/Calendar | Gmail API + Microsoft Graph, OAuth PKCE, provider-neutral adapter contracts |
| Agents | `@anthropic-ai/claude-agent-sdk`, `@openai/codex-sdk`, `@modelcontextprotocol/sdk` (local stdio MCP server, 19 typed tools) |
| Monorepo | pnpm workspaces (`apps/*`, `packages/*`), Node ≥ 22.12 |
| Tests | Vitest (unit/integration), MSW contract tests, Playwright Electron E2E, axe accessibility checks |
| Seed data | Pinned 2 MB investor-seed SQLite + rights manifest in `resources/` |

### Repository layout to mirror

```
apps/desktop         Electron main, sandboxed preload bridge, React renderer, Playwright E2E
packages/core        SQLite schema, migrations, repositories, safety invariants, audit chain
packages/connectors  Provider-neutral mail/calendar contracts + Google/Microsoft adapters
packages/agents      Codex + Claude adapters, fail-closed proposal-only policy
packages/mcp         Local stdio MCP server with typed read/proposal tools
resources            Investor seed DB + machine-readable rights manifest
docs                 Architecture, credentials, privacy, threat model, testing, release
```

---

## 2. Scope decision

Two viable readings of "local app replica" — the plan covers both, in order:

1. **Phase 0 — Run the original locally** (fast, hours): clone, install, and boot the upstream app to have a living reference implementation to compare against.
2. **Phases 1–8 — Build our own replica** (the real work): re-implement the app in this repository, milestone by milestone, keeping the original's architecture and guarantees but owning the code.

Recommended simplifications for the replica's first version (v0.1):

- **One mail provider first** (Gmail); Microsoft Graph in v0.2 behind the same adapter interface.
- **One agent vendor first** (Claude Agent SDK); Codex later.
- Ship the seed investor DB as-is (it is Apache-2.0 with a rights manifest) rather than rebuilding the dataset.
- Skip code signing / notarization; unsigned local packages only.

---

## 3. Phased implementation plan

### Phase 0 — Reference environment (½ day)
- Clone upstream, `corepack enable && corepack prepare pnpm@11.18.0 --activate`, `pnpm install`, `pnpm dev`.
- Run `pnpm verify` and `pnpm test:e2e` to confirm the reference is green.
- Walk every screen; capture screenshots as UI reference for the replica.

### Phase 1 — Monorepo scaffold (1 day)
- pnpm workspace with `apps/desktop` + `packages/{core,connectors,agents,mcp}`; shared TypeScript strict config, ESLint flat config, Prettier, Vitest.
- `apps/desktop`: electron-vite skeleton with **three entries** — `main`, `preload` (CommonJS, sandboxed), `renderer` (React).
- Security baseline from day one: `nodeIntegration: false`, `contextIsolation: true`, `sandbox: true`, frozen allowlisted `contextBridge` API, deny-by-default navigation/new-window/permissions.
- Root scripts mirroring upstream: `dev`, `build`, `verify` (format + lint + typecheck + test + build), `package`.

### Phase 2 — Core vault (`packages/core`) (1–2 weeks) ← the heart of the app
- sql.js runtime loader; vault open/persist cycle: load into memory → export → write mode-0600 temp file → atomic rename. Bounded reads (512 MiB vault cap, 256 MiB seed-import cap).
- Migration runner (foreign keys + migrations on every open) and versioned schema:
  - people, firms, evidence/provenance, round pipeline, targets/ranking, notes;
  - `email_sends` state machine: `draft → approved → reserved → dispatching → sent | ambiguous`;
  - suppressions (global/email/domain/person/firm), pacing counters, pause flag;
  - `mail_events` (header-only relationship observations), calendar events;
  - `audit_log` + `audit_chain` (SHA-256 chained, append-only via UPDATE/DELETE-blocking triggers).
- **SQLite triggers** that independently enforce: footer/postal-address presence at approval, approval bound to content hash (any footer/policy change revokes approvals), unique send reservation per normalized email *and* per canonical person, limits/pacing/suppression checks at reservation time.
- Repository layer (Zod-validated) + seed import + encrypted backup/restore with integrity check before replacing the vault.
- Unit tests proving each invariant fails closed (attempt the forbidden write; assert the trigger rejects it).

### Phase 3 — Desktop shell + product UI (1–2 weeks)
- Preload bridge: typed request/response channels only (no generic `invoke` passthrough); renderer never touches Node or the DB directly.
- React screens, in priority order: round setup → investor search/target ranking (with evidence/provenance display) → pipeline board → person/firm detail → outreach composer with **explicit approval review** → settings (storage/privacy/pause switch/limits).
- Design language per upstream PRODUCT.md: dense, calm, inspectable; WCAG 2.2 AA; keyboard-complete; no color-only status.

### Phase 4 — Connectors (`packages/connectors`) (1 week for Gmail)
- Provider-neutral interfaces for mailbox + calendar; OAuth 2.0 PKCE loopback flow for desktop; token ciphertext stored in SQLite, key in OS keychain (`safeStorage` in Electron main).
- Gmail adapter: send (claims the reservation by moving it to `dispatching` *before* network I/O; definitive provider/thread IDs mark `sent`; ambiguity is terminal — no auto-retry), header-only relationship sync with exhaustive-then-incremental pagination and resumable cursors, bounce/complaint/unsubscribe detection feeding suppressions.
- Embed a unique **operation key** in each send so only an authoritative sent-mail observation can later confirm an `ambiguous`/`dispatching` send as `sent`.
- MSW contract tests — no production credentials in any test.

### Phase 5 — Calendar (3–4 days)
- Google Calendar sync keyed `provider:event-id`, idempotent and bounded; provider fields refresh while private notes survive; attendees projected to name/email only (canonical person IDs never leave the vault).

### Phase 6 — Agents + MCP (`packages/agents`, `packages/mcp`) (1 week)
- Local stdio MCP server exposing typed **read + proposal** tools over the vault with record-level redaction.
- Claude Agent SDK adapter: serialized context records in, proposals out; scrubbed child-process environment (small allowlist only); fail-closed policy — external actions are simply not in the capability set; every run and proposal audited.

### Phase 7 — Test + verification gate (continuous, hardened at the end)
- `pnpm verify` = format:check + lint (max-warnings 0) + typecheck + unit/integration tests + build.
- Playwright Electron E2E for the golden path: create round → rank targets → draft → approve → (mock-provider) send → pipeline update. Axe accessibility assertions on each screen.
- Dedicated adversarial tests for every safety trigger (double-send, suppression bypass, limit overflow, footer tamper, audit-chain tamper).

### Phase 8 — Packaging (2–3 days)
- electron-builder for mac/win/linux, x64 + arm64, unsigned with SHA-256 manifests; `prepare:resources` script bundling the seed + sql.js WASM.

---

## 4. Milestone acceptance criteria

| Milestone | Done when |
|---|---|
| M0 | Upstream app runs locally; `pnpm verify` green on reference |
| M1 | Empty Electron+React app boots via `pnpm dev`; security settings verified by test |
| M2 | Vault opens/migrates/persists atomically; all safety triggers have failing-closed tests |
| M3 | Founder can browse seeded investors, rank targets, and manage a pipeline entirely offline |
| M4 | Approved email sends through Gmail once and only once; ambiguity never auto-retries |
| M5 | Calendar events sync idempotently with private notes preserved |
| M6 | Agent produces cited proposals via MCP; cannot perform any external action |
| M7 | `pnpm verify` + E2E green in CI; adversarial suite passes |
| M8 | Unsigned installables produced for all three OSes |

## 5. Risks and mitigations

- **sql.js persistence races / data loss** → single-writer discipline in the main process, atomic rename, backup-before-migrate, integrity check on restore.
- **Send-state-machine correctness is the whole product** → build it in Phase 2 as pure SQLite + tests, before any UI or provider code exists.
- **OAuth desktop-credential friction** (each founder creates their own Google Cloud/Azure app) → replicate upstream's `docs/credentials.md` walkthrough early; mock providers keep development unblocked.
- **Scope creep** (two providers × two agent vendors × three OSes) → v0.1 ships Gmail + Claude + current OS only; the adapter contracts keep the door open.
- **Seed-data licensing** → carry upstream's rights manifest verbatim; the seed is part of the Apache-2.0 repo.

## 6. Estimated timeline

Roughly **6–8 weeks** for one engineer to M7 (usable replica: offline CRM + safe Gmail sending + agent proposals), with M8 packaging in the final week. Phases 4–6 can overlap once Phase 2's vault contracts are frozen.
