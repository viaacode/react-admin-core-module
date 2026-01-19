import { Test, type TestingModule } from '@nestjs/testing';
import { vi, type MockInstance, describe, it, expect, beforeEach } from 'vitest';

import { type DeleteResponse } from '../../shared/types/types';
import { Locale } from '../../translations';
import { AdminNavigationsService } from '../services/admin-navigations.service';

import { AdminNavigationsController } from './admin-navigations.controller';

const mockNavigationsResponse = {
	items: [
		{
			id: 'navigation-1',
		},
		{
			id: 'navigation-2',
		},
	],
};

const mockNavigationsService: Partial<Record<keyof AdminNavigationsService, MockInstance>> = {
	findNavigationBars: vi.fn(),
	findElementById: vi.fn(),
	insertElement: vi.fn(),
	updateElement: vi.fn(),
	deleteElement: vi.fn(),
};

describe('NavigationsController', () => {
	let navigationsController: AdminNavigationsController;

	beforeEach(async () => {
		mockNavigationsService.findNavigationBars.mockReset();
		mockNavigationsService.findElementById.mockReset();
		mockNavigationsService.insertElement.mockReset();
		mockNavigationsService.updateElement.mockReset();
		mockNavigationsService.deleteElement.mockReset();

		const module: TestingModule = await Test.createTestingModule({
			controllers: [AdminNavigationsController],
			imports: [],
			providers: [
				{
					provide: AdminNavigationsService,
					useValue: mockNavigationsService,
				},
			],
		}).compile();

		navigationsController = module.get<AdminNavigationsController>(AdminNavigationsController);
	});

	it('should be defined', () => {
		expect(navigationsController).toBeDefined();
	});

	describe('getNavigationBars', () => {
		it('should return all navigations', async () => {
			mockNavigationsService.findNavigationBars.mockResolvedValueOnce(mockNavigationsResponse);
			const navigations = await navigationsController.getNavigationBarsOverview();
			expect(navigations).toEqual(mockNavigationsResponse);
		});
	});

	describe('getNavigationElement', () => {
		it('should return a navigation by id', async () => {
			mockNavigationsService.findElementById.mockResolvedValueOnce(
				mockNavigationsResponse.items[0]
			);
			const navigations = await navigationsController.getNavigationElementById('navigation-1');
			expect(navigations).toEqual(mockNavigationsResponse.items[0]);
		});
	});

	describe('createNavigationElement', () => {
		it('should create a new navigation', async () => {
			mockNavigationsService.insertElement.mockResolvedValueOnce(mockNavigationsResponse.items[0]);
			const navigation = await navigationsController.createNavigationElement({
				label: 'test-create-nav',
				iconName: '',
				placement: 'footer-links',
				position: 1,
				language: Locale.Nl,
			});
			expect(navigation).toEqual(mockNavigationsResponse.items[0]);
		});
	});

	describe('updateNavigationElement', () => {
		it('should update a navigation', async () => {
			mockNavigationsService.updateElement.mockResolvedValueOnce(mockNavigationsResponse.items[0]);
			const navigation = await navigationsController.updateNavigationElement('navigation-1', {
				label: 'test-create-nav',
				iconName: '',
				placement: 'footer-links',
				position: 1,
				language: Locale.Nl,
			});
			expect(navigation).toEqual(mockNavigationsResponse.items[0]);
		});
	});

	describe('deleteNavigationElement', () => {
		it('should delete a navigation', async () => {
			const mockData: DeleteResponse = { affectedRows: 1 };
			mockNavigationsService.deleteElement.mockResolvedValueOnce(mockData);
			const navigation = await navigationsController.deleteNavigationElement('navigation-1');
			expect(navigation).toEqual({ affectedRows: 1 });
		});
	});
});
