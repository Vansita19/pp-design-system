# Visual review: implementation references

Reviewed 9 October 2026 against the maintainers' documentation and source repositories. These references inform the editor repair; they are not installed packages or claims that this organizer uses their code.

## Recommendation

Keep the organizer's existing token registry, Hugeicons renderer and preview lifecycle. Use the simple control model demonstrated by **Tweakpane**, the selected-element properties model from **GrapesJS**, and the feedback flow demonstrated by **Agentation**. The immediate work is to repair the connection between each selected element, the displayed control and the live preview, then simplify the panel.

Tweakpane is the closest package to this static HTML architecture if a controls library is needed later: it is dependency-free and can mount inside a supplied container. It does not automatically identify an existing DOM component, apply this project's tokens, or attach feedback to its catalogue state. Those adapters remain our responsibility. [Tweakpane overview](https://tweakpane.github.io/docs/), [custom containers and change events](https://tweakpane.github.io/docs/misc/).

## What already exists

| Reference | Useful behavior | Fit for this organizer | Verified license |
| --- | --- | --- | --- |
| [Tweakpane bindings](https://tweakpane.github.io/docs/input-bindings/) and [events/container API](https://tweakpane.github.io/docs/misc/) | A label and an appropriate control; preset choices; immediate value events; refresh after an external change; explicit disposal. | Best library fit for a small static control pane. A DOM-selection and token adapter would still be necessary. | [MIT](https://raw.githubusercontent.com/cocopon/tweakpane/main/LICENSE.txt) |
| [GrapesJS Style Manager](https://grapesjs.com/docs/modules/Style-manager.html) and [right-panel layout example](https://grapesjs.com/docs/getting-started.html#style-manager) | Show properties for the current selection; constrain available properties; use selects limited to design tokens; keep editing controls in a separate panel. | Strong interaction reference. Adopting its component model, canvas and editor lifecycle would be a larger migration than repairing this preview inspector. That integration cost is our assessment. | Core: [BSD 3-Clause](https://raw.githubusercontent.com/GrapesJS/grapesjs/dev/packages/core/LICENSE). The separate Studio SDK is not assessed here. |
| [Leva panel configuration](https://github.com/pmndrs/leva/blob/main/docs/getting-started/configuration.md) | Fill a parent container, simplify the title bar, use readable labels and separate control stores. | React-oriented panel. Introducing another framework-owned editing layer adds little to this native HTML catalogue; this is our integration assessment. | [MIT](https://raw.githubusercontent.com/pmndrs/leva/main/LICENSE) |
| [Storybook Controls](https://storybook.js.org/docs/essentials/controls) | Edit explicit component arguments and see the resulting state immediately. Each control has an actual component input behind it. | Useful contract and test model. This app already has a catalogue and configurations; adopting the Storybook runtime would mean a separate toolchain. | [MIT](https://raw.githubusercontent.com/storybookjs/storybook/next/LICENSE) |
| [Agentation](https://www.agentation.com/) and [official source/requirements](https://github.com/benjitaylor/agentation) | Point to an element, add a note, copy a structured batch with its context. Direct agent sync has an explicit integration step. | Closest feedback reference. Its documented component requires React 18+; direct sync also needs its MCP endpoint. This repair does not install that connection or claim comments are automatically sent. | [PolyForm Shield 1.0.0](https://github.com/benjitaylor/agentation/blob/main/LICENSE); this is source-available, not an MIT/BSD reference for copying implementation. |

No upstream implementation has been copied or vendored for this research. If a package or substantial source is later reused, record its exact version/commit and retain its accompanying notices before packaging it. No bundle-size measurements were made; the integration comparisons above concern architecture, not claimed download sizes.

## Apply these ideas to our panel

1. **Keep the preview visible.** Put the review drawer beside the workspace and reserve its width. At narrow widths, use a layout that still lets the user reach the selected element rather than covering it with a floating panel.
2. **Selection and editing are separate actions.** “Pick an element” selects the part to edit. It must not look like an icon-replacement control. Show a useful selected name, such as “Search icon · Search bar” or “Close icon · Default menu.”
3. **Show only useful controls.** An icon gets an icon picker. A button gets its supported style options. A surface gets its available corner and spacing tokens. Unsupported parts get a short explanation and an option to leave a comment.
4. **Icons should be recognizable.** Show the Hugeicons glyph beside a distinct name and provide search. Keep the selected icon marked. A change should redraw that exact glyph immediately, without losing selection when its SVG node changes. This is a proposed project-specific control, not copied from one of the libraries above.
5. **Changes should prove themselves.** The control value, the visibly selected element and its rendered output must agree after every change, reset, comparison and page/state switch. A saved record alone is not evidence that the edit was applied.
6. **Comments need three steps.** Pick a part if needed, write the note, add it. Show its page/state automatically. Keep batch copy available; move import/export and other infrequent options out of the main flow.

## Browser checks required for the repair

Test the actual packaged HTML as well as the source modules. In particular: select two different icons and replace each; repeat a replacement on the same icon; change corners and spacing; change a supported button style; compare/reset; switch catalogue states; close and reload to restore the source appearance while comments survive; add and copy comments; and resize the workspace with the drawer open. Check that the drawer does not overlap the preview and that the same control works on repeated instances without changing its neighbor. Earlier browser drafts must remain archived without automatically changing previews.

These are acceptance checks for our implementation, not test results from the reference libraries. Record actual results separately; a DOM-only test cannot establish the browser appearance or click target behavior shown in the user's screenshot.
