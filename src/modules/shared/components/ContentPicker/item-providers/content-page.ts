import { CustomError } from '../../../helpers/custom-error';
import { PickerSelectItem } from '../../../types/content-picker';
import { parsePickerItem } from '../helpers/parse-picker';

import { ContentPageInfo } from '~modules/collection/content-page/types/content-pages.types';
import { ContentPageService } from '~modules/content-page/services/content-page.service';
import { ContentPickerType } from '~modules/shared/components/ContentPicker/ContentPicker.const';

// Fetch content items from GQL
export const retrieveContentPages = async (
	title: string | null,
	limit = 5
): Promise<PickerSelectItem[]> => {
	try {
		const contentItems: ContentPageInfo[] | null = title
			? await ContentPageService.getPublicContentItemsByTitle(`%${title}%`, limit)
			: await ContentPageService.getPublicContentItems(limit);

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
): Promise<PickerSelectItem[]> => {
	const contentItems: Partial<ContentPageInfo>[] | null = title
		? await ContentPageService.getPublicProjectContentItemsByTitle(`%${title}%`, limit)
		: await ContentPageService.getPublicProjectContentItems(limit);

	return parseContentPages(contentItems || []);
};

// Parse raw content items to react-select options
const parseContentPages = (raw: Partial<ContentPageInfo>[]): PickerSelectItem[] => {
	return raw.map(
		(item: Partial<ContentPageInfo>): PickerSelectItem => ({
			label: item.title || '',
			value: parsePickerItem(ContentPickerType.CONTENT_PAGE, item.path as string), // TODO enforce path in database
		})
	);
};
