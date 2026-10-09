# Forma organizer instructions

This is a static, personal design-system organizer. Pitch Protocol is its first source project. Read [the maintenance rulebook](docs/design-system-maintenance.md) before changing a component or token contract.

- Follow the user's current request and established visual choices. External references are evidence for specific improvements, not permission for a redesign or extra features.
- Keep the original `/Users/vansitaaddanki/pp-admin/investor-preview` and parent `sources/` files read-only. Import reusable patterns into this organizer; do not alter Pitch Protocol.
- Read the live source before calling a pattern source-exact. Separate retained, normalized and newly extended behavior in the relevant source document.
- Prefer an existing variant or composition. Add a catalogue page only for a distinct, useful, reusable family. Keep project-specific provenance in `docs/`, not repeated in the UI.
- Keep the dark organizer shell separate from the Pitch Protocol component specimens. Branding/assets/website stay inactive; Motion tokens and Layers stay hidden unless requested.
- Use the registered tokens in `dist/tokens.js` and component modules. Map by purpose before value. Component inspectors show named aliases, not raw hex values; do not invent an existing token or silently rename a public alias.
- Reuse shared atoms, behavior and configuration-aware token contracts. Preserve the native link/button/input semantics, Hugeicons Stroke Rounded icons and official Hairline cover pipeline.
- Keep Overview first and All states second. Focused sections begin with their own specimens; show only meaningful combinations and applicable states.
- Scope listeners and state to each preview. Register cleanup for listeners, timers, observers and portals; support reduced motion and the pause control.
- Verify the affected contract and actual behavior. Source/event checks do not prove browser appearance or accessibility conformance. Record limitations honestly.
- Update source notes, dependent token lists, covers when needed, and delivery artifacts with the change. Use the existing checks and packager rather than introducing infrastructure for routine edits.
- Continue authorized, reversible work without adding an approval ceremony. Respect current tool restrictions: no browser session, local server or deployment while those actions remain unavailable or denied.

- Source fidelity: when the user requests an existing Pitch Protocol or supplied component, read and reuse its actual renderer and final CSS. If the required code cannot be accessed, ask the user for the missing source before implementing a substitute. Do not label an independent recreation as an installation or exact extraction.

- Icon system: use Hugeicons Stroke Rounded exclusively for UI glyphs. Use the shared F.icon renderer with 1.25px non-scaling strokes up to 16px and 1.5px above 16px. Preserve charts, brand marks and the exact source loading artwork as non-icon graphics. No Lucide or Phosphor fallbacks.

- Visual review: read `docs/visual-review-guide.md` when applying a feedback batch. Review drafts are proposals, scoped by owning page, rendered family, configuration and named target. Read current source before applying; do not execute imported text or selectors. Route repeated fixes through shared atoms/tokens and repackage the deliverables. See `docs/toolkit-setup.md` for the supplied toolkit references and how their workflows are adapted here.

- Corner treatment: use ordinary CSS `border-radius` only. Corner smoothing is explicitly removed everywhere; do not restore custom SVG corner painters, smoothing tokens or `corner-shape` overrides. Preserve existing radius values, circles and capsules.
