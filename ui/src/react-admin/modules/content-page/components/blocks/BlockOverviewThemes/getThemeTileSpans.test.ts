import { describe, expect, it } from 'vitest';
import { getThemeTileSpans, type ThemeTileSpan } from './getThemeTileSpans.ts';

const SQUARE: ThemeTileSpan = { colSpan: 1, rowSpan: 1 };
const TALL: ThemeTileSpan = { colSpan: 1, rowSpan: 2 };
const WIDE: ThemeTileSpan = { colSpan: 2, rowSpan: 1 };
const FULL_WIDTH: ThemeTileSpan = { colSpan: 3, rowSpan: 1 };

const COLUMN_COUNT = 3;

interface PlacedTile extends ThemeTileSpan {
	row: number;
	col: number;
}

/**
 * Mimics the browser's default (non-dense) CSS grid auto-placement for a 3-column grid:
 * a cursor walks forward through the cells and never moves backwards, each tile lands in the
 * first position at-or-after the cursor where all the cells it needs are still free.
 */
const placeTiles = (spans: ThemeTileSpan[]): PlacedTile[] => {
	const occupied = new Set<string>();
	const key = (row: number, col: number) => `${row},${col}`;
	const fits = (span: ThemeTileSpan, row: number, col: number) => {
		for (let r = row; r < row + span.rowSpan; r++) {
			for (let c = col; c < col + span.colSpan; c++) {
				if (occupied.has(key(r, c))) {
					return false;
				}
			}
		}
		return true;
	};

	let cursorRow = 0;
	let cursorCol = 0;

	return spans.map((span) => {
		// A tile never overflows the grid: wrap to the next row when it no longer fits horizontally.
		if (cursorCol + span.colSpan > COLUMN_COUNT) {
			cursorRow++;
			cursorCol = 0;
		}
		while (!fits(span, cursorRow, cursorCol)) {
			cursorCol++;
			if (cursorCol + span.colSpan > COLUMN_COUNT) {
				cursorRow++;
				cursorCol = 0;
			}
		}

		for (let r = cursorRow; r < cursorRow + span.rowSpan; r++) {
			for (let c = cursorCol; c < cursorCol + span.colSpan; c++) {
				occupied.add(key(r, c));
			}
		}

		const placed: PlacedTile = { ...span, row: cursorRow, col: cursorCol };
		cursorCol += span.colSpan;
		return placed;
	});
};

const totalArea = (spans: ThemeTileSpan[]) =>
	spans.reduce((total, span) => total + span.colSpan * span.rowSpan, 0);

describe('getThemeTileSpans', () => {
	describe('degenerate counts', () => {
		it('returns an empty array for 0', () => {
			expect(getThemeTileSpans(0)).toEqual([]);
		});

		it('returns an empty array for negative counts', () => {
			expect(getThemeTileSpans(-1)).toEqual([]);
			expect(getThemeTileSpans(-42)).toEqual([]);
		});
	});

	describe('single row layouts', () => {
		it('renders 1 theme as a single full width tile', () => {
			expect(getThemeTileSpans(1)).toEqual([FULL_WIDTH]);
		});

		it('renders 2 themes as a square followed by a wide tile', () => {
			expect(getThemeTileSpans(2)).toEqual([SQUARE, WIDE]);
		});

		it('renders 3 themes as three squares', () => {
			expect(getThemeTileSpans(3)).toEqual([SQUARE, SQUARE, SQUARE]);
		});
	});

	describe('braided snake layouts', () => {
		it('closes a 4 theme grid with a wide tile', () => {
			expect(getThemeTileSpans(4)).toEqual([SQUARE, SQUARE, TALL, WIDE]);
		});

		it('closes a 5 theme grid with two squares', () => {
			expect(getThemeTileSpans(5)).toEqual([SQUARE, SQUARE, TALL, SQUARE, SQUARE]);
		});

		it('alternates the tall tile between the outer columns', () => {
			expect(getThemeTileSpans(8)).toEqual([
				SQUARE,
				SQUARE,
				TALL,
				TALL,
				SQUARE,
				SQUARE,
				TALL,
				WIDE,
			]);
		});

		it('starts every layout above 3 themes with two squares and a tall tile', () => {
			for (let count = 4; count <= 30; count++) {
				expect(getThemeTileSpans(count).slice(0, 3)).toEqual([SQUARE, SQUARE, TALL]);
			}
		});
	});

	describe('invariants', () => {
		it('returns exactly one span per theme', () => {
			for (let count = 0; count <= 50; count++) {
				expect(getThemeTileSpans(count)).toHaveLength(Math.max(count, 0));
			}
		});

		it('only returns the four supported tile shapes', () => {
			for (let count = 1; count <= 50; count++) {
				for (const span of getThemeTileSpans(count)) {
					expect([SQUARE, TALL, WIDE, FULL_WIDTH]).toContainEqual(span);
				}
			}
		});

		it('covers a whole number of rows worth of cells', () => {
			for (let count = 1; count <= 50; count++) {
				expect(totalArea(getThemeTileSpans(count)) % COLUMN_COUNT).toBe(0);
			}
		});

		it('fills the grid without gaps or overlaps', () => {
			for (let count = 1; count <= 50; count++) {
				const spans = getThemeTileSpans(count);
				const placed = placeTiles(spans);
				const rowCount = totalArea(spans) / COLUMN_COUNT;

				const cells = new Set<string>();
				for (const tile of placed) {
					for (let r = tile.row; r < tile.row + tile.rowSpan; r++) {
						for (let c = tile.col; c < tile.col + tile.colSpan; c++) {
							// A repeated cell means two tiles overlap.
							expect(cells.has(`${r},${c}`)).toBe(false);
							cells.add(`${r},${c}`);
						}
					}
				}

				// Every cell of the rectangle is covered exactly once, so there are no holes either.
				expect(cells.size).toBe(rowCount * COLUMN_COUNT);
				for (const tile of placed) {
					expect(tile.row + tile.rowSpan).toBeLessThanOrEqual(rowCount);
					expect(tile.col + tile.colSpan).toBeLessThanOrEqual(COLUMN_COUNT);
				}
			}
		});

		it('never places a tall tile in the middle column', () => {
			for (let count = 1; count <= 50; count++) {
				const tallTiles = placeTiles(getThemeTileSpans(count)).filter((tile) => tile.rowSpan === 2);
				for (const tile of tallTiles) {
					expect(tile.col).not.toBe(1);
				}
			}
		});
	});
});
