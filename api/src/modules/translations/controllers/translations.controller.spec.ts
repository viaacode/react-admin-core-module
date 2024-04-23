import { Test, TestingModule } from '@nestjs/testing';
import { Lookup_Languages_Enum } from '../../shared/generated/graphql-db-types-hetarchief';

import { UpdateResponse } from '../../shared/types/types';

import { TranslationsService } from '../services/translations.service';
import { Component, TranslationKey } from '../translations.types';

import { TranslationsController } from './translations.controller';

const mockTranslationsService: Partial<Record<keyof TranslationsService, jest.SpyInstance>> = {
	getTranslations: jest.fn(),
	updateTranslation: jest.fn(),
};

const mockTranslationsResponse = {
	name: TranslationKey.TRANSLATIONS_FRONTEND,
	value: { key1: 'translation 1' },
};

describe('TranslationsController', () => {
	let translationsController: TranslationsController;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			controllers: [TranslationsController],
			imports: [],
			providers: [
				{
					provide: TranslationsService,
					useValue: mockTranslationsService,
				},
			],
		}).compile();

		translationsController = module.get<TranslationsController>(TranslationsController);
	});

	it('should be defined', () => {
		expect(translationsController).toBeDefined();
	});

	describe('getTranslations', () => {
		it('should return the translations', async () => {
			mockTranslationsService.getTranslations.mockResolvedValueOnce(mockTranslationsResponse);

			const translations = await translationsController.getTranslations();

			expect(translations).toEqual(mockTranslationsResponse);
		});
	});

	describe('updateTranslations', () => {
		it('should update the translations', async () => {
			const mockData: UpdateResponse = { affectedRows: 1 };
			mockTranslationsService.updateTranslation.mockResolvedValueOnce(mockData);

			const promise = translationsController.updateTranslation({
				component: Component.ADMIN_CORE,
				location: 'modules/admin/const/requests',
				key: 'status',
				languageCode: Lookup_Languages_Enum.En,
				value: 'new status',
			});

			await expect(promise).resolves.toBeUndefined();
		});
	});
});
