export const LABELS_PER_PAGE = 10;

/**
 * The hetarchief content types whose labels never get a generated visual label, so the overview
 * table shows no preview for them. The FA names FAQ items as the example of a label that has
 * nothing to show; an overview block of faq items renders accordions rather than images, so there
 * is no thumbnail to draw a label over. https://meemoo.atlassian.net/browse/ARC-3818
 *
 * Plain strings because AvoContentPageType is the avo flavoured enum and has no FAQ_ITEM, while
 * content_type carries the hetarchief lookup values at runtime.
 */
export const CONTENT_TYPES_WITHOUT_A_VISUAL_LABEL: string[] = ['FAQ_ITEM'];
