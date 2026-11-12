import { type ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { PermissionName } from '@viaa/avo2-types';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { PermissionGuard } from './permission.guard';

const createMockExecutionContext = (permissions: PermissionName[]): ExecutionContext => {
	// The tests run with DATABASE_APPLICATION_TYPE=avo, so the session contains an avo user
	const mockGetRequest = vi.fn().mockReturnValue({
		session: {
			avoUserInfo: {
				uid: 'test-user-id',
				profile: {
					id: 'test-profile-id',
					permissions,
				},
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

	it('Should throw an UnauthorizedException when permissions are required and nobody is logged in', () => {
		mockReflector.get.mockReturnValueOnce([PermissionName.SEARCH]);
		const context = {
			switchToHttp: vi.fn().mockReturnValue({
				getRequest: vi.fn().mockReturnValue({ session: {}, headers: {} }),
			}),
			getClass: vi.fn(),
			getHandler: vi.fn(),
		} as unknown as ExecutionContext;
		expect(() => new PermissionGuard(mockReflector).canActivate(context)).toThrow(
			UnauthorizedException
		);
	});

	it('Should accept EDIT_USER_GROUPS for EDIT_PERMISSION_GROUPS in avo', () => {
		mockReflector.get.mockReturnValueOnce([PermissionName.EDIT_PERMISSION_GROUPS]);
		const context = createMockExecutionContext([PermissionName.EDIT_USER_GROUPS]);
		const canActivate = new PermissionGuard(mockReflector).canActivate(context);
		expect(canActivate).toBe(true);
	});

	afterEach(() => {
		process.env.IS_ADMIN_CORE_DEMO_APP = originalEnv;
	});
});
