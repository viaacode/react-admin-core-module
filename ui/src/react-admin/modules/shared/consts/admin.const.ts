import { NAVIGATION_PATH } from '~modules/navigation/navigation.consts';
import { CONTENT_PAGE_PATH, USER_PATH } from '../../../../react-admin';
import { COLLECTIONS_OR_BUNDLES_PATH } from './collection.const';

export const ADMIN_PATH = Object.freeze({
	...USER_PATH(),
	...CONTENT_PAGE_PATH(),
	...COLLECTIONS_OR_BUNDLES_PATH,
	...NAVIGATION_PATH,
});
