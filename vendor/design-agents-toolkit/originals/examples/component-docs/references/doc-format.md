# House documentation format

## Contents
- Section order
- What each section contains
- Worked example
- Review checklist

**To whoever sets this up, not to the Skill:** replace the section order and the worked example
with your own. The structure is what matters. Whatever ends up in this file is what the Skill treats
as the agreed format, so it is canonical from the Skill's point of view even while it still says this.

---

## Section order

Every entry uses these headings, in this order, with no additions and no renaming. A section with
nothing to say gets the line `Not applicable for this component.`

1. `## Overview`
2. `## When to use`
3. `## When not to use`
4. `## Anatomy`
5. `## Variants`
6. `## States`
7. `## Behaviour`
8. `## Tokens`
9. `## Accessibility`
10. `## Content`
11. `## Do and don't`
12. `## Related`

---

## What each section contains

**Overview.** Two sentences. What the component is for, and the one decision it takes off the
reader's plate. No visual description.

**When to use / When not to use.** Two to four bullets each, phrased as situations rather than
properties. "The user must choose before continuing" is a situation. "It is a modal" is not. The
"not" list is the more useful of the two and is never empty.

**Anatomy.** The named parts, in the order they appear, each marked required or optional.

**Variants.** One line per variant: name, and the situation it exists for. If two variants cannot be
told apart by situation, say so. That is a design problem worth surfacing.

**States.** One line per state, describing behaviour rather than appearance. Cover at minimum
default, hover, focus, active, disabled, loading and error, omitting any that genuinely do not exist.

**Behaviour.** What happens on interaction, on failure, and at the edges: long content, no content,
slow response, small screens.

**Tokens.** Token names only, grouped by what they control, exactly as they appear in the source. If
not supplied, the single line `NOT SUPPLIED`.

**Accessibility.** Keyboard path, what a screen reader announces, focus handling, and anything a
designer must specify per use. Flag anything uncertain for review rather than deciding it.

**Content.** Length limits, capitalisation, tone, and what the text must not do.

**Do and don't.** Three to five pairs. Each pair is one line of do and one line of don't about the
same decision. Non-obvious only.

**Related.** Components easy to confuse with this one, each with one line on how to choose.

---

## Worked example

```markdown
## Overview
Button triggers an action in place. It is the component to reach for when the result happens on the
current screen rather than somewhere else.

## When to use
- The action completes without leaving the screen
- The user needs a clear, single next step
- The action can be described in one or two words

## When not to use
- The action navigates somewhere. Use Link, so the browser behaves normally
- There are more than two equally weighted actions. Use a menu
- The control toggles a setting rather than performing an action. Use Switch

## Anatomy
- Label (required)
- Leading icon (optional)
- Loading indicator (replaces the leading icon while pending)

## Variants
- Primary: the one action the screen is asking for
- Secondary: supporting actions alongside a primary
- Ghost: actions inside dense surfaces such as table rows

## States
- Default: actionable
- Hover: signals actionability, no change in meaning
- Focus: reachable and visible by keyboard, never removed
- Active: held during the press
- Disabled: not actionable and not focusable. The reason must be visible nearby
- Loading: not actionable, label stays, width does not change
- Error: the button does not carry error state. The surrounding form does

## Behaviour
Fires once per activation. While loading, further activations are ignored rather than queued. On
failure the button returns to default and the error is shown by the form. The label never truncates:
a label that does not fit is a label that is too long.

## Tokens
Surface: `color.action.primary.default`, `color.action.primary.hover`
Text: `color.on-action.primary`
Spacing: `space.button.x`, `space.button.y`
Radius: `radius.action`

## Accessibility
Reachable by Tab, activated by Enter and Space. Announces its label and its disabled or busy state.
An icon-only button requires an accessible label supplied per use. Disabled buttons are not
focusable, so any explanation lives outside the button.

## Content
One to three words, sentence case, starting with a verb. Never "Click here". Never a full sentence.
Labels do not end in punctuation.

## Do and don't
- Do write the label as the outcome ("Save changes") / Don't write it as the mechanism ("Submit form")
- Do keep one primary button per screen region / Don't stack two primaries to show two options are
  equal. Pick one
- Do disable during a pending request / Don't hide the button while pending, because the layout
  shifts and the user loses their place
- Do explain why a button is disabled, next to it / Don't rely on a tooltip on a disabled control,
  which may never be reachable

## Related
- Link: use when the result is a different location
- Switch: use when the control reflects a state rather than starting an action
```

---

## Review checklist

- [ ] Every heading in the section order above is present, in order, unrenamed
- [ ] Overview is two sentences and contains no visual description
- [ ] "When not to use" is not empty
- [ ] Every state describes behaviour rather than appearance
- [ ] Every token name appears in the supplied source
- [ ] Every usage example came from supplied material
- [ ] Every do and don't pair covers one decision and is non-obvious
- [ ] Accessibility names the keyboard path and what is announced
- [ ] Anything uncertain is listed under **Guessed at** rather than smoothed over

---

*Design Agents Toolkit by [designsystems.surf](https://designsystems.surf). Questions? hey@designsystems.surf*
