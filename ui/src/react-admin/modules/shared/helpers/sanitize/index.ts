import type { DOMPurifyI } from 'dompurify';
import { isServerSideRendering } from '~shared/helpers/routing/is-server-side-rendering';
import type { SanitizePreset } from './presets';
import sanitizePresets from './presets';

function normalizeModule(requiredModule: any): DOMPurifyI {
	return requiredModule?.default || requiredModule;
}

let domPurify: DOMPurifyI;
/**
 * DOMPurify uses the window in browser mode, so we need to conditionally import it
 * Otherwise this will break during server side rendering
 */
async function initDOMPurify(): Promise<void> {
	if (isServerSideRendering()) {
		// Mock DOMPurify during server side rendering
		// domPurify = await initDOMPurifyWithJSDOM();
		domPurify = {
			sanitize: (source: string, _preset: SanitizePreset): string => {
				return source;
			},
		} as unknown as DOMPurifyI;
	} else {
		domPurify = normalizeModule(await import('dompurify'));
	}
}

initDOMPurify();

const sanitizeHtml = (input: string, preset: SanitizePreset): string => {
	const presetConfig = sanitizePresets[preset];
	return domPurify.sanitize(input, presetConfig) as unknown as string;
};

export { sanitizeHtml, sanitizePresets };
