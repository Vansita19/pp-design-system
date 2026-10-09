# Pitch Protocol prompt bar

This component was extracted from the live investor-preview source, read-only. The chat playground was not used as the design source. It replaces the existing composer specimen on its current page, using the source app's actual prompt design without adding a duplicate catalogue page.

## Source evidence

All paths below are under `/Users/vansitaaddanki/pp-admin/investor-preview`.

| Source | Evidence carried into the system |
| --- | --- |
| `build-preview.mjs:8` and `build-preview.mjs:15` | The shipped preview bundles `app.js` and appends styles, color tokens, onboarding, trace, then detail styles. Onboarding input rules are scoped to auth/system catalogue and do not replace this composer. |
| `ui.js:103` | One `workspacePrompt` renders home and conversation variants: textarea, attachment row, add-context, Tools, microphone action, and send. |
| `workspace.js:72` | Homepage uses that shared prompt directly. |
| `conversations.js:194` | Conversation page uses the same prompt with follow-up and pending options. |
| `styles.css:510`, `styles.css:4422`, `styles.css:4518` | Home is a 900px region; conversation reading/composing widths cap at 780px. These are max-widths of the reusable examples, not hard minimum widths. |
| `styles.css:534` | White surface, 20px corner radius, 12px padding, vertical layout. |
| `styles.css:553` | Static four-color underglow: cyan/purple/pink/amber, 28px height, 18px blur, 0.6 opacity, 20px side inset and 6px bottom offset. It is not a focus animation. |
| `styles.css:4409` and `styles.css:5200` | Source overrides settle on a half-pixel border, restrained stacked shadow, 15px/24px text, 32px controls and a 40px send button. |
| `styles.css:5225` | The old source microphone attaches a voice-note file; the user has explicitly replaced that behavior with voice typing. The toolbar has a 4px gap and the final minimum surface height is 112px. |
| `styles.css:5232` | Microphone is a quiet icon action; send has 12px radius and inset shadow; disabled send becomes neutral. |
| `styles.css:6276` | Selected tool appears as a removable 32px pill alongside Tools. |
| `composer-menus.js:6` | Source modes: Search the web, Run deep research, Think longer. |
| `composer-menus.js:15` | Add context includes Attach files, Mention a company, Link a list; company/list pickers are searchable. |
| `composer-menus.js:32` | Selecting or clearing a mode updates the composer and returns focus to its input. |
| `composer-menus.js:38` | Typed `@` and `/` open company/list suggestions; inserted list mentions use `#`. |
| `app.js:675` | Attachments are removable filename items; microphone action chooses an audio attachment rather than recording. |
| `app.js:1101` | Textarea expands from 36px to at most 120px. Enter submits; Shift+Enter and IME composition remain native. |
| `styles.css:4581` | Pending/disabled send suppresses the underglow. Pending retains editable text and context controls. |

## System normalization

Container geometry follows the source. The input is now a multiline contenteditable textbox so company and list mentions can be styled inline; a hidden `name="prompt"` input stays synchronized with its plain-text representation. This is a user-requested behavior change from the source textarea. Colors use current semantic action, text, surface, and blue-tag roles. Source alpha borders, prompt shadows, and the four existing glow stops were preserved as named primitives; component values remain aliases through semantic roles. The send icon keeps its source 17px size. All interface icons use the project's official Phosphor library.

The attachment container follows the approved removable-chip structure with a separate accessible remove button and full-radius shape. The source used an entire button as the removable filename item. Keyboard focus uses the system's single focus ring. The disabled-whole-composer variant is a system addition; the pending state follows source behavior.

Menus reuse the organizer's menu palette, geometry, keyboard helper, and viewport placement. They render in the native top layer, with a body portal fallback, so the specimen container cannot clip them. Search results are static illustrative company/list names; no account data is read.

## API and limits

`F.promptBar({variant, state, value, mode, attachments, mention, glow})`:

- `variant`: `home` or `conversation`.
- `state`: `default`, `pending`, or `disabled`.
- `mode`: `none`, `web`, `research`, or `thinking`.
- `attachments`: `none` or `files`. The removed `voice` value safely normalizes to `none`.
- `mention`: `none`, `company`, `list`, or `both`; sample inline mentions for documentation.
- `value`: plain prompt text; escaped before rendering.
- `glow`: whether to show the original static underglow.

`F.promptBarTokens(config)` supplies the token inspector. `F.wirePromptBar(root, registerCleanup)` adds local specimen interactions.

Attach-file adds an announced local sample file. Voice never adds an attachment: clicking the microphone requests browser speech recognition (`SpeechRecognition` or `webkitSpeechRecognition`) where supported. Interim and final transcripts appear directly in the prompt text. Existing selected content is retained until the first nonempty transcript; adjacent words are separated so dictation in the middle of a draft does not join words together. Clicking it again stops recognition. The preview never starts listening automatically; permission errors, missing support, and network failures are announced without discarding the draft. Recognition and callbacks are stopped/aborted on submit, draft replacement, and preview cleanup.

