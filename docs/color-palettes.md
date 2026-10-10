# Primitive color palettes

Every registered hue has the complete 50–950 shade range in `dist/tokens.js`: Neutral, Blue, Green, Red, Purple, Amber, Orange and Sky. Keep full primitive ranges even when only a few shades are used. Semantic and component aliases remain limited to their actual roles.

As requested on 11 October 2026, every shade now matches the complete hex ramp from [Tailwind CSS 3.4.17](https://github.com/tailwindlabs/tailwindcss/blob/v3.4.17/src/public/colors.js). Green uses Green, Red uses Red, and the existing `gray` namespace uses Neutral. Blue, Purple, Amber, Orange and Sky use their matching families. `references/tailwind-palettes.json` records the verified upstream values; the registry check prevents mixed shades from returning.

Custom intermediate shades were removed. Consumers now use Gray 50 instead of 75, Purple 200 instead of 250, Amber 50 instead of 75 and Amber 400 instead of 450. Primary actions use Blue 600/700/800 for default/hover/pressed; destructive button text uses Red 800 to retain contrast in its pressed state. Danger indicators use Red 500. Focus-ring colors reference the primitive variables with 20% opacity.

Use a complete, pinned palette for future families. Do not insert an isolated custom shade into a standard ramp. A future brand-specific palette must be designed and reviewed as a complete scale. The organizer's dark shell and brand/image artwork are separate from these product primitives.

`F.paletteEntries` explicitly places white before numbered shades and orders numeric steps ascending. Do not rely on JavaScript object insertion order for white. Component modules consume the central primitives rather than adding isolated color shades.
