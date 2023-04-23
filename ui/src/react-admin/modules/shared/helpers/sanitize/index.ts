import { default as domPurify } from 'dompurify';

import sanitizePresets, { SanitizePreset } from './presets';

const sanitizeHtml = (input: string, preset: SanitizePreset): string => {
	const presetConfig = sanitizePresets[preset];
	return domPurify.sanitize(input, presetConfig) as string;
};

export { sanitizeHtml, sanitizePresets };
