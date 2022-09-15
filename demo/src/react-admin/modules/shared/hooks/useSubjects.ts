import { useEffect, useState } from 'react';
import { AdminConfigManager } from '~core/config';
import { ToastType } from '~core/config/config.types';
import { CustomError } from '../helpers/custom-error';

import { SettingsService } from '../services/settings-service/settings.service';
import { useTranslation } from './useTranslation';

type UseSubjectsTuple = [string[], boolean];

export const useSubjects = (): UseSubjectsTuple => {
	const { tText } = useTranslation();

	const [subjects, setSubjects] = useState<string[]>([]);
	const [isLoading, setIsLoading] = useState<boolean>(false);

	useEffect(() => {
		setIsLoading(true);

		SettingsService.fetchSubjects()
			.then((subjects: string[]) => {
				setSubjects(subjects);
			})
			.catch((err: any) => {
				console.error(new CustomError('Failed to get subjects from the database', err));
				AdminConfigManager.getConfig().services.toastService.showToast({
					title: tText('modules/shared/hooks/use-subjects___error'),
					description: tText(
						'settings/components/profile___het-ophalen-van-de-vakken-is-mislukt'
					),
					type: ToastType.ERROR,
				});
			})
			.finally(() => {
				setIsLoading(false);
			});
	}, [tText]);

	return [subjects, isLoading];
};
