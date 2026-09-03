/** Partial Fisher-Yates: shuffles only the positions it needs, so 3 out of 200 costs three swaps. */
function pickRandomFrom<T>(candidates: T[], count: number, random: () => number): T[] {
	const items = candidates.slice();
	const picks = Math.min(count, items.length);

	for (let position = 0; position < picks; position++) {
		const swapWith = position + Math.floor(random() * (items.length - position));

		[items[position], items[swapWith]] = [items[swapWith], items[position]];
	}

	return items.slice(0, picks);
}

/**
 * When `total` is smaller than `count` every index comes back, so the caller renders fewer tiles
 * rather than repeating an interest. The editor requires three, but a saved block can predate that.
 */
export function pickRandomIndices(
	total: number,
	count: number,
	random: () => number = Math.random
): number[] {
	if (total <= 0 || count <= 0) {
		return [];
	}

	return pickRandomFrom(
		Array.from({ length: total }, (_unused, index) => index),
		count,
		random
	);
}

// Capped because a degenerate list has only one arrangement, and an uncapped retry loop would never
// end. Once the cap is reached the last draw stands.
const MAX_SHUFFLE_RETRIES = 20;

/** How far back a shuffle looks to avoid repeats: two shuffles' worth of tiles. */
export const RECENTLY_SHOWN_LIMIT = 6;

/**
 * A shuffle must not leave the visitor looking at what they already saw, so it retries until the
 * selection moves. Compared by position, not by set: colours and thumbnail belong to the position,
 * so the same three in a different order is a visibly different block.
 *
 * `recentlyShown` is a soft preference. With too few unseen interests left it is dropped for that
 * draw, so the result is always a full selection rather than a short one.
 */
export function pickNextSelection(
	total: number,
	count: number,
	previous: number[],
	recentlyShown: number[] = [],
	random: () => number = Math.random
): number[] {
	const excluded = new Set(recentlyShown);
	const unseenIndices = Array.from({ length: total }, (_unused, index) => index).filter(
		(index) => !excluded.has(index)
	);
	const draw = () =>
		unseenIndices.length >= count
			? pickRandomFrom(unseenIndices, count, random)
			: pickRandomIndices(total, count, random);

	let next = draw();

	if (previous.length === 0) {
		return next;
	}

	const isUnchanged = (candidate: number[]) =>
		candidate.length === previous.length &&
		candidate.every((index, position) => index === previous[position]);

	for (let retry = 0; retry < MAX_SHUFFLE_RETRIES && isUnchanged(next); retry++) {
		next = draw();
	}

	return next;
}
