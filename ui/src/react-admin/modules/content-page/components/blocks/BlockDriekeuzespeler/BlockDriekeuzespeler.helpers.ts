/**
 * Picks `count` distinct indices out of `total`, in random order.
 *
 * Partial Fisher-Yates: it shuffles only as many positions as it needs, so picking 3 out of 200
 * costs three swaps instead of shuffling the whole list.
 *
 * When `total` is smaller than `count` every index comes back, still shuffled -- the caller renders
 * fewer tiles rather than repeating an interest. The editor keeps this from happening by requiring
 * at least three interests, but a saved block can predate that rule.
 */
export function pickRandomIndices(
	total: number,
	count: number,
	random: () => number = Math.random
): number[] {
	if (total <= 0 || count <= 0) {
		return [];
	}

	const indices = Array.from({ length: total }, (_unused, index) => index);
	const picks = Math.min(count, total);

	for (let position = 0; position < picks; position++) {
		const swapWith = position + Math.floor(random() * (total - position));

		[indices[position], indices[swapWith]] = [indices[swapWith], indices[position]];
	}

	return indices.slice(0, picks);
}

/**
 * Picks a fresh selection for a shuffle.
 *
 * The FA keeps no history, so the previous selection is not remembered and can legitimately come
 * back. What a shuffle must not do is leave the visitor looking at exactly what they were already
 * looking at, so this retries until something moves.
 *
 * The comparison is by position, not by set. The selection is ordered, and a tile's colours and
 * thumbnail belong to its position, so three interests dealt in a different order is a visibly
 * different block -- which is what keeps the CTA useful at the configured minimum of three.
 *
 * The retries are capped. With one interest there is only one arrangement, so an uncapped loop
 * would never end. Once the cap is reached the last draw stands: an unchanged block is a poor
 * shuffle, but it is better than a hang.
 *
 * The cap is high because the draws are cheap and the worst honest case is thin: three interests
 * have six arrangements, so one in six draws repeats. Twenty retries make a repeat reaching the
 * visitor about one in 10^16, while a degenerate list costs twenty trivial draws and no more.
 */
const MAX_SHUFFLE_RETRIES = 20;

export function pickNextSelection(
	total: number,
	count: number,
	previous: number[],
	random: () => number = Math.random
): number[] {
	let next = pickRandomIndices(total, count, random);

	if (previous.length === 0) {
		return next;
	}

	const isUnchanged = (candidate: number[]) =>
		candidate.length === previous.length &&
		candidate.every((index, position) => index === previous[position]);

	for (let retry = 0; retry < MAX_SHUFFLE_RETRIES && isUnchanged(next); retry++) {
		next = pickRandomIndices(total, count, random);
	}

	return next;
}
