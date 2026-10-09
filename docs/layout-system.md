# Pitch Protocol grids and breakpoints

The Grids & breakpoints foundation documents Pitch Protocol, independently of the organizer's dark application shell. Viewport presets, the width slider, navigation controls, and content profiles update a scaled geometry diagram. The column overlay can be hidden. The specimen drawer overlays content without resizing it and closes with Escape; it is an illustration, not an actual modal navigation component. Two annotated 1440px diagrams compare the expanded and collapsed sidebars: green navigation, purple columns, amber gutters, and gray safe areas follow the user's attached grid reference. Their geometry uses PP's 248px sidebar rather than the reference's 272px.

## Source measurements

Inspected the local, read-only `pp-admin/investor-preview/styles.css` and `DESIGN-SYSTEM.md` on 8 October 2026. Later CSS declarations take precedence.

| Property | Current PP source | Organizer alias |
| --- | --- | --- |
| Expanded sidebar | 248px | `component.appShell.sidebar.expanded` |
| Collapsed sidebar | 80px | `component.appShell.sidebar.collapsed` |
| Main shell top/right/bottom inset | 10px | `component.appShell.shell.inset` |
| Main panel radius | 20px | `component.appShell.shell.radius` |
| Workspace header | 48px | `component.appShell.header.workspace` |
| Company-review header | 56px | `component.appShell.header.review` |
| Workspace content edge | 20px | `component.appShell.page.padding` |
| Review/chat minimum content edge | 32px | `component.appShell.reading.padding` |
| Summary maximum | 740px | `component.appShell.content.review` |
| Summary maximum with side panel | 680px | `component.appShell.content.reviewWithPanel` |
| Conversation maximum | 780px | `component.appShell.content.conversation` |
| Other detail content maximum | 1000px | `component.appShell.content.details` |
| Right-side panel | 391px | `component.appShell.panel.width` |

Aliases resolve from component → semantic layout → a primitive size/space/radius token. The instructional diagram colors use existing purple, green, amber, and neutral primitives and do not change the product palette. The module does not duplicate hex values or modify PP source. The diagram shows only the green sidebar and full-height purple columns, with transparent gutters and margins; no gray sheet, header, navigation placeholders, or content wireframes sit behind them. Content profiles share this simplified grid to isolate the effect of left navigation; the review profile applies the source's 740px reading maximum but does not reproduce its separate tool rail or right-side panel. Their source widths are documentation, not a claim that the entire company-detail shell is shown.

## Responsive extension

PP's current `.app-shell` has `min-width: 1180px` and `min-height: 760px`. Although individual content blocks contain media queries, the source does **not** implement a responsive application shell. The rules below are explicit system additions; they must be implemented in PP separately before they describe runtime behavior. The foundation labels them “Responsive extension.”

| Viewport | Columns | Gutter | Content edge | Navigation default |
| --- | --- | --- | --- | --- |
| 320–639px | 4 | 16px | 16px | Overlay drawer |
| 640–767px | 4 | 16px | 24px | Overlay drawer |
| 768–1023px | 8 | 20px | 24px | Overlay drawer |
| 1024–1279px | 12 | 24px | 20px workspace / 32px reading | Collapsed 80px |
| 1280px and above | 12 | 24px | 20px workspace / 32px reading | Expanded 248px |

The existing `breakpoint.sm/md/lg/xl` values (640/768/1024/1280px) are preserved and receive layout-specific semantic aliases. Desktop users may explicitly expand or collapse the sidebar. Below 1024px, navigation becomes a 248px overlay and the content retains its full available width. The smaller shell loses the desktop exterior inset. Below 768px, four columns remain usable at the 320px minimum. Reading content retains its source maximum width; extra horizontal room becomes centered outer space. Columns divide this final content area, rather than the entire viewport.

`F.layoutProfile(config)` is the single geometry resolver used by the preview and checks. It returns the actual column width, gutter, content width, device/breakpoint, and navigation state. `F.layoutFoundation()` renders the controls and diagram. `F.wireLayoutFoundation(root, registerCleanup)` installs removable event handlers. `F.layoutTokens()` supplies IDs for the shared alias-aware token table.

## Verification

`node checks/layout-system.cjs` verifies breakpoint boundaries, source geometry, positive column widths across the supported viewport range, manual navigation behavior, token alias chains, and specimen controls. Static SVG geometry and event-contract checks do not replace a browser visual review.
