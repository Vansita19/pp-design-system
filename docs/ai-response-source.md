# AI response templates

The AI response template documents the answer layouts already present in Pitch Protocol. It is separate from the prompt bar (the separate response-reveal primitive was removed at the user’s request). Its content is seeded locally; it does not call an AI provider, perform research, or make an investment recommendation.

## Source inventory

All source paths below are read-only references under `/Users/vansitaaddanki/pp-admin/investor-preview/`. Later CSS overrides were checked before extracting the geometry.

| Pattern | Source implementation | Organizer API / variant |
| --- | --- | --- |
| Assistant prose and introduction | `conversations.js:186` `conversationMessage`; `styles.css:4424–4433` | `F.aiResponse({ variant: 'text' })` |
| Company result table | `conversations.js:109` `companyRows`, `:145` `renderResult`; `styles.css:5241–5248` | `variant: 'table'`, composed with existing `F.pitchTable` |
| Four summary metrics | `conversations.js:132` `companyStatistics`; `styles.css:4547–4553` | `variant: 'statistics'` |
| Company comparison bars | `conversations.js:126` `comparisonChart`; `styles.css:4554–4562` | Excluded from the public AI response family at the user's request |
| Complete company overview | `company-brief.js:57` `renderCompanyOverview`; `styles.css:5732–5766` | `variant: 'overview'` |
| Focused diligence brief | `company-brief.js:11` `briefContent`, `:34` `renderCompanyBrief`; `styles.css:5267–5289`, final overrides `5311–5327`, `5362` | `variant: 'brief'`, `focus: 'risks' / 'team' / 'traction' / 'problem'` |
| Meeting questions | `company-brief.js:42` `renderMeetingPrep`; `styles.css:5433–5453`, final top-rule removal `6200` | Excluded from the public AI response family at the user's request |
| Revenue projection | `projections.js:16` `projectionSeries`, `:60` `figure`, `:89` `renderProjection`; `styles.css:4662–4676`, `5386–5389` | `variant: 'revenue'` |
| Market target / opportunity ring | `projections.js:24–58`; `styles.css:5364–5419` | `variant: 'market'` |
| Pending answer | `conversations.js:188`; `research-activity.js:17` | `state: 'thinking'`; composes the source Thinking dot grid and shared text shimmer |
| Research activity disclosure rail | `research-activity.js:25–37`; `styles.css:4683–4703` | `F.aiResearchActivity`, optionally `research: true` inside the response |
| Record chips and inline citations | `research-activity.js:33`; `detail-pages.js:16–18`; `detail-pages.css:14–16, 54–62`; `app.js:69–106` | `F.aiCitation`, `F.aiSourcePopover` |
| Suggested follow-up questions | `conversations.js:160` `suggestions`; `styles.css:4514–4517` | `F.aiFollowups`, optionally `followups: true` inside the response |
| Contextual actions | `company-brief.js:7`; table Save List from `conversations.js:149` | Shared Button instances; local selection events only |

The old efficiency/time-saved projection is deliberately represented by the market template. `projections.js:20` explicitly maps that retired mode to `market`; it is not another live layout.

## Construction and token choices

- Prose uses the 780 px conversation width, 14 px text, 24 px rhythm, and 24 px separation before structured results.
- Research rows use a 12 px vertical gap, normalized 8 px row gap and 24 px branch indent, fine vertical rule, and 8 px inset note. Disclosures use native `details` / `summary`.
- Follow-ups retain the compact 16 px radius, 6 × 12 px normalized padding, 13/18 px type, fine border, and quiet shadow. They are action suggestions, not status badges or persistent toggles.
- Overview retains its 36 px editorial content padding and three-part metric panel, while Brief retains its focused content. Their outer frames and headers now share Table’s result-card composition as requested below.
- Statistics keeps the shared four-column divided layout. Comparison and Meeting are excluded from this public family.
- The revenue card preserves a 520 px maximum, 170 px left column, 162 px desktop height, and 300 × 122 chart geometry. Monthly samples form the curve; quarterly points expose readouts on hover or keyboard focus.
- The market ring uses the source rounded annular-sector geometry and disjoint portions: outside reach, reachable but outside the target, and initial target. The target is never counted twice. Its final layout places the metric and legend below the icon/chart row.
- The source popover uses a native top-layer popover, 365 px width, 16 px corners, a half-pixel border, compact header, and viewport-clamped pointer placement. The keyboard can open it, close with Escape, and return to the triggering citation.
- All colors, geometry, typography, shadows, and shared controls use primitive/semantic aliases. Source shades map to existing readable system colors. Charts have their own semantic color roles. Hugeicons Stroke Rounded replaces the source app's mixed icon assets through the shared icon renderer.
- Container queries adapt standalone templates inside narrow preview cells rather than waiting for the entire browser viewport to shrink.

