import { useEffect, useState } from 'react';
import { ToastType } from '~core/config/config.types.js';
import { UserService } from '~modules/user/user.service.js';
import { showToast } from '~shared/helpers/show-toast.js';
import { tText } from '~shared/helpers/translation-functions.js';
import { CustomError } from '../helpers/custom-error.js';

type UseBusinessCategoriesTuple = [string[], boolean];

export const useBusinessCategories = (): UseBusinessCategoriesTuple => {
	const [businessCategories, setBusinessCategories] = useState<string[]>([]);
	const [isLoading, setIsLoading] = useState<boolean>(false);

	useEffect(() => {
		setIsLoading(true);

		UserService.fetchDistinctBusinessCategories()
			.then(setBusinessCategories)
			// biome-ignore lint/suspicious/noExplicitAny: todo
			.catch((err: any) => {
				console.error(
					new CustomError('Failed to get distinct business categories from database', err)
				);

				showToast({
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
	}, []);

	return [businessCategories, isLoading];
};
