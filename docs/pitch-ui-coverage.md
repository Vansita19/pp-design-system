# Pitch Protocol UI coverage

Audit date: 9 October 2026. This supersedes the earlier selective implementation. The live build starts at `app.js`; its local import graph contains 53 modules. Reusable visual patterns identified in the companion ledgers are mapped to shared components, focused variations or composed templates, with explicit user-requested catalogue exclusions for Notifications, full conversation compositions, Company report, Collection workspace and Note editor. Evidence Trace is also temporarily hidden at the user’s request; its implementation remains for later improvement. The original Pitch Protocol source is read-only.

The retained source inventory has **53 live modules, 239 visual-pattern records, 29 nonvisual dispositions and 308 source references** across five ledgers. Of the visual records, **114 remain mapped and 125 are deliberately excluded from the public catalogue at the user’s request**. These are audit records, not separate navigation pages. The family reorganization adds Metric card and Timeline and narrows Conversation to Chat bubble; the latest source gate records their reachable configurations. Earlier counts in [the verification record](verification-2026-10-09.json) describe the pre-reorganization build.

## Inventory and destinations

| Source area | Organizer destination | Detailed ledger |
| --- | --- | --- |
| Home, Inbox, filters, lists, saved views, sharing and notes | Card, Data table, Filter controls, Tabs and Popover; collection/editor compositions excluded | [Workspace and notes](audit-workspace-coverage.md) |
| Prompt, sent messages, thinking, research, responses, projections and save-list surfaces; full transcript/history explicitly excluded | Chat bubble, AI prompt bar, AI response, AI progress, Text shimmer, Suggestion pills, Stats bar; company chat panel excluded | [Chat and response](audit-chat-coverage.md) |
| Company summary, all report sections, teams, scorecards, Q&A, source evidence, files and updates | Information block, Metric card, Timeline and Evidence trace; full Company report excluded | [Company details](audit-details-coverage.md) |
| Navigation, account, workspace settings, invitation, access, onboarding, connector setup and contextual dialogs | Navigation, Form layout, Settings layout, Modal, File upload and Account flow | [Shell and account](audit-shell-coverage.md) |
| Repeated controls, tables, pills and card geometry | Existing atom/molecule/block families and their configuration-aware token contracts | [Shared patterns](audit-shared-coverage.json) |

The JSON companions record the final implementation disposition and exact source references; the Markdown ledgers retain initial findings and final integration notes. `checks/full-source-coverage.cjs` checks the source/module inventory, registered helpers, rendered configurations and absence of unexplained visual gaps. Older selective decisions are retained only in [the historical snapshot](pitch-ui-coverage-initial.md).

## Organization

Distinct compositions have dedicated pages: Metric card, Timeline, Evidence trace, Navigation and Account flow. Subpatterns use the existing families: notes remain Card variations; membership/sharing remain Popovers; advanced criteria remain Filter controls; source dialogs stay under Modal; settings and invitation rows stay in Settings layout. Data table has only Chat and Inbox. Chat column sets are variations of Chat, not a third “Standard” table.

Information block is restricted to its related content anatomy: overview, stacked, table, list, text, comparison, evidence, question and profile. The list configuration covers labeled and plain items, with optional dividers; it does not duplicate a Rows type. Comparison supports an optional heading shell. Metric grid, highlights and score belong to Metric card; Timeline is independent. Notifications have no public catalogue specimen. Existing helper consumers and old links are handled explicitly rather than leaving stale selectable variants.

Chat bubble is a focused Molecule with text, appearance, alignment and grouping controls. Its stable page ID remains `conversation`. Full transcript/history/empty-route layouts and their composed motion are explicitly excluded; tables, prompt bars and navigation do not belong on this page. Company report and its chat/save-list panels are now explicitly excluded alongside Collection workspace and Note editor. Their internal source helpers remain only for provenance and shared dependencies. Do not count dormant helpers as public coverage.

Every page keeps Overview first and All states second. Focused sections start with their specimens. The dark organizer is separate from light Pitch Protocol specimens. Branding, assets and website remain inactive; Motion tokens and Layers remain hidden. Covers use the supplied official Hairline engine and detailed physical scenes.

## Retained and normalized

Source geometry, hierarchy, spacing, column anatomy, icon placement and meaningful states are retained where compatible with accepted choices. Source colors map to the nearest purpose-appropriate palette aliases; icons use the bundled Phosphor set. All corners use ordinary CSS border-radius; status capsules remain round. Source Inbox checkbox geometry is the canonical checkbox. Inspector values display named token references.

Backend authentication, network requests, durable investor-data writes and service credentials are not copied into the organizer. Forms and state changes operate on isolated sample data and label their local result accurately. File/voice capabilities depend on browser support; they do not imply a server integration.

## Verification limits

Source, token, rendering and simulated-event gates cover the implemented contracts. They do not establish visual parity in a browser or full accessibility conformance. Browser, touch, zoom and assistive-technology checks remain unperformed under the current session restrictions. Previously documented light-boundary contrast limitations remain explicit. No deployment is implied by a rebuilt local package.
