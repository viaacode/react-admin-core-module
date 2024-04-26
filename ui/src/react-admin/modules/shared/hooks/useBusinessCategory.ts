import { useEffect, useState } from 'react';
import { AdminConfigManager } from '~core/config';
import { ToastType } from '~core/config/config.types';
import { UserService } from '~modules/user/user.service';
import { tText } from '~shared/helpers/translation-functions';
import { CustomError } from '../helpers/custom-error';

import { useTranslation } from './useTranslation';

type UseBusinessCategoriesTuple = [string[], boolean];

export const useBusinessCategories = (): UseBusinessCategoriesTuple => {
	const { tHtml } = useTranslation();

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

				AdminConfigManager.getConfig().services.toastService.showToast({
					title: tText('modules/shared/hooks/use-business-category___error'),
					description: tText(
						'shared/hooks/use-business-category___het-ophalen-van-de-oormerken-is-mislukt'
					),
					type: ToastType.ERROR,
				});
			})
			.finally(() => {
				setIsLoading(false);
			});
	}, [tHtml]);

	return [businessCategories, isLoading];
};
