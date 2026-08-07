export const LABELS_PER_PAGE = 10;

/**
 * The hetarchief content types whose labels get a generated visual label drawn over their image.
 * The FA shows the generated label in the overview table but says nothing is shown when no label
 * is available, "e.g. voor FAQ-items", and describes the label as appearing on the images of
 * "blogposts of pagina's". https://meemoo.atlassian.net/browse/ARC-3818
 *
 * Plain strings because AvoContentPageType is the avo flavoured enum and has no BLOG_POST, while
 * content_type carries the hetarchief lookup values at runtime.
 */
export const CONTENT_TYPES_WITH_A_VISUAL_LABEL: string[] = ['BLOG_POST', 'PAGINA'];
