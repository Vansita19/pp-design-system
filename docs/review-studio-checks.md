# Review studio verification

## Current temporary-edit contract

The earlier targeted Button Overview recovery is superseded. Production review sessions now keep appearance changes in memory. Closing the drawer or reloading restores canonical component styles; comments remain persisted. Earlier saved appearance drafts are archived for separate download and never automatically replayed. Copy feedback and Download backup capture the current session before it closes. No shared or global save is implemented.

`checks/review-button-recovery.cjs` passed in isolated Chromium against the source app (`dist/index.html`). It seeds an earlier 20px pill-radius draft and an existing recovery archive, then confirms the original 10px button on load and on opening Tweak. It verifies separate comment persistence, temporary-edit reset on close/reopen/reload/Escape, current-session and earlier-draft exports, and cancellation of a delayed import after the drawer closes. The archive remains recoverable.

`checks/review-context.cjs` also passed all **1,428 configuration contexts**. The button lifecycle regression also passed against the newly packaged standalone HTML; see the completed verification below.

The table below records the full current contract; it is broader than the focused button regression alone.

| Area | Required evidence |
| --- | --- |
| Legacy recovery | Seed earlier saved appearance drafts, including a pill button radius. Loading the app keeps the canonical appearance. Download earlier drafts preserves the archived proposals. |
| Temporary changes | A supported radius, spacing, icon or appearance choice updates the selected preview immediately without changing shared tokens or writing an active appearance draft to persistent storage. |
| Closing and reloading | Closing restores canonical styles and original icon nodes. Reopening or reloading does not replay the discarded session. |
| Comment independence | Save a comment after changing appearance, then close and reload. The comment survives; the appearance edit does not. |
| Export before closing | Copy feedback and Download backup include current temporary proposals and open comments. Recovery export remains separate. |
| Restore backup | Valid proposals enter the temporary session; comments are persisted. Closing still discards temporary appearance changes. Unsupported or unsafe data is rejected. |
| Compare and reset | Comparison temporarily displays the original. Reset removes the selected proposal; neither changes canonical tokens. |
| Component redraw | A running component retains a valid temporary change while the session is open. Closing restores its canonical appearance. |
| Storage failure | A failed comment/archive write is reported without falsely claiming persistence or destroying the original stored data. |
| Scope and cleanup | Changes stay within their named page, configuration and target. Cleanup restores original nodes and removes editor listeners without removing component listeners. |

The fixed button baseline is `component.control.radius → radius.lg → 10px`. The editor can temporarily preview a different radius, but an old saved proposal must not change that baseline on refresh.

## Existing automated checks

`node checks/review-studio.cjs` uses happy-dom with Forma's real token registry, icon renderer, component markup and review modules. It does not launch a browser or server. The existing dependency is `vendor/spectrum-toast/node_modules/happy-dom`; no separate dependency is needed.

The focused fixture exercises actual DOM events. The full-app fixture loads the scripts and stylesheets from `dist/index.html`, including the app router and production toast runtime. It checks preview registration, navigation and computed values; uncaught window errors fail the fixtures. Only the full-app fixture disables happy-dom's incomplete Web Animations implementation so Motion uses its JavaScript fallback.

`node checks/review-controls-browser.cjs` checks whether offered properties affect their consuming CSS in real specimens. `node checks/review-browser.cjs` exercises user paths in isolated Chromium. Set `FORMA_REVIEW_HTML` to the packaged HTML path to test the delivered file. Tests that previously expected appearance persistence after closing or reloading must instead verify the temporary-edit contract above. Comments still require persistence coverage.

Source/event assertions do not establish browser appearance, pointer hit-testing, zoom or screen-reader behavior. Tests must use isolated browser data, not the user's personal profile.

## Historical evidence — before the temporary-edit safeguard

These results describe earlier implementations. Their appearance-persistence behavior is superseded and must not be treated as current expected behavior.

The earlier `checks/review-button-recovery.cjs` repair targeted one accidental default Button Overview pill-radius draft. It retained other drafts and allowed new appearance edits to persist. That narrow recovery did not solve the broader automatic-replay problem and is replaced by the archive-and-temporary-session rule.

The prior Chromium edit-contract audit rendered **1,428 All states specimens**, deduplicated **2,257 descriptor/property contexts**, compared consuming CSS after **1,385 token edits** and **174 supported button appearance edits**, and replaced **69 distinct Hugeicons**. It reported zero ineffective offered edits after correcting 59 original no-op cases. This was automated contract coverage, not manual visual review of every combination.

The prior browser user-path check covered selection labels, icon choices, comparison/reset, radius/padding/button changes, comments, copy, keyboard focus and non-overlapping layouts at **1440, 1100, 1000, 900, 768 and 390px**. Desktop Design, desktop Comments and compact-layout screenshots were inspected. It also checked changes during a running AI task redraw. Its old assertions that appearance drafts survived drawer closing and reload are obsolete; the current contract requires the opposite.

Historical machine-readable results are in `checks/review-controls-browser-results.json` and `checks/review-browser-results.json`, with images in `artifacts/review-editor-*.png`. Their contents may be refreshed by later runs; interpret them together with the recorded target and the test source. They do not establish cross-browser, physical touch, zoom or assistive-technology conformance. Browser edits never automatically modify shared tokens or send chat messages.

## Completed temporary-preview verification

The source and packaged HTML both pass `checks/review-button-recovery.cjs` in isolated Chromium: the legacy 20px pill and prior recovery data stay archived, the button computes to 10px, current changes apply only inside the active review session, close/reopen/reload/Escape restore the source, comment saves exclude temporary appearances, exports retain the intended batches, and delayed imports cannot repopulate a closed session. Obsolete archived properties remain preserved without blocking valid comments. No page errors occurred. `artifacts/button-restored.png` shows the packaged result.

The updated `checks/review-studio.cjs` and `checks/review-context.cjs` pass. `checks/review-browser.cjs` passes real user paths at 1440, 1100, 1000, 900, 768 and 390px against source, including restoration of radius, padding, variant and an animated badge after close. The unchanged full property-effect audit was not rerun; its studio now opens before applying icon edits. `checks/corner-radius.cjs` passes all 1,428 specimens with ordinary CSS radii. These checks do not access the user’s Brave storage; refresh the existing file there to use the new behavior.
