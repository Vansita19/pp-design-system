# Pitch Protocol source audit — 8 October 2026

Latest organizer override (9 October 2026): this document preserves the original extraction evidence. Current padding, margins and gaps follow [the spacing contract](spacing-system.md), which also records the later 500-shade focus/validation borders and solid badge fills. Original source values below remain historical evidence, not the current organizer contract.

Read-only audit of /Users/vansitaaddanki/pp-admin/investor-preview, the local source matching the user-provided investor prototype. No source files edited. Do not use src/routes/layout.css as the design source: that is the separate Svelte implementation with stock Geist/shadcn tokens; the requested prototype uses SF/system sans and blue actions.

## Source of truth
- investor-preview/AGENTS parent: /Users/vansitaaddanki/pp-admin/AGENTS.md (reuse existing shared patterns; preserve source unless explicit requested departure).
- DESIGN-SYSTEM.md describes iterations and approved refinements. Do not copy historical screen-specific rules into generic docs.
- build-preview.mjs combines styles.css, color-tokens.js, onboarding-system.css, trace.css, detail-pages.css into preview.html. Source component helpers in ui.js, dropdown.js, controls.js. Existing design-system-body.html is a thin static catalogue, not a comprehensive live explorer.
- chat-playground.css + chat-playground.js contains a refined standalone composer and motion specimens.

## Existing token values (not invented)
Font: -apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Helvetica Neue', sans-serif. Base 14px, normal weight 400, common controls/labels 500; use tabular numerals for metrics. Icons mostly Lucide/Hugeicons stroke 1.5, 16px control icons, no sparkle icons (explicit source preference).

color-tokens.js:
- gray white #FFFFFF, 50 #FAFAFA, 100 #F5F5F5, 200 #E5E5E5, 300 #D4D4D4, 400 #A3A3A3, 500 #737373, 600 #525252, 700 #404040, 800 #262626, 900 #171717, 950 #0A0A0A.
- blue 50 #EFF6FF, 100 #E8EFFF, 200 #BFDBFE, 300 #93C5FD, 400 #60A5FA, 500 #3470EE, 600 #2563EB, 700 #1D4ED8, 800 #1E40AF, 900 #1E3A8A.
- green 50 #DCFBE6, 500 #19BE83, 600 #119D4E.
- purple 50 #EEE5FA, 600 #8938E7.
- red 50 #FFE8EC, 200 #FFD1D8, 400 #FF455B, 500 #EF405B, 600 #D43155.

Semantics: text-heading gray900; text-filled gray800; text-body gray700; text-secondary gray600; placeholder gray500; disabled gray400; inverse white; link blue600. surface-canvas gray50; default white; subtle gray50; disabled gray100. border-default/subtle gray200; focus blue600; selection blue200. action-primary blue600, hover blue500, border blue700, text white. Disabled bg gray100 and text gray400. Status success green50/green600, indicator green500; danger red50/red600/red200, indicator red400. Source includes company-stage aliases which can be generalized in the independent explorer.

## Controls to preserve / normalize
Latest static catalogue/onboarding controls (onboarding-system.css): primary button 36px, radius10, 14px/20px 500, bg action-primary blue600, border blue700, shadow inset 0 1.5px 0 #ffffff33,0 1px 2px #1717171f. Hover blue500; pressed blue600 + inset 0 1px 2px #00000014. Keyboard focus outline2 action-blue offset3.
Input/textarea: radius10, border gray200, filled gray800, placeholder gray500, 14px 400. Focus blue600 + 0 0 0 3px #2563eb33,0 1px 2px #0000000d. Catalogue input h36, textarea h88. Disabled gray100/gray400 with no opacity. Readonly gray50.

The original global styles use 32px buttons, radius8 and --blue #2665f4; composer uses another #266df0. Consolidate intentionally into semantic tokens rather than carrying three arbitrary blue action colors into the new system. Do not claim every normalization is an exact extraction. Expose compact32/default36/large40+ sizes as explicit variants, all mapped to tokens.

