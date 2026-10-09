# Forma design-system audit

Updated 9 October 2026 (India). This is a targeted code audit, not a certification of accessibility or a claim that every design-system convention has been implemented.

The existing primitive, semantic, and component token structure is sound enough to retain. Atomic categories and the dark organizer shell also remain appropriate for this project. No architecture migration or visual redesign is required by the reviewed guidance.

## Latest override — 9 October 2026 spacing and color refinement

The current [spacing contract](spacing-system.md) supersedes the earlier source-spacing and solid-fill statements below. Padding, margins and gaps now use the shared 4px rhythm with 2px/6px fine steps; retained off-grid geometry uses `size.*`. The Spacing foundation contains only the canonical scale, and Borders presents examples before its token table. `node checks/spacing.cjs` is the regression gate for this contract.

Focus borders now map to blue500, and danger/success validation borders to red500/green500. Solid badges now use gray/blue/green/purple/amber/red500 with white labels and icons. Gray500/white passes 4.5:1; colored pairs intentionally remain below that normal-text threshold: blue 4.470:1, green 2.404:1, purple 3.957:1, amber 2.148:1 and red 3.781:1. The standards gate records these explicit exceptions rather than claiming every solid pairing passes. Earlier darker-solid choices below are historical and no longer describe the current badge fills. Primary action hover, unrelated text roles and palette primitive values are not changed by this badge decision.

Earlier audit counts and results below record their original runs; they are not fresh results for this refinement. The current machine-readable verification record is `verification-2026-10-09.json`. Browser appearance and accessibility conformance remain unverified.

## Historical audit findings

| Area | Finding | Correction |
| --- | --- | --- |
| Inspector | Some variants listed tokens for another size, shape, tone, or state. Native controls claimed browser-defined styling as authored tokens. | Configuration-aware core token lists cover the affected examples. Authored selects and menus now use their own contracts; native semantics remain separate from visual styling. |
| Motion | Spinner, skeleton, glow, streaming, and AI status entries reported durations that differed from implementation. | Named duration tokens now match the existing timing and are used by the corresponding CSS or JavaScript. |
| Buttons | Loading always forced the primary appearance; icon-only padding was overridden by inline token styles. | Preserve the chosen variant while loading; use zero horizontal padding for icon-only controls. |
| Contrast | Primary hover was 4.470:1 for white text. | Add a nearby blue550 hover shade, retaining source blue500: 4.588:1. |
| Contrast | Danger text on the subtle danger surface was 4.120:1. | Use a separate danger-content role at 5.389:1; keep status indicators, content and action roles distinct. |
| Contrast | Several organizer labels were too faint. | Strengthen the affected muted labels. The switch off-track now follows the subsequently requested light Base Nova reference; see the qualification below. |
| Contrast | The shimmer highlight became too light to read on white. | Use the existing gray500 highlight while retaining the motion. |
| Keyboard and state | Combobox selection, filtered table selection, closed popover Escape, and disabled composer interactions had inconsistencies. | Correct active selection, mixed state, focus behavior, and disabled controls. |
| Announcements | Confirmation, toast, composer, and streaming examples lacked some required context or stable announcements. | Add descriptions, appropriate focus restoration, persistent status regions, and complete accessible streaming text. |
| Motion preferences | Paused streaming did not resume correctly; reduced-motion changes were incomplete. | Correct pause/resume, reduced-motion behavior, and timer cleanup. |
| Foundations | Font specimens displayed rounded line-height values that were not exact. | Label font-size specimens accurately and expose the actual line-height, family, and weight definitions separately. |

## Verification and limits

- A fresh source inventory contains 67 page definitions (62 visible), 56 component implementations, 65 cover recipes and 36 official Phosphor icons. The three consolidated Button-family definitions remain addressable; Motion tokens and Layers stay hidden.
- The fresh verification run resolved 888 tokens and rendered 340 select variants. The standards run passed 32 approved contrast pairs and 453 configuration mappings. These are source-check results, not a claim about every computed browser style.
- `checks/accessibility.cjs`, the component-specific checks, and `checks/menus.cjs` exercise native semantics and simulated events, including keyboard selection, mixed state, table filtering/sorting, removable values, focus recovery, form handling and cleanup. These are source/event contracts, not browser accessibility results.
- The actual detail renderer passed 206 subsection checks. Overview alone contains the playground/configuration, while focused subsections lead with specimens. The matrix gate passed 56 component pages and 1,128 specimens, including 315 badge examples, with per-instance IDs and configuration-specific markup/token references.
- The fresh accessibility gate passed 17 simulated event contracts. Targeted gates also passed: nine avatar contracts; four switch-motion checks; 48 slider configurations and five interactions; 108 chip configurations and nine interactions; 76 Pitch-pattern configurations and four numeric sort interactions; and six layout checks across 14,409 geometries and 27 exposed layout aliases.
- The feedback gate was rerun after the setup-control correction: 180 alert configurations, 120 accordion configurations and 13 interaction contracts passed. The final menus gate passed 17 checks after multiple-selection integration. All 65 official Hairline benches were built and validated.
- The inspector remains a manually maintained list of core references, not an exhaustive computed-style inventory. Some presentation details are still CSS literals.
- Browser, screen-reader, zoom, touch, and visual regression testing remain outstanding. Native dialog behavior and announcement timing must be verified in real browsers before making an accessibility conformance claim.
- The original Pitch Protocol dashboard is not modified by this organizer audit.

