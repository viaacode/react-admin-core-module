import { cloneDeep } from 'lodash';

const DEFAULT_MAX_ENTRIES = 500;

/**
 * How long near-static lookups (content page by path, navigation items, active maintenance alerts) are cached
 */
export const NEAR_STATIC_LOOKUP_CACHE_TTL_MS = 60_000;

/**
 * Small in-memory cache where every entry lives for a fixed time.
 * - Every read returns a deep clone, so callers can change the result without changing the cached value
 * - Concurrent misses for the same key share one fetch
 * - Failed fetches are not cached
 * - The cache lives in one process (pod), so other pods can return stale data for up to ttlMs after a write
 */
export class InMemoryCache<T> {
	private entries = new Map<string, { value: T; expiresAt: number }>();
	private pendingFetches = new Map<string, Promise<T>>();
	// Increased on every clear, so a fetch that started before the clear doesn't store its (stale) result
	private generation = 0;

	constructor(
		private readonly ttlMs: number,
		private readonly maxEntries = DEFAULT_MAX_ENTRIES
	) {}

	public async wrap(key: string, fetchValue: () => Promise<T>): Promise<T> {
		const entry = this.entries.get(key);
		if (entry && entry.expiresAt > Date.now()) {
			return cloneDeep(entry.value);
		}

		let pendingFetch = this.pendingFetches.get(key);
		if (!pendingFetch) {
			const generation = this.generation;
			const fetchPromise = fetchValue()
				.then((value) => {
					if (generation === this.generation) {
						this.set(key, value);
					}
					return value;
				})
				.finally(() => {
					if (this.pendingFetches.get(key) === fetchPromise) {
						this.pendingFetches.delete(key);
					}
				});
			pendingFetch = fetchPromise;
			this.pendingFetches.set(key, pendingFetch);
		}
		return cloneDeep(await pendingFetch);
	}

	public clear(): void {
		this.generation++;
		this.entries.clear();
		this.pendingFetches.clear();
	}

	private set(key: string, value: T): void {
		this.entries.delete(key);
		if (this.entries.size >= this.maxEntries) {
			const now = Date.now();
			this.entries.forEach((entry, entryKey) => {
				if (entry.expiresAt <= now) {
					this.entries.delete(entryKey);
				}
			});
		}
		if (this.entries.size >= this.maxEntries) {
			// Map keeps insertion order, so the first key is the oldest entry
			this.entries.delete(this.entries.keys().next().value as string);
		}
		this.entries.set(key, { value, expiresAt: Date.now() + this.ttlMs });
	}
}
