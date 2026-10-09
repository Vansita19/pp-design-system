# Card compositions

These additions keep source-derived structures reusable without creating a page for every content arrangement. The Card family opens with Notes and also retains prompt cards. Information block owns stacked sections and table-with-information compositions. Stats bar is a separate reusable block; the AI response statistics template calls the same renderer.

| API | Configuration | Provenance |
| --- | --- | --- |
| `F.noteCard(c)` / `F.noteCardTokens(c)` | `noteKind`: text, table or image; stacked; authors; title, company, author, date, description | `investor-preview/notes.js` notePaper, individualNote and companyStack; `styles.css:5658–5693`. |
| `F.statsBar(c)` / `F.statsBarTokens(c)` | items `[label, value, detail]`; details; framed. `variant: 'statistics'` returns the shared inner strip for AI response. | `conversations.js` statistics result and final `styles.css:4546–4553`. |
| `F.stackedInformation(c)` / `F.stackedInformationTokens(c)` | title, tags, footer; items `{title, description}`, two by default | Composition of existing Information block anatomy and the divided section stack in `company-brief.js:34–39`. The generic wrapper is an intentional composition, not an identical full company brief. |
| `F.informationTable(c)` / `F.informationTableTokens(c)` | title, tags, rows `[label, value]`, info, infoTitle, infoText, footer | `detail-pages.js` table/card/footer anatomy and final `detail-pages.css:24–25,39`; company details table is also used by `company-brief.js:58–60`. |

Note cards retain the 6px frame inset, 16px outer corners, 12px preview/paper corners, 156px preview, 26px paper top offset, 76% paper width capped at 208px, 20×20px normalized paper padding, 48px identity row and 14px title. Shared Avatar and Badge atoms replace the source's separately implemented identity/count marks. The table paper uses the source 1.4:1:1 bordered grid, 15px cells and filled header; image paper uses its 72px neutral ghost with 5px corners. Optional author groups reuse shared AvatarGroup. The stack has a sibling peek button that cycles the front paper, announces the current index and restores focus; the button is outside the native disclosure so there are no nested interactive controls. Its short paper transition intentionally normalizes the source departing-card clone animation and respects reduced motion and preview pause. Each disclosure opens local sample content; the separate source-workspace Note editor template supplies the full editable/read-only composition. Source portraits are normalized to the shared avatar specimens.

The stats strip retains four sample values, 16px column spacing/dividers, 22px values with 28px line height, and 11px labels. The standalone optional frame uses existing 12px corners. The embedded strip has no extra wrapper. Container queries adapt columns to available width; custom data is escaped and bounded to eight metrics. This is display-only data, not a calculation or live application snapshot.

Information compositions reuse the existing raised header tags, shell/body tokens and ordinary CSS border radii. The table normalizes source cell padding to 8px vertical / 16px horizontal under the shared spacing rhythm; its 13px body with 19px line height is retained. Its optional explanatory text sits below the table within the same body; the separate outer footer remains available. Content remains generic sample data. Neither composition creates another data-table family or duplicates menu/selection behavior.

All newly authored values are registered primitives or aliases. Source colors are mapped to matching existing semantic roles or nearby palette values. The shared radius tokens define ordinary CSS rounding; corner smoothing is removed everywhere by the latest user request.

Use `F.wireCardPatterns(root, registerCleanup)` to wire stack cycling; it disposes timers and corner observers. Run `node checks/card-patterns.cjs` for alias resolution, escaped custom content, configuration combinations, native disclosure anatomy and source dimensions. Run existing detail-page/matrix and token checks after catalogue integration. Browser visual and screen-reader checks remain unverified under the current tool restrictions.

## Latest spacing override — 9 October 2026

Padding, margins and gaps follow [the shared spacing contract](spacing-system.md). Geometry such as the 156px preview, 26px paper top offset, 15px table-paper cells and 22px icons stays unchanged in `size.*`; those dimensions are not entries on the Spacing page.

The generic colored Project details card was removed at the user’s request. Card opens with Notes by default; prompt cards remain available.
