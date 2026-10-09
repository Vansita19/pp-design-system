# Safer visual editing — current behavior and next steps

The temporary-edit safeguard is now implemented. The larger editor redesign and confirmed shared-save workflow below remain proposals.

## What is fixed now

Appearance changes now belong to an in-memory review session. Closing the drawer or reloading restores the canonical component design. Comments remain saved, and saving a comment does not persist appearance changes.

Older saved appearance drafts are retained separately in browser storage and no longer replayed. **More options → Download earlier drafts** appears when recovery data exists. **Copy feedback** and **Download backup** capture the current session before it is closed. Neither action changes shared tokens or source files.

This replaces the previous targeted repair of the accidental default **Button → Overview → Continue** pill radius. The shared button token remains `component.control.radius → radius.lg → 10px`; a stale per-example draft must not override it automatically.

## Why the button still looked different

The old editor saved appearance proposals immediately and replayed them on matching examples, even with the drawer closed. It did not update shared tokens or source HTML, so a local Overview proposal could differ from other button states. A narrowly targeted recovery could not reliably address every stored appearance proposal. The current rule stops all automatic replay of earlier appearance drafts while retaining that work for download.

Other usability improvements remain. The radius list contains primitive values and named aliases for the same value. These are not separate shapes. Medium buttons have a fixed height of 36px, so vertical space depends on height and line height; the current editor exposes neither. Color choices are also missing from the button's edit contract.

## The larger editing flow to build

1. **Make selection simpler.** Use one selection button and clear highlighting. Reduce repeated labels and the long part list. Offer a small on-canvas parent/child control so the outer box and its contents remain separately selectable.
2. **Show relevant properties clearly.** Offer one radius choice per resolved value, with the token name and pixels together. Show horizontal and vertical padding for content-sized elements; expose height and width where dimensions are fixed. Add gap, type, background, text, border and icon controls only where the component consumes them. Colors should show the current token and palette shade, such as Blue 600, with permitted alternatives. A parent selection must not silently rewrite children.
3. **Improve session recovery.** Keep the implemented temporary-edit behavior, then add explicit Undo and Discard controls. Decide and clearly explain what happens on navigation to another page. Earlier drafts must remain separately recoverable rather than silently applied.
4. **Review the scope before saving.** Show meaningful affected groups, such as all buttons or primary buttons only, with an affected-example count and before/after previews. Explain dependencies on forms, dialogs and other compositions. Offer only scopes with an actual shared contract. Treat shared tokens and variant overrides differently.
5. **Confirm, apply and allow undo.** State exactly what will change and where. Check hover, pressed, focus, disabled and loading states for contrast and layout issues. Apply approved edits through shared component or token bindings so Overview, All states and composed uses agree. Keep the previous saved version and provide Undo save.

## What “save everywhere” requires

The current per-example overlay is not sufficient. Each editable property needs an explicit map to its shared component alias, variant and consumers. A blue button adjustment should change the appropriate button alias; changing the primitive Blue 600 value could affect unrelated components.

Permanent saving also needs a defined connection to source files. The standalone HTML currently cannot write changes back into the project. Codex applies an approved batch and rebuilds the file. A future direct-save workflow needs an explicit local file connection, validation and versioned writes. Until then, use **Save proposal** for a proposal action, never **Save changes everywhere**.

Keep backup and recovery outside the main editing flow. Preserve feedback for layout problems that properties cannot express, with page, state and target attached automatically.

## Acceptance checks

Current safeguards to verify:

- Change appearance, close and reopen: the canonical design returns.
- Change appearance and reload: it is not restored from browser storage.
- Change appearance, save a comment, then close: the comment survives; the temporary appearance does not.
- Load earlier browser drafts: they do not apply, and Download earlier drafts preserves their recovery data.
- Copy feedback or Download backup before closing: the current session's appearance proposals are included.

Future redesign checks:

- Parent and child selections expose their own applicable values without duplicate radius aliases.
- Confirm a primary-button change: every intended use updates, unrelated variants stay unchanged, and Undo save restores affected uses.
- Test mouse and keyboard selection, narrow previews, every affected state and source reload. A selected menu value is not proof that the component changed.
