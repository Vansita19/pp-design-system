# Pitch Protocol company Details coverage audit
> Current catalogue disposition (9 October 2026): Note editor, Collection workspace and Company report were removed at the user’s request. Earlier coverage descriptions below are historical where they name these pages. The JSON ledger and `catalogue-removals.json` record each affected visual pattern as excluded, rather than covered or nonvisual.


Audited 2026-10-09 against the active local source, not screenshots. This is a component-by-component inventory, including Summary, all seven report tabs, company side panels, Trace, and Updates. It supersedes the earlier selective-coverage interpretation for these areas. It does not claim visual browser verification.

Source root: `/Users/vansitaaddanki/pp-admin/investor-preview/`. Organizer references below are relative to this repository. Source files were read only. Source `build-preview.mjs` appends `detail-pages.css` after the base stylesheet; later source rules must win when extracting geometry. `detail-samples.js`, `detail-report-data.js`, and company records supply values, not additional visual component families.

**Covered** means a reusable organizer renderer exposes the meaningful visual anatomy/state. **Partial** means atoms or a simplified renderer exist but the source composition or a meaningful variant is absent. **Missing** means the source pattern has no corresponding implemented renderer. A generic Card, Accordion, Badge, or Chart is not sufficient evidence of coverage. Statuses are a snapshot before implementation of the gaps below; implementation can be proceeding concurrently.

## Shared report primitives and Briefing

| ID | Source pattern and exact evidence | Organizer match | Baseline status | Smallest coherent next step |
|---|---|---|---|---|
| D01 | Framed report section, title, tags, inset body, optional footer — `detail-pages.js:20` `card`; `detail-pages.css:1`–`8` | `dist/pitch-patterns.js:231` `F.informationBlock`; `dist/card-patterns.js:52` shared header/footer | Covered | Keep the shared information shell. Header metadata other than tags is covered separately below. |
| D02 | Raised title tags — `detail-pages.js:14` `tag` | `F.badge({variant:'raised'})` and information header | Covered | Preserve the shared tag/citation aliases and ordinary CSS radius. |
| D03 | Inline S/Q citations opening source/answer material — `detail-pages.js:16` `citations`; `:168` `detailPopover`; `app.js:72` source-popover lifecycle | `dist/ai-response.js:69` `F.aiCitation`, `:65` `F.aiSourcePopover` | Covered | Both record types fit the record API. Rich prose integration is a separate gap. |
| D04 | Multi-paragraph report prose containing inline citations — `detail-pages.js:19` `prose`; used throughout all report tabs | `F.informationBlock` calls `E(text)`/one paragraph; `F.stackedInformation` does the same | Partial | Add a safe structured paragraph/citation renderer shared by report variants; do not accept arbitrary HTML. |
| D05 | Quiet empty-value message inside a report card/table — `detail-pages.js:15` `empty`, `:45`, `:109`, `:151`, `:181` | Generic Empty State exists; report bodies have no explicit empty mode | Partial | Add empty content to Information block; use the same muted text instead of a new illustrated page. |
| D06 | Company Overview sections and blue Overall assessment inset — `detail-pages.js:43`; `.dp-assessment` | Information block `overview`, filled `note-filled`, darker heading/blue body | Covered | Preserve corrected 12px filled icon in 20px column, body/heading roles, source radius. |
| D07 | Bull/Bear paired case columns with aligned rows — `detail-pages.js:27` `cases` | Information block `comparison` | Covered | Citation-bearing copy depends on D04. Shared Phosphor directional markers intentionally replace literal triangle characters. |
| D08 | Label/body assessment rows — `detail-pages.js:38`–`:45` `.dp-assessment-row` | Information block `rows` | Covered | Source citations/multiple paragraphs depend on D04. |
| D09 | Open-question divided list — `detail-pages.js:46` | Information block `list` | Covered | Reuse, with rich text support from D04. |
| D10 | Notes bullet list — `detail-pages.js:47` | Information block `notes` | Covered | Reuse; this is distinct from the Note Card preview. |
| D11 | Header metadata/count/status beside title, separate from tags — `detail-pages.js:20` `headingAfter`; `:137`, `:138`, `:151` | Information headers currently expose title and tags only | Partial | Add optional structured metadata/status slot to the existing information header. |

