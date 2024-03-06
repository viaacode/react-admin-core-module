import { default as domPurify } from 'dompurify';
import { isNextServerSideRendering } from '~shared/helpers/isNextServerSideRendering';
// import { type JSDOM } from 'jsdom';

import sanitizePresets, { SanitizePreset } from './presets';

// let document: JSDOM;
// if (isNextServerSideRendering()) {
// 	const jsdom = await import('jsdom');
// 	document = new jsdom.JSDOM();
// }

const sanitizeHtml = (input: string, preset: SanitizePreset): string => {
	const presetConfig = sanitizePresets[preset];

	// Disable sanitation for server side rendering
	if (isNextServerSideRendering()) {
		return input;
	}

	// Sanitation in the browser
	return domPurify.sanitize(input, presetConfig) as string;
};

export { sanitizeHtml, sanitizePresets };
