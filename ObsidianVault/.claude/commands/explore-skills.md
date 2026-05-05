# /explore-skills

Browse the skills catalog and build optional Claude Code commands into this vault.

This command must follow the global command contract:

- read `.claude/vault-profile.md` first,
- respect the user's selected language,
- use the filesystem Read/Write tools for command files,
- show full specification before building,
- never overwrite existing command files without confirmation.

---

## STEP 1 — Read vault profile

Read `.claude/vault-profile.md`. Extract: `[PROFILE]`, `[LANG]`, `[VAULT_PATH]`.

If missing, stop and say: "I do not see a vault profile yet. Run /vault-install first."

---

## STEP 2 — Read skills catalog

Read `docs/skills-catalog.md` to get the list of available additional skills.

---

## STEP 3 — Present installed and available skills

```
Installed core skills:
✓ /second-brain-capture
✓ /link-finder
✓ /vault-synthesis
✓ /next-steps-ai
✓ /explore-skills

Additional skills available to build:
1. /forgotten-notes — Surface overlooked notes from 30+ days ago
2. /decision-tracker — Analyze decision outcomes and patterns
3. /daily-note — Generate templated daily notes with carryover tasks
4. /project-health — Monitor active projects, alert on stalls
5. /weekly-review — Guided weekly reflection and summary
6. /capture-from-url — Convert web content into vault notes
7. /meeting-recap — Transform meeting notes into structured action items

Which skill would you like to build? (enter number or name, or "none")
```

---

## STEP 4 — Show skill specification

Display the full specification of the selected skill from the catalog before building. Ask for confirmation.

---

## STEP 5 — Build command file

Check if `.claude/commands/[skill-name].md` already exists.

If it exists: ask for confirmation before overwriting.

If it does not exist: create the file using the filesystem Write tool with the full command specification.

---

## STEP 6 — Custom skill request

If the user requests a skill not in the catalog:

1. Ask for a description of the skill's purpose.
2. Draft the specification following the standard command contract format.
3. Show the draft for approval.
4. On approval: create the command file and add an entry to `docs/skills-catalog.md`.

---

## STEP 7 — Confirm

```
Skill installed: /[skill-name]
Path: .claude/commands/[skill-name].md
Ready to use in this vault session.
```
