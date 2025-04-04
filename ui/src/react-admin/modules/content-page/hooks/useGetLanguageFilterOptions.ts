import { useEffect, useState } from 'react';
import { NOT_TRANSLATION_PREFIX } from '~modules/content-page/types/content-pages.types';
import { useGetAllLanguages } from '~modules/translations/hooks/use-get-all-languages';
import type { CheckboxOption } from '~shared/components/CheckboxDropdownModal/CheckboxDropdownModal';
import { GET_LANGUAGE_NAMES } from '~shared/consts/language-names';
import { tText } from '~shared/helpers/translation-functions';

export const useGetLanguageFilterOptions = (): [CheckboxOption[], boolean] => {
	const [languageOptions, setLanguageOptions] = useState<CheckboxOption[]>([]);
	const [isLoading, setIsLoading] = useState<boolean>(false);

	const { data: allLanguages, isLoading: isLoadingAllLanguages } = useGetAllLanguages();

	useEffect(() => {
		if (!allLanguages) {
			return;
		}

		setLanguageOptions([
			...allLanguages.map((languageInfo): CheckboxOption => {
				const language = GET_LANGUAGE_NAMES()[languageInfo.languageCode];
				return {
					label: tText(
						'modules/content-page/hooks/use-get-language-filter-options___language-bestaat',
						{
							language,
						}
					),
					id: languageInfo.languageCode,
					checked: false,
				};
			}),
			...allLanguages.map((languageInfo): CheckboxOption => {
				const language = GET_LANGUAGE_NAMES()[languageInfo.languageCode];
				return {
					label: tText(
						'modules/content-page/hooks/use-get-language-filter-options___language-bestaat-niet',
						{
							language,
						}
					),
					id: NOT_TRANSLATION_PREFIX + languageInfo.languageCode,
					checked: false,
				};
			}),
		]);
		setIsLoading(false);
	}, [allLanguages]);

	return [languageOptions, isLoadingAllLanguages || isLoading];
};
