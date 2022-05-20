import { useEffect, useState } from 'react';
import { Config, ToastType } from '~core/config';
import { UserService } from '~modules/user/user.service';
import { CustomError } from '../helpers/custom-error';

import { useTranslation } from './useTranslation';

type UseBusinessCategoriesTuple = [string[], boolean];

export const useBusinessCategories = (): UseBusinessCategoriesTuple => {
	const { t } = useTranslation();

	const [businessCategories, setBusinessCategories] = useState<string[]>([]);
	const [isLoading, setIsLoading] = useState<boolean>(false);

	useEffect(() => {
		setIsLoading(true);

		UserService.fetchDistinctBusinessCategories()
			.then(setBusinessCategories)
			.catch((err: any) => {
				console.error(
					new CustomError('Failed to get distinct business categories from database', err)
				);

				Config.getConfig().services.toastService.showToast({
					title: Config.getConfig().services.i18n.t('modules/shared/hooks/use-business-category___error'),
					description: Config.getConfig().services.i18n.t(
						'shared/hooks/use-business-category___het-ophalen-van-de-oormerken-is-mislukt'
					),
					type: ToastType.ERROR,
				});
			})
			.finally(() => {
				setIsLoading(false);
			});
	}, [t]);

	return [businessCategories, isLoading];
};
