import { Test, type TestingModule } from '@nestjs/testing';
import { vi, type MockInstance, describe, it, expect, beforeEach } from 'vitest';

import { PermissionsService } from '../services/permissions.service';

import { PermissionsController } from './permissions.controller';

const mockPermissionsService: Partial<Record<keyof PermissionsService, MockInstance>> = {
	getPermissions: vi.fn(),
};

const mockPermissionsResponse = [
	{
		id: '2dd3ec17-5439-4fc7-aa6c-cc8dfd3b937f',
		label: 'Bezoekersruimtes: Alle bezoekersruimtes bekijken',
		name: 'READ_ALL_SPACES',
		description: 'Deze gebruiker kan de alle bezoekersruimtes bekijken, inclusief inactieve',
	},
];

describe('PermissionsController', () => {
	let permissionsController: PermissionsController;

	beforeEach(async () => {
		mockPermissionsService.getPermissions.mockReset();

		const module: TestingModule = await Test.createTestingModule({
			controllers: [PermissionsController],
			imports: [],
			providers: [
				{
					provide: PermissionsService,
					useValue: mockPermissionsService,
				},
			],
		}).compile();

		permissionsController = module.get<PermissionsController>(PermissionsController);
	});

	it('should be defined', () => {
		expect(permissionsController).toBeDefined();
	});

	describe('getPermissions', () => {
		it('should return the permissions', async () => {
			mockPermissionsService.getPermissions.mockResolvedValueOnce(mockPermissionsResponse);

			const permissions = await permissionsController.getPermissions();

			expect(permissions).toEqual(mockPermissionsResponse);
		});
	});
});
