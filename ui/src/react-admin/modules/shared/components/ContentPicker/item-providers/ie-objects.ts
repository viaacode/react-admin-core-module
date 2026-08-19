import { AvoCoreContentPickerType } from '@viaa/avo2-types';
import memoize from 'memoizee';
import type { HetArchiefIeObject } from '~modules/content-page/types/content-block.types';
import { parsePickerItem } from '~shared/components/ContentPicker/helpers/parse-picker';
import { MEMOIZEE_OPTIONS } from '~shared/consts/memoizee-options';
import { CustomError } from '~shared/helpers/custom-error';
import { fetchWithLogoutJson } from '~shared/helpers/fetch-with-logout';
import { getProxyUrl } from '~shared/helpers/get-proxy-url-from-admin-core-config';
import type { PickerItem } from '~shared/types/content-picker';

/**
 * Memoized on primitives only. The formats are passed in pre-joined because memoizee compares
 * object arguments by reference, so a fresh array literal per render would never hit the cache.
 * `length` is set explicitly: parameters with a default value do not count towards `fn.length`,
 * so relying on the default arity would key the cache on the title alone.
 */
const fetchIeObjects = memoize(
	async (title: string | null, formatsKey: string): Promise<PickerItem[]> => {
		const formats = formatsKey ? formatsKey.split(',') : [];
		try {
			const rawIeObjects: { items: HetArchiefIeObject[] } = await fetchWithLogoutJson(
				`${getProxyUrl()}/ie-objects`,
				{
					method: 'POST',
					body: JSON.stringify({
						filters: [
							...(title ? [{ field: 'query', operator: 'contains', value: title }] : []),
							// `format` maps to dcterms_format as a terms query, so multiValue is an OR
							...(formats.length ? [{ field: 'format', operator: 'is', multiValue: formats }] : []),
						],
						size: 10,
						page: 0,
					}),
				}
			);
			return parseIeObjects(rawIeObjects.items || []);
		} catch (err) {
			throw new CustomError('Failed to fetch ie-objects for content picker', err, {
				title,
				formats,
			});
		}
	},
	{ ...MEMOIZEE_OPTIONS, length: 2, primitive: true }
);

/**
 * Content picker provider for hetarchief ie-objects.
 *
 * @param title free text to search the object name on
 * @param limit unused: the request size is fixed. Kept for the shared fetch signature.
 * @param pickerType unused: this provider only serves IE_OBJECT.
 * @param formats optional dcterms formats to restrict the results to, so a block can offer eg.
 *                only AV objects. See IE_OBJECT_AV_FORMATS.
 */
export const retrieveIeObjects = (
	title: string | null,
	// biome-ignore lint/correctness/noUnusedFunctionParameters: part of the shared fetch signature
	limit = 5,
	// biome-ignore lint/correctness/noUnusedFunctionParameters: part of the shared fetch signature
	pickerType?: AvoCoreContentPickerType,
	formats?: string[]
): Promise<PickerItem[]> => fetchIeObjects(title, (formats || []).join(','));

const parseIeObjects = (raw: Partial<HetArchiefIeObject>[]): PickerItem[] => {
	return raw.map(
		(item: Partial<HetArchiefIeObject>): PickerItem => ({
			label: item.name || '',
			dctermsFormat: item.dctermsFormat || undefined,
			...parsePickerItem(AvoCoreContentPickerType.IE_OBJECT, item.schemaIdentifier as string), // TODO enforce path in database
		})
	);
};
