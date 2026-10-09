# Source fidelity repair — 9 October 2026

This pass follows the user's explicit corrections to prior visual approximations. The original Pitch Protocol project and synced files remain read-only. Missing source must be requested before an alternative is implemented; that rule is now recorded in project AGENTS.md for subsequent chats.

## Actual corrections

- AI progress uses the attached TaskRows source (preserved in `references/task-rows.tsx`) for its box, single-line rows, disclosure direction, spacing and transitions. Queued status uses the official Hugeicons CircleDashedIcon glyph. The user's equal-size requirement supersedes the reference's mismatched16/20px indicators: each state owns a20px outer footprint, with a12px check inside the completed circle. Redraws preserve these dimensions.
- AI loader now calls the same extracted helper as research activity. Its25 exact SVG paths, opacity distribution, five pulsing paths,16px view box and source pulse timing come from Pitch Protocol's `assets/thinking-grid.svg` and winning stylesheet. The unrelated large-dot grid and fake3×3 choice are removed.
- Navigation uses the live source's eleven destinations and section ordering, compact36px links,24/32px profile sizes, header/footer dimensions and borderless column. The official Hugeicons Stroke Rounded equivalents preserve the system's single icon family; local specimen actions do not navigate the original application.
- Filter controls have shared chip-field insets,16px panel padding, and a theme class that persists when the panel moves to a portal. Close/removal/select-chevron utility glyphs use the same registered library at16px. Leading content glyphs and source-specific compact row chevrons retain their documented sizes.
- Action-bar buttons now request the shared inverse ghost-button contract. Their foreground resolves to white, hover to `#ffffff1a` (10% white), and pressed to `#ffffff33` (20% white). This removes the conflicting light ghost-button foreground/hover styles rather than layering another selector over them. Selection, Undo and table-bulk actions share this contract.
- Evidence Trace is temporarily hidden from sidebar, catalogue, command search and direct routing. Its implementation remains available for later improvement; its twelve source records are explicitly excluded from public coverage.
- Toast uses the installed original Spectrum registry component with React/Motion, bundled as a scoped island. The registry source files are preserved byte-for-byte in `vendor/spectrum-toast`; its wrapper handles the organizer's theme, Hugeicons glyphs, local demo actions, focus and lifecycle. The previous native imitation is no longer the toast renderer. The source archive includes the registry, license, lockfile and build recipe, excluding dependencies.

## Verification boundaries

Regression checks cover source bytes and geometry, registered token references, state updates, icon identity, inverse-button states, page hiding, and lifecycle. A separate DOM runtime test mounts the actual production toast bundle, exercises capacity, pause, dismissal, Undo, status updates and unmount. It is not a browser screenshot or a proof of visual motion fidelity. No browser session, local server or deployment was used under the project restrictions.

All48 component/source/runtime checks pass;75 official Hairline benches validate. The final HTML and source ZIP include the original toast runtime and its reproducible build sources.
