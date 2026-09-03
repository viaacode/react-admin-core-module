import { describe, expect, it } from 'vitest';
import { pickNextSelection, pickRandomIndices } from './BlockDriekeuzespeler.helpers';

/** A deterministic stand-in for Math.random that walks the given values and then repeats the last. */
const seededRandom = (values: number[]): (() => number) => {
	let call = 0;

	return () => values[Math.min(call++, values.length - 1)];
};

describe('pickRandomIndices', () => {
	it('picks the requested number of indices', () => {
		expect(pickRandomIndices(200, 3)).toHaveLength(3);
	});

	it('never repeats an index', () => {
		for (let run = 0; run < 200; run++) {
			const picked = pickRandomIndices(5, 3);

			expect(new Set(picked).size).toBe(picked.length);
		}
	});

	it('only returns indices that exist', () => {
		for (let run = 0; run < 200; run++) {
			for (const index of pickRandomIndices(4, 3)) {
				expect(index).toBeGreaterThanOrEqual(0);
				expect(index).toBeLessThan(4);
			}
		}
	});

	it('returns every index, shuffled, when there are fewer interests than tiles', () => {
		expect(pickRandomIndices(2, 3).sort()).toEqual([0, 1]);
	});

	it('returns nothing for an empty list or a zero count', () => {
		expect(pickRandomIndices(0, 3)).toEqual([]);
		expect(pickRandomIndices(5, 0)).toEqual([]);
	});

	it('can reach every index across many runs, so nothing is unreachable', () => {
		const seen = new Set<number>();

		for (let run = 0; run < 500; run++) {
			for (const index of pickRandomIndices(5, 3)) {
				seen.add(index);
			}
		}

		expect([...seen].sort()).toEqual([0, 1, 2, 3, 4]);
	});

	it('is driven entirely by the injected random source', () => {
		// All zeroes means "always swap with the first remaining index", which leaves the head of the
		// list in place.
		expect(pickRandomIndices(5, 3, seededRandom([0]))).toEqual([0, 1, 2]);
	});
});

describe('pickNextSelection', () => {
	it('never hands back the arrangement the visitor is already looking at', () => {
		for (const total of [3, 4, 10, 200]) {
			for (let run = 0; run < 200; run++) {
				expect(pickNextSelection(total, 3, [0, 1, 2])).not.toEqual([0, 1, 2]);
			}
		}
	});

	it('keeps working when the list holds exactly as many interests as there are tiles', () => {
		// Only the tile each interest lands on can change, so it must still return a full selection.
		const next = pickNextSelection(3, 3, [0, 1, 2]);

		expect([...next].sort()).toEqual([0, 1, 2]);
	});

	it('reorders the tiles when the list holds exactly as many interests as there are tiles', () => {
		// Draws the previous order first, then a different one: the retry has to take the second draw.
		expect(pickNextSelection(3, 3, [0, 1, 2], [], seededRandom([0, 0, 0, 0.99, 0, 0]))).toEqual([
			2, 1, 0,
		]);
	});

	it('gives up when a single interest leaves nothing to reorder', () => {
		expect(pickNextSelection(1, 3, [0])).toEqual([0]);
	});

	it('handles a first shuffle with no previous selection', () => {
		expect(pickNextSelection(10, 3, [])).toHaveLength(3);
	});

	it('still returns a full selection when it retries', () => {
		// A random source that first reproduces the previous set forces the retry path.
		const next = pickNextSelection(4, 3, [0, 1, 2], [], seededRandom([0, 0, 0, 0.99, 0, 0]));

		expect(next).toHaveLength(3);
		expect(new Set(next).size).toBe(3);
	});

	it('gives up after the retry cap instead of looping forever', () => {
		// Always reproduces the previous set, so only the retry cap can end this.
		const next = pickNextSelection(4, 3, [0, 1, 2], [], seededRandom([0]));

		expect(next).toEqual([0, 1, 2]);
	});

	it('never draws an interest that is in recentlyShown, when enough others are available', () => {
		for (let run = 0; run < 200; run++) {
			const next = pickNextSelection(10, 3, [0, 1, 2], [3, 4, 5, 6, 7]);

			for (const index of next) {
				expect([3, 4, 5, 6, 7]).not.toContain(index);
			}
		}
	});

	it('falls back to every interest once too few are left outside recentlyShown', () => {
		// Only one unseen interest is left, so the exclusion has to give way rather than come up short.
		const next = pickNextSelection(6, 3, [0, 1, 2], [1, 2, 3, 4, 5]);

		expect(next).toHaveLength(3);
		expect(new Set(next).size).toBe(3);
	});

	it('ignores recentlyShown entries past `total`, e.g. after the interest list shrinks', () => {
		const next = pickNextSelection(4, 3, [0, 1, 2], [4, 5, 6, 7, 8, 9]);

		expect(next).toHaveLength(3);
		expect(new Set(next).size).toBe(3);
	});

	it('is not tripped up by an empty recentlyShown', () => {
		expect(pickNextSelection(10, 3, [0, 1, 2], [])).toHaveLength(3);
	});
});
