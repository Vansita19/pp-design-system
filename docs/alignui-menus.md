# AlignUI-inspired menu compositions

Reference inputs are the user's complete pasted dropdown and command-menu React examples, read on 2026-10-09, plus the official [AlignUI dropdown](https://www.alignui.com/docs/v1.2/ui/dropdown) and [command menu](https://www.alignui.com/docs/v1.2/ui/command-menu) documentation. These are visual and composition references, not imported runtime components or a claim of pixel equality. Forma keeps its existing colors, token registry, shared atoms, Hugeicons Stroke Rounded icons and static JavaScript runtime.

## Dropdown

`F.dropdownMenu(c)` retains the shared menu positioning, native popover/portal fallback, keyboard model, disabled behavior and cleanup. `appearance: 'sectioned'` is the default; `'basic'` retains the compact action example. `variant` continues to mean the trigger button variant. `identityHeader: true` adds a neutral Design system / Component library identity using `F.avatar` and `F.badge`; it does not imply a signed-in user or subscription. Its composition and token inspector include these atoms only while the identity is rendered.

The sectioned default uses named Browse and Components groups, separators, leading icons and subtle row highlighting. Its entries are real local catalogue links: All components, Colors, Typography, Button, Input and Modal. Mouse and keyboard selection navigate to those destinations. Safe local links render as anchors with menuitem roles; disabled links render as disabled menuitem buttons. Caller-provided `items` still support labels, icons, shortcuts, separators, group captions, disabled and destructive states. Custom action examples retain their prior local “selected” feedback; they do not perform edits, downloads or deletions. The supplied account, dark-mode, logout and billing actions were not copied because this organizer has no corresponding account workflow.

`F.dropdownItems(c)` exposes the exact rendered item definitions. Sectioned popup geometry uses `component.menu.sectioned.width → layout.content.dropdown` (280px) and `component.menu.sectioned.radius → radius.2xl`; identity spacing and text values alias existing roles. Colors continue to come from the menu's shared semantic aliases. Viewport collision handling still clamps popup dimensions.

## Command menu

`F.commandMenuPreview(c)` provides the inert catalogue illustration plus a working opener. `F.wireCommandMenu(document)` owns the native modal, live catalogue navigation, search, keyboard interaction and cleanup. No second mock command data source is introduced.

`scopes: true` is the default. The “Searching in” area composes existing neutral `F.chip({variant:'filter'})` atoms for Foundations and Components. Removing a scope excludes that class of destination from subsequent results immediately; removing both produces an empty result set. “All scopes” restores both. Focus returns to the search input after a scope change, and Tab containment includes every currently available chip removal and reset button. `scope: 'all' | 'foundations' | 'components'` chooses the illustrated starting scope and carries it into the opener; `scopes: false` hides scope controls and searches the full catalogue. `F.commandMenuTokens(c)` includes chip tokens only when scopes are rendered.

An empty query shows grouped suggested destinations from the actual visible catalogue. Typing searches all matching visible destinations within the active scopes, including aliases and multiple query words. Hidden pages and aliased duplicate pages remain excluded. Arrows update the input's active descendant; Enter opens its real route. Native dialog containment, explicit Tab cycling, Escape, outside dismissal, focus restoration, scroll restoration and BFCache-aware cleanup remain supported. The supplied transaction/account examples, help-center link, AI prompt actions and See All link were replaced by supported navigation and scope behavior rather than inert business controls.

The compact search header, white rounded 560px surface, blurred backdrop, shared filter chips, grouped rows and compact keyboard footer use Forma's own atom/token contracts. No Remix icons, React, Radix or cmdk dependency was added.

## Verification boundary

`checks/menus.cjs` executes markup/token contracts and a simulated DOM event fixture, including sectioned navigation by keyboard and pointer, disabled links, optional identity composition, viewport positioning and cleanup. `checks/command-menu.cjs` executes actual handlers against a simulated DOM, including alias search, scope removal/reset and empty-scope recovery, suggested destinations, Tab containment, focus return and lifecycle cleanup. Syntax and spacing checks also cover the changed files.

These checks do not establish rendered visual fidelity, zoom behavior, native browser geometry or assistive-technology conformance. No browser session, local server or deployment was used for this update, consistent with the workspace restrictions.

The 9 October 2026 filter correction raises the shared small multiselect chip-field inset from 2 to 4 px so selected capsules have visible breathing room. Shared select/combobox chevrons now resolve to `component.control.chevron → space.16`, retaining official Hugeicons Stroke Rounded geometry and the shared secondary icon foreground. This is an intentional system consistency change from the original 14 px control glyph, not an exact AlignUI/source dimension.
