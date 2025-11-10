import type { FunctionComponent } from 'react';
import React from 'react';
import { NavigationBarOverview } from '~modules/navigation/views/NavigationBarOverview.js';
import { tText } from '~shared/helpers/translation-functions.js';
import { AdminLayout } from '~shared/layouts/AdminLayout/AdminLayout.js';

export const NavigationOverviewPage: FunctionComponent = () => {
	const renderPageContent = () => {
		return (
			<AdminLayout pageTitle={tText('admin/menu/views/menu-overview___navigatie-overzicht')}>
				<AdminLayout.Content>
					<NavigationBarOverview />
				</AdminLayout.Content>
			</AdminLayout>
		);
	};

	return renderPageContent();
};
