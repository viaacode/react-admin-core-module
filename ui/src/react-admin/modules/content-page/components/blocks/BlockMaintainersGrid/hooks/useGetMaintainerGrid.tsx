import { useQuery } from '@tanstack/react-query';
import { OrganisationService } from '~shared/services/organization-service/organisation-service';
import { QUERY_KEYS } from '~shared/types';
import type { MaintainerGridOrganisation } from '~shared/types/organisation.types';

export const useGetMaintainerGrid = (limit: number) => {
	return useQuery<MaintainerGridOrganisation[]>([QUERY_KEYS.GET_MAINTAINER_GRID, limit], () => {
		return OrganisationService.getMaintainerGrid(limit);
	});
};
