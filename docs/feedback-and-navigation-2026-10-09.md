# Feedback and navigation refinements

The October 9 feedback batch extends the existing static Forma organizer, preserving shared atoms and keeping the original Pitch Protocol source read-only.

## Reference and scope

- Spectrum registry references: [Undo pill](https://ui.spectrumhq.in/r/undo-pill.json), [Toast stack](https://ui.spectrumhq.in/r/toast-stack.json), [Status badge](https://ui.spectrumhq.in/r/status-badge.json), and [Task rows](https://ui.spectrumhq.in/r/task-rows.json). Native CSS and scoped JavaScript recreate the requested behavior; these are adaptations, not installed React components.
- [shadcn Alert](https://ui.shadcn.com/docs/components/base/alert) informs compact alert spacing and rounded treatment. Alert now uses 12px corners and padding, with 8px vertical padding for inline alerts. Links use their alert’s state foreground in all appearances.
- Command menu anatomy follows the supplied AlignUI screenshot. Content navigates the actual Forma catalogue. The global native dialog provides search, grouped results, highlighted selection, keyboard hints, arrows/Enter/Escape, focus containment and restoration. Cmd/Ctrl K and the sidebar shortcut open it. The gallery card is a static preview with a live open button.
- Guided popover follows the user-supplied AlignUI code: 320px surface, circular 48px icon container, close control, title/description and divided step footer. Hugeicons Stroke Rounded and Forma buttons replace Remix/React components. Footer layout gap is normalized to the system’s 16px spacing. Four steps are local demonstration content. Initial gallery cards remain in flow; interactive openings use native popovers with a positioned fallback.

## Updated components

Action bar provides selection and undo capsules. The same capsule is composed into Inbox table bulk actions. A six-second undo clock pauses while hovered, focused, hidden, or when animation is paused. Keyboard Delete transfers focus to Undo; Undo restores the selection. Undo expiration clears the reversible table snapshot.

Toast supports up to three notices, enter/exit animation, scaled stacking, expansion on hover, state icons, dismissal and optional local Undo feedback. Newly added notices expire after six seconds, paused for interaction and hidden pages. Seeded notices persist for documentation. Demo Undo does not claim to revert an external action.

Status badge adds Pending, Failed, Success, In progress, In review, Submitted and Expired, with optional icons and the shared badge token contract. Reduced motion disables spinning.

AI progress uses a bordered, rounded task box with dividers, leading state icons, single-line titles, pills and chevrons. Research and stages can advance through a local animated sequence. Manual stage selection appears when the sequence is turned off; fixed state examples remain fixed. Sequences pause with the preview/document and respect reduced motion. Search rows retain single-line truncation and gain 12px horizontal padding.

The separate Response reveal component and generic colored Project details card were removed. Card defaults to Notes; prompt cards remain. The answer-layout AI response template is retained.

## Pitch Protocol suggestion fidelity

Read-only reference: `/Users/vansitaaddanki/pp-admin/investor-preview/conversations.js` suggestions/markup and `styles.css` follow-up rules. The original bent-arrow reference is `assets/chat-suggestion.svg`; the current glyph uses the shared Hugeicons `ArrowTurnForwardIcon`. Pills retain the dashboard’s 13px/18px typography, 32px minimum height, 16px radius, 6px gap, 5px/11px padding, gray border, 3% shadow and hover foreground. Geometry uses existing spacing minus border width where needed. The default group uses the four dashboard follow-up prompts. This is a deliberate source-exact exception to normalized spacing.

## Verification limits

`verification-feedback-navigation-2026-10-09.json` records the actual checks. Markup, token contracts, interaction simulations, timer lifecycle, keyboard handling, unique IDs and Hairline geometry are checked. No browser session, visual screenshot comparison or assistive-technology audit was performed. The HTML and editable ZIP are local packaged deliverables, not a published deployment.

## Capsule button contract correction

The official Spectrum [Undo pill registry](https://ui.spectrumhq.in/r/undo-pill.json), read on 9 October 2026, sets `rounded-full` on both the outer pill (source line 253) and Undo button (line 332). The organizer's existing action-pill CSS also intended fully rounded inner buttons, but its low-specificity border-radius rule lost to the shared Button's inline-token selector. Both action and undo compositions now pass `radius.full` through each shared button's `--demo-button-radius` value, including caller-supplied Inbox actions. The dead CSS radius override is removed. Other buttons retain their native radius, and background, foreground, hover, focus and size tokens are unchanged.

This keeps the already authored capsule treatment. It is not a claim that the original Pitch Protocol Inbox toolbar is a capsule: its later source rules use a light 14 px outer surface and 8 px inner corners. Inbox deliberately composes this organizer's shared action capsule instead. Tests verify the actual emitted custom-property values, unchanged buttons outside capsules, and the existing Undo/focus/timer behavior. No browser visual verification was performed.
