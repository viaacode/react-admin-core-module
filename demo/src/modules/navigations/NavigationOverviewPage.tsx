import React, { FunctionComponent } from 'react';

import { useTranslation } from '~modules/shared/hooks/useTranslation';

import { AdminLayout } from '~modules/shared/layouts';
import { NavigationOverview } from '~modules/navigation/views';

const NavigationOverviewPage: FunctionComponent = () => {
	const { t, tText } = useTranslation();

	const renderPageContent = () => {
		return (
			<AdminLayout pagetitle={tText('admin/menu/views/menu-overview___navigatie-overzicht')}>
				<AdminLayout.Content>
					<NavigationOverview />
				</AdminLayout.Content>
			</AdminLayout>
		);
	};

	return renderPageContent();
};

export default NavigationOverviewPage;
