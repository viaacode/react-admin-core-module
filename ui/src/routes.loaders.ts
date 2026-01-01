import { asyncNoop, noop } from 'es-toolkit';
import { AdminConfigManager } from '~core/config';
import { getAdminCoreApiUrl } from '~shared/helpers/get-proxy-url-from-admin-core-config';
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
