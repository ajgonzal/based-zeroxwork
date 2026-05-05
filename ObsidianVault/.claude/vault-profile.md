---
profile: researcher
language: English
vault_path: /home/user/based-zeroxwork/ObsidianVault
created: 2026-05-05
---

# Vault Profile — Researcher / Writer

## Profile
researcher

## Language
English

## Vault Path
/home/user/based-zeroxwork/ObsidianVault

## Structure

```
00_Inbox/
01_Literature/
  Books/
  Papers/
  Articles/
  Podcasts/
02_Permanent/
  Concepts/
  Arguments/
  Questions/
  Contradictions/
03_Projects/
04_References/
  Authors/
  Sources/
05_Daily/
docs/
.claude/
  commands/
  vault-profile.md
```

## Routing Rules

| Note type        | Destination                          | Triggers                                      |
|------------------|--------------------------------------|-----------------------------------------------|
| raw-capture      | 00_Inbox/                            | any unprocessed capture                       |
| literature-note  | 01_Literature/[Books|Papers|Articles]| book, paper, article, source, read            |
| permanent-note   | 02_Permanent/Concepts/               | concept, idea, insight, learned, realized     |
| argument         | 02_Permanent/Arguments/              | argument, claim, thesis, position             |
| question         | 02_Permanent/Questions/              | question, unsolved, wondering, open problem   |
| contradiction    | 02_Permanent/Contradictions/         | contradiction, conflict, tension, paradox     |
| project-note     | 03_Projects/[project]/               | project, draft, outline, writing              |
| author           | 04_References/Authors/               | author, researcher, writer                    |
| source           | 04_References/Sources/               | source, reference, citation, URL              |
| daily            | 05_Daily/                            | today, daily, journal, reflection             |

## Link Rules

- Every permanent note must link to at least 2 other permanent notes (Zettelkasten principle).
- Literature notes link to their author note and to permanent notes derived from them.
- Inbox notes are temporary — process and move to the appropriate folder.
- Project notes link to relevant concepts, arguments, and literature notes.
- Orphan permanent notes are flagged by /link-finder.
- Daily notes link to active projects and recent insights.
