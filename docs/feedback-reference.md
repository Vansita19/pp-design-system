# Alert and accordion reference update

Implemented as static, native HTML components using the existing Pitch Protocol token graph and Phosphor icon map. No shadcn, Base UI, Radix, or React dependency was added.

## Alert

References inspected:

- https://ui.shadcn.com/docs/components/base/alert
- https://ui.shadcn.com/r/styles/base-nova/alert.json

The composition follows the reference: optional icon, title, description, and action. The organizer supports a standard bordered surface, a soft tinted surface, five semantic tones, a compact inline layout, optional link/button action, and dismissal. A third icon-accent surface follows the attached simple-alert screenshot: white card, neutral title and underlined link, vivid status icon, muted dismiss button. Link actions reuse the system's native anchor with the default underline. Danger buttons reuse the soft destructive Button variant.

`component.alert.*` aliases existing semantic feedback roles or spacing, type, radius, and border primitives. Color roles resolve through `semantic.feedback.*`; there are no per-instance hex values. Default card surfaces remain white, with a 10px radius and 16px inset. Danger is assertive (`role="alert"`); informational status is polite (`role="status"`). Dismissal preserves focus in the preview and cleans up its event handler on rerender.

## Accordion

References inspected:

- https://www.alignui.com/docs/v1.2/ui/accordion
- https://pro.alignui.com/blocks/accordion
- https://pro.alignui.com/block-preview/default/accordion-01
- https://pro.alignui.com/block-preview/default/accordion-02
- https://pro.alignui.com/block-preview/default/accordion-03

The public component source informed the separated cards. The latest spacing override (9 October 2026) uses 12px padding and an 8px icon gap through the [shared rhythm](spacing-system.md), while retaining 10px corners, 20px leading icons, the restrained border and light gray open surface. The system also includes divider-only and soft surfaces, a plus/minus or chevron indicator, optional leading icon, numbered steps, and structured detail bodies. Content examples are generic and configurable; they are not tied to one dashboard route.

The setup block is the primary accordion example, with a chevron indicator. It retains the public `accordion-01` structure: three titled groups, six disclosure rows, a completed product step with a Ready badge, active and pending status marks, and an app-link input/action body. Store setup, settings, and launch preparation are independent groups. The app step and storefront step are initially expanded; single expansion applies within each group, so opening one section does not close another.

The earlier setup implementation used generic workspace content, presented all expanded bodies as uninterrupted white rows, and applied a single disclosure name across all sections. Those choices obscured the requested block pattern even when Setup was selected. The update gives expanded content its own subtle inset surface: `bodyInset → space.8`, `bodyPadding → space.12`, `bodyRadius → radius.md`, and `bodyBackground → semantic.surface.canvas`. The outer outline, internal row dividers, 12px trigger inset, and 20px leading status icons remain shared with the existing accordion geometry. Disclosure chevrons and plus/minus icons now use a separate 16px size and gray500 foreground through component aliases. They use the unchanged official Phosphor regular glyphs, matching the app icon library. These inset choices are a token-based adaptation; inaccessible screenshot pixels prevent a claim of exact block geometry.

The form reuses the existing input and button tokens. Three body choices remain available: text with a local form demo, numbered steps, and key/value details. The email form only prepares a local preview message; it does not send email. QR artwork and the upgrade promotion are omitted because they are optional product content rather than accordion anatomy. Setup composes Badge, Spinner when status icons are shown, and Input/Button only for text content. Steps/details do not claim unused form tokens.

Grouped frames, expanded setup panels and rounded card/soft items now use the shared 60% tangent-curve painter. The outer radius remains 10px and inset body radius 8px; divider-only accordions keep their flat edges. Setup rows have transparent fills so they do not cover the frame curve. The native round fallback remains available before the queued paint and in forced colors.

Each item uses native `details` and `summary`, maintaining built-in disclosure semantics and keyboard activation. Single expansion uses an instance-unique `name` plus a compatibility handler; setup additionally scopes both mechanisms to the titled group. Multiple expansion, disabled controls, directional navigation, event cleanup, reduced motion, and forced colors are covered.

### Figma limitation

Both `get_design_context` (with screenshot requested) and `get_screenshot` for file `G2Jsv2KKziOWB9yjFk00pR`, node `166568:4221` returned an edit-access error, including a fresh attempt on 2026-10-09. The latest attached image could be identified and its extracted text read, but its pixel download returned HTTP 403. The public base accordion source and all four public block-preview text pages were retrievable; direct HTML downloads of the block previews also returned HTTP 403. No paid source was accessed. The implementation follows the accessible public component geometry, block hierarchy/text, and existing system tokens; it is not claimed as a pixel-exact reproduction of the inaccessible screenshot or Figma node.

## Verification

`node checks/feedback.cjs` checks 180 alert and 120 accordion configurations, escaping, token aliases, native markup, single/multiple group behavior, independent setup section expansion, keyboard navigation, disabled activation, dismissal focus, and listener cleanup. The group-scope regression verifies that opening a step closes another step in the same group while preserving an open step in a different group. No browser visual review was performed.
