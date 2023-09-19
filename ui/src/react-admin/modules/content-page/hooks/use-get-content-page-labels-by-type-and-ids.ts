import { useQuery } from '@tanstack/react-query';
import { UseQueryOptions } from '@tanstack/react-query/src/types';
import type { Avo } from '@viaa/avo2-types';
import { ContentPageLabelService } from '~modules/content-page-labels/content-page-label.service';
import { QUERY_KEYS } from '~shared/types';

interface ContentPageLabelsRequestArgs {
	selectedContentType: Avo.ContentPage.Type;
	getSelectedLabelIds: number[] | string[];
}

export const useGetContentPageLabelsByTypeAndIds = (
	requestArgs: ContentPageLabelsRequestArgs,
	options?: UseQueryOptions<any>
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
		options as any
	);
};
