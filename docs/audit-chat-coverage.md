# Pitch Protocol conversations and response coverage
> Current catalogue disposition (9 October 2026): Note editor, Collection workspace and Company report were removed at the user’s request. Earlier coverage descriptions below are historical where they name these pages. The JSON ledger and `catalogue-removals.json` record each affected visual pattern as excluded, rather than covered or nonvisual.


Source audit: 9 October 2026. This ledger follows the live build, not old selectors or the separate chat playground. **Covered** means a reusable specimen represents the pattern; **partial** means a meaningful source composition or variation is absent; **missing** means no specimen represents the composition. In the current JSON, **excluded** means a visual composition deliberately omitted from the public catalogue at the user’s request; historical gap rows below remain unchanged. Token and Phosphor normalization are intentional. These are source findings, not browser visual certification.

Source root: `/Users/vansitaaddanki/pp-admin/investor-preview/`. Organizer paths start with `dist/`. Source files remain read-only. This retained inventory records all identified live patterns. The later user-requested bubble-only scope below supersedes the initial full Conversation template plan; visual exclusions remain explicit rather than being relabeled nonvisual.

## Reachability and ownership

`build-preview.mjs:8` bundles `app.js`; its CSS order at line 15 is styles, generated color tokens, onboarding, trace, then detail overrides. `app.js:4–27` imports the composer, list actions, save dialog, insight snapshots, projections, conversation motion and conversations. `conversations.js:1–6` imports company briefs, research, projections and search criteria. `review.js:146–181` contains a second compact company-chat panel and stacked growth chart. These render paths and later CSS overrides were inspected.

Chat-owned live modules: `conversations.js`, `composer-menus.js`, `conversation-motion.js`, `company-brief.js`, `research-activity.js`, `projections.js`, `search-criteria.js`; shared chat branches in `app.js`, `ui.js`, `review.js`, `styles.css`. Save/list bodies in `list-actions.js`, `view-save-dialog.js` and saved snapshots in `insight-notes.js`/`notes.js` are cross-owned with the workspace audit. The details audit owns `trace-ui.js`, `trace-model.js` and company updates. Data/asset modules support these renderers but are not independent component families.

## Navigation, transcript and prompt

| ID | Reusable pattern / source evidence | Organizer mapping at audit | Status and actual gap |
| --- | --- | --- | --- |
| CHAT-01 | History trigger; `conversations.js:14`, `styles.css:4393–4407` | Dropdown/Input primitives | Missing composition: icon trigger, 320px search panel, compact history links. |
| CHAT-02 | Chat breadcrumb with truncated current title and 14px chevron; `conversations.js:14`, `styles.css:4704–4713` | Breadcrumb primitive | Partial: source title is a history switcher, not static breadcrumb text. |
| CHAT-03 | History search, empty history and no matches; `conversations.js:8–12` | Combobox search patterns | Missing history variant; real source searches title, message and companies and orders by updated date. |
| CHAT-04 | Scroll transcript, 780px content lane and bottom composer; `conversations.js:190–199`, `styles.css:4421–4427,4518–4519` | Prompt bar and AI response separately | Missing Conversation template composition. |
| CHAT-05 | Right-aligned sent user bubble, 76% maximum; `conversations.js:185–186`, `styles.css:3593,4426` | No sent-message helper | Missing source 9px/9px/0/9px corners, 6×12px inset, 13px/20px text. |
| CHAT-06 | Sent tool label and file metadata; `conversations.js:186`, `styles.css:4528,4563` | Prompt attachments represent drafts | Missing readonly sent-file rows and tool context beneath sent text. Voice attachment is intentionally removed by user instruction, not a gap. |
| CHAT-07 | Pending reply reserves vertical room; `conversations.js:188`, `styles.css:4429` | `F.aiResponse({state:'thinking'})` | Partial: label exists; source transcript pending layout and dot-grid glyph absent. |
| CHAT-08 | New conversation empty prompt; `conversations.js:190–199`, `styles.css:4531–4533` | Generic Empty state | Partial: no composer-attached conversation empty variant. |
| CHAT-09 | Missing conversation with New chat link; `conversations.js:192`, `styles.css:4534` | Generic Empty state | Partial: no route-state composition/navigation link. |
| CHAT-10 | Home/conversation composer geometry and disabled/pending; `ui.js:103–104`, `app.js:282–321` | `F.promptBar` home/conversation variants | Covered; current richer mentions and dictated text follow explicit user corrections. No live AI backend is implied. |
| CHAT-11 | Context/tools menu, company/list search, active removable tool; `composer-menus.js:6–44` | `F.promptBar`, `F.wirePromptBar` | Covered with normalized accessible menus; includes @ and slash activation. |
| CHAT-12 | File draft rows, remove, picker; `app.js:675–698` | Prompt `attachments:'files'` | Visual rows/removal covered; source native filename chooser is not used by the current sample-file demo. Real upload/persistence is outside component coverage. |
| CHAT-13 | Prompt submit, Enter/Shift+Enter, pending guard and recovery; `app.js:282–321`, `conversations.js:202–246` | Rich editor + form-value sync + local submit event | UI contract covered; source timed sample response/persistence is app behavior, not an AI service requirement. |

