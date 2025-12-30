import domPurify from 'isomorphic-dompurify';

import type { SanitizePreset } from './presets';
import sanitizePresets from './presets';

const sanitizeHtml = (input: string, preset: SanitizePreset): string => {
	const presetConfig = sanitizePresets[preset];
	return domPurify.sanitize(input, presetConfig) as unknown as string;
};

export { sanitizeHtml, sanitizePresets };
