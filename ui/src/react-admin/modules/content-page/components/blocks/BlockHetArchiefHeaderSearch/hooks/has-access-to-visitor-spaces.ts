import { keepPreviousData, useQuery, type UseQueryResult } from '@tanstack/react-query';
import { getCommonUser } from '~core/config/config.selectors.ts';
import { QUERY_KEYS } from '~shared/types';
import { VisitRequestService } from '../services/visit-request.service';

async function hasAccessToVisitorSpaces(): Promise<boolean> {
	const commonUser = getCommonUser();

	if (!commonUser?.userGroup?.id) {
		return false;
	}

	return VisitRequestService.hasAccessToVisitorSpaces();
}

export function useHasAccessToVisitorSpaces(enabled?: boolean): UseQueryResult<boolean> {
	return useQuery({
		queryKey: [QUERY_KEYS.GET_VISIT_REQUESTS],
		queryFn: () => hasAccessToVisitorSpaces(),
		placeholderData: keepPreviousData,
		enabled,
	});
}
