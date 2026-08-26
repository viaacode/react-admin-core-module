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
		// The three interests cannot change here, only the tile each one lands on, so it must still
		// return a full selection rather than retry forever.
		const next = pickNextSelection(3, 3, [0, 1, 2]);

		expect([...next].sort()).toEqual([0, 1, 2]);
	});

	it('reorders the tiles when the list holds exactly as many interests as there are tiles', () => {
		// A source that draws the previous order first and a different one after it. The retry has to
		// take the second draw: a tile's colours and thumbnail belong to its position, so a reorder is
		// a visibly different block.
		expect(pickNextSelection(3, 3, [0, 1, 2], seededRandom([0, 0, 0, 0.99, 0, 0]))).toEqual([
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
		const next = pickNextSelection(4, 3, [0, 1, 2], seededRandom([0, 0, 0, 0.99, 0, 0]));

		expect(next).toHaveLength(3);
		expect(new Set(next).size).toBe(3);
	});

	it('gives up after the retry cap instead of looping forever', () => {
		// A random source that always reproduces the previous set. Every retry draws the same three
		// indices, so only the cap can end this.
		const next = pickNextSelection(4, 3, [0, 1, 2], seededRandom([0]));

		expect(next).toEqual([0, 1, 2]);
	});
});
