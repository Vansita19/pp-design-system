# Project instructions: example

Example content for a fictional design system called Northwind. Replace every line with your own.

These five workflows share one project, which is why this file exists at all. One workflow does not
need it. Five workflows writing the same rule five times do.

Save it as `CLAUDE.md` for Claude Code, `AGENTS.md` for Codex or Cursor, or paste it into the custom
instructions of a Project on claude.ai. The Setup Guide appendix has the mapping.

---

## What this project is

Northwind: the shared design system behind our web app and our internal admin tools. Rules differ
between them. The admin tools have no marketing surfaces and no motion.

## Which source wins

| What | Canonical source | When another source disagrees |
|---|---|---|
| Token names and values | Figma library "Northwind / Foundations" | Figma wins. The token spreadsheet has been wrong since the semantic rename and is kept only for history |
| Component behaviour | The Figma component | Figma wins over Storybook, which lags behind |
| Published rules | Notion, Design System space | Anything not published there is a draft, however finished it looks |

## Never

- Invent a token name. If there is not one, say so and leave it marked
- Invent a usage example, a research quote, or a piece of feedback. Ask for a real one
- Quote a raw value where a token name belongs

## Not the agent's to decide

- Whether something meets an accessibility requirement. Report what you saw and hand it over
- Anything that would set a rule for the whole system rather than one component
- Changes to a published component other teams already use

## How we write

British English. "Component", never "element". "Token", never "variable".

---

*Design Agents Toolkit by [designsystems.surf](https://designsystems.surf). Questions? hey@designsystems.surf*
