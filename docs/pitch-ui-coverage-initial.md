# Pitch Protocol UI coverage and disposition

Audit snapshot: 8 October 2026. Updated with the selected implementation after the user requested minimal scope. This is an inventory of reusable visual patterns, not a proposal to reproduce every screen or business workflow. Source and simulated-event integration checks pass; no browser-perfect or accessibility-conformance claim is made.

## Selected implementation

The existing families absorb these additions. **AI response is the only new visible catalogue page**; source helpers and compositions do not each become another navigation item.

| Source pattern | Current destination | Disposition |
| --- | --- | --- |
| Home and conversation composer | **AI prompt bar** replaces the old composer specimen | Source-derived home/conversation shapes, modes, file/voice examples and `@`/slash suggestions. Local preview behavior; no upload, recording or AI backend claim. See [prompt-bar-source.md](prompt-bar-source.md). |
| Assistant answers | **AI response**, a new Template | Nine variants: text, company table, statistics, comparison, overview, brief, meeting, revenue and market. Includes source citations, research rail and follow-up prompts using shared components. See [ai-response-source.md](ai-response-source.md). |
| Inline source citation and excerpt | **Popover → Source** | Reused by response and detail compositions; inline/chip triggers, not a separate citation page. |
| Research activity | **AI progress → Research** | Expanded/collapsed activity and complete/thinking states reuse the response helper; no separate research page. |
| Start-here suggestions | **Card → Prompt** | Discover, research and meeting intents; single/group layouts. No extra home template or prompt-suggestion page. |
| Evidence, question, metrics, score, highlights, profile and timeline | **Information block** variants | Extend the existing information family and reuse badge/avatar/popover contracts. Assessment score uses meter semantics. See [detail-blocks-source.md](detail-blocks-source.md). |
| Inbox table and surrounding controls | **Data table → Inbox**, embedded shared filters | Source row/header proportions, filters and removable criteria, selection toolbar, paging, local decisions, delete and undo. The sample state stays inside the preview. See [inbox-patterns.md](inbox-patterns.md). |
| Chat table source corrections | **Data table → Chat** | Checkbox is inside Company, preserving the sticky identity column; Description uses the source 28px inset. Chat and Inbox keep separate geometry contracts. |

All other source inventory below is **deferred until a real need arises**, unless marked covered by the selected integration. It is not a commitment to implement all 27 earlier gaps. The detailed searchable property picker, membership/access workflows, settings/onboarding/editor screens and alternate business tables are not implied by the selected table additions.

## Evidence and scope

Source root: `/Users/vansitaaddanki/pp-admin/investor-preview/`. The canonical build is `build-preview.mjs:7–15`: `app.js` bundled into `preview.html`, with `styles.css`, generated color-token CSS, `onboarding-system.css`, `trace.css`, and finally `detail-pages.css`. The current preview contains the patterns cited below, including the latest 52px Inbox row rule. Standalone experiments, `chat-playground`, video artwork, and Figma export galleries do not establish canonical app coverage.

Organizer comparison: `dist/catalogue.js`, `dist/previews.js`, `dist/pitch-patterns.js/.css`, `dist/menus.js`, and current supporting component modules. Source paths below are relative to the PP root; organizer paths begin with `dist/`. No PP source was changed during this audit.

“Covered” means the component family is available, not that every possible source variant exists. “Partial” means some relevant composition is absent. “Missing” means the source composition has no dedicated reusable specimen. “Normalized” means intentionally adapted to our tokens, behavior and Phosphor icons; it is not a pixel-identical claim. Deferred entries retain their original source evidence so a future request can be scoped without another full inventory.

The selected composer, response, detail and table modules have their own source notes linked above. This document tracks where they belong, rather than repeating their implementation contracts.

## Existing coverage

