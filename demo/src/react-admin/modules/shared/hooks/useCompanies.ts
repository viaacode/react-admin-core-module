import { useEffect, useState } from 'react';
import { Config, ToastType } from '~core/config';
import { CustomError } from '../helpers/custom-error';
import { OrganisationService } from '../services/organization-service/organization-service';

import { useTranslation } from './useTranslation';

export type BasicOrganisation = {
	or_id: string;
	name: string;
};

type UseCompaniesTuple = [BasicOrganisation[], boolean];

export const useCompaniesWithUsers = (): UseCompaniesTuple => {
	const { t } = useTranslation();

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
				Config.getConfig().services.toastService.showToast({
					title: Config.getConfig().services.i18n.t('modules/shared/hooks/use-companies___error'),
					description: Config.getConfig().services.i18n.t(
						'settings/components/profile___het-ophalen-van-de-organisaties-is-mislukt'
					),
					type: ToastType.ERROR,
				});
			})
			.finally(() => {
				setIsLoading(false);
			});
	}, [t]);

	return [companies, isLoading];
};
