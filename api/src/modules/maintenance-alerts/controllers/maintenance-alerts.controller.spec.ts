import { Test, TestingModule } from '@nestjs/testing';
import { SessionUserEntity } from '../../users/classes/session-user';
import { MaintenanceAlertType } from '../maintenance-alerts.types';
import {
	mockMaintenanceAlert1,
	mockMaintenanceAlertsResponse,
	mockNewMaintenanceAlert,
	mockUser,
} from '../mocks/maintenance-alerts.mocks';
import { TestingLogger } from '../../shared/logging/test-logger';
import { MaintenanceAlertsService } from '../services/maintenance-alerts.service';
import { MaintenanceAlertsController } from './maintenance-alerts.controller';

const mockMaintenanceAlertsService: Partial<
	Record<keyof MaintenanceAlertsService, jest.SpyInstance>
> = {
	findAll: jest.fn(),
	findById: jest.fn(),
	createMaintenanceAlert: jest.fn(),
	updateMaintenanceAlert: jest.fn(),
	deleteMaintenanceAlert: jest.fn(),
};

describe('MaintenanceAlertsController', () => {
	let maintenanceAlertsController: MaintenanceAlertsController;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			controllers: [MaintenanceAlertsController],
			imports: [],
			providers: [
				{
					provide: MaintenanceAlertsService,
					useValue: mockMaintenanceAlertsService,
				},
			],
		})
			.setLogger(new TestingLogger())
			.compile();

		maintenanceAlertsController = module.get<MaintenanceAlertsController>(
			MaintenanceAlertsController,
		);
	});

	afterEach(() => {
		mockMaintenanceAlertsService.findAll.mockRestore();
	});

	it('should be defined', () => {
		expect(maintenanceAlertsController).toBeDefined();
	});

	describe('getMaintenanceAlerts', () => {
		it('should return all maintenance alerts for meemoo admin', async () => {
			mockMaintenanceAlertsService.findAll.mockResolvedValueOnce(
				mockMaintenanceAlertsResponse,
			);

			const maintenanceAlerts =
				await maintenanceAlertsController.getMaintenanceAlerts(null);

			expect(maintenanceAlerts).toEqual(mockMaintenanceAlertsResponse);
		});
	});

	describe('getPersonalMaintenanceAlerts', () => {
		it('should return all maintenance alerts for a user', async () => {
			mockMaintenanceAlertsService.findAll.mockResolvedValueOnce(
				mockMaintenanceAlertsResponse,
			);

			const maintenanceAlerts =
				await maintenanceAlertsController.getPersonalMaintenanceAlerts(
					null,
					new SessionUserEntity({
						...mockUser,
					}),
				);

			expect(maintenanceAlerts).toEqual(mockMaintenanceAlertsResponse);
		});
	});

	describe('getMaintenanceAlertById', () => {
		it('should return all maintenance alerts for a user', async () => {
			mockMaintenanceAlertsService.findById.mockResolvedValueOnce(
				mockMaintenanceAlert1,
			);

			const maintenanceAlerts =
				await maintenanceAlertsController.getMaintenanceAlertById('1');

			expect(maintenanceAlerts).toEqual(mockMaintenanceAlert1);
		});
	});

	describe('createMaintenanceAlert', () => {
		it('should create a maintenance alert', async () => {
			mockMaintenanceAlertsService.createMaintenanceAlert.mockResolvedValueOnce(
				mockMaintenanceAlert1,
			);
			const createdMaintenanceAlert =
				await maintenanceAlertsController.createMaintenanceAlert(
					mockNewMaintenanceAlert,
				);
			expect(createdMaintenanceAlert).toEqual(mockMaintenanceAlert1);
		});
	});

	describe('updateMaintenanceAlert', () => {
		it('should update a maintenance alert by id', async () => {
			mockMaintenanceAlertsService.updateMaintenanceAlert.mockResolvedValueOnce(
				mockMaintenanceAlert1,
			);
			const updatedMaintenanceAlert =
				await maintenanceAlertsController.updateMaintenanceAlert(
					mockMaintenanceAlert1.id,
					{
						title: 'Gepland onderhoud updated',
						type: MaintenanceAlertType.QUESTION,
					},
				);
			expect(updatedMaintenanceAlert).toEqual(mockMaintenanceAlert1);
		});
	});

	describe('updateMaintenanceAlert', () => {
		it('should delete a maintenance alert by id', async () => {
			mockMaintenanceAlertsService.deleteMaintenanceAlert.mockResolvedValueOnce(
				1,
			);

			const response = await maintenanceAlertsController.deleteMaintenanceAlert(
				mockMaintenanceAlert1.id,
			);
			expect(response).toEqual({
				status: 'Maintenance alert has been deleted',
			});
		});
		it('should delete a maintenance alert by id', async () => {
			mockMaintenanceAlertsService.deleteMaintenanceAlert.mockResolvedValueOnce(
				0,
			);

			const response = await maintenanceAlertsController.deleteMaintenanceAlert(
				mockMaintenanceAlert1.id,
			);
			expect(response).toEqual({
				status: `no maintenance alert found with that id: ${mockMaintenanceAlert1.id}`,
			});
		});
	});
});
