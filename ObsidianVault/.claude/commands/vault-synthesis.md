# /vault-synthesis

Generate a profile-aware synthesis report from the vault.

This command must follow the global command contract:

- read `.claude/vault-profile.md` first,
- respect the user's selected language,
- use the `obsidian-vault` MCP for Obsidian notes,
- use profile structure instead of hardcoded folders.

---

## STEP 1 — Read vault profile

Read `.claude/vault-profile.md`. Extract: `[PROFILE]`, `[LANG]`, `[VAULT_PATH]`, `[STRUCTURE]`, `[ROUTING_RULES]`, `[LINK_RULES]`.

If missing, stop and say: "I do not see a vault profile yet. Run /vault-install first."

---

## STEP 2 — Determine synthesis scope

If the user specified a period, use it. Otherwise ask:

```
What period should I synthesize?
A) Last 7 days
B) Last 30 days
C) This month
D) Custom period
```

Default: last 30 days.

---

## STEP 3 — Collect notes via obsidian-vault MCP

Collect notes in scope. Ignore `.claude/` and `docs/`. For each note extract: title, path, type, created, status, tags, wikilinks, key content.

---

## STEP 4 — Analyze

Analyze: recurring themes, key insights, decisions and outcomes, active vs. stalled areas, blockers, orphan notes, knowledge gaps, repeated references without a dedicated note.

For researcher profile: focus on permanent notes, literature coverage, argument development, open questions, unresolved contradictions, and project progress.

---

## STEP 5 — Choose report destination

For researcher profile:
- Default: `02_Permanent/` or `03_Projects/[project]/` if project-scoped
- Fallback: `Reports/` (create if needed)

Report file name: `[YYYY-MM-DD]-synthesis-[scope-slug].md`

---

## STEP 6 — Create synthesis report via obsidian-vault MCP

Frontmatter:
```yaml
type: synthesis
profile: researcher
created: [YYYY-MM-DD]
period: [period]
scope: [scope]
tags: [synthesis, review]
```

Report structure:
```markdown
# Synthesis — [Period / Scope]

## Patterns detected
- [Pattern]: [description] — found in [N] notes

## Key insights
- [Insight extracted from notes]

## Argument development
- [Argument]: [status — developing / complete / stalled]

## Open questions
- [[question-note]] — why it remains open

## Knowledge gaps
- [Gap] — why it matters

## Weak links or orphan notes
- [[note]] — suggested next link/action

## Recommendations
1. [Actionable recommendation]
```

---

## STEP 7 — Confirm

```
Synthesis ready.
Path: [REPORT_PATH]
Notes analyzed: [N]
Patterns found: [N]
Recommendations: [N]
```