## Concrete inventory / implementation references
- Button: ui.js button(), styles.css button/.primary/.ghost/.danger/.text-button/.icon-button; onboarding-system.css .system-catalog controls.
- Input, textarea: native selectors, .system-input, .input-with-icon, .icon-field; onboarding-system.css as above.
- Badges/status: ui.js pill(), stage(), recommendation(); styles.css .pill, .stage-pill, .status-dot. Stage pill 14px/22, p2x8,r8; recommendation white/r16 + dot. Make generic labels in explorer.
- Avatar: ui.js avatar(), styles.css .avatar; portrait crops are assets (do not use company assets needlessly for generic docs).
- Menus/select: dropdown.js dropdown(); controls.js interactions. .dropdown-trigger h36/r9/p0x12/13px; menu white, gray200 border,r12,p6, shadow 0 8px 30px #26262614 + 0 2px 5px #26262608; options min34,r7,p9x10,13px. Selected neutral fill + blue check. Supports arrows/Home/End/Escape/Tab and outside dismissal.
- Tabs/segments: styles.css .tabs/.tabs button/.tabs button.active; also .summary-segmented. Extract category-generic samples.
- Modal: ui.js modal(), closeModal(); .modal width460/r18, shadow 0 24px 80px #00000020; headers/footer p16x20, body20; max90vh. App.js contains keyboard trap logic. Independent explorer should use robust dialog keyboard behavior and restore focus.
- Drawer: .modal.evidence-drawer width420/r18; .side-panel common shell. Generic drawer sample should not include investor text.
- Tooltip: styles.css .inbox-action-toolbar [data-tooltip]::after; white/light surface r7, p7x10,12px/18, 450ms hover and immediate focus. Improve into actual accessible tooltip markup because pseudo-content does not establish aria-describedby.
- Popover: dropdown surface plus detail-pages.css citation popover and chat-playground.css .lab-popover (native popover with anchoring JS).
- Lists/upload: styles.css .compact-list-option; chat-playground.css .lab-upload-target/.lab-attachment.
- Tables: .table-wrap and .view-grid plus .chat-result-table; extract sorting/filter/pagination patterns without dashboard business logic.
- Toast: ui.js toast() + #toast source selectors. Add live announcements if missing.
- Empty state: .empty, .search-empty.
- Progress/metrics: .market-simple-track/.market-simple-bar, .score-card, .metric. Generic data source only.
- Research disclosure: conversation response/research code, expanding rows with source chips. Represent as reusable progress/disclosure block, not investor-specific process.

## Animated components already present
- Text shimmer: styles.css .conversation-thinking .thinking-label line5255; linear-gradient gray600 40%,gray200 50%,gray600 60%, 250% width, thinking-shimmer 3.667s linear infinite; reduced motion restores solid gray600.
- AI dots: chat-playground.css .lab-dots (3x3 grid, dot3 gap2, blue, opacity .25→1, duration1.4s, stagger80ms); source docs also describe original5x5 loader. Can expose grid size, color, duration as config.
- Composer glow: .home-prompt-glow + chat-playground.css lab-aurora (7s, translateX±12,scaleX .94→1.02). Cosmetic demo only.
- Native menu enter: .lab-popover opacity0→1, translateY4→0, scale.96→1; 160–200ms cubic-bezier(.23,1,.32,1), @starting-style, reduced motion override.
- Voice waveform: .lab-wave width86/h16, bars1.5 wide, scaleY amplitudes; sample animation can be generic without mic requests.
- Response entrance: conversation-motion.js 180ms fade for paragraph; 220ms fade/rise4 for result blocks; 200ms new values; 240ms reordered rows; respects reduced motion.
- Disclosure and animated list rows should retain geometry rather than arbitrary delayed text. User has newly authorized streaming/glow variations separately.

## High-value fixes/extensions
1. Consolidate raw colors/radius duplication and long override cascade into primitive→semantic→component references.
2. Disabled/readonly/error/success/busy state specimens with consistent contrast and aria semantics; don't rely on opacity/color only.
3. Missing generic radio, switch, slider, pagination and full sizes/icon layouts can be derived and explicitly documented in source as extensions.
4. Source .modal alone is not enough: retain or improve focus trap/escape/restore and viewport-safe sizing.
5. Tooltip pseudo-content gets real accessible description; popovers need anchoring/clamp and keyboard handling.
6. Standardize complete button matrix: primary/secondary/ghost/destructive/success, sm/md/lg, text/leading/trailing/icon-only, default/hover/focus/pressed/disabled/loading/success with appropriate aria-label for icon-only.
7. User requests minimal clean UI: provenance and change log belong in source files/details on demand, not persistent investor/dashboard prose in the explorer.
8. Organizer shell can be black without recoloring extracted Pitch Protocol light components; keep canvas/project theme explicit and demo selectors isolated.
