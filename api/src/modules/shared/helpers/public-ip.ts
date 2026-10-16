const PUBLIC_IP_CACHE_DURATION_MS = 60 * 60 * 1000; // 1 hour

let cachedPublicIp: { promise: Promise<string>; expiresAt: number } | null = null;

async function fetchPublicIpV4(): Promise<string> {
	const response = await fetch('https://api.ipify.org', { signal: AbortSignal.timeout(5000) });
	if (!response.ok) {
		throw new Error(`Failed to resolve public ip, status: ${response.status}`);
	}
	return (await response.text()).trim();
}

/**
 * Resolve the public ipv4 address of the machine running this code
 * Replaces the public-ip package, which pulled in an old vulnerable version of got
 * On local and test environments, the result is cached and concurrent calls share one request, to avoid being rate limited (429) by ipify
 */
export async function getPublicIpV4(): Promise<string> {
	if (!['local', 'test'].includes(process.env.NODE_ENV)) {
		return fetchPublicIpV4();
	}
	if (cachedPublicIp && cachedPublicIp.expiresAt > Date.now()) {
		return cachedPublicIp.promise;
	}
	const promise = fetchPublicIpV4();
	cachedPublicIp = { promise, expiresAt: Date.now() + PUBLIC_IP_CACHE_DURATION_MS };
	promise.catch(() => {
		// Don't cache failures
		if (cachedPublicIp?.promise === promise) {
			cachedPublicIp = null;
		}
	});
	return promise;
}
