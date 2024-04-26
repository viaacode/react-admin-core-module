import { useEffect, useState } from 'react';
import { AdminConfigManager } from '~core/config';
import { ToastType } from '~core/config/config.types';
import { tText } from '~shared/helpers/translation-functions';
import { CustomError } from '../helpers/custom-error';

import { SettingsService } from '../services/settings-service/settings.service';
import { useTranslation } from './useTranslation';

type UseEducationLevelsTuple = [string[], boolean];

export const useEducationLevels = (): UseEducationLevelsTuple => {
	const { tHtml } = useTranslation();

	const [educationLevels, setEducationLevels] = useState<string[]>([]);
	const [isLoading, setIsLoading] = useState<boolean>(false);

	useEffect(() => {
		setIsLoading(true);

		SettingsService.fetchEducationLevels()
			.then((educationLevels: string[]) => {
				setEducationLevels(educationLevels);
			})
			.catch((err: any) => {
				console.error(
					new CustomError('Failed to get educationLevels from the database', err)
				);
				AdminConfigManager.getConfig().services.toastService.showToast({
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
	}, [tHtml]);

	return [educationLevels, isLoading];
};
