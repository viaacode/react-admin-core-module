import { TranslationKey } from '../../translations/types';
import { TranslationsService } from '../../translations/services/translations.service';

export const mockTranslationsService: Partial<
	Record<keyof TranslationsService, jest.SpyInstance>
> = {
	getTranslations: jest.fn().mockResolvedValue({
		[TranslationKey.TRANSLATIONS_FRONTEND]: {},
		[TranslationKey.TRANSLATIONS_ADMIN_CORE]: {},
	}),
};
