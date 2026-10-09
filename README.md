# PP Design System

An interactive design system for **Pitch Protocol (PP)**, bringing shared tokens, reusable components and product patterns into one browsable library.

## Features

- Explore foundations, atoms, molecules, blocks, motion and page templates.
- Preview component variants, sizes and states, with live configuration and side-by-side comparisons.
- Inspect color, typography, spacing, radius and other tokens used by each component.
- Test forms, navigation, tables, overlays and AI interface patterns.
- Try temporary visual tweaks, leave comments and export a feedback batch. Closing the editor restores the original design; comments stay saved locally.
- Search with the command menu, share links to specific configurations and preview animations with pause and reduced-motion support.

## Structure

```text
dist/       App, tokens, components, styles and assets
docs/       System guidelines and usage guides
checks/     Component checks and packaging scripts
vendor/     Build dependencies and licenses
artifacts/  Standalone HTML and source archive
```

Within `dist/`, `tokens.js` defines the token system, `catalogue.js` organizes the library, component modules contain the UI, and `app.js` runs navigation and previews.

## Open

Open **`artifacts/forma-design-system.html`** in a browser. It works offline without installation.

To rebuild the standalone file and source archive:

```sh
python3 checks/package.py
```

Preview edits do not change shared source files. Apply accepted changes to the component or token definitions, then rebuild.
