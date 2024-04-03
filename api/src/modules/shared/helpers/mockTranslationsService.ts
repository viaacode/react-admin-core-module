import { type TranslationsService } from '../../translations';

import { getTranslationFallback } from './translation-fallback';

export const mockTranslationsService: Partial<Record<keyof TranslationsService, jest.SpyInstance>> =
	{
		onApplicationBootstrap: jest.fn(),
		refreshBackendTranslations: jest.fn(),
		t: jest.fn().mockImplementation(getTranslationFallback),
	};
