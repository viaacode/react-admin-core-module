import { useEffect, useState } from 'react';
import { ToastType } from '~core/config/config.types.js';
import { showToast } from '~shared/helpers/show-toast.js';
import { tText } from '~shared/helpers/translation-functions.js';
import { CustomError } from '../helpers/custom-error.js';

import { SettingsService } from '../services/settings-service/settings.service.js';

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
			// biome-ignore lint/suspicious/noExplicitAny: todo
			.catch((err: any) => {
				console.error(new CustomError('Failed to get subjects from the database', err));
				showToast({
					title: tText('modules/shared/hooks/use-subjects___error'),
					description: tText('settings/components/profile___het-ophalen-van-de-vakken-is-mislukt'),
					type: ToastType.ERROR,
				});
			})
			.finally(() => {
				setIsLoading(false);
			});
	}, []);

	return [subjects, isLoading];
};
