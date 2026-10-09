# Tests Template

A setup is not finished when the files exist. It is finished when you have run it against realistic
cases and know how it behaves.

This template holds four things: what the setup was when you ran it, what it did with no setup at all,
the cases that match the risks this workflow actually has, and what you changed afterwards.

**Two ways to use it:**

- **Fill it with an LLM.** Paste this file in along with your Skill and say "build my test cases". It
  will work out which risks exist and propose cases from your own material.
- **Fill it yourself.** Copy the block at the bottom into TESTS.md beside your Skill.

---

## Instructions for the AI

**This block is scaffolding and must not appear in the finished file.**

### Building mode

Start by working out which risks this workflow actually has. The test set follows the workflow, not
the template.

**Always include the normal case.** Complete inputs, nothing unusual. It checks that the output holds
its shape.

**Add each of these only when the matching risk exists:**

| Case | Include it when |
|---|---|
| Missing required input | the workflow has required inputs whose absence should change what it does |
| Conflicting sources | the workflow can receive the same information from more than one source |
| Tool failure | the workflow depends on a tool, a permission, or an external action |
| Ambiguous judgement | the Skill evaluates, critiques, prioritises, or classifies |

If a case does not apply, leave it out and say why. Record those decisions in the **Which cases apply**
table at the top of the file, so the reasoning sits in one place rather than scattered through the
cases. Do not write a case for a situation the workflow cannot be in.

Do not take the reader's word for which risks exist. Someone who says "there is no second source here"
often has two: a Skill that takes both an image and its caption, or both a spec and a token export,
can receive them disagreeing. Check the Inputs section of their Skill rather than the sentence they
wrote to you.

Always fill the **Setup under test** block. The same case can have different correct outcomes
depending on which parts were loaded, so a result recorded without it carries no information. It is
also what tells you where an applicable precedence rule came from.

Where a precedence rule exists, suggest running the conflicting-sources case twice: once with it
loaded and once without. That tells the reader whether the behaviour comes from their rule or from the
model's own instinct, and only the first survives a change of model.

**The baseline is the reader's to run, not yours.** You cannot run their Skill, and you do not have
their material. Leave the row empty, write the exact prompt they should use, and list the specific
failures to watch for. Say plainly that the file cannot tell them whether the setup helped until
they fill it in.

Keep the cases small enough that the reader will actually run them.

### Check before you output

- Every case names what a correct run looks like, in terms someone could check
- Every case names the failure it is checking for
- Cases that do not apply are named as not applicable, with the reason
- Nothing in the file promises automated execution

---

## The template

```markdown
# Tests: [workflow name]

## Setup under test

An expected result only means something against a stated setup.

- Skill: [file]
- Reference files: [the ones beside it, or none]
- Project instructions: [loaded / not loaded, and which file]
- Tools connected: [list, or none]
- Model: [the one you actually use]

## Which cases apply

| Case | Applies | Why |
|---|---|---|
| Normal | Yes | Always |
| Missing required input | [Yes / No] | [the risk this workflow has, or why it cannot arise] |
| Conflicting sources | [Yes / No] | [ ] |
| Tool failure | [Yes / No] | [ ] |
| Ambiguous judgement | [Yes / No] | [ ] |

## Done means

[Take these from the Skill's own done conditions. What must be true for a run to count as correct.]

- [ ]
- [ ] Needs a person: [ ]

## Baseline

[Run the job once with no setup at all, then record what happened. This is the only honest measure of
whether the setup helped, and the invented items become the first draft of your Never list.]

| Case | What happened with no setup |
|---|---|
| Normal | [ ] |

## Normal case

**Input:** [complete material, nothing unusual]
**Expect:** [what a correct run produces]
**Fails if:** [the specific thing that would mean it did not work]

## Missing required input

[Include only if a required input's absence should change what the workflow does. Otherwise write
"Not applicable" and say why.]

**Input:** [the same material with one required item removed. Name which one]
**Expect:** it asks for the missing item rather than continuing.
**Fails if:** it completes the job anyway. If it does, read the output and find what it supplied in
place of the missing item, then strengthen the inputs section of the Skill and run it again.

## Conflicting sources

[Include only if the workflow can receive the same information from more than one source.]

**Input:** [material containing a real contradiction. Name both sources]

**Is there an applicable precedence rule?** [where it lives: the project instructions, the Skill, or
nowhere]

**Expect, with an applicable rule loaded:** it follows the rule, and says which source it followed
where that matters, rather than resolving it quietly.

**Expect, with no applicable rule:** it surfaces the conflict, names both sources, does not choose
between them, and asks or stops where the job cannot continue without an answer.

**Fails if:** it mixes the two, or settles the disagreement without mentioning that it did. Silently
correct is still a failure: you learn nothing about how the next conflict will go.

[If a precedence rule applies, run this once with it loaded and once without. Matching results mean
the rule is not doing the work, and the behaviour will change when the model does.]

## Tool failure

[Include only if the workflow uses a tool.]

**Input:** [the normal case, run while the tool is unavailable, lacking permission, returning partial
results, or failing to complete an action]

**Expect:** it follows the fallback the Skill defines, and says which part of the result is missing or
unverified.

**Fails if:** it carries on as though the tool had answered, or fills the gap with something plausible.

## Ambiguous judgement

[Include only if the Skill evaluates, critiques, prioritises or classifies.]

**Input:** [a realistic case where part of the answer needs judgement, or depends on a decision the
project has never made]

**Expect:** it separates what the supplied rules determine from what needs a person, completes the
part it is authorised to complete, and hands the rest back without turning it into a project fact.

**Fails if:** it resolves the judgement silently, or refuses the whole task because one part of it was
unresolved.

## Record

| Date | Case | What happened | What changed after |
|---|---|---|---|
|  |  |  |  |

Change one thing at a time. Changing several means the next run does not tell you which one helped.
```

---

*Design Agents Toolkit by [designsystems.surf](https://designsystems.surf). Questions? hey@designsystems.surf*