## Application and report tables

| ID | Source pattern and exact evidence | Organizer match | Baseline status | Smallest coherent next step |
|---|---|---|---|---|
| D12 | Eight-item raise/application metrics grid, long value and caption — `detail-pages.js:54`–`:55` | `dist/detail-blocks.js` `F.metricCard({variant:'metrics',columns:4})`, accepts items | Covered | Preserve text/long-value treatment and responsive columns. |
| D13 | Investor identity inside a metric value — `detail-pages.js:55` `.dp-investor` | Metric values are escaped strings | Partial | Add optional identity value using Avatar/mark and text; no new metric family. |
| D14 | Two-column Highlights with optional prominent value and prose — `detail-pages.js:56` | `F.metricCard({variant:'highlights'})` | Partial | Existing sample is hardcoded and always has prominent values; accept items and optional values/paragraphs. |
| D15 | Unboxed editorial section: heading and report prose — `detail-pages.js:57`; `:98` How Founders Met | Stacked information supplies boxed sections only | Partial | Information block plain/section composition, sharing typography and D04. |
| D16 | Simple single-body report card (Reported Users, Unit Economics, Score Synthesis, Current read) — `detail-pages.js:58`, `:120`, `:138`, `:181` | Information `overview` can hide callout/tags but still requires a nested section heading | Partial | Permit a body-only information section; no artificial subheading. |
| D17 | Headerless label/value research table — `detail-pages.js:59`, `:107` `table`, `:111`, `:118` | `dist/card-patterns.js:61` `F.informationTable` always emits fixed two-column headers | Partial | Add optional headers and narrative/citation cells to the existing table composition. |
| D18 | Projection table: seven columns, tags and optional Key risk footer — `detail-pages.js:113` | Information table is restricted to two plain columns; Chat/Inbox tables have other fixed schemas | Missing | Add structured columns/cells to Information table, preserving the report shell/footer and overflow region. |
| D19 | Competition table: company logo/name/type tag plus cited narrative columns — `detail-pages.js:117` | Chat table has company marks, but no matching three-column report table | Missing | Rich identity and prose/citation cell types in Information table, not a separate competition page. |
| D20 | Commercial Snapshot asymmetric two-column section (1:2) — `detail-pages.js:119`; `.dp-commercial` | Information comparison and Highlights are equal columns | Missing | Add a split information composition with source 1:2 ratio and stack breakpoint. |
| D21 | Table-independent Key risk/report footer — `detail-pages.js:113`; `.dp-card-footer` | `F.informationBlock` and `F.informationTable` support footer/title | Covered | Rich cited footer text depends on D04. |

## Team, profiles and timelines

| ID | Source pattern and exact evidence | Organizer match | Baseline status | Smallest coherent next step |
|---|---|---|---|---|
| D22 | Founder header: 44px avatar, name, social link, role, multiple employment/technical badges — `detail-pages.js:98` | `F.profileTimeline({variant:'profile'})` has 44px avatar, hardcoded name/role and one Founder badge | Partial | Data-driven profile header, optional social link and badges, using existing Avatar/Badge/Button. |
| D23 | Founder bio/equity prose below the identity — `detail-pages.js:83`, `:98` | Profile has one hardcoded description | Partial | Accept biography paragraphs and optional equity metadata through the profile API. |
| D24 | Grouped founders in one report shell, repeated person dividers — `detail-pages.js:98` `.dp-founders` | One standalone profile card only | Partial | Add profile-list composition under Information block; reuse profile rows. |
| D25 | Enrichment disclosure with fetched/sample metadata, bio, Experience **and** Education — `detail-pages.js:70` `profile` | Profile disclosure shows one selected history, no enrichment bio/fetched data | Partial | Accept a profile record with both histories and metadata; keep the native disclosure. |
| D26 | Timeline title, entry count, vertical rail, role/date/description rows — `detail-pages.js:61` `timeline` | `F.profileTimeline({variant:'timeline'})` with experience/education samples and items | Covered | Keep source timeline geometry and shared inspector aliases. |
| D27 | Linked employer/institution identity chip inside timeline title — `detail-pages.js:66`–`:67` | Timeline currently emits a plain neutral Badge for company | Partial | Add linked mark/name identity chip; do not substitute plain Badge when it removes the link/mark. |
| D28 | Multi-paragraph timeline descriptions and optional missing company — `detail-pages.js:67` | Timeline tuple supports one escaped description and always creates company badge | Partial | Accept optional company and description array in the timeline item schema. |
| D29 | Research team-roster row: name, subdued role, score badge, cited explanation — `detail-pages.js:100` `rosterContent` | No equivalent profile-row variant | Missing | Add compact roster variation to the profile/information family, sharing Badge and citations. |

