import domPurify from 'isomorphic-dompurify';

import type { SanitizePreset } from './presets/index.js';
import sanitizePresets from './presets/index.js';

const sanitizeHtml = (input: string, preset: SanitizePreset): string => {
	const presetConfig = sanitizePresets[preset];
	return domPurify.sanitize(input, presetConfig) as string;
};

export { sanitizeHtml, sanitizePresets };
