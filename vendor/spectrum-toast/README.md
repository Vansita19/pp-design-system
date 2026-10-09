# Spectrum toast-stack installation

Original registry source: https://ui.spectrumhq.in/r/toast-stack.json
Documentation: https://ui.spectrumhq.in/docs/toast-stack
Retrieved 2026-10-09. `registry.json` is the original downloaded response.

`components/motion/animated-toast-stack.tsx` and `lib/ease.ts` are unchanged
registry files. Their checksums are in `source.json`. `lib/utils.ts` and LICENSE
were retrieved from Spectrum's public GitHub repository. The source credits beUI.

The app wrapper is `island.tsx`; it uses the original component and state hook.
No original motion code was translated into a different animation system.
Form controls, timer pausing, Hugeicons Stroke Rounded icons and theme mapping are host
integration. The source icon imports resolve at build time to `hugeicons-react.tsx`,
which delegates every glyph to the shared `F.icon` renderer, including close.
The previous icon dependency is not installed or bundled. See `../../docs/feedback-motion.md` for the exact boundary.

Rebuild from this directory:

```sh
npm ci
npm run build
```

Output: `../../dist/spectrum-toast-runtime.js` and `.css` (self-contained).
The build scopes Tailwind without preflight; surrounding pages remain static.
Production dependency licenses are in `THIRD_PARTY_LICENSES.txt`.
The source archive includes this folder except `node_modules`.

Verify from the project root:

```sh
node checks/spectrum-toast.cjs
node checks/action-feedback.cjs
node checks/verify.cjs
```

The runtime test uses happy-dom and Motion's JavaScript fallback, not a browser.
It does not establish visual animation, touch or screen-reader conformance.
