import { CustomError } from '~modules/shared/helpers/custom-error';

const AVO_LAST_RELOAD_BECAUSE_UNAUTH = 'AVO_LAST_RELOAD_BECAUSE_UNAUTH';

type FetchOptions = Omit<RequestInit, 'method'> & {
	method: 'GET' | 'POST' | 'DELETE' | 'PUT' | 'PATCH';
};

/**
 * Tries to get something from the proxy, if the response is 401, then the user is logged out and redirected to the login screen
 * @param url
 * @param options
 */
export async function fetchWithLogout(url: string, options?: FetchOptions): Promise<Response> {
	const response = await fetch(url, {
		headers: {
			'Content-Type': 'application/json',
		},
		credentials: 'include',
		method: 'GET',
		...options,
	});
	if (response.status === 401) {
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

export async function fetchWithLogoutJson(url: string, options?: FetchOptions): Promise<any> {
	const response = await fetchWithLogout(url, options);
	return response.json();
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