## Public API

```js
F.aiResponse({
  variant: 'text', // table, statistics, overview, brief, revenue, market, search
  state: 'complete', // or thinking
  research: false,
  followups: true,
  focus: 'risks', // only applies to brief
  company: { name: 'AsterGrid', initials: 'AG' },
  text: 'A text response.',
  suggestions: ['Compare by revenue', 'Review the evidence']
})

F.aiResearchActivity({ state: 'complete', expanded: true, sources: [{ title: 'Application' }] })
F.aiCitation({
  label: 'S1',
  triggerLabel: 'S1 · Application', // optional, independently controls the trigger text
  variant: 'chip', // or inline
  status: 'Application record',
  title: 'Source title',
  body: 'Source excerpt',
  source: 'Local prototype record'
})
F.aiFollowups({ suggestions: ['Review the evidence'] })
```

`F.aiResponseTokens`, `F.aiResearchActivityTokens`, `F.aiSourceTokens`, and `F.aiFollowupTokens` report the corresponding token contracts. `F.wireAIResponse(root, registerCleanup)` mounts source-popover and follow-up interactions wherever these helpers are composed, including evidence blocks.

`F.aiRevenueSeries` accepts numeric `baseline`, `rate`, and `horizon`. `F.aiMarketSegments` accepts `total`, `reachable`, and `target`. These pure functions clamp invalid ranges and support local template previews; no external figures are fetched.

Follow-up clicks emit `forma:followup` with `{ text }` and announce the selected suggestion. The company button emits `forma:open-record` with `{ name }`. These events let a consuming app connect real navigation and sending behavior; the organizer does not fabricate a new AI response. All displayed content and labels are escaped.

## Verification

`node checks/ai-response.cjs` exercises 42 meaningful render configurations, unique IDs, token chains, retained geometry and normalized spacing, bounded projection math, market partition totals, source-popover focus and dismissal, viewport clamping, native light-dismiss toggling, listener cleanup, and follow-up events.

No local browser, server, deployment, or external API was used. These are source and simulated interaction checks, not a visual browser certification.

## Thinking shimmer and suggestion actions

The text shimmer and assistant Thinking label now share `F.textShimmer` and `F.textShimmerTokens`. Source `styles.css:5255–5257` specifies a 90-degree gray-600 → gray-200 → gray-600 gradient, stops at 40/50/60%, a 250% background, 100% → -100% travel over 3.667 seconds, and 14px/20px medium text with -0.14px tracking. The previous organizer used a much darker gray-500 highlight and omitted the shimmer entirely from assistant Thinking. The shared helper restores that source treatment, including pending research labels. The label is ordinary readable text if text clipping is unsupported; reduced motion and forced colors explicitly remove transparent text fill and retain the readable base. Existing global/preview pause and speed controls remain in effect. The moving light band is a source-faithful decorative transient, not a claim that every animated frame meets 4.5:1 text contrast.

`F.aiFollowups({layout, label, suggestions, icon, disabled})` is the same suggestion-action molecule used by the response and its standalone page. `layout: 'single'` uses `label`; the default `group` uses `suggestions` or the three examples. `icon` defaults to true, and disabled actions neither emit nor announce selection. They are native action buttons, not selectable toggle badges; no persistent `aria-pressed` state is used. The 16px radius, normalized 6px vertical/12px horizontal padding, 13px/18px text, 14px icon, 6px gap and quiet border/shadow follow the PP response source. The source's distinct icon asset is normalized to the official Phosphor ChatCircleText icon under the one-library rule. `conversations.js:188` renders these actions after `renderResult` within the response container, so they appear below a table rather than inside table cells.

The regression check verifies shared markup, source timing/gradient declarations, supported text-clip fallbacks, reduced-motion/forced-colors text fill, suggestion composition and disabled actions. It does not establish animation visibility or browser rendering; those remain unverified while browser execution is unavailable.

