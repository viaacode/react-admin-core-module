import { capitalize, orderBy, startCase } from 'lodash-es';
import { useEffect, useState } from 'react';

import { CustomError } from '../../shared/helpers/custom-error';
import { ContentPageLabel } from '../content-page-label.types';
import { ContentPageLabelService } from '../services/content-page-label.service';

import { Config, ToastType } from 'core/config';
import { CheckboxOption } from 'modules/shared/components/CheckboxDropdownModal/CheckboxDropdownModal';
import { useTranslation } from 'modules/shared/hooks/useTranslation';

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
				Config.getConfig().services.toastService.showToast({
					title: Config.getConfig().services.i18n.t(
						'modules/admin/content-page-labels/hooks/use-content-page-label-options___error'
					),
					description: Config.getConfig().services.i18n.t(
						'admin/user-groups/hooks/use-user-group-options___het-ophalen-van-de-gebruikergroep-opties-is-mislukt'
					),
					type: ToastType.ERROR,
				});
			})
			.finally(() => {
				setIsLoading(false);
			});
	}, [setIsLoading, setContentPageLabelOptions, t]);

	return [contentPageLabelOptions, isLoading];
};
