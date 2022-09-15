import { useEffect, useState } from 'react';
import { AdminConfigManager } from '~core/config';
import { ToastType } from '~core/config/config.types';
import { CustomError } from '../helpers/custom-error';
import { OrganisationService } from '../services/organization-service/organization-service';

import { useTranslation } from './useTranslation';

export type BasicOrganisation = {
	or_id: string;
	name: string;
};

type UseCompaniesTuple = [BasicOrganisation[], boolean];

export const useCompaniesWithUsers = (): UseCompaniesTuple => {
	const { tHtml } = useTranslation();

	const [companies, setCompanies] = useState<BasicOrganisation[]>([]);
	const [isLoading, setIsLoading] = useState<boolean>(false);

	useEffect(() => {
		setIsLoading(true);

		OrganisationService.fetchOrganisationsWithUsers()
			.then((orgs) => {
				if (orgs) {
					setCompanies(
						orgs.filter((org) => org.name && org.or_id) as BasicOrganisation[]
					);
				}
			})
			.catch((err: any) => {
				console.error(new CustomError('Failed to get organisations from database', err));
				AdminConfigManager.getConfig().services.toastService.showToast({
					title: AdminConfigManager.getConfig().services.i18n.tText(
						'modules/shared/hooks/use-companies___error'
					),
					description: AdminConfigManager.getConfig().services.i18n.tText(
						'settings/components/profile___het-ophalen-van-de-organisaties-is-mislukt'
					),
					type: ToastType.ERROR,
				});
			})
			.finally(() => {
				setIsLoading(false);
			});
	}, [tHtml]);

	return [companies, isLoading];
};
