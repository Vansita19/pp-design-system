# Pitch Protocol Inbox table

The Data table component exposes **Chat** and **Inbox**. Inbox uses the current local Pitch Protocol table as its source. Its surrounding application filters are intentionally omitted from the table specimen, as requested. The source app is unchanged.

## Source evidence

Read from `/Users/vansitaaddanki/pp-admin/investor-preview/`:

| Source | Reused contract |
| --- | --- |
| `workspace.js`, `inbox()` | Selection, Company, Industry, Stage, Score, Recommendation, Submitted, Actions; page range and Previous/Next controls |
| `styles.css`, final Inbox overrides around lines 5476–5585 | 40px header, 52px body rows, 14px text, 16px horizontal cell padding, 0.5px border, 16px table corners |
| `styles.css`, `.company-link .avatar` and final Inbox overrides | 28px company marks, 10px gap, 10px mark corners |
| `styles.css`, shared selection toolbar around line 6112 | Floating selection toolbar with clear selection, Add to list, decisions and removal |
| `data.js` and `application-fixtures.js` | Twelve source company records, including Luma Ledger, Kestrel Lens, Joymore, CREE8 and Fable Metrics |
| `inbox-actions.js` and `app.js` | Local decision changes, reversible removal, page clamping and selection of the current page |

The source's later nth-child width/centering rules refer to an older Stage/Score order. This composition gives Stage the wider column and centers the named Score column, rather than carrying over that mismatch. Source rows are adapted to our named semantic tokens, shared badges, checkboxes, dialogs and Hugeicons Stroke Rounded icons.

Recommendations compose shared **Badge → Status neutral**: white surface, dark 14px/22px label, 8px colored dot, 27px height, a naturally round 16px radius, 0.5px neutral border and the source's final subtle 1px shadow. Personal decisions use **Status subtle**: 26px height, 8px radius, pale shared tone, dark label and a 14px Hugeicons Stroke Rounded CheckmarkCircle02, View or CancelCircle icon. Stage tags use **Category**, with the source's 26px height and 14px/22px text. These proportions and ordinary CSS radius choices live in the Badge contract, not table-specific overrides. Compact raised tags and citations retain their own geometry.

Chat table corrections live alongside this work: Description receives the source's 28px start padding, and selectable rows keep their checkbox inside the sticky Company cell. Chat row heights remain 44px, or 36px in compact mode. The former duplicate Standard appearance now resolves to Chat.

## API

```js
F.pitchTable({
  variant: 'inbox',
  header: true,
  selectable: true,
  pageSize: 5,
})
F.pitchTableTokens({ variant: 'inbox', selectable: true })
F.wirePitchTable(root, registerCleanup)
```

`header` and `selectable` default to enabled for this variant when omitted. The organizer's Data table configuration may explicitly override them. Inbox keeps its source row height regardless of the chat density setting. `rows` can supply a different set of records. IDs must be stable and unique. Legacy `searchable` and filter options do not add toolbar controls to this specimen.

`F.pitchFilterBar()` and `F.pitchFilterTokens()` remain separate reusable helpers; the table does not render them or claim their tokens. A consumer that uses the separate filter helper supplies its own change handler and calls `F.enhanceSelects` for authored controls.

`F.createPitchInboxState()` is the deterministic state contract used by both rendering and interaction checks. It returns snapshots and operations for searching, filtering, sorting, pagination, selection, decisions, removal, undo and reset. The implementation does not depend on persistence or a backend.

## Interaction behavior

