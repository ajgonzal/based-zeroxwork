# /next-steps-ai

Suggest 3–5 prioritized next actions by analyzing your vault's current state.

This command must follow the global command contract:

- read `.claude/vault-profile.md` first,
- respect the user's selected language,
- use the `obsidian-vault` MCP for Obsidian notes,
- never create tasks without explicit user request.

---

## STEP 1 — Read vault profile

Read `.claude/vault-profile.md`. Extract: `[PROFILE]`, `[LANG]`, `[VAULT_PATH]`, `[STRUCTURE]`, `[ROUTING_RULES]`, `[LINK_RULES]`.

If missing, stop and say: "I do not see a vault profile yet. Run /vault-install first."

---

## STEP 2 — Determine scope

If the user specified a scope (project, area, date range), use it. Default: last 10 modified notes + active projects + blocked items + pending decisions + weakly linked content.

---

## STEP 3 — Inspect vault via obsidian-vault MCP

Identify: blocked items, active work in progress, pending decisions, unprocessed inbox notes, stalled projects, orphan permanent notes, open questions, incomplete tasks, repeated topics without a dedicated note.

---

## STEP 4 — Score candidate actions (0–100)

| Action type | Score range |
|---|---|
| Unblocking stalled work | 80–100 |
| Processing inbox notes | 70–90 |
| Resolving open questions | 60–80 |
| Completing pending decisions | 60–80 |
| Filling knowledge gaps | 50–70 |
| Connecting orphan permanent notes | 40–60 |
| Routine maintenance | 20–40 |

For researcher profile: prioritize unresolved questions, orphan permanent notes lacking 2+ links, literature notes not yet distilled into permanent notes, and arguments missing supporting evidence.

---

## STEP 5 — Present 3–5 ranked actions

```
Next steps ranked by impact:

1. [HIGH] Score: 92 — Process 3 inbox notes awaiting classification
   Related: [[inbox-note-1]], [[inbox-note-2]]

2. [HIGH] Score: 85 — Connect orphan permanent note [[concept-x]] — no links yet
   Suggestion: link to [[concept-y]] and [[argument-z]]

3. [MEDIUM] Score: 71 — Distill [[literature-note-on-topic]] into a permanent note

Choose an action to get an execution plan, or type "skip".
```

---

## STEP 6 — Execution plan on request

If the user selects an action, provide a clear execution plan. Offer to create a note, task, decision review, or project update with confirmation before creating.

---

## STEP 7 — Insufficient data

If the vault has fewer than 5 notes, say:

```
Not enough vault data to generate reliable next steps.
Recommended: capture 3–5 notes with /second-brain-capture, then run /link-finder.
```
