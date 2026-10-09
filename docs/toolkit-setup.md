# Design Agents Toolkit in Forma

The toolkit is ready as a project reference. You can ask Codex to review a component, map its values to the system, or update its documentation in ordinary language. Forma's existing rules apply automatically; the supplied examples are available when their extra detail helps.

| What you want | A useful request |
| --- | --- |
| Review a component | “Review this component against Forma's criteria. Show concrete issues, where they occur, and the smallest fixes.” |
| Make a visual adjustment | “Make this header tighter using existing tokens. Check every component that shares it and show what changed.” |
| Resolve a token mismatch | “Map this component's values to the current token registry. Separate exact matches, deliberate normalizations, unresolved choices and gaps.” |
| Update an entry | “Update this component's documentation from its current renderer, controls and source. Keep the existing page format.” |

For visual feedback, open **Tweak** or **Comments** beside a component's tabs. In the drawer, **Design** lets you pick a part in the preview and change its supported system values or icon. **Comments** lets you save a note with its page, variation and part attached automatically. **Copy feedback** gathers the batch for you to paste into this chat; it does not send automatically. Backups are under **More options**. Follow the [simple visual review guide](visual-review-guide.md) for the full flow.

A screenshot can make a visual comment more precise. Text/source checks can still proceed when the screen is unavailable, but they do not establish what a browser actually displays. The toolkit supplies review and documentation guidance; the editor is native organizer code. [Existing editor references](review-editor-references.md) informed the interaction patterns without installing or copying a third-party editor.

## What was already adapted

The [maintenance rulebook](design-system-maintenance.md) already incorporates the toolkit's three main workflows:

- **Review:** evidence before preference; a named criterion for each issue; repeated problems grouped together; observed states separated from unobserved ones.
- **Token mapping:** check a value's purpose before its number; read the live registry; preserve semantic aliases; disclose normalization and unresolved gaps.
- **Documentation:** describe the actual component, variants and behavior; verify token names; distinguish source-derived behavior from extensions and demonstrations.

Forma additionally connects these workflows to its component renderers, inspectors, source inventory, focused checks and packaged deliverables. Current user choices—including shared atoms, Hugeicons and the spacing scale—take precedence over generic toolkit examples.

Some example defaults were deliberately not adopted. Forma keeps Overview and All states first instead of imposing the sample twelve-section document. It can document component families and honest demonstration cases without requiring two shipped screens. The live local code and token registry are available sources; the fictional Northwind Figma/Notion precedence rules are not Forma's rules. A sample “stop and ask” or tolerance threshold does not create a new approval requirement for already authorized work.

## What this setup adds

The complete original Markdown examples are now available locally, without copying their placeholder instructions into active configuration:

- [Design review example](../vendor/design-agents-toolkit/originals/examples/design-review/SKILL.md), its [criteria](../vendor/design-agents-toolkit/originals/examples/design-review/references/review-criteria.md), customization notes and scenario tests.
- [Token mapping example](../vendor/design-agents-toolkit/originals/examples/token-mapping/SKILL.md), its [mapping rules](../vendor/design-agents-toolkit/originals/examples/token-mapping/references/mapping-rules.md), customization notes and scenario tests.
- [Component documentation example](../vendor/design-agents-toolkit/originals/examples/component-docs/SKILL.md), its [format](../vendor/design-agents-toolkit/originals/examples/component-docs/references/doc-format.md), customization notes and scenario tests.
- [Workflow template](../vendor/design-agents-toolkit/originals/templates/SKILL_TEMPLATE.md) and [scenario-test template](../vendor/design-agents-toolkit/originals/templates/TESTS_TEMPLATE.md), useful if a repeated task later warrants its own adapted workflow.

The useful addition beyond the existing maintenance rules is the original scenario-test material: normal requests, missing input, conflicting sources, unavailable tools and uncertain judgments. It can guide future workflow evaluation. These are reference scenarios, not tests that have been run against Forma, and no custom skill has been created or installed in this setup.

## Provenance and verification

The supplied archive is `/Users/vansitaaddanki/Desktop/Portfolio 2026/design-agents-toolkit-dss.zip`. Its SHA-256 is `c4bf31b08c8235085f0f7e27b1c49808cd4647189eba1710fb6628bf8f189157`. The original Markdown footers credit **Design Agents Toolkit by designsystems.surf**.

[The complete inventory](../vendor/design-agents-toolkit/inventory.json) records every supplied entry and its hash, including files not copied into the project. All retained Markdown files are byte-identical to their archive entries. The five PDFs remain in the supplied archive to avoid duplicating the large reading material; their hashes are recorded, but their page layouts were not reviewed in this setup. macOS metadata was inventoried and omitted from extraction.

No separate license file was included. Attribution is preserved and no new license is asserted. The original archive and Pitch Protocol source remain unchanged. Nothing was installed globally, no Cursor configuration was written, and no bundled scripts were executed. The project-local originals are references; the active instructions remain [AGENTS.md](../AGENTS.md) and the [maintenance rulebook](design-system-maintenance.md).
