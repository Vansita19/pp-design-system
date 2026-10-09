# Selection controls

The current Checkbox appearance uses Pitch Protocol's polished Inbox table control. The user's latest request to reuse that existing design supersedes the earlier shadcn-inspired checkbox appearance. It is one shared atom for the standalone page, tables and composed controls; no extra checkbox family or dependency was added.

## Source and retained construction

Source: `/Users/vansitaaddanki/pp-admin/investor-preview/workspace.js` Inbox table renderer, and `styles.css:5582–5585` active selection-cell overrides. The older Chat checkbox is 15px with a 3px radius, inherited from older generic rules. The 16px Inbox control is the selected canonical appearance so the organizer does not maintain conflicting checkbox designs.

| Role | Shared token | Retained value |
| --- | --- | --- |
| Box | `component.checkbox.size` | 16px |
| Corners | `component.checkbox.radius`, `.corner` | 5px, ordinary round |
| Unchecked edge | `component.checkbox.border` | gray300, 1px |
| Unchecked surface | `component.checkbox.background` | White |
| Quiet edge depth | `component.checkbox.shadow` | `0 1px 1px #00000005` |
| Checked/mixed surface | `component.checkbox.selected` | blue600 |
| Check | `.markWidth`, `.markHeight`, `.markStroke` | Source 7px × 4px shape with 1.5px white edges |
| Mixed dash | `.mixedWidth`, `.mixedThickness` | 8px × 1.5px |

The tick is copied from the source's CSS form indicator, not a new illustration or custom SVG. Its 4px offset within the outer indicator includes the source input's 1px border plus the source's 3px translation. The older decorative Phosphor tick is hidden so two indicators cannot overlap. Other app icons remain in the standard registry. Its existing 5px CSS radius defines the checkbox corners without any smoothing override.

## Behavior retained

The real `<input type="checkbox">` still owns checked, indeterminate and disabled state, keyboard activation, form values and accessible naming. The mark remains decorative and ignores pointer events. The existing short opacity/scale transition is retained as an accepted enhancement; it is disabled by the pause control and reduced-motion preference. The checkbox keeps the shared focus ring, disabled appearance and forced-color treatment. Radio and Switch appearance is unchanged by this correction.

`checks/accessibility.cjs` verifies the source geometry and aliases, native semantics, disabled/mixed behavior, one visible tick, round-corner override and reduced-motion rule. Existing table-selection checks verify select-all and partial selection. These source and simulated-event checks do not replace browser or screen-reader verification.
