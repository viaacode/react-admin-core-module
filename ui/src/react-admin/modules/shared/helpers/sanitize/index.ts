import type { DOMPurifyI } from 'dompurify';
import { isServerSideRendering } from '~shared/helpers/routing/is-server-side-rendering';
import type { SanitizePreset } from './presets';
import sanitizePresets from './presets';

// biome-ignore lint/suspicious/noExplicitAny: This is a generic function that can be used for multiple types
function normalizeModule(requiredModule: any): DOMPurifyI {
	return requiredModule?.default || requiredModule;
}

let domPurify: DOMPurifyI | undefined;
let domPurifyInitPromise: Promise<void> | undefined;

/**
 * DOMPurify uses the window in browser mode, so we need to conditionally import it
 * Otherwise this will break during server side rendering
 */
function initDOMPurify(): void {
	if (isServerSideRendering()) {
		// Mock DOMPurify during server side rendering
		// Return source unchanged since we can't sanitize without DOM
		domPurify = {
			sanitize: (source: string, _preset: SanitizePreset): string => {
				return source;
			},
		} as unknown as DOMPurifyI;
	} else {
		// Start loading DOMPurify asynchronously
		domPurifyInitPromise = import('dompurify').then((module) => {
			domPurify = normalizeModule(module);
		});
	}
}

initDOMPurify();

const sanitizeHtml = (input: string, preset: SanitizePreset): string => {
	// If domPurify is not yet loaded (async import pending), return input unchanged
	// This ensures hydration matches SSR output (which also returns unchanged)
	// The content will be sanitized on subsequent renders after DOMPurify loads
	if (!domPurify) {
		return input;
	}
	const presetConfig = sanitizePresets[preset];
	return domPurify.sanitize(input, presetConfig) as unknown as string;
};

export { sanitizeHtml, sanitizePresets };
