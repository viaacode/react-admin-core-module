// Shared with the .scss/component so this class name only lives in one place.
export const STACKED_CLASS = 'c-block-het-archief-quote--stacked';

// Computed custom properties (--bleed/--stack-padding-x) come back as unresolved rem strings.
const readRemCustomProperty = (
	style: CSSStyleDeclaration,
	customProperty: string,
	rootFontSize: number
): number => (Number.parseFloat(style.getPropertyValue(customProperty)) || 0) * rootFontSize;

// Whether the bled layout (see .scss) would spill past the viewport edge on either side.
// viewportWidth should be clientWidth, not innerWidth, so the scrollbar isn't counted as page width.
export const computeIsStacked = (figureEl: Element, viewportWidth: number): boolean => {
	const style = getComputedStyle(figureEl);
	const rootFontSize = Number.parseFloat(getComputedStyle(document.documentElement).fontSize) || 16;

	const bleedPx = readRemCustomProperty(style, '--bleed', rootFontSize);
	// --stack-padding-x only matters once the stacked layout is actually on screen.
	const currentBleedPx = figureEl.classList.contains(STACKED_CLASS)
		? readRemCustomProperty(style, '--stack-padding-x', rootFontSize)
		: bleedPx;

	const rect = figureEl.getBoundingClientRect();
	// Re-derives the gap the bled layout would leave, from whichever layout is actually rendered,
	// via the shift between the two layouts' own bleed margins.
	const edgeShift = currentBleedPx - bleedPx;
	const leftGapIfBled = rect.left + edgeShift;
	const rightGapIfBled = viewportWidth - rect.right + edgeShift;

	// Stack once the bled layout would actually cross the edge (a negative gap), not against a
	// fixed clearance margin.
	return Math.min(leftGapIfBled, rightGapIfBled) < 0;
};
