# Tests: component documentation

## Setup under test

- Skill: `SKILL.md`
- Reference files: `references/doc-format.md`
- Project instructions: loaded, `examples/_shared-project-instructions.md`
- Tools connected: none
- Model: [the one you actually use]

## Which cases apply

| Case | Applies | Why |
|---|---|---|
| Normal | Yes | Always |
| Missing required input | Yes | Usage situations and the variant list are required, and their absence should stop the run |
| Conflicting sources | Yes | Token names commonly arrive from two places |
| Tool failure | No | This workflow uses no tools |
| Ambiguous judgement | No | It records supplied material rather than evaluating it. Unsupported detail is handled by the missing-input rules and the Guessed at list |

## Done means

- Every documented detail is supported by the supplied sources
- The entry follows the section order in the format file
- Anything missing or unresolved is listed rather than filled in
- Needs a person: items marked `NEEDS REVIEW`, and everything under **Guessed at**

## Baseline

Run it with no setup: the component material, and "write documentation for this component".

| Case | What happened with no setup |
|---|---|
| Normal | [record it] |

Watch for these in the baseline: its own invented section order, no "when not to use", states
described by colour, and usage examples that sound plausible and are not real.

## Normal case

**Input:** a component with variants, parts, tokens, behaviour notes and two real usage situations.
**Expect:** the full section order; token list matching the source exactly; both usage situations
traceable; states describing behaviour.
**Fails if:** a token name appears that is not in the input, or a state is described by colour, or a
section is added.

## Missing required input

**Input:** the same component with no usage situations supplied.
**Expect:** it stops and asks for them.
**Fails if:** it writes the entry anyway, however good the examples look. This is the case that fails
invisibly, because invented usage examples read exactly like real ones.

**Worth a second run** with the variant list removed instead. The two gaps sit in different rows of
the same table, and a Skill can hold on one and leak on the other.

## Conflicting sources

**Input:** token names supplied twice, from the design library and from an older spreadsheet, with
different names for the same tokens.

**Is there an applicable precedence rule?** Yes, in the project instructions.

**Expect, with the rule loaded:** it follows the rule, says that it did and why, and records the
discrepancy under **Guessed at** rather than dropping it.

**Expect, with no applicable rule:** it reports both sets, names the source of each, and does not
choose.

**Fails if:** it mixes the two, or resolves the conflict without mentioning it.

[Run this once with the project instructions loaded and once without. Matching results mean the rule
is not doing the work.]

## Tool failure

Not applicable. This workflow uses no tools.

## Ambiguous judgement

Not applicable. This workflow records what was supplied rather than evaluating it. Judgement calls it
does make are already declared under **Guessed at**, and the normal case checks that list.

## Record

| Date | Case | What happened | What changed after |
|---|---|---|---|
|  |  |  |  |

Change one thing at a time.

---

*Design Agents Toolkit by [designsystems.surf](https://designsystems.surf). Questions? hey@designsystems.surf*
