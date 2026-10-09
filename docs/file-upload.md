# File upload

The local selection component adapts the [official AlignUI File Upload reference](https://www.alignui.com/docs/v1.2/ui/file-upload), reviewed on 2026-10-09. It retains the dashed container, centered icon/title/helper, Browse action and file-format rows. Forma's existing Button renderer, Phosphor file icon, typography and semantic tokens replace the reference's React/Slot implementation and bespoke illustrated file format geometry.

This changes the existing `upload` variation only. The source-derived `preview` and `logo-upload` variations remain separate compositions. Original Pitch Protocol files and synced project source files are read-only.

## Selection contract

`F.fileUpload(c)` accepts `multiple` (true by default), `disabled`, `state: idle | selected | error`, and an optional `label`. Each render has unique input/help/error IDs. The Browse action is a real shared button that activates a native file input, with ordinary keyboard activation. The drop target is separate from the input and button, avoiding nested interactive elements or duplicate dropzone tab stops.

Files can be JPEG, PNG, PDF or MP4, up to 50,000,000 bytes per file. `F.fileUploadValidation(file)` checks the filename extension, the MIME type when supplied (allowing an absent or generic binary MIME value), and the size. Size labels use decimal KB/MB consistently. This is local input validation; file contents are not read or sent anywhere.

In multiple mode, valid files append, repeated identical metadata does not create duplicates, and unsupported entries report individual errors. In single mode, a multi-file drop is rejected with a clear message; a new valid file replaces the previous selection. Invalid choices preserve previously selected files. Choosing an actual file replaces any initial specimen examples. The selected state's sample rows explicitly say “Example selection”; actual files say “Selected locally.” The error state's sample error is also explicitly labeled as an example.

Rows show a file glyph/extension, a filename with truncation and full title text, size, local status, and a shared remove button. Removal moves focus to an adjacent row or the Browse action. Errors and selection changes are announced through a local status region; the input's described error and invalid state stay synchronized. The file input resets its value after processing so the same file can be selected again. The local record list is the source of truth, including dropped files.

`F.wireFileUpload(root, registerCleanup)` wires each instance once, supports drag depth across child elements, blocks selection while disabled, resets on a containing form reset, and removes handlers and File references on cleanup. Accepted selection changes dispatch a bubbling `forma:file-selection` custom event with `detail.files`, containing actual locally selected File objects. Example rows are excluded. No remote upload, progress animation, successful-upload state, persistence or server request is implied.

`F.fileUploadTokens(c)` exposes the shared atom dependencies and `component.fileUpload.*` aliases for the drop area, dynamic file/error states, geometry, typography, focus and motion. Dynamic states are included because any enabled idle picker can show files or errors without a catalogue configuration change. Reduced-motion and pause styles apply after mount.

## Verification

`node checks/file-upload.cjs` checks named token references, markup states, escaped copy, unique IDs, the exact size boundary, format/MIME validation, Browse event activation, drag/drop, disabled state, single/multiple behavior, deduplication, local events, removal focus, reset and cleanup against a simulated DOM.

No browser session, local server or deployment was used. Native picker integration, layout, touch behavior and assistive-technology output remain unverified in a real browser. Existing shared-control accessibility qualifications remain in effect.
