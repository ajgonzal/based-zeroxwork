# /link-finder

Find orphan or weakly connected notes and suggest profile-aware wikilinks.

This command must follow the global command contract:

- read `.claude/vault-profile.md` first,
- respect the user's selected language,
- use the `obsidian-vault` MCP for Obsidian notes,
- never modify notes without confirmation,
- never delete notes.

---

## STEP 1 — Read vault profile

Read `.claude/vault-profile.md`. Extract: `[PROFILE]`, `[LANG]`, `[VAULT_PATH]`, `[STRUCTURE]`, `[ROUTING_RULES]`, `[LINK_RULES]`.

If missing, stop and say: "I do not see a vault profile yet. Run /vault-install first."

---

## STEP 2 — Define scan scope

If the user specified a scope (folder, project, date range), use it. Otherwise, default to the last 20 modified notes.

Do not scan `.claude/` or `docs/` unless explicitly asked.

---

## STEP 3 — Find weakly connected notes

Classify each note as:
- `orphan`: no obvious incoming or outgoing wikilinks
- `weak`: only one weak or generic link
- `healthy`: at least two useful contextual links

Only propose links for orphan or weak notes.

---

## STEP 4 — Score candidate connections (0–100)

| Signal | Score |
|---|---:|
| Keyword overlap | up to 40 |
| Same project/area | up to 20 |
| Same or related note type | up to 10 |
| Matches `[LINK_RULES]` | up to 20 |
| Same tags | up to 10 |

Only show suggestions with confidence ≥ 60 unless the user asks for weaker suggestions.

For the researcher profile, apply Zettelkasten link rules: permanent notes lacking 2+ links are always flagged as orphans regardless of score threshold.

---

## STEP 5 — Show suggestions

```
Found [N] orphan or weakly connected notes.

Top link suggestions:

[orphan-note-1.md]
- 92% -> [[related-note-a]] — same concept cluster
- 84% -> [[related-note-b]] — matches link rules

Choose:
A) Apply all suggestions above 80%
B) Review one by one
C) Skip
```

---

## STEP 6 — Apply links after confirmation

If A: apply suggestions ≥ 80%, patch notes via `obsidian-vault` MCP `patch_note`.
If B: walk through one by one, confirm each.
If C: make no changes.

Do not create empty placeholder notes.

---

## STEP 7 — Confirm result

```
Linking complete.
Notes updated: [N]
Links added: [N]
Remaining orphan or weak notes: [N]
```
