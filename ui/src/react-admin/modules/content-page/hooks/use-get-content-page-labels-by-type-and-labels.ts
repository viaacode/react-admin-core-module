import { useQuery } from '@tanstack/react-query';
import type { Avo } from '@viaa/avo2-types';
import { ContentPageLabelService } from '~modules/content-page-labels/content-page-label.service';
import { QUERY_KEYS } from '~shared/types';

interface ContentPageLabelsRequestArgs {
	selectedContentType: Avo.ContentPage.Type;
	queryLabels: string[];
}

export const useGetContentPageLabelsByTypeAndLabels = (
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
			if (requestArgs.queryLabels.length === 0) {
				return [];
			}
			return ContentPageLabelService.getContentPageLabelsByTypeAndLabels(
				requestArgs.selectedContentType,
				requestArgs.queryLabels
			);
		},
		{
			enabled: true,
			keepPreviousData: true,
			...options,
		}
	);
};
