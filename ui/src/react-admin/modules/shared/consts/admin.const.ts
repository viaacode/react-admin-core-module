import { CONTENT_PAGE_PATH } from '~modules/content-page/const/content-page.consts';
import { NAVIGATION_PATH } from '~modules/navigation/navigation.consts';
import { USER_PATH } from '~modules/user/user.routes';
import { COLLECTIONS_OR_BUNDLES_PATH } from './collection.const';

export const ADMIN_PATH = () => Object.freeze({
	USER_PATH: { ...USER_PATH() },
	CONTENT_PAGE: { ...CONTENT_PAGE_PATH() },
	...COLLECTIONS_OR_BUNDLES_PATH,
	NAVIGATION_PATH: { ...NAVIGATION_PATH() },
});