## Scorecard

| ID | Source pattern and exact evidence | Organizer match | Baseline status | Smallest coherent next step |
|---|---|---|---|---|
| D30 | Overall score meter: 100 stripes, score/100, footer quality — `detail-pages.js:133` | `F.metricCard({variant:'score'})` | Covered | Existing source spectrum is deliberately normalized through semantic score tokens; retain. |
| D31 | Compact evidence-statistics label/value row stack — `detail-pages.js:134` | Stats bar is horizontal; metric grid is a different hierarchy | Missing | Add vertical statistics variant to existing Stats bar or score composition. |
| D32 | Six concentric dimension-score rings with legend and numerical values — `detail-pages.js:129`, `:138` | Chart exposes only bar/line; no rings renderer | Missing | Add dimension/rings variation to Chart with accessible values and existing score/chart colors. |
| D33 | Strong–Weak spectrum key beneath dimension legend — `detail-pages.js:138` `.dp-strength-scale` | No equivalent legend scale | Missing | Include in D32, not as a separate navigation item. |
| D34 | Two-column score composition: score+statistics left, rings/legend right — `detail-pages.js:138` `.dp-score-grid` | Only separate score card and generic charts | Missing | Information block scorecard composition reusing D30–D33. |
| D35 | Five-factor conviction strip with header metadata — `detail-pages.js:137`; `detail-pages.css:145` | `F.statsBar` accepts up to eight data-driven items, but source 18px values/header geometry differ | Partial | A report-sized Stats bar variant nested in Information shell; avoid a second metrics implementation. |
| D36 | Grouped research/post-submit adjustments with signed delta, type tag, cited description — `detail-pages.js:135`; `detail-pages.css:137`–`:144` | No matching feed; generic badge/list atoms only | Missing | Information block adjustments variant, positive/negative Badge and D04. |
| D37 | Narrative-only adjustment group fallback — `detail-pages.js:135` existing-delta branch | Stacked information has title/body rows | Partial | Reuse the D36 group wrapper and D04 rather than a separate variation. |

## Questions and research evidence

