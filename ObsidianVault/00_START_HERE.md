---
type: onboarding
profile: researcher
created: 2026-05-05
tags: [onboarding, guide, start]
---

# Welcome to Your Second Brain

This vault is configured for a **Researcher / Writer** workflow in **English**.

---

## Your profile: Researcher / Writer

You capture sources, build permanent notes, and develop original thinking through a Zettelkasten-style approach.

---

## Folder structure

| Folder | Purpose |
|---|---|
| `00_Inbox/` | Raw captures awaiting processing |
| `01_Literature/` | Notes from books, papers, articles, and podcasts |
| `02_Permanent/` | Refined concepts, arguments, questions, contradictions |
| `03_Projects/` | Active writing projects with outlines and drafts |
| `04_References/` | Authors and sources |
| `05_Daily/` | Daily notes and reflections |

---

## The Zettelkasten principle

Every permanent note in `02_Permanent/` must link to **at least 2 other notes**. Isolated notes are orphans — use `/link-finder` to connect them.

---

## Your five core skills

### `/second-brain-capture`
Captures any input (insight, source, idea, reflection) and routes it to the right folder as a structured, linked note. Always asks for confirmation before creating.

### `/link-finder`
Scans your vault for orphan or weakly connected notes. Scores candidate connections and proposes wikilinks for you to approve.

### `/vault-synthesis`
Generates a synthesis report covering patterns, insights, decisions, and recommendations from a selected time period or scope.

### `/next-steps-ai`
Analyzes your vault and suggests 3–5 prioritized next actions ranked by impact.

### `/explore-skills`
Browses and builds optional skill modules from `docs/skills-catalog.md` directly into your `.claude/commands/` folder.

---

## How to capture your first note

1. Open this vault in Claude Code:
   ```bash
   claude "/home/user/based-zeroxwork/ObsidianVault"
   ```
2. Type: `/second-brain-capture`
3. Share what you want to capture.
4. Claude will classify, route, and propose a structured note.
5. Confirm, and the note is created in the right folder.

---

## MCP connection

This vault uses the `obsidian-vault` MCP server to read and write notes.

To add it, run once from the terminal:
```bash
claude mcp add obsidian-vault -- npx -y @bitbonsai/mcpvault@latest "/home/user/based-zeroxwork/ObsidianVault"
```

Then restart Claude Code and verify with `claude mcp list`.

---

## Processing the Inbox

1. Open any note in `00_Inbox/`.
2. Run `/second-brain-capture` and describe the note.
3. Claude will classify and move it to the correct folder.
4. Delete the original inbox note once moved.
