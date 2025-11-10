import { useQuery } from '@tanstack/react-query';
import { ToastType } from '~core/config/config.types.js';
import { UserService } from '~modules/user/user.service.js';
import { CustomError } from '~shared/helpers/custom-error.js';
import { showToast } from '~shared/helpers/show-toast.js';
import { tText } from '~shared/helpers/translation-functions.js';
import { QUERY_KEYS } from '~shared/types/index.js';

export const useGetIdps = () => {
	return useQuery({
		queryKey: [QUERY_KEYS.GET_IDPS],
		queryFn: async () => {
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
		},
	});
};
