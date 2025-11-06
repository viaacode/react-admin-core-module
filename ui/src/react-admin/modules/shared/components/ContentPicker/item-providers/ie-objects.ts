import { ContentPickerType } from '@viaa/avo2-types';
import memoize from 'memoizee';
import type { HetArchiefIeObject } from '~modules/content-page/types/content-block.types.js';
import { parsePickerItem } from '~shared/components/ContentPicker/helpers/parse-picker.js';
import { MEMOIZEE_OPTIONS } from '~shared/consts/memoizee-options.js';
import { CustomError } from '~shared/helpers/custom-error.js';
import { fetchWithLogoutJson } from '~shared/helpers/fetch-with-logout.js';
import { getProxyUrl } from '~shared/helpers/get-proxy-url-from-admin-core-config.js';
import type { PickerItem } from '~shared/types/content-picker.js';

export const retrieveIeObjects = memoize(
	async (title: string | null, limit = 5): Promise<PickerItem[]> => {
		try {
			const rawIeObjects: { items: HetArchiefIeObject[] } = await fetchWithLogoutJson(
				`${getProxyUrl()}/ie-objects`,
				{
					method: 'POST',
					body: JSON.stringify({
						filters: [{ field: 'query', operator: 'contains', value: title }],
						size: 10,
						page: 0,
					}),
				}
			);
			return parseIeObjects(rawIeObjects.items || []);
		} catch (err) {
			throw new CustomError('Failed to fetch ie-objects for content picker', err, {
				title,
				limit,
			});
		}
	},
	MEMOIZEE_OPTIONS
);

const parseIeObjects = (raw: Partial<HetArchiefIeObject>[]): PickerItem[] => {
	return raw.map(
		(item: Partial<HetArchiefIeObject>): PickerItem => ({
			label: item.name || '',
			...parsePickerItem(ContentPickerType.IE_OBJECT, item.schemaIdentifier as string), // TODO enforce path in database
		})
	);
};
