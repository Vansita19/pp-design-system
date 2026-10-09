# Mapping rules

## Contents
- Classifications
- Categories
- Tolerances
- Gap threshold
- What counts as a source conflict
- Report shape

**To whoever sets this up, not to the Skill:** replace the categories, the tolerances and the
threshold with your own. The classifications and the order of checks are the part that holds.
Whatever ends up in this file is what the Skill treats as the agreed rules, so it is canonical from
the Skill's point of view even while it still says this.

---

## Classifications

Every value ends in exactly one of these. Purpose is checked before value, in every case.

**Exact match.** A token exists whose stated purpose covers what the value is doing, and the value is
identical.

**Semantic match.** A token exists whose stated purpose covers what the value is doing, and the value
differs by less than the tolerance for its category. State the difference; do not round it away.

**Ambiguous.** More than one token could fit, and nothing in the supplied rules separates them. Or the
value's purpose cannot be determined from what was supplied, so fit cannot be judged. Name every
candidate and what would settle it.

**Gap.** No token's purpose covers what the value is doing, whatever the numbers look like.

A value that matches a token's number but not its purpose is not a match. Depending on what is known,
it is ambiguous or a gap. This is the rule that prevents the most confident wrong answers, because
numbers coincide across a system constantly.

---

## Categories

Purpose is expressed through categories. A candidate token only counts if it sits in the category the
value's job belongs to.

- **Colour**: surfaces, text, borders, icons
- **Spacing**: padding inside a component, gaps between things in a layout. Two different jobs on one
  scale, so record which one a value is doing
- **Size**: fixed widths and heights
- **Radius**
- **Border width**
- **Type**: size, weight, line height, letter spacing
- **Elevation**
- **Motion**: duration and easing

If a value's category cannot be determined, that is ambiguous, not a guess.

---

## Tolerances

How much the raw value may differ once semantic fit is confirmed.

Tolerance is never what makes a match semantic. Purpose decides that first; the tolerance only says
whether a value that already belongs to the right token is close enough to count as a match, or far
enough to need a person.

Defaults, until your team sets its own:

- Colour: none. A near miss is not a match, however close the hex
- Spacing, size, radius, border width: 2px or less
- Type size: 1px or less
- Line height: 0.1 or less, measured as a ratio of line height to font size. 20px on 14px is 1.43
- Motion duration: 50ms or less

A difference exactly equal to the number above is inside tolerance. Design values cluster at round
distances, so this boundary is where real values land rather than an edge case.

A value outside tolerance whose purpose still fits a token is ambiguous rather than a gap: the token
is right and the value is wrong, and someone has to decide which of the two moves.

---

## Gap threshold

If more than about a third of the rows are gaps, stop and say so. Past that point the report is not
actionable and the likelier explanation is that the wrong token set was supplied. Set this where a
report stops being useful for you.

Count rows, not values. A compound value carries more than one property and becomes more than one row:
`1px solid #E3E3E3` is a border colour and a border width, and one row cannot hold two classifications.
Split every compound value before counting.

Below about ten rows the threshold is noise, because a third of eight is between two and three. Under
that, report the gaps and say the run was too small to judge coverage.

The stop can only fire once everything is classified, since the count is the last thing you learn.
Deliver the finished table, flag it as unactionable, and ask the question. Do not bin the work.

---

## What counts as a source conflict

Two sources give a different value for the same token name, or a different name for the same value.

Follow the precedence rule in the project instructions if one applies, and say that you applied it. If
none applies, report both sources and do not choose.

A token list containing two entries with the same name and different values is not a conflict to
resolve. It is a broken list, and it stops the work.

---

## Report shape

```markdown
## Summary
Exact: 34 · Semantic: 6 · Ambiguous: 3 · Gap: 4

## Mapping
| Value | What it is doing | Token | Class | Reason |
|---|---|---|---|---|
| #1B4DFF | Primary button surface | color.action.primary | Exact | Purpose and value both match |
| 15px | Link label | type.size.body | Semantic | Purpose matches, 1px smaller, inside tolerance |

## Ambiguous
- 6px, gap between stacked labels in a table cell. Candidates: space.050 (4px) and space.100 (8px).
  Both are spacing tokens and the value sits between them. Nothing in the rules says which way dense
  contexts round.

## Do not use
- #1B4DFF for the focus ring on the primary button. The value is identical to color.action.primary,
  whose purpose is a fill, not a focus indicator. Using that name here ties every focus ring in the
  product to the button background.

## Gaps
- 44px, invoice table row height. A fixed component height. The spacing scale governs padding and
  gaps; no token category covers fixed heights.

## For a person to decide
The three ambiguous cases above, and whether row height should become a token at all.

## Source
Token list read from the canonical library on 2026-08-20 via a connected tool.
```

---

*Design Agents Toolkit by [designsystems.surf](https://designsystems.surf). Questions? hey@designsystems.surf*