## Optional improvements, not required rewrites

The internal token registry is not a DTCG interchange file. A standards-compatible export adapter can be added when cross-tool exchange is needed; this is not a reason to replace the runtime registry now. Typography composites, additional themes, automated design/code synchronization, and lifecycle tooling should follow an actual use case.

Keep intentional source exceptions in documentation. For example, the retained purple50 is darker than the extended purple100; do not silently renumber brand colors to imitate another system. Record future changes, approved color pairings, and deprecations in this source archive without crowding component pages.

## Primary references

- [DTCG format specification](https://www.designtokens.org/tr/2025.10/format/): named references, types, and interchange format.
- [Atlassian tokens](https://atlassian.design/foundations/tokens/): reusable named design decisions.
- [Carbon accessibility overview](https://carbondesignsystem.com/guidelines/accessibility/overview/): accessibility as part of component design and verification.
- [W3C contrast guidance](https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html): text contrast, including hover content, evaluated without rounding up.
- [W3C non-text contrast](https://www.w3.org/WAI/WCAG22/Understanding/non-text-contrast.html): necessary control and state indicators.
- [W3C APG patterns](https://www.w3.org/WAI/ARIA/apg/patterns/): component semantics and keyboard interaction.
- [Reduced-motion technique](https://www.w3.org/WAI/WCAG22/Techniques/css/C39): honor the user's motion preference.


## Selection controls, focus, and badge normalization

The supplied shadcn Base Nova reference is implemented with authored CSS and native inputs, without adding shadcn, React, or Base UI dependencies. Checkbox uses a 16px box, 4px corners and the official Phosphor regular 14px check; mixed state uses the native indeterminate property. Radio uses a 16px circle and an 8px white center on the retained primary blue. Switch uses the reference 32×18.4px track / 16px thumb, 24×14px / 12px small size, plus a proportional 40×24px / 20px large extension. Transitions respect reduced motion and the organizer's pause control. Forced-colors styles retain system colors and a visible focus outline.

Inputs previously combined a component focus shadow with a generic input outline. They now use a border plus one soft 3px ring, with the redundant outline suppressed. High-contrast mode uses an outline instead of relying on box shadows. This is not a removal of keyboard focus.

The light unchecked border and switch track intentionally follow the user's supplied reference. These gray200 boundaries do not meet a standalone 3:1 contrast ratio on white. Do not claim full WCAG conformance based on the text and focus checks. Forced-colors support is provided; visual, keyboard and assistive-technology checks in real browsers remain outstanding.

One Badge family replaces the separate standalone, table, filter, and response variants. The reference is Pitch Protocol's `.view-kind-label` Dynamic/Static treatment: compact proportions and pastel color pairings. The user-requested standard radius is now 8px with the shared 60% tangent curve, replacing the original 6px CSS-only corner. The standard badge is 24px high with 12px/16px medium text, 8px horizontal padding and a 6px gap; optional small/large sizes are 20px and 28px. Soft, outline and solid appearances have consistent geometry. Indicators are none, a decorative dot, or an official Phosphor icon; labels carry the meaning and badges are noninteractive.

Neutral, blue, green/success, purple, amber/warning and red/danger remain available. The existing amber tint `#FFF7DC` and indicator `#FFBF00` are retained as amber75 and amber450 primitives. Badge color values resolve component → semantic → primitive; geometry also resolves through named aliases. Colors and Indicators have dedicated navigation subsections. Solid badges use white text and indicators for every tone through their `solid.foreground` aliases. Existing fills map to gray500, blue550, green700, purple600, amber700 and red600; these keep white labels above 4.5:1 without changing palette primitives or soft/outline colors. Inactive solids desaturate to gray500 with white labels, deliberately sharing the neutral solid pairing. Outline borders have independent lighter color roles, and icon-only badges use the circular geometry. The standards gate checks every supported soft and solid text pairing against 4.5:1. Table, filter and response token lists use the same Badge contract; multiselect/table selection and settings switches use the shared control contracts.

Inspected implementation references:
- https://ui.shadcn.com/r/styles/base-nova/input.json
- https://ui.shadcn.com/r/styles/base-nova/checkbox.json
- https://ui.shadcn.com/r/styles/base-nova/radio-group.json
- https://ui.shadcn.com/r/styles/base-nova/switch.json
- https://base-ui.com/react/components/checkbox
- https://base-ui.com/react/components/radio-group
- https://base-ui.com/react/components/switch

## Avatar, button, loading and comparison updates

Avatars share image/fallback geometry, status and icon badges, group overlap, and overflow counts. The current image sample is the user's bundled portrait, with source bytes preserved and crop styling applied in CSS. Initials and official filled-silhouette placeholders use seven background families: neutral, amber, blue, sky, purple, red and green. New sky and purple primitives have semantic avatar roles; they are not inline color exceptions. Image failures retain fallback content, and the avatar gate checks listener cleanup. Button documentation combines regular, icon, link and joined-group variants while preserving the original routes. Link variants remain native anchors, underlined by default with a 4px offset. Destructive and success buttons use soft surfaces, readable colored text and a single focus ring.

Progress bar fills now resolve through `component.progress.fill.*` and `semantic.progress.fill.*`; percentage labels use a separate text role. A shared gray value is not a reason to give a non-text fill a text-semantic name. Spinner warning color uses a new orange500 primitive through `semantic.loading.warning`, without changing warning-text contrast. Ring and eight-spoke styles share sizes and motion preferences.

All states is the second component tab. The matrices show supported visual combinations, with interaction-state rows only where they carry meaning. Badges include leading, trailing and icon-only forms and one inactive comparison row per size. Chip / pill separates selectable and removable actions from noninteractive badges; multiselect removal updates the checkbox and restores focus to that option. Every inspector reference is collected from the configurations actually rendered in the matrix.

Additional inspected references:
- https://ui.shadcn.com/r/styles/base-nova/avatar.json
- https://ui.shadcn.com/r/styles/base-nova/button.json
- https://ui.shadcn.com/r/styles/base-nova/button-group.json
- https://base-ui.com/react/components/avatar
- https://pro.alignui.com/blocks/accordion

## Grids, source patterns, feedback and authored menus

The Grids & breakpoints foundation uses the local Pitch Protocol source for its 248px expanded sidebar, 80px collapsed rail, shell insets, reading maxima and header sizes. A single geometry resolver drives the diagram, metrics and checks. The 4/8/12-column rules and overlay drawer below 1024px are labeled responsive extensions, because the original application shell still has a desktop minimum width. Documentation does not claim these additions already run in Pitch Protocol.

Data tables now follow the chat-result source: an inset container, original company-mark examples, paired category badges, numeric score and readable description columns. Existing search, row selection and score sorting remain available. Segmented tabs preserve the source Summary/Details dimensions, flush spacing and layered selected shadow. The reusable Information block preserves the briefing header shell, white content body, overview/stack/table, configurable list, text, optional-heading comparison, evidence, questions and profile patterns with shared tokens. Metrics/highlights/score live on Metric card, and Timeline has its own page. Details are recorded in `docs/pitch-patterns.md`.

Alerts use shadcn Base composition with this system's colors, radius, type, spacing and Phosphor icons. Standard, soft and icon-accent styles support inline/detailed layouts and reusable link/button actions. Accordions use native disclosure elements with separated, line, soft and grouped setup variants; setup rows compose the same badges, spinners, inputs and buttons used elsewhere. Their icon and disclosure-indicator controls affect every style. The local setup-form demo prepares preview feedback only and sends no email.

Dropdown menus and selects use authored listbox/menu surfaces, including configuration controls; the platform select menu is not exposed for supported single selects. Popups use the browser top layer when available and a positioned portal fallback, with viewport clamping, outside dismissal, keyboard navigation and cleanup. Comboboxes include single and multiple selection, filtering, optional leading/option icons and clear controls; multiple values use removable chips synchronized with selected options. Existing native selects remain hidden form-value stores behind the authored controls. The token inspector lists the relevant menu contracts for composed examples as well as standalone pages.

Single and two-thumb sliders follow the supplied visual references. Both share named track, fill, thumb, focus and value-bubble tokens. Native range inputs retain keyboard control; range limits, pointer interaction, disabled states and optional bubble geometry are checked in `checks/slider.cjs`.

Spectrum's public Animated Switch describes the press/stretch/release behavior, but its component source requires sign-in. The animation was independently adapted with CSS and native-input events; the gated implementation and package were not copied or installed. Existing geometry, colors and semantics remain, and reduced motion/pause disable the new deformation. See `docs/switch-motion.md`.

## Reference and browser qualifications

Newly supplied AlignUI Figma nodes could not be inspected because the connector returned access errors. The accessible public component source and user-provided screenshots informed the relevant accordion/slider work. No exact match to inaccessible Figma properties is claimed. The previously inspected organizer-shell Figma reference remains a separate, documented source.

The latest user request removes corner smoothing everywhere. Components and the organizer shell use existing CSS `border-radius` tokens with no `corner-shape` override or custom SVG corner painter. The source corner invariant is `checks/corner-radius.cjs`; the browser family check is `checks/corner-radius-browser.cjs`.
