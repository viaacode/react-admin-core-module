import { TranslationKey } from "../../translations";
import { TranslationsService } from "../../translations";

export const mockTranslationsService: Partial<
	Record<keyof TranslationsService, jest.SpyInstance>
> = {
	getTranslations: jest.fn().mockResolvedValue({
		[TranslationKey.TRANSLATIONS_FRONTEND]: {},
		[TranslationKey.TRANSLATIONS_ADMIN_CORE]: {},
	}),
};
