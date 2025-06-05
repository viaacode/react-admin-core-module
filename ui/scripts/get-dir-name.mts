import path from 'path';

export function getDirName(): string {
	const metaUrl = import.meta.url;
	return path.dirname(
		metaUrl
			.replace('file://', '')
			// Replace /C:/ with C:/ on Windows
			.replace(new RegExp('/([A-Z]):/', 'g'), '$1:/')
	);
}
