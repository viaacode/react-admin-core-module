import { type MockInstance } from 'vitest';

import { type TranslationsService } from '../../translations';

import { getTranslationFallback } from './translation-fallback';

export const mockTranslationsService: Partial<Record<keyof TranslationsService, MockInstance>> =
	{
		onApplicationBootstrap: vi.fn(),
		refreshBackendTranslations: vi.fn(),
		tText: vi.fn().mockImplementation(getTranslationFallback),
	};