| Family | Snapshot | Existing destination and qualification |
| --- | --- | --- |
| Buttons, links, icon buttons, joined groups | Covered, normalized | Button page. Softer destructive/success fills and underlined links are intentional user-requested departures. |
| Inputs, textarea, field label/help/error | Covered, normalized | Input, Textarea, Form field. Source shape plus the common token/state system. |
| Checkbox, radio, switch | Covered, normalized | Own implementations using the requested shadcn visual direction; switch animation tracked separately. |
| Badges, icon badges, removable/selectable chips | Covered, normalized | Shared Badge and Chip / pill contracts. Do not restore inconsistent old source pills. |
| Avatar, placeholder, initials, image, groups | Covered, normalized | Avatar and Avatar group; person/profile compositions now reuse these in Information block. |
| Custom select, searchable combobox, action menu | Covered, normalized | Select, Combobox, Dropdown menu. The hidden native selects used by form/filter backing data are enhanced by `F.enhanceSelects` in `dist/previews.js:88`; they do not expose macOS menus in the rendered preview. |
| Popover, tooltip, disclosure | Covered, normalized | Popover now includes the Source variant; Tooltip and Accordion remain shared families. Source-specific access pickers and companion panels stay deferred. |
| Summary/Details segmented control | Covered, source geometry with normalized tokens | Tabs. Source `styles.css:5826–5827,5873–5875`; 148×32px track, 84/64px segments, 8px corners, layered selected shadow. |
| Briefing information surfaces | Covered, source geometry with normalized content | Information block retains its original types and now includes evidence, question, metrics, score, highlights, profile and timeline. Source `detail-pages.js:20–47` and `detail-pages.css:10–25,41–42`; selected extensions documented separately. |
| Chat company table | Covered, source corrections implemented | Data table / Chat now keeps selection within the sticky Company cell and the Description inset at 28px. |
| Modal, confirmation, overlay drawer | Covered, generic/normalized | These do not yet represent all the source dialog bodies or its inline companion panel. |
| Alert, toast, progress, skeleton, spinner | Covered, normalized | Reuse their shared tokens in the missing compositions. |
| Basic upload, empty state, chart, stepper | Covered, generic | Semantic score and profile timeline are now Information block variants; standalone file inventory and further empty-state compositions remain deferred. |
| Form/settings templates | Covered, generic | The existing form and settings samples are not full coverage of PP's invitation, permissions, criteria, or integration patterns. |
| Grids and responsive navigation geometry | Covered, partly extended | Preserved desktop source widths; explicit responsive extension. A geometry diagram is not a navigation component implementation. |

## Source inventory — table, form and data compositions

Unselected rows are deferred references, not a ranked implementation queue.