| ID | Source pattern and exact evidence | Organizer match | Baseline status | Smallest coherent next step |
|---|---|---|---|---|
| D38 | Q&A heading with answered/total summary — `detail-pages.js:151` | No grouped questions/header renderer | Missing | Information question-list composition with header metadata D11. |
| D39 | Question identity, priority/required marker, answer type, answered/awaiting status — `detail-pages.js:149`–`:151` | `F.evidenceBlock({variant:'question'})` hardcodes Q1, required and Long answer; exposes only answer status | Partial | Data-driven question record with required/recommended/optional and arbitrary type. |
| D40 | Founder answer surface including answer-quality badge/red-flag variation — `detail-pages.js:151`; `detail-pages.css:65` | Existing question answer has fixed heading/prose and no assessment badge | Partial | Add optional quality badge with existing status tokens, including red flag. |
| D41 | Question context disclosure: assessment reasoning, provisional note, context, decision impact, good-answer criteria, red flags — `detail-pages.js:151` | Organizer shows sample Assessment, Decision impact and invented Priority/Confidence metric pair | Partial | Replace unsupported metrics with actual optional source fields; keep one context disclosure. |
| D42 | Unanswered question text and empty overall question set — `detail-pages.js:151` | Individual pending state present; empty group absent | Partial | Preserve pending state, add empty-list branch to D38. |
| D43 | Research-signal disclosure list with ID rail, title, taxonomy, status and chevron — `detail-pages.js:181` | `F.evidenceBlock({variant:'signals'})` with items/status/open | Covered | Use per-record status when records differ rather than global-only state. |
| D44 | Supporting excerpt inset blockquote — `detail-pages.js:181`; `detail-pages.css:51` | `F.evidenceBlock` excerpt variation | Covered | Already uses source inset, radius and type aliases. |
| D45 | Wide source citation + kind + Strength/Confidence/Importance footer — `detail-pages.js:164` `signalFooter`; `detail-pages.css:51` | Evidence footer, shared `F.aiCitation`, local wide-citation CSS override | Covered | Existing 11px/16px type and 4×7px padding override correctly distinguish it from inline S1. |
| D46 | Research introduction and current-read/changes prose sections — `detail-pages.js:181` | Basic information prose exists; page/group header not composed | Partial | Plain/stacked information content through D04/D15/D16; don't add a new report page. |
| D47 | Patterns/Contradictions bullet sections — `detail-pages.js:181` | Information `notes` | Covered | Feed real structured cited text via D04. |
| D48 | Research-gap rows with question + secondary “Where to look” text — `detail-pages.js:181` `.dp-research-gaps` | Information `list` permits one plain string per item | Partial | Add optional secondary description to the existing divided-list row. |
| D49 | Evidence unavailable and source vs founder-answer record variants — `detail-pages.js:168` `detailPopover` | `F.aiSourcePopover` accepts label/status/title/body/source | Covered | Use that API for unavailable record; no new dialog needed. |

## Summary and detail navigation/panels

