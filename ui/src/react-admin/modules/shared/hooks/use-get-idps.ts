import { CustomError } from '~modules/shared/helpers/custom-error';
import { USER_QUERY_KEYS } from '~modules/user/user.consts';
import { UserService } from '~modules/user/user.service';

import { useQuery } from '@tanstack/react-query';
import { AdminConfigManager, ToastType } from '~core/config';

export const useGetIdps = () => {
	return useQuery([USER_QUERY_KEYS.getIdps], async () => {
		try {
			return UserService.fetchIdps();
		} catch (err) {
			console.error(new CustomError('Failed to fetch idps from the server', err));
			AdminConfigManager.getConfig().services.toastService.showToast({
				title: AdminConfigManager.getConfig().services.i18n.tText(
					'modules/shared/hooks/use-idps___error'
				),
				description: AdminConfigManager.getConfig().services.i18n.tText(
					'shared/hooks/use-idps___ophalen-van-de-idps-is-mislukt'
				),
				type: ToastType.ERROR,
			});
		}
	});
};
