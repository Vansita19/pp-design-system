# Tests: design review

## Setup under test

- Skill: `SKILL.md`
- Reference files: `references/review-criteria.md`
- Project instructions: loaded, `examples/_shared-project-instructions.md`
- Tools connected: none
- Model: [the one you actually use]

## Which cases apply

| Case | Applies | Why |
|---|---|---|
| Normal | Yes | Always |
| Missing required input | Yes | The screen's purpose is required, and its absence should stop the run |
| Conflicting sources | Yes | Two versions of the same screen can arrive together |
| Tool failure | No | This workflow uses no tools |
| Ambiguous judgement | Yes | The Skill evaluates and prioritises, which is exactly where judgement leaks in |

## Done means

- Every finding names its criterion
- No finding is a preference
- Repeated issues appear once, with a count
- Needs a person: accessibility items, product decisions, and anything the criteria did not reach

## Baseline

Run the review with no setup: the screens, and "review this screen".

| Case | What happened with no setup |
|---|---|
| Normal | [record it] |

Watch for these in the baseline: criteria invented on the spot, preferences stated as problems, the
same issue listed once per instance, and a confident accessibility verdict.

## Normal case

**Input:** a screen with a stated purpose, plus the criteria file.
**Expect:** findings grouped by severity, each naming a criterion; an edge case list; a summary
written last.
**Fails if:** a finding has no criterion behind it, or the same issue is listed repeatedly.

## Missing required input

**Input:** the same screens with no statement of what the screen is for.
**Expect:** it stops and asks.
**Fails if:** it reviews anyway. Read what it produced: it will have assumed a purpose, and the
findings will be shaped by that assumption without saying so.

**A second version worth running:** supply the purpose, but describe the screens in words instead of
attaching images. A correct run refuses this too, because reviewing a description means reviewing your
reading of the design rather than the design.

## Conflicting sources

**Input:** two versions of the same screen, both supplied, with no indication which is current.

**Is there an applicable precedence rule?** Not in the project instructions. Nothing there settles
which of two supplied screens is current.

**Expect, with no applicable rule:** it says the screens disagree, names what differs, and asks which
is current rather than reviewing one or merging them.

**Fails if:** it reviews whichever came first, or blends the two into one set of findings.

## Tool failure

Not applicable. This workflow uses no tools.

## Ambiguous judgement

**Input:** a screen containing something your criteria do not cover, and something that is clearly a
matter of taste. A layout choice nobody has a rule about, next to a colour someone would argue over.

**Expect:** the taste item is dropped, the uncovered item appears under what a person must decide, and
neither is presented as a finding against a criterion.

**Fails if:** it invents a criterion so the observation has somewhere to live, or reports the taste
item with a severity attached.

## Record

| Date | Case | What happened | What changed after |
|---|---|---|---|
|  |  |  |  |

Change one thing at a time.

---

*Design Agents Toolkit by [designsystems.surf](https://designsystems.surf). Questions? hey@designsystems.surf*
