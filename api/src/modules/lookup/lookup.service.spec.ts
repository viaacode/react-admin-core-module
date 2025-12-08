import { LookupService } from './lookup.service';
import { ALL_EDUCATION_LOMS } from './mocks/allEducationLoms';
import { FILTERED_EDUCATION_LOMS } from './mocks/filteredEducationLoms';

describe('lookup service', () => {
	it('Should return a blacklisted list of loms', async () => {
		expect(LookupService.blacklistLoms(ALL_EDUCATION_LOMS)).toEqual(FILTERED_EDUCATION_LOMS);
	});
});
