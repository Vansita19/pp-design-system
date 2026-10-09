# Pitch Protocol source patterns

The organizer uses patterns extracted from the existing Pitch Protocol source. This is a local adaptation of the existing UI, with shared token aliases, Hugeicons Stroke Rounded icons, and the organizer's accessible controls. The Pitch Protocol application itself is unchanged.

Latest spacing override (9 October 2026): padding, gaps and margins follow [the shared rhythm](spacing-system.md). Actual column widths, row heights, icons, radii and shadows remain source-derived geometry under their appropriate tokens.

## Source mapping

| Organizer pattern | Pitch source | Preserved construction |
| --- | --- | --- |
| Data table / Chat | `styles.css` `.chat-table-card`, `.chat-result-table`; `conversations.js` `resultTable` | 4 px inset, 16 px outer / 12 px inner corners, 40 px header, 44 px rows, company marks, paired category badges, numeric score, scrolling table |
| Segmented tabs | `styles.css` `.review-mode-tabs`, including the final “Flush Summary switch” override; `review.js` | 148 × 32 px track, 84 / 64 px segments, zero inset or gap, 8 px corners, 0.5 px selected border, layered selected shadow |
| Counted tabs | `workspace.js` Inbox status navigation; final `.inbox-page .tabs` and `.inbox-tab-indicator` overrides in `styles.css` | 32 px segments, 2 px track inset, 10 px corners, 14 px leading icons and labels, 12 px trailing counts, outline-only selected shadow |
| Filter controls | `workspace.js` Inbox toolbar; `inbox-filters.js`; final navigation control overrides in `styles.css` | 34 px controls, 10 px corners, 8 px toolbar gap, 116 px Filter trigger, Search expands from 34 to 206 px; shared authored menus |
| Information block | `detail-pages.js` `card`, `briefing`, `cases`; `detail-pages.css` `.dp-section`, `.dp-section-body`, `.dp-assessment-row`, `.dp-cases` | Gray header shell, 2 px inset, white 12 px body, 16 px normalized padding, subtle layered shadow, overview callout, label / value rows, paired comparison rows, divided lists |

References:

