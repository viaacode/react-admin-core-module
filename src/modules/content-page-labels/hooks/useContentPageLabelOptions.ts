import { capitalize, orderBy, startCase } from 'lodash-es';
import { i18n } from 'next-i18next';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { toastService } from '@shared/services/toast-service';

import { CustomError } from '../../shared/helpers/custom-error';
import { ContentPageLabel } from '../content-page-label.types';
import { ContentPageLabelService } from '../services/content-page-label.service';

import { CheckboxOption } from 'modules/admin/shared/components/CheckboxDropdownModal/CheckboxDropdownModal';

type UseContentPageLabelsTuple = [CheckboxOption[], boolean];

export const useContentPageLabelOptions = (): UseContentPageLabelsTuple => {
	const { t } = useTranslation();
	const [contentPageLabelOptions, setContentPageLabelOptions] = useState<CheckboxOption[]>([]);
	const [isLoading, setIsLoading] = useState<boolean>(false);

	useEffect(() => {
		setIsLoading(true);

		ContentPageLabelService.fetchContentPageLabels(0, 'label', 'asc', {}, 10000)
			.then((reply: [ContentPageLabel[], number]) => {
				setContentPageLabelOptions(
					orderBy(
						reply[0].map(
							(opt): CheckboxOption => ({
								label: `${capitalize(startCase(opt.content_type))}: ${opt.label}`,
								id: String(opt.id),
								checked: false,
							})
						),
						['label']
					)
				);
			})
			.catch((err: any) => {
				console.error(new CustomError('Failed to get user group options', err));
				toastService.notify({
					title:
						i18n?.t(
							'modules/admin/content-page-labels/hooks/use-content-page-label-options___error'
						) || '',
					description:
						i18n?.t(
							'admin/user-groups/hooks/use-user-group-options___het-ophalen-van-de-gebruikergroep-opties-is-mislukt'
						) || '',
				});
			})
			.finally(() => {
				setIsLoading(false);
			});
	}, [setIsLoading, setContentPageLabelOptions, t]);

	return [contentPageLabelOptions, isLoading];
};
