import { Test, TestingModule } from '@nestjs/testing';
import { SessionUserEntity } from '../../users/classes/session-user';
import { MaintenanceAlertType } from '../maintenance-alerts.types';
import {
	mockMaintenanceAlert1,
	mockMaintenanceAlertsResponse,
	mockUser,
} from '../mocks/maintenance-alerts.mocks';
// import { TestingLogger } from "src/modules/shared/logging/test-logger";
import { MaintenanceAlertsService } from '../services/maintenance-alerts.service';
import { MaintenanceAlertsController } from './maintenance-alerts.controller';
// import { SessionHelper } from '../../shared/auth/session-helper';

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
	let sessionHelperSpy: jest.SpyInstance;

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
			// .setLogger(new TestingLogger())
			.compile();

		maintenanceAlertsController = module.get<MaintenanceAlertsController>(
			MaintenanceAlertsController,
		);

		// sessionHelperSpy = jest
		// 	.spyOn(SessionHelper, 'getUserInfo')
		// 	.mockReturnValue(mockUser);
	});

	afterEach(() => {
		mockMaintenanceAlertsService.findAll.mockRestore();
	});

	// afterAll(async () => {
	// 	sessionHelperSpy.mockRestore();
	// });

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
			const createdMaintenanceAlert = await maintenanceAlertsController.createMaintenanceAlert(
				{
					title: "Gepland onderhoud",
					message: "Opgelet! Tussen 25 en 27 januari plannen we een onderhoud aan Het archief. Je zal dus tijdenlijk niet kunnen inloggen Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus.",
					type: MaintenanceAlertType.QUESTION,
					userGroups: [
						"0213c8d4-f459-45ef-8bbc-96268ab56d01",
						"04150e6e-b779-4125-84e5-6ee6fc580757",
						"0b281484-76cd-45a9-b6ce-68a0ea7f4b26",
						"c56d95aa-e918-47ca-b102-486c9449fc4a",
					],
					fromDate: "2022-02-25T16:36:06.045845",
					untilDate: "2022-02-27T16:36:06.045845",
				}
			);
			expect(createdMaintenanceAlert).toEqual(mockMaintenanceAlert1);
		});
	});

	describe('updateMaintenanceAlert', () => {
		it('should update a maintenance alert by id', async () => {
			mockMaintenanceAlertsService.updateMaintenanceAlert.mockResolvedValueOnce(
				mockMaintenanceAlert1,
			);
			const updatedMaintenanceAlert = await maintenanceAlertsController.updateMaintenanceAlert(
				mockMaintenanceAlert1.id,
				{
					title: "Gepland onderhoud updated",
					type: MaintenanceAlertType.QUESTION,
				}
			);
			expect(updatedMaintenanceAlert).toEqual(mockMaintenanceAlert1);
		});
	});

});
