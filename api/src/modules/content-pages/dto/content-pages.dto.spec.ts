import { ContentPageFiltersDto } from './content-pages.dto'

describe('ContentPagesDto', () => {
	describe('ContentPagesQueryDto', () => {
		it('should be able to construct a ContentPagesQueryDto object', async () => {
			const contentPagesQueryDto = new ContentPageFiltersDto()
			expect(contentPagesQueryDto).toEqual({})
		})
	})
})
