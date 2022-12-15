import { CustomError } from './custom-error';

const AVO_LAST_RELOAD_BECAUSE_UNAUTH = 'AVO_LAST_RELOAD_BECAUSE_UNAUTH';

type FetchOptions = Omit<RequestInit, 'method'> & {
	method: 'GET' | 'POST' | 'DELETE' | 'PUT' | 'PATCH';
};

/**
 * Tries to get something from the proxy, if the response is 401, then the user is logged out and redirected to the login screen
 * @param url
 * @param options
 */
export async function fetchWithLogout(
	url: RequestInfo,
	options?: Partial<FetchOptions & { forceLogout: boolean }>
): Promise<Response> {
	const { forceLogout, ...fetchOptions } = options || { forceLogout: true };
	const response = await fetch(url, {
		method: 'GET',
		headers: {
			'Content-Type': 'application/json',
		},
		credentials: 'include',
		...fetchOptions,
	});
	if (response.status === 401 && (forceLogout ?? true)) {
		// User is no longer logged in => force them to login again
		goToLoginBecauseOfUnauthorizedError();
	}
	if (response.status < 200 || response.status >= 400) {
		throw new CustomError('invalid status code', null, {
			url,
			fetchOptions: options,
			response,
			statusCode: response.status,
		});
	}
	return response;
}

/**
 * Operator overloading to ensure typescript understands that the function can sometimes return ResponseType and sometimes ResponseType | null
 * Based on the options.throwOnNullResponse parameter
 * @param url
 * @param options
 */
export async function fetchWithLogoutJson<ResponseType>(
	url: RequestInfo,
	options?: Partial<FetchOptions & { forceLogout: boolean; throwOnNullResponse: true }>
): Promise<ResponseType>;
export async function fetchWithLogoutJson<ResponseType>(
	url: RequestInfo,
	options?: Partial<FetchOptions & { forceLogout: boolean; throwOnNullResponse: false }>
): Promise<ResponseType | null>;
export async function fetchWithLogoutJson<ResponseType>(
	url: RequestInfo,
	options?: Partial<FetchOptions & { forceLogout: boolean }>
): Promise<ResponseType | null>;
export async function fetchWithLogoutJson<ResponseType>(
	url: RequestInfo,
	options?: Partial<FetchOptions & { forceLogout: boolean; throwOnNullResponse: boolean }>
): Promise<ResponseType | null> {
	const { throwOnNullResponse, ...fetchOptions } = options || { throwOnNullResponse: false };
	const response = await fetchWithLogout(url, fetchOptions);

	const text = await response.text();
	if (text) {
		return JSON.parse(text);
	} else {
		if (throwOnNullResponse) {
			throw new CustomError('Response from the server was null', null, {
				code: 'RESPONSE_IS_NULL',
				text,
				url,
				options,
			});
		} else {
			return null; // only in case throwOnNullResponse is false/undefined will this  return null
		}
	}
}

export function goToLoginBecauseOfUnauthorizedError() {
	const lastReloadDate = localStorage && localStorage.getItem(AVO_LAST_RELOAD_BECAUSE_UNAUTH);
	if (
		!lastReloadDate ||
		new Date(lastReloadDate).getTime() < new Date().getTime() - 5 * 60 * 1000
	) {
		if (localStorage) {
			localStorage.setItem(AVO_LAST_RELOAD_BECAUSE_UNAUTH, new Date().toISOString());
		}
		window.location.reload();
	}
}
