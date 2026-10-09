# Source trace

`dist/source-trace.js` and `dist/source-trace.css` extract the reusable source-trace interface from the read-only Pitch Protocol preview. This is a local sample: it does not fetch research, verify a source, or edit a company record.

## Public contract

```js
F.sourceTrace({
  variant: 'sidebar', // sidebar | map | confidence | sources
  confidence: 'moderate', // high | moderate | low
  expanded: true, // initial sidebar synthesis disclosures
  selected: false, // traced inline statement in the confidence specimen
  sourceState: 'all', // all | available | pending | missing; sources specimen
  company: 'AsterGrid',
  statement: 'The founding team combines relevant product and engineering experience.',
  // Optional replacement source records. At most 12 are rendered per area.
  sources: [{ title: 'Company record', previewState: 'available',
    sourceType: 'Company supplied', status: 'Unverified',
    excerpt: 'A supplied statement.', url: 'https://example.org/record' }]
});
F.sourceTraceTokens(config); // named component aliases and shared atom dependencies
F.wireSourceTrace(previewRoot, registerCleanup);
F.disposeSourceTrace(previewRoot); // idempotent, before replacing a dynamic panel
```

Load the module after `tokens.js`, `phosphor-icons.js`, `previews.js`, and `avatar.js`. It registers its aliases and refreshes the existing `project-tokens` style. Both wiring and disposal accept a trace wrapper or any ancestor. Instances keep independent model, selection, graph transform, popover, IDs, listeners, and cleanup. `F.createSourceTraceModel`, `F.createSourceTraceState`, and `F.sourceTraceGraph` expose the pure local fixtures/state/layout for verification.

## Coverage ledger

Source root: `/Users/vansitaaddanki/pp-admin/investor-preview/`. Line references reflect the current source at extraction. Counts below identify reusable visual or interaction contracts, rather than counting every sample label as a separate component.

| # | Source pattern and evidence | Organizer renderer / behavior |
| --- | --- | --- |
| 1 | Inline dotted-underlined statement, `trace-model.js:106–109`, `trace.css:5–13` | `inline()` renders the native button and uniquely labelled tooltip. Hover and keyboard focus expose signal/source counts. |
| 2 | Active traced statement, `trace.css:136` | `selected:true` renders `is-traced` with blue text and subtle blue surface; activation opens the matching finding. |
| 3 | High/moderate/low confidence glyph and compact control, `trace-ui.js:16–22`, `assets/trace-figma/confidence-*.svg` | `glyph()`, `confidence()`, `confidenceButton()` preserve the source three-bar geometry and 16px control / 15px circular surround. All three levels are visible in the confidence specimen. |
| 4 | Confidence trust explanation and status, `trace-ui.js:44–55` | `trust()` plus anchored `show()` distinguish interpretation from verification and open questions from negative findings. |
| 5 | Source-count trigger, `trace-ui.js:24` | `sourcePill()` uses unique descendant source counts. Repeated evidence does not inflate the count. |
| 6 | Selected statement section, `trace-ui.js:30–33`, `trace.css:151–154` | `sidebar()` provides the separate label/body/divider section. |
| 7 | Findings with selected state, `trace-ui.js:30–33`, `trace.css:55–60` | Three local findings; pressed state and selected border update with selection, and focus returns to the selected finding. |
| 8 | Synthesis tree and branch rail, `trace-ui.js:26–33`, `trace.css:64–75` | Native parent and nested `details`, 1.5px rail, source insets, counts, expanded/closed summaries. |
| 9 | Evidence card with confidence control, `trace-ui.js:25`, `trace.css:79–84` | `evidence()` composes the evidence/source trigger and compact confidence button. |
| 10 | Evidence-group collapse and show-more, `trace-ui.js:28,134` | Scoped `evidence-toggle` updates hidden state and `aria-expanded`; native extra-evidence disclosure shows the third item. |
| 11 | Sidebar header and View all, `trace-ui.js:35` | Shared Button opens the native research-map modal; Close, backdrop or Escape restores opener focus. |
| 12 | Available / pending / missing source rows, `trace-ui.js:40–42`, `trace.css:92–106` | `sourcesList()` renders the compact 260px floating/list specimen, colored dot, state glyph, available title underline, optional external-link glyph. |
| 13 | Source drill-in, back, original link, `trace-ui.js:129–132` | `sourceDetail()` preserves record title, kind/status, excerpt and original anchor; Back restores the selected row. Only HTTP(S) or safe internal hash URLs are accepted. |
| 14 | Anchored hover/focus/click popovers, `trace-ui.js:37–55,125,146–155` | Local fixed popup supports pinning, hover grace period, viewport clamping, Escape focus restore and outside dismissal. Scrolling the popup itself remains possible. |
| 15 | Company map node, `trace-ui.js:57–62,83` | Shared Avatar, 155×38px source node, 24px avatar override and control shadow. |
| 16 | Six colored research-area nodes and counts, `trace-model.js:4–11`, `trace-ui.js:57–62,85–87` | Team, Product, Traction, Market, Competition and Risk nodes retain label/icon/count anatomy and per-area token colors. |
| 17 | Finding map nodes, confidence and verification meta, `trace-ui.js:57–62` | `sourceTraceGraph()` renders selected/unselected findings; the selected node includes confidence and shared warning Badge. |
| 18 | Synthesis / evidence / source map nodes, `trace-ui.js:57–62` | Separate node anatomy; selected synthesis is green and evidence red; source anchors retain their underline and safe target attributes. |
| 19 | Four counted graph columns, definitions and show-more, `trace-ui.js:64–100` | Findings / Synthesis / Evidence / Sources use 226 / 242 / 246 / 244px widths and 52px gaps. All have counts; extra items expand/collapse; selected items remain visible. |
| 20 | Curved connectors and selected path, `trace-ui.js:104–107` | Source cubic connectors, active path stroke and branch selection. |
| 21 | Visited area collapsed columns, `trace-ui.js:90–94,139` | Area selection remembers its branch; previously visited inactive areas render counted compact column headings. |
| 22 | Research map header, breadcrumb, help and controls, `trace-ui.js:112–116,137,140` | Shared icon Buttons/Avatar, local breadcrumb focus, contextual help, live zoom readout and Fit control. The inline map includes Expand; the native modal preserves the source full-screen inset, header, close control and backdrop. |
| 23 | Map pan / zoom / fit / focus management, `trace-ui.js:109–121,138–157` | Bounded local pointer drag, wheel pan, Ctrl/Meta wheel zoom, keyboard arrows / + / − / 0, 40–180% zoom limits, focus visibility, pointer release and listener cleanup. |

