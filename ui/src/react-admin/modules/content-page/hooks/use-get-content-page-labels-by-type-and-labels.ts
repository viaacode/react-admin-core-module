import { useQuery } from '@tanstack/react-query';
import type { Avo } from '@viaa/avo2-types';
import { ContentPageLabelService } from '~modules/content-page-labels/content-page-label.service';
import { QUERY_KEYS } from '~shared/types/index';

interface ContentPageLabelsRequestArgs {
	selectedContentType: Avo.ContentPage.Type;
	queryLabels: string[];
}

export const useGetContentPageLabelsByTypeAndLabels = (
	requestArgs: ContentPageLabelsRequestArgs,
	options: { enabled?: boolean } = {
		enabled: true,
	}
) => {
	return useQuery({
		queryKey: [QUERY_KEYS.GET_PROFILES, requestArgs],
		queryFn: (props) => {
			const requestArgs = props.queryKey[1] as ContentPageLabelsRequestArgs;
			if (requestArgs.queryLabels.length === 0) {
				return [];
			}
			return ContentPageLabelService.getContentPageLabelsByTypeAndLabels(
				requestArgs.selectedContentType,
				requestArgs.queryLabels
			);
		},
		enabled: true,
		...options,
	});
};
