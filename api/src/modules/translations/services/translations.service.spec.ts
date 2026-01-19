import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Test, type TestingModule } from '@nestjs/testing';
import { vi, type MockInstance, describe, it, expect, beforeEach, afterEach } from 'vitest';

import { DataService } from '../../data';
import { Component, Locale, ValueType } from '../translations.types';

import { TranslationsService } from './translations.service';

const mockDataService = {
	execute: vi.fn(),
};

const mockCacheManager = {
	wrap: vi.fn(),
	reset: vi.fn(),
};

describe('TranslationsService', () => {
	let translationsService: TranslationsService;

	beforeEach(async () => {
		mockDataService.execute.mockReset();
		mockCacheManager.wrap.mockReset();
		mockCacheManager.reset.mockReset();

		const module: TestingModule = await Test.createTestingModule({
			providers: [
				TranslationsService,
				{
					provide: DataService,
					useValue: mockDataService,
				},
				{
					provide: CACHE_MANAGER,
					useValue: mockCacheManager,
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
			mockCacheManager.wrap.mockResolvedValueOnce(undefined);
			let error;
			try {
				await translationsService.getFrontendTranslations(Locale.Nl);
			} catch (e) {
				error = e;
			}

			expect(error.message).toEqual('No translations have been set in the database');
		});

		it('returns translations when they exist', async () => {
			const mockTranslations = {
				nl: {
					'modules/test___key': 'value',
				},
			};
			mockCacheManager.wrap.mockResolvedValueOnce(mockTranslations);
			const response = await translationsService.getFrontendTranslations(Locale.Nl);
			expect(response).toEqual({ 'modules/test___key': 'value' });
		});
	});

	describe('getTranslations', () => {
		it('returns translations', async () => {
			const mockTranslations = {
				app_translations: [
					{
						component: Component.FRONTEND,
						location: 'modules/test',
						key: 'testKey',
						language: Locale.Nl,
						value: 'test value',
						value_type: ValueType.TEXT,
					},
				],
			};
			mockDataService.execute.mockResolvedValueOnce(mockTranslations);
			const response = await translationsService.getTranslations();
			expect(response.length).toBe(1);
			expect(response[0].key).toEqual('testKey');
		});

		it('returns empty array when no translations exist', async () => {
			mockDataService.execute.mockResolvedValueOnce({ app_translations: [] });
			const response = await translationsService.getTranslations();
			expect(response).toEqual([]);
		});
	});

	describe('updateTranslation', () => {
		it('can update the translations', async () => {
			mockDataService.execute.mockResolvedValueOnce({});
			mockCacheManager.reset.mockResolvedValueOnce(undefined);
			await translationsService.updateTranslation(
				Component.FRONTEND,
				'modules/admin/const/requests',
				'status',
				Locale.Nl,
				'new value'
			);
			expect(mockDataService.execute).toHaveBeenCalled();
			expect(mockCacheManager.reset).toHaveBeenCalled();
		});
	});
});
