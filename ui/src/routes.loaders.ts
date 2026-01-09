import { asyncNoop } from 'es-toolkit';
import type { LoaderFunctionArgs } from 'react-router';
import { AdminConfigManager } from '~core/config';
import { convertDbContentPageToContentPageInfo } from '~modules/content-page/services/content-page.converters.ts';
import { ContentPageService } from '~modules/content-page/services/content-page.service.ts';
import { getAdminCoreApiUrl } from '~shared/helpers/get-proxy-url-from-admin-core-config';
import { Locale } from '../scripts/translation.types.ts';
import { setAdminCoreConfig } from './shared/helpers/admin-core-config';
import { loadTranslations } from './shared/translations/i18n';

export async function initAppLoader() {
	try {
		// Set admin-core config with dummy navigate function during SSR
		// The config will be set again in the client after hydration
		if (!AdminConfigManager.isConfigSet()) {
			setAdminCoreConfig(asyncNoop);
		}

		await Promise.all([
			// Fetch login state
			// checkLoginState(),
			// Wait for translations to load
			await loadTranslations(getAdminCoreApiUrl()),
		]);
	} catch (err) {
		console.error(
			'Failed to load admin-core-config or translations in react-router loader for App route',
			err
		);
	}
}

// biome-ignore lint/suspicious/noExplicitAny: don't know what type this should be
export async function fetchContentPageLoader(args: LoaderFunctionArgs<any>) {
	try {
		// Load content page for the requested path
		const path = new URL(args.request.url).pathname;
		if (!path) {
			return {
				contentPage: null,
				url: args.request.url,
			};
		}
		const dbContentPage = await ContentPageService.getContentPageByLanguageAndPath(
			// biome-ignore lint/suspicious/noExplicitAny: Any because sometimes there is a mismatch between Locale in admin-core and Locale in client app
			Locale.Nl as any,
			path
		);
		if (!dbContentPage) {
			return null;
		}

		return {
			contentPage: convertDbContentPageToContentPageInfo(dbContentPage),
			url: args.request.url,
		};
	} catch (err) {
		console.error('Failed to load content page in react-router loader', err, {
			url: args.request.url,
		});
		return {
			contentPage: null,
			url: args.request.url,
		};
	}
}

// biome-ignore lint/suspicious/noExplicitAny: This loader is used by multiple routes
export async function passUrlLoader(args: LoaderFunctionArgs<any>) {
	return {
		url: args.request.url,
	};
}
