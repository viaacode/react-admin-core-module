import { useEffect, useState } from 'react';
import { ToastType } from '~core/config/config.types';
import { showToast } from '~shared/helpers/show-toast';
import { tText } from '~shared/helpers/translation-functions';
import { CustomError } from '../helpers/custom-error';

import { SettingsService } from '../services/settings-service/settings.service';

type UseSubjectsTuple = [string[], boolean];

export const useSubjects = (): UseSubjectsTuple => {
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
				showToast({
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
	}, []);

	return [subjects, isLoading];
};
