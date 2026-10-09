# Company Details compositions

`dist/detail-blocks.js` and `dist/detail-blocks.css` extract reusable compositions from the existing local Pitch Protocol source. Information block uses the evidence and source-derived question/profile compositions. Metric card owns metric grids, highlights and score meters; Timeline owns standalone employment/education history. These distinct families no longer appear as unrelated Information block types. Original PP files are unchanged. The examples use fictional content and local sample evidence, with no research, scoring, messaging, or enrichment service connected.

| Helper | Variations and controls | Source |
| --- | --- | --- |
| `F.evidenceBlock(c)` | Evidence signals; verified/pending; initially open; supporting excerpt/assessment; evidence metrics. Question uses the source Q1/category/status header, shared outer/inner shell, answer inset and complete Question context disclosure. It defaults closed. Assessment can be toggled for answered questions; no synthetic priority/confidence fields are added. | `investor-preview/detail-pages.js` citations at line 16, questions around 149, signal footer at 164, source record at 168, research at 176; `detail-pages.css` lines 46–51 |
| `F.metricCard(c)` | Metric grid with two/four columns, score, highlights; score value; footer | `detail-pages.js` application stats at 54–56 and score at 133; CSS lines 23, 29, 44 |
| `F.profileTimeline(c)` | Standalone Timeline → experience/education; Profile now renders the source Founders stack with two people and independent, initially collapsed EnrichLayer disclosures. Nested history remains a real Timeline constituent. | `detail-pages.js` timeline at 61, profile at 70; CSS founder/profile/timeline rules around 26–43 |

Each helper has a corresponding `*Tokens(c)` function. `F.wireDetailBlocks(root, cleanup)` adds optional arrow/Home/End movement between research disclosures and removes listeners when the preview is replaced. Native details/summary retain their built-in disclosure and keyboard semantics. Source citations use `F.aiCitation` and `F.aiSourceTokens` from `ai-response.js`; `F.wireAIResponse` supplies the shared anchored popover lifecycle. There is no second citation implementation.

The retained source geometry includes 16px research row spacing, a 32px source-ID rail and 44px expanded-body inset, a labelled excerpt with 12×14px padding and 8px radius, 20px metric values, a 28px-tall 100-stripe score meter, 44px profile avatars, and an 18px timeline rail. Timeline cards retain their source 20px corners. Metric grids collapse by available container width instead of the whole browser viewport. Existing shared badges replace the source's one-off status/company/count pills; existing avatar variants provide portraits and fallbacks.

Component values reference semantic or primitive tokens. Text tokens are used for text; the meter and timeline use dedicated `semantic.score.*` and `semantic.details.rail/marker` roles. The original score's computed HSL spectrum is normalized to low/middle/high semantic colors, interpolated across equal SVG stripes. Numeric values clamp to 0–100, and the visual meter exposes its value as a meter rather than a task-progress indicator.

Validation: `node checks/detail-blocks.cjs` verifies all controls, token resolution, native disclosure structure, escaped custom content, numeric meter bounds/fill counts, source citation composition, source geometry, keyboard navigation and cleanup. Browser rendering, assistive-technology behavior and visual parity have not been verified in this environment. This is a source-code adaptation, not a claim of new Figma access or pixel-identical rendering.

## Catalogue boundary and composition

The Information block question specimen reuses the source section heading, answered count, stacked question surfaces, answer treatment and context disclosure. Its profile specimen reuses the source founders section with two stacked identities and their existing enrichment panels. The original compact helper is not sufficient evidence that those whole compositions are covered.

Composition links are configuration-aware and describe atoms or families actually rendered. Information overview has no Progress component; score is a meter on Metric card, not task progress. A profile may contain Timeline, but that does not make Timeline a type of Information block. Header badges, citations, avatars and buttons appear in the composition only where that specimen uses them.

Old Information block URLs for `metrics`, `highlights` and `score` move to Metric card; `timeline` moves to Timeline; `rows` becomes a labeled List; `notes` becomes Text. An old `notifications` URL returns to the catalogue because Notifications were explicitly removed. It is not redirected to a visually unrelated card.

`F.informationEvidence(c)` wraps the unchanged signal helper in the shared information shell; its `*Tokens` function combines both contracts. Questions use radius12/padding16 for the body. Founder cards preserve radius16/padding16 and the source zero gap inside a radius12 shell with 2px inset. The seven attached reference images returned extracted text but their pixel downloads failed; geometry was checked against the live local source, not those inaccessible pixels.

## Latest spacing override — 9 October 2026

Imported padding, gaps and margins now follow [the shared scale](spacing-system.md). Information/evidence body padding is 16px. Founder, meter and timeline geometry stays source-derived; retained icon/rail/marker dimensions use `size.*`, while the 44px evidence alignment offset represents its 32px rail plus 12px gap.
