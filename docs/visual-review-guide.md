# Edit a preview and leave feedback

Open `artifacts/forma-design-system.html` and choose a component. **Tweak** and **Comments** sit beside its Overview / All states tabs. Refresh an already open copy to load the latest controls.

**Appearance changes are temporary. Closing the review drawer or reloading the page restores the original design. Comments remain saved.** To keep an appearance proposal for review, use **Copy feedback** or **Download backup** before closing.

The drawer has two tabs: **Design** changes how a selected part looks; **Comments** saves a note about it. On wide screens, the drawer reserves space beside the preview. On smaller screens, the preview stays above it, with separate scrolling.

## Try a change

1. Open **Tweak**, then click the part you want to change in the preview. Use **Pick on preview** whenever you want to select another part. Its name and parent path appear at the top of the drawer.
2. Choose a setting under **Appearance**. Corners and spacing use existing system values; supported buttons also offer their existing appearances. Only settings supported by the selected part are shown. Corners use ordinary CSS radius, with no corner smoothing.
3. To replace an icon, select the icon in the preview. Under **Replace icon**, search by name or click a visible symbol. Each choice has its own name, and the selected symbol is marked. The preview changes immediately.
4. Use **Compare with original**, then **Back to changes** to compare your proposal. **Reset** restores the selected part.
5. Before closing, choose **Copy feedback** or **Download backup** if you want to keep the proposal. Closing discards the temporary appearance changes.

Choosing a part selects what to edit; it does not replace it. **Choose a part from a list** is another way to select something, not the icon picker. To edit an outer box after picking its child, click that box in the parent path.

While the drawer says **Click a part…**, preview clicks select elements. Press **Escape** to stop picking and use the component normally. Press Escape again to close the drawer and discard temporary appearance changes. Unsupported parts remain commentable and explain that they have no appearance settings.

For example: Command menu → Tweak → select the menu's outer panel → Corner radius → **2XL**. This previews the existing `radius.2xl` token for that example and configuration. Shared token definitions and other components stay unchanged.

## Leave a comment

Open **Comments**. If needed, use **Pick on preview** to select the relevant part. Write what should change, then choose **Save comment**. Use comments for alignment, responsive layout, missing content, or anything the appearance settings cannot express. Select **Preview** from the part list for feedback about the whole example.

The page, variation and selected part are attached automatically. Click a saved comment's part name to return to it. Use **Mark done**, **Reopen** or **Delete** to manage notes; the filter switches between Open, Done and All.

Saving a comment does not save temporary appearance changes. Comments survive closing the drawer and reloading. Temporary interactions inside the example, such as sorting rows or selecting a calendar day, are not replayed; describe those details in the comment.

## Send one batch

Choose **Copy feedback**, then paste into this Codex chat. It includes open comments and the current session's appearance proposals, with the original and requested values. It does not send chat messages automatically.

For a file instead, expand **More options** and choose **Download backup**, then attach that JSON file here. Do this before closing the drawer if the batch includes appearance changes.

**Restore backup** merges a previous batch. Its appearance proposals belong to the temporary review session; imported comments are saved. It accepts only existing component, token, icon and button contracts. If a referenced part or its original value has changed, or two proposals conflict on the same icon, those proposals remain unavailable for manual review instead of overwriting the current source.

**More options** also contains **Reset all changes** and **Preview width**. Width changes the specimen's available space; it does not emulate a phone or change browser viewport breakpoints. Reset all changes clears current appearance proposals, not comments.

## Earlier drafts

Previous editor versions saved appearance changes automatically. Those older drafts are kept separately for recovery, but are no longer applied to previews. This prevents an old pill-radius proposal from silently changing a button after refresh. The earlier targeted Button Overview repair is superseded by this rule for all appearance drafts.

If earlier drafts exist, **More options → Download earlier drafts** exports them. Attach the file here to review or recover that work. It is separate from **Download backup**, which captures the current review session.

## What is saved

| Item | What happens |
| --- | --- |
| Appearance changes made now | Kept in memory for this review session. Closing the drawer or reloading discards them. |
| Comments | Saved in this browser and restored after reload. |
| Earlier saved appearance drafts | Retained separately in browser storage for download; never automatically applied. |
| Shared components and tokens | Unchanged by the editor. Codex must apply an accepted proposal to source and rebuild the HTML. |

Download any needed backup before replacing or moving the HTML, clearing browser data, or changing browsers. Local-file storage can vary by browser; the panel reports when comment storage is unavailable and work can only remain in memory.

There is no **Save everywhere** action. Send the batch and ask Codex to apply accepted changes to the component source, check dependent compositions, and rebuild the file. The original Pitch Protocol files remain read-only. [The next-stage proposal](visual-editing-next-steps.md) describes richer controls and a future confirmed shared-save workflow; those features are not implemented.

The drawer uses native organizer code and existing components and tokens. The [reference review](review-editor-references.md) records the Tweakpane, GrapesJS and Agentation interaction patterns studied; these libraries were not installed or copied into the editor.

For future audits, token mapping and documentation requests, see the [toolkit usage guide](toolkit-setup.md). [Review studio checks](review-studio-checks.md) distinguishes verification evidence from proposed acceptance checks.
