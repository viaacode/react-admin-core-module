import { useQuery } from '@tanstack/react-query';
import { AvoCoreContentPickerType } from '@viaa/avo2-types';
import { OrganisationService } from '~shared/services/organization-service/organisation-service';
import { QUERY_KEYS } from '~shared/types';

export const useGetMaintainersByContent = (
	contentItemType: AvoCoreContentPickerType | undefined | null,
	contentItemId: string | undefined,
	options: { enabled?: boolean } = {
		enabled: true,
	}
) => {
	return useQuery<{ id: string; name: string; logo: string | null; website: string | null }[]>({
		queryKey: [QUERY_KEYS.GET_MAINTAINERS_BY_CONTENT, contentItemType, contentItemId],
		queryFn: () => {
			if (!contentItemType || !contentItemId) {
				return [];
			}

			const usableContentType =
				contentItemType === AvoCoreContentPickerType.ITEM_WITH_CUE_POINTS
					? AvoCoreContentPickerType.ITEM
					: contentItemType;

			if (
				usableContentType !== AvoCoreContentPickerType.ITEM &&
				usableContentType !== AvoCoreContentPickerType.COLLECTION &&
				usableContentType !== AvoCoreContentPickerType.ASSIGNMENT
			) {
				return [];
			}

			return OrganisationService.getMaintainersByContentItem(usableContentType, contentItemId);
		},
		enabled: true,
		...options,
	});
};
