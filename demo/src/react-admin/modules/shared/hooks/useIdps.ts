import { useEffect, useState } from 'react';
import { AdminConfigManager } from '~core/config';
import { ToastType } from '~core/config/config.types';
import { UserService } from '~modules/user/user.service';
import { CustomError } from '../helpers/custom-error';

import { useTranslation } from './useTranslation';

type UseIdpsTuple = [string[], boolean];

export const useIdps = (): UseIdpsTuple => {
	const { t } = useTranslation();

	const [idps, setIdps] = useState<string[]>([]);
	const [isLoading, setIsLoading] = useState<boolean>(false);

	useEffect(() => {
		setIsLoading(true);

		UserService.fetchIdps()
			.then((idps: string[]) => {
				setIdps(idps);
			})
			.catch((err: any) => {
				console.error(new CustomError('Failed to get idps from the database', err));
				AdminConfigManager.getConfig().services.toastService.showToast({
					title: AdminConfigManager.getConfig().services.i18n.tText(
						'modules/shared/hooks/use-idps___error'
					),
					description: AdminConfigManager.getConfig().services.i18n.tText(
						'shared/hooks/use-idps___ophalen-van-de-idps-is-mislukt'
					),
					type: ToastType.ERROR,
				});
			})
			.finally(() => {
				setIsLoading(false);
			});
	}, [t]);

	return [idps, isLoading];
};
