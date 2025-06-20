import { useEffect, useState } from 'react';
import { ToastType } from '~core/config/config.types';
import { UserService } from '~modules/user/user.service';
import { showToast } from '~shared/helpers/show-toast';
import { tText } from '~shared/helpers/translation-functions';
import { CustomError } from '../helpers/custom-error';

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