| ID | Source pattern and exact evidence | Organizer match | Baseline status | Smallest coherent next step |
|---|---|---|---|---|
| D50 | Company identity header: avatar, category, stage dot/model/location, recommendation — `review.js:26` `companyHeading` | All underlying Avatar/Badge atoms exist; no matching company header composition | Partial | Compact company-header composition in existing information/template family. |
| D51 | Breadcrumb with previous/next company controls and position — `review.js:34` | Breadcrumb/Button atoms; generic breadcrumb preview lacks traversal/count | Partial | Optional traversal addon to Breadcrumb/header composition. |
| D52 | Summary/Details segmented tabs — `review.js:34` `.review-mode-tabs` | `F.pitchTabs({variant:'segmented'})` | Covered | Keep source styling. |
| D53 | Seven report tabs and optional Updates unread dot — `review.js:16`, `:32`, `:34` | Underline tabs are hardcoded Summary/Details; counted tabs are Inbox statuses | Partial | Data-driven underline tab items and optional notification dot. |
| D54 | Right tool rail with icon/label active state — `review.js:34`–`:44` | Generic sidebar exists; no corresponding compact rail variant | Partial | Add tool-rail variation to navigation, reusing library icons and active semantics. |
| D55 | Persistent side panel with heading/action/close, scroll body and optional composer footer — `review.js:146` `sidePanel` | Drawer is modal overlay; it is not this persistent adjacent panel | Missing | Add nonmodal side-panel variant to Drawer/layout family; preserve divider/adjacent layout. |
| D56 | File inventory row: thumbnail, name, type/date, preview action — `review.js:132` `reviewFiles`, `:155` | Upload file list is a different compact selected-file list | Partial | Add inventory/list variation to File upload/file family; shared thumbnails and metadata. |
| D57 | File preview with supported document/image content, unavailable message, original-file link — `app.js:704`; `file-store.js` | Generic Modal exists; no document preview composition | Missing | File preview Modal variation with supported/unsupported source states; backend storage excluded. |
| D58 | Compact company-note list row: icon/title, excerpt, author/date/privacy — `notes.js:10` `noteList` | New `F.noteCard` shows paper-card/stack; different anatomy | Partial | Add list-row variation to Note Card, sharing typography/avatar where present. |
| D59 | Company chat bubble/thinking/answer and composer footer — `review.js:160`–`:167` | AI response, AI status and Prompt bar exist | Partial | Compose compact side-panel context using existing AI components; chat audit owns detailed coverage. |
| D60 | Stacked three-series Growth Analytics chart with legend/year labels — `review.js:171` `chart` | Generic Chart only bar/line; AI comparison/forecast are other chart shapes | Partial | Add stacked-bar chart variation with three series and accessible data. |
| D61 | Summary body sections and bull/bear single-column proof lists — `review.js:50` `summary`, `:79` `summaryContinuation`; `summary-staging.js:17` | Information prose/comparison/list variants are boxed or two-column | Partial | Plain report content variant and single-column marked list; data labels are not new components. |
| D62 | Summary radar + label/value legend + six fact tiles — `review.js:52`; `summary-staging.js:6`, `:19` | Metrics exist; radar chart/composition does not | Missing | Radar variation of Chart and a summary-facts composition using metrics. |
| D63 | Linked founder pill: portrait/initial, name, muted role — `summary-components.js:11` `founderPill` | Badge and Avatar exist, but no linked identity-pill composition | Partial | Reuse linked identity chip from D27 with person shape/role option. |
| D64 | Ask and Fund Fit split: amount/round/raise and checked criteria plus match status — `summary-components.js:31` | No matching composition | Missing | Information split variant with checklist; reuse Badge and icons rather than new atoms. |
| D65 | Company/Location/Founders contact strip with colored marks and links — `summary-components.js:36` | No matching contact-strip composition | Missing | Information contact rows/strip variant using Avatar, icon, link and tokens. |
| D66 | Summary signal count/disclaimer footer — `summary-components.js:55` | Stats bar and metadata text can render values but no source footer example | Partial | Compose existing inline stats/metadata as report footer; no dedicated component page. |
| D67 | Decision aside: statistics, recommendation, explanation, action stack or saved private decision — `review.js:46` | Status badges and Button atoms exist, no summary decision card | Missing | Information decision-summary variant with initial/saved states; persistence/business decisions excluded. |
| D68 | Scheduling/reason decision dialogs (including required/error states) — `app.js:380` `openDecisionModal` | Generic Modal and Form field already expose structure/states; decision hero missing | Partial | Show one decision-form composition with existing fields; account scheduling/email behavior is application logic. |
| D69 | Summary-customization checkbox list + save footer — `app.js:728` | Modal, Checkbox and Button families cover basic anatomy | Covered | Composition example is sufficient; saved section order is application state, not a new component. |

## Trace, evidence confidence and research map

