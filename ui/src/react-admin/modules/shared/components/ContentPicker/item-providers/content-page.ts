import { AvoCoreContentPickerType } from '@viaa/avo2-types';
// TODO remove memoize in favor of react-query caching
import memoize from 'memoizee';
import { ContentPageService } from '~modules/content-page/services/content-page.service';
import type { ContentPageInfo } from '~modules/content-page/types/content-pages.types';
import { MEMOIZEE_OPTIONS } from '~shared/consts/memoizee-options';
import { CustomError } from '~shared/helpers/custom-error';
import type { PickerItem } from '~shared/types/content-picker';
import { parsePickerItem } from '../helpers/parse-picker';

// Fetch content items from GQL
export const retrieveContentPages = memoize(
	async (
		title: string | null,
		limit = 5,
		type: AvoCoreContentPickerType
	): Promise<PickerItem[]> => {
		const pageType = mapContentPickerTypeToPageType(type);
		try {
			const contentItems: ContentPageInfo[] | null = title
				? await ContentPageService.getPublicContentItemsByTitle(`%${title}%`, pageType, limit)
				: await ContentPageService.getPublicContentItemsByTitle(undefined, pageType, limit);

			return parseContentPages(contentItems || []);
		} catch (err) {
			throw new CustomError('Failed to fetch content pages for content picker', err, {
				title,
				limit,
			});
		}
	},
	MEMOIZEE_OPTIONS
);

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
			...parsePickerItem(AvoCoreContentPickerType.CONTENT_PAGE, item.path as string), // TODO enforce path in database
		})
	);
};

const mapContentPickerTypeToPageType = (
	pickerType: AvoCoreContentPickerType
): string | undefined => {
	switch (pickerType) {
		case AvoCoreContentPickerType.CONTENT_PAGE_NEWS_ITEM:
			return 'NIEUWS_ITEM';
		case AvoCoreContentPickerType.CONTENT_PAGE_PAGE:
			return 'PAGINA';
		case AvoCoreContentPickerType.CONTENT_PAGE_PROJECT:
			return 'PROJECT';
		case AvoCoreContentPickerType.CONTENT_PAGE_OVERVIEW:
			return 'OVERZICHT';
		case AvoCoreContentPickerType.CONTENT_PAGE_DOMAIN_DETAIL:
			return 'DOMEIN_DETAIL';
		case AvoCoreContentPickerType.CONTENT_PAGE_EVENT_DETAIL:
			return 'EVENT_DETAIL';
		case AvoCoreContentPickerType.CONTENT_PAGE_SCREENCAST:
			return 'SCREENCAST';

		default:
			return undefined;
	}
};
