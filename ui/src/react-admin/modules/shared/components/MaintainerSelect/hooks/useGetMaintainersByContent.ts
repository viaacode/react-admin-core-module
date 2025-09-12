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

			if (
				contentItemType !== ContentPickerType.ITEM &&
				contentItemType !== ContentPickerType.COLLECTION &&
				contentItemType !== ContentPickerType.ASSIGNMENT
			) {
				return [];
			}

			return OrganisationService.getMaintainersByContentItem(contentItemType, contentItemId);
		},
		{
			enabled: true,
			keepPreviousData: true,
			...options,
		}
	);
};
