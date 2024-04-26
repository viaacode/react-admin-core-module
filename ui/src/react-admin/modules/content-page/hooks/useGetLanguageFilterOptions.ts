import { useEffect, useState } from 'react';
import { CheckboxOption } from '~shared/components/CheckboxDropdownModal/CheckboxDropdownModal';
import { tText } from '~shared/helpers/translation-functions';

import { TranslationsService } from '../../translations/translations.service';

export const useGetLanguageFilterOptions = (): [CheckboxOption[], boolean] => {
	const [languageOptions, setLanguageOptions] = useState<CheckboxOption[]>([]);
	const [isLoading, setIsLoading] = useState<boolean>(false);

	useEffect(() => {
		setIsLoading(true);

		TranslationsService.fetchLanguages()
			.then((languageInfos) => {
				setLanguageOptions([
					...languageInfos.map(
						(languageInfo): CheckboxOption => ({
							label: tText('{{language}} bestaat', {
								language: languageInfo.languageLabel,
							}),
							id: languageInfo.languageCode,
							checked: false,
						})
					),
					...languageInfos.map(
						(languageInfo): CheckboxOption => ({
							label: tText('{{language}} bestaat niet', {
								language: languageInfo.languageLabel,
							}),
							id: languageInfo.languageCode,
							checked: false,
						})
					),
				]);
			})
			.finally(() => {
				setIsLoading(false);
			});
	}, []);

	return [languageOptions, isLoading];
};