| ID | Source pattern and exact evidence | Organizer match | Baseline status | Smallest coherent next step |
|---|---|---|---|---|
| D70 | Underlined source-backed statement with contextual tooltip and counts — `trace-model.js:108` `traceText` | Inline citations and Tooltip exist, but no statement-length trace trigger | Partial | Source Popover trigger variation for traced statement plus shared Tooltip; keep citations separate. |
| D71 | Confidence glyph (High/Moderate/Low), compact icon button and labeled form — `trace-ui.js:16`–`:22` | No confidence glyph/state family | Missing | Confidence indicator under evidence/source family, using source asset geometry or normalized library treatment; confidence is not verification. |
| D72 | Source-count pill trigger — `trace-ui.js:24` | Badge/Button atoms; no source-count popover trigger | Partial | Source Popover trigger variation using shared Badge geometry. |
| D73 | Selectable finding card with independent confidence trigger — `trace-ui.js:30` `panelBody` | Generic cards cannot render this row/selection anatomy | Missing | Evidence-card variant with selected state and independent accessible confidence action. |
| D74 | Synthesis disclosure with count, nested evidence grouping, source count and “more” disclosure — `trace-ui.js:26` `synthesisCard` | Research signals are flat disclosure rows, not nested synthesis/evidence | Missing | Evidence/trace-list composition of shared disclosures and D73/D75. |
| D75 | Compact evidence card (statement trigger + confidence action) — `trace-ui.js:25` `evidenceCard` | Existing signal row is larger and has different anatomy | Missing | Compact evidence card in same source/evidence family. |
| D76 | Confidence explanation popover with status footer — `trace-ui.js:44` `showPopover` trust branch | Generic source popover has label/body but no confidence glyph/title/status anatomy | Partial | Source Popover confidence variant; don't conflate trust explanation with source verification. |
| D77 | Source list rows: tone dot, name, external indicator, available/pending/not-attached state icon — `trace-ui.js:40` `sourceList` | Source popover currently shows one record only | Missing | Source Popover source-list variation; add source availability states to shared evidence API. |
| D78 | Source detail drill-in with back action, type/status, excerpt and original link — `trace-ui.js:129` | Existing source record popover has no drill-in/back/original-link slots | Partial | Extend Source Popover with structured actions and list/detail view. |
| D79 | Research map node family: company, area+count, finding, synthesis, evidence, source link; selected path metadata — `trace-ui.js:57` `graphNode` | No graph/node renderer | Missing | One research-map template with internal typed nodes, not six new navigation pages. |
| D80 | Branching map layout, connectors, column headings/counts, collapsed lanes and Show more — `trace-ui.js:64` `renderResearchGraph` | No map composition | Missing | Same research-map template; keep graph-layout data separate from visual node tokens. |
| D81 | Map modal shell, breadcrumb, help, zoom/fit controls and pan surface — `trace-ui.js:113` `openResearchMap`, `:119`, `:150`–`:157` | Modal/Breadcrumb/Button-group atoms exist; full canvas interaction absent | Missing | Same template with bounded local sample graph, keyboard pan/zoom, focus restoration and reduced motion. No backend trace pipeline. |

## Watched-company Updates

| ID | Source pattern and exact evidence | Organizer match | Baseline status | Smallest coherent next step |
|---|---|---|---|---|
| D82 | Updates heading/unread total/Watching status plus filter tabs and mark-read action — `company-updates.js:78`–`:87` | Badge/Tabs/Button atoms exist; actual feed toolbar absent | Partial | Compose existing atoms around update feed; data-driven underline tabs from D53. |
| D83 | Month grouping and activity timeline rail with founder/research event icons — `company-updates.js:62` `updateCard`, `:87`; `detail-pages.css:87`–`:96` | Profile timeline is employment history, not this event rail | Missing | Add activity variant to Timeline/Information block with grouped dates and event-kind markers. |
| D84 | Update event header: actor/avatar, action sentence, area badge, date, unread label — `company-updates.js:69` | No activity-event header | Missing | Internal row in D83 using Avatar/Badge; no separate public atom. |
| D85 | Inset update detail with accent rail and before → after field comparison — `company-updates.js:70`; `detail-pages.css:107`–`:114` | Information rows and Alert lack source change anatomy | Missing | Information change-summary variant reused within activity events. |
| D86 | Significance prose, optional Original question disclosure, cited source/effect footer — `company-updates.js:71`–`:73` | Existing evidence disclosure/citation atoms cover parts but no composition | Partial | Extend activity item fields; reuse disclosure and source citation, preserve optionality. |
| D87 | Empty full feed and empty filtered category — `company-updates.js:87` | Generic Empty State exists | Covered | Two content states can use existing empty-state structure; keep local sample filtering/read feedback. |
| D88 | Update evidence record and unavailable record — `company-updates.js:91` | `F.aiSourcePopover` record API | Covered | Supply correct source/label/status; no new popover family. |

## Priority and implementation boundaries

