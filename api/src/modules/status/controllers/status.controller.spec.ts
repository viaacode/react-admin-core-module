import { Test, type TestingModule } from '@nestjs/testing';
import { vi, type MockInstance, describe, it, expect, beforeEach } from 'vitest';

import { StatusService } from '../services/status.service';

import { StatusController } from './status.controller';

const mockStatusService: Partial<Record<keyof StatusService, MockInstance>> = {
	getStatus: vi.fn(),
	getStatusFull: vi.fn(),
};

const mockStatus = {
	name: 'Admin Core api',
	version: '1.0.0',
};

describe('StatusController', () => {
	let statusController: StatusController;

	beforeEach(async () => {
		mockStatusService.getStatus.mockReset();
		mockStatusService.getStatusFull.mockReset();

		const app: TestingModule = await Test.createTestingModule({
			controllers: [StatusController],
			providers: [
				{
					provide: StatusService,
					useValue: mockStatusService,
				},
			],
		}).compile();

		statusController = app.get<StatusController>(StatusController);
	});

	describe('root', () => {
		it('should return the name and version of the app', () => {
			mockStatusService.getStatus.mockReturnValue(mockStatus);
			expect(statusController.getStatusRoot()).toEqual(mockStatus);
		});
	});

	describe('/status', () => {
		it('should return the name and version of the app', () => {
			mockStatusService.getStatus.mockReturnValue(mockStatus);
			expect(statusController.getStatus()).toEqual(mockStatus);
		});
	});

	describe('/status-full', () => {
		it('should return the name and version of the app and the graphql and elasticsearch connectivity', () => {
			mockStatusService.getStatusFull.mockReturnValue(mockStatus);
			expect(statusController.getStatusFull()).toEqual(mockStatus);
		});
	});
});
