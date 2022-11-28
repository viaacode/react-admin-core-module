import { Test, TestingModule } from '@nestjs/testing';
import fse from 'fs-extra';

import { DataPermissionsService } from './data-permissions.service';
import { DataService } from './data.service';

import { TestingLogger } from '../../shared/logging/test-logger';

jest.mock('fs-extra');

const mockedFse = fse as any;

const mockDataPermissionsService: Partial<
	Record<keyof DataPermissionsService, jest.SpyInstance>
> = {
	verify: jest.fn(),
	isAllowedToExecuteQuery: jest.fn(),
	isWhitelistEnabled: jest.fn(),
	getWhitelistedQuery: jest.fn(),
	getQueryName: jest.fn(),
};

describe('DataService - no whitelist', () => {
	let dataService: DataService;
	let dataPermissionsService: DataPermissionsService;

	const mockFiles = {};

	beforeEach(async () => {
		mockedFse.__setMockFiles(mockFiles);
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				DataService,
				{
					provide: DataPermissionsService,
					useValue: mockDataPermissionsService,
				},
			],
		})
			.setLogger(new TestingLogger())
			.compile();

		dataService = module.get<DataService>(DataService);
		dataPermissionsService = module.get<DataPermissionsService>(
			DataPermissionsService,
		);

		mockDataPermissionsService.getQueryName.mockReturnValue('testQuery');
	});

	afterEach(() => {
		mockDataPermissionsService.verify.mockRestore();
		mockDataPermissionsService.isAllowedToExecuteQuery.mockRestore();
		mockDataPermissionsService.getWhitelistedQuery.mockRestore();
	});

	it('services should be defined', () => {
		expect(dataService).toBeDefined();
		expect(dataPermissionsService).toBeDefined();
	});
});

describe('DataService - with whitelist', () => {
	let dataService: DataService;

	const mockFiles = {
		'proxy-whitelist.json': '{ "GET_PROXY_QUERY": "query getProxyQuery() {}"	}',
		'client-whitelist.json':
			'{	"GET_CLIENT_QUERY": "query getClientQuery() {}" }',
	};

	beforeEach(async () => {
		mockedFse.__setMockFiles(mockFiles);

		const module: TestingModule = await Test.createTestingModule({
			providers: [
				DataService,
				{
					provide: DataPermissionsService,
					useValue: mockDataPermissionsService,
				},
			],
		}).compile();

		dataService = module.get<DataService>(DataService);
	});
});

describe('DataService - no whitelist files', () => {
	let dataService: DataService;
	let dataPermissionsService: DataPermissionsService;

	beforeEach(async () => {
		mockedFse.existsSync = () => false;

		const module: TestingModule = await Test.createTestingModule({
			providers: [
				DataService,
				{
					provide: DataPermissionsService,
					useValue: mockDataPermissionsService,
				},
			],
		}).compile();

		dataService = module.get<DataService>(DataService);
		dataPermissionsService = module.get<DataPermissionsService>(
			DataPermissionsService,
		);
	});

	it('services should be defined when no whitelist files are available', () => {
		expect(dataService).toBeDefined();
		expect(dataPermissionsService).toBeDefined();
	});
});
