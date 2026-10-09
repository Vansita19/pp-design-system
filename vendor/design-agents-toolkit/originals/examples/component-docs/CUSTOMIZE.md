# Customizing: component documentation

**Use as-is:** send a component with its variants, where it lives, and two real usage situations. It
writes the entry in the format from `references/doc-format.md`.

**Adapt:** replace that format with your own section order, and swap the worked example for a real
entry of yours.

## Customize first

1. **Sections** what the document contains, in `references/doc-format.md`
2. **The worked example** under them, replaced with one of your real entries
3. **Required inputs** what must exist before it can run, and what a missing one does
4. **Terminology** your names for states and variants
5. **Sources** where behaviour and tokens come from, and which wins
6. **Output** how the final documentation is structured

---

## What it does

Turns a finished component into one documentation entry in a fixed format, from supplied material
only, and lists separately everything it filled with judgement.

## Works as-is

The table of what happens per missing input. Never inferring a token name. The **Guessed at** list
below every entry. Writing the do and don't pairs last and deleting the obvious ones. One component
per run.

## Worth replacing

**The section order.** The most project-specific thing here. Yours will have sections we do not, and
lack some we do.

**The worked example.** Swapping ours for one real entry of yours moves the output more than editing
any instruction, because a model matches an example far more closely than a description.

**Inputs, and what a missing one does.** Ours stops on usage situations and variants, and marks
tokens `NOT SUPPLIED`. Your team may document from a spec rather than a design file, or treat a
missing accessibility note as blocking.

**Terminology and the review checklist.** Change both in the format file rather than in the Skill.

## Core invariants

Four things carry the reliability. Change them when your process genuinely differs.

**One component per run.** Protects the entry from becoming a survey nobody can review. Worth
changing only if your format documents families rather than components.

**Missing required inputs stop the workflow.** Protects against invented usage examples, which read
exactly like real ones and are the part readers copy. Which inputs are required is yours to set; that
a missing one stops the run is the part to keep.

**Source conflicts stay visible.** It follows a precedence rule where one exists and says that it did,
rather than resolving quietly. Protects you from finding out which source it trusted only when
something is already published.

**Unsupported detail stays out of the draft.** Nothing gets written that the sources do not support,
and every judgement call is declared under **Guessed at**. Protects judgement from silently becoming
documented fact. Worth dropping only if every entry is read line by line before publishing.

## Connect what you have

Your documentation format, if it exists as a template or style guide. Two or three published entries
you are happy with, which set length, tone and detail per section. Your token source, so names can be
verified. Build notes from whoever implemented the component. Accessibility notes, if a specialist
writes them.

## Optional tools

None required. A design tool connection can read variants and token bindings directly, removing the
transcription step and its errors. A documentation platform connection can publish rather than hand
you the entry; add a human checkpoint before publishing if you do, because publishing is hard to take
back.

## Check after changing

Try it on one or two real components, then check: it still stops when only one usage situation is
supplied; a token absent from your source is marked rather than filled in; and an entry sits next to
a real published one without looking structurally different.

## Adapt this Skill

Paste this with your `SKILL.md` and `references/doc-format.md` attached. Attach one real published
entry too, if you have one.

```
Adapt this component documentation Skill to how my team documents components.

Read the Skill first. Keep its core procedure, safeguards, stop conditions and final
checks as they are, unless my answers below make one of them wrong.

Ask me only about what is specific to my team: our section order and what is missing from
yours; what we call variants, states and anatomy; where documentation is published and in
what shape; our token source and what to do when two sources disagree; and whether any
input we treat as blocking is currently only marked.

If I attach a real published entry, use it to set length, tone and detail per section, and
tell me what you changed as a result.

Do not invent section names, rules or conventions. If I cannot answer something, leave it
and tell me it is unresolved.

Before applying anything, show me the proposed changes in two lists. What decides the
list is the effect of the change on the workflow, not the kind of field it touches.

Behavior changes: anything that changes the decisions the Skill makes, what it checks,
accepts, rejects or prioritises, what it stops on, or what it asks a person to resolve.
This includes which inputs are required, what happens when one is missing, which sections
must exist, and how a source conflict is resolved.

Configuration and terminology changes: changes that leave the same decision logic in place,
such as labels, field names, destination, presentation format, or wording that carries no
meaning for the decision.

Wait for my confirmation.
```

---

*Design Agents Toolkit by [designsystems.surf](https://designsystems.surf). Questions? hey@designsystems.surf*
