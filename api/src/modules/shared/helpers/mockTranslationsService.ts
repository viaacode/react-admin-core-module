import { TranslationsService } from '../../translations';
import { getTranslationFallback } from './translation-fallback';

export const mockTranslationsService: Partial<Record<keyof TranslationsService, jest.SpyInstance>> =
	{
		onApplicationBootstrap: jest.fn(),
		refreshBackendTranslations: jest.fn(),
		tText: jest.fn().mockImplementation(getTranslationFallback),
	};
