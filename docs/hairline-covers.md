# Hairline component covers

The 62 visible catalogue pages have individual isometric compositions. Three additional button-family covers are retained after their documentation was consolidated, giving 65 recipes across seven recipe files. This inventory was checked against the current catalogue and loaded recipe registry. These replace the previous flat diagrams. The source is the user-supplied `hairline-main.zip`: its kernel, bench, build script, validator and examples are preserved unchanged. The kernel is copied verbatim into `dist/hairline-kernel.js`; the MIT license accompanies it.

## Design and integration

The compositions use rounded opaque solids, recessed details, fine outlines and a single bright focal silhouette. Each component has its own physical structure: an exploded button mechanism, bound calendar, receiving tray, sliding drawer, stacked menu, pillar matrix, and so on. There are no SVG labels, arrows or library icons inside the illustrations. Phosphor remains the organizer's interface icon library.

`hairline-scenes.js` composes figures through the official `Cam`, `rings`, `prism`, `solid`, `put`, `pointer`, tween and shared-clock APIs. It does not reimplement those helpers. The seven `cover-*.js` files define the 65 compositions. `hairline-adapter.js` mounts them into the native catalogue links, maintains motion preferences and disposes them during navigation or filtering. Chip / pill depicts a selector tray with three distinct capsule tags, recessed strips and release controls. The new `cover-information.js` adds a briefing tray with a raised title bridge, three removable content plates, comparison wells and pull lips; it contains no text or interface icons.

Each stage is a responsive 400:320 SVG with a `#171717` plate matching its card. Its geometry remains vector sharp. Pointer selection uses fixed rest-position anchors; the selected group moves with a 700ms tween and neighboring groups respond with a 40ms distance-based stagger. Covers do not run ambient animations. Pausing or requesting reduced motion brings them to rest. The caption is the accessible link label; the illustration is decorative.

## Hairline look checklist and evidence

Earlier static SVG sheets were rendered and inspected at thumbnail size. That asset review is not a browser screenshot or complete UI audit. The Information block addition has a separate geometry/structure gate in `checks/information-cover.cjs`. The figures were **not looked at in a browser during this update**; actual rasterization, layout and pointer behavior remain to be reviewed there.

| Check | Evidence / limitation |
| --- | --- |
| Silhouette at 240px | Static sheets show the physical structures, layers and distinct controls at thumbnail size. Tiny punch marks are secondary details. Actual CSS rasterization still needs a browser review. |
| Composed rest pose | Recipes use staggered heights, offset decks and mechanical assemblies. `focusOrder` preserves each composition's intended first highlight. |
| Spread from pointer | `coverMount.choose` uses the selected group's movement plus a small neighbor response, with delays proportional to index distance. |
| Stable hit testing | `tracks.hit` is computed once from rest anchors. Selection never measures the moving geometry. Unit checks confirm return to the exact rest geometry. |
| Rounded silhouette and inset crease | All solids use official `prism`/`solid`/`put`; large round footprints use 14 subdivisions per corner. No vertical wireframe corners are added. |
| Opaque, ordered surfaces | Recipes explicitly append bases, far geometry, near geometry and attached details. Static rest and representative active poses were inspected. Parent lift amounts are limited so panels do not overtake attached controls. |
| One highlight | Tests inspect actual SVG classes at rest, on every selected group, and after pointer leave. There is exactly one highlighted silhouette. |
| Read-out | The figure's internal read-out reports the selected group or `rest`; the decorative catalogue does not display extra explanatory text. |
| Frame limits | Geometry checks cover rest, intermediate and maximum pointer poses for every group, including stroke clearance within the 400×320 viewBox. |
| Theme | The organizer uses a single dark theme; local theme variables match the opaque plate to the card. The official standalone bench remains theme-capable, but its light theme has not been visually reviewed. |
| No words or icons | All 65 generated benches passed the unchanged official validator in this update. Individual recipes use solids, grooves and punch marks only. |
| Clean page | Source syntax, geometry and lifecycle have dedicated checks. Browser console, real pointer dispatch and layout behavior remain unverified. |
| Empty state | The empty cabinet shows an unoccupied shelf, visible interior and open door at rest. |

## Reproduce

Run `node checks/hairline.cjs --export /tmp/forma-hairline-review` for scene, pose, highlight, cleanup and motion-preference contract checks, plus SVG review exports. These tests use the real kernel geometry with controlled clock and pointer adapters; they are not a substitute for browser testing.

Run `node checks/information-cover.cjs` for the new briefing-tray composition's structure, frame bounds, selected highlight, pointer poses, cleanup and reduced-motion behavior.

Run `node checks/build-hairline.mjs --validate` to generate all 65 figures in the unchanged official bench and run the official validator against each. The builder discovers every cover recipe file. Generated benches go to the operating system's temporary directory. Their layout data comes directly from the same catalogue recipes, including focus order. This update's run completed successfully for all 65 figures.

Run `python3 checks/package.py` to rebuild the offline app and editable source ZIP. Both include the new cover code; the source archive also includes the original skill files needed to reproduce official validation.
