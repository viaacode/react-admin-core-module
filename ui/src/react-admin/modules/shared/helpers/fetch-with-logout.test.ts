import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { fetchWithLogout } from './fetch-with-logout.ts';

describe('fetchWithLogout', () => {
	const fetchMock = vi.fn();

	beforeEach(() => {
		fetchMock.mockResolvedValue(new Response('{}', { status: 200 }));
		vi.stubGlobal('fetch', fetchMock);
	});

	afterEach(() => {
		fetchMock.mockReset();
		vi.unstubAllGlobals();
	});

	function getRequestInit(): RequestInit {
		return fetchMock.mock.calls[0][1] as RequestInit;
	}

	it('does not send a Content-Type header on a GET without body, to avoid a CORS preflight', async () => {
		await fetchWithLogout('https://proxy.example/admin/navigations/items');

		const requestInit = getRequestInit();
		expect(requestInit.method).toEqual('GET');
		expect(requestInit.headers).toBeUndefined();
		expect(requestInit.credentials).toEqual('include');
	});

	it('sends a json Content-Type header when there is a body', async () => {
		await fetchWithLogout('https://proxy.example/admin/content-pages', {
			method: 'POST',
			body: JSON.stringify({ title: 'test' }),
		});

		expect(getRequestInit().headers).toEqual({ 'Content-Type': 'application/json' });
	});

	it('uses the headers passed by the caller instead of the default headers', async () => {
		await fetchWithLogout('https://proxy.example/admin/content-pages', {
			method: 'POST',
			headers: {},
			body: new FormData(),
		});

		expect(getRequestInit().headers).toEqual({});
	});
});
