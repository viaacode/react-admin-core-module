import { AvoCoreContentPickerType } from '@viaa/avo2-types';
import memoize from 'memoizee';
import { ContentPageService } from '~modules/content-page/services/content-page.service';
import type { ContentPageInfo } from '~modules/content-page/types/content-pages.types';
import { MEMOIZEE_OPTIONS } from '~shared/consts/memoizee-options';
import { CustomError } from '~shared/helpers/custom-error';
import type { PickerItem } from '~shared/types/content-picker';
import { parsePickerItem } from '../helpers/parse-picker';

/**
 * All content pages can be translated into multiple languages
 * To have a link between the same page in multiple languages, the parent NL page is set on the translated versions
 * So if we want to find all translated versions of a page, we just have to find all pages with a specific nlParentPageId set
 * @param title
 * @param limit
 */
export const retrieveNlParentContentPages = memoize(
	async (title: string | null, limit = 5): Promise<PickerItem[]> => {
		try {
			const contentItems: ContentPageInfo[] | null = title
				? await ContentPageService.getNlParentContentPagesByTitle(`%${title}%`, limit)
				: await ContentPageService.getNlParentContentPagesByTitle(undefined, limit);

			return parseContentPages(contentItems || []);
		} catch (err) {
			throw new CustomError('Failed to fetch nl parent content pages for content picker', err, {
				title,
				limit,
			});
		}
	},
	MEMOIZEE_OPTIONS
);

// Parse raw content items to react-select options
const parseContentPages = (raw: Partial<ContentPageInfo>[]): PickerItem[] => {
	return raw.map(
		(item: Partial<ContentPageInfo>): PickerItem => ({
			label: item.title || '',
			// We use id here instead of path like for content pages, because nlParentPageId must contain an id since it cannot be changed creating the page
			...parsePickerItem(AvoCoreContentPickerType.NL_CONTENT_PAGE_PARENT_ID, item.id as string),
		})
	);
};
