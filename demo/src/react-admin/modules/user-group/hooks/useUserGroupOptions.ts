import { useEffect, useState } from 'react';

import { TagInfo } from '@viaa/avo2-components';

import { CheckboxOption } from '~modules/shared/components/CheckboxDropdownModal/CheckboxDropdownModal';
import { CustomError } from '~modules/shared/helpers/custom-error';
import { AdminConfigManager } from '~core/config';
import { ToastType } from '~core/config/config.types';
import { GET_SPECIAL_USER_GROUPS } from '../const/user-group.const';
import { UserGroupService } from '../services/user-group.service';
import { useTranslation } from '~modules/shared/hooks/useTranslation';

type UseUserGroupsTuple = [TagInfo[] | CheckboxOption[], boolean];

export const useUserGroupOptions = (
	type: 'CheckboxOption' | 'TagInfo',
	includeSpecialGroups: boolean
): UseUserGroupsTuple => {
	const { tHtml } = useTranslation();
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
			.catch((err: any) => {
				console.error(new CustomError('Failed to get user group options', err));
				AdminConfigManager.getConfig().services.toastService.showToast({
					title: AdminConfigManager.getConfig().services.i18n.tText(
						'modules/user-group/hooks/use-user-group-options___error'
					),
					description: AdminConfigManager.getConfig().services.i18n.tText(
						'admin/user-groups/hooks/use-user-group-options___het-ophalen-van-de-gebruikergroep-opties-is-mislukt'
					),
					type: ToastType.ERROR,
				});
			})
			.finally(() => {
				setIsLoading(false);
			});
	}, [setIsLoading, setUserGroupOptions, includeSpecialGroups, type, tHtml]);

	return [userGroupOptions, isLoading];
};
