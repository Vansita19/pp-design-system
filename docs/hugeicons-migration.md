# Shared icon library

The current UI library is **Hugeicons Stroke Rounded**, replacing the previous Phosphor registry and the Lucide glyphs inside the installed Spectrum toast. This is the user's explicit system-wide normalization; it intentionally supersedes older source notes naming other icon families.

## Source and rendering

`vendor/hugeicons/source.json` records `@hugeicons/core-free-icons@4.3.5`, its official npm tarball URL and verified SHA-512 integrity. `definitions.json` preserves the selected official geometry, `mapping.json` maps 79 semantic names to 69 assets, and `LICENSE.md` contains the original MIT license. Run `node vendor/hugeicons/build.mjs --check` to verify the generated registry.

All UI glyphs use `F.icon(name, size)`. The public `F.icons` / `F.hugeicons` registry records the actual asset name for every alias. Unknown names fail explicitly instead of substituting an unrelated shape. Existing filled-name aliases now use the corresponding Stroke Rounded asset.

| Role | Token | Value |
| --- | --- | --- |
| Small icon stroke | `icon.stroke.small` | 1.25px |
| Large icon stroke | `icon.stroke.large` | 1.5px |
| Maximum small icon size | `icon.size.threshold` | 16px |

Every drawable uses a non-scaling stroke, preserving those pixel widths when the 24-unit viewbox is rendered smaller. Official dots, paths and polygons retain their original geometry; line caps and joins are rounded. The Icons foundation shows the current assets and token values, and copying a specimen copies its displayed size and stroke.

The suggestion return arrow now uses this registry. The avatar status mark no longer overrides its path stroke locally. Navigation, menus, close/delete/plus actions and composed specimens use the same semantic aliases. Keyboard legends remain text labels for keys.

## Installed Spectrum component

The toast build resolves its original icon imports through `vendor/spectrum-toast/hugeicons-react.tsx`, which calls the same renderer. The installed registry source stays byte-identical. Lucide is absent from the shipped runtime and installed dependencies; its import names survive only in the unchanged upstream source and the build adapter's compatibility interface. Animation behavior is unaffected by this substitution.

## Non-icon graphics

Company/brand assets, charts, confidence indicators, countdown/progress geometry, Hairline covers and the exact Pitch Protocol 25-dot loading artwork are not UI icon assets. They remain their existing graphics. The icon audit explicitly distinguishes these cases instead of replacing data drawings with library symbols.

## Verification boundary

`checks/icon-consistency.cjs` compares registry markup with the saved official definitions, checks all supported icon sizes, exercises catalogue specimens and checks for foreign icon-library bypasses. The toast runtime check also checks every rendered icon's family and stroke. These are source and DOM assertions; no browser rendering, screenshot comparison or assistive-technology certification is claimed.
