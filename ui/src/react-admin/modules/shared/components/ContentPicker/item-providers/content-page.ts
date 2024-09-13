import { CustomError } from '~shared/helpers/custom-error';
import type { PickerItem } from '~shared/types/content-picker';
import { parsePickerItem } from '../helpers/parse-picker';

import { ContentPageService } from '~modules/content-page/services/content-page.service';
import type { ContentPageInfo } from '~modules/content-page/types/content-pages.types';

// Fetch content items from GQL
export const retrieveContentPages = async (
	title: string | null,
	limit = 5
): Promise<PickerItem[]> => {
	try {
		const contentItems: ContentPageInfo[] | null = title
			? await ContentPageService.getPublicContentItemsByTitle(`%${title}%`, limit)
			: await ContentPageService.getPublicContentItemsByTitle(undefined, limit);

		return parseContentPages(contentItems || []);
	} catch (err) {
		throw new CustomError('Failed to fetch content pages for content picker', err, {
			title,
			limit,
		});
	}
};

// Fetch content items of type PROJECT from GQL
export const retrieveProjectContentPages = async (
	title: string | null,
	limit = 5
): Promise<PickerItem[]> => {
	const contentItems: Partial<ContentPageInfo>[] | null = title
		? await ContentPageService.getPublicProjectContentItemsByTitle(`%${title}%`, limit)
		: await ContentPageService.getPublicProjectContentItemsByTitle(undefined, limit);

	return parseContentPages(contentItems || []);
};

// Parse raw content items to react-select options
const parseContentPages = (raw: Partial<ContentPageInfo>[]): PickerItem[] => {
	return raw.map(
		(item: Partial<ContentPageInfo>): PickerItem => ({
			label: item.title || '',
			...parsePickerItem('CONTENT_PAGE', item.path as string), // TODO enforce path in database
		})
	);
};
