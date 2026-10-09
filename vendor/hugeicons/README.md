# Hugeicons Stroke Rounded registry

This directory retains the selected, exact icon arrays from the official **@hugeicons/core-free-icons 4.3.5** npm package, under its included MIT license. The package documents its free collection as Stroke Rounded on a 24 × 24 grid. The downloaded tarball's SHA-512 integrity was verified against the npm registry metadata before extraction.

- Official style: https://hugeicons.com/icons/stroke-rounded
- Official documentation: https://hugeicons.com/docs
- Package: https://www.npmjs.com/package/@hugeicons/core-free-icons
- `source.json` pins version, URL, integrity and extraction details.
- `definitions.json` preserves the original selected export arrays, including geometry and package presentation attributes.
- `mapping.json` maps the application's semantic icon keys to real package export names. Legacy `*-fill` keys deliberately resolve to the corresponding outlined icon; they do not introduce another style.
- `build.mjs` produces `dist/hugeicons-icons.js` without a package installation or network access. Run `node vendor/hugeicons/build.mjs --check` to check reproducibility.

The renderer preserves geometry, removes package-only React keys, inherits rounded caps/joins and the system stroke width from the SVG wrapper, and adds `vector-effect="non-scaling-stroke"` to **every drawn element**. This keeps 1.25 px strokes at rendered sizes up to 16 px and 1.5 px strokes above 16 px. It uses `icon.stroke.small`, `icon.stroke.large` and `icon.size.threshold` when the token registry is available, with the same numeric defaults for isolated usage. It does not add paths, fabricate shapes or substitute another icon family. Missing semantic keys throw an explicit error rather than showing an unrelated fallback.

`F.icons` and `F.hugeicons` expose the same frozen semantic registry. Entries have `{ name, markup }`, where `name` is the actual package export (for example, `Cancel01Icon`). `F.icon(key, size)` returns an accessible decorative SVG string with class `hugeicon` and `data-hugeicon`. `F.iconStroke(size)` returns the effective numeric stroke width.

Chevron directions use the official `Arrow*01Icon` set. The bent follow-up arrow uses `ArrowTurnForwardIcon`, whose original path bends left before returning to a right-facing tip. All former filled selection aliases use the same Stroke Rounded shapes as the corresponding unselected semantic icons; state is expressed by component styling.
