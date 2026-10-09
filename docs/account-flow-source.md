# Account flow — source parity

This update restores the left-hand onboarding composition from the original Pitch Protocol module graph. The local source stays read-only. The right-hand side is intentionally a blank neutral gray placeholder at the user's request; the previously invented blue workspace, thesis card and summary are removed.

## Evidence read

The source build entry, `/Users/vansitaaddanki/pp-admin/investor-preview/build-preview.mjs`, concatenates `styles.css`, generated color tokens, `onboarding-system.css`, `trace.css`, and `detail-pages.css` in that order. The onboarding rendering lives in `onboarding.js`; its complete choices and exclusivity/validation rules live in `onboarding-preferences.js`. `trace.css` and `detail-pages.css` contain no later onboarding overrides.

Relevant live source sections:

- `onboarding.js`: `onboardingDraft`, `inviteInput`, `workspaceFields`, `preferenceFields`, and `onboarding` (lines 7–99).
- `styles.css`: base auth-card/auth-form/auth-fields geometry (lines 1235–1328), team layout and combined invitation rows (lines 4142–4251), and final role/dropdown sizing (lines 4294–4324).
- `onboarding-system.css`: source typography/control roles, hover/focus/touch delete behavior (lines 58–77), final onboarding dimensions and field layout (lines 110–138), and currency/check grid (lines 171–178).
- `icons.js` and `lucide-data.js`: the source `user` key resolves to an outlined `user-round` glyph, rendered with 1.5px stroke at 18px inside the invitation row. The source does not use a person emoji or a filled avatar glyph for this row.

## Restored source details

| Step | Left-hand content and arrangement |
| --- | --- |
| Create Your Workspace | Exact source heading/subtitle; empty 64px logo surface and Upload action; initially empty Fund Name with “e.g. Topology Ventures”; initially empty Thesis summary with the source placeholder; full-width Add Workspace action. |
| Set your investment preferences | Exact source heading/subtitle; Funding rounds and Sectors side by side; Geography across the width; initially empty choices with “Select…”; complete source option lists; Initial check size with No preference and a USD/MIN./MAX. row; full-width Set Preferences action. |
| Finish Setup | Exact source heading/subtitle; Invite team members label; one initially empty email row with an outlined user glyph, Member/Admin role control, and delete action; Add another; full-width Finish Setup anchored to the bottom. |

The source card is 1000px wide and 506px high, split into equal columns. The form uses 40px padding and a 28px/33px heading. Workspace/preferences fields are placed toward the bottom after the heading and description. Team fields begin 32px below the subtitle; the primary action stays at the bottom. The combined team row is 40px high, the borderless role selector 28px high, and the delete action expands from zero width to 26px on hover or keyboard focus. Touch always exposes deletion. Additional rows scroll within the source 206px list cap.

The invitation step retains the corrected source labels and read-only invited email. Profile values remain local examples. All submission, logo selection, preference selection and invitation editing continue to affect only this organizer preview.

## Deliberate system normalization

Buttons, inputs, textarea, checkbox, select/combobox menus and their focus treatment use existing Forma atoms and token contracts. The row's source outline icon purpose/size is preserved through the shared Phosphor `user` icon; the upload action uses the shared Phosphor `upload` icon. This avoids introducing a second icon family into the organizer. The source trash action is represented by the shared Phosphor trash glyph and ghost button.

Source spacings outside the canonical scale are normalized explicitly: 10px grid/group gaps become 12px, and the invitation list's ±3px focus allowance becomes ±4px. The 13px/28px role control, 26px delete control, 38px inner input and 90px currency column remain named geometry. The source's literal gray text/borders, action blue and focus shadows map by purpose to the current semantic aliases. The right placeholder uses `semantic.surface.subtle`. No source illustration is substituted or recreated.

The source multi-select popup is adapted to the shared searchable multiple Combobox, preserving all option names, empty defaults and exclusive No preference behavior. Its selected values use shared chips. The standalone Range specimen and approved Settings layout/Form layout renderers keep their existing presentation. Onboarding has scoped row/range/logo markup and CSS so these repairs do not restyle those accepted pages.

At constrained specimen widths the card becomes one column and hides the empty placeholder, consistent with the source's responsive intent. A container query uses the available specimen width rather than the outer application window width.

## Verification limits

`checks/source-shell.cjs` verifies the source-derived labels, empty values, complete choices, combined team-row structure, absence of fabricated illustration markup, token mappings, and local behavior. When the read-only source is available it compares the restored strings and option lists against those files and verifies stylesheet precedence. Existing checks continue to cover form validation, native-dialog lifecycle, delegated events and cleanup. Source and simulated-event checks do not establish browser visual parity, actual menu layout, touch behavior or assistive-technology conformance. No browser, local server or deployment was used.
