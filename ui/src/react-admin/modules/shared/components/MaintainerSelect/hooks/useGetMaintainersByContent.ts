import { useQuery } from '@tanstack/react-query';
import { ContentPickerType } from '@viaa/avo2-types';
import { OrganisationService } from '~shared/services/organization-service/organisation-service';
import { QUERY_KEYS } from '~shared/types';

export const useGetMaintainersByContent = (
	contentItemType:
		| ContentPickerType.ITEM
		| ContentPickerType.COLLECTION
		| ContentPickerType.BUNDLE
		| ContentPickerType.ASSIGNMENT
		| undefined,
	contentItemId: string | undefined,
	options: { enabled?: boolean } = {}
) => {
	return useQuery<{ id: string; name: string; logo: string | null; website: string | null }[]>(
		[QUERY_KEYS.GET_MAINTAINERS_BY_CONTENT, contentItemType, contentItemType],
		() => {
			if (
				!contentItemType ||
				!contentItemId ||
				contentItemType === ContentPickerType.BUNDLE
			) {
				return [];
			}
			return OrganisationService.getMaintainersByContentItem(contentItemType, contentItemId);
		},
		{ enabled: true, ...options }
	);
};
