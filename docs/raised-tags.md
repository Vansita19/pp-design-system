# Raised tags and information cards

The raised finish now belongs to the separate Tag family, as requested on 9 October 2026. It represents the white tags used in Pitch Protocol's detail-card headings. Static tags remain spans; S1/S2 citations remain buttons that open source details. Removable chips and research file chips retain their separate behavior and appearance.

## Source and shared geometry

Latest spacing override (9 October 2026): [the shared rhythm](spacing-system.md) replaces arbitrary source padding/gaps. Raised large tags use 12px horizontal padding and the shared 6px indicator gap; the source heights, type, radii and shadows are retained.

The live source is `investor-preview/detail-pages.js` (`tag`, `citations`, `card` and the Company Overview assessment) and `detail-pages.css` lines 2, 10–18 and 41. This stylesheet is appended last by `build-preview.mjs`; older prose about citation dimensions does not override it.

| Element | Retained construction | Shared contract |
| --- | --- | --- |
| Header tag | White surface, 23px height, 12/15px regular text, 8px horizontal inset, 6px radius | `component.tag.*` |
| Inline citation | White surface, minimum 20px width and 18px height, 10/14px regular text, 2px × 4px padding, 6px radius | `component.citation.*` aliases the raised family's small type, surface, radius, weight and shadow |
| Information shell and body | 12px radius, 2px outer inset, 16px body padding, 0.5px body border | `component.information.*` |
| Assessment inset | 8px radius, 12px × 6px padding, 12px icon centered in a 20px column, 4px gap | `component.information.callout*` |

`shadow.tag` retains the source's shared edge and depth:

```css
0 0 0 1px rgba(0,0,0,.06),
0 1px 2px -1px rgba(0,0,0,.06),
0 2px 4px rgba(0,0,0,.04)
```

Neutral tag text maps from source `#585858` to gray600; citation text maps from `#386bff` to blue500. The source background remains white. Raised and citation colors are unchanged; solid badge foregrounds follow the later white-text update described below. Keyboard focus preserves the citation's 6px radius and adds the shared focus ring.

## Assessment hierarchy

The source has a darker heading than its supporting text. Scoped semantic and component aliases preserve that hierarchy: blue50 surface, blue900 heading, blue800 body and blue500 icon. These are deliberate mappings to the existing palette, rather than new primitive colors or changes to global informational semantics. Heading typography remains 16/20px at weight 500; body text remains 14/22px.

The original assessment asset is a filled note/document with a notification dot. The organizer uses the official Phosphor `NoteFill` through the common icon registry. This preserves the filled visual weight while following the single-library rule; it is a documented icon substitution, not the exact original asset.

## Current corner choice and limits

The latest user request removes corner smoothing everywhere, superseding all earlier percentage settings. Cards, tags, badges and citations use their existing CSS `border-radius` values. Their native backgrounds, borders and shadows share that ordinary curve. Icon-only badges remain circles and recommendation badges remain capsules.

`checks/pitch-patterns.cjs` covers raised-tag sizing, assessment roles and icon, and circular badge token reporting. `checks/ai-response.cjs` covers citation aliases and unchanged focus radius alongside source-popover interactions. These are source, rendering-contract and simulated-event checks; browser visual validation remains outstanding.

## Inbox status finishes

Two further finishes on the same Badge family preserve the distinction between a system recommendation and a personal decision. They reuse the shared renderer and inspector; they do not replace `soft`, `outline`, `solid` or the separate raised Tag.

| Finish | Source composition | Shared roles |
| --- | --- | --- |
| `status-neutral` | White recommendation, dark 14/22px medium label, 8px colored dot, 4px gap, 12px horizontal inset, 27px overall height, 16px radius, 0.5px faint outline | `component.badge.statusNeutral.*` and `component.badge.status.*` |
| `status-subtle` | Tinted decision, dark 14/22px medium label, 14px filled icon, 6px gap, 8px horizontal inset, 26px height, 8px radius, no border or shadow | `component.badge.statusSubtle.*` and `component.badge.status.*` |

These finishes have one source size; passing `sm` or `lg` does not manufacture new proportions. Label color and indicator color are independent. Active labels use `semantic.text.heading`; indicators use the corresponding existing 500 color primitive. Tints reuse existing light badge colors, with amber50 for the source's pale warning surface. The source's mixed green/red surfaces are deliberately normalized to the closest existing light palette entries rather than adding a new palette.

The source is `styles.css` `.recommendation` and the later Inbox overrides at lines 5489 and 5640–5649. `shadow.status` follows the active Inbox override, **0 1px 1px rgba(0,0,0,.05)**, rather than the earlier generic recommendation's 2px blur. The decision glyphs are the source's unchanged official Phosphor `CheckCircleFill`, `EyeFill` and `XCircleFill`, registered as `check-circle-fill`, `eye-fill` and `x-circle-fill`.

`status-neutral` uses a **true round capsule**: the source's 16px CSS radius naturally clamps to half its 27px height. Its white surface, outline and quiet shadow use the same native curve.

`status-subtle` keeps its source 8px CSS radius. Icon-only badges stay circular. All of them are passive status labels; an interactive removable filter remains a Chip.

## Category pills

`category` is another appearance on the existing Badge page, used by the repeated Series A / Live pairing and the Inbox stage column. It preserves the two sizes found in the active source, rather than repurposing generic small/medium badge geometry:

| Size | Source | Retained geometry |
| --- | --- | --- |
| `sm` | `styles.css:4458`, `.chat-result-table .pill`; `conversations.js` category cell | 18px height, 11/16px regular type, 6px horizontal inset, 6px radius |
| `md` | `styles.css:1933`, `.stage-pill`; `ui.js` stage helper | 26px height, 14/22px regular type, 8px horizontal inset, 8px radius |

There is no invented large source size; `lg` normalizes to the default size. Category pills have no transparent layout border and no shadow. Blue uses the existing blue100 source tint; other colors reuse the system's existing badge surface and readable foreground roles. Exact source colors that conflict with the established readable semantic foreground are deliberately normalized.

Category pills retain their 6px or 8px ordinary CSS radius. Recommendation capsules remain round and icon-only badges circular.

## Standard badge radius

Soft, outline and solid badges use an 8px ordinary CSS radius. Raised tags and compact categories retain their 6px source radii; default categories and status-subtle retain 8px. Icon-only badges and status-neutral capsules keep native circular/capsule geometry. All inspector contracts report the relevant radius token without smoothing.

Latest color override (9 October 2026): solid labels and icons are white, and all tone fills use their existing 500 shade. Inactive solids use gray500/white. This supersedes the earlier darker-solid treatment. The colored pairs intentionally fall below 4.5:1 for small text; exact ratios and qualifications are recorded in [the current contract](spacing-system.md#related-color-decisions). Soft, outline, raised, category and status palettes are unchanged.

Tag has its own `tag.js` / `tag.css` source and catalogue page, with raised, outline and subtle appearances. Table/detail heading compositions call `F.tag` directly. Legacy `component.badge.raised.*` aliases remain for compatibility; new citations reference `component.tag.*`. Old Badge links with `variant=raised` migrate to Tag.
