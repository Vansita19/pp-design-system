# Date picker

The user requested an improvement inspired by the official [AlignUI datepicker](https://www.alignui.com/docs/v1.2/ui/datepicker). The documented calendar source and single-date/popover/approval/range examples were read on 2026-10-09. Its compact month caption, square arrow controls, weekday calendar grid, selected day and connected range treatment informed this adaptation. This is native JavaScript using Forma tokens, buttons and Phosphor icons; it does not import React, react-day-picker or date-fns and is not a source-exact copy.

## Public contract

`F.datePicker(c)` renders one isolated calendar. Supported configuration:

- `variant`: `single` (default) or `range`.
- `display`: `inline` (default) or `popover`.
- `footer`: default true; Today and Clear actions.
- `presets`: default false; Today, plus Next 7 days for ranges.
- `label`, `disabled`, and optional form `name`.
- Programmatic ISO `value`/`start`, `end`, `min`, `max` and deterministic `today` override.

The default demonstration starts October 9, 2026, with a range through October 15. The today indicator and Today preset use the viewer's local calendar date unless explicitly overridden. Dates are bounded to 1900–2099, and stricter `min`/`max` limits can be supplied. Invalid ISO dates are rejected; initial values normalize to a valid bounded demonstration date. No backend data is changed.

`F.datePickerTokens(c)` exposes the actual named contract, with range roles and popover/footer button tokens conditional on the rendered configuration. Calendar geometry and colors alias existing Forma spacing, typography, radius, surface, border and action tokens; the explicit calendar width is 320px. The trigger uses the official CalendarBlank Phosphor glyph registered as `calendar`.

`F.wireDatePickers(root, registerCleanup)` wires each preview and registers cleanup. Calendar arrow navigation and the optional trigger/actions reuse `F.button`. Native hidden form inputs hold ISO selection values, including a separate `name + 'End'` field for ranges; disabled pickers disable both values. Selection emits a bubbling change event on the starting value field. The inline selected-date summary and a live status announce selection progress. Form reset restores the initial selection.

## Interaction

A first range click starts a new range; the next click completes and orders its endpoints, including backward selection. Clicking again starts a new range. Today chooses the local date (a one-day range when applicable), Next 7 days selects today through six days later within bounds, and Clear empties both endpoints. Month controls respect configured limits.

The grid has one enabled date in the Tab order. Arrow keys move by one day or week; Home/End move to Sunday/Saturday; Page Up/Down move by month while preserving/clamping the day; Shift+Page Up/Down move by year. Enter/Space use native button activation to select. Keyboard movement changes focused date and visible month without changing the selection. Month navigation at a bound moves focus to the active calendar day if its navigation button becomes disabled.

Popover display uses the native top layer when available, viewport-clamped positioning, outside and focus-out dismissal, Escape, and return to the trigger after selection or Escape. Inline and popup state/listeners are independent across previews. Cleanup closes the popup and removes document/window/control listeners. No animation is introduced.

## Verification

`checks/date-picker.cjs` verifies real renderer/token contracts and actual handlers in a simulated DOM: leap years and month-end arithmetic, reversed and restarted ranges, disabled/min/max behavior, keyboard focus across months, selected form values, clearing, presets, popover open/select/Escape/outside dismissal and cleanup. Syntax and spacing gates cover the module. These are not native browser, pixel-fidelity, zoom, touch or screen-reader conformance results. No browser session, server or deployment was run.
