import { capitalize, orderBy, startCase } from 'lodash-es';
import { useEffect, useState } from 'react';
import { ContentPageLabelService } from '~modules/content-page-labels/content-page-label.service';
import { showToast } from '~shared/helpers/show-toast';
import { tText } from '~shared/helpers/translation-functions';

import { CustomError } from '~shared/helpers/custom-error';
import type { ContentPageLabel } from '../content-page-label.types';

import { ToastType } from '~core/config/config.types';
import type { CheckboxOption } from '~shared/components/CheckboxDropdownModal/CheckboxDropdownModal';

type UseContentPageLabelsTuple = [CheckboxOption[], boolean];

export const useContentPageLabelOptions = (): UseContentPageLabelsTuple => {
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
				showToast({
					title: tText(
						'modules/admin/content-page-labels/hooks/use-content-page-label-options___error'
					),
					description: tText(
						'admin/user-groups/hooks/use-user-group-options___het-ophalen-van-de-gebruikergroep-opties-is-mislukt'
					),
					type: ToastType.ERROR,
				});
			})
			.finally(() => {
				setIsLoading(false);
			});
	}, [setIsLoading, setContentPageLabelOptions]);

	return [contentPageLabelOptions, isLoading];
};
