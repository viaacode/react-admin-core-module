import { useQuery } from '@tanstack/react-query';
import { ContentPickerType } from '@viaa/avo2-types';
import { OrganisationService } from '~shared/services/organization-service/organisation-service';
import { QUERY_KEYS } from '~shared/types';

export const useGetMaintainersByContent = (
	contentItemType: ContentPickerType | undefined | null,
	contentItemId: string | undefined,
	options: { enabled?: boolean; keepPreviousData?: boolean } = {
		enabled: true,
		keepPreviousData: true,
	}
) => {
	return useQuery<{ id: string; name: string; logo: string | null; website: string | null }[]>(
		[QUERY_KEYS.GET_MAINTAINERS_BY_CONTENT, contentItemType, contentItemId],
		() => {
			if (!contentItemType || !contentItemId) {
				return [];
			}

			const usableContentType =
				contentItemType === ContentPickerType.ITEM_WITH_CUE_POINTS
					? ContentPickerType.ITEM
					: contentItemType;

			if (
				usableContentType !== ContentPickerType.ITEM &&
				usableContentType !== ContentPickerType.COLLECTION &&
				usableContentType !== ContentPickerType.ASSIGNMENT
			) {
				return [];
			}

			return OrganisationService.getMaintainersByContentItem(usableContentType, contentItemId);
		},
		{
			enabled: true,
			keepPreviousData: true,
			...options,
		}
	);
};