1. **Complete existing report families first:** structured prose/citations (D04), header metadata (D11), plain/body-only sections (D15–D16), full report tables (D17–D20), profile/timeline data (D22–D29), and full Q&A fields (D38–D42). Without these, source content is dropped or simplified despite a superficially similar preview.
2. **Add genuinely missing report compositions:** score rings/legend/stack/adjustments (D31–D37), summary facts/contacts/fund fit/decision (D62–D67), and activity/change feed (D82–D86). Reuse existing atoms and parent pages.
3. **Add Trace as a coherent evidence template:** confidence, source-list/detail, nested evidence cards and research map (D70–D81). A source excerpt popover alone does not cover this feature's visual language. Keep trace data processing, truth/confidence computation and persistence outside the design system.
4. **Finish context layouts:** company header/traversal/tool rail/persistent panel and file rows/preview (D50–D60). These are reusable UI compositions, not copies of the complete business application. The separate chat audit owns full conversation templates and chart data semantics.

The parser-only Research headings **Resolve trace** and **Answers integration** in `detail-pages.js:176` are not rendered there and are not counted as additional missing components. Dataset labels, every company name, individual question wording, score-calculation rules, watcher permissions, network fetching, file persistence and decision notifications are not separate design-system items. Source `detailEvidence` (`detail-pages.js:185`) is an older evidence-reader helper; active `app.js` imports `detailPopover`, so it is not counted twice. `summary-staging.js:34` is similarly not evidence of an additional active visual route without a caller.

Shared atom corrections already present—including Inbox checkbox geometry, raised tag/citation aliases, true capsule recommendation badges, category pills, and the filled assessment icon—are dependencies to retain. This audit does not authorize resetting the badge palette, source card curvature, or the organizer navigation.

## Verification

Read source renderers, active CSS and organizer renderers/catalogue. Checked all seven Details tabs plus Summary/side-panel/Trace/Updates entry points. No source edits, browser/server start, deployment, or screenshot-derived claims. Coverage statuses measure implementation structure, not pixel-perfect verification. After implementation, update each row with renderer/variant and test evidence; do not mark all rows covered merely because a generic container can hold their HTML.

## Implemented audit resolution

The table above preserves the pre-implementation baseline. The current machine-readable resolution is `audit-details-coverage.json`: **88 visual patterns covered**, with **4 explicit nonvisual exclusions**. None is marked covered merely because a generic Card exists. The JSON records the actual renderer, configuration and source reference for each row.

`dist/source-details.js/css` adds 13 Company report variants: report, application, tables, commercial, profiles, roster, scorecard, questions, research, summary, updates, panel and files. `dist/source-trace.js/css` adds sidebar, map, confidence and sources variants. Original source geometry is normalized through existing palette/type/radius/spacing roles. The original decorative decision landscape is copied unchanged from PP; the PDF fixture is explicitly illustrative.

Local interactions include summary section customization, company traversal, decision save/change, update filtering/read state, nested source popovers and map exploration, persistent-panel switching, note insertion, attachment insertion and file previews. Network research, backend decision delivery, stored permissions and persistent upload storage are deliberately excluded. No source file was modified. No browser/server or deployment was started.

Validation: `node checks/source-details.cjs` renders 52 base configurations plus targeted rich-table, profile, question, scorecard, updates, summary, file and token contracts. `node checks/source-trace.cjs` validates confidence/source states, graph geometry and local interactions. Existing atom/source checks remain the dependency checks. Visual pixel matching remains unverified because browser/screenshot access is unavailable.

## Information family reorganization — 9 October 2026

The initial mapping table above is historical. Current catalogue destinations are recorded in the JSON `catalogue` fields and checked for reachability. Information block keeps overview, stacked, table, list, text, comparison, evidence, question and profile. Labeled rows and plain list items share one List variation with label/divider options; Text replaces the Notes type. Comparison has an optional shared heading shell. The question and profile entries use the full source Q&A and stacked-founders compositions rather than the earlier compact helper examples.

Metric card now groups the metric grid, highlights and score meter. Timeline is a separate family that can still be composed inside profiles. Full Company report continues to expose its original assembled sections, preserving their cited prose and source data contracts. No source records or module hashes are removed by this navigation correction, and no browser visual parity is implied.