## Answer bodies and results

| ID | Reusable pattern / source evidence | Organizer mapping at audit | Status and actual gap |
| --- | --- | --- | --- |
| CHAT-14 | Plain assistant paragraph / clarifying company suggestions; `conversations.js:24–31,74,188` | `F.aiResponse({variant:'text'})`, `F.aiFollowups` | Partial: renderer always adds citation and bullets, preventing the plain source answer composition. |
| CHAT-15 | Intro → result → follow-up sequence; `conversations.js:188` | `F.aiResponse` | Covered; suggestions are after the result, not table cells. |
| CHAT-16 | Suggestion action single/group/icon/disabled; `conversations.js:156–183`, `styles.css:4514–4517` | `F.aiFollowups`, standalone Suggestion | Covered; native actions, not persistent selected pills. |
| CHAT-17 | Base company result table; `conversations.js:89–117` | `F.pitchTable({variant:'chat'})` | Covered base schema and source table geometry; source company cell is an anchor, organizer at audit uses text. |
| CHAT-18 | Team, traction, revenue numeric columns; `conversations.js:89–117` | Fixed four-column Chat table | Missing column-set variations and associated /100, %, $ units. Table owner implementing. |
| CHAT-19 | Founder background and customer problem long-text columns; `conversations.js:89–117` | Fixed four-column Chat table | Missing wider natural table schema and generated heading/cell treatment. Table owner implementing. |
| CHAT-20 | Horizontal focusable table region and sort state; `conversations.js:113–117` | `F.pitchTable` | Covered base scrolling and score sort; sort indicators must follow additional metric columns. |
| CHAT-21 | Result title/count and compact Save List entry; `conversations.js:141–151` | Table header Save List toast | Partial: source dropdown offers static/dynamic/existing list; organizer simply announces saved. |
| CHAT-22 | Active removable criteria pills; `conversations.js:137–150` | Badge/Chip + new Filter controls | Covered by separate Filter controls family per latest user direction; do not duplicate filter toolbar in Chat/Inbox table specimens. |
| CHAT-23 | Initial five rows and load-more remaining; `conversations.js:145–151` | Fixed sample rows | Missing pagination variation; table owner implementing. |
| CHAT-24 | No matches paragraph without empty table; `conversations.js:83,142` | Empty rows produce empty table | Missing response-empty variation; should suppress result shell and keep useful suggestions. |
| CHAT-25 | Four-value statistics strip and footnote; `conversations.js:132–135` | `F.statsBar({variant:'statistics'})` via AI response | Covered with shared Stats bar implementation. |
| CHAT-26 | Comparison bars, marks, grid and labels; `conversations.js:126–130` | AI response comparison | Covered score composition. |
| CHAT-27 | Comparison team / traction / revenue scales; `conversations.js:126–130` | Comparison fixed score fixture | Missing metric-dependent labels, %, $, revenue maximum and accessible summary. |
| CHAT-28 | Result-count changes and added/reordered rows; `conversations.js:76–84,109`, `conversation-motion.js:19–58` | Generic response-reveal primitive | Partial: generic animation is not the source row/column choreography. Preserve reduced motion and pause. |

## Research, company reports and projections

