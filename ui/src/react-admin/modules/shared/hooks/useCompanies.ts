import { useEffect, useState } from "react";
import { ToastType } from "~core/config/config.types";
import { showToast } from "~shared/helpers/show-toast";
import { tText } from "~shared/helpers/translation-functions";
import type { BasicOrganisation } from "~shared/services/organization-service/organisation-service";
import { OrganisationService } from "~shared/services/organization-service/organisation-service";
import { CustomError } from "../helpers/custom-error";

type UseCompaniesTuple = [BasicOrganisation[], boolean];

export const useCompaniesWithUsers = (): UseCompaniesTuple => {
	const [companies, setCompanies] = useState<BasicOrganisation[]>([]);
	const [isLoading, setIsLoading] = useState<boolean>(false);

	useEffect(() => {
		setIsLoading(true);

		OrganisationService.fetchOrganisationsWithUsers()
			.then((orgs: Partial<BasicOrganisation>[]) => {
				if (orgs) {
					setCompanies(
						orgs.filter((org) => org.name && org.or_id) as BasicOrganisation[],
					);
				}
			})
			// biome-ignore lint/suspicious/noExplicitAny: todo
			.catch((err: any) => {
				console.error(
					new CustomError("Failed to get organisations from database", err),
				);
				showToast({
					title: tText("modules/shared/hooks/use-companies___error"),
					description: tText(
						"settings/components/profile___het-ophalen-van-de-organisaties-is-mislukt",
					),
					type: ToastType.ERROR,
				});
			})
			.finally(() => {
				setIsLoading(false);
			});
	}, []);

	return [companies, isLoading];
};
