import { type ExecutionContext } from '@nestjs/common';
import { vi, describe, it, expect, beforeEach } from 'vitest';

import { API_KEY_EXCEPTION, ApiKeyGuard } from './api-key.guard';

const mockApiKey = 'MySecretApiKey';

const createMockExecutionContext = (apiKeyValue: string | undefined): ExecutionContext => {
	const mockGetRequest = vi.fn().mockReturnValue({
		header: (headerName: string) => {
			if (headerName === 'apikey') {
				return apiKeyValue;
			}
			return undefined;
		},
	});
	const mockSwitchToHttp = vi.fn().mockReturnValue({ getRequest: mockGetRequest });
	return { switchToHttp: mockSwitchToHttp } as unknown as ExecutionContext;
};

describe('ApiKeyGuard', () => {
	beforeEach(() => {
		process.env.PROXY_API_KEY = mockApiKey;
	});

	it('Should allow access when apiKey header is set', () => {
		const context = createMockExecutionContext(mockApiKey);
		const canActivateRoute = new ApiKeyGuard().canActivate(context);
		expect(canActivateRoute).toBe(true);
	});

	it('Should not allow access when apiKey header is not set', () => {
		const context = createMockExecutionContext(undefined);
		let error: any;
		try {
			new ApiKeyGuard().canActivate(context);
		} catch (err: any) {
			error = err;
		}
		expect(error).toBe(API_KEY_EXCEPTION);
	});

	it('Should not allow access when apiKey header is wrong', () => {
		const context = createMockExecutionContext('wrongApiKey');
		let error: any;
		try {
			new ApiKeyGuard().canActivate(context);
		} catch (err: any) {
			error = err;
		}
		expect(error).toBe(API_KEY_EXCEPTION);
	});
});
