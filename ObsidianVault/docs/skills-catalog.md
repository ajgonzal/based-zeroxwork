# Skills Catalog

This catalog lists all available vault skills. Core skills are pre-installed. Additional skills can be built on demand via `/explore-skills`.

---

## Core skills (pre-installed)

| Command | Location | Purpose |
|---|---|---|
| `/second-brain-capture` | `.claude/commands/second-brain-capture.md` | Capture input as a structured, linked vault note |
| `/link-finder` | `.claude/commands/link-finder.md` | Find orphan notes and suggest wikilinks |
| `/vault-synthesis` | `.claude/commands/vault-synthesis.md` | Generate synthesis reports from vault content |
| `/next-steps-ai` | `.claude/commands/next-steps-ai.md` | Suggest prioritized next actions |
| `/explore-skills` | `.claude/commands/explore-skills.md` | Browse and install additional skills |

---

## Additional skills (available to build)

### `/forgotten-notes`
Surfaces notes that have not been accessed or linked in 30+ days, ranked by potential relevance to active projects. Helps prevent knowledge from going stale.

### `/decision-tracker`
Analyzes decisions captured in `02_Permanent/` and across project notes. Tracks outcomes by category, flags pending decisions, and reveals patterns in good and bad decisions.

### `/daily-note`
Generates a templated daily note in `05_Daily/` with carryover tasks from the previous day, active projects, and space for reflection.

### `/project-health`
Monitors active projects in `03_Projects/` and alerts when a project has had no new activity in more than 2 weeks. Suggests next steps to unblock stalled work.

### `/weekly-review`
Guides a structured weekly reflection: reviews daily notes, surfaces wins and blockers, updates project statuses, and creates a weekly summary note.

### `/capture-from-url`
Takes a URL, fetches the content, classifies it, and converts it into a structured literature note routed to the correct `01_Literature/` subfolder with source metadata.

### `/meeting-recap`
Transforms a raw meeting transcript or bullet notes into a structured note with key points, decisions, action items, and risks. Routes to the appropriate project folder.

---

## How to build an additional skill

1. Run `/explore-skills` in your vault session.
2. Select a skill from this catalog.
3. Claude shows the full specification before building.
4. Confirm, and the command file is created in `.claude/commands/`.

## How to request a custom skill

Tell Claude what you need. It will draft a new skill specification, add it to this catalog, and create the command file.
