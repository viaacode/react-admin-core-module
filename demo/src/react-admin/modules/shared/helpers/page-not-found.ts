import { AdminConfigManager } from '~core/config';

export function getPageNotFoundError(loggedIn: boolean): string {
	return loggedIn
		? AdminConfigManager.getConfig().services.i18n.t(
				'error/views/error-view___de-pagina-werd-niet-gevonden-ingelogd'
		  )
		: AdminConfigManager.getConfig().services.i18n.t(
				'error/views/error-view___de-pagina-werd-niet-gevonden-niet-ingelogd'
		  );
}
