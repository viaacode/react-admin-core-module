import { useEffect, useState } from 'react';
import { Config, ToastType } from '~core/config';
import { CustomError } from '../helpers/custom-error';

import { SettingsService } from '../services/settings-service/settings.service';
import { useTranslation } from './useTranslation';

type UseEducationLevelsTuple = [string[], boolean];

export const useEducationLevels = (): UseEducationLevelsTuple => {
	const { t } = useTranslation();

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
				Config.getConfig().services.toastService.showToast({
					title: Config.getConfig().services.i18n.t('Error'),
					description: Config.getConfig().services.i18n.t(
						'shared/hooks/use-education-levels___ophalen-van-de-opleidingsniveaus-is-mislukt'
					),
					type: ToastType.ERROR,
				});
			})
			.finally(() => {
				setIsLoading(false);
			});
	}, [t]);

	return [educationLevels, isLoading];
};
