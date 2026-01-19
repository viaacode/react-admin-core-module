import { Test, type TestingModule } from '@nestjs/testing';
import { vi, type MockInstance, describe, it, expect, beforeEach } from 'vitest';

import packageJson from '../../../../package.json';
import { TranslationsService } from '../../translations';
import { TestingLogger } from '../../shared/logging/test-logger';

import { StatusService } from './status.service';

const mockTranslationsService: Partial<Record<keyof TranslationsService, MockInstance>> = {
	getFrontendTranslations: vi.fn(),
};

const mockStatus = {
	name: 'Admin Core api',
	version: packageJson.version,
};

describe('StatusService', () => {
	let statusService: StatusService;

	beforeEach(async () => {
		mockTranslationsService.getFrontendTranslations.mockReset();

		const app: TestingModule = await Test.createTestingModule({
			providers: [
				StatusService,
				{
					provide: TranslationsService,
					useValue: mockTranslationsService,
				},
			],
		})
			.setLogger(new TestingLogger())
			.compile();

		statusService = app.get<StatusService>(StatusService);
	});

	describe('getStatus', () => {
		it('should return the name and version of the app', () => {
			expect(statusService.getStatus()).toEqual(mockStatus);
		});
	});

	describe('getStatusFull', () => {
		it('should return the name and version of the app and the graphql connectivity', async () => {
			mockTranslationsService.getFrontendTranslations.mockResolvedValueOnce({
				key: 'value',
			});
			expect(await statusService.getStatusFull()).toEqual({
				...mockStatus,
				graphql: 'reachable',
			});
		});

		it('should return graphql unreachable if no data is returned', async () => {
			mockTranslationsService.getFrontendTranslations.mockResolvedValueOnce({});
			expect(await statusService.getStatusFull()).toEqual({
				...mockStatus,
				graphql: 'not accessible',
			});
		});

		it('should return graphql unreachable if throw error', async () => {
			mockTranslationsService.getFrontendTranslations.mockRejectedValueOnce({ message: 'timeout' });
			expect(await statusService.getStatusFull()).toEqual({
				...mockStatus,
				graphql: 'not accessible',
			});
		});
	});
});
