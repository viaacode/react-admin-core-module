import { TagInfo } from '@viaa/avo2-components';
import { useEffect, useState } from 'react';

import { useTranslation } from '~modules/shared/hooks/useTranslation';

import { Config, ToastType } from '../../../core/config';
import { CheckboxOption } from '../../shared/components/CheckboxDropdownModal/CheckboxDropdownModal';
import { CustomError } from '../../shared/helpers/custom-error';
import { GET_SPECIAL_USER_GROUPS } from '../../user-group/user-group.const';
import { UserGroupService } from '../../user-group/user-group.service';

type UseUserGroupsTuple = [TagInfo[] | CheckboxOption[], boolean];

export const useUserGroupOptions = (
	type: 'CheckboxOption' | 'TagInfo',
	includeSpecialGroups: boolean
): UseUserGroupsTuple => {
	const { t } = useTranslation();

	const [userGroupOptions, setUserGroupOptions] = useState<TagInfo[] | CheckboxOption[]>([]);
	const [isLoading, setIsLoading] = useState<boolean>(false);

	useEffect(() => {
		setIsLoading(true);

		UserGroupService.fetchAllUserGroups()
			.then((options) => {
				const allOptions = [
					...(includeSpecialGroups ? GET_SPECIAL_USER_GROUPS() : []),
					...options,
				];
				if (type === 'TagInfo') {
					setUserGroupOptions(
						allOptions.map(
							(opt): TagInfo => ({
								label: opt.label as string,
								value: opt.id as number,
							})
						)
					);
				} else {
					setUserGroupOptions(
						allOptions.map(
							(opt): CheckboxOption => ({
								label: opt.label as string,
								id: String(opt.id),
								checked: false,
							})
						)
					);
				}
			})
			.catch((err) => {
				console.error(new CustomError('Failed to get user group options', err));

				Config.getConfig().services.toastService.showToast({
					title: Config.getConfig().services.i18n.t(
						'modules/admin/content-page/hooks/use-user-group-options___error'
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
	}, [setIsLoading, setUserGroupOptions, includeSpecialGroups, type, t]);

	return [userGroupOptions, isLoading];
};
