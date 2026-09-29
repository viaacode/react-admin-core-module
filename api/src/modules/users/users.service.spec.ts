import { describe, expect, it } from 'vitest';

import { getSearchProfileNamesWhere } from './users.service';

describe('getSearchProfileNamesWhere', () => {
	it('should return an empty _and when no name is given', () => {
		expect(getSearchProfileNamesWhere(null)).toEqual({ _and: [] });
		expect(getSearchProfileNamesWhere('   ')).toEqual({ _and: [] });
	});

	it('should require every word to match the first name, last name or email', () => {
		expect(getSearchProfileNamesWhere(' jelle  van ')).toEqual({
			_and: [
				{
					_or: [
						{ first_name: { _ilike: '%jelle%' } },
						{ last_name: { _ilike: '%jelle%' } },
						{ mail: { _ilike: '%jelle%' } },
					],
				},
				{
					_or: [
						{ first_name: { _ilike: '%van%' } },
						{ last_name: { _ilike: '%van%' } },
						{ mail: { _ilike: '%van%' } },
					],
				},
			],
		});
	});

	it('should escape like wildcards in the search term', () => {
		expect(getSearchProfileNamesWhere('a_b%c\\d')._and[0]._or[0]).toEqual({
			first_name: { _ilike: '%a\\_b\\%c\\\\d%' },
		});
	});
});
