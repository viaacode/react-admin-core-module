import type {FC} from 'react';
import React from 'react';
import {useMatch} from 'react-router';
import {NavigationBarDetail} from '~modules/navigation/views';
import {AdminConfigManager} from '../../client.mjs';

export const NavigationDetailPage: FC = () => {
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
