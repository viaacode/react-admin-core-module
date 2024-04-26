import React, { FunctionComponent } from 'react';

import { tText } from '~shared/helpers/translation-functions';

import { AdminLayout } from '~shared/layouts';
import { NavigationOverview } from '~modules/navigation/views';

const NavigationOverviewPage: FunctionComponent = () => {
	const renderPageContent = () => {
		return (
			<AdminLayout pageTitle={tText('admin/menu/views/menu-overview___navigatie-overzicht')}>
				<AdminLayout.Content>
					<NavigationOverview />
				</AdminLayout.Content>
			</AdminLayout>
		);
	};

	return renderPageContent();
};

export default NavigationOverviewPage;
