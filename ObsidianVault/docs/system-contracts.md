# System Contracts — Vault Reference

This document is the compact reference for how this vault operates. It allows Claude to work inside the vault without reopening the installer repository.

---

## Final vault contract summary

The vault is complete when all of the following exist:

- `CLAUDE.md` — vault agent instructions
- `Home.md` — central hub note (type: hub)
- `00_START_HERE.md` — onboarding and usage guide
- `docs/skills-catalog.md` — available skills
- `docs/system-contracts.md` — this file
- `.claude/vault-profile.md` — profile source of truth
- `.claude/commands/second-brain-capture.md`
- `.claude/commands/link-finder.md`
- `.claude/commands/vault-synthesis.md`
- `.claude/commands/next-steps-ai.md`
- `.claude/commands/explore-skills.md`
- All profile folders from `[STRUCTURE]`

---

## Command behavior rules

| Command | Reads profile first | Proposes before acting | Uses obsidian-vault MCP | Uses filesystem tools |
|---|:---:|:---:|:---:|:---:|
| `/second-brain-capture` | yes | yes | yes (create note) | yes (.claude/, docs/) |
| `/link-finder` | yes | yes | yes (read/patch notes) | no |
| `/vault-synthesis` | yes | no (generates report) | yes (read notes, create report) | yes (fallback folder) |
| `/next-steps-ai` | yes | yes (before creating tasks) | yes (read notes) | no |
| `/explore-skills` | yes | yes (shows spec first) | no | yes (create command files) |

---

## Frontmatter minimum fields

Every note must have at minimum:

```yaml
type: [type]
profile: researcher
created: YYYY-MM-DD
tags: [tag1, tag2]
```

Optional fields when known:

```yaml
project: [project name]
source: [URL or citation]
status: pending | active | blocked | completed | archived
priority: low | medium | high
confidence: low | medium | high
```

Decision notes also use:

```yaml
decision_status: pending | decided | reversed
outcome: pending | good | mixed | bad
review_date: YYYY-MM-DD
```

---

## Language behavior

- Profile language: **English**
- All folder names: English
- All note headings: English
- Note content: English

---

## Recovery behavior

If a required file is missing:
1. Recreate it if enough information is available.
2. Never delete existing user notes.
3. Never overwrite user-modified files without explicit confirmation.
4. If repair is not possible, report exactly what is missing.

If `.claude/vault-profile.md` is missing:
- All commands stop and ask the user to restore it or re-run `/vault-install`.

---

## Safety rules

- Never delete notes without explicit user confirmation.
- Never create notes without proposing first (except `/vault-synthesis` reports).
- Never request passwords, API keys, seed phrases, or credentials.
- Never invent project, client, author, or source names.
- Ignore `.claude/` and `docs/` when scanning for user content.
- Use `[[wikilinks]]` for all internal references — never markdown links for vault notes.

---

## Zettelkasten link rules

- Every permanent note (`02_Permanent/`) must link to at least 2 other notes.
- Literature notes must link to their author or source note.
- Inbox notes are temporary — always process and route them.
- Daily notes should reference active projects and recent insights.
- Orphan notes are flagged by `/link-finder` with a confidence score.
