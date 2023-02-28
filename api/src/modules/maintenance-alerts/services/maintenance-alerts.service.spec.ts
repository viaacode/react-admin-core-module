import { Test, TestingModule } from "@nestjs/testing";
import { FindMaintenanceAlertsQuery } from "src/modules/shared/generated/graphql-db-types-hetarchief";
import { DataService } from "../../data";
import { TestingLogger } from "../../shared/logging/test-logger";
import { mockGqlMaintenanceAlert1, mockMaintenanceAlert1, mockUser } from "../mocks/maintenance-alerts.mocks";
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

const getDefaultMaintenanceAlertsResponse = (): {
	app_maintenance_alerts: FindMaintenanceAlertsQuery[];
	app_maintenance_alerts_aggregate: { aggregate: { count: number }};
} => ({
	app_maintenance_alerts: [mockGqlMaintenanceAlert1 as any],
	app_maintenance_alerts_aggregate: {
		aggregate: {
			count: 100,
		}
	}
})
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

	describe('findAll', () => {//geen input, personal, usergroup, inputquery
		it('returns a paginated response with all maintenance alerts', async () => {
			mockDataService.execute.mockResolvedValueOnce(getDefaultMaintenanceAlertsResponse())

			const response = await maintenanceAlertsService.findAll(
				{
					page: 1,
					size: 10,
				}
			);
			expect(response.items.length).toBe(1);
			expect(response.page).toBe(1);
			expect(response.size).toBe(10)
			expect(response.total).toBe(100)
		});

		it('returns a paginated response with all maintenance alerts starting from a certain date', async () => {
			mockDataService.execute.mockResolvedValueOnce(getDefaultMaintenanceAlertsResponse())

			const response = await maintenanceAlertsService.findAll(
				{
					fromDate: "2022-02-24T16:36:06.045845",
					page: 1,
					size: 10,
				}
			);
			expect(response.items.length).toBe(1);
			expect(response.items[0]?.fromDate).toBe(mockMaintenanceAlert1.fromDate);
			expect(response.page).toBe(1);
			expect(response.size).toBe(10)
			expect(response.total).toBe(100)
		});

		it('returns a paginated response with all maintenance alerts ending on a certain date', async () => {
			mockDataService.execute.mockResolvedValueOnce(getDefaultMaintenanceAlertsResponse())

			const response = await maintenanceAlertsService.findAll(
				{
					untilDate: "2022-02-27T16:36:06.045845",
					page: 1,
					size: 10,
				}
			);
			expect(response.items.length).toBe(1);
			expect(response.items[0]?.untilDate).toBe(mockMaintenanceAlert1.untilDate);
			expect(response.page).toBe(1);
			expect(response.size).toBe(10)
			expect(response.total).toBe(100)
		});

		it('PARAMETESRSDD', async () => {
			mockDataService.execute.mockResolvedValueOnce(getDefaultMaintenanceAlertsResponse())

			const response = await maintenanceAlertsService.findAll(
				{
					page: 1,
					size: 10,
				},
				{
					userGroupIds: ,
					isPersonal: true
				}
			);
			expect(response.items.length).toBe(1);
			expect(response.items[0]?.untilDate).toBe(mockMaintenanceAlert1.untilDate);
			expect(response.page).toBe(1);
			expect(response.size).toBe(10)
			expect(response.total).toBe(100)
		});

	});

});