Speech recognition is browser-provided and may use the browser vendor's remote recognition service; offline availability, browser support, permissions, and transcription accuracy are not guaranteed. This code supplies no transcription backend and makes no separate recording or upload request. File attachment remains a local sample action. Submit only clears the sample draft and announces the preview action; it does not send to an AI backend.

Company mentions are atomic inline blue-500 text at the same 15px font size and medium (500) weight as requested. List mentions are outlined inline tags with an 8px medium-radius alias and a 14px Phosphor List icon. Their transport text remains `@Company` and `#List`; neither is rendered in the attachment tray. Tokens expose the mention and list roles. `@` and `/` preserve the typed replacement range; menu choices restore the last editor caret, or safely append if no selection API exists. Pasted and dropped text is inserted as plain text to avoid importing arbitrary HTML. Enter submits, Shift+Enter inserts a newline, and IME composition is not intercepted. Empty submission announces the error and marks the textbox invalid.

`F.setPromptDraft(editor, text, {start, end})` is the shared integration hook for Start here cards. It returns true when a mounted editable prompt accepted the draft, synchronizes the form value and size, focuses the editor, and applies the requested selection. Disabled/unmounted editors return false. Preview cleanup removes the hook.

Validation: `node checks/prompt-bar.cjs` covers source dimensions, aliases, safe markup, rich mention insertion and form synchronization, keyboard/IME guards, context/tool menus, local file removal, simulated recognition interim/final/error/unsupported paths, and callback/listener cleanup. These are simulated DOM checks. Browser microphone permission, speech recognition, contenteditable undo behavior, visual appearance, and assistive technology review remain unverified.

## Start here card variation

The existing Card page also includes the live homepage's prompt suggestion card, implemented by `prompt-suggestions.js` and `prompt-suggestions.css`. This is a Card variation, not an additional page or a full homepage.

- `workspace.js:65` defines the three current templates: Discover companies, Deep dive into a company, and Prep for a meeting. Titles, descriptions, prompts, and the editable phrase selection follow this source.
- `styles.css:5210–5211` establishes the 12px group gap, 16px corner and 0.6px outline. `styles.css:6297` supplies 24px padding, 22px icon, 16px title, 13px/19px description, and 38px minimum description height. Final overrides at `styles.css:6356` establish an automatic height of at least 168px, a 120px inner minimum, and 22px title line height. The outline does not consume layout space, preserving the original 168px minimum geometry.
- The source `smooth-cards.js:3` used a tangent-curve construction. The latest user override removes that treatment entirely: suggestions keep their 16px token radius through ordinary CSS `border-radius`. No painter, smoothing token or resize observer is needed for their corners.
- `app.js:846` fills the prompt, focuses the textarea, and selects the variable phrase. The reusable version does the same when placed in a form with a prompt textarea or given an explicit `targetId`.

`F.promptSuggestions({intent, layout, disabled, targetId})` supports `discover`, `research`, and `meeting`; `layout` is `single` by default or `group` for all three. `F.promptSuggestionTokens` exposes the aliases. `F.wirePromptSuggestions` adds native button behavior and listener cleanup. It uses `F.setPromptDraft(editor, text, {start, end})` for the shared editable prompt so text, hidden form value and selection stay synchronized; external native textareas retain their input-event/focus/selection fallback. A disabled, read-only or unwired editor is not reported as updated. When shown on its own, a card announces its suggested prompt locally; it does not start research, navigate, or call a backend. The optional group responds to its available container width.

The actual current templates replace the older homepage attention/deal card styles as this variation's source. Source icons are Lucide Search/Telescope and Hugeicons Stroke Rounded Notes, each with a 1.5px outline. Their meanings are kept with the existing official regular Phosphor Search, Binoculars (the registered research alias), and File icons under the user's single-library rule. These homepage icons are not filled in the original source. Shared text/surface/border tokens already resolve to the exact corresponding source gray values. `node checks/prompt-suggestions.cjs` verifies 12 configurations, seven prompt interaction contracts, ordinary CSS radius and listener cleanup. Browser review remains pending.

## Latest spacing override — 9 October 2026

Prompt padding and gaps follow [the shared spacing contract](spacing-system.md); mode-tag horizontal padding is now 12px. Prompt/control heights, icon sizes, glow geometry and radii retain their existing values. Geometry-only values use `size.*` and no longer expand the Spacing foundation.

## Listening animation · 9 October 2026

The existing speech recognition lifecycle now shows the shared Waveform renderer after recognition starts, and hides it on stop, end, error and teardown. It is a decorative listening indicator with reduced-motion and pause support, not a measured audio level. See [Compact AI patterns](compact-ai-patterns.md).

## Icon migration — 9 October 2026

The current user-selected UI library is Hugeicons Stroke Rounded. Shared `F.icon` normalizes small glyphs (16px and below) to a 1.25px stroke and larger glyphs to 1.5px. Prompt suggestion cards already call that shared helper. Their icon purpose, sizing, source layout and interaction remain unchanged. AI follow-up suggestions now call the registered `arrow-return` helper instead of embedding a separate source SVG; this is the requested icon-library normalization, not a change to the source arrow’s meaning.
