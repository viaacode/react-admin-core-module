import { NAVIGATION_PATH } from '~modules/navigation/navigation.consts';
import { AdminConfigManager, CONTENT_PAGE_PATH } from '../../../../react-admin';
import { COLLECTIONS_OR_BUNDLES_PATH } from './collection.const';
import { USER_PATH } from './user.const';

export const ADMIN_PATH = Object.freeze({
	...USER_PATH,
	...CONTENT_PAGE_PATH(AdminConfigManager.getConfig().route_parts),
	...COLLECTIONS_OR_BUNDLES_PATH,
	...NAVIGATION_PATH,
});
