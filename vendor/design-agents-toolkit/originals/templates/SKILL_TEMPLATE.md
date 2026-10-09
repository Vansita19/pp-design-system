# Skill Template

A Skill holds one repeatable workflow: what it produces, what it needs, how it runs, what it must not
decide, and what it verifies before returning a result.

Define the workflow first, then build the Skill, then test it with the Tests Template beside this
file. Add context, project instructions, reference files or tools later, only where the workflow
turns out to need them.

**Two ways to use it:**

- **Fill it with an LLM.** Paste this whole file into Claude or Cursor, or any LLM, and say "fill this
  with me". It will work through the workflow with you and hand back the finished file.
- **Fill it yourself.** Copy the template block at the bottom into a new file called SKILL.md and
  replace each bracketed hint with your own line.

## Is this workflow worth a Skill?

A Skill pays for itself when the procedure repeats while the input changes, the expected result stays
stable, the inputs can be named in advance, the boundary is clear, and the recurrence or the cost of
getting it wrong justifies the setup.

Frequency is one signal among these, not a threshold. When the instruction fits in a sentence, or the
correct procedure changes every time, a prompt is the better tool.

---

## Instructions for the AI

**This block is scaffolding and must not appear in the finished file.** It describes how to fill the
template. It is not part of the workflow being written.

### Pick a mode

If any field below still contains a bracketed hint, you are in **Building mode**.
If every field is filled, treat the file as an active Skill and follow it.

### Building mode

**First, run the gate above.** Ask whether this workflow is worth a Skill at all before filling
anything in. If a sentence-long prompt would do the same job, say so and stop. Building a Skill for
a workflow that did not need one is the most expensive mistake available here.

Then fill the five parts in this order. The order matters: each one narrows the next.

1. **Output.** What the Skill returns, and what has to be true for the job to count as done. Ask for
   one good past result if the reader has one: an example carries structure and level of detail better
   than a description.
2. **Inputs.** Required and optional, and what happens when a required one is missing. Choose
   deliberately between stopping and continuing with the gap marked. Ask how each input actually
   reaches the Skill: read by a tool, pasted in, or attached as an export. When a tool may or may not
   be connected, the Skill needs a working path for both, and it needs to record which one it used.
   A result built from a screenshot and a result read from the file are not the same result.
3. **Procedure.** Get the reader's existing process out of their head, one short question at a time.
4. **Boundaries.** What the Skill may settle from the supplied rules, where it stops and asks, and
   what it must never do. These three follow from each other, so write them together.

   Keep missing inputs out of this section. What happens when a required input is absent belongs in
   Inputs, next to the input it concerns. Boundaries covers decisions and conflicts. Writing the same
   stop in both places gives the Skill two rules to reconcile.
5. **Final checks.** What it verifies before returning the result.

Two questions do most of the work on parts 3 and 4:

- "Walk me through the last time you did this."
- "What did the AI get wrong when you tried this before?"

Push on the second, and ask for specific failures rather than a general impression.

**What you may propose, and what you may not.** Workflow structure, candidate steps, an order, or a
check the reader has not thought of are yours to suggest. Mark every proposal clearly, for example
PROPOSED, and wait for the reader to confirm, reject or amend it. **Project rules, business decisions,
source-of-truth choices, naming conventions and anything specific to how the reader's organisation
works are never yours to invent**, whether marked as a proposal or not.

**When the reader has no failures to put in Never.** Someone doing this for the first time has not
watched an LLM get it wrong yet, and the rule against inventing entries leaves the section blank.
Do not fill it with generalities. Instead, say the block will be written after the first few real
runs, and point at the tests: the Tests Template beside this one produces exactly the failures that
belong here. A Never block written from three real runs is worth more than ten plausible ones.

Where an answer would require the reader to check with a colleague, write undecided and continue. An
undecided field is a useful finding: it marks a point where the process has no rule and the LLM would
otherwise have guessed.

Keep undecided and Stop and ask apart. Undecided marks a field that could not be filled now. Stop and
ask describes a situation the workflow will meet repeatedly.

### Check before you output

Fix anything that fails, then say in one line what you fixed.

**Required by the Agent Skills specification:**

- name is 1 to 64 characters, lowercase letters, numbers and hyphens only. It must not start or end
  with a hyphen, must not contain consecutive hyphens, and must match the name of the directory the
  file sits in
- description says both what the Skill does and when to use it, in words that would appear in a real
  request

**Required by individual platforms, on top of the specification:**

- Some platforms cap the description well below the specification limit. Keeping it under 200
  characters lets the same file work everywhere unchanged. Report the character count

**Recommended, required by nothing:**

