import { type ExecutionContext } from '@nestjs/common';
import { PermissionName } from '@viaa/avo2-types';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { PermissionGuard } from './permission.guard';

const createMockExecutionContext = (permissions: PermissionName[]): ExecutionContext => {
	const mockGetRequest = vi.fn().mockReturnValue({
		session: {
			archiefUserInfo: {
				id: 'test-user-id',
				permissions,
			},
		},
		headers: {},
	});
	const mockSwitchToHttp = vi.fn().mockReturnValue({ getRequest: mockGetRequest });
	return {
		switchToHttp: mockSwitchToHttp,
		getClass: vi.fn(),
		getHandler: vi.fn(),
	} as unknown as ExecutionContext;
};

describe('PermissionGuard', () => {
	// biome-ignore lint/suspicious/noExplicitAny: mock
	let mockReflector: any;
	const originalEnv = process.env.IS_ADMIN_CORE_DEMO_APP;

	beforeEach(() => {
		process.env.IS_ADMIN_CORE_DEMO_APP = 'false';
		mockReflector = {
			get: vi.fn(),
			getAll: vi.fn(),
			getAllAndMerge: vi.fn(),
			getAllAndOverride: vi.fn(),
		};
	});

	it('Should allow access when no permissions are required', () => {
		const context = createMockExecutionContext([]);
		const canActivate = new PermissionGuard(mockReflector).canActivate(context);
		expect(canActivate).toBe(true);
	});

	it('Should allow access when the user has all required permissions', () => {
		mockReflector.get.mockReturnValueOnce([PermissionName.SEARCH, PermissionName.SEARCH_OBJECTS]);
		const context = createMockExecutionContext([
			PermissionName.SEARCH,
			PermissionName.SEARCH_OBJECTS,
		]);
		const canActivate = new PermissionGuard(mockReflector).canActivate(context);
		expect(canActivate).toBe(true);
	});

	it('Should NOT allow access when the user has not all required permissions', () => {
		mockReflector.get
			.mockReturnValueOnce([])
			.mockReturnValueOnce([PermissionName.SEARCH, PermissionName.SEARCH_OBJECTS]);
		const context = createMockExecutionContext([PermissionName.SEARCH]);
		expect(() => new PermissionGuard(mockReflector).canActivate(context)).toThrow();
	});

	it('Should allow access when the user has any of the required permissions', () => {
		mockReflector.get
			.mockReturnValueOnce([])
			.mockReturnValueOnce([])
			.mockReturnValueOnce([PermissionName.SEARCH, PermissionName.SEARCH_OBJECTS]);
		const context = createMockExecutionContext([PermissionName.SEARCH]);
		const canActivate = new PermissionGuard(mockReflector).canActivate(context);
		expect(canActivate).toBe(true);
	});

	it('Should allow access when the user has all of the any permissions', () => {
		mockReflector.get
			.mockReturnValueOnce([])
			.mockReturnValueOnce([])
			.mockReturnValueOnce([PermissionName.SEARCH, PermissionName.SEARCH_OBJECTS]);
		const context = createMockExecutionContext([
			PermissionName.SEARCH,
			PermissionName.SEARCH_OBJECTS,
		]);
		const canActivate = new PermissionGuard(mockReflector).canActivate(context);
		expect(canActivate).toBe(true);
	});

	it('Should NOT allow access when the user has none of the any permissions', () => {
		mockReflector.get
			.mockReturnValueOnce([])
			.mockReturnValueOnce([])
			.mockReturnValueOnce([])
			.mockReturnValueOnce([PermissionName.SEARCH, PermissionName.SEARCH_OBJECTS]);
		const context = createMockExecutionContext([PermissionName.CREATE_VISIT_REQUEST]);
		expect(() => new PermissionGuard(mockReflector).canActivate(context)).toThrow();
	});

	afterEach(() => {
		process.env.IS_ADMIN_CORE_DEMO_APP = originalEnv;
	});
});