## Retained and normalized

Retained source dimensions include the 391px sidebar (350px narrow container), 11px branch inset, 8/10px evidence/synthesis radii, 16px confidence control, 15px circular surround, 9×8px confidence glyph, 260px source popup with 15px padding, 28px source row, 5px dot, source node/column geometry, and curved graph connectors. Confidence SVG coordinates come from the PP assets, with token color substitutions only.

The organizer uses shared Phosphor icons instead of the source's mixed source-status icon packs; shared Buttons, Avatar and Badge replace equivalent duplicated atoms. Source list interactions differ from an individual citation popover, so they retain a dedicated list/drill-in contract instead of wrapping unrelated `F.aiCitation` behavior. Plain trace counts and source-count triggers remain compact trace-specific controls.

Source grays and colors map to the closest existing palette role: high confidence → green 600, moderate → amber 500, low → red 500; selected finding → semantic border focus; selected synthesis → green 600; selected evidence → red 500. Area surfaces use existing blue/purple/green/amber shades. There is no orange palette in the system, so Competition uses amber. Border-only selected cards avoid the source's extra selected shadow halo. Source confidence text stays compact; focus is separately visible on the actual control.

The map is inline by default. Sidebar View all and the inline map’s Expand control open the same local graph in a native `dialog.showModal()` top layer, with the source 22px viewport inset (10px below 900px), 20px map radius and 8px backdrop blur. Native modality contains focus; Close, backdrop click and Escape restore the opener. Source/trust popovers move into the active dialog so they remain above its backdrop. Closing or disposing a specimen removes the dialog and its listeners; repeated Open or Dispose calls are safe. Sample content is illustrative rather than a preserved company claim. Source pending/missing records have no fabricated original URL.

## Token contract

Every `component.trace.*` registration is an alias. Literal new geometry/shadows are primitives; inspectors receive names through `F.sourceTraceTokens(config)`.

| Alias group | Roles |
| --- | --- |
| `component.trace.*` common | surface, subtle, border, strongBorder, heading, body, meta, focus, selected, selectedSurface, font, line, weight, radius, padding, gap, hairline, rule, railWidth |
| `component.trace.sidebar.*` | width, narrow, statementLine, sectionGap, branchInset, headingFont, synthesisRadius, evidenceFont, evidenceLine |
| `component.trace.count.*` | size, font, surface, foreground |
| `component.trace.confidence.*` | control, circle, width, height, font, line, high, moderate, low, inactive |
| `component.trace.popover.*` | width, radius, padding, shadow, font, line |
| `component.trace.sources.*` | width, padding, radius, shadow, rowHeight, dot, icon, available, pending, missing |
| `component.trace.tooltip.*` | width, shadow, offset, radius, font, line |
| `component.trace.map.*` | height, headerHeight, footerHeight, padding, radius, companyWidth, companyHeight, areaHeight, findingWidth, synthesisWidth, signalWidth, sourceWidth, columnGap, nodeFont, nodeLine, sourceFont, sourceLine, headingShadow, companyShadow, connector, connectorActive, synthesisSelected, signalSelected, controlsRadius, controlHeight, zoomWidth, companyAvatar, companyRadius, areaIcon, areaIconRadius |
| `component.trace.area.{team,product,traction,market,competition,risk}.*` | surface, icon |
| `component.trace.inline.*` | underline, selected, selectedSurface |
| `component.trace.modal.*` | background, shadow (shared modal aliases), backdrop, inset, narrowInset, blur |
| `component.trace.motion.*` | duration, easing |

Variant contracts include the actual shared Button, Avatar and warning Badge aliases where composed, as well as shared typography, spacing and stacking tokens. The sidebar's opened map uses the same map contract as the standalone map specimen.

## Verification and exclusions

`node checks/source-trace.cjs` checks 27 configurations, the 23 coverage entries above, graph branch traversal/show-more/count behavior, bounded transforms, safe content and URLs, original confidence glyph coordinates, named aliases, CSS token existence, unique IDs, native disclosures, and 23 local interaction contracts including popup escape/focus, source drill-in/back, evidence collapse, graph selection, help, pointer pan, keyboard zoom, native modal open/close/backdrop/Escape/focus/disposal, and cleanup. It also checks reduced-motion/paused and forced-color CSS hooks.

No browser or local server was launched. These are renderer, geometry, state and event assertions; they do not prove visual equivalence, screen-reader experience, touch usability or accessibility conformance.

Excluded backend/application responsibilities: source ingestion, research generation, evidence verification, server persistence, application route ownership, company-specific lineage records, cross-company caching and original app lifecycle. A consumer can supply source records and mount this local family without implying those services exist.
