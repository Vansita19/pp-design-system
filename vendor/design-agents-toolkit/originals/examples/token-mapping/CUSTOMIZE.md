# Customizing: token mapping

**Use as-is:** send the values or styles to map, what each one is doing, and your token list. It
classifies each result as an exact match, a semantic match, ambiguous, or a gap.

**Adapt:** set the categories and tolerances to match your token architecture, and decide whether the
list is pasted or read by a tool.

## Customize first

1. **Token source** the canonical list, and whether a tool reads it
2. **Categories** your token architecture, in `references/mapping-rules.md`
3. **Tolerances** how far a value can differ and still be a semantic match
4. **Gap threshold** when the run should stop
5. **Output** how the mapping is reported
6. **Precedence** which source wins when you have more than one

---

## What it does

Maps existing values or styles onto the tokens that exist, checking what each value is doing before
what it equals, and leaving anything unresolved visible rather than settled.

## Works as-is

The four classifications and the report shape. Checking purpose before value. Stating the reason on
every row rather than just the class. The source line naming the list and when it was read. Stopping
when no canonical list is available.

## Worth replacing

**The categories.** Ours has eight, and they are how purpose gets expressed. A missing one produces
values whose category cannot be determined, which the Skill reports as ambiguous rather than guessing.

**The tolerances.** How much the raw value may differ once semantic fit is confirmed. Ours are 2px on
spacing, size, radius and border, 1px on type size, none on colour. They never make a match semantic:
purpose decides that first, and the tolerance only separates a match from a case that needs a person.

**The gap threshold.** A third is a guess. Set it where a report stops being actionable.

**Where the list comes from, and which source wins.** Pasted always works; a tool helps when tokens
change often. If you have several sources and no stated winner, deciding that is worth more than
anything else in this file.

## Core invariants

Four things carry the reliability. Change them when your system genuinely differs.

**Semantic fit over raw similarity.** A token only counts if its stated purpose covers what the value
is doing. Protects against an 8px gap mapped to an 8px radius, which looks correct in the report.
Change the categories freely; the rule itself has no good reason to change.

**Ambiguous matches stay visible.** Where more than one token fits, or purpose cannot be determined,
the case is reported with its candidates rather than resolved. Protects the one part of the report a
person actually has to read. Collapsing it produces a complete-looking table that hides every real
question.

**No invented token names.** Protects against a proposed name reaching a handoff and becoming real
without a decision. Worth changing if a named person reviews proposals first.

**A missing canonical source stops the run.** Protects against mapping from memory, which is how wrong
names enter a handoff.

## Connect what you have

Your canonical token source: a design library, a tokens file, a repository. Your scales, if documented
separately. Agreed exceptions, so they stop being reported. A past handoff you were happy with, to
set the report shape.

## Optional tools

This is the setup most improved by a tool, and it still works without one. A design tool or repository
connection reads the list directly, so it is current and the report can say when it was read.

Keep the pasted path working: tool access varies by plan, seat and permissions, and a workflow that
only runs when a tool is reachable stops working without warning. `TESTS.md` has a case for that.

## Check after changing

Try it on one or two representative screens, then check: a value that matches a token's number but not
its purpose is not reported as a match; a value with two plausible candidates stays ambiguous with
both named; and it still stops when no canonical list is available.

## Adapt this Skill

Paste this with your `SKILL.md` and `references/mapping-rules.md` attached.

```
Adapt this token mapping Skill to my design system.

Read the Skill first. Keep its core procedure, safeguards, stop conditions and final
checks as they are, unless my answers below make one of them wrong.

Ask me only about what is specific to my system: our categories and which of yours we do
not have; our tolerance per category and our base unit; the gap threshold; where the
canonical list lives and whether I paste it or connect a tool; which source wins if there
are several; places we have deliberately broken the system; and where the report goes.

If my base unit makes the default tolerances wrong, propose new ones rather than applying
them.

Do not invent token names, categories or exceptions. If I cannot answer something, leave it
and tell me it is unresolved.

Before applying anything, show me the proposed changes in two lists. What decides the
list is the effect of the change on the workflow, not the kind of field it touches.

Behavior changes: anything that changes the decisions the Skill makes, what it checks,
accepts, rejects or prioritises, what it stops on, or what it asks a person to resolve.
This includes the tolerances, the categories, the gap threshold, and which token source
wins.

Configuration and terminology changes: changes that leave the same decision logic in place,
such as labels, field names, destination, presentation format, or wording that carries no
meaning for the decision.

Wait for my confirmation.
```

---

*Design Agents Toolkit by [designsystems.surf](https://designsystems.surf). Questions? hey@designsystems.surf*
