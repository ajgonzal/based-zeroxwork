# Claude Obsidian Second Brain — Vault Instructions

## How to operate inside this vault

This is a personalized Obsidian second brain configured for a **Researcher / Writer** workflow in **English**.

Before doing anything, read the vault profile:

```
.claude/vault-profile.md
```

This file is the source of truth for:
- Profile type and routing rules
- Language preference
- Folder structure
- Link rules

## Safety rules

- Never delete notes without explicit user confirmation.
- Never overwrite user-modified files without confirmation.
- Never invent project, client, or author names — use only real ones.
- Propose changes before implementing them.
- Never request passwords, credentials, or sensitive data.

## Writing rules

- Write all note content and headings in English.
- Use the minimum frontmatter schema: `type`, `profile`, `created`, `tags`.
- Apply Zettelkasten linking: every permanent note must connect to at least 2 others.
- Use `[[wikilinks]]` for all internal references.

## Installed commands

| Command | Purpose |
|---|---|
| `/second-brain-capture` | Capture an insight, idea, or source as a linked note |
| `/link-finder` | Find orphan notes and suggest connections |
| `/vault-synthesis` | Generate a synthesis report of the vault |
| `/next-steps-ai` | Suggest prioritized next actions |
| `/explore-skills` | Browse and build additional vault skills |

## MCP connection

This vault uses the `obsidian-vault` MCP to read and write notes.

To reconnect after restarting Claude Code:

```bash
claude mcp add obsidian-vault -- npx -y @bitbonsai/mcpvault@latest "/home/user/based-zeroxwork/ObsidianVault"
```

## Opening this vault

```bash
claude "/home/user/based-zeroxwork/ObsidianVault"
```
