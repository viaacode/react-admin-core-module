# Content blocks

Each content block lives in its own folder here and is made up of a small trio of
files:

| File | Purpose |
|---|---|
| `Block<Name>.editorconfig.ts` | Declares the **editor** config: which fields the admin sees, their editor types, validators, defaults, and initial state. This is the file you copy when creating a new block. |
| `Block<Name>.tsx` | The **preview/render** component that turns saved state into markup on the public page. |
| `Block<Name>.types.ts` | (optional) Component-state / prop types for that block. |

A block config (`ContentBlockConfig` in
[`../../types/content-block.types.ts`](../../types/content-block.types.ts)) has
two sibling sections:

- **`components`** — the block's actual content. Its `state` may repeat (see
  below). Rendered by the form and passed to the preview component as props.
- **`block`** — block-level "Blok-opties" (background, padding, user groups, …).
  Always a single object, never repeated.

---

## Repeated fields: two mechanisms

There are two entirely different ways to let an admin add/remove multiple
instances of something. They look similar in the UI but are wired up completely
differently. **For new blocks, always use mechanism B.**

### A — array-valued `components.state` *(legacy — do not use for new blocks)*

The **whole** `components` config repeats as a unit: `components.state` is an
array, and every field is duplicated per array entry. Used by ~14 older blocks
(Buttons, CTAs, ImageGrid, MediaGrid, Spotlight, …).

This path is driven by machinery outside the editorconfig:

- the block type must be added to the hardcoded `REPEATABLE_CONTENT_BLOCKS`
  allowlist ([`../ContentBlockRenderer/ContentBlockRenderer.const.tsx`](../ContentBlockRenderer/ContentBlockRenderer.const.tsx));
- count is bounded by `components.limits.{min,max}`;
- add/remove goes through dedicated reducer actions
  (`ADD_COMPONENTS_STATE` / `REMOVE_COMPONENTS_STATE`) plumbed through four
  components;
- at render time the array is wrapped as the `elements` prop
  ([`../ContentBlockRenderer/ContentBlockRenderer.tsx`](../ContentBlockRenderer/ContentBlockRenderer.tsx)).

Limitations: only **one** repeatable set per block, and you cannot mix repeated
and non-repeated (scalar) fields at the same level.

```ts
// BlockButtons.editorconfig.ts — components.state IS the array
components: {
  limits: { max: 3 },
  state: [{ label: '', type: 'primary' }], // ButtonsBlockComponentState[]
  fields: { /* type, label, icon, buttonAction … repeated per entry */ },
}
```

### B — `fieldGroup` + `repeat` *(preferred)*

`components.state` is a single object; a **field** inside it holds the array and
declares `type: 'fieldGroup'` + a `repeat` descriptor. Repetition is fully
config-driven and local — no allowlist, no reducer actions. You can have several
independent repeated groups alongside ordinary scalar fields, and it's all
handled in [`../FieldGenerator/FieldGenerator.tsx`](../FieldGenerator/FieldGenerator.tsx).

```ts
// BlockOverviewWithCarousel.editorconfig.ts — state is an object;
// the `elements` field repeats.
components: {
  state: {
    title: '',
    titleType: '',
    elements: [INITIAL_ELEMENT_STATE()], // the repeated array lives in a field
  },
  fields: {
    title: TEXT_FIELD({ /* … */ }),        // scalar field, alongside…
    elements: {
      label: 'Content item',
      type: 'fieldGroup',
      fields: { /* mediaItem, image, title, … repeated per element */ },
      repeat: {
        defaultState: INITIAL_ELEMENT_STATE(),
        addButtonLabel: 'voeg object toe',
        deleteButtonLabel: 'verwijder object',
      },
      // optional: min, max
    },
  },
}
```

> A plain (non-group) field can also repeat: give a `ContentBlockField` a
> `repeat` descriptor to repeat a single editor (e.g. a list of text values).
> This is the same B code path in `FieldGenerator` (`handleField`).

### A vs B at a glance

| | A: `components.state` is an array | B: `fieldGroup` + `repeat` |
|---|---|---|
| What repeats | the whole `components` config | one field(-group) inside the config |
| Driven by | `REPEATABLE_CONTENT_BLOCKS` allowlist + reducer actions + `limits` | config only (`repeat`, `min`/`max`) |
| Repeatable sets per block | exactly one | any number |
| Scalar fields alongside | no | yes |
| Stored shape | `components: [ {…}, {…} ]` | `components: { …, elements: [ {…} ] }` |
| Add/remove code | 4-component prop chain + 3 reducer actions | none (local `handleChange`) |
| Render prop | array wrapped as `elements` | the state object, spread |

### Which do I use?

Use **B** for every new block. Mechanism A is kept only for the existing blocks
that already rely on it — **do not extend it**: don't add new block types to
`REPEATABLE_CONTENT_BLOCKS`, and don't reach for `components.limits` or the
`ADD_/REMOVE_COMPONENTS_STATE` actions in new work. (They're marked `@deprecated`
for this reason.)

We deliberately have **not** migrated the legacy blocks to B: their state is
already persisted in the DB as bare arrays, so a switch would require a data
migration of all saved content pages plus prop changes in every affected preview
component.

---

## Key files

- [`../ContentBlockForm/ContentBlockForm.tsx`](../ContentBlockForm/ContentBlockForm.tsx) —
  renders the block form; the A branch is `Array.isArray(formGroup.state)`.
- [`../FieldGenerator/FieldGenerator.tsx`](../FieldGenerator/FieldGenerator.tsx) —
  the B branch: `fieldGroup.repeat` (group) and `field.repeat` (single field).
- [`../../types/content-block.types.ts`](../../types/content-block.types.ts) —
  `ContentBlockConfig`, `ContentBlockComponentsConfig`, `ContentBlockField`,
  `ContentBlockFieldGroup`.
- [`../../helpers/validate-content-block-config.ts`](../../helpers/validate-content-block-config.ts) —
  validation branches on `Array.isArray(state)` (mechanism A); mechanism B
  validates through the normal per-field path.
