# Spacing system

## Current rule — 9 October 2026

Use the shared 4px rhythm, with 2px and 6px fine steps:

`0, 2, 4, 6, 8, 12, 16, 20, 24, 28, 32, 36, 40, 48, 64`

These are the only `space.*` primitives. Padding, margins and gaps must reference this scale directly or through component aliases. Choose the nearest sensible step for the composition; do not add a new value just to preserve an arbitrary source gap. For example, Information block padding is 16px, Information Table cells use 8px vertical / 16px horizontal padding, and Accordion uses 12px padding with an 8px icon gap.

Keep geometry distinct from spacing. Existing off-grid icon sizes, fixed control/card heights, column widths and chart dimensions use `size.*`; typography, radii, borders and motion retain their purpose-specific tokens. Do not round those values merely because they are not spacing steps. Do not hide an arbitrary padding or gap behind a `size.*` alias. Alignment offsets may be derived from actual geometry plus canonical spacing, such as a chart label width plus its grid gap.

The Spacing foundation displays only the shared scale. Its ruler is capped by its available track to prevent overflow; the displayed token value and runtime value remain exact. Borders leads with visible examples and lists its tokens below them.

## Related color decisions

Focus borders use blue500; danger and success validation borders use red500 and green500. Their border roles remain separate from text roles. Solid badge backgrounds use the existing 500 shade of each family with white text and icons. Inactive solids use gray500/white. No palette primitive is darkened to conceal the requested finish.

The colored solid badge choices are intentional small-text contrast exceptions:

| Fill / white label | Contrast | Normal-size text at 4.5:1 |
| --- | --- | --- |
| Gray500 | At least 4.5:1 | Pass |
| Blue500 | 4.470:1 | Below threshold |
| Green500 | 2.404:1 | Below threshold |
| Purple500 | 3.957:1 | Below threshold |
| Amber500 | 2.148:1 | Below threshold |
| Red500 | 3.781:1 | Below threshold |

These values document the accepted visual choice; they do not establish full accessibility conformance. The existing light unchecked-control boundary exception and browser-verification limits also remain.

## Maintenance

Trace the property's purpose, update its named alias and all consumers, keep inspector references in sync, and run `node checks/spacing.cjs` plus the affected family and token checks. The spacing gate protects the primitive scale and catches off-grid spacing without changing retained geometry. Rebuild the standalone HTML and source archive after final changes.

This rule is the latest override for earlier source-exact spacing statements in the source notes and historical audits. The original Pitch Protocol code remains unchanged.
