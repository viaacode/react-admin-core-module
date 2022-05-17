import { compact, sortBy } from 'lodash-es';

import { APP_PATH, RouteId } from '../../../consts/routes.consts';
import { parsePickerItem } from '../helpers/parse-picker';

import { ContentPickerType } from '~modules/shared/components/ContentPicker/ContentPicker.types';
import { PickerItem } from '~modules/shared/types/content-picker';

// Return InternalLinkItems items from APP_PATH
export const retrieveInternalLinks = async (
	keyword: string | null,
	limit: number
): Promise<PickerItem[]> => {
	const routeOptions: (PickerItem | null)[] = (Object.keys(APP_PATH) as RouteId[]).map(
		(pageId: RouteId): PickerItem | null => {
			if (
				APP_PATH[pageId].showInContentPicker &&
				(!keyword || APP_PATH[pageId].route.includes(keyword))
			) {
				return {
					label: APP_PATH[pageId].route,
					...parsePickerItem(ContentPickerType.INTERNAL_LINK, APP_PATH[pageId].route),
				};
			}
			return null;
		}
	);
	return sortBy(compact(routeOptions), 'value').slice(0, limit);
};