- [Chat table](https://pitch-investor-prototype.vercel.app/preview.html#chat/63d36e7c-c97a-4adf-a00e-31e1e9b2ea77)
- [Inbox controls and counted navigation](https://pitch-investor-prototype.vercel.app/preview.html#inbox)
- [Summary tabs](https://pitch-investor-prototype.vercel.app/preview.html#company/application-astergrid/summary)
- [Briefing information blocks](https://pitch-investor-prototype.vercel.app/preview.html#company/application-astergrid/briefing)

The web retrieval service could not render these routes. The implementation was read from the local `investor-preview` source, including later CSS overrides, rather than inferred from a generic table or card.

The supplied screenshots were also compared with these source patterns. Table examples use the local source companies and original working demo marks, showing five rows initially with a local Show more action. Signal Grove uses initials because its external image was broken in the source. Source demo marks are illustrative imagery, not identity claims: Luma uses Silo / Logosystem, Kestrel and Fable use Logoipsum, and Joymore uses the supplied company artwork.

## Consistency choices

- All component values alias primitives or semantic roles. Added source values include `color.gray.75`, `border.width.hairline`, `shadow.segmented`, and `shadow.information`.
- Table labels, body text, backgrounds, borders, and hover surfaces have table-specific semantic roles. The roles alias the shared system, so a table fill does not reuse a text color role.
- Filters and search are deliberately excluded from table specimens at the user's request. The existing Filter bar page presents the source toolbar and standalone Filter, Sort and Search variants. The reusable Filter chip remains separate; the Chat table keeps its title, action and outer/inner construction.
- Category badges use the shared **Category** appearance: the Chat size preserves the source's 18px height, 11px/16px type, 6px radius and 6px spacing between the two tags. Inbox stages use the larger 26px source size. Table actions use the shared Button component. Company marks remain the source's compact 22px treatment.
- Counted tabs preserve the source icon / label / count anatomy and final selected outline, without the earlier stacked shadow. Six segments scroll horizontally when the preview is narrower than the source 804 px track. Counts are explicit content data; the defaults correspond to the twelve unreviewed demo companies.
- Segmented tabs retain the exact source geometry and shadow. Their labels map to existing text roles; navigation is an accessible tablist with one active panel and roving focus, instead of the source's route-specific links.
- Information blocks keep the source shell/body structure with padding normalized to 16px, with readable system text colors. The blue assessment inset uses existing informational colors. Generic content can replace the example copy.
- Data tables expose only the two source families, **Chat** and **Inbox**, with optional row selection and their existing table actions. Chat retains ascending/descending numeric sorting and adds the actual source financial, team and customer-problem column configurations plus Show more. The duplicate Standard appearance has been removed; old Standard configurations resolve to Chat for compatibility.

## API

`F.pitchTable({ variant, columnSet, columns, pageSize, density, selectable, header, title, rows })`

- `variant`: `chat` or `inbox`; see [Inbox patterns](inbox-patterns.md) for that composition.
- `density`: `comfortable` or `compact`.
- Chat `columnSet`: `overview` (Company, Categories, Score, Description), `financial` (Company, Categories, Score, Revenue, Revenue growth), `team` (Company, Categories, Team score, Team background), or `problem` (Company, Categories, Score, Customer problem). These are content configurations of Chat, not additional table appearances.
- Chat `columns`: optional deduplicated array drawn from `company`, `round`, `score`, `description`, `team`, `traction`, `revenue`, `founderCredibility`, `customerProblem`. Unknown keys are ignored. The registry `F.pitchTableColumns` exposes labels, source widths and width-token names.
- `pageSize`: number of local rows revealed at a time (default five). Show more disappears when all provided rows are visible and focuses the first newly revealed row. It does not request or fabricate additional records.
- Rows accept `id`, `name`, `initials`, optional bundled `mark`, `round`, `stage`, `score`, `description`, `team`, `revenue`, `traction`, `founders` / `founderCredibility`, and `problem` / `customerProblem`. Existing source demo data provides the twelve default rows; source values are not invented when missing.
- `F.wirePitchChatTable(root, cleanup)` owns delegated selection, numeric column sorting, load-more and Save List. Sort and page changes preserve selected IDs. Optional rows and labels are escaped as text. Legacy `filters` and `searchable` options no longer add controls to a table.
- Save List emits bubbling, cancelable `forma:save-list` with `{ title, companyIds, columns }`, covering the full provided result set. The local preview announces the request; it does not claim a business record was saved. A consuming application can attach its own list flow.
- `F.createPitchTableState(config)` supplies copied snapshots and `loadMore`, `sort`, `select`, `selectVisible`. `F.pitchTableCell(row, key, config)` shares the escaped source cell anatomy with other compositions.
- Team background and customer problem use the source natural-width, horizontally scrolling sentence treatment. Revenue keeps the source `$x.xM` format, growth uses percent, score/team use `/100`. Two source fixture companies have no growth value; they display an em dash rather than `undefined%`.

`F.pitchTabs({ variant, active, counts })`

- `variant`: `segmented`, `underline` or `counted`.
- `active`: `Summary` or `Details` for ordinary tabs; `All`, `New`, `Interested`, `Watching`, `Passed` or `Off-Thesis` for counted tabs.
- `counts`: optional numeric values keyed by `all`, `new`, `interested`, `tracking`, `passed`, `off-thesis`. Counts appear after labels and remain part of the accessible tab name.
- Each instance generates unique tab and panel IDs, including in comparison matrices.

`F.pitchFilterBar({ variant, searchable, query, filters, sort })`

- `variant`: `toolbar` (default), `filter`, `sort` or `search`. `searchable: false` hides Search only in the combined toolbar. The standalone Search example starts expanded.
- `filters`: arrays keyed by `stage`, `round` and `recommendation`; unknown choices are ignored. The compact filter dialog composes the existing multiple Combobox, including its chips, option search, keyboard behavior and removal. It intentionally does not duplicate the application's eleven-property filtering interface.
- `sort`: `score`, `recency`, `name`, `team` or `revenue`; these are criteria values for a consuming application, not simulated table results.
- `F.wirePitchFilterBar(root, cleanup)` coordinates the composed controls; use it after `F.wireMenus`. Search, sort and filter changes emit bubbling `forma:criteria-change` events with `{ query, filters, sort }` and announce the current criteria to assistive technology. No table rows or counts are fabricated.
- Clear filters resets only filter choices and preserves the independent Search and Sort values. Clear search resets only the query.
- The dialog uses shared viewport placement, the top layer when supported, and a portal fallback. Escape, outside interaction and teardown close it; listeners and replacement menu instances are cleaned up. Nested menu Escape closes that menu first.
- `F.createPitchFilterState(config)` is the small standalone criteria state model. It validates options and returns copied snapshots, so a consuming app can connect it to its own data.

`F.informationBlock({ variant, title, tags, footer, ...content })`

- `overview`: pass `sections: [{ heading, body }]`; optional `calloutTitle`, `calloutText`, or `callout: false`.
- `list`: plain or labeled items share one variation. Use `labels` and `divided` for the intended content treatment; labeled data uses `rows: [{ label, body }]`, plain data uses `items: []`.
- `comparison`: pass `columns: [{ title, tone, items: [] }]`; `tone` is neutral / positive by default or `danger` for caution. `heading: false` keeps the original open comparison surface; `heading: true` adds the shared outer heading/body shell.
- `text`: plain supporting information in the shared shell, without creating a separate Notes category. The former `rows` and `notes` helper inputs remain compatibility aliases.
- List dividers and labels are options, not extra component types. Header tags accept an array or `false`. A string footer renders supporting information. Every content value is escaped; raw HTML is not an API requirement.

Core token inspectors are supplied by `F.pitchTableTokens`, `F.pitchTabsTokens`, `F.pitchFilterTokens`, and `F.informationBlockTokens`.

## Verification

`node checks/pitch-patterns.cjs` checks supported render combinations, unique tab IDs, selection/sort hooks, source column sets and cell formats, local pagination, Save List request events, escaped content, CSS token references, source dimensions and alias chains. It confirms that Chat and Inbox contain no filter/search controls, legacy Standard renders Chat, and Inbox selection, row menus, paging, reversible actions and cleanup still work. The checks also exercise all standalone control variants, criteria changes, clearing, counted-tab keyboard selection, popup placement, portal fallback and cleanup. Filter chip behavior is tested independently by `node checks/chip.cjs`. These are source checks; no local server or browser was launched for this change.

### Table identity and change hooks

Company cells use the shared identity renderer: a validated HTTP(S) `href` wins; known non-synthetic PP fixture IDs receive the real prototype application route; other rows remain plain text. The mark, text and table selection layout are retained; spacing follows the current shared scale. Inbox adds the source unread dot, company-action dialog, and shared membership picker; see [Inbox contracts](inbox-patterns.md#interaction-behavior).

Chat emits `forma:table-change` after sorting/loading: `{kind, sort, ascending, previousOrder, currentOrder, addedCount, columns}`. Rows expose `data-previous-index`/`data-current-index` (newly loaded rows use previous `-1`), and explicitly supplied `addedColumns` mark their header/cells with `data-chat-generated`. The table itself has no reorder animation; the containing Conversation composition can use these hooks while respecting reduced motion and cleanup.

## Filter spacing correction — 9 October 2026

Read the full live `inbox-filters.js` and final source `styles.css:5611–5638` filter rules, plus the source toolbar overrides. The original app has an eleven-property picker with nested value panels; this catalogue intentionally composes three working shared multiselects rather than duplicating company business filters, as documented above. The source toolbar geometry remains 34 px high with its 260 px, 16 px-radius panel. Utility glyphs are deliberately normalized from the original 12/14 px values to the system's 16 px Hugeicons Stroke Rounded contract.

The supplied screenshot showed chips close to the small field border. The reusable small multiselect now has 4 px inset instead of 2 px, and the composed panel fields have named 16 px padding/gap aliases. Header/footer insets retain their compact source proportions. The panel carries its own `pp-theme` class so shared button styling persists when the fallback moves it to the document body. Close uses the original compact 24 px hit box with a 16 px glyph and explicit selector precedence. Filtering, option search, removal, clear, nested popup ownership, focus and cleanup remain shared behavior. Inbox action-dock ghost controls now use the shared inverse-surface button contract for legible foreground and hover states.

Affected checks cover rendered padding/icon contracts and the actual simulated popup/criteria/cleanup events; the screenshot was inspected, but the revised interface has not been rendered in a browser.
