import { Test, TestingModule } from "@nestjs/testing";
import { SessionUserEntity } from "../../users/classes/session-user";
import { mockMaintenanceAlert1, mockMaintenanceAlertsResponse, mockUser } from "../mocks/maintenance-alerts.mocks";
// import { TestingLogger } from "src/modules/shared/logging/test-logger";
import { MaintenanceAlertsService } from "../services/maintenance-alerts.service";
import { MaintenanceAlertsController } from "./maintenance-alerts.controller"
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
				MaintenanceAlertsController
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
			mockMaintenanceAlertsService.findAll.mockResolvedValueOnce(mockMaintenanceAlertsResponse);

			const maintenanceAlerts = await maintenanceAlertsController.getMaintenanceAlerts(null);

			expect(maintenanceAlerts).toEqual(mockMaintenanceAlertsResponse);
		});
	});

	describe('getPersonalMaintenanceAlerts', () => {
		it('should return all maintenance alerts for a user', async () => {
			mockMaintenanceAlertsService.findAll.mockResolvedValueOnce(mockMaintenanceAlertsResponse);

			const maintenanceAlerts = await maintenanceAlertsController.getPersonalMaintenanceAlerts(
				null,
				new SessionUserEntity({
					...mockUser,
				})
			);

			expect(maintenanceAlerts).toEqual(mockMaintenanceAlertsResponse);
		});
	});

	describe('getMaintenanceAlertById', () => {
		it('should return all maintenance alerts for a user', async () => {
			mockMaintenanceAlertsService.findById.mockResolvedValueOnce(mockMaintenanceAlert1);

			const maintenanceAlerts = await maintenanceAlertsController.getMaintenanceAlertById(mockMaintenanceAlert1.id);

			expect(maintenanceAlerts).toEqual(mockMaintenanceAlert1);
		});
	});

})
