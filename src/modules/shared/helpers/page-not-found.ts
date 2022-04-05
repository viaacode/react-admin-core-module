import { Config } from 'core/config';

export function getPageNotFoundError(loggedIn: boolean): string {
	return loggedIn
		? Config.getConfig().services.i18n.t(
				'error/views/error-view___de-pagina-werd-niet-gevonden-ingelogd'
		  )
		: Config.getConfig().services.i18n.t(
				'error/views/error-view___de-pagina-werd-niet-gevonden-niet-ingelogd'
		  );
}
