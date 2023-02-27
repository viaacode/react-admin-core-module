import { Test, TestingModule } from "@nestjs/testing";
// import { TestingLogger } from "src/modules/shared/logging/test-logger";
import { MaintenanceAlertsService } from "../services/maintenance-alerts.service";
import { MaintenanceAlertsController } from "./maintenance-alerts.controller"

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
			// .setLogger(new TestingLogger())
			.compile();

			maintenanceAlertsController = module.get<MaintenanceAlertsController>(
				MaintenanceAlertsController
		);
	});

	afterEach(() => {
		mockMaintenanceAlertsService.findAll.mockRestore();
	});

	it('should be defined', () => {
		expect(maintenanceAlertsController).toBeDefined();
	});

})
