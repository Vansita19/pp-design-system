# Switch motion

Reference: [Spectrum UI Animated Switch](https://ui.spectrumhq.in/docs/animated-switch), inspected 8 October 2026. Its public preview describes a thumb that stretches on press and settles as the switch changes state. Source and installation details require login; this is an independent animation adaptation, not copied gated code.

Only motion changes. The existing Pitch Protocol track, thumb, colors, focus treatment, 24/32/40px widths, and native checkbox with `role="switch"` remain. No React, Motion, or Spectrum package is installed.

- Press elongates the thumb toward the track center: 2px at small and 4px at medium/large.
- Release uses a restrained spring-like 320ms cubic-bezier transition. Both thumb width and translation use the same timing so the checked thumb stays anchored during a hold.
- Pointer feedback uses `:active`. Space-key feedback only sets a transient presentation attribute. The browser still owns checked state, change events, and form behavior.
- Disabled switches do not stretch. Reduced-motion preference, global animation pause, and individual preview pause remove both deformation and transitions.
- All motion values appear through component aliases in Tokens used. Press/release durations reuse the existing `motion.duration.fast` and `motion.duration.slow` primitives; stretch uses spacing primitives.

Integration: load `switch-motion.js` after `tokens.js`, `switch-motion.css` after `components.css`, and call `F.wireSwitchMotion(root, registerCleanup)` for each mounted preview. The module refreshes CSS token variables and extends `F.switchTokens` itself.

Validation: `node checks/switch-motion.cjs` checks geometry/color preservation, aliases, native event ownership, disabled input, key-release/blur/unmount cleanup, and motion preference selectors. Browser animation review is still required to judge the final feel.
