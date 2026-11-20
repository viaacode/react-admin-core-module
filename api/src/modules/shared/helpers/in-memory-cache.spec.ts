import { InMemoryCache } from './in-memory-cache';

describe('InMemoryCache', () => {
	afterEach(() => {
		vi.useRealTimers();
	});

	it('only fetches once within the time to live', async () => {
		const cache = new InMemoryCache<{ value: number }>(60_000);
		const fetchValue = vi.fn().mockResolvedValue({ value: 1 });

		expect(await cache.wrap('key', fetchValue)).toEqual({ value: 1 });
		expect(await cache.wrap('key', fetchValue)).toEqual({ value: 1 });
		expect(fetchValue).toHaveBeenCalledTimes(1);
	});

	it('fetches again after the time to live', async () => {
		vi.useFakeTimers();
		const cache = new InMemoryCache<number>(60_000);
		const fetchValue = vi.fn().mockResolvedValueOnce(1).mockResolvedValueOnce(2);

		expect(await cache.wrap('key', fetchValue)).toEqual(1);
		vi.advanceTimersByTime(60_001);
		expect(await cache.wrap('key', fetchValue)).toEqual(2);
		expect(fetchValue).toHaveBeenCalledTimes(2);
	});

	it('caches per key', async () => {
		const cache = new InMemoryCache<string>(60_000);

		expect(await cache.wrap('a', async () => 'a')).toEqual('a');
		expect(await cache.wrap('b', async () => 'b')).toEqual('b');
	});

	it('returns a copy, so changing a result does not change the cached value', async () => {
		const cache = new InMemoryCache<{ items: string[] }>(60_000);
		const fetchValue = vi.fn().mockResolvedValue({ items: ['a', 'b'] });

		const firstResult = await cache.wrap('key', fetchValue);
		firstResult.items.push('c');
		const secondResult = await cache.wrap('key', fetchValue);
		secondResult.items.pop();

		expect(await cache.wrap('key', fetchValue)).toEqual({ items: ['a', 'b'] });
	});

	it('shares one fetch between concurrent misses', async () => {
		const cache = new InMemoryCache<number>(60_000);
		const fetchValue = vi.fn().mockResolvedValue(1);

		const results = await Promise.all([
			cache.wrap('key', fetchValue),
			cache.wrap('key', fetchValue),
		]);

		expect(results).toEqual([1, 1]);
		expect(fetchValue).toHaveBeenCalledTimes(1);
	});

	it('does not cache failed fetches', async () => {
		const cache = new InMemoryCache<number>(60_000);
		const fetchValue = vi.fn().mockRejectedValueOnce(new Error('failed')).mockResolvedValueOnce(1);

		await expect(cache.wrap('key', fetchValue)).rejects.toThrow('failed');
		expect(await cache.wrap('key', fetchValue)).toEqual(1);
	});

	it('fetches again after clear', async () => {
		const cache = new InMemoryCache<number>(60_000);
		const fetchValue = vi.fn().mockResolvedValueOnce(1).mockResolvedValueOnce(2);

		expect(await cache.wrap('key', fetchValue)).toEqual(1);
		cache.clear();
		expect(await cache.wrap('key', fetchValue)).toEqual(2);
	});

	it('does not store the result of a fetch that started before clear', async () => {
		const cache = new InMemoryCache<number>(60_000);
		let resolveStaleFetch: (value: number) => void = () => {};
		const staleFetch = cache.wrap(
			'key',
			() =>
				new Promise<number>((resolve) => {
					resolveStaleFetch = resolve;
				})
		);
		cache.clear();
		resolveStaleFetch(1);
		expect(await staleFetch).toEqual(1);

		expect(await cache.wrap('key', async () => 2)).toEqual(2);
	});

	it('removes the oldest entry when the maximum number of entries is reached', async () => {
		const cache = new InMemoryCache<string>(60_000, 2);
		const fetchA = vi.fn().mockResolvedValue('a');

		await cache.wrap('a', fetchA);
		await cache.wrap('b', async () => 'b');
		await cache.wrap('c', async () => 'c');
		await cache.wrap('a', fetchA);

		expect(fetchA).toHaveBeenCalledTimes(2);
	});
});
