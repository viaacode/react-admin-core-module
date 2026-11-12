import { Pagination } from './pagination';

describe('Pagination', () => {
	it('should wrap the items with paging info', () => {
		expect(Pagination({ items: ['a', 'b'], page: 2, size: 2, total: 5 })).toEqual({
			items: ['a', 'b'],
			total: 5,
			pages: 3,
			page: 2,
			size: 2,
		});
	});

	it('should return 0 pages when there are no items', () => {
		expect(Pagination({ items: [], page: 1, size: 10, total: 0 }).pages).toEqual(0);
	});
});