- Keep the body short enough to read in one sitting
- Put long reference material in a separate file beside the Skill, referenced directly, so it loads
  only when the procedure calls for it

**Content:**

- The file opens with a title and one or two unheaded paragraphs carrying the trigger and the
  boundary of the job. Then exactly five sections: Output, Inputs, Procedure, Boundaries, Final checks
- Output opens with a Done means line stating what has to be true for the job to count as complete,
  with checkable conditions and the ones needing a person visibly separated, not run together in
  one sentence
- Output says what the Skill hands back when it stops rather than finishes. Stopping is a designed
  outcome here, and a stop with no defined shape produces a different answer every run
- Every step is one action with a result someone could check. "Analyse" and "consider" describe
  thinking, not steps
- Boundaries carries three labelled blocks: what the Skill may decide, where it stops and asks, and
  what it must never do
- Generic explanation that would not change how the agent behaves is removed. Explicit rules, checks
  and procedures stay, even when the LLM could have worked them out, because the point is that they
  happen every time rather than usually
- Anything you proposed is confirmed by the reader, removed, or left in place still marked PROPOSED.
  If any marker remains, say so when you hand the file over: a file with an unconfirmed proposal in it
  is a draft, not one to install

### Output

Give the finished file as a **single markdown block**, starting with the frontmatter, and containing
no line from these instructions. Below the block, and outside it:

- The install path for the tool the reader named, and nothing about the others. If they have not named
  one, ask.
- Any field left undecided.
- Anything still marked PROPOSED, and a line saying the file is not ready to install until those are
  resolved.
- One sentence offering to draft their tests from the same conversation.

---

## The template

Copy everything inside the block below, including the three dashes above `name` and the three below
`description`. Those two lines are the frontmatter fences and the file does not load without them.
Do not copy this paragraph, and do not copy the line under the block.

````markdown
---
name: [lowercase-with-hyphens, matching the directory this file will sit in. Name the job, not a role: component-docs, not docs-helper]
description: [What this does and when to use it, in words that would appear in a real request. This line carries most of the signal a tool uses to decide whether the Skill is relevant. "Writes a component doc entry in our house format. Use when documenting a new or changed component" works. "Helps with documentation" does not. Keep it under 200 characters so it travels between platforms unchanged.]
---

# [Workflow name, as you would say it out loud]

[The trigger: what happens that means this workflow should start. A situation, not a capability. "A
component is approved or materially updated" is a trigger. "Documentation support" is not.]

[And the boundary: where the workflow ends, and one line on when not to use it. The boundary is what
stops the workflow expanding into decisions it was never meant to make.]

## Output

**Done means.**

Checkable:

- [Condition anyone could verify by looking at the result.]

Needs a person:

- [Condition that requires a judgement the Skill is not allowed to make.]

[Then the result itself: what comes back, and in what shape. If you have one good past result, paste
it here.]

**If it stops.** [What comes back when a required input is missing or a stop condition fires: which
input or condition stopped it, what was already worked out and is worth keeping, and the shortest
thing the reader can send to unblock it. A bare refusal gets the Skill uninstalled.]

## Inputs

[What has to be in front of it. Mark each REQUIRED or OPTIONAL.]

- [Thing you always need (REQUIRED)]
- [Thing that improves the result but is not essential (OPTIONAL)]

[Say what happens when a REQUIRED item is missing. If the gap would change the decision, the output or
the interpretation, stopping is right. Where continuing is acceptable, say what gets marked instead of
filled. Write this per input, here, rather than in Boundaries.]

[If a tool may read any of this, say what happens when it is absent or fails, and say that the Skill
records which path it used.]

## Procedure

[Number the steps. Each one is a single action with a result you could point at. If you wrote
"analyse" or "consider", that step still describes thinking.]

1. [ ]
2. [ ]
3. [ ]

## Boundaries

**The Skill may decide.** [What is fully determined by the supplied inputs, rules and sources. These
are the calls it should make without asking.]

- [ ]

**Stop and ask.** [Where the decision is outside the Skill's authority, or the information needed is
not there. Most workflows have at least one. If yours genuinely has none, say so here rather than
inventing a checkpoint.]

- [ ]

**Never.** [The specific things that have already gone wrong. Write the real ones, from actual
attempts. "Never invent a token name" is useful. "Never produce poor work" is not.]

- [ ]

## Final checks

[What it verifies before you see the result. At least one should check a Done means condition.]

- [ ]
- [Keep one check that lists anything guessed at, so it can be corrected rather than absorbed.]
````

---

*Design Agents Toolkit by [designsystems.surf](https://designsystems.surf). Questions? hey@designsystems.surf*
