# Review criteria

## Contents
- Severity
- The criteria
- Edge cases to check
- What not to report

**To whoever sets this up, not to the Skill:** replace these with your team's own criteria. The
structure is what matters: named criteria, defined severity, and an explicit list of what is out of
scope. Whatever ends up in this file is what the Skill treats as the agreed criteria, so it is
canonical from the Skill's point of view even while it still says this.

---

## Severity

**Blocking.** A user cannot complete the task, or would reasonably lose data or make an error they
cannot undo.

**Should fix.** The task can be completed, but with avoidable confusion, extra steps, or a real
chance of the wrong outcome.

**Note.** A smaller inconsistency, or something worth deciding before it spreads to other screens.

If you cannot decide between two levels, choose the lower one and say why in one line.

---

## The criteria

**1. The task is obvious.** Someone arriving at this screen can tell what they are being asked to do
and what will happen next.

**2. One primary action.** The main thing to do is visually dominant, and competing actions do not
look equally weighted.

**3. Hierarchy matches importance.** What matters most reads first. Size, weight and position agree
with each other rather than competing.

**4. Grouping reflects relationships.** Things that belong together are together, and proximity is
not doing the opposite of what the content implies.

**5. Labels say what will happen.** Buttons and links describe the outcome, not the mechanism.
Nothing depends on a tooltip to be understandable.

**6. The user can tell where they are.** Position in a flow, in a list, or in a process is visible
without counting.

**7. Recovery is possible.** Anything destructive is confirmable or reversible, and the user can get
back to where they were.

**8. Consistency with the rest of the product.** The screen behaves the way its neighbours behave,
and departures from that are deliberate.

**9. Content holds up at its extremes.** The design still works with the longest realistic content
and with the shortest.

---

## Edge cases to check

Empty, loading, error, partial data, long content, short content, small screen, first use, returning
user, permission denied, offline.

For each, say whether it is shown, and if not, say so rather than assuming it is missing by mistake.

---

## What not to report

- Anything that is a matter of preference rather than a criterion above
- Alignment or spacing consistent with the design system, which belongs in design QA
- Token names, component usage and states, which belong in design QA
- Copy rewrites. Flag unclear copy and say what is unclear
- Product decisions. Note them for a person and move on

---

*Design Agents Toolkit by [designsystems.surf](https://designsystems.surf). Questions? hey@designsystems.surf*