- Records start ordered by Score; the header states the descending sort.
- Select-all affects only the current page. Selections remain selected when moving between pages. The select-all control shows a mixed state for a partially selected page and is disabled with no rows.
- Bulk actions mark selected companies Interested, Watching or Passed, or remove them from this preview. Undo restores the last mutation. Reset preview restores the original rows and selection.
- The ellipsis opens the source company-action dialog (`app.js:606–608`), containing **Open company application** and **Add to list**. Decisions remain in the selection dock. The dock also has its source Add to list button.
- Company identity uses a real link when the row has an explicit validated HTTP(S) `href` or a known non-synthetic source fixture ID. Unknown/synthetic IDs remain text and their Open company action is disabled. Source fixture links open the PP application in a separate tab, with `noopener noreferrer`. The same identity contract is reused in Chat.
- Unopened rows have the source 5px blue dot and medium-weight label (`styles.css:4727–4728`). `opened: true` or `unopened: false` hides it. Following the company link updates this local review state; Reset restores it.
- Page numbers clamp when data changes. Empty results use a short empty message. Live status messages announce paging, selection and mutations.
- Add to list opens the existing Collection workspace membership component inside a native dialog, with searchable lists, mixed checkbox state and local list creation. Escape/close returns focus to the initiating control. Replacing or closing dialog content disposes the embedded controller, and unmount removes all owned listeners.
- Replaced rows retain their shared badge radius through ordinary CSS; they do not mount corner painters or corner resize observers.

## Integration isolation

Inbox is marked `[data-pitch-inbox]` and deliberately does not use `.pp-table`, while Chat uses its dedicated `[data-pitch-chat-table]` controller. `F.wirePitchTable` can run before or after `F.wireMenus`; it cleans existing row menu bindings before replacing its body.

The preview uses a stable page size (five by default, clamped to 1–20) instead of the full app's viewport-dependent page sizing. Filter/search toolbars and status tabs remain separate compositions. List membership is embedded from the shared Collection workspace helper, and company routing uses explicit source links. No live companies, decisions or lists are modified.

## Verification

`node checks/pitch-patterns.cjs` covers Chat plus 12 Inbox render configurations, source geometry, named token references, escaped content, numeric sorting and simulated interaction events. It confirms filter/search controls are absent and exercises pagination, cross-page selection, indeterminate/empty selection, bulk decisions, removal, undo, reset, safe links, unread state, company-action dialogs, row/bulk membership, cancellation and listener cleanup. The state model's optional query operations remain covered independently. `checks/menus.cjs` covers the reused popup positioning and keyboard contracts.

These are local markup, token and simulated event checks. Browser visual validation was not run.

## Related standalone controls

The existing Filter bar page now contains the Inbox-derived toolbar and individual Filter, Sort and Search variants. They are independent of this table and emit criteria changes for a consuming application. The Tabs page also includes the Inbox-style counted variation: left icon, label, right count and a plain selected surface with the final source outline. See [Pitch Protocol pattern APIs](pitch-patterns.md#api).

## Integration events

- Cancelable `forma:company-open` carries `{companyId, href}` before native link navigation. A consumer can prevent the event to handle its own navigation.
- Cancelable `forma:add-to-list` carries `{companyIds}` before the shared local picker opens. Prevent the event to provide an application picker.
- The embedded picker emits its existing `forma:list-membership-change` and `forma:collection-save`; this composition adds `companyIds` to their details. These events describe local preview changes, not backend persistence.

`source-workspace.js` must be loaded before a user opens the picker; it may load after `pitch-patterns.js` because the helper is resolved on interaction. Its CSS and the existing dialog/menu CSS are reused. The Inbox token inspector includes the active membership and dialog contracts.

## Latest spacing override — 9 October 2026

[The shared rhythm](spacing-system.md) now governs table padding, company gaps and toolbar spacing: Inbox vertical cell padding and company gap are 12px. The source evidence table above records the original 10px company gap. Actual 52px rows, 28px marks, 5px unread dots, border widths and radii are retained under their geometry tokens.

The composition audit removes ineffective 28 px row-action overrides. The real source `workspace.js:115` uses `.icon-button`, whose winning global geometry is 32 × 32 px (`styles.css:151–155`). Inbox now visibly and declaratively uses the shared small icon Button at that size; shared hover, focus and radius remain the atom contract. Delete uses the supported `destructive` variant, including matching danger tokens.
