import { sanitize } from 'dompurify';

import sanitizePresets, { SanitizePreset } from './presets';

const sanitizeHtml = (input: string, preset: SanitizePreset): string => {
	const presetConfig = sanitizePresets[preset];
	return sanitize(input, presetConfig) as string;
};

export { sanitizeHtml, sanitizePresets };
