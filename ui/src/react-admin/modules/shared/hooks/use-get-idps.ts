import { CustomError } from '~shared/helpers/custom-error';
import { showToast } from '~shared/helpers/show-toast';
import { tText } from '~shared/helpers/translation-functions';
import { QUERY_KEYS } from '~shared/types';
import { UserService } from '~modules/user/user.service';

import { useQuery } from '@tanstack/react-query';
import { ToastType } from '~core/config';

export const useGetIdps = () => {
	return useQuery([QUERY_KEYS.GET_IDPS], async () => {
		try {
			return UserService.fetchIdps();
		} catch (err) {
			console.error(new CustomError('Failed to fetch idps from the server', err));
			showToast({
				title: tText('modules/shared/hooks/use-idps___error'),
				description: tText('shared/hooks/use-idps___ophalen-van-de-idps-is-mislukt'),
				type: ToastType.ERROR,
			});
		}
	});
};
