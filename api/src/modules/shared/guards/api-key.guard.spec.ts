import { type ExecutionContext } from '@nestjs/common';
import { vi } from 'vitest';

import { API_KEY_EXCEPTION, ApiKeyGuard } from './api-key.guard';

const mockApiKey = 'MySecretApiKey';

const mockExecutionContextCorrect = {
	switchToHttp: vi.fn().mockReturnValue({
		getRequest: vi.fn().mockReturnValue({
			header: (headerName: string) => {
				if (headerName === 'apikey') {
					return mockApiKey;
				} else {
					return undefined;
				}
			},
		}),
	}),
} as unknown as ExecutionContext;

const mockExecutionContextNotSet = {
	switchToHttp: vi.fn().mockReturnValue({
		getRequest: vi.fn().mockReturnValue({
			header: () => {
				return undefined;
			},
		}),
	}),
} as unknown as ExecutionContext;

const mockExecutionContextWrong = {
	switchToHttp: vi.fn().mockReturnValue({
		getRequest: vi.fn().mockReturnValue({
			header: (headerName: string) => {
				if (headerName === 'apikey') {
					return 'wrongApiKey';
				} else {
					return undefined;
				}
			},
		}),
	}),
} as unknown as ExecutionContext;

describe('ApiKeyGuard', () => {
	it('Should allow access when apiKey header is set', async () => {
		const canActivateRoute: boolean = new ApiKeyGuard().canActivate(mockExecutionContextCorrect);
		expect(canActivateRoute).toBe(true);
	});

	it('Should not allow access when apiKey header is not set', async () => {
		let error: any;
		try {
			new ApiKeyGuard().canActivate(mockExecutionContextNotSet);
		} catch (err: any) {
			error = err;
		}
		expect(error).toBe(API_KEY_EXCEPTION);
	});

	it('Should not allow access when apiKey header is wrong', async () => {
		let error: any;
		try {
			new ApiKeyGuard().canActivate(mockExecutionContextWrong);
		} catch (err: any) {
			error = err;
		}
		expect(error).toBe(API_KEY_EXCEPTION);
	});
});
