export interface ThemeTileSpan {
	colSpan: 1 | 2 | 3;
	rowSpan: 1 | 2;
}

const SQUARE: ThemeTileSpan = { colSpan: 1, rowSpan: 1 };
const TALL: ThemeTileSpan = { colSpan: 1, rowSpan: 2 };
const WIDE: ThemeTileSpan = { colSpan: 2, rowSpan: 1 };
const FULL_WIDTH: ThemeTileSpan = { colSpan: 3, rowSpan: 1 };

/**
 * Computes a "braided snake" layout for a 3-column grid: a chain of tall tiles alternates
 * between the outer columns (each overlapping the row below), the middle column is always a
 * plain square, and the final row closes out the grid with either 2 squares or 1 wide tile —
 * whichever exactly uses up the remaining items, so the grid is always a filled rectangle.
 *
 * This relies on the browser's default (non-dense) CSS grid auto-placement: as long as tiles
 * are rendered in the order returned here, each one lands in the correct cell on its own —
 * no explicit grid-column/grid-row line numbers are needed.
 */
export const getThemeTileSpans = (count: number): ThemeTileSpan[] => {
	if (count <= 0) {
		return [];
	}
	if (count === 1) {
		return [FULL_WIDTH];
	}

	const spans: ThemeTileSpan[] = [];
	let remaining = count;

	// Row 0: no incoming tall continuation yet.
	if (remaining > 3) {
		spans.push(SQUARE, SQUARE, TALL);
		remaining -= 3;
	} else if (remaining === 3) {
		spans.push(SQUARE, SQUARE, SQUARE);
		return spans;
	} else {
		// remaining === 2
		spans.push(SQUARE, WIDE);
		return spans;
	}

	// Subsequent rows: the previous row's tall reserves one outer column, so the next empty
	// cell alternates between "the other outer column" and "the middle column" first.
	let tallLandsFirst = true;
	while (remaining > 2) {
		if (tallLandsFirst) {
			spans.push(TALL, SQUARE);
		} else {
			spans.push(SQUARE, TALL);
		}
		tallLandsFirst = !tallLandsFirst;
		remaining -= 2;
	}

	if (remaining === 2) {
		spans.push(SQUARE, SQUARE);
	} else {
		// remaining === 1
		spans.push(WIDE);
	}

	return spans;
};
