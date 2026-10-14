/**
 * Resolve the public ipv4 address of the machine running this code
 * Replaces the public-ip package, which pulled in an old vulnerable version of got
 */
export async function getPublicIpV4(): Promise<string> {
	const response = await fetch('https://api.ipify.org', { signal: AbortSignal.timeout(5000) });
	if (!response.ok) {
		throw new Error(`Failed to resolve public ip, status: ${response.status}`);
	}
	return (await response.text()).trim();
}
