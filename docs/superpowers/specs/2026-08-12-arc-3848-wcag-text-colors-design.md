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

Split `GET_DARK_BACKGROUND_COLOR_OPTIONS` into:

- `GET_DARK_BACKGROUND_COLOR_OPTIONS_AVO` — unchanged, current membership
  (`SoftBlue, NightBlue, Teal, TealBright, OceanGreen, SeaGreen, Yellow, Black`).
- `GET_DARK_BACKGROUND_COLOR_OPTIONS_ARCHIEF` — `[Black, OldPink]`, per the PDF.

Pick between them with the existing `isAvo()` helper
(`ui/src/react-admin/modules/shared/helpers/is-avo.ts`), mirroring the pattern already
used in `defaults.ts` for `BACKGROUND_COLOR_FIELD` / `FOREGROUND_COLOR_FIELD`.

Update the two call sites:

- `ui/src/react-admin/modules/content-page/components/ContentBlockRenderer/ContentBlockRenderer.tsx`
  (`hasDarkBg`)
- `ui/src/react-admin/modules/content-page/components/blocks/BlockPageOverview/BlockPageOverview.wrapper.tsx`
  (`darkTabs`)

## Out of scope

- The meemoo-logo background (`CustomBackground.MeemooLogo`) — not a flat color, not
  covered by the PDF, left unchanged.
- The black↔white gradient background (`GradientColor.BlackWhite`) — fades top-to-bottom,
  no single correct text color, not covered by the PDF, left unchanged.
- AVO-only background colors (`SoftBlue`, `NightBlue`, `Teal`, `TealBright`, `Yellow`,
  `Gray50`, etc.) — different brand book, out of scope for this ticket.

## Testing

Existing test setup uses vitest. No dedicated tests currently cover
`GET_DARK_BACKGROUND_COLOR_OPTIONS` or the two call sites; this change is small enough to
verify by reading the diff and, if time permits, a quick manual check in the ui demo app
(`npm run dev` in `ui/`) with a content block set to `OldPink`/`OceanGreen`/`SeaGreen`
backgrounds.