| Pattern | Snapshot | Concrete source evidence | Recommended destination and variants |
| --- | --- | --- | --- |
| Inbox data table | Selected integration | `workspace.js:84–128`; latest `styles.css:5484–5485` | **Data table → Inbox** now covers company/industry/stage/score/recommendation/date/actions, selection, empty results and paging. Header 40px; rows 52px. See the selected scope above; not every source embellishment is reproduced. |
| Saved-view / team / key table rows | Missing source variants | `view-builder.js:51–57`; `workspace.js:218–223` | Extend **Data table**, using shared column composition rather than three new pages. Cover title+description, type, numeric count, date, visibility avatars; person+email+role+status; masked key/prefix/status/date/action. |
| Benchmark table | Missing | `view-builder.js:67–82`; `styles.css:5983–6011,6149–6150,6331–6332` | **Data table → Benchmark**: frozen company/score region, horizontal metric columns, numeric sorting, clickable metric explanation, supported/unknown/not-supported cells, optional selection. Preserve source table geometry without duplicating business scoring. |
| Filter picker and active criteria | Selected simpler composition; advanced picker deferred | `inbox-filters.js:30–44`; `workspace.js:92–124` | Shared **Filter bar** now covers search, stage/round/recommendation filters, sort and removable active criteria. The two-stage searchable property/value picker with counts remains deferred. |
| Bulk selection toolbar | Covered within Inbox | `list-actions.js:5–8`; `styles.css:6101–6108` | Selected count, clear, local decision actions, delete and undo live within **Data table → Inbox**. No standalone toolbar page; broader saved-view/membership actions remain deferred. |
| Searchable list-membership picker | Partial | `list-actions.js:10–21` | **Combobox / Popover → Membership picker**: list icon, label, description/count, checked/mixed/unchecked membership, empty search, Create new footer action. It is richer than the current plain combobox options. |
| Person/access picker and sharing dialog | Missing composition | `notes.js:109–117`; `app.js:587–590`; `view-builder.js:182–185` | Reuse **Combobox + Avatar + Checkbox** in a **Sharing** dialog specimen: person name/email, all-team option, selected people, read-only access list, grouped avatar trigger. Use our custom Select, not the source native visibility select. |
| Repeated invitation field | Missing | `onboarding.js:24–25,98`; `app.js:813–822` | **Form layout → Invitations**: leading person icon, email field, role select, remove action, Add another, field error, disabled/read-only. Reuse field/select tokens and preserve source row composition. |
| Compound range/currency field | Missing | `onboarding.js:82–91`; `onboarding-preferences.js:13–26` | **Form field → Range pair**: currency selector, minimum/maximum number fields, No preference checkbox that disables both values, group-level validation. Do not model this as a slider when the source uses exact numeric entry. |
| Settings definition rows | Partial | `workspace.js:176–217,226–230`; `account-flow.js:5` | **Settings layout**: icon+label / value or chips / optional action; description+control row; multi-line preference row; editable form section; danger section. Keep label/value alignment and dividers from PP. |
| Copyable value/code field | Missing reusable composition | `integrations.js:26`; `app.js:1042–1044`; `workspace.js:219` | **Input or Form field → Copyable value**: read-only URL/code, trailing Copy action, copied feedback, overflow wrapping/truncation, masked/revealed key option. No real secrets in samples. |
| File inventory row and preview states | Partial | `review.js:132–157`; `ui.js:9–14`; `styles.css:4356–4372`; `file-store.js:8–16` | Extend **File upload** or new **File list** block: document/sheet/deck thumbnail, filename/type/date, open/remove actions, uploading/ready/unavailable; preview body for text/image/unsupported. Existing dropzone alone does not cover this. |

## Source inventory — other compositions

