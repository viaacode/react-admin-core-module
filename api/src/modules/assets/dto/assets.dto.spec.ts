import { DeleteAssetDto } from './assets.dto';

describe('DeleteAssetDto', () => {
	describe('DeleteAssetDto', () => {
		it('should be able to construct a DeleteAssetDto object', async () => {
			const deleteAssetDto = new DeleteAssetDto();
			expect(deleteAssetDto).toEqual({});
		});
	});
});
