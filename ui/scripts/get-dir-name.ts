import path from 'node:path';

export function getDirName(): string {
	const metaUrl = import.meta.url;
	return path.dirname(
		metaUrl
			.replace('file://', '')
			// Replace /C:/ with C:/ on Windows
			.replace(/\/([A-Z]):\//g, '$1:/')
	);
}
