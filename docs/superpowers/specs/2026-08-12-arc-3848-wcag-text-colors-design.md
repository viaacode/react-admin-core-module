# ARC-3848: WCAG text colors on content-block background colors

## Problem

ARC-3795 added 10 tertiary background colors to hetarchief.be content blocks. Content
blocks that don't expose a configurable text-color field derive their text color from a
single shared "dark background" list (`GET_DARK_BACKGROUND_COLOR_OPTIONS` in
`ui/src/react-admin/modules/content-page/const/get-color-options.ts`). Anything on the
list gets forced white text; everything else defaults to black.

That list is shared between AVO and hetarchief (ARCHIEF), but the two products have
different brand palettes. Checked against the design team's authoritative
`meemoo-hetarchief-kleurencombinaties.pdf` (attached to ARC-3848), the ARCHIEF palette has
two mismatches:

- `OceanGreen` (#00C8AA) and `SeaGreen` (#009690) are currently forced to white text, but
  the PDF shows black passes AA on both.
- `OldPink` / "Oud roze" (#9B6072), one of the ARC-3795 tertiary colors, currently defaults
  to black text (not on the list), but the PDF requires white there for AA — this is the
  actual gap the ticket exists to close.

Every other ARCHIEF background color (White, Platinum, SkyBlue, and the other 9 tertiary
colors) already defaults correctly to black per the PDF.

AVO's own use of `OceanGreen` etc. is governed by a different brand book and must not
change.

## Design

One predicate, `hasDarkBackground(color)`, replaces `GET_DARK_BACKGROUND_COLOR_OPTIONS`. It
picks per app with the existing `isAvo()` helper, so no call site repeats the switch.

**Archief is computed, not listed.** The rule meemoo stated is mechanical, so
`getContrastRatio(color, white) >= 4.5` (a new
`ui/src/react-admin/modules/shared/helpers/get-contrast-ratio.ts`) decides it. A
hand-maintained list is a second source of truth next to the palette, and the two drift —
that drift is exactly what put unreadable white text on ocean green (2.13:1). With the rule
computed, a colour added to the palette is handled the moment it is added.

The computation reproduces **29 of the 30** background rows in
`meemoo-hetarchief-kleurencombinaties.pdf`. The PDF stays the authority: it lives in
`get-color-options.test.ts` as a fixture asserted row by row, rather than being hand-copied
into the source.

**AVO keeps its literal list** (`DARK_BACKGROUND_COLOR_OPTIONS_AVO`, unchanged membership).
Its palette predates this rule and does not follow it — white on `Color.Yellow` is 1.2:1 —
so it must not be recomputed.

Gradients, `CustomBackground.MeemooLogo` and `Color.Transparent` have no single luminance,
so `getContrastRatio` returns `null` and they keep black text. That is now an explicit
documented fallback rather than an accidental omission from a list.

White text is applied with the existing `u-color-white` utility, the same mechanism
`ContentBlockRenderer` already uses, so no new per-block CSS was added.

### Call sites

The ticket scopes this to every content block that renders text on an admin-picked color
without offering a text color field of its own. Those are:

- `ContentBlockRenderer.tsx` (`hasDarkBg`) — the generic block-level `backgroundColor`,
  covers every block that uses the shared background field.
- `BlockPageOverview.wrapper.tsx` (`darkTabs`) — block-level `headerBackgroundColor`.
- `BlockHighlightText.tsx` — has its own `highlightColor` field in **component** state, so
  `ContentBlockRenderer`'s `hasDarkBg` (which reads block state) never sees it. The text
  sits inside the highlighted box, so the text color follows `highlightColor`, not the
  block background. Gradients render that box white and the meemoo logo renders it
  transparent, so both keep black text.
- `BlockOverviewThemesGroupSection.tsx` — the group title sits on the full-bleed band,
  whose color comes from `GET_SECONDARY_BACKGROUND_COLOR_OPTIONS_ARCHIEF()[groupIndex]`.
  Index 0 is `OldPink`, so the first group's title needs white. Only applied once the band
  is measured; before that the title sits on the page background.

`BlockHomepageBanner` also has a component-state color field (`bannerColor`), but it only
paints the decorative, `aria-hidden` pattern strips — its title and body text sit on the
page background — so it needs no text color rule.

## Out of scope

- The meemoo-logo background (`CustomBackground.MeemooLogo`) — not a flat color, not
  covered by the PDF, left unchanged.
- The black↔white gradient background (`GradientColor.BlackWhite`) — fades top-to-bottom,
  no single correct text color, not covered by the PDF, left unchanged.
- AVO-only background colors (`SoftBlue`, `NightBlue`, `Teal`, `TealBright`, `Yellow`,
  `Gray50`, etc.) — different brand book, out of scope for this ticket.

## Open questions

- **The PDF prescribes white text on Zink #ADADAD, where white scores 2.24:1.** That fails
  AA and fails even the 3:1 large-text threshold — the only row of the 30 that the stated
  rule does not reproduce, so it looks like an error in the PDF. Zink is a foreground option
  only, never a background, so nothing depends on it today. Needs a ruling from design.
- The ticket asks for a primary **and** a secondary text color per background; this
  implements primary only. The PDF does list secondary colors (e.g. Zink/Teal on black),
  so a follow-up may be needed.
- `SkyBlue` (#C3DDE6) and `LightBlue` (#BDDEE7) do not appear in the PDF at all (the
  nearest entry is Baby blauw #8DDEE7). Computation puts black text on both, which is
  clearly right, but they are unconfirmed by design.
- `ContentPageLabelChip` is currently hardcoded to white text (reverted in ARC-3818 pending
  this color list). It is not a content block, so it stays out of this ticket, but it now
  has the list it was waiting for — raised on ARC-3818.

## Testing

- `get-contrast-ratio.test.ts` — the WCAG formula against WebAIM reference values, shorthand
  hex (`Color.Black` is `#000` and `Color.White` is `#FFF`), mixed casing (`Color.Lila` is
  lowercase), and `null` for every non-hex value the pickers can hold.
- `get-color-options.test.ts` — all 30 PDF rows as a fixture, plus a test that walks every
  option in `GET_BACKGROUND_COLOR_OPTIONS_ARCHIEF()` and asserts a correct ruling for each,
  so a colour added to the palette cannot silently miss out. AVO's list is asserted
  unchanged.

Beyond that, a manual check in the ui demo app (`npm run dev` in `ui/`) with a highlight
text block on `OldPink`/`SeaGreen` and a theme overview whose first group has a title.
