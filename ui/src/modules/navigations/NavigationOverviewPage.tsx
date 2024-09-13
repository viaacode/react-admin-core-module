import type { FunctionComponent } from 'react';
import React from 'react';

import { tText } from '~shared/helpers/translation-functions';

import { AdminLayout } from '~shared/layouts';
import { NavigationBarOverview } from '~modules/navigation/views';

const NavigationOverviewPage: FunctionComponent = () => {
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

export default NavigationOverviewPage;
