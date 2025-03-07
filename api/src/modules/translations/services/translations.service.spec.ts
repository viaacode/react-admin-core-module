import { Test, type TestingModule } from '@nestjs/testing';

import { type UpdateResponse } from '../../shared/types/types';
import { SiteVariablesService } from '../../site-variables';
import { Component, Locale } from '../translations.types';

import { TranslationsService } from './translations.service';

const mockSiteVariablesService: Partial<Record<keyof SiteVariablesService, jest.SpyInstance>> = {
	getSiteVariable: jest.fn(),
};

const mockCacheManager: Partial<Record<'wrap', jest.SpyInstance>> = {
	wrap: jest.fn().mockImplementation((key: string, func: () => any): any => {
		return func();
	}) as any,
};

describe('TranslationsService', () => {
	let translationsService: TranslationsService;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				TranslationsService,
				{
					provide: SiteVariablesService,
					useValue: mockSiteVariablesService,
				},
			],
		}).compile();

		translationsService = module.get<TranslationsService>(TranslationsService);
	});

	it('services should be defined', () => {
		expect(translationsService).toBeDefined();
	});

	describe('getFrontendTranslations', () => {
		it('throws an exception if no translations were set', async () => {
			mockSiteVariablesService.getSiteVariable.mockResolvedValueOnce(undefined);
			mockCacheManager.wrap.mockResolvedValueOnce(undefined);
			let error;
			try {
				await translationsService.getTranslations();
			} catch (e) {
				error = e;
			}

			expect(error.message).toEqual('No translations have been set in the database');
		});
	});

	describe('getTranslations', () => {
		it('returns translations', async () => {
			const mockData1 = {
				key: 'FE-translation',
			};
			const mockData2 = {
				key: 'AC-translation',
			};
			const mockData3 = {
				key: 'BE-translation',
			};
			mockSiteVariablesService.getSiteVariable
				.mockResolvedValueOnce(mockData1)
				.mockResolvedValueOnce(mockData2)
				.mockResolvedValueOnce(mockData3);
			const response = await translationsService.getTranslations();
			expect(response['TRANSLATIONS_FRONTEND']).toEqual({
				key: 'FE-translation',
			});
			expect(response['TRANSLATIONS_ADMIN_CORE']).toEqual({
				key: 'AC-translation',
			});
			expect(response['TRANSLATIONS_BACKEND']).toEqual({
				key: 'BE-translation',
			});
		});

		it('returns nothing on empty translations', async () => {
			mockSiteVariablesService.getSiteVariable.mockResolvedValue(undefined);
			const response = await translationsService.getTranslations();
			expect(response).toEqual({});
		});
	});

	describe('updateSiteVariable', () => {
		it('can update the translations', async () => {
			const mockData: UpdateResponse = {
				affectedRows: 1,
			};
			mockSiteVariablesService.updateSiteVariable.mockResolvedValueOnce(mockData);
			const response = await translationsService.updateTranslation(
				Component.FRONTEND,
				'modules/admin/const/requests',
				'status',
				Locale.Nl,
				'new value'
			);
			expect(response).toEqual({ affectedRows: 1 });
		});
	});
});
