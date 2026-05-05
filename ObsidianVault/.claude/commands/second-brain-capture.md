# /second-brain-capture

Capture a user input and turn it into a structured, profile-aware, linked Obsidian note.

This command must follow the global command contract:

- read `.claude/vault-profile.md` first,
- respect the user's selected language,
- use the `obsidian-vault` MCP for Obsidian notes,
- use the filesystem Read/Write tools for `.claude/`, command files, docs, and configuration,
- propose before creating a note,
- never delete or overwrite user content without explicit confirmation.

---

## STEP 1 — Read vault profile

Read `.claude/vault-profile.md`. Extract: `[PROFILE]`, `[LANG]`, `[VAULT_PATH]`, `[STRUCTURE]`, `[ROUTING_RULES]`, `[LINK_RULES]`.

If the file does not exist, stop and say: "I do not see a vault profile yet. Run /vault-install first."

---

## STEP 2 — Classify the input

Classify into one generic type: `insight`, `solution`, `decision`, `meeting`, `idea`, `reference`, `task`, `goal`, or `reflection`.

Extract: `[GENERIC_TYPE]`, `[TOPIC]`, `[PROJECT]`, `[SOURCE]`, `[AREA]`.

---

## STEP 3 — Map to researcher type

| Generic type | Researcher mapping |
|---|---|
| insight | permanent-note |
| solution | permanent-note |
| decision | argument |
| meeting | project-note |
| idea | permanent-note |
| reference | literature-note |
| task | project-note |
| goal | project-note |
| reflection | permanent-note |

Store the final type as `[TYPE]`.

---

## STEP 4 — Apply routing rules

Using `[ROUTING_RULES]` from `.claude/vault-profile.md`, determine `[DESTINATION_FOLDER]`.

Default routing for researcher:
- `raw-capture` → `00_Inbox/`
- `literature-note` → `01_Literature/[Books|Papers|Articles|Podcasts]/`
- `permanent-note`, `concept`, `argument`, `question`, `contradiction` → `02_Permanent/[subfolder]/`
- `project-note` → `03_Projects/[project]/`
- `author` → `04_References/Authors/`
- `source` → `04_References/Sources/`
- `daily` → `05_Daily/`

If uncertain, ask one focused question before routing.

---

## STEP 5 — Generate title, slug, tags, and links

Generate: `[TITLE]`, `[SLUG]` (lowercase, hyphenated), `[TAGS]` (2-4 stable tags), `[PROPOSED_LINKS]` (2-3 wikilinks based on `[LINK_RULES]`).

---

## STEP 6 — Propose to user

```
Type: [TYPE]
Folder: [DESTINATION_FOLDER]
Title: [TITLE]
Tags: [TAGS]
Links to: [PROPOSED_LINKS]

OK? [yes / adjust]
```

Wait for confirmation. Do not create the note before confirmation.

---

## STEP 7 — Create note via obsidian-vault MCP

Path: `[DESTINATION_FOLDER]/[YYYY-MM-DD]-[SLUG].md`

Minimum frontmatter:
```yaml
type: [TYPE]
profile: researcher
created: [YYYY-MM-DD]
tags: [TAGS]
```

Write headings in English. Use the appropriate content template (summary, context, why it matters, related links).

---

## STEP 8 — Create wikilinks and backlinks

Check if proposed linked notes exist. If they exist, patch them to add a backlink. If not, keep the wikilink but do not create empty placeholder notes.

---

## STEP 9 — Confirm

```
Captured: [TITLE]
Path: [DESTINATION_FOLDER]/[YYYY-MM-DD]-[SLUG].md
Linked to: [created backlinks or proposed wikilinks]
```
