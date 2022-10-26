import { ExecutionContext } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Configuration } from '../../../config';

import { LoggedInGuard } from './logged-in.guard';

const mockExecutionContextWithSession = (session) =>
	({
		switchToHttp: jest.fn().mockReturnValue({
			getRequest: jest.fn().mockReturnValue({
				session,
			}),
		}),
	} as unknown as ExecutionContext);

const mockConfigService = {
	get: jest.fn((key: keyof Configuration): string | boolean => {
		if (key === 'IS_ADMIN_CORE_DEMO_APP') {
			return false;
		}
		return key;
	}),
} as unknown as ConfigService<Configuration>;

describe('LoggedInGuard', () => {
	it('Should allow access when user is logged in', async () => {
		const session = {
			archiefUserInfo: {
				id: 'test-user-id',
			},
		};
		const canActivate = new LoggedInGuard(mockConfigService).canActivate(
			mockExecutionContextWithSession(session),
		);
		expect(canActivate).toBe(true);
	});

	it('Should not allow access when no user is logged in', async () => {
		expect(() =>
			new LoggedInGuard(mockConfigService).canActivate(
				mockExecutionContextWithSession({}),
			),
		).toThrowError();
	});
});
