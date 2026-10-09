# Drawer

The drawer adapts the layout in the user-provided AlignUI example and the [official AlignUI Drawer reference](https://www.alignui.com/docs/v1.2/ui/drawer), reviewed on 2026-10-09. It is a local, dependency-free implementation using native HTML dialog rather than React/Radix. The original Pitch Protocol files and synced project sources are unchanged.

## Retained and normalized

Retained anatomy: an edge-mounted panel, compact header with close action, profile/information/activity content, and footer actions. The live panel slides in and out from the selected left or right edge. Content starts directly beneath the header. The header and footer remain visible while the main body scrolls independently.

The supplied example's thick, filled section bands are replaced with Forma's thin `semantic.border.default` dividers and small section labels. The shared Avatar, Badge and Button renderers supply the actual controls, with existing Phosphor icons replacing Remix icons. The supplied sample's banking transactions become fictional contact and company activity data suitable for the Pitch Protocol organizer. No external data, communication, or original application changes are performed.

Geometry and colors resolve through `component.drawer.*` aliases. Spacing follows the existing scale; widths are 320, 400 and 480 pixels, and the in-flow specimen height is 560 pixels. The shared 40-pixel avatar is retained instead of creating a drawer-specific avatar size. Motion uses the shared 200ms duration and easing. Small screens cap the panel at the viewport width and height.

## Configuration and behavior

`F.drawer(c)` supports `variant: details | form`, `side: left | right`, `size: sm | md | lg`, `title`, `label`, `footer`, `preview`, and `disabled`. The default is a visible, in-flow details specimen plus an Open drawer trigger. `preview: false` renders only the trigger and closed dialog. Mounting a specimen never opens a modal.

The details variant has expandable activity items and a footer action that switches between three recent activities and all five local examples. Each activity item is one native button, with a decorative chevron rather than a nested button. The form variant preserves the Name and Description fields and saves only local preview state. An inline Cancel resets its form; the inline details Close resets its specimen rather than removing the catalogue example.

`F.wireDrawer(root, registerCleanup)` mounts each instance once. The live drawer uses `showModal()` for browser-managed modal focus and background inertness. Header close, footer close, native Escape/cancel and backdrop clicks use the same exit transition before closing, and restore focus to the opener. A timer is a fallback if animation-end is unavailable. Reduced-motion and preview/global pause changes remove motion after mount and complete a pending close immediately. Cleanup closes the native dialog and removes listeners, observers and outstanding timers. Browsers without native dialog support keep the inline preview available and announce that limitation instead of presenting an incomplete custom modal.

`F.drawerTokens(c)` includes only the active width and the selected details or form dependencies; footer button dependencies follow `footer`. Form fields use the existing input/field classes. Avatar, badge and button contracts are composed from their shared token functions.

## Verification limits

`node checks/drawer.cjs` checks markup, registered aliases, unique IDs, escaped titles, variant dependencies, simulated dialog events, local activity/form actions, motion changes and cleanup. These checks do not establish browser rendering, actual scrolling/animation quality, zoom, touch behavior or assistive-technology conformance. No browser session, local server or deployment was used. Existing documented accessibility exceptions for shared controls still apply.
