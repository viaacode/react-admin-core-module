import { ROUTE_PARTS } from '~shared/consts';
import { isServerSideRendering } from '~shared/helpers/routing/is-server-side-rendering';

export function isAdminRoute(): boolean {
	if (isServerSideRendering()) {
		return false;
	}
	return window.location.href.includes(ROUTE_PARTS.admin);
}
