import { PickerItem } from '~shared/types/content-picker';
import { CustomError } from '~shared/helpers/custom-error';
import { parsePickerItem } from '~shared/components/ContentPicker/helpers/parse-picker';
import { fetchWithLogoutJson } from '~shared/helpers/fetch-with-logout';
import { getProxyUrl } from '~shared/helpers/get-proxy-url-from-admin-core-config';
import { HetArchiefIeObject } from '~modules/content-page/types/content-block.types';

export const retrieveIeObjects = async (title: string | '', limit = 5): Promise<PickerItem[]> => {
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
};
const parseIeObjects = (raw: Partial<HetArchiefIeObject>[]): PickerItem[] => {
	return raw.map(
		(item: Partial<HetArchiefIeObject>): PickerItem => ({
			label: item.name || '',
			...parsePickerItem('OBJECT', item.schemaIdentifier as string), // TODO enforce path in database
		})
	);
};