| ID | Reusable pattern / source evidence | Organizer mapping at audit | Status and actual gap |
| --- | --- | --- | --- |
| CHAT-29 | Thinking 5×5 dot grid and source shimmer; `research-activity.js:16–17`, `assets/thinking-grid.svg`, `styles.css:5255–5257` | Shared `F.textShimmer`; segmented Spinner | Shimmer covered; source animated 16px dot-grid variation missing. |
| CHAT-30 | Research disclosure rail, branch, inset note; `research-activity.js:24–37`, `styles.css:4683–4703` | `F.aiResearchActivity` | Covered structural rail/native disclosures. |
| CHAT-31 | Reading → read, calculating → reported figures, drafting → drafted; `research-activity.js:33–35`, `conversations.js:217–239` | Global thinking/complete only | Partial: no stage0/1/2 distinction; source calculating label remains present after completion. |
| CHAT-32 | Research source navigation chips; `research-activity.js:33` | `F.aiCitation({variant:'chip'})` button opens record popover | Partial: reader popover is useful but not the source's company-summary anchor variant. |
| CHAT-33 | Citation/source reader popup; `detail-pages.js:16–18`, `app.js:69–106` | `F.aiCitation`, `F.aiSourcePopover` | Covered, shared with detail evidence. Plain source chat answers do not automatically contain citation markers. |
| CHAT-34 | Diligence brief outer inset, identity, 3 metrics, icon sections, action; `company-brief.js:34–40` | `F.aiResponse({variant:'brief'})` | Covered basic composition. |
| CHAT-35 | Team brief metrics: team score / founders / stage; `company-brief.js:38` | Brief focus team changes text only | Partial: incorrect static Score/Ask/Runway metrics. |
| CHAT-36 | Traction brief metrics: revenue / funding / runway; `company-brief.js:38` | Brief focus traction changes text only | Partial: incorrect static Score/Ask/Runway metrics. |
| CHAT-37 | Risk/problem icon sections and summary; `company-brief.js:11–35` | Brief risks/problem | Covered with illustrative content. |
| CHAT-38 | Meeting numbered disclosures, first open and company action; `company-brief.js:42–55` | AI response meeting | Covered general three-question layout; source also accepts company-specific four-question content. Array-driven questions can cover that without a new family. |
| CHAT-39 | Full overview: 3 stats, problem/approach, facts table, action; `company-brief.js:57–65` | AI response overview | Covered with normalized Phosphor icons and shared tokens. |
| CHAT-40 | Compact revenue metric, monthly curve, quarterly hover/focus readouts; `projections.js:12–19,60–89` | AI response revenue, `F.aiRevenueSeries` | Covered; existing numeric APIs cover rate/horizon. Source live markup has no slider or horizon toolbar to import. |
| CHAT-41 | Revenue caption with final value/rate/horizon; `projections.js:81–83` | Intro generic rate sentence | Partial copy/data contract: current intro omits computed horizon/final amount. |
| CHAT-42 | Market annular partitions, target, legend, keyboard readout; `projections.js:24–58` | AI response market, `F.aiMarketSegments` | Covered; disjoint partitions avoid double-counting target. |
| CHAT-43 | Open company navigation at report end; `company-brief.js:7` | Button emits `forma:open-record` | Visual action covered; source uses anchor. Add href configuration when a consumer supplies a destination; do not navigate the organizer to a fake record. |

## Saving, compact chat and supporting state

| ID | Reusable pattern / source evidence | Organizer mapping at audit | Status and actual gap |
| --- | --- | --- | --- |
| CHAT-44 | Save List menu: Static / Dynamic / Existing, descriptions and disabled availability; `app.js:142–155` | Table Save List toast | Missing entry menu composition. Reuse list-dialog body owned by workspace audit. |
| CHAT-45 | Existing-list membership picker, search, checked/mixed, empty/no results, New list; `list-actions.js:10–21`, `app.js:123` | Checkbox/Combobox/Modal atoms | Missing composition at audit; workspace owner handles searchable membership and naming. |
| CHAT-46 | Save type choices and naming dialog with static company stack / dynamic criteria; `view-save-dialog.js:6–31` | Modal generic form | Missing composition at audit; workspace owner handles these visuals and local form state. |
| CHAT-47 | Compact company Agent panel header/close/content/footer; `review.js:146–169` | No conversation panel template | Missing useful second layout of Conversation template. |
| CHAT-48 | Compact thought-process row, pending review text and Add to list; `review.js:164` | AI response thinking + shared Button | Partial: reusable parts exist but compact composition absent. It has no live feedback/regenerate toolbar. |
| CHAT-49 | Compact query textarea, attachment icon, labeled Send action; `review.js:167`, `styles.css:3621–3657` | Wide Prompt bar only | Missing compact composer variant; preserve real textarea/native form validation. |
| CHAT-50 | Seven-year stacked Expense / Revenue / Customers chart; `review.js:171–181`, `styles.css:3661–3750` | Comparison/revenue/market charts | Missing distinct stacked growth chart. Illustrative mixed data must remain labeled illustrative. |
| CHAT-51 | Company chat draft and scroll restoration; `app.js:227,276,457–476` | Preview state/local cleanup infrastructure | App persistence is not a new component. Preserve local draft while closing menus; clean timers/listeners on unmount. |
| CHAT-52 | Saved insight note with question, answer, timestamp, table/chart snapshots and external sources; `insight-notes.js:2–16`, `notes.js:100` | Note card generic text/table | Partial/missing specialized read-only snapshot composition; cross-owned workspace notes audit. Current chat rendering has no Save insight button. |
| CHAT-53 | Request entry, answer/result entry and follow-up fade; `conversation-motion.js:4–58` | Generic response-reveal page | Partial: source chat composition needs its own scoped enter treatment, pause and reduced motion. |
| CHAT-54 | Added-column reveal and row reorder motion; `conversation-motion.js:22–55` | Table no generated/reordered state | Partial; table owner can expose column reveal metadata, chat composition can provide scoped motion. No need for a new Motion page per row type. |

