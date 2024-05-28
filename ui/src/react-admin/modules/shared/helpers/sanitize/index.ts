import domPurify from 'isomorphic-dompurify';

import sanitizePresets, { SanitizePreset } from './presets';

const sanitizeHtml = (input: string, preset: SanitizePreset): string => {
	const presetConfig = sanitizePresets[preset];
	return domPurify.sanitize(input, presetConfig) as string;
};

export { sanitizeHtml, sanitizePresets };
