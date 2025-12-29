import type { FC } from 'react';
import React from 'react';
import { useMatch } from 'react-router';
import { AdminConfigManager } from '~core/config/config.class';
import { NavigationBarDetail } from '~modules/navigation/views/NavigationBarDetail';

export const NavigationBarDetailPage: FC = () => {
	const match = useMatch<'navigationBarId', string>(
		AdminConfigManager.getAdminRoute('ADMIN_NAVIGATION_DETAIL')
	);
	const navigationBarId = match?.params.navigationBarId;

	if (!navigationBarId) {
		return null;
	}
	return (
		<NavigationBarDetail navigationBarId={navigationBarId} onGoBack={() => window.history.back()} />
	);
};
