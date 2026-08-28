/**
 * Picks `count` distinct entries out of `candidates`, in random order.
 *
 * Partial Fisher-Yates: it shuffles only as many positions as it needs, so picking 3 out of 200
 * costs three swaps instead of shuffling the whole list.
 */
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
 * Picks `count` distinct indices out of `total`, in random order.
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

	return pickRandomFrom(
		Array.from({ length: total }, (_unused, index) => index),
		count,
		random
	);
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
 *
 * `recentlyShown` biases the draw away from interests already seen over the last few shuffles, so
 * a block with many interests configured feels like it is working through the list rather than
 * drawing the same handful over and over. This is a soft preference, not a hard rule: with few
 * interests configured, or most of them already in `recentlyShown`, there may not be `count` unseen
 * ones left to draw from at all, in which case the exclusion is dropped for this draw and it picks
 * from every interest instead -- the floor is always a full selection, never a short one.
 */
const MAX_SHUFFLE_RETRIES = 20;

/** Caps how far back a shuffle looks to avoid repeats -- two shuffles' worth at the FA's tile count. */
export const RECENTLY_SHOWN_LIMIT = 6;

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
