# Company report component contract

`dist/source-details.js` / `source-details.css` extract the active PP report and company-panel visual patterns. Load after tokens, Phosphor icons, Avatar, the existing Information/Metric/Profile primitives, previews, and the source Chat/Trace modules before calling the renderers. This module adds aliases in the existing token graph and refreshes `project-tokens`; it does not mutate PP source or import business services.

## Public API

- `F.sourceDetails(config)` returns the specimen wrapper.
- `F.sourceDetailsTokens(config)` returns base structure/variant aliases and the exact token references emitted by nested Badge, Button, Avatar and other renderers.
- `F.wireSourceDetails(root, registerCleanup)` owns local interactions. Repeated mounting is guarded; cleanup removes listeners, closes local dialogs, disposes dynamically mounted Chat/Trace/Prompt/source popovers and revokes attachment object URLs.
- `F.validateSourceDetailsFile(input)` validates the current file and clears stale custom validity. The 20 MB limit matches the source upload UI.
- `F.sourceDetailsParts` exposes safe structured prose, source section shell, comparison/category/list compositions, rich report table, profile/timeline, rings, stats/adjustments, questions/signals, summary blocks, update rows and file/note rows for reuse. Information block’s question/profile specimens share the full source Q&A/founder compositions. Standalone metrics/highlights/score and employment/education history are documented under Metric card and Timeline.

| Variant | Meaningful options | Source behavior represented |
|---|---|---|
| report | `reportStyle: framed/plain`, `state: populated/empty` | Report prose with citations, header metadata, Bull/Bear columns, category rows, questions and notes |
| application | Optional `highlights` array | Eight metrics including investor identity, optional highlight values, plain sections, research extract |
| tables | `tableStyle: sizing/projection/competition`, optional structured `table`, `state` | Optional headers, seven-column projection, identity/citation cells and risk footer |
| commercial | — | Source 1:2 split with responsive stacking |
| profiles | `avatar: text/image`, `open`, `state` | Multiple founders, role/social links, badges/equity, enrichment with both history types |
| roster | — | Name/role, score, cited description |
| scorecard | — | Stripe score, vertical stats, six rings/legend/strength key, conviction factors, adjustment groups |
| questions | `status: complete/pending`, `open`, `state` | Required/recommended/optional, answer quality/red flag, full context and empty set |
| research | `status`, `open`, `state` | Mixed per-record verification, excerpt, source/metrics footer, patterns and gaps |
| summary | `avatar` | Company identity/traversal/tabs, radar/facts, founder chips, contacts/fund-fit, decision card and customization |
| updates | `updateFilter: all/founder/research`, `state` | Month groups, actor/event rail, before/after, question/source footer and local unread state |
| panel | `panel: files/notes/chat/trace`, `state` for files/notes/chat | Adjacent persistent panel, compact rail, real Chat/Trace compositions and local attachments/notes |
| files | `fileType: document/text/pdf/image/unavailable`, `state` | Native document/image preview, escaped text, unavailable/missing original, truthful original-file link |

Structured text accepts plain strings or arrays of explicit `{cite:'S1'}` / `{link:'Label',href:'https://…'}` segments. Arrays of segment arrays become separate paragraphs. Arbitrary HTML is escaped. Links accept only HTTPS, mailto or fragment values. Never pass untrusted HTML as a table cell.

## Source geometry and normalization

Primary evidence: PP `detail-pages.js/css`, `review.js`, `summary-components.js`, `company-updates.js`, and `file-store.js`. Exact row-level source references are recorded in `audit-details-coverage.json` (88 visual patterns plus four nonvisual exclusions).

Preserved geometry includes 44px founder portraits, 16px profile cards, 20px timeline shells, 170px label column, source projection widths, 1:2 commercial layout, 1:1.08 score layout, six concentric arcs, 28px activity nodes and source file-paper thumbnails. Colors map to existing semantic/palette roles. Icons use the existing Phosphor registry; original source library differences are normalized rather than redrawn. Shared tag/citation, category/status badge, checkbox and ordinary card-radius decisions remain authoritative. The latest spacing override (9 October 2026) normalizes report table padding to 8px vertical / 16px horizontal and all other padding/gaps/margins to [the shared scale](spacing-system.md); original source widths, heights, icons and curves remain geometry.

`assets/source-details/decision-landscape.png` is the unchanged PP decorative asset referenced by `decision-visuals.js` via `assets.js` key `40000159-269_imgDialog1`. Its final source crop is 84px high, 260% image height at −48%, desaturated. The local PDF/TXT files contain explicit illustrative content, not captured company information. Every Open original action points to the actual displayed fixture; unavailable originals have no action.

## Local interaction boundaries

The preview actually updates selected report tabs, summary visibility, company header/count, decision summary, update filters/read labels, notes, files and panel visibility. Added notes/files survive switching panels within the mounted specimen. Native dialogs contain focus and close with Escape. Oversized file errors recover when the user selects a valid file. Pending questions never display assessment of a hidden sample answer.

Dynamic panel content calls the actual `F.sourceChat` or `F.sourceTrace`; those modules retain ownership of their internals. Their disposal helpers run before replacement. No API calls, outbound messages, account permissions, persistent file database, research execution, confidence/scoring calculations or production decision delivery occur. Those are application services, not missing visual components.

## Verification

Run `node checks/source-details.cjs` and `node checks/source-trace.cjs`. Details checks cover 52 base render configurations, source table schemas, rich-text escaping, profile histories, Q&A quality/context, score rings/stripes, update states, empty inventories, file validation recovery, reference assets, and exact emitted nested token dependencies. Trace checks cover 27 configurations, 23 source patterns and 23 interaction contracts. Existing atom/AI/Card checks remain dependencies.

No browser/server was started. These checks establish markup, data/state and token contracts; pixel appearance and assistive-technology behavior remain unverified.
