import { UpdateTranslationDto } from './translations.dto'

describe('TranslationsDto', () => {
	describe('UpdateTranslationsDto', () => {
		it('should be able to construct a CreateUpdateTranslationDto object', async () => {
			const updateTranslationsDto = new UpdateTranslationDto()
			expect(updateTranslationsDto).toEqual({})
		})
	})
})
