import { Test, TestingModule } from "@nestjs/testing";
import { DataService } from "../../data";
import { TestingLogger } from "../../shared/logging/test-logger";
import { mockGqlMaintenanceAlert1 } from "../mocks/maintenance-alerts.mocks";
import { MaintenanceAlertsService } from "./maintenance-alerts.service";

const mockDataService: Partial<Record<keyof DataService, jest.SpyInstance>> = {
	execute: jest.fn(),
};
/*
	TODO:
		findall
		findbyid
		create
		update
		delete
*/
describe('MaintenanceAlertsService', () => {
	let maintenanceAlertsService: MaintenanceAlertsService;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				MaintenanceAlertsService,
				{
					provide: DataService,
					useValue: mockDataService,
				},
			],
		})
			.setLogger(new TestingLogger())
			.compile();

			maintenanceAlertsService = module.get<MaintenanceAlertsService>(MaintenanceAlertsService);
	});

	afterEach(() => {
		mockDataService.execute.mockRestore();
	});

	it('services should be defined', () => {
		expect(maintenanceAlertsService).toBeDefined();
	})

	describe('adapt', () => {
		it('can adapt a FindMaintenanceAlertsQuery hasura response to our maintenance alert class', () => {
			const adapted = maintenanceAlertsService.adapt(mockGqlMaintenanceAlert1);

			expect(adapted.id).toEqual(mockGqlMaintenanceAlert1.id);
			expect(adapted.title).toEqual(mockGqlMaintenanceAlert1.title);
			expect(adapted.message).toEqual(mockGqlMaintenanceAlert1.message);
			expect(adapted.type).toEqual(mockGqlMaintenanceAlert1.type);
			expect(adapted.fromDate).toEqual(mockGqlMaintenanceAlert1.from_date);
			expect(adapted.untilDate).toEqual(mockGqlMaintenanceAlert1.until_date);
			expect(adapted.userGroups).toEqual(mockGqlMaintenanceAlert1.user_groups);
		});

		it('can adapt a personal FindMaintenanceAlertsQuery hasura response to our maintenance alert class', () => {
			const adapted = maintenanceAlertsService.adapt(mockGqlMaintenanceAlert1, true);

			expect(adapted.id).toEqual(mockGqlMaintenanceAlert1.id);
			expect(adapted.title).toEqual(mockGqlMaintenanceAlert1.title);
			expect(adapted.message).toEqual(mockGqlMaintenanceAlert1.message);
			expect(adapted.type).toEqual(mockGqlMaintenanceAlert1.type);
			expect(adapted.fromDate).toEqual(mockGqlMaintenanceAlert1.from_date);
			expect(adapted.untilDate).toEqual(mockGqlMaintenanceAlert1.until_date);
			expect(adapted.userGroups).toEqual(undefined);
		});

		it('returns null when the maintenance alert does not exist', () => {
			const adapted = maintenanceAlertsService.adapt(undefined);
			expect(adapted).toBeNull();
		});

		it('returns null on invalid input', () => {
			const adapted = maintenanceAlertsService.adapt(null);
			expect(adapted).toBeNull();
		});
	});
});
