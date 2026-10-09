# Shared-atom composition audit

This audit checks the renderer configuration, its emitted custom properties, the final composition CSS and the corresponding token inspector together. A `pp-badge`, `pp-avatar` or `pp-button` class alone is not proof of reuse: local size, font, radius and color overrides can change the actual atom. Values below were resolved through the live token registry, not inferred from screenshots.

## Corrected compositions

| Composition | Evidence before the correction | Maintained contract |
| --- | --- | --- |
| Timeline count and company badges | Already rendered by `F.badge` with small neutral defaults; there was no Timeline badge CSS override. | One explicit `{variant:'soft',tone:'neutral',size:'sm'}` configuration now drives both rendering and inspector. Actual height `component.badge.height.sm → space.20` is 20px and font `component.badge.font.sm → font.size.11` is 11px. Checks compare composed markup directly with the atom renderer. |
| Profile avatars in Information block | Renderer requested `size:'lg'`, but `!important` CSS forced 44px size and 16px text while excluding the native size/font tokens from the inspector. | Unmodified shared large square avatar: 40px size, 14px font, 10px square radius. Inspector includes the exact native avatar roles. Older profile aliases now point to those native roles for compatibility. |
| Note card company and author identities | Renderer requested small avatars, but local CSS forced company size 22/radius 7 and author size 16/font 10. Avatar groups also overrode the shared overlap to 4px. | Unmodified small avatars: 24px size, 12px font, square radius 10 or circle radius as configured. Author groups retain the shared 8px overlap. Inspector keeps native avatar size/font/radius and group overlap instead of replacing them with local geometry. |
| Research trace node badges | Renderer used shared small badges, but local metadata CSS reduced them to 18px height and 10px text with 4px padding. | Removed local badge geometry so actual node badges and inspector agree with the shared small badge contract. |
| Research trace company avatar | Small square renderer produced 24px size/radius 10, but map CSS forced radius 7. | Removed the map avatar restyling. Native small-square avatar tokens remain in the inspector; older trace geometry aliases point to shared roles. |

These changes deliberately supersede older source-geometry notes that retained the smaller note identities or 44px founder avatars. Component layout, labels and native behaviors remain their owning composition's responsibility; shared atom appearance now remains the atom's responsibility.

## Shared information and result headers

The latest source review compared `conversations.js`, `company-brief.js`, `detail-pages.js` and their final CSS directly. Table and the AI Overview, Brief and Statistics cards now call `F.resultCardHeader(title, {detail, actions})` and use the Table frame classes. The helper retains the existing Table header's 20px blue icon surface, 14px canonical grid glyph and named typography/spacing tokens; `F.resultCardHeaderTokens` and `F.resultCardTokens` expose its dependencies. Caller-owned buttons contribute their own shared-atom contracts. A direct-child heading selector prevents the later response-wide heading rule from overriding the shared title color.

This uniform result frame is the requested normalization: original Pitch Protocol gives AI Overview and Brief different outer shells. The gray detail-page Information block shell remains separate. `F.informationHeader(title, {id, tags})` now owns Overview, Stacked and Table information headers without duplicating title/tag markup. Empty tag arrays omit both the empty flex wrapper and unused Tag token references, matching the source's `tags.length` guard.

Statistics continue to use one `F.statsBar` renderer. Captions now sit in semantic `dd` elements rather than as invalid bare siblings within the description list, with their existing visual margins preserved. This fixes Forma's semantic adaptation of the source's label/value/caption rows; it does not introduce a new statistics appearance.

The AI Comparison and Meeting examples are recorded as visual, user-requested exclusions (`CHAT-26`, `CHAT-27`, `CHAT-38`) rather than incorrectly marked publicly covered. Reusable Information block Comparison and Accordion remain available. Detailed observations, corrections and source-versus-normalization boundaries are recorded in [the consistency audit](component-consistency-audit.md).

## Navigation and action review

Pagination arrows, Stepper separators, menu chevrons, calendar arrows and disclosure arrows render through `F.icon` or through `F.button` with `iconName`. Their registered Hugeicons Stroke Rounded geometry is reused with 1.25px non-scaling strokes at sizes up to 16px and 1.5px above 16px; rotating a registered right chevron for its left-facing partner does not create another icon implementation. Pagination's disabled/current states and keyboard step selection were checked in `checks/navigation-controls.cjs`. Keyboard key labels such as arrow keys are keycap text in `F.kbd`, not replacement navigation icon assets.

The Prompt bar Add context action now renders the actual shared secondary small icon button. Its old custom alpha-border/shadow CSS no longer overrides that button. Source workspace person avatars now retain the requested shared small 24px avatar, with the old person-size alias redirected to the native token. The literal icon-name audit uses the canonical Hugeicons registry. User, upload, calendar, close and the remaining action aliases resolve to official Stroke Rounded assets; no alternate icon-library fallback is permitted.

Two deliberate composition geometries remain explicit rather than being described as unchanged standalone atoms. Message actions reuse `F.button` behavior and state styling but expose a compact 28px action area, 14px glyphs, 2px gap and 6px radius through the named `component.response.actions.*` contract. The compact action renderer applies those values visibly through the shared button's custom properties, and the inspector includes them. Onboarding combines a 40px invitation row with a 38px borderless email field, an 84px-wide/28px-high role selector and a 26px removal slot; these dimensions are explicit `component.sourceShell.onboarding.*` aliases for that composed field, while native input semantics and shared select/button behavior are retained. They should not be mistaken for the removed hidden avatar/badge overrides, which claimed a standard size while silently rendering another.

The internal Company report Save List trigger retains separate plus-button styling, and the old `source-details` report includes 16/20/44px identity geometry. These source-specific internal helpers are outside the public catalogue audit after page exclusion; no public-atom correction is claimed for them.

The retained research-confidence three-bar SVG is a data indicator drawn from the source, distinct from an action/navigation glyph. Other hand-authored charts and meter geometry are likewise data marks. These retained data graphics are not UI glyphs and are not claimed to be Hugeicons assets.

## Covers and behavioral checks

The new Command menu and Tag covers were initially static recipes with no interactive Hairline groups. Each now registers animated groups and exactly one focal solid per group using the existing scene DSL. The full Hairline check passes across 76 retained recipes, 73 visible destinations and 1,260 poses, including its six adapter motion states. Consolidated-family cover recipes may remain beyond the visible page count.

The counted-tab regression fixture was updated to provide the actual tablist and moving surface geometry expected by `F.wirePitchTabs`, and now exercises that controller directly. Selection, arrow/Home/End wrapping, panel visibility, surface placement and listener/surface cleanup are checked. Production tab behavior was not changed to accommodate the older fixture.

The earlier combined workspace sweep passed 47 checks. The latest shared-header/statistics pass additionally passed `pitch-patterns.cjs`, `card-patterns.cjs`, `ai-response.cjs`, `full-source-coverage.cjs`, `verify.cjs` and `spacing.cjs`; the consolidated current sweep is reported separately. This targeted audit ran `detail-blocks.cjs`, `card-patterns.cjs`, `source-trace.cjs`, `pitch-patterns.cjs`, `navigation-controls.cjs`, `hairline.cjs` and `spacing.cjs`. They cover renderer/token agreement, actual simulated event handlers and cover geometry. Browser pixels, native layout, zoom and assistive-technology behavior remain unverified; no browser, server or deployment was used.
