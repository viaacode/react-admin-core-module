import { type ExecutionContext } from '@nestjs/common';
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';

import { LoggedInGuard } from './logged-in.guard';

const createMockExecutionContext = (session: any): ExecutionContext => {
	const mockGetRequest = vi.fn().mockReturnValue({ session, headers: {} });
	const mockSwitchToHttp = vi.fn().mockReturnValue({ getRequest: mockGetRequest });
	return { switchToHttp: mockSwitchToHttp } as unknown as ExecutionContext;
};

describe('LoggedInGuard', () => {
	const originalEnv = process.env.IS_ADMIN_CORE_DEMO_APP;

	beforeEach(() => {
		process.env.IS_ADMIN_CORE_DEMO_APP = 'false';
	});

	afterEach(() => {
		process.env.IS_ADMIN_CORE_DEMO_APP = originalEnv;
	});

	it('Should allow access when user is logged in', () => {
		const session = {
			archiefUserInfo: {
				id: 'test-user-id',
			},
		};
		const context = createMockExecutionContext(session);
		const canActivate = new LoggedInGuard().canActivate(context);
		expect(canActivate).toBe(true);
	});

	it('Should not allow access when no user is logged in', () => {
		const context = createMockExecutionContext({});
		expect(() => new LoggedInGuard().canActivate(context)).toThrow();
	});
});
