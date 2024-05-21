import { PickerItem } from '~shared/types/content-picker';
import { CustomError } from '~shared/helpers/custom-error';
import { ContentPageInfo } from '~modules/content-page/types/content-pages.types';
import { parsePickerItem } from '~shared/components/ContentPicker/helpers/parse-picker';
import { fetchWithLogoutJson } from '~shared/helpers/fetch-with-logout';
import { getProxyUrl } from '~shared/helpers/get-proxy-url-from-admin-core-config';

export const retrieveIeObjects = async (title: string | null, limit = 5): Promise<any> => {
	try {
		const rawIeObjects: any = await fetchWithLogoutJson(`${getProxyUrl()}/ie-objects`, {
			method: 'POST',
			...(title
				? {
						body: JSON.stringify({
							filters: [{ field: 'query', operator: 'contains', value: title }],
							size: 10,
							page: 0,
						}),
				  }
				: {}),
		});
		console.log(rawIeObjects);
		return parseIeObjects(rawIeObjects || []);
	} catch (err) {
		throw new CustomError('Failed to fetch ie-objects for content picker', err, {
			title,
			limit,
		});
	}
};
const parseIeObjects = (raw: Partial<ContentPageInfo>[]): PickerItem[] => {
	return raw.map(
		(item: Partial<ContentPageInfo>): PickerItem => ({
			label: item.title || '',
			...parsePickerItem('OBJECT', item.path as string), // TODO enforce path in database
		})
	);
};
