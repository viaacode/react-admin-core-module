import { useQuery } from '@tanstack/react-query';
import type { Avo } from '@viaa/avo2-types';
import { ContentPageLabelService } from '~modules/content-page-labels/content-page-label.service';
import { QUERY_KEYS } from '~shared/types';

interface ContentPageLabelsRequestArgs {
	selectedContentType: Avo.ContentPage.Type;
	getSelectedLabelIds: number[] | string[];
}

export const useGetContentPageLabelsByTypeAndIds = (
	requestArgs: ContentPageLabelsRequestArgs,
	options: { enabled?: boolean; keepPreviousData?: boolean } = {
		enabled: true,
		keepPreviousData: true,
	}
) => {
	return useQuery(
		[QUERY_KEYS.GET_PROFILES, requestArgs],
		(props) => {
			const requestArgs = props.queryKey[1] as ContentPageLabelsRequestArgs;
			return ContentPageLabelService.getContentPageLabelsByTypeAndIds(
				requestArgs.selectedContentType,
				requestArgs.getSelectedLabelIds
			);
		},
		{
			enabled: true,
			keepPreviousData: true,
			...options,
		}
	);
};
