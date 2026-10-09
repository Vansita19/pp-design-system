# Customizing: design review

**Use as-is:** send the screens and one line on what they are for. It reviews against the criteria in
`references/review-criteria.md` and says that it used them.

**Adapt:** replace those criteria with the ones your team actually argues about. That single change
does most of the work.

## Customize first

1. **Criteria** what the review checks, in `references/review-criteria.md`
2. **Severity** how findings are prioritised
3. **Out of scope** what the Skill should ignore
4. **Inputs** what must be supplied, and in what form
5. **Output** how the review is structured

---

## What it does

Reads a screen against stated criteria and returns findings by severity, the edge cases it does not
appear to handle, and what a person still needs to decide.

## Works as-is

The three-way sort into finding, human decision and taste. Grouping one issue that appears eight
times into one finding with a count. The edge case list. Asking what the screen is for before judging
it. None of these are specific to a team.

## Worth replacing

**The criteria.** Ours are a reasonable starting set, not yours. Leave out anything your team has not
actually agreed: an unagreed criterion becomes a finding somebody has to defend.

**Severity.** If your team already has levels, use those names and definitions rather than
translating between two scales.

**What not to report.** Currently preferences, copy rewrites, product decisions and design system
compliance. Your out-of-scope list is probably different.

**Inputs.** It asks for images. Say what to do if your team reviews from a prototype, a build or a
link.

**Output shape and terminology.** Match the tracker or document your team reads reviews in, and the
words they already use.

## Core invariants

Four things carry the reliability. Change them when your process genuinely differs, not while tidying.

**Evidence before opinion.** Every finding traces to a stated criterion. Protects the report from
becoming an argument nobody agreed to have. No good reason to change this one.

**Findings separate from judgement.** What the criteria settle goes in the findings; what needs a
person goes to a person. Protects against an authoritative-sounding verdict on something nobody
qualified decided. Worth changing only if a qualified reviewer reads the output before it travels.

**Missing rules stay unresolved.** It does not invent a criterion so an observation has somewhere to
live. Protects your team from defending a rule it never agreed.

**Repeated issues are grouped.** Protects the report from growing until people stop reading it. Worth
relaxing if your tracker needs one row per instance.

Alongside these, the Skill asks what the screen is for before judging it, and stops when that is
missing. Change that only if the purpose is always available somewhere it can reach.

## Connect what you have

Your agreed criteria, wherever they already live. Your severity scale, if your tracker has one. One or
two past reviews you were happy with, which teach register better than any instruction. Whatever tells
a reviewer what a screen is for. And any patterns your team breaks on purpose, so they stop arriving
as findings.

## Optional tools

None required; it runs from pasted images. A design tool connection lets it read the frame rather than
an export, which helps when reviews happen mid-design. A tracker connection can supply ticket context
and take findings back. Keep the pasted path working either way.

## Check after changing

Try it on one or two representative screens, then check three things: it still stops when the purpose
is withheld; a deliberate exception is not reported as a finding; and one finding picked at random
really does trace to a criterion in your file.

## Adapt this Skill

Paste this with your `SKILL.md` and `references/review-criteria.md` attached.

```
Adapt this design review Skill to how my team reviews work.

Read the Skill first. Keep its core procedure, safeguards, stop conditions and final
checks as they are, unless my answers below make one of them wrong.

Ask me only about what is specific to my team: the criteria we have actually agreed and
which of yours we do not use; our severity names and definitions; what we treat as out of
scope; the form screens arrive in; where the report goes and in what shape; and the words
we use instead of finding, severity and blocking.

Do not invent criteria, severity definitions or exceptions. If I cannot answer something,
leave it and tell me it is unresolved.

Before applying anything, show me the proposed changes in two lists. What decides the
list is the effect of the change on the workflow, not the kind of field it touches.

Behavior changes: anything that changes the decisions the Skill makes, what it checks,
accepts, rejects or prioritises, what it stops on, or what it asks a person to resolve.
This includes the review criteria, the severity definitions and thresholds, and what we
treat as out of scope.

Configuration and terminology changes: changes that leave the same decision logic in place,
such as labels, field names, destination, presentation format, or wording that carries no
meaning for the decision.

Wait for my confirmation.
```

---

*Design Agents Toolkit by [designsystems.surf](https://designsystems.surf). Questions? hey@designsystems.surf*