## Exclusions grounded in live code

- `chat-playground.js/css/html` are not in the live app import graph; their experiments are not extra shipped patterns.
- `conversations.js:119` contains an unused `diligence()` renderer; live briefs come from `company-brief.js` instead.
- `projections.js:21` maps retired efficiency mode to market. `valueTable()` at line 84 is not rendered by `renderProjection`; source projection input/horizon handlers do not prove a visible current toolbar.
- `app.js:726–727` has Save insight handlers, but inspected live chat markup does not emit those triggers. Saved note snapshots remain live under Notes and are audited there.
- No live assistant Copy / Regenerate / thumbs-feedback toolbar was found in the assigned modules. Do not invent one to satisfy an assumed standard. A generic clipboard helper elsewhere is not evidence of a chat-reply control.
- Intent parsers, company filtering, result persistence, simulated reply timers and external AI services are business/runtime machinery, not separate visual families. Their visible states are inventoried above.
- Trace/research-map UI belongs to the details audit; inline research activity above is a different composition.

## Initial integration priorities and status (historical)

1. Conversation template with history, sent message, empty/missing and compact company-panel variations; compose existing Prompt bar/AI response rather than duplicate them.
2. Correct existing response variations: comparison metric scales, brief metrics, plain/empty answer, staged research and source-link chips. Retain source shimmer and add the actual dot-grid indicator.
3. Extend existing Chat table with real column sets and load-more. Keep filters in the explicitly requested separate Filter controls family.
4. Save List entry menu must reuse workspace membership/naming compositions, not a second dialog implementation.
5. Use shared source row/entry motion with pause/reduced-motion support, and cover saved insight snapshots in Notes.

This is the initial gap ledger; subsequent implementation coverage is recorded below rather than silently rewriting source findings. No original PP files were changed. Browser, server and deployment checks are unavailable in this session; static contracts and simulated event checks cannot establish pixel equivalence or full accessibility conformance.

## Initial implementation closure, 9 October 2026 (historical)

`dist/source-chat.js` and `source-chat.css` now supply `F.sourceChat`, `F.sourceChatTokens`, `F.wireSourceChat` and `F.disposeSourceChat`. The single Conversation template has seven configurations: `conversation`, `empty`, `missing`, `history`, `message`, `company-panel`, `save-list`. It composes the existing Prompt bar, AI response, Chat table and workspace membership/save forms. The compact panel has its source textarea/attachment/Send composition and seven-year stacked growth chart (`F.sourceChatGrowth`). History selection emits a local event rather than navigating to invented fixture chat IDs; external consumers can connect real routes. The missing-route New chat link similarly exposes a local event.

Source sent bubbles retain 9px asymmetric corners, 6×12px padding, 13px/20px text, tool metadata and readonly file rows. The transcript has its own scroll region, 780px maximum, 32px inset and bottom composer. The company panel retains its 391px width and 18px outer corners, with responsive maximum width. Decorative asset normalization uses Phosphor; the real source Thinking dot animation is retained separately as a motion graphic. Existing palette values replace near source chart colors by purpose: expense blue400, revenue red400, customers amber400. The stacked figure is explicitly described as illustrative because its three series do not share a unit.