The statistics response composes `F.statsBar({variant: 'statistics'})` from `card-patterns.js`, and its inspector imports `F.statsBarTokens` instead of maintaining a second four-value renderer. The existing `component.response.stat` font aliases remain compatible; the shared strip owns its layout and responsive column rules.

## Complete chat inventory follow-up

The 9 October live-module audit is recorded in [audit-chat-coverage.md](audit-chat-coverage.md). The following source gaps are now represented without creating separate pages per response type:

- Team brief metrics are Team score / Founders / Stage; traction uses Revenue / Funding / Runway. Risk/problem retain Score / Ask / Runway. `company.team` and `company.founderCount` are available for fixtures.
- `format: 'plain' | 'empty'` on text responses removes the extra intro/citation/bullets. Empty results remain a paragraph plus optional follow-ups, without a blank table. The existing `structured` default remains available.
- `F.aiResearchActivity({stage, sourceMode})` exposes `reading`, `calculating`, `drafting`, `complete`. Reading changes to Read after the first step; reported figures appear when drafting starts; the source Calculating label remains on the completed disclosure. `sourceMode: 'link'` is now the default company-record anchor pattern, while `popover` retains the useful source-reader adaptation.
- `F.thinkingGrid` imports the source 16px, 5×5 round-dot geometry and the five diagonal pulse timings from `assets/thinking-grid.svg`. It uses the existing action-primary color and shared 3.667s duration, respects pause/speed/reduced motion, and is decorative beside the Thinking status. This replaces the previously normalized segmented spinner in this source composition; the standalone Spinner family is unchanged.
- Source report actions are anchors when `company.href` is a safe supplied HTTP(S) URL or hash; absent/invalid destinations use the existing local selection event. The default fixture links to the actual PP example record in a new tab. Research source links likewise use public example-record destinations, not invented organizer record routes.
- Revenue intro text now derives rate, horizon and final value from the same bounded series used by its chart. The source has no currently rendered projection control toolbar, so none was invented.

`checks/ai-response.cjs` additionally checks both brief summaries, eight research stage/source-mode combinations, 25 dots/five pulsing dots, plain/empty output, safe action links and derived projection caption. These checks inspect rendered markup/data and simulated events; they do not prove browser appearance.

## Latest spacing override — 9 October 2026

[The shared spacing scale](spacing-system.md) supersedes arbitrary source padding, margins and gaps. Research uses 8px between icon and text and a 24px branch indent; follow-ups use 6×12px padding. Chart columns, row/bar sizes and projection geometry retain their values under `size.*`. Chart-axis alignment derives from its label/control width plus the shared gap.

## Compact activity update · 9 October 2026

The current compact activity, message actions and Search response extension supersede the older expanded research-note anatomy described above. See [Compact AI patterns](compact-ai-patterns.md) for the exact reference mapping, local event behavior and verification limits. The eight retained response variants include Search. Comparison and Meeting have been removed from the public renderer, controls and All states.

## AI response family cleanup — 9 October 2026

The supported types are Text, Table, Statistics, Overview, Brief, Revenue, Market and Search. Plain and Empty remain Text layouts. Comparison (including Team, Traction and Revenue comparisons) and Meeting are excluded from public controls, renderer branches and All states; the original source files remain read-only. Existing unknown variant input uses the ordinary Text fallback.

Statistics, Overview and Brief now compose the same shared result header and outer frame as Table. `F.resultCardHeader` supplies the 20px blue icon tile, 14px Hugeicons grid mark, title and optional metadata; shared table aliases own inset, border, outer/inner radii and header spacing. Statistics retains “Workspace opportunities” and the shared four-value strip. Overview retains its narrative, facts and company action. Brief retains its focus-specific metrics and content. This is the user's requested normalization of the original distinct shells, not an exact claim about their old source frames. Revenue, Market and Search retain their layout.

Follow-up pills now immediately follow the response body with a 16px separation. The hover/focus message-action row follows the pills, so its reserved height no longer adds a blank band between text and suggestions. Copy, feedback, retry and follow-up event behavior remain intact.

The family check covers all eight variants, removal of retired controls/renderer branches, shared card-header/token composition, pill/action order and retained source/interaction contracts. Catalogue matrix, spacing, icon and standards checks supplement this. Rendered appearance remains unverified; no browser or server was used.

Projection chart sizing targets only the direct chart SVG and the SVG inside its figure. The 16px header glyph keeps its own dimensions rather than stretching to fill its 28px surrounding tile; its small-icon stroke remains 1.25px.
