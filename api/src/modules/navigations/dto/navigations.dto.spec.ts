import { CreateNavigationDto } from './navigations.dto';

describe('NavigationsDto', () => {
	describe('CreateNavigationDto', () => {
		it('should be able to construct a CreateNavigationDto object', async () => {
			const createNavigationDto = new CreateNavigationDto();
			expect(createNavigationDto).toEqual({
				iconName: '',
			});
		});
	});
});
