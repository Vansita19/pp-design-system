# Organizer shell reference

Source: https://www.figma.com/design/qukWQNUTgEY6twsgpzDDwc/Untitled?node-id=1-1079

This is a targeted refinement of the organizer chrome. The existing project navigation, content, larger typography, solid/dotted drafting lines, and Pitch Protocol component specimens remain the basis of the app.

| Reference | Applied to | Translation |
| --- | --- | --- |
| Sales CRM sidebar, 1:2604 | Project sidebar and switcher | Flat #171717 sidebar, #181818 header, #2a2a2a selected row; 256px width retained. |
| Sales CRM neutral controls, 1:2796 and 1:2837 | Icon buttons, utility buttons, dropdown controls and composition links | #1e1e1e fill, dark outer edge, 10% white top inset and 6% white inner edge. Hover and pressed states use the same control properties. |
| Workflow tab strip, 1:1227 | Catalogue categories, component sections, foundation tabs | Raised multistop charcoal fill on each segment, reversed darker fill on the active segment, shallow inset and outer shadows, 2px gaps. |
| Workflow selected bolt, 1:1110 | Active Design system rail item | Side-lit charcoal gradient, black edge, layered small shadows, white selection marker with restrained glow. Official Phosphor icon retained. |
| Workflow work surface, 1:1138 | Inset workspace and topbar | #111114 surface, dark outer edge and faint top highlight. |

User refinements supersede the initial surface mapping where noted: shell controls use 8px corners and content panels use 10px. Selected sidebar rows use a flat #343434 fill without an inset highlight. The workspace has no outer frame or inset margin; the sidebar's right border is its only outer divider. The latest spacing override (9 October 2026) places content 32px below the heading separator on every page and uses [the shared spacing rhythm](spacing-system.md) for shell padding, margins and gaps. The separators use precise 3px strokes and 3px gaps at 1px thickness.

Primary navigation and tabs retain 14px text on desktop. The original 13px mobile tabs remain scrollable. Icon controls have at least a 32px target. Inactive navigation labels remain brighter than the reference for readability. The organizer introduces no reference app business labels or content.

Shell surface tokens live in `styles.css` (`--control-*`, `--tab-*`, `--rail-*`) and remain separate from Pitch Protocol component colors. Shell spacing now reuses the shared spacing primitives; the original reference-stage token count is historical.

Verification: existing source checks and packaging integrity are available in `checks/`. Browser rendering and visual comparison of the built app remain outstanding because local browser access was blocked in this session; source reference screenshots were inspected through Figma.
