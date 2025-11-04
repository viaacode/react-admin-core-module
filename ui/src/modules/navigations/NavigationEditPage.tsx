import type { FC } from 'react';
import React from 'react';
import { useMatch } from 'react-router';
import { AdminConfigManager } from '~core/config';
import { NavigationItemEdit } from '~modules/navigation/views';

export const NavigationEditPage: FC = () => {
	const match = useMatch<'navigationItemId' | 'navigationBarId', string>(
		AdminConfigManager.getConfig().routes.ADMIN_NAVIGATION_ITEM_EDIT
	);
	const navigationBarId = match?.params.navigationBarId;
	const navigationItemId = match?.params.navigationItemId;

	if (!navigationBarId) {
		return null;
	}
	return (
		<NavigationItemEdit
			navigationBarId={navigationBarId}
			navigationItemId={navigationItemId}
			onGoBack={() => window.history.back()}
		/>
	);
};
