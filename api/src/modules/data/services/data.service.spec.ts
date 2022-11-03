
import { Test, TestingModule } from '@nestjs/testing';
import fse from 'fs-extra';
import nock from 'nock';



import { DataPermissionsService } from './data-permissions.service';
import { DataService } from './data.service';

import { GraphQlQueryDto } from '../dto/graphql-query.dto';
import { Group, GroupIdToName, Permission, HetArchiefUser } from '../../users/types';
import { Idp } from '../../shared/auth/auth.types';
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

const mockUser: HetArchiefUser = {
	id: 'e791ecf1-e121-4c54-9d2e-34524b6467c6',
	firstName: 'Test',
	lastName: 'Testers',
	fullName: 'Test Testers',
	email: 'test.testers@meemoo.be',
	idp: Idp.HETARCHIEF,
	acceptedTosAt: '1997-01-01T00:00:00.000Z',
	groupId: Group.CP_ADMIN,
	groupName: GroupIdToName[Group.CP_ADMIN],
	permissions: [Permission.EDIT_ANY_CONTENT_PAGES],
};

const mockQuery: GraphQlQueryDto = {
	query: 'query testQuery { username }',
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

	describe('executeClientQuery', () => {
		it('should execute a query and return a result', async () => {
			nock('http://localhost/').post('/v1/graphql/').reply(201, {
				data: 'ok',
			});
			mockDataPermissionsService.verify.mockReturnValueOnce(true);
			mockDataPermissionsService.isAllowedToExecuteQuery.mockReturnValueOnce(
				true,
			);
			mockDataPermissionsService.getWhitelistedQuery.mockReturnValueOnce(
				mockQuery.query,
			);

			const result = await dataService.executeClientQuery(mockUser, mockQuery);

			expect(result).toEqual({
				data: 'ok',
			});
		});

		it('should throw an ForbiddenException when the query is not allowed to be executed', async () => {
			mockDataPermissionsService.verify.mockReturnValueOnce(false);
			mockDataPermissionsService.isAllowedToExecuteQuery.mockReturnValueOnce(
				false,
			);
			mockDataPermissionsService.getWhitelistedQuery.mockReturnValueOnce(
				mockQuery.query,
			);

			let error;
			try {
				await dataService.executeClientQuery(mockUser, mockQuery);
			} catch (e) {
				error = e.response;
			}

			expect(error).toEqual({
				error: 'Forbidden',
				statusCode: 403,
				message: 'You are not authorized to execute this query: testQuery',
			});
		});

		it('should return an internal server exception when the query could not be executed', async () => {
			nock('http://localhost/').post('/v1/graphql/').reply(500, {
				statusCode: 500,
				message: 'Internal Server Error',
			});
			mockDataPermissionsService.verify.mockReturnValueOnce(true);
			mockDataPermissionsService.isAllowedToExecuteQuery.mockReturnValueOnce(
				true,
			);
			mockDataPermissionsService.getWhitelistedQuery.mockReturnValueOnce(
				mockQuery.query,
			);

			let error;
			try {
				await dataService.executeClientQuery(mockUser, mockQuery);
			} catch (e) {
				error = e.response;
			}

			expect(error).toEqual({
				message: 'Internal Server Error',
				statusCode: 500,
			});
		});

		it('should not execute a not-whitelisted query', async () => {
			mockDataPermissionsService.isAllowedToExecuteQuery.mockReturnValueOnce(
				false,
			);
			mockDataPermissionsService.getWhitelistedQuery.mockReturnValueOnce(
				undefined,
			);

			let error;
			try {
				await dataService.executeClientQuery(mockUser, mockQuery);
			} catch (e) {
				error = e.response;
			}

			expect(error).toEqual({
				error: 'Forbidden',
				statusCode: 403,
				message: 'You are not authorized to execute this query: testQuery',
			});
		});

		it('should throw an internal server error when the graphql server returns errors', async () => {
			nock('http://localhost/')
				.post('/v1/graphql/')
				.reply(201, {
					errors: [
						{
							message: 'unknown graphql error',
						},
					],
				});
			mockDataPermissionsService.isAllowedToExecuteQuery.mockReturnValueOnce(
				true,
			);
			mockDataPermissionsService.verify.mockReturnValueOnce(true);
			let error;
			try {
				await dataService.executeClientQuery(mockUser, mockQuery);
			} catch (e) {
				error = e.response;
			}

			expect(error).toEqual({
				message: 'Internal Server Error',
				statusCode: 500,
			});
		});
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

	describe('executeClientQuery', () => {
		it('should execute a query with whitelist enabled and return a result', async () => {
			nock('http://localhost/').post('/v1/graphql/').reply(201, {
				data: 'ok',
			});
			mockDataPermissionsService.isAllowedToExecuteQuery.mockReturnValueOnce(
				true,
			);
			mockDataPermissionsService.isWhitelistEnabled.mockReturnValueOnce(true);
			mockDataPermissionsService.verify.mockReturnValueOnce(true);

			const result = await dataService.executeClientQuery(mockUser, {
				query: 'query getUsers(...',
			});

			expect(result).toEqual({
				data: 'ok',
			});
		});

		it('should not execute a not whitelisted query', async () => {
			nock('http://localhost/').post('/v1/graphql/').reply(201, {
				data: 'ok',
			});
			mockDataPermissionsService.isWhitelistEnabled.mockReturnValueOnce(true);
			mockDataPermissionsService.verify.mockReturnValueOnce(true);
			let error;
			try {
				await dataService.executeClientQuery(mockUser, {
					query: 'query unknown()',
				});
			} catch (e) {
				error = e.response;
			}
			expect(error).toEqual({
				error: 'Forbidden',
				statusCode: 403,
				message: 'You are not authorized to execute this query: testQuery',
			});
		});
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