| Pattern | Snapshot | Concrete source evidence | Recommended destination and variants |
| --- | --- | --- | --- |
| Sidebar navigation and profile menu | Missing specimen | `workspace.js:28–60`; `styles.css:5778–5789,5862–5869` | **Navigation** block: expanded/collapsed, selected item, count, section label, fund identity, profile trigger/menu. Keep source behavior and 248/80px geometry. The organizer's own navigation must remain separate. |
| Detail header and tool rail | Partial | `review.js:29–44` | **Navigation → Detail header/rail**: breadcrumbs, previous/next controls, centered segmented control, actions; vertical tool rail with active state. Extend Breadcrumb and Tabs through composition. |
| Inline companion panel | Missing distinct type | `review.js:146–169`; `styles.css:977–1004,3560–3567` | **Drawer → Inline panel** or **Side panel** block: fixed-width source shell, header/title/actions, scroll body, optional sticky footer. Existing 400px modal overlay drawer is a different pattern from PP's 391px in-layout panel. |
| Choice card | Missing | `view-save-dialog.js:11–15`; `styles.css:6070–6078` | **Card → Choice** or **Form field → Choice card**: leading illustration/icon, title, description, supporting count, trailing chevron, selected/disabled. Reusable beyond static/dynamic list wording. |
| Save/create dialog compositions | Partial | `view-save-dialog.js:26–28`; `app.js:58–67` | **Modal → Create/save**: optional hero region, explanatory copy, selected-avatar summary or criteria summary, named field, footer/back action. Generic Edit details modal is insufficient coverage. |
| Decision dialog / action choice | Partial | `app.js:380–391,611–633` | **Confirmation dialog / Modal**: choice list with current marker; optional vs required reason; scheduling/link step; destructive confirmation. Use preview-only sample actions and current soft intent tokens. |
| Integration/setup card | Missing | `integrations.js:8–10,11–28` | **Card or Accordion → Setup**: app mark, title/description, collapse control, copyable URL, numbered instruction timeline, client tabs, code/information notice. No external service setup is required in the specimen. |
| Founder/person profile and timeline | Selected integration | `detail-pages.js:61–71,93–104`; `detail-pages.css:26–29` | **Information block → Profile / Timeline** covers identity, biography and dated experience/education using shared avatar, badge and link atoms. |
| Contact / identity strip | Missing | `summary-components.js:11–19,36–51` | **Information block → Contacts**: icon/avatar, label, linked value, optional secondary role. Add compact avatar+name+role link variant to Chip only if it preserves link semantics. |
| Metric tiles and semantic score meter | Selected integration | `detail-pages.js:51–56,123–138`; `detail-pages.css:23` | **Information block → Metrics / Score** covers reusable metric composition and a semantic score meter. Larger statistics/revenue/market presentations live in **AI response**. |
| Note card and stack | Missing | `notes.js:25–41` | **Card → Note**: title/content preview, text/image/table thumbnail, company identity, date, author avatars, optional stacked-note preview. The note editor itself is a template, not a new atom. |
| Notification / activity row | Missing | `notes.js:69–80`; `company-updates.js:62–87` | **Activity feed** block: actor avatar/icon, event title, timestamp, unread indicator, grouped timeline, before→after change, source action, empty category; avoid proliferating one page per event type. |
| Rich note/editor template | Missing | `notes.js:90–116,120–134` | **Templates → Editor**: contextual header, share trigger, title/body, attachment, note discussion with mentions. First document its constituent patterns; do not recreate persistence or permissions backend. |
| Auth/onboarding split template | Missing | `onboarding.js:93–99`; `onboarding-system.css` | **Templates → Onboarding**: invitation, workspace, preferences, team; form + contextual preview. Keep as a composition of shared controls, not an extra component family for each step. |

## Source-faithfulness findings and disposition

1. **Implemented: Inbox is distinct from “standard”.** `dist/pitch-patterns.js` now dispatches to `F.pitchInboxTable`; Standard remains a simpler chat-schema variant. Inbox has its own source-derived columns and interactions.
2. **Implemented: chat selection stays inside Company.** The renderer now follows source `styles.css:6112–6115`, keeping the identity column sticky rather than freezing only a separate checkbox.
3. **Implemented: Description uses 28px.** `component.table.descriptionPaddingX` and the scoped column rule match PP `styles.css:5262` without changing other cell padding.
4. **Implemented: table geometry is family-specific.** Chat retains 13px text / 40px header / 44px row (`styles.css:4442–4446`); Inbox uses 14px header / 40px header / 52px row (`styles.css:5484–5485`). The older `DESIGN-SYSTEM.md` 59px Inbox guidance is stale relative to the canonical CSS/build.
5. **Deferred: inline side panel is not an overlay drawer.** The organizer's modal 400px overlay and PP's in-layout 391px companion panel are different patterns. Keep the current overlay intact; add an inline composition only when requested.

The segmented control and information-block surface geometry already closely follow source. Small border/color differences that resolve through the shared semantic system, Phosphor substitutions, and the user-requested unified badge/checkbox/button designs are intentional normalization—not audit failures.

## Verification and future changes

The selected variants are implemented in source; the final combined checks and package build are in progress. Their configuration, effective token references, composed atom dependencies, keyboard behavior and cleanup must agree. Browser appearance, assistive technology, zoom and touch verification remain outstanding.

Future work should start from a concrete project need, reuse an existing family where possible, and retain source/normalized distinctions. The deferred inventory does not authorize additional features. Follow [the maintenance rulebook](design-system-maintenance.md) when a deferred pattern becomes relevant.