The Save List entry now exposes static, dynamic and existing-list paths, disabled availability, Back, and a native naming dialog. Its bodies reuse `F.sourceWorkspace({variant:'membership'|'save-form'})`; they are not a second list implementation. Source table Save List events open this composition inside Conversation. No action claims to save into Pitch Protocol; collection changes are local fixtures.

The new controller scopes history search/selection, clamped popup placement, Escape/outside dismissal, focus return, compact composer validation, plaintext sending, file names, panel reopening and cleanup to each wrapper. A WeakMap prevents duplicate wiring when composed inside Company Details; `F.disposeSourceChat` permits safe replacement. New responses and requests use the source fade/rise rhythm. Shared table events drive bounded surviving-row reorder and appended-row fades; generated-column markers receive a scoped reveal. Pausing or enabling reduced motion stops pending row animations at their final state, and unmount removes observers/listeners/animations. Automatic transcript scroll positioning from the PP app is not reproduced because the organizer shows controlled specimens rather than an asynchronous conversation service.

Existing AI response variants now include plain/empty answers, comparison metrics, corrected team/traction summary metrics, array-driven meeting questions, derived revenue captions, staged research and source-navigation chips. Details are in [ai-response-source.md](ai-response-source.md). The table owner added source column sets, load-more and semantic sort state to the shared Chat table. Filter controls stay a separate family by explicit user preference. Workspace Notes owns saved insight snapshots; Trace stays with Company Details.

`checks/source-chat.cjs` covers 28 render configurations, unique IDs/token resolution, history search/no-match/selection/clamping, repeated wiring cleanup, compact validation/IME/Shift+Enter/files/disabled, Save List menu-to-form focus, and row-motion bounds/pause/reduced-motion/cleanup. `checks/ai-response.cjs` covers the corrected response variants. No browser, local server, actual microphone, AI service or deployed URL was exercised. The initial rows above preserve the observed pre-change gaps; the machine-readable `audit-chat-coverage.json` records the resulting pattern mapping and these normalized boundaries.

The final atom-consistency review corrected the compound history-search and compact-composer focus cascade: only the enclosing field draws the focus indicator, while Send/attachment buttons retain their own shared Button focus. Native-input fallback outlines no longer add a second inner ring; forced colors use one visible enclosing outline. `checks/source-chat.cjs` contains the scoped regression assertion.

## Current public scope: Chat bubble, 9 October 2026

The user's latest instruction narrows the former Conversation page to the bubble itself. The public name is **Chat bubble**, under Molecules; `conversation` remains its stable page ID. `F.chatBubble` renders text with primary, secondary, tinted, outline and ghost appearances, start/end alignment and single/grouped arrangements. The preview, focused examples, composition and inspector do not include history, navigation, a composer, tables, response templates or save flows. These are normalized reference-informed bubble variations, not a claim that every appearance shipped in Pitch Protocol.

The original `F.sourceChat` renderers remain internal for existing Company report consumers. Company report → Panel → Chat still uses its compact Agent panel, file picker, stacked growth chart and Add-to-list menu. This is real coverage on that separate template, not a reason to restore those controls to Chat bubble. Prompt bar, AI response, Data table, AI progress, Suggestion, Stats bar, Popover and Collection workspace retain their own existing specimens.

The following source records are now explicitly excluded from the public catalogue by the user's bubble-only direction. They remain visual source patterns and their retained helpers still receive render checks:

| Records | Intentionally excluded composition |
| --- | --- |
| CHAT-01, CHAT-02, CHAT-03 | History trigger, breadcrumb switcher, history search and empty/no-match history states |
| CHAT-04, CHAT-07, CHAT-08, CHAT-09 | Full transcript/composer layout, transcript pending-height reservation and empty/missing conversation route states |
| CHAT-06 | Combined sent-tool label and readonly file metadata as a standalone message variation |
| CHAT-21 | Transcript table-to-save-menu orchestration; the standalone table still emits a save request |
| CHAT-28, CHAT-53, CHAT-54 | Full transcript entry, result, row and column choreography |

CHAT-05 now maps to the standalone bubble. CHAT-12, CHAT-44 and CHAT-47–50 map to the actual Company report chat panel. Membership and naming remain reachable in Popover and Collection workspace. The ledger records **41 covered visual patterns, 12 user-excluded visual patterns and 7 nonvisual dispositions**. A retained internal helper alone is not public coverage. The source gate checks these specific exclusions and the surviving catalogue routes; no browser appearance or assistive-technology certification is implied.
