import { NAVIGATION_PATH } from '~modules/navigation/navigation.consts';
import { COLLECTIONS_OR_BUNDLES_PATH } from './collection.const';
import { CONTENT_PATH } from './content.const';
import { USER_PATH } from './user.const';

export const ADMIN_PATH = Object.freeze({
	...USER_PATH,
	...CONTENT_PATH,
	...COLLECTIONS_OR_BUNDLES_PATH,
	...NAVIGATION_PATH,
});
