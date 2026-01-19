import { Test, type TestingModule } from '@nestjs/testing';
import { vi, type MockInstance, describe, it, expect, beforeEach } from 'vitest';
import { Lookup_Languages_Enum } from '../../shared/generated/graphql-db-types-hetarchief';

import { TranslationsService } from '../services/translations.service';
import { Component } from '../translations.types';

import { TranslationsController } from './translations.controller';

const mockTranslationsService: Partial<Record<keyof TranslationsService, MockInstance>> = {
	getTranslations: vi.fn(),
	upsertTranslation: vi.fn(),
};

describe('TranslationsController', () => {
	let translationsController: TranslationsController;

	beforeEach(async () => {
		mockTranslationsService.getTranslations.mockReset();
		mockTranslationsService.upsertTranslation.mockReset();

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
			mockTranslationsService.getTranslations.mockResolvedValueOnce([]);
			const translations = await translationsController.getTranslations();
			expect(translations).toEqual([]);
		});
	});

	describe('updateTranslations', () => {
		it('should update the translations', async () => {
			mockTranslationsService.upsertTranslation.mockResolvedValueOnce(undefined);

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
