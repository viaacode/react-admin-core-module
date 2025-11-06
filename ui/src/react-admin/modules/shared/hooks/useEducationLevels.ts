import { useEffect, useState } from 'react';
import { ToastType } from '~core/config/config.types.js';
import { showToast } from '~shared/helpers/show-toast.js';
import { tText } from '~shared/helpers/translation-functions.js';
import { CustomError } from '../helpers/custom-error.js';

import { SettingsService } from '../services/settings-service/settings.service.js';

type UseEducationLevelsTuple = [string[], boolean];

export const useEducationLevels = (): UseEducationLevelsTuple => {
	const [educationLevels, setEducationLevels] = useState<string[]>([]);
	const [isLoading, setIsLoading] = useState<boolean>(false);

	useEffect(() => {
		setIsLoading(true);

		SettingsService.fetchEducationLevels()
			.then((educationLevels: string[]) => {
				setEducationLevels(educationLevels);
			})
			// biome-ignore lint/suspicious/noExplicitAny: todo
			.catch((err: any) => {
				console.error(new CustomError('Failed to get educationLevels from the database', err));
				showToast({
					title: tText('modules/shared/hooks/use-education-levels___error'),
					description: tText(
						'shared/hooks/use-education-levels___ophalen-van-de-opleidingsniveaus-is-mislukt'
					),
					type: ToastType.ERROR,
				});
			})
			.finally(() => {
				setIsLoading(false);
			});
	}, []);

	return [educationLevels, isLoading];
};
